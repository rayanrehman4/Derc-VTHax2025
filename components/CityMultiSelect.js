import { useState } from 'react';

const CityMultiSelect = ({ cities = [], selectedCities = [], onSelectionChange, maxSelection = 6 }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCities = cities.filter(city => {
    const matchesQuery = city.name.toLowerCase().includes(query.toLowerCase()) ||
                        city.state.toLowerCase().includes(query.toLowerCase());
    const notSelected = !selectedCities.find(sc => sc.id === city.id);
    return matchesQuery && notSelected;
  });

  const handleCityToggle = (city) => {
    if (selectedCities.find(sc => sc.id === city.id)) {
      const newSelection = selectedCities.filter(sc => sc.id !== city.id);
      onSelectionChange && onSelectionChange(newSelection);
    } else if (selectedCities.length < maxSelection) {
      const newSelection = [...selectedCities, city];
      onSelectionChange && onSelectionChange(newSelection);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleRemoveCity = (cityId) => {
    const newSelection = selectedCities.filter(sc => sc.id !== cityId);
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
      {/* Selected Cities */}
      {selectedCities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCities.map((city) => (
            <div
              key={city.id}
              className="flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2"
            >
              <span className="text-sm font-medium text-white">{city.name}</span>
              <span className="text-xs text-gray-400">{formatCurrency(city.required_income)}</span>
              <button
                onClick={() => handleRemoveCity(city.id)}
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
            selectedCities.length >= maxSelection 
              ? `Maximum ${maxSelection} cities selected`
              : "Add cities to compare..."
          }
          disabled={selectedCities.length >= maxSelection}
          className="form-input w-full pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && query.length > 0 && filteredCities.length > 0 && selectedCities.length < maxSelection && (
        <div className="absolute z-50 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
          {filteredCities.slice(0, 10).map((city) => (
            <button
              key={city.id}
              onClick={() => handleCityToggle(city)}
              className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
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
        </div>
      )}

      {/* Selection Info */}
      <div className="text-sm text-gray-400">
        {selectedCities.length} of {maxSelection} cities selected
      </div>
    </div>
  );
};

export default CityMultiSelect;