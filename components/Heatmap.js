import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const Heatmap = ({ stateData = {}, onStateClick, className = '' }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Create color scale based on affordability scores
  const colorScale = scaleLinear()
    .domain([0.4, 0.6, 0.8, 1.0]) // Less affordable to more affordable
    .range(['#dc2626', '#f59e0b', '#22c55e', '#16a34a']); // Red to green

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isLoaded) {
    return (
      <div className={`bg-gray-900/30 border border-gray-800/30 rounded-lg p-4 h-96 flex items-center justify-center ${className}`}>
        <div className="loading-shimmer w-full h-full rounded" />
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900/30 border border-gray-800/30 rounded-lg p-4 h-96 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Housing Affordability by State</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-gray-400">Less Affordable</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-400">More Affordable</span>
          </div>
        </div>
      </div>

      <div className="relative h-80 overflow-hidden rounded">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{
            scale: 800,
          }}
          width={800}
          height={500}
        >
          <ZoomableGroup center={[-96, 40]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateCode = geo.properties.NAME ? 
                    Object.keys(stateData.states || {}).find(code => 
                      stateData.states[code]?.name === geo.properties.NAME
                    ) : null;
                  
                  const data = stateCode ? stateData.states[stateCode] : null;
                  const fillColor = data ? colorScale(data.affordability_score) : '#374151';

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#1f2937"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: '#1f2937',
                          strokeWidth: 0.5,
                          outline: 'none',
                        },
                        hover: {
                          fill: data ? colorScale(Math.min(data.affordability_score + 0.1, 1)) : '#4b5563',
                          stroke: '#ffffff',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          fill: data ? colorScale(Math.max(data.affordability_score - 0.1, 0)) : '#374151',
                          stroke: '#ffffff',
                          strokeWidth: 1,
                          outline: 'none',
                        },
                      }}
                      onMouseEnter={() => {
                        if (data) {
                          setTooltipContent(
                            `${data.name}: ${formatCurrency(data.required_income)} required income`
                          );
                        } else {
                          setTooltipContent(geo.properties.NAME || 'No data available');
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      onClick={() => {
                        if (data && onStateClick) {
                          onStateClick(stateCode, data);
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltipContent && (
          <div className="absolute top-4 left-4 bg-gray-900/95 text-white px-3 py-2 rounded-lg text-sm shadow-lg border border-gray-700 pointer-events-none z-10">
            {tooltipContent}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>$35K</span>
          <div className="w-20 h-3 bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 rounded"></div>
          <span>$165K</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;