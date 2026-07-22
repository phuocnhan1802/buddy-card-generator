/**
 * ============================================================
 * BUDDY CARD GENERATOR — GOOGLE APPS SCRIPT BACKEND
 * ============================================================
 * Paste this file into the Apps Script editor bound to your
 * Google Sheet (Extensions > Apps Script), then deploy it as a
 * Web App (see README.md for step-by-step instructions).
 *
 * The Sheet is the single source of truth. This script is the
 * ONLY thing that reads or writes it — the website never touches
 * the Sheet directly.
 *
 * Expected sheet columns (row 1 = headers, exact names below):
 *   Domain | Name | Avatar URL | Interests | Rituals | Contribute | Need
 * ============================================================
 */

const SHEET_NAME = "Sheet1"; // change if your tab is named differently

const COLUMNS = {
  DOMAIN: "Domain",
  NAME: "Name",
  AVATAR: "Avatar URL",
  INTERESTS: "Interests",
  RITUALS: "Rituals",
  CONTRIBUTE: "Contribute",
  NEED: "Need",
};

/** Entry point for all GET requests: ?action=getUser|findDomain&domain=... */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const domain = normalizeDomain(e.parameter.domain);

    if (action === "getUser") {
      return jsonResponse(getUserRecord(domain));
    }
    if (action === "findDomain") {
      const row = findRowByDomain(domain);
      return jsonResponse({ found: row !== -1 });
    }
    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

/** Entry point for all POST requests: body = { action: "saveUser", ... } */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.action === "saveUser") {
      saveUserRecord(payload);
      return jsonResponse({ success: true });
    }
    return jsonResponse({ success: false, error: "Unknown action" }, 400);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

// ------------------------------------------------------------
// Core logic
// ------------------------------------------------------------

function getUserRecord(domain) {
  const sheet = getSheet();
  const rowIndex = findRowByDomain(domain);
  if (rowIndex === -1) {
    return { found: false };
  }

  const headers = getHeaders(sheet);
  const rowValues = sheet.getRange(rowIndex + 1, 1, 1, headers.length).getValues()[0];
  const record = {};
  headers.forEach((header, i) => (record[header] = rowValues[i]));

  return {
    found: true,
    domain: record[COLUMNS.DOMAIN] || "",
    name: record[COLUMNS.NAME] || "",
    avatar: record[COLUMNS.AVATAR] || "",
    interests: safeParseJson(record[COLUMNS.INTERESTS], []),
    rituals: safeParseJson(record[COLUMNS.RITUALS], []),
    contribute: record[COLUMNS.CONTRIBUTE] || "",
    need: record[COLUMNS.NEED] || "",
  };
}

function saveUserRecord(payload) {
  const domain = normalizeDomain(payload.domain);
  if (!domain) throw new Error("Missing domain");

  const sheet = getSheet();
  const headers = getHeaders(sheet);
  const rowIndex = findRowByDomain(domain);

  if (rowIndex === -1) {
    // Per spec: users are seeded ahead of time (Domain + Name already
    // exist). We never create a brand-new row for an unknown domain.
    throw new Error("Domain not found. Cannot create a new user from the client.");
  }

  const updates = {
    [COLUMNS.AVATAR]: payload.avatar || "",
    [COLUMNS.INTERESTS]: JSON.stringify(payload.interests || []),
    [COLUMNS.RITUALS]: JSON.stringify(payload.rituals || []),
    [COLUMNS.CONTRIBUTE]: payload.contribute || "",
    [COLUMNS.NEED]: payload.need || "",
  };

  Object.keys(updates).forEach((columnName) => {
    const colIndex = headers.indexOf(columnName);
    if (colIndex !== -1) {
      sheet.getRange(rowIndex + 1, colIndex + 1).setValue(updates[columnName]);
    }
  });
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function getSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`Sheet tab "${SHEET_NAME}" not found`);
  return sheet;
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

/** Returns the 0-based row index (including header row) for a domain, or -1. */
function findRowByDomain(domain) {
  if (!domain) return -1;
  const sheet = getSheet();
  const headers = getHeaders(sheet);
  const domainCol = headers.indexOf(COLUMNS.DOMAIN);
  if (domainCol === -1) throw new Error(`Column "${COLUMNS.DOMAIN}" not found`);

  const values = sheet.getRange(2, domainCol + 1, sheet.getLastRow() - 1 || 0, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (normalizeDomain(values[i][0]) === domain) {
      return i + 1; // +1 to account for header row offset
    }
  }
  return -1;
}

function normalizeDomain(domain) {
  return (domain || "").toString().trim().toLowerCase();
}

function safeParseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

function jsonResponse(obj, statusCode) {
  // Apps Script Web Apps don't support setting a real HTTP status
  // code on ContentService output; statusCode is included in the
  // body itself so the client can inspect it if needed.
  const body = statusCode ? Object.assign({ statusCode: statusCode }, obj) : obj;
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
