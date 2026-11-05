import { parseM3u, type Playlist } from "@/lib/m3u";

/**
 * تخزين محلي (localStorage) — كل شيء يبقى في متصفح المستخدم.
 * تُحفظ القوائم كنص خام دون القنوات المحللة (لتخفيف الحجم) وتُعاد القنوات
 * بتحليل النص عند التحميل.
 */

const KEYS = {
  playlists: "iptv:playlists:v1",
  activePlaylistId: "iptv:active-playlist:v1",
  favorites: "iptv:favorites:v1",
  volume: "iptv:volume:v1",
  seeded: "iptv:seeded:v1",
} as const;

type StoredPlaylist = Omit<Playlist, "channels">;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function toStored(playlist: Playlist): StoredPlaylist {
  return {
    id: playlist.id,
    name: playlist.name,
    source: playlist.source,
    origin: playlist.origin,
    addedAt: playlist.addedAt,
    content: playlist.content,
  };
}

function isStoredPlaylist(value: unknown): value is StoredPlaylist {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<StoredPlaylist>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.content === "string" &&
    (candidate.source === "demo" ||
      candidate.source === "url" ||
      candidate.source === "paste" ||
      candidate.source === "file" ||
      candidate.source === "xtream")
  );
}

/** يحمّل القوائم المخزنة ويعيد بناء القنوات من النص الخام. */
export function loadPlaylists(): Playlist[] {
  const raw = safeGet(KEYS.playlists);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is StoredPlaylist => isStoredPlaylist(item))
      .map((item) => ({ ...item, channels: parseM3u(item.content) }));
  } catch {
    return [];
  }
}

/** يخزّن القوائم دون القنوات المحللة. يعيد false إذا فشل التخزين (مساحة ممتلئة مثلاً). */
export function savePlaylists(playlists: Playlist[]): boolean {
  return safeSet(KEYS.playlists, JSON.stringify(playlists.map(toStored)));
}

export function loadActivePlaylistId(): string | null {
  return safeGet(KEYS.activePlaylistId);
}

export function saveActivePlaylistId(id: string | null): boolean {
  if (id === null) return true;
  return safeSet(KEYS.activePlaylistId, id);
}

/** المفضلة لكل قائمة: { playlistId: [channelId, ...] } */
export function loadFavorites(): Record<string, string[]> {
  const raw = safeGet(KEYS.favorites);
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const result: Record<string, string[]> = {};
    for (const [playlistId, ids] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(ids)) {
        result[playlistId] = ids.filter((id): id is string => typeof id === "string");
      }
    }
    return result;
  } catch {
    return {};
  }
}

export function saveFavorites(favorites: Record<string, string[]>): boolean {
  return safeSet(KEYS.favorites, JSON.stringify(favorites));
}

/** مستوى الصوت المحفوظ (0..1) أو null. */
export function loadVolume(): number | null {
  const raw = safeGet(KEYS.volume);
  if (!raw) return null;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
}

export function saveVolume(value: number): void {
  safeSet(KEYS.volume, String(value));
}

/** هل سبق تهيئة القائمة التجريبية؟ (حتى لا تعود بعد حذفها المتعمد) */
export function wasSeeded(): boolean {
  return safeGet(KEYS.seeded) === "1";
}

export function markSeeded(): void {
  safeSet(KEYS.seeded, "1");
}
