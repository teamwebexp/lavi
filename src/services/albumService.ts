import { MediaItem, AlbumStats, MonthGroup, TimelineEvent } from '../types/album';
import { 
  getEffectiveApiUrl, 
  STORAGE_KEY_ALBUM_CACHE,
  ALBUM_API_URL,
  DEFAULT_PLACEHOLDER_API_URL 
} from '../config/albumConfig';
import { SEED_MEMORIES } from '../data/seedMemories';
import { PRELOADED_DRIVE_MEMORIES } from '../data/drivePreload';

export interface SyncResult {
  success: boolean;
  items: MediaItem[];
  stats: AlbumStats;
  source: 'network' | 'cache' | 'seed';
  error?: string;
  timestamp: number;
}

/**
 * Normalizes Google Drive or third-party media URLs to direct preview/playable streams
 */
export function normalizeMediaUrl(url: string, type: 'image' | 'video'): string {
  if (!url) return '';

  // Google Drive link handling
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      if (type === 'image') {
        // High resolution direct thumbnail / display
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
      } else {
        // Direct media stream for HTML5 video
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
  }

  return url;
}

/**
 * Normalizes an item from raw API response into standardized MediaItem
 */
export function normalizeRawItem(raw: any, index: number): MediaItem {
  const fileId = String(raw.id || `item-${index}-${Date.now()}`);
  const rawName = String(raw.name || `Memory ${index + 1}`);

  const isVideo = Boolean(
    raw.type === 'video' ||
    (typeof raw.mimeType === 'string' && raw.mimeType.toLowerCase().startsWith('video/')) ||
    rawName.toLowerCase().endsWith('.mp4') || 
    rawName.toLowerCase().endsWith('.mov') || 
    rawName.toLowerCase().endsWith('.webm') ||
    rawName.toLowerCase().endsWith('.m4v')
  );
  
  const type: 'image' | 'video' = isVideo ? 'video' : 'image';
  
  const createdTime = raw.createdTime || raw.created_at || raw.date || raw.modifiedTime || new Date(Date.now() - index * 86400000).toISOString();
  
  // Construct high-quality URLs based on Google Drive file ID if direct url is not provided
  let url = raw.url || raw.downloadUrl || raw.webContentLink || raw.src || '';
  let thumbnail = raw.thumbnail || raw.thumbnailLink || '';

  if (!url && raw.id) {
    if (type === 'image') {
      url = `https://lh3.googleusercontent.com/d/${fileId}=w2048`;
    } else {
      url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  } else {
    url = normalizeMediaUrl(url, type);
  }

  if (!thumbnail && raw.id) {
    if (type === 'image') {
      thumbnail = `https://lh3.googleusercontent.com/d/${fileId}=w800`;
    } else {
      thumbnail = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }
  } else {
    thumbnail = normalizeMediaUrl(thumbnail, 'image') || url;
  }

  // Generate clean human-readable caption from file name if none provided
  const cleanName = rawName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
  const caption = raw.caption || raw.description || cleanName;

  return {
    id: fileId,
    name: rawName,
    type,
    url,
    thumbnail: thumbnail || url,
    createdTime,
    modifiedTime: raw.modifiedTime,
    duration: raw.duration || (type === 'video' ? 'Video' : undefined),
    caption,
    location: raw.location || raw.place || undefined,
    aspectRatio: raw.aspectRatio || (type === 'video' ? 1.77 : 1.33),
    featured: Boolean(raw.featured || index === 0 || index % 6 === 0),
    isSpecialMoment: Boolean(raw.isSpecialMoment || index === 0),
    driveId: raw.id ? fileId : undefined,
  };
}

/**
 * Computes statistics from items list
 */
export function calculateStats(items: MediaItem[]): AlbumStats {
  const totalItems = items.length;
  const totalPhotos = items.filter(i => i.type === 'image').length;
  const totalVideos = items.filter(i => i.type === 'video').length;

  let latestUploadDate: string | null = null;
  let earliestUploadDate: string | null = null;

  if (items.length > 0) {
    const sorted = [...items].sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
    latestUploadDate = sorted[0].createdTime;
    earliestUploadDate = sorted[sorted.length - 1].createdTime;
  }

  return {
    totalItems,
    totalPhotos,
    totalVideos,
    latestUploadDate,
    earliestUploadDate,
  };
}

export interface CachedAlbumData {
  items: MediaItem[];
  timestamp: number;
  apiUrl?: string;
}

/**
 * Retrieves cached album data from localStorage if available
 */
export function getCachedAlbum(): CachedAlbumData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALBUM_CACHE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.items) && parsed.items.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse cached album data:', err);
  }
  return null;
}

