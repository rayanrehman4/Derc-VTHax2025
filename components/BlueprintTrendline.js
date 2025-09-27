import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";

// Mock affordability index data points (similar to real housing trends)
const points = [90, 94, 100, 108, 103, 110, 118, 121, 116, 124, 129, 132];

export default function BlueprintTrendline() {
  const { ref, inView } = useInView({ rootMargin: "0px 0px -20% 0px", threshold: 0.25 });
  const [progress, setProgress] = useState(0); // 0..1 for parallax

  const wrapRef = useRef(null);
  useEffect(() => {
    if (!wrapRef.current) return;
    const handle = () => {
      const r = wrapRef.current.getBoundingClientRect();
      const h = window.innerHeight || 1;
      const p = 1 - Math.min(1, Math.max(0, (r.top + r.height * 0.4) / (h + r.height * 0.4)));
      setProgress(p); // smooth 0..1
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  // Build the path from points
  const { path, area } = useMemo(() => {
    const W = 1000, H = 240, pad = 24;
    const dx = (W - pad * 2) / (points.length - 1);
    const min = Math.min(...points), max = Math.max(...points);
    const scaleY = v => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);

    const coords = points.map((v, i) => [pad + i * dx, scaleY(v)]);
    const d = coords.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");
    const a = `${d} L ${pad + (points.length - 1) * dx} ${H - pad} L ${pad} ${H - pad} Z`;
    return { path: d, area: a };
  }, []);

  // Animation for stroke draw
  const [dash, setDash] = useState({ len: 0, off: 0 });
  const pathRef = useRef(null);
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const length = el.getTotalLength();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDash({ len: length, off: 0 });
      return;
    }
    if (inView) {
      setDash({ len: length, off: length });
      const id = requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 900ms ease-out";
        setDash({ len: length, off: 0 });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [inView]);

  const reduceMotion = typeof window !== "undefined" &&
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const parallax = v => (reduceMotion ? 0 : v);

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Housing Affordability <span className="gradient-text">Trends</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Visualizing the evolution of housing costs across America's major markets
          </p>
        </div>

        <div
          ref={wrapRef}
          className="relative isolate overflow-hidden rounded-2xl border border-gray-800/60 bg-gray-950/60 shadow-lg shadow-black/30"
          aria-hidden="true"
        >
          {/* Blueprint grid layer */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              transform: `translateY(${parallax((progress - 0.5) * 16)}px)`,
              backgroundImage:
                "linear-gradient(transparent 95%, rgba(59,130,246,0.10) 96%), linear-gradient(90deg, transparent 95%, rgba(59,130,246,0.10) 96%)",
              backgroundSize: "28px 28px, 28px 28px",
              backgroundPosition: "0 0, 0 0",
              maskImage: "radial-gradient(120% 80% at 50% 50%, #000 60%, transparent 100%)",
            }}
          />

          {/* House outline layer */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full"
            viewBox="0 0 1000 240"
            style={{ transform: `translateY(${parallax((0.5 - progress) * 10)}px)` }}
          >
            <g stroke="#7dd3fc20" strokeWidth="1.5" fill="none">
              {/* House 1 */}
              <path d="M150 170 L250 90 L350 170" />
              <rect x="190" y="120" width="70" height="50" rx="2" />
              <rect x="265" y="130" width="45" height="40" rx="2" />
              <circle cx="210" cy="140" r="3" opacity="0.6" />
              
              {/* House 2 */}
              <path d="M600 170 L680 115 L760 170" />
              <rect x="625" y="130" width="40" height="40" rx="2" />
              <rect x="690" y="135" width="50" height="35" rx="2" />
              <circle cx="645" cy="150" r="3" opacity="0.6" />
              
              {/* Additional architectural elements */}
              <path d="M100 180 L900 180" opacity="0.3" />
              <path d="M120 190 L880 190" opacity="0.2" />
            </g>
          </svg>

          {/* Trendline layer */}
          <div
            ref={ref}
            className="relative px-6 sm:px-10 py-12"
            style={{ transform: `translateY(${parallax((progress - 0.5) * -8)}px)` }}
          >
            <svg viewBox="0 0 1000 240" className="w-full h-[240px]">
              <defs>
                <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid lines for reference */}
              <g stroke="#374151" strokeWidth="0.5" opacity="0.3">
                <line x1="24" y1="60" x2="976" y2="60" />
                <line x1="24" y1="120" x2="976" y2="120" />
                <line x1="24" y1="180" x2="976" y2="180" />
              </g>

              {/* Filled area under the line */}
              <path d={area} fill="url(#lineFill)" opacity="0.9" />

              {/* Line path (animated) */}
              <path
                ref={pathRef}
                d={path}
                stroke="#22c55e"
                strokeWidth="3"
                fill="none"
                filter="url(#glow)"
                strokeDasharray={dash.len}
                strokeDashoffset={dash.off}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {inView && points.map((_, i) => {
                const x = 24 + i * ((1000 - 48) / (points.length - 1));
                const y = 240 - 24 - ((points[i] - Math.min(...points)) / (Math.max(...points) - Math.min(...points) || 1)) * (240 - 48);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#22c55e"
                    stroke="#ffffff"
                    strokeWidth="2"
                    opacity="0.9"
                    style={{
                      animation: reduceMotion ? 'none' : `fadeIn 0.3s ease-out ${i * 0.1 + 0.5}s both`
                    }}
                  />
                );
              })}
            </svg>

            {/* Labels */}
            <div className="absolute bottom-4 left-6 text-sm text-gray-400">
              <span>2014</span>
            </div>
            <div className="absolute bottom-4 right-6 text-sm text-gray-400">
              <span>2024</span>
            </div>
            <div className="absolute top-4 left-6 text-sm text-gray-400">
              <span>Affordability Index</span>
            </div>
          </div>

          {/* Soft vignette edges */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
        </div>
      </div>
    </section>
  );
}