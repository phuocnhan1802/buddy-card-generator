import { useRef, useState } from "react";
import config from "../config";
import { isValidRitualText } from "../utils/validators";

let idCounter = 0;
const nextId = () => `ritual-${Date.now()}-${idCounter++}`;

/**
 * "My Rituals" editor: each ritual is { id, emoji, text }.
 * Supports add, delete, and native HTML5 drag & drop reordering.
 * Enforces a minimum of config.REQUIRED_RITUAL_COUNT (default 3).
 */
export default function RitualEditor({ value = [], onChange }) {
  const [draftEmoji, setDraftEmoji] = useState(config.DEFAULT_EMOJI_LIST[0]);
  const [draftText, setDraftText] = useState("");
  const dragIndex = useRef(null);

  const minRequired = config.REQUIRED_RITUAL_COUNT;
  const isBelowMinimum = value.length < minRequired;

  function addRitual() {
    if (!isValidRitualText(draftText)) return;
    onChange([...value, { id: nextId(), emoji: draftEmoji, text: draftText.trim() }]);
    setDraftText("");
  }

  function removeRitual(id) {
    onChange(value.filter((r) => r.id !== id));
  }

  function updateRitual(id, patch) {
    onChange(value.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function handleDragStart(index) {
    dragIndex.current = index;
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const reordered = [...value];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    dragIndex.current = index;
    onChange(reordered);
  }

  function handleDragEnd() {
    dragIndex.current = null;
  }

  return (
    <div>
      <ul className="flex flex-col gap-2 mb-3">
        {value.map((ritual, index) => (
          <li
            key={ritual.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className="flex items-center gap-2 bg-white border border-line rounded-sm px-2.5 py-2 cursor-grab active:cursor-grabbing group"
          >
            <span className="text-ink-soft/40 text-sm select-none" aria-hidden="true">
              ⠿
            </span>
            <select
              value={ritual.emoji}
              onChange={(e) => updateRitual(ritual.id, { emoji: e.target.value })}
              className="text-lg bg-transparent shrink-0"
              aria-label="Ritual emoji"
            >
              {config.DEFAULT_EMOJI_LIST.map((emoji) => (
                <option key={emoji} value={emoji}>
                  {emoji}
                </option>
              ))}
            </select>
            <textarea
              value={ritual.text}
              onChange={(e) => updateRitual(ritual.id, { text: e.target.value })}
              rows={1}
              className="flex-1 bg-transparent text-sm md:text-sm text-base focus:outline-none resize-none py-1"
            />
            <button
              type="button"
              onClick={() => removeRitual(ritual.id)}
              aria-label="Remove ritual"
              className="text-ink-soft/50 hover:text-danger transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {isBelowMinimum && (
        <p className="text-xs text-coral-dark mb-3">
          Add at least {minRequired} rituals ({minRequired - value.length} more to go).
        </p>
      )}

      <div className="flex gap-2">
        <select
          value={draftEmoji}
          onChange={(e) => setDraftEmoji(e.target.value)}
          className="text-lg rounded-sm border border-line px-2 bg-white"
          aria-label="New ritual emoji"
        >
          {config.DEFAULT_EMOJI_LIST.map((emoji) => (
            <option key={emoji} value={emoji}>
              {emoji}
            </option>
          ))}
        </select>
        <textarea
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addRitual();
            }
          }}
          rows={1}
          placeholder="vd: Monthly 1:1"
          className="flex-1 rounded-sm border border-line px-3.5 py-2 text-base md:text-sm focus:border-violet resize-none"
        />
        <button
          type="button"
          onClick={addRitual}
          className="px-4 py-2 rounded-sm bg-ink text-white text-sm font-semibold hover:bg-ink/90 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
