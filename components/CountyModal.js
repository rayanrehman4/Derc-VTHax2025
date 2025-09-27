import { useState, useEffect } from 'react';
import { useAssumptions } from '../context/AssumptionsContext';

const CountyModal = ({ isOpen, onClose, city, onAddToCompare }) => {
  const [counties, setCounties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { calculateRequiredIncome } = useAssumptions();

  useEffect(() => {
    if (isOpen && city) {
      loadCounties();
    }
  }, [isOpen, city]);

  const loadCounties = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/recommendations/city?city=${encodeURIComponent(city.name)}`);
      const data = await response.json();
      setCounties(data.counties || []);
    } catch (error) {
      console.error('Error loading counties:', error);
      setCounties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSparkline = (trend) => {
    // Generate mock sparkline data based on trend
    const points = [];
    let value = 100;
    for (let i = 0; i < 12; i++) {
      value += (Math.random() - 0.5) * 10 + (trend * 2);
      points.push(Math.max(80, Math.min(120, value)));
    }
    return points;
  };

  const SparklineChart = ({ data, positive }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={positive ? '#22c55e' : '#ef4444'}
          strokeWidth="1.5"
          className="opacity-80"
        />
      </svg>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">Best Counties</h2>
            <p className="text-gray-400 text-sm mt-1">Top affordable areas near {city?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 h-20 rounded-lg" />
                </div>
              ))}
            </div>
          ) : counties.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">No county data available</div>
              <div className="text-gray-500 text-sm">Try selecting a different city</div>
            </div>
          ) : (
            <div className="space-y-4">
              {counties.map((county, index) => {
                const sparklineData = generateSparkline(county.price_trend || 0.05);
                const trendPositive = (county.price_trend || 0) < 0.1; // Lower price growth is better
                
                return (
                  <div 
                    key={county.fips}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:border-gray-600/50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-white">{county.name}</h3>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div>
                            <span className="text-gray-400">Required Income: </span>
                            <span className="text-white font-medium">
                              ${county.required_income?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Trend: </span>
                            <SparklineChart data={sparklineData} positive={trendPositive} />
                            <span className={`text-sm ${trendPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {county.price_trend ? `${(county.price_trend * 100).toFixed(1)}%` : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCompare(county)}
                        className="btn-secondary text-sm ml-4"
                      >
                        Add to Compare
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Rankings based on required income, wage growth, and price trends. Data is for illustrative purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountyModal;