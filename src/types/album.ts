export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnail: string;
  createdTime: string; // ISO 8601 string, e.g. "2026-09-28T21:19:00"
  modifiedTime?: string;
  duration?: string; // e.g. "0:45", "2:10" for videos
  caption?: string;
  location?: string;
  aspectRatio?: number; // e.g. 1.33 for 4:3, 1.77 for 16:9
  width?: number;
  height?: number;
  size?: string;
  featured?: boolean;
  isSpecialMoment?: boolean;
  driveId?: string;
}

export type SortOrder = 'newest' | 'oldest';
export type FilterType = 'all' | 'image' | 'video' | 'favorites';

export interface FilterState {
  search: string;
  mediaType: FilterType;
  year: string;
  month: string;
  sortOrder: SortOrder;
}

export interface AlbumStats {
  totalItems: number;
  totalPhotos: number;
  totalVideos: number;
  latestUploadDate: string | null;
  earliestUploadDate: string | null;
}

export interface MonthGroup {
  monthKey: string; // e.g. "2026-09"
  label: string;    // e.g. "September 2026"
  year: number;
  month: number;
  items: MediaItem[];
}

export interface TimelineEvent {
  dateKey: string;    // "2026-09-28"
  dateLabel: string;  // "28 September 2026"
  day: number;
  monthName: string;
  year: number;
  items: MediaItem[];
}
