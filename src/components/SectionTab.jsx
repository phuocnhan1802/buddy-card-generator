import config from "../config";

const C = config.KV_THEME.colors;

/**
 * The small flag-shaped label that sits on top of each white
 * section card — e.g. a blue tab with a heart icon for
 * "INTERESTS", a neon-green tab with a star for "RITUALS".
 *
 * `tone` picks the tab's background/text pairing:
 *  - "blue"  → blue background, white text/icon
 *  - "green" → neon green background, dark navy text/icon (for contrast)
 */
export default function SectionTab({ icon: Icon, label, tone = "blue", fontSize, iconSize, padY, padX }) {
  const bg = tone === "green" ? C.neonGreen : C.blue;
  const fg = tone === "green" ? C.blueDark : C.white;

  return (
    <div
      className="inline-flex items-center font-bold uppercase tracking-wide"
      style={{
        background: bg,
        color: fg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize,
        padding: `${padY}px ${padX}px`,
        borderRadius: `${padY * 0.7}px ${padY * 0.7}px ${padY * 0.7}px 0px`,
        gap: iconSize * 0.4,
      }}
    >
      <Icon size={iconSize} color={fg} fill={fg} strokeWidth={1.5} />
      {label}
    </div>
  );
}
