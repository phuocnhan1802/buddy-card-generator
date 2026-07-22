import { useRef, useState } from "react";
import config from "../config";
import { processAvatarFile } from "../utils/imageUtils";

/**
 * Handles avatar upload end-to-end: accepts JPG/PNG/HEIC, then
 * automatically crops to a square, resizes, and compresses before
 * handing a ready-to-use base64 data URL back to the parent via
 * onChange. The parent doesn't need to know any of that happened.
 */
export default function AvatarUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      const dataUrl = await processAvatarFile(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || "Could not process that image.");
    } finally {
      setLoading(false);
      e.target.value = ""; // allow re-selecting the same file
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 rounded-full overflow-hidden border border-line bg-canvas shrink-0">
          <img
            src={value || config.DEFAULT_AVATAR_PATH}
            alt="Your avatar"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = config.DEFAULT_AVATAR_PATH;
            }}
          />
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="h-4 w-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm font-semibold text-violet hover:text-violet-dark transition-colors underline underline-offset-2"
          >
            {value ? "Change photo" : "Upload photo"}
          </button>
          <span className="text-xs text-ink-soft">JPG, PNG, or HEIC — auto-cropped &amp; compressed</span>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
