/**
 * ============================================================
 * BUDDY CARD GENERATOR — CONFIGURATION
 * ============================================================
 * This is the ONLY file you should need to touch to customize
 * the app for a new workshop. No business logic lives here —
 * just values.
 *
 * After editing this file, restart `npm run dev` (or rebuild
 * with `npm run build`) to see changes.
 * ============================================================
 */

const config = {
  // ----------------------------------------------------------
  // GOOGLE APPS SCRIPT
  // ----------------------------------------------------------
  // Paste the deployed Web App URL from Google Apps Script here.
  // See /google-apps-script/Code.gs + README.md for setup steps.
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzB8FKPFose_FzwKpDa36SEFneVqEslyEm4fxSOE9QidX6X3O-nsmvTxGdexvMC5jiGZQ/exec",

  // Optional: shown in the footer / error messages so participants
  // know which sheet/workshop this instance is wired to.
  WORKSHOP_NAME: "Manager Makes Movers — Buddy Card Generator",

  // How long to wait for a Google Apps Script response before
  // showing a timeout error (milliseconds).
  API_TIMEOUT_MS: 15000,

  // ----------------------------------------------------------
  // EXPORT DIMENSIONS (PNG downloads)
  // ----------------------------------------------------------
  EXPORT_WIDTH: 1080,
  EXPORT_HEIGHT: 1920, // Instagram Story ratio (9:16)

  // On-screen preview card size (px). The export is rendered at
  // EXPORT_WIDTH/HEIGHT and scaled down proportionally for preview,
  // so keep the same aspect ratio here.
  CARD_PREVIEW_WIDTH: 320,
  CARD_PREVIEW_HEIGHT: 569,

  // Buddy Team card = 3 individual cards placed side by side
  // (per design review). Export is therefore 3x the WIDTH of a
  // single card at the same height — every buddy keeps their own
  // full 1080x1920 card untouched, nothing is shrunk or stacked.
  BUDDY_EXPORT_WIDTH: 1080 * 3,
  BUDDY_EXPORT_HEIGHT: 1920,
  BUDDY_CARD_PREVIEW_WIDTH: 320 * 3,
  BUDDY_CARD_PREVIEW_HEIGHT: 569,

  // ----------------------------------------------------------
  // AVATAR HANDLING
  // ----------------------------------------------------------
  AVATAR_OUTPUT_SIZE: 480, // px, square, after crop + resize
  AVATAR_JPEG_QUALITY_START: 0.85, // starting compression quality
  AVATAR_JPEG_QUALITY_MIN: 0.4, // will not compress below this
  // Google Sheets cells max out around 50,000 characters.
  // We keep a safety margin since the avatar is stored as a
  // base64 data URL directly in the "Avatar URL" column.
  AVATAR_MAX_BASE64_LENGTH: 38000,
  DEFAULT_AVATAR_PATH: "/assets/default-avatar.png",
  ACCEPTED_AVATAR_TYPES: ["image/jpeg", "image/png", "image/heic", "image/heif"],

  // ----------------------------------------------------------
  // RITUALS
  // ----------------------------------------------------------
  REQUIRED_RITUAL_COUNT: 3,
  DEFAULT_EMOJI_LIST: ["💬", "☕", "⭐", "📅", "🎯", "🤝", "📌", "🕒", "✅", "💡", "🎉", "🧠"],

  // ----------------------------------------------------------
  // TEMPLATE / BRAND ASSETS
  // Swap these paths to re-skin the app without touching any
  // rendering component.
  // ----------------------------------------------------------
  PERSONAL_CARD_TEMPLATE_PATH: "/assets/personal-card-template.png",
  BUDDY_TEAM_TEMPLATE_PATH: "/assets/buddy-team-template.png",
  LOGO_PATH: "/assets/logo.png",

  // ----------------------------------------------------------
  // KV THEME — Manager Makes Movers Key Visual
  // ----------------------------------------------------------
  // Used ONLY by CardPreview / BuddyPreview (the exported Buddy
  // Card image). The rest of the app (buttons, forms, header)
  // keeps its own coral/violet theme above — the two are
  // intentionally separate design systems.
  KV_THEME: {
    colors: {
      blue: "#1E3FCC",
      blueDark: "#152C99",
      blueLight: "#4E6BE0",
      neonGreen: "#B6FF3A",
      ink: "#0F1B4D", // body text on white cards
      skyTop: "#EAF4FF",
      skyBottom: "#0F2AA8",
      white: "#FFFFFF",
    },
    // Baseline "comfortable" content counts. If a card has more
    // items than this, font sizes scale down slightly (within
    // KV_MIN_SCALE) so everything still fits the fixed
    // 1080x1920 canvas instead of overflowing or getting cut off.
    baselineInterests: 3,
    baselineRitualLines: 5,
    baselineGiveGetLines: 4,
  },
  KV_MIN_SCALE: 0.72, // never shrink content below 72% of base size

  THEME: {
    colors: {
      // Primary brand accent — used for CTAs, active states, tags
      coral: "#FF6B57",
      coralDark: "#E4523F",
      // Secondary accent — used for Buddy Match / Step 3
      violet: "#5B4FE0",
      violetDark: "#4438C7",
      // Neutrals
      ink: "#1A1A2E",
      inkSoft: "#4B4B63",
      paper: "#FFFFFF",
      canvas: "#FAFAF9",
      line: "#ECEAE6",
      // Feedback
      success: "#34D399",
      danger: "#EF4444",
    },
    radius: {
      sm: "10px",
      md: "16px",
      lg: "24px",
      pill: "999px",
    },
    shadow: {
      soft: "0 8px 24px rgba(26, 26, 46, 0.08)",
      lifted: "0 16px 40px rgba(26, 26, 46, 0.14)",
    },
    fontSizes: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "22px",
      "2xl": "28px",
      "3xl": "36px",
    },
    spacing: {
      panelPadding: "40px",
      sectionGap: "32px",
      fieldGap: "16px",
    },
    animationDurationMs: 200,
  },

  // ----------------------------------------------------------
  // LOCAL STORAGE KEYS
  // ----------------------------------------------------------
  STORAGE_KEYS: {
    currentDomain: "buddyCard:currentDomain",
    draftPrefix: "buddyCard:draft:", // + domain
  },

  // ----------------------------------------------------------
  // MISC / VALIDATION
  // ----------------------------------------------------------
  MIN_INTEREST_LENGTH: 1,
  MAX_INTEREST_LENGTH: 24,
  MAX_RITUAL_TEXT_LENGTH: 90,
};

export default config;
