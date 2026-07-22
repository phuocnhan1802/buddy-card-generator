/**
 * renderService.js
 * ------------------------------------------------------------
 * Turns a live DOM card (rendered by CardPreview / BuddyPreview)
 * into a downloadable high-resolution PNG using html2canvas.
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
 * preview dimensions) to a PNG at `exportWidth` x `exportHeight`,
 * then triggers a browser download named `filename`.
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
  // (guards against rounding drift from the scale factor above).
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = exportWidth;
  finalCanvas.height = exportHeight;
  const ctx = finalCanvas.getContext("2d");
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, exportWidth, exportHeight);

  const dataUrl = finalCanvas.toDataURL("image/png", 1.0);
  downloadDataUrl(dataUrl, filename);
  return dataUrl;
}

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
