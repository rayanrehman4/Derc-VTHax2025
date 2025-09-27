import { forecastWithCI } from '../../lib/holtwinters';
import { requiredIncome, generateRatePath } from '../../lib/mortgage';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Set cache headers
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  
  try {
    const {
      region,
      state,
      metric = 'required_income',
      horizon = '12',
      source = 'mock',
      // Assumption overrides
      rateEndPct = '7.0',
      downPct = '20',
      dti = '0.30',
      taxPct = '1.1',
      insuranceAnnual = '1200'
    } = req.query;

    const horizonNum = parseInt(horizon);
    const assumptions = {
      rateEndPct: parseFloat(rateEndPct),
      downPct: parseFloat(downPct),
      dti: parseFloat(dti),
      taxPct: parseFloat(taxPct),
      insuranceAnnual: parseFloat(insuranceAnnual)
    };

    // Handle Redfin source (stub for now)
    if (source === 'redfin') {
      console.warn('Redfin API not implemented yet, falling back to mock data');
      // For now, fall through to mock handler but mark the response
    }

    // Load data
    const housingPath = path.join(process.cwd(), 'public/data/housing.json');
    const macroPath = path.join(process.cwd(), 'public/data/macro.json');
    
    const housingData = JSON.parse(fs.readFileSync(housingPath, 'utf8'));
    const macroData = JSON.parse(fs.readFileSync(macroPath, 'utf8'));

    let targetCity = null;
    let targetState = null;

    // Find target region
    if (region) {
      targetCity = housingData.cities.find(city => 
        `${city.name}, ${city.state}`.toLowerCase() === region.toLowerCase() ||
        city.name.toLowerCase() === region.toLowerCase()
      );
      
      if (!targetCity) {
        return res.status(404).json({ error: 'City not found' });
      }
    } else if (state) {
      // For state-level, we'll use the first major city in that state as proxy
      targetCity = housingData.cities.find(city => 
        city.state.toLowerCase() === state.toLowerCase()
      );
      
      if (!targetCity) {
        return res.status(404).json({ error: 'State not found' });
      }
    } else {
      return res.status(400).json({ error: 'Either region or state parameter required' });
    }

    // Prepare time series data
    const history = targetCity.history || [];
    if (history.length === 0) {
      return res.status(400).json({ error: 'No historical data available for this region' });
    }

    // Convert annual data to monthly (simple interpolation)
    const monthlyHistory = [];
    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i];
      const next = history[i + 1];
      const monthlyGrowth = (next.required_income - current.required_income) / 12;
      
      for (let month = 0; month < 12; month++) {
        monthlyHistory.push({
          date: `${current.year}-${String(month + 1).padStart(2, '0')}-01`,
          price: current.median_price || targetCity.median_price,
          required_income: current.required_income + (monthlyGrowth * month)
        });
      }
    }
    
    // Add the last year
    const lastYear = history[history.length - 1];
    for (let month = 0; month < 12; month++) {
      monthlyHistory.push({
        date: `${lastYear.year}-${String(month + 1).padStart(2, '0')}-01`,
        price: lastYear.median_price || targetCity.median_price,
        required_income: lastYear.required_income
      });
    }

    // Extract series based on metric
    let series;
    if (metric === 'price') {
      series = monthlyHistory.map(point => point.price);
    } else {
      series = monthlyHistory.map(point => point.required_income);
    }

    // Generate forecast
    const forecastResult = forecastWithCI(series, {
      horizon: horizonNum,
      confidence: [0.8, 0.95]
    });

    // Generate future dates
    const lastDate = new Date(monthlyHistory[monthlyHistory.length - 1].date);
    const forecastDates = [];
    for (let i = 1; i <= horizonNum; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setMonth(futureDate.getMonth() + i);
      forecastDates.push(futureDate.toISOString().split('T')[0]);
    }

    // If forecasting price, also calculate required income for each forecast point
    let forecastData = forecastResult.forecast.map((value, index) => ({
      date: forecastDates[index],
      [metric]: Math.round(value)
    }));

    // Generate rate path and calculate required income if forecasting price
    if (metric === 'price') {
      const currentRate = macroData.mortgage_rate || 7.0;
      const ratePath = generateRatePath(currentRate, assumptions.rateEndPct, horizonNum);
      
      forecastData = forecastData.map((point, index) => ({
        ...point,
        required_income: Math.round(requiredIncome({
          price: point.price,
          ratePct: ratePath[index + 1], // +1 because ratePath includes current month
          downPct: assumptions.downPct,
          dti: assumptions.dti,
          taxPct: assumptions.taxPct,
          insuranceAnnual: assumptions.insuranceAnnual
        }))
      }));
    } else {
      // If forecasting required_income, back-calculate approximate price
      const currentRate = macroData.mortgage_rate || 7.0;
      const avgRate = (currentRate + assumptions.rateEndPct) / 2;
      
      forecastData = forecastData.map(point => ({
        ...point,
        price: Math.round(point.required_income * assumptions.dti * 12 / 
          (avgRate / 100 / 12 * 1.2 + assumptions.taxPct / 100 / 12 + assumptions.insuranceAnnual / 12))
      }));
    }

    // Format confidence intervals
    const intervals = {};
    forecastResult.intervals.forEach(interval => {
      const confidence = Math.round(interval.confidence * 100);
      intervals[`lo${confidence}`] = interval.lower.map(v => Math.round(v));
      intervals[`hi${confidence}`] = interval.upper.map(v => Math.round(v));
    });

    const response = {
      region: region || state,
      metric,
      method: forecastResult.method,
      assumptions,
      history: monthlyHistory.slice(-24), // Last 24 months
      forecast: forecastData,
      intervals,
      source: source === 'redfin' ? 'mock (redfin stub)' : 'mock',
      generated_at: new Date().toISOString()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Forecast API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}