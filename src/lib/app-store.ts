import { createDemoPlaylist } from "@/lib/demo-playlist";
import { createPlaylistId, type NewPlaylistInput, type Playlist } from "@/lib/m3u";
import {
  loadActivePlaylistId,
  loadFavorites,
  loadPlaylists,
  markSeeded,
  saveActivePlaylistId,
  saveFavorites,
  savePlaylists,
  wasSeeded,
} from "@/lib/storage";

/**
 * متجر خارجي صغير لحالة التطبيق (قوائم، مفضلة، قائمة نشطة).
 * يُقرأ عبر useSyncExternalStore في المكوّنات، وكل تعديل يُحفظ في localStorage.
 */

export type AppState = {
  /** true بعد تحميل البيانات من التخزين المحلي (بعد الترطيب). */
  ready: boolean;
  playlists: Playlist[];
  activePlaylistId: string | null;
  favorites: Record<string, string[]>;
  storageWarning: boolean;
};

const SERVER_SNAPSHOT: AppState = Object.freeze({
  ready: false,
  playlists: [],
  activePlaylistId: null,
  favorites: {},
  storageWarning: false,
});

let state: AppState = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function update(partial: Partial<AppState>): void {
  state = { ...state, ...partial };
  for (const listener of listeners) listener();
}

function persistPlaylists(playlists: Playlist[]): Partial<AppState> {
  const saved = savePlaylists(playlists);
  return { playlists, ...(saved ? {} : { storageWarning: true }) };
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): AppState {
  return state;
}

export function getServerSnapshot(): AppState {
  return SERVER_SNAPSHOT;
}

/** تحميل الحالة من التخزين المحلي مرة واحدة بعد الترطيب، مع تهيئة القائمة التجريبية أول مرة. */
export function hydrate(): void {
  if (state.ready) return;

  let playlists = loadPlaylists();
  if (playlists.length === 0 && !wasSeeded()) {
    const demo = createDemoPlaylist();
    playlists = [demo];
    savePlaylists(playlists);
    markSeeded();
  }

  const storedActive = loadActivePlaylistId();
  const activePlaylistId =
    storedActive && playlists.some((playlist) => playlist.id === storedActive)
      ? storedActive
      : (playlists[0]?.id ?? null);

  update({
    ready: true,
    playlists,
    activePlaylistId,
    favorites: loadFavorites(),
  });
}

export function switchPlaylist(id: string): void {
  saveActivePlaylistId(id);
  update({ activePlaylistId: id });
}

export function addPlaylist(input: NewPlaylistInput): Playlist {
  const playlist: Playlist = {
    id: createPlaylistId(),
    addedAt: Date.now(),
    ...input,
  };
  update(persistPlaylists([playlist, ...state.playlists]));
  switchPlaylist(playlist.id);
  return playlist;
}

export function deletePlaylist(id: string): void {
  const playlists = state.playlists.filter((playlist) => playlist.id !== id);
  const activePlaylistId =
    state.activePlaylistId === id ? (playlists[0]?.id ?? null) : state.activePlaylistId;
  if (activePlaylistId) saveActivePlaylistId(activePlaylistId);
  update({ activePlaylistId, ...persistPlaylists(playlists) });
}

export function toggleFavorite(playlistId: string, channelId: string): void {
  const current = new Set(state.favorites[playlistId] ?? []);
  if (current.has(channelId)) {
    current.delete(channelId);
  } else {
    current.add(channelId);
  }
  const favorites = { ...state.favorites, [playlistId]: [...current] };
  saveFavorites(favorites);
  update({ favorites });
}

/** يعيد القائمة التجريبية إلى المقدمة دون المساس ببقية القوائم. */
export function restoreDemoPlaylist(): void {
  const demo = createDemoPlaylist();
  const others = state.playlists.filter((playlist) => playlist.id !== demo.id);
  update(persistPlaylists([demo, ...others]));
  switchPlaylist(demo.id);
  markSeeded();
}
