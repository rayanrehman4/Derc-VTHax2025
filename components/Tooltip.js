import { useState } from 'react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 border-t-8 border-x-transparent border-x-8',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 border-b-8 border-x-transparent border-x-8',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 border-l-8 border-y-transparent border-y-8',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 border-r-8 border-y-transparent border-y-8',
  };

  const positionClasses = positions[position] || positions.top;
  const arrowClasses = arrows[position] || arrows.top;

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && content && (
        <div 
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl border border-gray-700 whitespace-nowrap ${positionClasses}`}
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrowClasses}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;