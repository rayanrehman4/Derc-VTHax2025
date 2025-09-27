const Stat = ({ 
  label, 
  value, 
  change, 
  positive = true, 
  icon,
  className = '' 
}) => {
  const formatChange = (change) => {
    if (typeof change === 'number') {
      const sign = change >= 0 ? '+' : '';
      return `${sign}${change}%`;
    }
    return change;
  };

  return (
    <div className={`bg-gray-800/30 border border-gray-700/30 rounded-lg p-4 hover:border-gray-600/30 transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-400">{label}</div>
        {icon && (
          <div className="text-lg">{icon}</div>
        )}
      </div>
      
      <div className="text-2xl font-bold text-white mb-1">
        {value}
      </div>
      
      {change && (
        <div className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {formatChange(change)} vs last period
        </div>
      )}
    </div>
  );
};

export default Stat;