import { useState, useEffect } from 'react';
import ForecastChart from './ForecastChart';
import SearchBar from './SearchBar';

const ForecastPanel = ({ cities = [] }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [metric, setMetric] = useState('required_income');
  const [assumptions, setAssumptions] = useState({
    rateEndPct: 7.0,
    downPct: 20,
    dti: 0.30,
    taxPct: 1.1,
    insuranceAnnual: 1200
  });
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load forecast data
  const loadForecast = async () => {
    if (!selectedRegion) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        region: `${selectedRegion.name}, ${selectedRegion.state}`,
        metric,
        horizon: '12',
        source: 'mock',
        ...Object.fromEntries(
          Object.entries(assumptions).map(([key, value]) => [key, value.toString()])
        )
      });
      
      const response = await fetch(`/api/forecast?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setForecastData(data);
      
      // Show toast if using Redfin stub
      if (data.source?.includes('redfin stub')) {
        // You could add a toast notification here
        console.warn('Using mock data - Redfin integration not yet available');
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Forecast error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load forecast when region or metric changes
  useEffect(() => {
    loadForecast();
  }, [selectedRegion, metric]);

  // Handle assumption changes
  const handleAssumptionChange = (key, value) => {
    setAssumptions(prev => ({
      ...prev,
      [key]: parseFloat(value)
    }));
  };

  // Apply assumptions (refetch forecast)
  const applyAssumptions = () => {
    loadForecast();
    setShowAssumptions(false);
  };

  // Download CSV
  const downloadCSV = () => {
    if (!forecastData) return;
    
    const { history, forecast, intervals } = forecastData;
    
    // Prepare CSV data
    const csvData = [];
    
    // Add headers
    csvData.push([
      'date',
      'actual_price',
      'actual_required_income',
      'forecast_point',
      'lo80',
      'hi80',
      'lo95',
      'hi95'
    ]);
    
    // Add historical data
    history.forEach(point => {
      csvData.push([
        point.date,
        point.price || '',
        point.required_income || '',
        '',
        '',
        '',
        '',
        ''
      ]);
    });
    
    // Add forecast data
    forecast.forEach((point, index) => {
      csvData.push([
        point.date,
        '',
        '',
        point[metric],
        intervals.lo80?.[index] || '',
        intervals.hi80?.[index] || '',
        intervals.lo95?.[index] || '',
        intervals.hi95?.[index] || ''
      ]);
    });
    
    // Convert to CSV string
    const csvString = csvData.map(row => row.join(',')).join('\n');
    
    // Download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affordly-forecast-${selectedRegion?.name?.replace(/\s+/g, '-')}-${metric}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Region Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Region
            </label>
            <SearchBar
              cities={cities}
              onCitySelect={setSelectedRegion}
              placeholder="Choose a city to forecast..."
            />
            {selectedRegion && (
              <div className="mt-2 text-sm text-gray-400">
                Selected: {selectedRegion.name}, {selectedRegion.state}
              </div>
            )}
          </div>

          {/* Metric Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Forecast Metric
            </label>
            <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
              <button
                onClick={() => setMetric('required_income')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  metric === 'required_income'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Required Income
              </button>
              <button
                onClick={() => setMetric('price')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  metric === 'price'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Median Price
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-end space-y-2">
            <button
              onClick={() => setShowAssumptions(!showAssumptions)}
              className="btn-secondary text-sm"
            >
              {showAssumptions ? 'Hide' : 'Show'} Assumptions
            </button>
            <button
              onClick={downloadCSV}
              disabled={!forecastData}
              className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download CSV
            </button>
          </div>
        </div>

        {/* Assumptions Panel */}
        {showAssumptions && (
          <div className="mt-6 pt-6 border-t border-gray-700/30">
            <h4 className="text-lg font-semibold text-white mb-4">Forecast Assumptions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Mortgage Rate (%)
                </label>
                <input
                  type="number"
                  min="5"
                  max="9"
                  step="0.1"
                  value={assumptions.rateEndPct}
                  onChange={(e) => handleAssumptionChange('rateEndPct', e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Down Payment (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="20"
                  step="1"
                  value={assumptions.downPct}
                  onChange={(e) => handleAssumptionChange('downPct', e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Debt-to-Income Ratio
                </label>
                <input
                  type="number"
                  min="0.28"
                  max="0.31"
                  step="0.01"
                  value={assumptions.dti}
                  onChange={(e) => handleAssumptionChange('dti', e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Property Tax (%)
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={assumptions.taxPct}
                  onChange={(e) => handleAssumptionChange('taxPct', e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Insurance (Annual)
                </label>
                <input
                  type="number"
                  min="600"
                  max="2400"
                  step="100"
                  value={assumptions.insuranceAnnual}
                  onChange={(e) => handleAssumptionChange('insuranceAnnual', e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={applyAssumptions}
                className="btn-primary"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="card bg-red-500/10 border-red-500/30">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-red-400">Forecast Error</h4>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">
              {metric === 'price' ? 'Median Home Price' : 'Required Annual Income'} Forecast
            </h3>
            {selectedRegion && (
              <p className="text-gray-400 text-sm mt-1">
                {selectedRegion.name}, {selectedRegion.state} • 12-month outlook
              </p>
            )}
          </div>
          {forecastData && (
            <div className="text-sm text-gray-400">
              Method: {forecastData.method?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          )}
        </div>

        {!selectedRegion ? (
          <div className="h-96 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg mb-2">Select a region to view forecast</p>
              <p className="text-sm">Choose a city from the dropdown above to see 12-month predictions</p>
            </div>
          </div>
        ) : (
          <ForecastChart 
            data={forecastData} 
            metric={metric}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Forecast Details */}
      {forecastData && !isLoading && (
        <div className="card">
          <h4 className="text-lg font-semibold text-white mb-4">Forecast Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Current Value</div>
              <div className="text-xl font-bold text-white">
                {formatCurrency(forecastData.history[forecastData.history.length - 1]?.[metric] || 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">12-Month Forecast</div>
              <div className="text-xl font-bold text-blue-400">
                {formatCurrency(forecastData.forecast[forecastData.forecast.length - 1]?.[metric] || 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Expected Change</div>
              <div className={`text-xl font-bold ${
                (forecastData.forecast[forecastData.forecast.length - 1]?.[metric] || 0) > 
                (forecastData.history[forecastData.history.length - 1]?.[metric] || 0)
                  ? 'text-red-400' : 'text-green-400'
              }`}>
                {(() => {
                  const current = forecastData.history[forecastData.history.length - 1]?.[metric] || 0;
                  const future = forecastData.forecast[forecastData.forecast.length - 1]?.[metric] || 0;
                  const change = ((future - current) / current * 100);
                  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
                })()}
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-xs text-gray-500 border-t border-gray-700/30 pt-4">
            <p>
              <strong>Forecast method:</strong> {forecastData.method?.replace('-', ' ')} (additive seasonality). 
              <strong> Assumptions:</strong> {assumptions.downPct}% down, {(assumptions.dti * 100).toFixed(0)}% DTI, 
              {assumptions.taxPct}% property tax, ${assumptions.insuranceAnnual.toLocaleString()} insurance. 
              <strong>Not investment advice.</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastPanel;