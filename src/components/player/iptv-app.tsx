"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { AddPlaylistDialog } from "@/components/player/add-playlist-dialog";
import { ChannelAvatar } from "@/components/player/channel-avatar";
import { ChannelList } from "@/components/player/channel-list";
import { VideoPlayer } from "@/components/player/video-player";
import { Button } from "@/components/ui/button";
import {
  addPlaylist,
  deletePlaylist,
  getServerSnapshot,
  getSnapshot,
  hydrate,
  restoreDemoPlaylist,
  subscribe,
  switchPlaylist,
  toggleFavorite,
} from "@/lib/app-store";
import { listGroups, type Channel, type NewPlaylistInput } from "@/lib/m3u";

/**
 * التطبيق الرئيسي: إدارة القوائم والمفضلة واختيار القناة، مع لوحة المشغّل وقائمة القنوات.
 * الحالة العامة في متجر خارجي (app-store) وتُحفظ محلياً في المتصفح.
 */
export function IptvApp() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // تحميل البيانات من التخزين المحلي بعد الترطيب.
  useEffect(() => {
    hydrate();
  }, []);

  const activePlaylist = useMemo(
    () => state.playlists.find((playlist) => playlist.id === state.activePlaylistId) ?? null,
    [state.playlists, state.activePlaylistId],
  );

  const activeFavorites = useMemo(
    () => new Set(state.favorites[state.activePlaylistId ?? ""] ?? []),
    [state.favorites, state.activePlaylistId],
  );

  const groupCount = useMemo(
    () => (activePlaylist ? listGroups(activePlaylist.channels).length : 0),
    [activePlaylist],
  );

  function handleSelectChannel(channel: Channel) {
    setActiveChannel(channel);
    // على الجوال نرفع العرض إلى المشغّل بعد الاختيار.
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const playerArea = document.getElementById("player-area");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      playerArea?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  function handleSwitchPlaylist(id: string) {
    switchPlaylist(id);
    setActiveChannel(null);
    setConfirmingDelete(false);
  }

  function handleAddPlaylist(payload: NewPlaylistInput) {
    addPlaylist(payload);
    setActiveChannel(null);
    setDialogOpen(false);
    setConfirmingDelete(false);
  }

  function handleDeletePlaylist() {
    if (!activePlaylist) return;
    deletePlaylist(activePlaylist.id);
    setActiveChannel(null);
    setConfirmingDelete(false);
  }

  function handleRestoreDemo() {
    restoreDemoPlaylist();
    setActiveChannel(null);
    setConfirmingDelete(false);
  }

  function handleToggleFavorite(channelId: string) {
    if (!state.activePlaylistId) return;
    toggleFavorite(state.activePlaylistId, channelId);
  }

  if (!state.ready) {
    return (
      <div className="card-surface grid min-h-72 place-items-center p-10" role="status">
        <p className="text-sm text-muted">جارٍ تحميل المشغّل…</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
      {/* عمود المشغّل — يظهر أولاً على الجوال */}
      <div id="player-area" className="order-1 grid gap-4 lg:order-2">
        <div className="card-surface flex items-center gap-3 p-4">
          {activeChannel ? (
            <>
              <ChannelAvatar
                key={activeChannel.id}
                name={activeChannel.name}
                logo={activeChannel.logo}
              />
              <div className="min-w-0 flex-1">
                <h2 data-current-channel className="truncate text-base font-bold">
                  {activeChannel.name}
                </h2>
                <p className="truncate text-xs text-muted">
                  {activePlaylist ? `${activePlaylist.name} • ` : ""}
                  {activeChannel.group}
                </p>
              </div>
            </>
          ) : (
            <div className="min-w-0">
              <h2 className="text-base font-bold">لم تختر قناة بعد</h2>
              <p className="text-xs text-muted">اختر قناة من القائمة لبدء المشاهدة.</p>
            </div>
          )}
        </div>

        <VideoPlayer key={activeChannel?.id ?? "empty"} channel={activeChannel} />

        <p className="text-xs leading-6 text-muted">
          ملاحظة: بعض المصادر تمنع التشغيل من المتصفح (سياسة CORS) وتعمل فقط في التطبيقات المكتبية.
        </p>
      </div>

      {/* عمود الشريط الجانبي */}
      <aside className="order-2 grid gap-4 lg:sticky lg:top-20 lg:order-1">
        {activePlaylist ? (
          <div className="card-surface grid gap-3 p-4">
            <div className="grid gap-2">
              <label htmlFor="playlist-select" className="text-sm font-semibold">
                القائمة النشطة
              </label>
              <select
                id="playlist-select"
                value={state.activePlaylistId ?? ""}
                onChange={(event) => handleSwitchPlaylist(event.target.value)}
                className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-3 text-sm"
              >
                {state.playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name} ({playlist.channels.length})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setDialogOpen(true)} className="flex-1">
                إضافة قائمة
              </Button>
              {!confirmingDelete && (
                <Button size="sm" variant="secondary" onClick={() => setConfirmingDelete(true)}>
                  حذف القائمة الحالية
                </Button>
              )}
            </div>

            {confirmingDelete && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-danger-400/60 bg-danger-100/50 px-3 py-2 dark:bg-danger-500/10">
                <span className="text-sm font-semibold">حذف «{activePlaylist.name}»؟</span>
                <span className="flex gap-2">
                  <Button size="sm" variant="danger" onClick={handleDeletePlaylist}>
                    نعم، احذف
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setConfirmingDelete(false)}>
                    إلغاء
                  </Button>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="card-surface grid gap-3 p-4">
            <p className="font-bold">لا توجد قوائم بعد</p>
            <p className="text-xs leading-6 text-muted">
              أضف قائمة m3u من رابط أو ملف أو باللصق، أو ابدأ بالقائمة التجريبية الجاهزة.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setDialogOpen(true)}>
                إضافة قائمة
              </Button>
              <Button size="sm" variant="secondary" onClick={handleRestoreDemo}>
                استعادة التجريبية
              </Button>
            </div>
          </div>
        )}

        {state.storageWarning && (
          <p
            role="status"
            className="rounded-xl bg-amber-100 px-3 py-2 text-xs leading-6 text-amber-900 dark:bg-amber-500/10 dark:text-amber-300"
          >
            تعذّر حفظ البيانات في متصفحك (مساحة التخزين ممتلئة غالباً)؛ ستبقى القوائم متاحة لهذه
            الجلسة فقط.
          </p>
        )}

        {activePlaylist && (
          <div className="card-surface p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-bold">القنوات</h2>
              <p className="text-xs text-muted">
                {activePlaylist.channels.length} قناة • {groupCount} مجموعة
              </p>
            </div>
            <ChannelList
              key={activePlaylist.id}
              channels={activePlaylist.channels}
              activeChannelId={activeChannel?.id ?? null}
              favorites={activeFavorites}
              onSelect={handleSelectChannel}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}

        <details className="card-surface p-4 text-sm">
          <summary className="cursor-pointer font-semibold">كيف تستخدم المشغّل؟</summary>
          <ul className="mt-3 grid list-disc gap-2 ps-5 leading-7 text-muted">
            <li>أضف قائمتك من رابط (m3u/m3u8) أو ملف أو باللصق — تُحلَّل القنوات داخل متصفحك.</li>
            <li>ابحث عن قناة أو صفِّ حسب المجموعة، واضغط النجمة لإضافتها إلى المفضلة.</li>
            <li>اختر قناة لتبدأ المشاهدة، واستخدم ملء الشاشة لتجربة أفضل.</li>
            <li>تُحفظ قوائمك ومفضلاتك في متصفحك فقط ولا تُرسل إلى أي خادم.</li>
          </ul>
        </details>
      </aside>

      <AddPlaylistDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddPlaylist}
      />
    </div>
  );
}
