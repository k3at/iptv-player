/**
 * أدوات تحليل قوائم m3u/m3u8.
 * التحليل يحدث بالكامل في المتصفح، بلا أي خادم وسيط.
 */

/** قناة واحدة مستخرجة من قائمة m3u. */
export type Channel = {
  /** معرّف ثابت مبني على الرابط والاسم (للمفضلة والتخزين). */
  id: string;
  name: string;
  url: string;
  logo: string | null;
  group: string;
  tvgId: string | null;
};

export type PlaylistSource = "demo" | "url" | "paste" | "file" | "xtream";

/** قائمة قنوات محمّلة في التطبيق. */
export type Playlist = {
  id: string;
  name: string;
  source: PlaylistSource;
  /** الرابط الأصلي إن أُضيفت القائمة من رابط مباشر. */
  origin: string | null;
  addedAt: number;
  /** نص القائمة الخام (يُخزَّن ويُعاد تحليله عند التحميل). */
  content: string;
  channels: Channel[];
};

/** مدخلات إنشاء قائمة جديدة (من نافذة الإضافة أو غيرها). */
export type NewPlaylistInput = {
  name: string;
  source: PlaylistSource;
  origin: string | null;
  content: string;
  channels: Channel[];
};

export const UNGROUPED_LABEL = "غير مصنّف";

const ATTRIBUTE_PATTERN = /([A-Za-z0-9_-]+)="([^"]*)"/g;

/** يفصل وسيطات سطر #EXTINF عن اسم القناة (أول فاصلة خارج علامات التنصيص). */
function splitExtinf(line: string): { attributes: Record<string, string>; name: string } {
  const body = line.slice("#EXTINF:".length);
  const attributes: Record<string, string> = {};
  let nameStart = -1;
  let inQuotes = false;

  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      nameStart = index + 1;
      break;
    }
  }

  const attributePart = nameStart === -1 ? body : body.slice(0, nameStart - 1);
  const name = nameStart === -1 ? "" : body.slice(nameStart).trim();

  for (const match of attributePart.matchAll(ATTRIBUTE_PATTERN)) {
    attributes[match[1].toLowerCase()] = match[2];
  }

  return { attributes, name };
}

/** معرّف ثابت (djb2) لتفادي التعارض بين القنوات. */
export function hashString(input: string): string {
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) + hash + input.charCodeAt(index)) | 0;
  }
  return (hash >>> 0).toString(36);
}

export function makeChannelId(url: string, name: string): string {
  return hashString(`${url}\n${name}`);
}

/** معرّف فريد لقائمة جديدة. */
export function createPlaylistId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `pl-${crypto.randomUUID()}`;
  }
  return `pl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * يحلّل نص قائمة m3u إلى قنوات.
 * يتعامل مع #EXTINF ووسيطاته و#EXTGRP، ويتجاهل التعليقات والتوجيهات الأخرى.
 */
export function parseM3u(content: string): Channel[] {
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/);
  const channels: Channel[] = [];
  const seen = new Set<string>();
  let pending: { name: string; logo: string | null; group: string; tvgId: string | null } | null =
    null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.length === 0) continue;

    if (line.startsWith("#EXTINF:")) {
      const { attributes, name } = splitExtinf(line);
      pending = {
        name: name || attributes["tvg-name"]?.trim() || "",
        logo: attributes["tvg-logo"]?.trim() || null,
        group: attributes["group-title"]?.trim() || UNGROUPED_LABEL,
        tvgId: attributes["tvg-id"]?.trim() || null,
      };
      continue;
    }

    if (line.startsWith("#EXTGRP:")) {
      if (pending) {
        const group = line.slice("#EXTGRP:".length).trim();
        if (group) pending.group = group;
      }
      continue;
    }

    // بقية الأسطر التي تبدأ بـ # تعليقات أو توجيهات لا نحتاجها حالياً.
    if (line.startsWith("#")) continue;

    const url = line;
    const name = pending?.name || url;
    const dedupeKey = `${url}\n${name}`;
    if (seen.has(dedupeKey)) {
      pending = null;
      continue;
    }
    seen.add(dedupeKey);

    channels.push({
      id: makeChannelId(url, name),
      name,
      url,
      logo: pending?.logo ?? null,
      group: pending?.group ?? UNGROUPED_LABEL,
      tvgId: pending?.tvgId ?? null,
    });
    pending = null;
  }

  return channels;
}

/** قوائم المجموعات الفريدة مرتبة عربياً. */
export function listGroups(channels: Channel[]): string[] {
  const groups = new Set<string>();
  for (const channel of channels) groups.add(channel.group);
  return [...groups].sort((first, second) => first.localeCompare(second, "ar"));
}

/** هل الرابط عبارة عن بث HLS؟ */
export function isHlsUrl(url: string): boolean {
  return /\.m3u8(?:$|[?#])/i.test(url);
}
