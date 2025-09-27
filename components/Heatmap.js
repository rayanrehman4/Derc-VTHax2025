import { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { useAssumptions } from '../context/AssumptionsContext';

const statesGeoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const countiesGeoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

const Heatmap = ({ stateData = {}, onStateClick, onCountyClick, className = '' }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('states'); // 'states' or 'counties'
  const [selectedState, setSelectedState] = useState(null);
  const [countyData, setCountyData] = useState({});
  const { calculateRequiredIncome } = useAssumptions();

  useEffect(() => { setIsLoaded(true); }, []);

  // Load county data when drilling down
  useEffect(() => {
    if (viewMode === 'counties' && selectedState) {
      loadCountyData(selectedState);
    }
  }, [viewMode, selectedState]);

  const loadCountyData = async (state) => {
    try {
      const response = await fetch(`/api/affordability/counties?state=${state}`);
      const data = await response.json();
      setCountyData(data.counties || []);
    } catch (error) {
      console.error('Error loading county data:', error);
      setCountyData([]);
    }
  };

  const handleStateClick = (stateCode, stateInfo) => {
    setSelectedState(stateCode);
    setViewMode('counties');
    if (onStateClick) onStateClick(stateCode, stateInfo);
  };

  const handleCountyClick = (county) => {
    if (onCountyClick) onCountyClick(county);
  };

  const handleBackToStates = () => {
    setViewMode('states');
    setSelectedState(null);
    setCountyData({});
  };

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

  // Create county lookup for current view
  const countyLookup = useMemo(() => {
    if (!Array.isArray(countyData)) return new Map();
    const lookup = new Map();
    countyData.forEach(county => {
      lookup.set(county.fips, county);
    });
    return lookup;
  }, [countyData]);

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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">
            Housing Affordability by {viewMode === 'states' ? 'State' : `${selectedState} Counties`}
          </h3>
          {viewMode === 'counties' && (
            <button
              onClick={handleBackToStates}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to States
            </button>
          )}
        </div>
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
          projectionConfig={{ 
            scale: viewMode === 'states' ? 1000 : 2000,
            translate: viewMode === 'counties' && selectedState ? getStateTranslation(selectedState) : [400, 200]
          }}
          // Make the SVG fill the container; width/height come from the parent div
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup center={[-96, 39]} zoom={1}>
            <Geographies geography={viewMode === 'states' ? statesGeoUrl : countiesGeoUrl}>
              {({ geographies }) =>
                geographies
                  .filter(geo => {
                    if (viewMode === 'states') return true;
                    // For counties, only show counties in the selected state
                    const stateId = geo.id?.slice(0, 2);
                    const stateFips = getStateFips(selectedState);
                    return stateId === stateFips;
                  })
                  .map((geo) => {
                    if (viewMode === 'states') {
                      const stateName = geo.properties.name;
                      const entry = byName.get(stateName);
                      const score = entry?.affordability_score;
                      const fillColor = Number.isFinite(score) ? colorScale(score) : '#374151';

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fillColor}
                          stroke="#1f2937"
                          strokeWidth={0.5}
                          style={{
                            default: { fill: fillColor, stroke: '#1f2937', strokeWidth: 0.5, outline: 'none' },
                            hover: { 
                              fill: Number.isFinite(score) ? colorScale(Math.min(score + 0.1, 1)) : '#4b5563',
                              stroke: '#ffffff', strokeWidth: 1, outline: 'none', cursor: 'pointer'
                            },
                            pressed: { 
                              fill: Number.isFinite(score) ? colorScale(Math.max(score - 0.1, 0)) : '#374151',
                              stroke: '#ffffff', strokeWidth: 1, outline: 'none'
                            }
                          }}
                          onMouseEnter={() => {
                            if (entry) {
                              setTooltipContent(`${entry.name}: ${formatCurrency(entry.required_income)} required income`);
                            } else {
                              setTooltipContent(stateName || 'No data available');
                            }
                          }}
                          onMouseLeave={() => setTooltipContent('')}
                          onClick={() => {
                            if (entry) handleStateClick(entry.code, entry);
                          }}
                        />
                      );
                    } else {
                      // County view
                      const countyFips = geo.id;
                      const county = countyLookup.get(countyFips);
                      const requiredIncome = county?.required_income;
                      
                      // Color based on required income (lower is better/greener)
                      const fillColor = requiredIncome 
                        ? colorScale(Math.max(0.2, Math.min(1.0, 150000 / requiredIncome)))
                        : '#374151';

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fillColor}
                          stroke="#1f2937"
                          strokeWidth={0.3}
                          style={{
                            default: { fill: fillColor, stroke: '#1f2937', strokeWidth: 0.3, outline: 'none' },
                            hover: { 
                              fill: requiredIncome ? colorScale(Math.max(0.2, Math.min(1.0, 150000 / requiredIncome)) + 0.1) : '#4b5563',
                              stroke: '#ffffff', strokeWidth: 1, outline: 'none', cursor: 'pointer'
                            },
                            pressed: { 
                              fill: requiredIncome ? colorScale(Math.max(0.1, Math.min(0.9, 150000 / requiredIncome)) - 0.1) : '#374151',
                              stroke: '#ffffff', strokeWidth: 1, outline: 'none'
                            }
                          }}
                          onMouseEnter={() => {
                            if (county) {
                              setTooltipContent(`${county.name}: ${formatCurrency(county.required_income)} required income`);
                            } else {
                              setTooltipContent('County data not available');
                            }
                          }}
                          onMouseLeave={() => setTooltipContent('')}
                          onClick={() => {
                            if (county) handleCountyClick(county);
                          }}
                        />
                      );
                    }
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

// Helper functions for county view
function getStateFips(stateCode) {
  const stateFipsMap = {
    'CA': '06', 'TX': '48', 'FL': '12', 'NY': '36', 'WA': '53', 
    'CO': '08', 'GA': '13', 'MA': '25', 'OR': '41', 'NV': '32'
  };
  return stateFipsMap[stateCode] || '06';
}

function getStateTranslation(stateCode) {
  const translations = {
    'CA': [200, 300],
    'TX': [400, 350], 
    'FL': [500, 400],
    'NY': [450, 200],
    'WA': [150, 150],
    'CO': [300, 250],
    'GA': [450, 300]
  };
  return translations[stateCode] || [400, 200];
}

export default Heatmap;