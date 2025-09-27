import { useState, useEffect } from "react";
import { useAssumptions } from "../context/AssumptionsContext";

const CountyModal = ({ isOpen, onClose, city, onAddToCompare }) => {
  const [counties, setCounties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { calculateRequiredIncome } = useAssumptions();

  useEffect(() => {
    if (isOpen && city) loadCounties();
  }, [isOpen, city]);

  const loadCounties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/data/counties.json`);
      const allData = await res.json();
      const cityKey = city.id; // must match keys in /public/data/counties.json
      const cityData = allData[cityKey] || { counties: [] };
      setCounties(cityData.counties);
    } catch (err) {
      console.error("Failed to load county data", err);
      setCounties([]);
    }
    setIsLoading(false);
  };

  // --- Sparkline helpers -----------------------------------------------------
  const generateSparkline = (trend) => {
    // Simple 12-point series; trend nudges the slope slightly
    const points = [];
    let v = 100;
    for (let i = 0; i < 12; i++) {
      v += (Math.random() - 0.5) * 8 + trend * 2;
      points.push(Math.max(80, Math.min(120, v)));
    }
    return points;
  };

  const SparklineChart = ({ data, positive }) => {
    // Responsive, padded sparkline that uses the full slot nicely
    const W = 160;      // drawing width
    const H = 48;       // drawing height
    const padX = 6;     // horizontal padding inside SVG
    const padY = 6;     // vertical padding inside SVG
    const drawW = W - padX * 2;
    const drawH = H - padY * 2;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const pts = data
      .map((val, i) => {
        const x = padX + (i / (data.length - 1)) * drawW;
        const y = H - padY - ((val - min) / range) * drawH;
        return `${x},${y}`;
      })
      .join(" ");

    const baseline = `${padX},${H - padY} ${pts} ${W - padX},${H - padY}`;

    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-40 h-12 justify-self-end"
      >
        <defs>
          <linearGradient id={`sparkFill${positive ? "Up" : "Down"}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={positive ? "#22c55e" : "#ef4444"} stopOpacity="0.28" />
            <stop offset="100%" stopColor={positive ? "#22c55e" : "#ef4444"} stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* fill area */}
        <polygon points={baseline} fill={`url(#sparkFill${positive ? "Up" : "Down"})`} />

        {/* line */}
        <polyline
          points={pts}
          fill="none"
          stroke={positive ? "#22c55e" : "#ef4444"}
          strokeWidth="2.25"
          strokeLinecap="round"
          className="opacity-90"
        />
      </svg>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">Best Counties</h2>
            <p className="text-gray-400 text-sm mt-1">
              Top affordable areas near {city?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-gray-800/70 animate-pulse" />
              ))}
            </div>
          ) : counties.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-gray-300 text-lg mb-1">No county data available</div>
              <div className="text-gray-500 text-sm">Try selecting a different city</div>
            </div>
          ) : (
            <div className="space-y-4 pr-1">
              {counties.map((county, index) => {
                const sparklineData = generateSparkline(county.price_trend ?? 0.05);
                const trendPositive = (county.price_trend ?? 0) <= 0.10; // lower/slower growth = greener

                return (
                  <div
                    key={county.fips}
                    className="bg-gray-800/50 border border-gray-700/60 rounded-lg p-4 hover:border-gray-600 transition-colors"
                  >
                    {/* grid: text on the left, sparkline on the right */}
                    <div className="grid grid-cols-[1fr_minmax(9rem,10rem)] items-center gap-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-white leading-tight">
                            {county.name}
                          </h3>
                        </div>

                        <div className="text-sm">
                          <div className="mb-2">
                            <span className="text-gray-400">Required Income: </span>
                            <span className="text-white font-medium">
                              ${county.required_income?.toLocaleString() ?? "N/A"}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">12-Month Trend:</span>
                            <span className={`font-medium ${trendPositive ? "text-green-400" : "text-red-400"}`}>
                              {county.price_trend != null
                                ? `${(county.price_trend * 100).toFixed(1)}%`
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <SparklineChart data={sparklineData} positive={trendPositive} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/40 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Rankings combine required income with recent price trends. Demo data only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountyModal;
