import config from "../config";

export function isValidInterest(text) {
  const trimmed = text.trim();
  return trimmed.length >= config.MIN_INTEREST_LENGTH && trimmed.length <= config.MAX_INTEREST_LENGTH;
}

export function isValidRitualText(text) {
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.length <= config.MAX_RITUAL_TEXT_LENGTH;
}

export function normalizeDomain(domain) {
  return domain.trim().toLowerCase();
}
