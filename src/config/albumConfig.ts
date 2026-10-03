/**
 * Album Configuration
 * 
 * Customize the configuration constants below.
 * When you have a Google Apps Script or custom API endpoint that serves your Google Drive media,
 * replace "PASTE_MY_API_URL_HERE" with your web app URL.
 */

// Google Apps Script or API endpoint returning album JSON
export const DEFAULT_PLACEHOLDER_API_URL = "PASTE_MY_API_URL_HERE";
export const ALBUM_API_URL = "https://script.google.com/macros/s/AKfycbwh3Jz8BdRc05ocjQVUlsDlKIfHhu-2LvSaB7ZHkXr4WcP93SIU2vDrKuJ51YcVi0x5ow/exec";

// Configurable milestone date (ISO format) for live memory & life counter
export const SPECIAL_DATE = "2026-09-28T21:19:00";

// Album Branding & Display
export const ALBUM_TITLE = "Our Family Memories";
export const ALBUM_SUBTITLE = "Little moments. Beautiful memories. Forever together.";

// Controls whether download button is visible in media viewer
export const ENABLE_DOWNLOADS = true;

// Key used in localStorage for caching the synced Google Drive data
export const STORAGE_KEY_ALBUM_CACHE = "family_album_cached_media_v1";
export const STORAGE_KEY_CUSTOM_API_URL = "family_album_custom_api_url";
export const STORAGE_KEY_FAVORITES = "family_album_favorites_v1";
export const STORAGE_KEY_SPECIAL_DATE = "family_album_custom_special_date";

/**
 * Gets effective API URL (checks localStorage override first, falls back to ALBUM_API_URL)
 */
export function getEffectiveApiUrl(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_API_URL);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  }
  return ALBUM_API_URL;
}

/**
 * Sets custom API URL in localStorage for instant live testing without recompilation
 */
export function setCustomApiUrl(url: string): void {
  if (typeof window !== "undefined") {
    if (!url || url.trim() === "" || url === ALBUM_API_URL) {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_API_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_CUSTOM_API_URL, url.trim());
    }
  }
}

/**
 * Gets effective special milestone date
 */
export function getEffectiveSpecialDate(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY_SPECIAL_DATE);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  }
  return SPECIAL_DATE;
}

/**
 * Sets custom special milestone date in localStorage
 */
export function setCustomSpecialDate(dateStr: string): void {
  if (typeof window !== "undefined") {
    if (!dateStr || dateStr.trim() === "" || dateStr === SPECIAL_DATE) {
      localStorage.removeItem(STORAGE_KEY_SPECIAL_DATE);
    } else {
      localStorage.setItem(STORAGE_KEY_SPECIAL_DATE, dateStr.trim());
    }
  }
}
