import { forwardRef } from "react";
import { Heart, Star, Users, Flag } from "lucide-react";
import config from "../config";
import KVBackdrop from "./KVBackdrop";
import KVHeader from "./KVHeader";
import SectionTab from "./SectionTab";
import BulletList from "./BulletList";

const C = config.KV_THEME.colors;

/** Small neon "spark" tick marks flanking the avatar, like the KV's motion lines. */
function Spark({ size, rotate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ transform: `rotate(${rotate}deg)` }}>
      <line x1="8" y1="32" x2="20" y2="8" stroke={C.neonGreen} strokeWidth="5" strokeLinecap="round" />
      <line x1="20" y1="34" x2="32" y2="16" stroke={C.neonGreen} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** Splits a free-text textarea value into non-empty bullet lines. */
function toBullets(text) {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * CardPreview renders a SINGLE person's Buddy Card in the Manager
 * Makes Movers key-visual style. Not a static image — every field
 * is drawn live from `user`, and this exact component is used both
 * for the on-screen preview (Step 1 & 2) and, via a ref, as the
 * html2canvas export source. BuddyPreview (Step 3) simply places
 * three of these side by side, so the individual and team cards
 * are always visually identical.
 *
 * Colors/spacing come from config.KV_THEME — edit config.js to
 * re-theme without touching this file.
 */
const CardPreview = forwardRef(function CardPreview({ user, scale = 1 }, ref) {
  const width = config.CARD_PREVIEW_WIDTH * scale;
  const height = config.CARD_PREVIEW_HEIGHT * scale;

  const interests = user.interests || [];
  const rituals = user.rituals || [];
  const contributeLines = toBullets(user.contribute);
  const needLines = toBullets(user.need);

  // Lightweight auto-shrink heuristic: if there's a lot more
  // content than the "comfortable" baseline, scale font sizes
  // down (never below KV_MIN_SCALE) so the fixed 1080x1920 canvas
  // never has to crop or overflow content.
  const { baselineInterests, baselineRitualLines, baselineGiveGetLines } = config.KV_THEME;
  const contentLoad = interests.length * 0.4 + rituals.length + contributeLines.length + needLines.length;
  const baselineLoad = baselineInterests * 0.4 + baselineRitualLines + baselineGiveGetLines;
  const fit = Math.max(config.KV_MIN_SCALE, Math.min(0.97, baselineLoad / Math.max(contentLoad, 1)));

  const s = {
    pad: width * 0.055,
    avatar: width * 0.26,
    name: width * 0.058 * fit,
    handle: width * 0.032 * fit,
    tabFont: width * 0.03,
    tabIcon: width * 0.032,
    tabPadY: width * 0.014,
    tabPadX: width * 0.024,
    chip: width * 0.032 * fit,
    body: width * 0.032 * fit,
    bulletIcon: width * 0.028,
    sectionGap: width * 0.035,
  };

  const hasInterests = interests.length > 0;
  const hasRituals = rituals.length > 0;
  const hasContribute = contributeLines.length > 0;
  const hasNeed = needLines.length > 0;

  return (
    <div
      ref={ref}
      style={{ width, height, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="relative overflow-hidden rounded-lg shadow-lifted"
    >
      <KVBackdrop width={width} height={height} />

      <div className="relative h-full w-full flex flex-col" style={{ padding: s.pad }}>
        <KVHeader width={width} />

        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center" style={{ margin: `${s.pad * 0.6}px 0 ${s.pad * 0.45}px` }}>
          <div className="relative" style={{ width: s.avatar, height: s.avatar }}>
            <div className="absolute" style={{ left: -s.avatar * 0.35, top: -s.avatar * 0.12 }}>
              <Spark size={s.avatar * 0.3} rotate={0} />
            </div>
            <div className="absolute" style={{ right: -s.avatar * 0.35, bottom: -s.avatar * 0.08 }}>
              <Spark size={s.avatar * 0.3} rotate={180} />
            </div>
            <div
              className="h-full w-full rounded-full overflow-hidden bg-white"
              style={{ border: `${s.avatar * 0.045}px solid ${C.neonGreen}`, boxShadow: "0 8px 20px rgba(15,27,77,0.25)" }}
            >
              <div className="h-full w-full rounded-full overflow-hidden" style={{ border: `${s.avatar * 0.04}px solid white` }}>
                <img
                  src={user.avatar || config.DEFAULT_AVATAR_PATH}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.src = config.DEFAULT_AVATAR_PATH)}
                />
              </div>
            </div>
          </div>

          <p className="font-extrabold leading-tight" style={{ fontSize: s.name, color: C.blue, marginTop: s.pad * 0.5 }}>
            {user.name || "Your Name"}
          </p>
          {user.domain && (
            <p className="font-mono font-medium" style={{ fontSize: s.handle, color: C.blue, opacity: 0.85 }}>
              @{user.domain.split("@")[0]}
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="flex flex-col" style={{ gap: s.sectionGap, marginTop: s.pad * 0.3 }}>
          {hasInterests && (
            <Section tone="blue" icon={Heart} label="Interests" s={s}>
              <div className="flex flex-wrap" style={{ gap: s.pad * 0.3 }}>
                {interests.map((interest, i) => (
                  <span
                    key={i}
                    className="rounded-full font-bold"
                    style={{
                      fontSize: s.chip,
                      color: C.blue,
                      background: "white",
                      border: `${width * 0.003}px solid ${C.blue}`,
                      padding: `${s.pad * 0.22}px ${s.pad * 0.5}px`,
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {hasRituals && (
            <Section tone="green" icon={Star} label="Rituals" s={s}>
              <BulletList
                items={rituals.map((r) => `${r.emoji} ${r.text}`)}
                tone="green"
                fontSize={s.body}
                iconSize={s.bulletIcon}
                gap={s.pad * 0.28}
              />
            </Section>
          )}

          {(hasContribute || hasNeed) && (
            <div className="flex" style={{ gap: s.pad * 0.4 }}>
              {hasContribute && (
                <div className="flex-1 min-w-0">
                  <Section tone="blue" icon={Users} label="Contribute" s={s}>
                    <BulletList
                      items={contributeLines}
                      tone="blue"
                      fontSize={s.body}
                      iconSize={s.bulletIcon}
                      gap={s.pad * 0.28}
                    />
                  </Section>
                </div>
              )}
              {hasNeed && (
                <div className="flex-1 min-w-0">
                  <Section tone="green" icon={Flag} label="Need" s={s}>
                    <BulletList items={needLines} tone="green" fontSize={s.body} iconSize={s.bulletIcon} gap={s.pad * 0.28} />
                  </Section>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
});

/** One white content card with its colored flag-tab header, per the KV section style. */
function Section({ tone, icon, label, s, children }) {
  return (
    <div>
      <SectionTab icon={icon} label={label} tone={tone} fontSize={s.tabFont} iconSize={s.tabIcon} padY={s.tabPadY} padX={s.tabPadX} />
      <div
        className="bg-white"
        style={{
          borderRadius: `${s.pad * 0.4}px`,
          borderTopLeftRadius: 0,
          padding: s.pad * 0.42,
          boxShadow: "0 6px 16px rgba(15,27,77,0.08)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default CardPreview;
