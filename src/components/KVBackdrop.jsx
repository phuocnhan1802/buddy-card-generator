import config from "../config";

const C = config.KV_THEME.colors;

/**
 * KVBackdrop draws the Manager Makes Movers background language —
 * light-blue-to-deep-blue sky, faint sparkle stars, translucent
 * arrow watermarks, a soft dot matrix, and a "floor" band with
 * receding chevrons — entirely with SVG/CSS so it scales cleanly
 * with the card and never needs a bitmap asset.
 *
 * All colors come from config.KV_THEME.colors, so re-theming the
 * whole Buddy Card only requires editing config.js.
 */
export default function KVBackdrop({ width, height }) {
  const floorTop = height * 0.78;

  // Deterministic sparkle + arrow positions (not random) so the
  // exported PNG is stable and repeatable between renders.
  const sparkles = [
    { x: width * 0.12, y: height * 0.06, s: width * 0.02 },
    { x: width * 0.88, y: height * 0.1, s: width * 0.014 },
    { x: width * 0.08, y: height * 0.32, s: width * 0.016 },
    { x: width * 0.92, y: height * 0.42, s: width * 0.012 },
  ];

  const watermarkArrows = [
    { x: width * 0.1, y: height * 0.22, s: width * 0.16, o: 0.06 },
    { x: width * 0.75, y: height * 0.3, s: width * 0.2, o: 0.05 },
    { x: width * 0.15, y: height * 0.52, s: width * 0.14, o: 0.05 },
    { x: width * 0.7, y: height * 0.6, s: width * 0.18, o: 0.05 },
  ];

  const floorRows = [
    { y: floorTop + height * 0.05, count: 4, s: width * 0.03, o: 0.5 },
    { y: floorTop + height * 0.1, count: 5, s: width * 0.04, o: 0.35 },
    { y: floorTop + height * 0.16, count: 6, s: width * 0.05, o: 0.22 },
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="kv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="60%" stopColor="#BFDBFF" />
          <stop offset="100%" stopColor={C.skyBottom} />
        </linearGradient>
        <linearGradient id="kv-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.blueLight} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.blueDark} />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width={width} height={height} fill="url(#kv-sky)" />

      {/* Faint dot matrix, lower-mid section */}
      <g opacity="0.12">
        {Array.from({ length: 10 }).map((_, row) =>
          Array.from({ length: 14 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={width * 0.04 + col * (width * 0.07)}
              y={height * 0.4 + row * (width * 0.07)}
              width={width * 0.012}
              height={width * 0.012}
              fill={C.blue}
            />
          ))
        )}
      </g>

      {/* Watermark arrows (chevrons), scattered */}
      {watermarkArrows.map((a, i) => (
        <path
          key={i}
          d={`M ${a.x} ${a.y + a.s} L ${a.x + a.s * 0.5} ${a.y} L ${a.x + a.s} ${a.y + a.s} L ${a.x + a.s * 0.75} ${a.y + a.s} L ${a.x + a.s * 0.5} ${a.y + a.s * 0.5} L ${a.x + a.s * 0.25} ${a.y + a.s} Z`}
          fill={C.blue}
          opacity={a.o}
        />
      ))}

      {/* Sparkle stars */}
      {sparkles.map((sp, i) => (
        <path
          key={i}
          d={`M ${sp.x} ${sp.y - sp.s} L ${sp.x + sp.s * 0.18} ${sp.y - sp.s * 0.18} L ${sp.x + sp.s} ${sp.y} L ${sp.x + sp.s * 0.18} ${sp.y + sp.s * 0.18} L ${sp.x} ${sp.y + sp.s} L ${sp.x - sp.s * 0.18} ${sp.y + sp.s * 0.18} L ${sp.x - sp.s} ${sp.y} L ${sp.x - sp.s * 0.18} ${sp.y - sp.s * 0.18} Z`}
          fill={C.white}
          opacity="0.8"
        />
      ))}

      {/* Floor band */}
      <rect x="0" y={floorTop} width={width} height={height - floorTop} fill="url(#kv-floor)" />
      {floorRows.map((row, ri) =>
        Array.from({ length: row.count }).map((_, i) => {
          const spacing = width / row.count;
          const x = spacing * i + spacing / 2;
          return (
            <path
              key={`${ri}-${i}`}
              d={`M ${x - row.s} ${row.y + row.s} L ${x} ${row.y} L ${x + row.s} ${row.y + row.s} L ${x + row.s * 0.6} ${row.y + row.s} L ${x} ${row.y + row.s * 0.45} L ${x - row.s * 0.6} ${row.y + row.s} Z`}
              fill={C.white}
              opacity={row.o}
            />
          );
        })
      )}
    </svg>
  );
}
