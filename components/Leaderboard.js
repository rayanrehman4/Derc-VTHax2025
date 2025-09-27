import { useState, useEffect } from 'react';
import { useAssumptions } from '../context/AssumptionsContext';

const Leaderboard = ({ cities = [], sortBy = 'affordability', limit = 10 }) => {
  const [sortedCities, setSortedCities] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { calculateRequiredIncome } = useAssumptions();

  useEffect(() => {
    // Recalculate required income with current assumptions
    let sorted = cities.map(city => ({
      ...city,
      adjusted_required_income: calculateRequiredIncome(city.median_price),
      adjusted_affordability_score: Math.min(city.median_income / calculateRequiredIncome(city.median_price), 1.0)
    }));
    
    switch (sortBy) {
      case 'affordability':
        sorted.sort((a, b) => b.adjusted_affordability_score - a.adjusted_affordability_score);
        break;
      case 'required_income':
        sorted.sort((a, b) => a.adjusted_required_income - b.adjusted_required_income);
        break;
      case 'change_1y':
        sorted.sort((a, b) => a.change_1y - b.change_1y);
        break;
      default:
        break;
    }
    
    setSortedCities(sorted.slice(0, limit));
    setIsLoaded(true);
  }, [cities, sortBy, limit, calculateRequiredIncome]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${(value * 100).toFixed(1)}%`;
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${index + 1}`;
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'affordability':
        return 'Most Affordable';
      case 'required_income':
        return 'Lowest Income Required';
      case 'change_1y':
        return 'Biggest Improvement';
      default:
        return 'Ranking';
    }
  };

  if (!isLoaded || sortedCities.length === 0) {
    return (
      <div className="card">
        <div className="loading-shimmer h-6 w-48 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="loading-shimmer w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="loading-shimmer h-4 w-32 rounded mb-2" />
                <div className="loading-shimmer h-3 w-20 rounded" />
              </div>
              <div className="loading-shimmer h-4 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">{getSortLabel()}</h3>
        <div className="text-sm text-gray-400">
          Top {limit} Cities
        </div>
      </div>

      <div className="space-y-3">
        {sortedCities.map((city, index) => {
          const isAffordable = city.adjusted_affordability_score >= 0.7;
          const changePositive = city.change_1y >= 0;
          
          return (
            <div 
              key={city.id}
              className={`flex items-center space-x-4 p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01] ${
                index < 3 
                  ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/30'
                  : 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600/30'
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s ease-out'
              }}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full text-sm font-bold">
                {getRankIcon(index)}
              </div>

              {/* City Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">
                  {city.name}
                </div>
                <div className="text-sm text-gray-400">
                  {city.state}
                </div>
              </div>

              {/* Metric */}
              <div className="text-right">
                {sortBy === 'affordability' && (
                  <div className={`font-semibold ${isAffordable ? 'text-green-400' : 'text-red-400'}`}>
                    {(city.adjusted_affordability_score * 100).toFixed(0)}%
                  </div>
                )}
                {sortBy === 'required_income' && (
                  <div className="font-semibold text-white">
                    {formatCurrency(city.adjusted_required_income)}
                  </div>
                )}
                {sortBy === 'change_1y' && (
                  <div className={`font-semibold ${changePositive ? 'text-red-400' : 'text-green-400'}`}>
                    {formatPercentage(city.change_1y)}
                  </div>
                )}
              </div>

              {/* Affordability Score Bar */}
              <div className="w-16">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${isAffordable ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ 
                      width: `${Math.min(city.adjusted_affordability_score * 100, 100)}%`,
                      transitionDelay: `${index * 100 + 500}ms`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;