/**
 * imageUtils.js
 * ------------------------------------------------------------
 * Handles avatar upload processing: HEIC → JPEG conversion,
 * square crop, resize, and compression down to a base64 data
 * URL small enough to store in a single Google Sheet cell.
 * ------------------------------------------------------------
 */
import config from "../config";

/**
 * Takes a raw File from an <input type="file">, and returns a
 * compressed, square, base64 data URL ready to preview and save.
 */
export async function processAvatarFile(file) {
  if (!config.ACCEPTED_AVATAR_TYPES.includes(file.type) && !isHeicByName(file.name)) {
    throw new Error("Please upload a JPG, PNG, or HEIC image.");
  }

  let workingFile = file;

  // HEIC/HEIF isn't renderable by <canvas> in most browsers, so we
  // convert it to JPEG first using heic2any (loaded lazily so it
  // doesn't bloat the bundle for the common JPG/PNG case).
  if (isHeic(file)) {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    workingFile = converted instanceof Blob ? converted : converted[0];
  }

  const image = await loadImage(workingFile);
  const squareCanvas = cropToSquare(image, config.AVATAR_OUTPUT_SIZE);
  return compressToTargetSize(squareCanvas);
}

function isHeic(file) {
  return file.type === "image/heic" || file.type === "image/heif" || isHeicByName(file.name);
}

function isHeicByName(name = "") {
  return /\.(heic|heif)$/i.test(name);
}

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image file."));
    };
    img.src = url;
  });
}

/** Crops the image to a centered square and draws it at `outputSize`px. */
function cropToSquare(image, outputSize) {
  const side = Math.min(image.width, image.height);
  const sx = (image.width - side) / 2;
  const sy = (image.height - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, sx, sy, side, side, 0, 0, outputSize, outputSize);
  return canvas;
}

/**
 * Compresses a canvas to JPEG, stepping quality down until the
 * resulting base64 string fits under AVATAR_MAX_BASE64_LENGTH
 * (so it safely fits in a single Google Sheet cell).
 */
function compressToTargetSize(canvas) {
  let quality = config.AVATAR_JPEG_QUALITY_START;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);

  while (dataUrl.length > config.AVATAR_MAX_BASE64_LENGTH && quality > config.AVATAR_JPEG_QUALITY_MIN) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  if (dataUrl.length > config.AVATAR_MAX_BASE64_LENGTH) {
    throw new Error("This image is too large even after compression. Please try a simpler photo.");
  }

  return dataUrl;
}
