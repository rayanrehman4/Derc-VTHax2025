import { useState, useEffect } from 'react';
import { useAssumptions } from '../context/AssumptionsContext';

const TickerCard = ({ city, onClick, isSelected = false, onCardClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { calculateRequiredIncome } = useAssumptions();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Calculate required income with current assumptions
  const adjustedRequiredIncome = calculateRequiredIncome(city.median_price);
  const adjustedAffordabilityScore = Math.min(city.median_income / adjustedRequiredIncome, 1.0);

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

  const isAffordable = adjustedAffordabilityScore >= 0.7;
  const changePositive = city.change_1y >= 0;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onCardClick) {
      onCardClick(city);
    } else if (onClick) {
      onClick(city);
    }
  };

  return (
    <div 
      className={`ticker-card ${isAffordable ? 'ticker-positive' : 'ticker-negative'} ${isSelected ? 'ring-2 ring-green-500' : ''} ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{city.name}</h3>
          <p className="text-gray-400 text-sm">{city.state}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${isAffordable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {(adjustedAffordabilityScore * 100).toFixed(0)}% Affordable
        </div>
      </div>

      {/* Main Metric */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-white mb-1">
          {formatCurrency(adjustedRequiredIncome)}
        </div>
        <div className="text-sm text-gray-400">Required Annual Income</div>
      </div>

      {/* Change Indicator */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center text-sm ${changePositive ? 'text-red-400' : 'text-green-400'}`}>
          <svg 
            className={`w-4 h-4 mr-1 ${changePositive ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
          </svg>
          {formatPercentage(Math.abs(city.change_1y))} 1Y
        </div>
        <div className="text-sm text-gray-400">
          {formatCurrency(city.median_price)} median
        </div>
      </div>

      {/* Affordability Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 delay-300 ${isAffordable ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(adjustedAffordabilityScore * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TickerCard;