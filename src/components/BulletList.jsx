import { ChevronsRight } from "lucide-react";
import config from "../config";

const C = config.KV_THEME.colors;

/**
 * Renders `items` as a bullet list using the KV double-chevron
 * marker (matching the reference design) instead of a plain dot.
 */
export default function BulletList({ items, tone = "blue", fontSize, iconSize, gap }) {
  const iconColor = tone === "green" ? C.neonGreen : C.blue;

  return (
    <ul className="flex flex-col" style={{ gap }}>
      {items.map((text, i) => (
        <li key={i} className="flex items-start" style={{ gap: iconSize * 0.5 }}>
          <ChevronsRight size={iconSize} color={iconColor} strokeWidth={3} style={{ marginTop: fontSize * 0.15, flexShrink: 0 }} />
          <span style={{ fontSize, color: C.ink, lineHeight: 1.35 }}>{text}</span>
        </li>
      ))}
    </ul>
  );
}
