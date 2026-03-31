"use client";

interface KiviatChartProps {
  meaning?: number;
  existentialDread?: number;
  connection?: number;
  authenticity?: number;
  size?: number;
  showLabels?: boolean;
}

export default function KiviatChart({
  meaning,
  existentialDread,
  connection,
  authenticity,
  size = 200,
  showLabels = true
}: KiviatChartProps) {
  const center = size / 2;
  const radius = size / 2 - 40;
  const levels = 5; // Number of concentric circles

  // Provide default value of 5 for any undefined metrics
  const safeValue = (value: number | undefined) => (value ?? 5);

  // Calculate points for the four axes
  const axes = [
    { label: "Meaning", value: safeValue(meaning), angle: 0, color: "#a855f7" }, // purple
    { label: "Connection", value: safeValue(connection), angle: 90, color: "#ec4899" }, // pink
    { label: "Authenticity", value: safeValue(authenticity), angle: 180, color: "#6366f1" }, // indigo
    { label: "Dread", value: safeValue(existentialDread), angle: 270, color: "#eab308" }, // yellow
  ];

  // Convert polar to cartesian coordinates
  const polarToCartesian = (angle: number, distance: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: center + distance * Math.cos(radians),
      y: center + distance * Math.sin(radians),
    };
  };

  // Generate points for the data polygon
  const dataPoints = axes.map(axis => {
    const distance = (axis.value / 10) * radius;
    return polarToCartesian(axis.angle, distance);
  });

  const dataPolygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background circles */}
        {Array.from({ length: levels }).map((_, i) => {
          const r = ((i + 1) / levels) * radius;
          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Axis lines */}
        {axes.map((axis, i) => {
          const end = polarToCartesian(axis.angle, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#4b5563"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={dataPolygonPoints}
          fill="url(#kiviat-gradient)"
          fillOpacity={0.4}
          stroke="#67e8f9"
          strokeWidth="2"
          strokeOpacity={0.8}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={axes[i].color}
            stroke="#1f2937"
            strokeWidth="2"
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <radialGradient id="kiviat-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
          </radialGradient>
        </defs>
      </svg>

      {/* Labels */}
      {showLabels && (
        <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
          {axes.map((axis, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: axis.color }}
              />
              <span className="text-gray-300">{axis.label}</span>
              <span className="text-gray-400 font-mono">{axis.value}/10</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
