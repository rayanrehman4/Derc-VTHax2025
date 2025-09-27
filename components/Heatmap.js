import { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const Heatmap = ({ stateData = {}, onStateClick, className = '' }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { setIsLoaded(true); }, []);

  // Precompute a lookup by full state name for fast, correct matches
  // stateData.states is expected to be: { "AZ": { name: "Arizona", required_income, affordability_score } }
  const statesObj = stateData.states || {};
  const byName = useMemo(() => {
    const m = new Map();
    for (const code of Object.keys(statesObj)) {
      const entry = statesObj[code];
      if (entry?.name) m.set(entry.name, { code, ...entry });
    }
    return m;
  }, [statesObj]);

  // Color scale (clamped) from less affordable (red) -> more affordable (green)
  const colorScale = useMemo(
    () =>
      scaleLinear()
        .domain([0.4, 0.6, 0.8, 1.0])
        .range(['#dc2626', '#f59e0b', '#22c55e', '#16a34a'])
        .clamp(true),
    []
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  if (!isLoaded) {
    return (
      <div className={`bg-gray-900/30 border border-gray-800/30 rounded-lg p-4 h-[420px] flex items-center justify-center ${className}`}>
        <div className="loading-shimmer w-full h-full rounded" />
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900/30 border border-gray-800/30 rounded-lg p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Housing Affordability by State</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded" />
            <span className="text-gray-400">Less Affordable</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-gray-400">More Affordable</span>
          </div>
        </div>
      </div>

      {/* Give the map a fixed, taller height so it doesn't get cut off */}
      <div className="relative h-[420px] overflow-hidden rounded">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1000 }}
          // Make the SVG fill the container; width/height come from the parent div
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup center={[-96, 39]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // IMPORTANT: us-atlas uses 'name' (lowercase), not 'NAME'
                  const stateName = geo.properties.name;
                  const entry = byName.get(stateName); // { code, name, required_income, affordability_score }
                  const score = entry?.affordability_score;

                  const fillColor = Number.isFinite(score)
                    ? colorScale(score)
                    : '#374151'; // gray when no data

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
                          fill: Number.isFinite(score)
                            ? colorScale(Math.min(score + 0.1, 1))
                            : '#4b5563',
                          stroke: '#ffffff',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          fill: Number.isFinite(score)
                            ? colorScale(Math.max(score - 0.1, 0))
                            : '#374151',
                          stroke: '#ffffff',
                          strokeWidth: 1,
                          outline: 'none',
                        },
                      }}
                      onMouseEnter={() => {
                        if (entry) {
                          setTooltipContent(
                            `${entry.name}: ${formatCurrency(entry.required_income)} required income`
                          );
                        } else {
                          setTooltipContent(stateName || 'No data available');
                        }
                      }}
                      onMouseLeave={() => setTooltipContent('')}
                      onClick={() => {
                        if (entry && onStateClick) onStateClick(entry.code, entry);
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
          <div className="w-24 h-3 bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 rounded" />
          <span>$165K</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;