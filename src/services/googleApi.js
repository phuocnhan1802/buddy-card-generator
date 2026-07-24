/**
 * googleApi.js
 * ------------------------------------------------------------
 * The ONLY place in the app that talks to Google Apps Script.
 * The website never touches the Google Sheet directly — every
 * read/write goes through the Apps Script Web App defined in
 * config.GOOGLE_SCRIPT_URL.
 *
 * All functions return plain JS objects/booleans and throw a
 * regular Error on failure so callers can show a friendly
 * message via try/catch.
 * ------------------------------------------------------------
 */
import config from "../config";

/** Wraps fetch with a timeout so a hung request doesn't hang the UI forever. */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.API_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return await response.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("The request timed out. Please check your connection and try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * GET ?action=findDomain&domain=abc
 * Returns true/false — used for lightweight existence checks
 * (e.g. while typing a buddy's domain).
 */
export async function findDomain(domain) {
  const url = `${config.GOOGLE_SCRIPT_URL}?action=findDomain&domain=${encodeURIComponent(domain)}`;
  const data = await fetchWithTimeout(url);
  return Boolean(data?.found);
}

/**
 * GET ?action=getUser&domain=abc
 * Returns the full user record, or null if not found.
 */
export async function getUser(domain) {
  const url = `${config.GOOGLE_SCRIPT_URL}?action=getUser&domain=${encodeURIComponent(domain)}`;
  const data = await fetchWithTimeout(url);
  if (!data || data.found === false) return null;
  return normalizeUser(data);
}

/**
 * POST ?action=saveUser
 * Upserts the row matching `domain`. Never creates a duplicate —
 * the Apps Script side looks up the row by Domain and updates it.
 *
 * NOTE: content-type is deliberately "text/plain" to avoid a CORS
 * preflight request, which Google Apps Script Web Apps do not
 * handle. Apps Script parses e.postData.contents as JSON itself.
 */
export async function saveUser(userData) {
  const payload = {
    action: "saveUser",
    domain: userData.domain,
    avatar: userData.avatar || "",
    interests: userData.interests || [],
    rituals: userData.rituals || [],
    contribute: userData.contribute || "",
    need: userData.need || "",
  };

  const url = `${config.GOOGLE_SCRIPT_URL}`;
  const data = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!data?.success) {
    throw new Error(data?.error || "Could not save your card. Please try again.");
  }
  return true;
}

/**
 * POST ?action=saveMatch
 * Records which two buddies a person matched with (Step 3), only
 * called when they actually download the Buddy Team card — just
 * previewing doesn't write anything. Updates all three rows
 * (the person + both buddies) so the match is visible from any of
 * their rows in the Sheet.
 *
 * Requires two extra columns in the Sheet: "Buddy 1" and "Buddy 2".
 * See README.md for the exact column names to add.
 */
export async function saveMatch({ domain, buddy1, buddy2 }) {
  const payload = { action: "saveMatch", domain, buddy1, buddy2 };

  const data = await fetchWithTimeout(config.GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!data?.success) {
    throw new Error(data?.error || "Could not save your buddy match. Please try again.");
  }
  return Boolean(data.matchSaved);
}

/** Normalizes whatever shape the Apps Script returns into a consistent client-side object. */
function normalizeUser(raw) {
  return {
    domain: raw.domain || "",
    name: raw.name || "",
    avatar: raw.avatar || "",
    interests: Array.isArray(raw.interests) ? raw.interests : safeParseArray(raw.interests),
    rituals: Array.isArray(raw.rituals) ? raw.rituals : safeParseArray(raw.rituals),
    contribute: raw.contribute || "",
    need: raw.need || "",
  };
}

function safeParseArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