/**
 * Saves album items to localStorage cache
 */
export function cacheAlbum(items: MediaItem[], apiUrl?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ALBUM_CACHE, JSON.stringify({
      items,
      timestamp: Date.now(),
      apiUrl: apiUrl || getEffectiveApiUrl(),
    }));
  } catch (err) {
    console.warn('Failed to cache album to localStorage (storage quota might be exceeded):', err);
  }
}

/**
 * Fetches album data from Google Drive / Apps Script API or cache/seed
 */
export async function fetchAlbumMedia(forceRefresh = false): Promise<SyncResult> {
  const apiUrl = getEffectiveApiUrl();
  const hasConfiguredApi = Boolean(apiUrl && apiUrl.trim() !== '' && apiUrl !== DEFAULT_PLACEHOLDER_API_URL);

  // 1. If not forcing refresh, check cache first for instant load
  if (!forceRefresh) {
    const cached = getCachedAlbum();
    // Cache is valid if it matches current apiUrl (or if neither has a configured URL)
    const isCacheMatch = cached && (!hasConfiguredApi || cached.apiUrl === apiUrl);
    if (isCacheMatch) {
      return {
        success: true,
        items: cached.items,
        stats: calculateStats(cached.items),
        source: 'cache',
        timestamp: cached.timestamp,
      };
    }

    // If configured API matches the preloaded Google Drive folder, load preloaded immediately
    if (hasConfiguredApi && apiUrl === ALBUM_API_URL && PRELOADED_DRIVE_MEMORIES.length > 0) {
      cacheAlbum(PRELOADED_DRIVE_MEMORIES, apiUrl);
      return {
        success: true,
        items: PRELOADED_DRIVE_MEMORIES,
        stats: calculateStats(PRELOADED_DRIVE_MEMORIES),
        source: 'cache',
        timestamp: Date.now(),
      };
    }
  }

  // 2. If no configured API URL, use curated seed memories
  if (!hasConfiguredApi) {
    const cached = getCachedAlbum();
    const items = cached?.items && cached.items.length > 0 ? cached.items : SEED_MEMORIES;
    cacheAlbum(items, DEFAULT_PLACEHOLDER_API_URL);
    return {
      success: true,
      items,
      stats: calculateStats(items),
      source: 'seed',
      timestamp: Date.now(),
    };
  }

  // 3. Perform network fetch with cache-busting parameter
  try {
    const separator = apiUrl.includes('?') ? '&' : '?';
    const cacheBusterUrl = `${apiUrl}${separator}_cb=${Date.now()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try {
        controller.abort(new DOMException('Drive sync request timed out (45s)', 'AbortError'));
      } catch (e) {
        controller.abort();
      }
    }, 45000); // 45s timeout for Google Apps Script cold start

    const response = await fetch(cacheBusterUrl, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Support formats: { items: [...] }, { files: [...] }, or direct array [...]
    let rawList: any[] = [];
    if (Array.isArray(data)) {
      rawList = data;
    } else if (Array.isArray(data.files)) {
      rawList = data.files;
    } else if (Array.isArray(data.items)) {
      rawList = data.items;
    } else if (data.data && Array.isArray(data.data)) {
      rawList = data.data;
    } else {
      throw new Error('Invalid JSON format: expected "files", "items", or array of media');
    }

    if (rawList.length === 0) {
      return {
        success: true,
        items: [],
        stats: calculateStats([]),
        source: 'network',
        timestamp: Date.now(),
      };
    }

    const normalizedItems = rawList.map((item, idx) => normalizeRawItem(item, idx));
    cacheAlbum(normalizedItems, apiUrl);

    return {
      success: true,
      items: normalizedItems,
      stats: calculateStats(normalizedItems),
      source: 'network',
      timestamp: Date.now(),
    };
  } catch (error: any) {
    const isAbort = error?.name === 'AbortError' || String(error?.message).toLowerCase().includes('abort');
    if (isAbort) {
      console.warn('Google Drive sync request took longer than expected; using cached album media.');
    } else {
      console.warn('Sync connection notice:', error?.message);
    }
    
    // Check if we have cached data or preloaded data to fall back to
    const cached = getCachedAlbum();
    if (cached && cached.items.length > 0) {
      return {
        success: true,
        items: cached.items,
        stats: calculateStats(cached.items),
        source: 'cache',
        error: isAbort ? 'Drive sync timed out; loaded cached media' : error?.message,
        timestamp: cached.timestamp,
      };
    }

    if (PRELOADED_DRIVE_MEMORIES.length > 0) {
      cacheAlbum(PRELOADED_DRIVE_MEMORIES, apiUrl);
      return {
        success: true,
        items: PRELOADED_DRIVE_MEMORIES,
        stats: calculateStats(PRELOADED_DRIVE_MEMORIES),
        source: 'cache',
        error: isAbort ? 'Drive sync timed out; loaded cached media' : error?.message,
        timestamp: Date.now(),
      };
    }

    // Fall back to seed memories if nothing else
    return {
      success: false,
      items: SEED_MEMORIES,
      stats: calculateStats(SEED_MEMORIES),
      source: 'seed',
      error: error?.message || 'Network error fetching album',
      timestamp: Date.now(),
    };
  }
}

/**
 * Groups items automatically by Year and Month (e.g. "October 2026", "September 2026")
 */
export function groupMediaByMonth(items: MediaItem[], sortOrder: 'newest' | 'oldest' = 'newest'): MonthGroup[] {
  const groupsMap = new Map<string, { label: string; year: number; month: number; items: MediaItem[] }>();

  items.forEach(item => {
    const date = new Date(item.createdTime);
    if (isNaN(date.getTime())) return;
    
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    const monthName = date.toLocaleString('default', { month: 'long' });
    const label = `${monthName} ${year}`;

    if (!groupsMap.has(monthKey)) {
      groupsMap.set(monthKey, {
        label,
        year,
        month,
        items: [],
      });
    }

    groupsMap.get(monthKey)!.items.push(item);
  });

  const sortedGroups = Array.from(groupsMap.entries())
    .map(([monthKey, val]) => ({
      monthKey,
      ...val,
      items: val.items.sort((a, b) => {
        const timeA = new Date(a.createdTime).getTime();
        const timeB = new Date(b.createdTime).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      }),
    }))
    .sort((a, b) => {
      return sortOrder === 'newest'
        ? b.monthKey.localeCompare(a.monthKey)
        : a.monthKey.localeCompare(b.monthKey);
    });

  return sortedGroups;
}

/**
 * Builds chronological timeline events grouped by date
 */
export function buildTimeline(items: MediaItem[]): TimelineEvent[] {
  const map = new Map<string, { day: number; monthName: string; year: number; dateLabel: string; items: MediaItem[] }>();

  items.forEach(item => {
    const d = new Date(item.createdTime);
    if (isNaN(d.getTime())) return;

    const dateKey = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const day = d.getDate();
    const monthName = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    const dateLabel = `${day} ${monthName} ${year}`;

    if (!map.has(dateKey)) {
      map.set(dateKey, {
        day,
        monthName,
        year,
        dateLabel,
        items: [],
      });
    }

    map.get(dateKey)!.items.push(item);
  });

  return Array.from(map.entries())
    .map(([dateKey, val]) => ({
      dateKey,
      ...val,
    }))
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

/**
 * Finds the "Memory of the Day"
 * Prioritizes memories matching today's month and day from previous years (anniversary),
 * or selects the most special moment from the archive.
 */
export function findMemoryOfTheDay(items: MediaItem[]): { item: MediaItem; daysAgoText: string } | null {
  if (!items || items.length === 0) return null;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  // 1. Try to find an exact day/month match from an earlier year
  const anniversaryMatches = items.filter(item => {
    const d = new Date(item.createdTime);
    return d.getMonth() === currentMonth && 
           d.getDate() === currentDay && 
           d.getFullYear() < now.getFullYear();
  });

  let selected = anniversaryMatches[0];

  // 2. If no exact anniversary, look for same month
  if (!selected) {
    const sameMonth = items.filter(item => {
      const d = new Date(item.createdTime);
      return d.getMonth() === currentMonth;
    });
    if (sameMonth.length > 0) {
      selected = sameMonth[0];
    }
  }

  // 3. Fallback: featured memory or first memory
  if (!selected) {
    selected = items.find(i => i.isSpecialMoment || i.featured) || items[items.length - 1];
  }

  if (!selected) return null;

  const itemDate = new Date(selected.createdTime);
  const diffMs = now.getTime() - itemDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  
  let daysAgoText = `${diffDays} days ago`;
  const diffYears = Math.floor(diffDays / 365);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffYears >= 1) {
    daysAgoText = `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  } else if (diffMonths >= 1) {
    daysAgoText = `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } else if (diffDays === 0) {
    daysAgoText = 'Today';
  }

  return { item: selected, daysAgoText };
}
