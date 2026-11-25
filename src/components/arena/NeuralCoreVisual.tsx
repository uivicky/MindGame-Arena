export function NeuralCoreVisual({
  playerLevel,
  xpPct,
}: {
  playerLevel: number;
  xpPct: number;
}) {
  const nodes = [
    { x: 160, y: 42 },
    { x: 244, y: 76 },
    { x: 278, y: 160 },
    { x: 244, y: 244 },
    { x: 160, y: 278 },
    { x: 76, y: 244 },
    { x: 42, y: 160 },
    { x: 76, y: 76 },
  ];

  return (
    <div className="relative mx-auto w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center select-none">
      {/* Subtle radial ambient light */}
      <div
        aria-hidden="true"
        className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#F97316]/25 via-[#EA580C]/10 to-transparent blur-2xl animate-nf-pulse-ring"
      />

      {/* Outer rotating calibration ring */}
      <svg
        viewBox="0 0 320 320"
        className="absolute inset-0 w-full h-full animate-nf-orbit-slow"
        aria-hidden="true"
      >
        <circle
          cx="160"
          cy="160"
          r="146"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6 10"
          className="text-[#F97316]/35"
        />
        <circle
          cx="160"
          cy="160"
          r="134"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="48 160"
          className="text-[#F97316]/80"
        />
      </svg>

      {/* Inner counter-rotating geometric constellation */}
      <svg
        viewBox="0 0 320 320"
        className="absolute inset-0 w-full h-full animate-nf-orbit-reverse"
        aria-hidden="true"
      >
        <circle
          cx="160"
          cy="160"
          r="104"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 8"
          className="text-[#EA580C]/45"
        />
        {nodes.map((node, i) => {
          const next = nodes[(i + 3) % nodes.length];
          return (
            <g key={i}>
              <line
                x1={node.x}
                y1={node.y}
                x2={next.x}
                y2={next.y}
                stroke="currentColor"
                strokeWidth="0.9"
                className="text-[#F97316]/25"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={i % 2 === 0 ? 3.5 : 2.5}
                fill="currentColor"
                className={i % 2 === 0 ? 'text-[#F97316]' : 'text-[#FB923C]'}
              />
            </g>
          );
        })}
      </svg>

      {/* Central precision level gauge */}
      <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-[#F97316]/35 bg-[#111318]/95 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.18)]">
        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#A1A1AA]">
          Operator
        </span>
        <span className="mt-0.5 font-display text-3xl font-extrabold tracking-tight text-white tabular-nums">
          LVL {playerLevel}
        </span>
        <div className="mt-2.5 w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F97316] to-[#FB923C] transition-all duration-500"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <span className="mt-1.5 font-mono text-[10px] text-[#FB923C] tabular-nums">
          {xpPct}% TO LVL {playerLevel + 1}
        </span>
      </div>
    </div>
  );
}
