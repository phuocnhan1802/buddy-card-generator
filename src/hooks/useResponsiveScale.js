import { useEffect, useState } from "react";

/**
 * Returns a scale factor (0, 1] so that a card of `naturalWidth` px
 * always fits within the current viewport (minus side padding).
 * Never scales UP past 1 — only shrinks on narrow screens.
 *
 * This only affects how big the card is drawn ON SCREEN. The PNG
 * export is unaffected: renderService always re-renders the export
 * at the exact configured EXPORT_WIDTH/HEIGHT regardless of what
 * scale the preview is currently displayed at.
 */
export function useResponsiveScale(naturalWidth, sidePadding = 32) {
  const getScale = () => {
    if (typeof window === "undefined") return 1;
    const available = window.innerWidth - sidePadding * 2;
    return Math.min(1, available / naturalWidth);
  };

  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    function handleResize() {
      setScale(getScale());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [naturalWidth, sidePadding]);

  return scale;
}
