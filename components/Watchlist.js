import { useState, useEffect } from 'react';

const Watchlist = ({ cities = [], onCityRemove, onCityAdd }) => {
  const [watchlistCities, setWatchlistCities] = useState([]);

  useEffect(() => {
    // Load watchlist from localStorage
    const saved = localStorage.getItem('affordly-watchlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWatchlistCities(parsed);
      } catch (error) {
        console.error('Error loading watchlist:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save watchlist to localStorage
    localStorage.setItem('affordly-watchlist', JSON.stringify(watchlistCities));
  }, [watchlistCities, isLoaded]);

  const addToWatchlist = (city) => {
    if (!watchlistCities.find(c => c.id === city.id)) {
      const newWatchlist = [...watchlistCities, city];
      setWatchlistCities(newWatchlist);
      onCityAdd && onCityAdd(city);
    }
  };

  const removeFromWatchlist = (cityId) => {
    const newWatchlist = watchlistCities.filter(c => c.id !== cityId);
    setWatchlistCities(newWatchlist);
    onCityRemove && onCityRemove(cityId);
  };

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

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Watchlist</h3>
        <div className="text-sm text-gray-400">
          {watchlistCities.length} cities
        </div>
      </div>

      {watchlistCities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">Your watchlist is empty</div>
          <div className="text-gray-500 text-sm mb-4">Add cities to track their affordability</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {cities.slice(0, 3).map((city) => (
              <button
                key={city.id}
                onClick={() => addToWatchlist(city)}
                className="btn-secondary text-sm py-2 px-4"
              >
                + {city.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {watchlistCities.map((city, index) => {
            const isAffordable = city.affordability_score >= 0.7;
            const changePositive = city.change_1y >= 0;
            
            return (
              <div 
                key={city.id}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-gray-600/30 transition-all duration-200"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: 'all 0.5s ease-out'
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">
                    {city.name}
                  </div>
                  <div className="flex items-center space-x-4 text-sm mt-1">
                    <span className="text-gray-400">
                      {formatCurrency(city.required_income)}
                    </span>
                    <span className={`${changePositive ? 'text-red-400' : 'text-green-400'}`}>
                      {formatPercentage(city.change_1y)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded text-xs ${
                    isAffordable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {(city.affordability_score * 100).toFixed(0)}%
                  </div>
                  
                  <button
                    onClick={() => removeFromWatchlist(city.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    title="Remove from watchlist"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cities.length > 0 && watchlistCities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/30">
          <div className="text-sm text-gray-400 mb-2">Add more cities:</div>
          <div className="flex flex-wrap gap-2">
            {cities
              .filter(city => !watchlistCities.find(wc => wc.id === city.id))
              .slice(0, 3)
              .map((city) => (
                <button
                  key={city.id}
                  onClick={() => addToWatchlist(city)}
                  className="text-xs py-1 px-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700 rounded-full transition-all duration-200"
                >
                  + {city.name}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;