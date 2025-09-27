import { useState, useEffect } from 'react';

const MacroIndicators = ({ data = {} }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const indicators = [
    {
      label: 'Mortgage Rate',
      value: data.mortgage_rate ? formatPercentage(data.mortgage_rate) : '--',
      change: '+0.15%',
      positive: false,
      icon: '📈',
    },
    {
      label: 'Wage Growth (YoY)',
      value: data.wage_growth_yoy ? formatPercentage(data.wage_growth_yoy) : '--',
      change: '+0.8%',
      positive: true,
      icon: '💰',
    },
    {
      label: 'Median US Price',
      value: data.median_us_price ? formatCurrency(data.median_us_price) : '--',
      change: '+5.2%',
      positive: false,
      icon: '🏠',
    },
    {
      label: 'Housing Starts',
      value: data.housing_starts ? `${data.housing_starts}M` : '--',
      change: '-2.1%',
      positive: false,
      icon: '🔨',
    },
  ];

  if (!isLoaded) {
    return (
      <div className="card">
        <div className="loading-shimmer h-6 w-40 rounded mb-4" />
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="loading-shimmer h-4 w-16 rounded mb-2" />
              <div className="loading-shimmer h-6 w-20 rounded mb-1" />
              <div className="loading-shimmer h-3 w-12 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-white mb-6">Market Indicators</h3>
      
      <div className="stats-grid">
        {indicators.map((indicator, index) => (
          <div 
            key={indicator.label}
            className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-gray-600/30 transition-all duration-200"
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease-out'
            }}
          >
            <div className="text-2xl mb-2">{indicator.icon}</div>
            <div className="text-sm text-gray-400 mb-1">{indicator.label}</div>
            <div className="text-xl font-bold text-white mb-2">{indicator.value}</div>
            <div className={`text-sm font-medium ${
              indicator.positive ? 'text-green-400' : 'text-red-400'
            }`}>
              {indicator.change} vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Price-to-Income Ratio (US)</span>
          <span className="text-white font-semibold">
            {data.price_to_income_ratio ? `${data.price_to_income_ratio}x` : '--'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-400">Inventory (Months)</span>
          <span className="text-white font-semibold">
            {data.inventory_months ? `${data.inventory_months} months` : '--'}
          </span>
        </div>
        {data.last_updated && (
          <div className="text-xs text-gray-500 mt-3">
            Last updated: {new Date(data.last_updated).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroIndicators;