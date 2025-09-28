import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CountyMultiSelect = ({ counties = [], selectedCounties = [], onSelectionChange, maxSelection = 6 }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCounties = counties.filter(county => {
    const matchesQuery = county.region.toLowerCase().includes(query.toLowerCase());
    const notSelected = !selectedCounties.find(sc => sc.region === county.region);
    return matchesQuery && notSelected;
  });

  const handleCountyToggle = (county) => {
    if (selectedCounties.find(sc => sc.region === county.region)) {
      const newSelection = selectedCounties.filter(sc => sc.region !== county.region);
      onSelectionChange && onSelectionChange(newSelection);
    } else if (selectedCounties.length < maxSelection) {
      const newSelection = [...selectedCounties, county];
      onSelectionChange && onSelectionChange(newSelection);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleRemoveCounty = (countyRegion) => {
    const newSelection = selectedCounties.filter(sc => sc.region !== countyRegion);
    onSelectionChange && onSelectionChange(newSelection);
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
    <div className="space-y-4">
      {/* Selected Counties */}
      {selectedCounties.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCounties.map((county) => (
            <div
              key={county.region}
              className="flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2"
            >
              <span className="text-sm font-medium text-white">{county.region.replace(', CA metro area', '')}</span>
              <span className="text-sm font-medium text-white">{county.region.replace(', NY metro area', '').replace(', NY', '')}</span>
              <span className="text-xs text-gray-400">{formatCurrency(county[2028])}</span>
              <button
                onClick={() => handleRemoveCounty(county.region)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={
            selectedCounties.length >= maxSelection 
              ? `Maximum ${maxSelection} counties selected`
              : "Add counties to compare..."
          }
          disabled={selectedCounties.length >= maxSelection}
          className="form-input w-full pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && query.length > 0 && filteredCounties.length > 0 && selectedCounties.length < maxSelection && (
        <div className="absolute z-50 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
          {filteredCounties.slice(0, 10).map((county) => (
            <button
              key={county.region}
              onClick={() => handleCountyToggle(county)}
              className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{county.region.replace(', NY metro area', '').replace(', NY', '')}</div>
                  <div className="text-sm text-gray-400">2028 Forecast</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {formatCurrency(county[2028])}
                  </div>
                  <div className="text-xs text-green-400">
                    +{(((county[2028] - county[2026]) / county[2026]) * 100).toFixed(1)}% growth
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selection Info */}
      <div className="text-sm text-gray-400">
        {selectedCounties.length} of {maxSelection} counties selected
      </div>
    </div>
  );
};

const PresetButtons = ({ counties, onPresetSelect }) => {
  const presets = [
    {
      label: 'Top 5 Most Expensive',
      action: () => {
        const sorted = [...counties].sort((a, b) => b[2028] - a[2028]).slice(0, 5);
        onPresetSelect(sorted);
      }
    },
    {
      label: 'Top 5 Cheapest',
      action: () => {
        const sorted = [...counties].sort((a, b) => a[2028] - b[2028]).slice(0, 5);
        onPresetSelect(sorted);
      }
    },
    {
      label: 'Top 5 Fastest Growth',
      action: () => {
        const sorted = [...counties]
          .map(county => ({
            ...county,
            growth: ((county[2028] - county[2026]) / county[2026])
          }))
          .sort((a, b) => b.growth - a.growth)
          .slice(0, 5);
        onPresetSelect(sorted);
      }
    },
    {
      label: 'Top 5 Slowest Growth',
      action: () => {
        const sorted = [...counties]
          .map(county => ({
            ...county,
            growth: ((county[2028] - county[2026]) / county[2026])
          }))
          .sort((a, b) => a.growth - b.growth)
          .slice(0, 5);
        onPresetSelect(sorted);
      }
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.label}
          onClick={preset.action}
          className="btn-secondary text-sm py-2 px-4"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
};

const californiaData = [
  // Load from the new housing_forecast_2026_2028.json file
];

const statesList = [
  'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia',
  'North Carolina', 'Michigan', 'New Jersey', 'Virginia', 'Washington', 'Arizona', 'Massachusetts',
  'Tennessee', 'Indiana', 'Missouri', 'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina',
  'Alabama', 'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah', 'Iowa', 'Nevada',
  'Arkansas', 'Mississippi', 'Kansas', 'New Mexico', 'Nebraska', 'West Virginia', 'Idaho', 'Hawaii',
  'New Hampshire', 'Maine', 'Montana', 'Rhode Island', 'Delaware', 'South Dakota', 'North Dakota',
  'Alaska', 'Vermont', 'Wyoming'
];

export default function Forecasting() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [filteredStates, setFilteredStates] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [processedCounties, setProcessedCounties] = useState([]);
  const [nyForecastData, setNyForecastData] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = statesList.filter(state =>
        state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStates(filtered);
      setShowDropdown(true);
    } else {
      setFilteredStates([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Load NY forecast data
    const loadNyData = async () => {
      try {
        const response = await fetch('/data/housing_forecast_2026_2028.json');
        const data = await response.json();
        setNyForecastData(data);
      } catch (error) {
        console.error('Error loading NY forecast data:', error);
      }
    };
    loadNyData();
  }, []);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSearchQuery(state);
    setShowDropdown(false);
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (state.toLowerCase() === 'new york') {
        setForecastData(nyForecastData);
        // Process data for county selection
        const processed = processCountyData(nyForecastData);
        setProcessedCounties(processed);
        // Auto-select top 3 most expensive for demo
        const top3 = processed.sort((a, b) => b[2028] - a[2028]).slice(0, 3);
        setSelectedCounties(top3);
      } else {
        // For other states, show no data message
        setForecastData([]);
        setProcessedCounties([]);
        setSelectedCounties([]);
      }
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const processCountyData = (data) => {
    const regionData = {};
    data.forEach(item => {
      const region = item.Region;
      if (!regionData[region]) {
        regionData[region] = { region: region, 2026: 0, 2027: 0, 2028: 0 };
      }
      regionData[region][item.Year] = item['Avg Predicted Median Sale Price'];
    });
    return Object.values(regionData);
  };

  const handlePresetSelect = (counties) => {
    setSelectedCounties(counties);
  };

  // Process data for chart
  const processChartData = () => {
    if (!selectedCounties.length) return null;

    const colors = [
      '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
      '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1'
    ];

    const datasets = selectedCounties.map((county, index) => ({
      label: county.region.replace(', NY metro area', '').replace(', NY', ''),
      data: [county[2026], county[2027], county[2028]],
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    }));

    return {
      labels: ['2026', '2027', '2028'],
      datasets
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f9fafb',
          font: { size: 12 },
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(107, 114, 128, 0.2)' },
        ticks: { color: '#9ca3af' },
      },
      y: {
        grid: { color: 'rgba(107, 114, 128, 0.2)' },
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  const chartData = processChartData();

  return (
    <Layout 
      title="Housing Price Forecasting - Affordly" 
      description="Predict future housing prices by state and metro area with advanced forecasting models"
      canonical="https://affordly.com/forecasting"
    >
      <div className="min-h-screen bg-gray-950 pt-8">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {selectedState} Housing Price Forecasts
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore predicted median home prices for metro areas across the United States through 2028
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a state (e.g., California, Texas, Florida...)"
                className="form-input w-full pl-12 text-lg py-4"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Dropdown */}
              {showDropdown && filteredStates.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                  {filteredStates.map((state) => (
                    <button
                      key={state}
                      onClick={() => handleStateSelect(state)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0 focus:outline-none focus:bg-gray-800"
                    >
                      <div className="font-medium text-white">{state}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          {selectedState && (
            <div className="space-y-8">
              {/* State Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedState} Housing Price Forecasts
                </h2>
                <p className="text-gray-400">
                  Predicted median sale prices for metro areas through 2028
                </p>
              </div>

              {isLoading ? (
                <div className="card">
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <span className="ml-4 text-gray-300">Loading forecast data...</span>
                  </div>
                </div>
              ) : forecastData.length > 0 ? (
                <>
                  {/* County Selection Controls */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Select Counties to Compare</h3>
                      <CountyMultiSelect
                        counties={processedCounties}
                        selectedCounties={selectedCounties}
                        onSelectionChange={setSelectedCounties}
                        maxSelection={6}
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-white mb-3">Quick Select:</h4>
                      <PresetButtons counties={processedCounties} onPresetSelect={handlePresetSelect} />
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="card">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">Price Forecasts Comparison</h3>
                      <p className="text-gray-400 text-sm">
                        {selectedCounties.length} counties selected for comparison
                      </p>
                    </div>
                    {selectedCounties.length > 0 ? (
                      <div className="h-96">
                        {chartData && <Line data={chartData} options={chartOptions} />}
                      </div>
                    ) : (
                      <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-gray-400 text-lg mb-2">No counties selected</div>
                          <div className="text-gray-500 text-sm">Select counties above to view their forecast trends</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Data Table */}
                  <div className="card">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        Complete Forecast Data
                      </h3>
                      <p className="text-gray-400 text-sm">
                        All {selectedState} metro areas with predicted prices
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-300">Metro Area</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-300">2026</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-300">2027</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-300">2028</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-300">3-Year Growth</th>
                          </tr>
                        </thead>
                        <tbody>
                          {processedCounties
                          .sort((a, b) => b[2028] - a[2028])
                          .map((county) => {
                            const growth = ((county[2028] - county[2026]) / county[2026] * 100);
                            const region = county.region.replace(', NY metro area', '').replace(', NY', '');
                            return (
                              <tr key={region} className="border-b border-gray-800 hover:bg-gray-800/30">
                                <td className="py-3 px-4 text-white font-medium">{region}</td>
                                <td className="py-3 px-4 text-right text-gray-300">
                                  {formatCurrency(county[2026])}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-300">
                                  {formatCurrency(county[2027])}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-300">
                                  {formatCurrency(county[2028])}
                                </td>
                                <td className={`py-3 px-4 text-right font-semibold ${
                                  growth >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="card text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">
                    No forecast data available for {selectedState}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Currently, we only have forecast data for New York. More states coming soon!
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info Section */}
          {!selectedState && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="card text-center">
                <div className="text-4xl mb-4">🔮</div>
                <h3 className="text-xl font-semibold text-white mb-3">Advanced Modeling</h3>
                <p className="text-gray-400">
                  Our forecasts use machine learning models trained on historical data, economic indicators, and market trends.
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-3">Metro-Level Precision</h3>
                <p className="text-gray-400">
                  Get detailed predictions for individual metropolitan areas, not just state-level averages.
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-white mb-3">3-Year Outlook</h3>
                <p className="text-gray-400">
                  Plan ahead with forecasts extending through 2028, including growth rate analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}