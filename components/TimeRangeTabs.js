const TimeRangeTabs = ({ activeRange = '5Y', onRangeChange }) => {
  const ranges = [
    { value: '1Y', label: '1 Year' },
    { value: '5Y', label: '5 Years' },
    { value: '10Y', label: '10 Years' },
  ];

  return (
    <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange && onRangeChange(range.value)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeRange === range.value
              ? 'bg-green-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeTabs;