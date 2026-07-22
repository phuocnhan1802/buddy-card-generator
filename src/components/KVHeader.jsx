import config from "../config";

const C = config.KV_THEME.colors;

/** The two-tone chevron-up icon used throughout the KV (arrow motif). */
function KVArrow({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M50 10 L90 45 L90 65 L50 35 L10 65 L10 45 Z" fill={C.blue} />
      <path d="M50 30 L88 63 L88 80 L50 52 L12 80 L12 63 Z" fill={C.neonGreen} />
    </svg>
  );
}

/**
 * KVHeader renders the "MD 2026 · MANAGER MAKES MOVERS" eyebrow
 * ribbon and the big slanted "BUDDY CARD" title block, matching
 * the Manager Makes Movers key visual's banner treatment.
 */
export default function KVHeader({ width }) {
  const skew = -8;
  const eyebrowFont = width * 0.028;
  const titleFont = width * 0.075;
  const arrowSize = width * 0.14;

  return (
    <div className="relative" style={{ paddingRight: arrowSize * 0.5 }}>
      {/* Eyebrow ribbon */}
      <div
        className="inline-flex items-center font-bold whitespace-nowrap"
        style={{
          transform: `skewX(${skew}deg)`,
          background: C.blue,
          padding: `${width * 0.014}px ${width * 0.035}px`,
          borderRadius: `${width * 0.008}px`,
          marginBottom: width * 0.012,
        }}
      >
        <span style={{ transform: `skewX(${-skew}deg)`, display: "inline-block", fontSize: eyebrowFont, color: C.white }}>
          MD 2026&nbsp;·&nbsp;
        </span>
        <span
          style={{
            transform: `skewX(${-skew}deg)`,
            display: "inline-block",
            fontSize: eyebrowFont,
            color: C.neonGreen,
            fontWeight: 700,
          }}
        >
          MANAGER MAKES MOVERS
        </span>
      </div>

      {/* Title block + arrow */}
      <div className="flex items-start" style={{ gap: width * 0.02 }}>
        <div
          style={{
            transform: `skewX(${skew}deg)`,
            background: C.blue,
            padding: `${width * 0.012}px ${width * 0.04}px`,
            borderRadius: `${width * 0.01}px`,
          }}
        >
          <span
            className="font-kv font-bold uppercase"
            style={{
              transform: `skewX(${-skew}deg)`,
              display: "inline-block",
              fontSize: titleFont,
              color: C.white,
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            Buddy Card
          </span>
        </div>
        <div style={{ marginTop: -arrowSize * 0.15 }}>
          <KVArrow size={arrowSize} />
        </div>
      </div>
    </div>
  );
}
