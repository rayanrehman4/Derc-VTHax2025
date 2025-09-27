import { useState, useRef, useEffect } from 'react';

const SearchBar = ({ cities = [], onCitySelect, placeholder = "Search cities..." }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const inputRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    if (query.length > 0) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.state.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(filtered);
      setIsOpen(true);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  }, [query, cities]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city) => {
    setQuery('');
    setIsOpen(false);
    onCitySelect && onCitySelect(city);
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
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="form-input w-full pl-10"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isOpen && filteredCities.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
        >
          {filteredCities.slice(0, 10).map((city) => (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city)}
              className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0 focus:outline-none focus:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{city.name}</div>
                  <div className="text-sm text-gray-400">{city.state}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {formatCurrency(city.required_income)}
                  </div>
                  <div className={`text-xs ${city.affordability_score >= 0.7 ? 'text-green-400' : 'text-red-400'}`}>
                    {(city.affordability_score * 100).toFixed(0)}% affordable
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {filteredCities.length > 10 && (
            <div className="px-4 py-2 text-sm text-gray-400 bg-gray-800/50">
              {filteredCities.length - 10} more cities available...
            </div>
          )}
        </div>
      )}

      {isOpen && query.length > 0 && filteredCities.length === 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4 text-center"
        >
          <div className="text-gray-400">No cities found matching "{query}"</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;