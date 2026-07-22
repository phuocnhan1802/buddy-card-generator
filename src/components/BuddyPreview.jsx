import { forwardRef, useState } from "react";
import config from "../config";

/**
 * BuddyPreview renders the "Buddy Team" card: the current user plus
 * their two matched buddies. Per design review, this is NOT a
 * condensed summary — each buddy keeps their full individual-card
 * information (avatar, name, domain, interests, rituals, contribute,
 * need), stacked as 3 full-size sections. The exported image is
 * therefore 3x the height of a single card (config.BUDDY_EXPORT_HEIGHT),
 * not a shrunk composite.
 *
 * Like CardPreview, this is a live component (not a flattened image)
 * used both on-screen and as the html2canvas export source.
 */
const BuddyPreview = forwardRef(function BuddyPreview({ members, scale = 1 }, ref) {
  const [templateFailed, setTemplateFailed] = useState(false);
  const width = config.BUDDY_CARD_PREVIEW_WIDTH * scale;
  const height = config.BUDDY_CARD_PREVIEW_HEIGHT * scale;

  return (
    <div
      ref={ref}
      style={{ width, height }}
      className="relative overflow-hidden rounded-lg shadow-lifted bg-gradient-to-b from-ink to-violet flex flex-col"
    >
      {!templateFailed && (
        <img
          src={config.BUDDY_TEAM_TEMPLATE_PATH}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setTemplateFailed(true)}
        />
      )}

      <div className="relative flex flex-col h-full text-white" style={{ padding: width * 0.06 }}>
        <img
          src={config.LOGO_PATH}
          alt=""
          style={{ height: width * 0.07, marginBottom: width * 0.05 }}
          className="w-auto self-center opacity-90"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <p className="text-center font-display font-extrabold" style={{ fontSize: width * 0.05, marginBottom: width * 0.04 }}>
          Buddy Team
        </p>

        <div className="flex-1 flex flex-col min-h-0">
          {members.map((member, i) => (
            <MemberSection key={member?.domain || i} member={member} width={width} isFirst={i === 0} />
          ))}
        </div>

        <p
          className="text-center opacity-60 font-mono"
          style={{ fontSize: width * 0.028, marginTop: width * 0.03 }}
        >
          Manager Makes Movers
        </p>
      </div>
    </div>
  );
});

/** One buddy's full card content, sized to occupy one third of the total card. */
function MemberSection({ member, width, isFirst }) {
  const s = {
    avatar: width * 0.19,
    name: width * 0.053,
    domain: width * 0.034,
    label: width * 0.028,
    tag: width * 0.034,
    body: width * 0.036,
  };

  const hasInterests = member?.interests?.length > 0;
  const hasRituals = member?.rituals?.length > 0;

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{
        gap: width * 0.03,
        padding: `${width * 0.045}px 0`,
        borderTop: isFirst ? "none" : "1px solid rgba(255,255,255,0.25)",
      }}
    >
      <div className="flex items-center" style={{ gap: width * 0.035 }}>
        <div
          style={{ width: s.avatar, height: s.avatar }}
          className="rounded-full overflow-hidden border-2 border-white/90 shrink-0 bg-white/20 shadow-soft"
        >
          <img
            src={member?.avatar || config.DEFAULT_AVATAR_PATH}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => (e.currentTarget.src = config.DEFAULT_AVATAR_PATH)}
          />
        </div>
        <div className="min-w-0">
          <p className="font-display font-extrabold truncate" style={{ fontSize: s.name }}>
            {member?.name || "\u2014"}
          </p>
          <p className="opacity-80 font-mono truncate" style={{ fontSize: s.domain }}>
            {member?.domain || ""}
          </p>
        </div>
      </div>

      {hasInterests && (
        <div className="flex flex-wrap" style={{ gap: width * 0.015 }}>
          {member.interests.map((interest, i) => (
            <span
              key={i}
              className="bg-white/20 rounded-full font-medium"
              style={{ fontSize: s.tag, padding: `${width * 0.008}px ${width * 0.02}px` }}
            >
              {interest}
            </span>
          ))}
        </div>
      )}

      {hasRituals && (
        <ul className="flex flex-col" style={{ gap: width * 0.008 }}>
          {member.rituals.map((r) => (
            <li key={r.id} className="flex items-start leading-snug" style={{ gap: width * 0.015, fontSize: s.body }}>
              <span>{r.emoji}</span>
              <span>{r.text}</span>
            </li>
          ))}
        </ul>
      )}

      {(member?.contribute || member?.need) && (
        <div className="flex" style={{ gap: width * 0.02 }}>
          {member?.contribute && (
            <div className="flex-1 bg-white/15 rounded-md" style={{ padding: width * 0.02 }}>
              <p className="uppercase tracking-widest opacity-70 font-semibold" style={{ fontSize: s.label }}>
                Can help with
              </p>
              <p className="leading-snug" style={{ fontSize: s.body }}>
                {member.contribute}
              </p>
            </div>
          )}
          {member?.need && (
            <div className="flex-1 bg-white/15 rounded-md" style={{ padding: width * 0.02 }}>
              <p className="uppercase tracking-widest opacity-70 font-semibold" style={{ fontSize: s.label }}>
                Looking for
              </p>
              <p className="leading-snug" style={{ fontSize: s.body }}>
                {member.need}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BuddyPreview;
