"use client";

import { useMemo, useState } from "react";
import { ChannelAvatar } from "@/components/player/channel-avatar";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { listGroups, type Channel } from "@/lib/m3u";
import { matchesQuery } from "@/lib/search";

const INITIAL_VISIBLE = 300;
const VISIBLE_STEP = 300;
const ALL_GROUPS = "all";

type ChannelListProps = {
  channels: Channel[];
  activeChannelId: string | null;
  favorites: ReadonlySet<string>;
  onSelect: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
};

/**
 * قائمة القنوات مع البحث والتصفية بالمجموعة وعرض المفضلة.
 * تُعرض أول 300 نتيجة ويُحمَّل المزيد عند الطلب (القوائم قد تكون بآلاف القنوات).
 */
export function ChannelList({
  channels,
  activeChannelId,
  favorites,
  onSelect,
  onToggleFavorite,
}: ChannelListProps) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>(ALL_GROUPS);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const groups = useMemo(() => listGroups(channels), [channels]);

  const filtered = useMemo(
    () =>
      channels.filter((channel) => {
        if (favoritesOnly && !favorites.has(channel.id)) return false;
        if (group !== ALL_GROUPS && channel.group !== group) return false;
        return matchesQuery(query, channel.name, channel.group);
      }),
    [channels, favorites, favoritesOnly, group, query],
  );

  const visibleChannels = filtered.slice(0, visibleCount);
  const hiddenCount = filtered.length - visibleChannels.length;

  return (
    <div className="grid gap-3">
      <div>
        <label htmlFor="channel-search" className="sr-only">
          ابحث عن قناة
        </label>
        <input
          id="channel-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setVisibleCount(INITIAL_VISIBLE);
          }}
          placeholder="ابحث عن قناة…"
          className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-brand-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="group-filter" className="sr-only">
          المجموعة
        </label>
        <select
          id="group-filter"
          value={group}
          onChange={(event) => {
            setGroup(event.target.value);
            setVisibleCount(INITIAL_VISIBLE);
          }}
          className="h-11 min-w-0 flex-1 rounded-xl border border-border-subtle bg-surface px-3 text-sm"
        >
          <option value={ALL_GROUPS}>كل المجموعات ({channels.length})</option>
          {groups.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            setFavoritesOnly((value) => !value);
            setVisibleCount(INITIAL_VISIBLE);
          }}
          aria-pressed={favoritesOnly}
          className={cn(
            "inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors",
            favoritesOnly
              ? "border-brand-400 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200"
              : "border-border-subtle bg-surface text-muted hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-200",
          )}
        >
          <StarIcon filled={favoritesOnly} className="size-4" />
          المفضلة فقط
        </button>
      </div>

      <p className="text-xs text-muted">
        {filtered.length} من أصل {channels.length} قناة
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-subtle p-6 text-center text-sm text-muted">
          لا توجد نتائج مطابقة.
        </p>
      ) : (
        <div className="custom-scrollbar max-h-96 overflow-y-auto overscroll-contain pe-1 lg:max-h-[calc(100vh-26rem)]">
          <ul className="grid gap-1">
            {visibleChannels.map((channel) => (
              <ChannelRow
                key={channel.id}
                channel={channel}
                active={channel.id === activeChannelId}
                favorite={favorites.has(channel.id)}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </ul>
        </div>
      )}

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setVisibleCount((value) => value + VISIBLE_STEP)}
          className={buttonClass("secondary", "sm", "w-full")}
        >
          عرض المزيد ({hiddenCount} متبقية)
        </button>
      )}
    </div>
  );
}

type ChannelRowProps = {
  channel: Channel;
  active: boolean;
  favorite: boolean;
  onSelect: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
};

function ChannelRow({ channel, active, favorite, onSelect, onToggleFavorite }: ChannelRowProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-1 rounded-xl border ps-1 transition-colors",
        active
          ? "border-brand-400 bg-brand-50 dark:bg-brand-500/10"
          : "border-transparent hover:bg-brand-50/70 dark:hover:bg-white/5",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(channel)}
        aria-label={channel.name}
        aria-current={active ? "true" : undefined}
        className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-xl px-2 text-start"
      >
        <ChannelAvatar key={channel.id} name={channel.name} logo={channel.logo} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">
            {channel.name}
          </span>
          <span className="block truncate text-xs text-muted">{channel.group}</span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onToggleFavorite(channel.id)}
        aria-label={`المفضلة: ${channel.name}`}
        aria-pressed={favorite}
        className="grid size-11 shrink-0 place-items-center rounded-xl text-muted transition-colors hover:text-amber-500"
      >
        <StarIcon filled={favorite} />
      </button>
    </li>
  );
}

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5", filled ? "text-amber-500" : undefined, className)}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3.7 2.6 5.2 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9L12 3.7Z" />
    </svg>
  );
}
