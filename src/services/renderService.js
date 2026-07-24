/**
 * renderService.js
 * ------------------------------------------------------------
 * Turns a live DOM card (rendered by CardPreview / BuddyPreview)
 * into a high-resolution PNG using html2canvas, then hands it to
 * the person via:
 *   1. The native Web Share sheet (navigator.share with a file) —
 *      on mobile this is the closest thing to "save directly to
 *      Photos": the OS share sheet has a one-tap "Save Image"
 *      action. There is no browser API that can silently write to
 *      the camera roll without this user-facing step — that's an
 *      intentional OS privacy boundary, not a limitation of this app.
 *   2. A plain <a download> link as a fallback, for desktop
 *      browsers or any browser without navigator.share/canShare
 *      support for files.
 *
 * Rendering logic is intentionally separate from the API layer:
 * this file knows nothing about Google Sheets, and googleApi.js
 * knows nothing about pixels.
 * ------------------------------------------------------------
 */
import html2canvas from "html2canvas";
import config from "../config";

/**
 * Renders `node` (a DOM element sized at its natural on-screen
 * preview dimensions — whatever `scale` it's currently displayed
 * at) to a PNG at the exact `exportWidth` x `exportHeight`, then
 * shares/downloads it as `filename`.
 */
export async function exportNodeAsPng(node, { exportWidth, exportHeight, filename }) {
  if (!node) throw new Error("Nothing to export yet.");

  const rect = node.getBoundingClientRect();
  const scale = exportWidth / rect.width;

  const canvas = await html2canvas(node, {
    scale,
    backgroundColor: "#ffffff",
    useCORS: true,
    width: rect.width,
    height: rect.height,
  });

  // Ensure the final bitmap matches the exact requested export size
  // (guards against rounding drift from the scale factor above),
  // regardless of what scale the card was displayed at on screen.
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = exportWidth;
  finalCanvas.height = exportHeight;
  const ctx = finalCanvas.getContext("2d");
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, exportWidth, exportHeight);

  const blob = await canvasToBlob(finalCanvas);
  await shareOrDownloadBlob(blob, filename);
  return finalCanvas.toDataURL("image/png", 1.0);
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not generate image."))), "image/png", 1.0);
  });
}

/**
 * Tries the native share sheet first (best mobile experience —
 * has a direct "Save Image" action). Falls back to a normal
 * download link if the browser doesn't support sharing files.
 */
async function shareOrDownloadBlob(blob, filename) {
  const file = new File([blob], filename, { type: "image/png" });

  const canUseShare =
    typeof navigator !== "undefined" &&
    navigator.canShare &&
    navigator.canShare({ files: [file] }) &&
    navigator.share;

  if (canUseShare) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (err) {
      // Person cancelled the share sheet, or the share failed for
      // some other reason — fall through to a plain download so
      // they still get the image.
      if (err?.name === "AbortError") return; // they explicitly cancelled, don't force a download too
    }
  }

  downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Convenience helper for the Personal Card download (Step 2). */
export async function downloadPersonalCard(node, userName) {
  return exportNodeAsPng(node, {
    exportWidth: config.EXPORT_WIDTH,
    exportHeight: config.EXPORT_HEIGHT,
    filename: `buddy-card-${slugify(userName)}.png`,
  });
}

/** Convenience helper for the Buddy Team download (Step 3). */
export async function downloadBuddyTeam(node, names) {
  return exportNodeAsPng(node, {
    exportWidth: config.BUDDY_EXPORT_WIDTH,
    exportHeight: config.BUDDY_EXPORT_HEIGHT,
    filename: `buddy-team-${names.map(slugify).join("-")}.png`,
  });
}

function slugify(text = "user") {
  return text.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "user";
}
