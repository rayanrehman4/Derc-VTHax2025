export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: 'City parameter is required' });
  }

  try {
    const fs = require('fs');
    const path = require('path');
    
    // Load city to county mapping
    const mapPath = path.join(process.cwd(), 'public/data/cityToCountyMap.json');
    const cityMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    
    // Load county data
    const countyPath = path.join(process.cwd(), 'public/data/countyAffordability.json');
    const countyData = JSON.parse(fs.readFileSync(countyPath, 'utf8'));

    const cityInfo = cityMap[city];
    if (!cityInfo) {
      return res.status(404).json({ message: 'City not found' });
    }

    const stateCounties = countyData[cityInfo.state] || [];
    
    // Filter to metro counties if available, otherwise use all state counties
    let relevantCounties = stateCounties;
    if (cityInfo.metro_counties && cityInfo.metro_counties.length > 0) {
      relevantCounties = stateCounties.filter(county => 
        cityInfo.metro_counties.includes(county.fips)
      );
    }

    // Ranking heuristic: lower required_income is better, with small boosts for wage growth and price trend
    const rankedCounties = relevantCounties
      .map(county => ({
        ...county,
        score: calculateCountyScore(county)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    
    res.status(200).json({
      city,
      state: cityInfo.state,
      counties: rankedCounties,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error loading city recommendations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function calculateCountyScore(county) {
  // Base score: inverse of required income (lower is better)
  const baseScore = 200000 / (county.required_income || 100000);
  
  // Wage growth boost (higher is better)
  const wageBoost = (county.wage_growth || 0) * 10;
  
  // Price trend penalty (higher growth is worse for affordability)
  const pricePenalty = (county.price_trend || 0) * -5;
  
  return baseScore + wageBoost + pricePenalty;
}