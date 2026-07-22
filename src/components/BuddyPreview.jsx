import { forwardRef } from "react";
import CardPreview from "./CardPreview";

/**
 * BuddyPreview is the "Buddy Team" card: the current user plus
 * their two matched buddies, placed side by side. Per design
 * review, each buddy keeps their full individual Buddy Card
 * unchanged (avatar, name, interests, rituals, contribute, need)
 * — this component adds no extra chrome, it just lays out three
 * real CardPreview instances in a row. That also means any future
 * change to the card design (KVHeader, colors, sections) applies
 * automatically to the Buddy Team export too, with zero duplicated
 * code to keep in sync.
 *
 * The exported image is therefore 3x the WIDTH of a single card,
 * same height (config.BUDDY_EXPORT_WIDTH x config.BUDDY_EXPORT_HEIGHT).
 */
const BuddyPreview = forwardRef(function BuddyPreview({ members, scale = 1 }, ref) {
  return (
    <div ref={ref} className="flex" style={{ gap: 0 }}>
      {members.map((member, i) => (
        <CardPreview key={member?.domain || i} user={member || {}} scale={scale} />
      ))}
    </div>
  );
});

export default BuddyPreview;
