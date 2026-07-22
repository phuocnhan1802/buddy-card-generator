import { useState } from "react";
import config from "../config";
import { isValidInterest } from "../utils/validators";

/**
 * Rounded, deletable interest tags. Unlimited count, per spec.
 * Also offers a few one-tap suggestions to speed up input.
 */
export default function InterestTags({ value = [], onChange }) {
  const [draft, setDraft] = useState("");

  function addInterest(text) {
    const trimmed = text.trim();
    if (!isValidInterest(trimmed)) return;
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) return; // no duplicates
    onChange([...value, trimmed]);
    setDraft("");
  }

  function removeInterest(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addInterest(draft);
    }
  }

  const suggestions = ["Running", "Coffee", "Travel", "Music", "Reading"].filter(
    (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((interest, i) => (
          <span
            key={`${interest}-${i}`}
            className="inline-flex items-center gap-1.5 bg-coral/10 text-coral-dark text-sm font-medium pl-3 pr-1.5 py-1 rounded-full"
          >
            {interest}
            <button
              type="button"
              onClick={() => removeInterest(i)}
              aria-label={`Remove ${interest}`}
              className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-coral/20 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={config.MAX_INTEREST_LENGTH}
          placeholder="Add an interest and press Enter"
          className="flex-1 rounded-sm border border-line px-3.5 py-2 text-sm focus:border-violet"
        />
        <button
          type="button"
          onClick={() => addInterest(draft)}
          className="px-4 py-2 rounded-sm bg-ink text-white text-sm font-semibold hover:bg-ink/90 transition-colors"
        >
          Add
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addInterest(s)}
              className="text-xs text-ink-soft border border-dashed border-line rounded-full px-2.5 py-1 hover:border-ink/40 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
