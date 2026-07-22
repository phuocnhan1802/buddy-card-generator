import { forwardRef, useState } from "react";
import config from "../config";

/**
 * CardPreview renders a SINGLE person's Buddy Card. It is not a
 * static image — every field is drawn live from `user`, so this
 * exact component is used both for the on-screen live preview
 * (Step 1 & 2) and, via a ref, as the source for the PNG export
 * (renderService.exportNodeAsPng, which upscales this exact layout
 * to config.EXPORT_WIDTH/HEIGHT via html2canvas's scale option).
 *
 * All sizes are computed in JS as a proportion of the card's width
 * so the layout scales cleanly if `scale` changes — CSS font-size
 * percentages are relative to the parent's font-size, not the
 * container's dimensions, so they can't be used here.
 *
 * Swap config.PERSONAL_CARD_TEMPLATE_PATH to re-skin the card
 * background without touching this file.
 */
const CardPreview = forwardRef(function CardPreview({ user, scale = 1 }, ref) {
  const [templateFailed, setTemplateFailed] = useState(false);
  const width = config.CARD_PREVIEW_WIDTH * scale;
  const height = config.CARD_PREVIEW_HEIGHT * scale;

  const s = {
    pad: width * 0.07,
    logo: width * 0.16,
    avatar: width * 0.28,
    name: width * 0.065,
    domain: width * 0.034,
    label: width * 0.032,
    tag: width * 0.035,
    body: width * 0.038,
  };

  const hasRituals = user.rituals && user.rituals.length > 0;
  const hasInterests = user.interests && user.interests.length > 0;

  return (
    <div
      ref={ref}
      style={{ width, height }}
      className="relative overflow-hidden rounded-lg shadow-lifted bg-gradient-to-b from-violet to-coral"
    >
      {!templateFailed && (
        <img
          src={config.PERSONAL_CARD_TEMPLATE_PATH}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setTemplateFailed(true)}
        />
      )}

      {/* Content overlay */}
      <div className="relative h-full w-full flex flex-col text-white" style={{ padding: s.pad }}>
        {/* Logo */}
        <img
          src={config.LOGO_PATH}
          alt=""
          style={{ height: s.logo * 0.4, marginBottom: s.pad * 0.6 }}
          className="w-auto self-start opacity-90"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />

        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center" style={{ gap: s.pad * 0.4, marginBottom: s.pad * 0.8 }}>
          <div
            style={{ width: s.avatar, height: s.avatar }}
            className="rounded-full overflow-hidden border-4 border-white/90 shadow-soft bg-white/20 shrink-0"
          >
            <img
              src={user.avatar || config.DEFAULT_AVATAR_PATH}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.src = config.DEFAULT_AVATAR_PATH)}
            />
          </div>
          <div>
            <p className="font-display font-extrabold leading-tight" style={{ fontSize: s.name }}>
              {user.name || "Your Name"}
            </p>
            <p className="opacity-80 font-mono" style={{ fontSize: s.domain }}>
              {user.domain}
            </p>
          </div>
        </div>

        {/* Interests */}
        {hasInterests && (
          <div style={{ marginBottom: s.pad * 0.7 }}>
            <p
              className="uppercase tracking-widest opacity-70 font-semibold"
              style={{ fontSize: s.label, marginBottom: s.pad * 0.25 }}
            >
              Interests
            </p>
            <div className="flex flex-wrap" style={{ gap: s.pad * 0.25 }}>
              {user.interests.map((interest, i) => (
                <span
                  key={i}
                  className="bg-white/20 rounded-full font-medium"
                  style={{ fontSize: s.tag, padding: `${s.pad * 0.18}px ${s.pad * 0.4}px` }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rituals */}
        {hasRituals && (
          <div style={{ marginBottom: s.pad * 0.7 }}>
            <p
              className="uppercase tracking-widest opacity-70 font-semibold"
              style={{ fontSize: s.label, marginBottom: s.pad * 0.25 }}
            >
              My Rituals
            </p>
            <ul className="flex flex-col" style={{ gap: s.pad * 0.15 }}>
              {user.rituals.map((r) => (
                <li key={r.id} className="flex items-start leading-snug" style={{ gap: s.pad * 0.25, fontSize: s.body }}>
                  <span>{r.emoji}</span>
                  <span>{r.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex-1" />

        {/* Contribute / Need */}
        {(user.contribute || user.need) && (
          <div className="flex flex-col mt-auto" style={{ gap: s.pad * 0.35 }}>
            {user.contribute && (
              <div className="bg-white/15 rounded-md" style={{ padding: s.pad * 0.45 }}>
                <p className="uppercase tracking-widest opacity-70 font-semibold" style={{ fontSize: s.label * 0.9 }}>
                  I can help with
                </p>
                <p className="leading-snug whitespace-pre-wrap" style={{ fontSize: s.body }}>
                  {user.contribute}
                </p>
              </div>
            )}
            {user.need && (
              <div className="bg-white/15 rounded-md" style={{ padding: s.pad * 0.45 }}>
                <p className="uppercase tracking-widest opacity-70 font-semibold" style={{ fontSize: s.label * 0.9 }}>
                  I'm looking for
                </p>
                <p className="leading-snug whitespace-pre-wrap" style={{ fontSize: s.body }}>
                  {user.need}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default CardPreview;
