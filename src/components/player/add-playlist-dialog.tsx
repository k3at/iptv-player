"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { parseM3u, type NewPlaylistInput, type PlaylistSource } from "@/lib/m3u";

type Mode = "url" | "paste" | "file";

const MODES: { id: Mode; label: string }[] = [
  { id: "url", label: "من رابط" },
  { id: "paste", label: "لصق نص" },
  { id: "file", label: "من ملف" },
];

/** نافذة إضافة قائمة جديدة: من رابط، أو بلصق النص، أو من ملف. */
export function AddPlaylistDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (payload: NewPlaylistInput) => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<Mode>("url");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [pasted, setPasted] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // إغلاق بمفتاح Escape.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileContent(null);
    setFileName(null);
    setErrorMessage(null);
    if (!file) return;
    setFileName(file.name);
    try {
      const text = await file.text();
      setFileContent(text);
    } catch {
      setErrorMessage("تعذّر قراءة الملف. جرّب ملفاً آخر.");
    }
  }

  async function handleSubmit() {
    setErrorMessage(null);

    let content = "";
    let source: PlaylistSource = "paste";
    let origin: string | null = null;

    if (mode === "url") {
      const trimmed = url.trim();
      if (!/^https?:\/\//i.test(trimmed)) {
        setErrorMessage("أدخل رابطاً صالحاً يبدأ بـ http أو https.");
        return;
      }
      source = "url";
      origin = trimmed;
    } else if (mode === "paste") {
      if (!pasted.trim()) {
        setErrorMessage("الصق محتوى القائمة أولاً.");
        return;
      }
      content = pasted;
    } else {
      if (!fileContent) {
        setErrorMessage("اختر ملف قائمة أولاً.");
        return;
      }
      source = "file";
      content = fileContent;
    }

    setBusy(true);
    try {
      if (mode === "url") {
        const response = await fetch(origin ?? "");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        content = await response.text();
      }

      const channels = parseM3u(content);
      if (channels.length === 0) {
        setErrorMessage(
          "لم نعثر على أي قناة داخل الملف. تأكد أن القائمة تبدأ بـ #EXTM3U وتحتوي على أسطر #EXTINF.",
        );
        return;
      }

      const finalName = name.trim() || deriveName(mode, url, fileName) || "قائمتي";
      onAdd({ name: finalName, source, origin, content, channels });
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof TypeError
          ? "تعذّر جلب الرابط من المتصفح. تحقق من اتصالك، أو أن الخادم يسمح بالوصول (CORS)؛ ويمكنك استخدام «لصق نص» بدلاً من ذلك."
          : "تعذّر جلب القائمة. تحقق من الرابط وحاول مرة أخرى.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label="إغلاق النافذة"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-playlist-title"
        className="card-surface custom-scrollbar relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="add-playlist-title" className="text-lg font-bold">
            إضافة قائمة جديدة
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="grid size-10 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:text-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div
          role="tablist"
          aria-label="طريقة الإضافة"
          className="mt-4 flex gap-1 rounded-xl border border-border-subtle bg-surface p-1"
        >
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              onClick={() => {
                setMode(item.id);
                setErrorMessage(null);
              }}
              className={cn(
                "h-10 flex-1 rounded-lg px-3 text-sm font-semibold transition-colors",
                mode === item.id
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-muted hover:text-brand-700 dark:hover:text-brand-200",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
          className="mt-5 grid gap-4"
        >
          {mode === "url" && (
            <div className="grid gap-2">
              <label htmlFor="playlist-url" className="text-sm font-semibold">
                رابط القائمة (m3u / m3u8)
              </label>
              <input
                id="playlist-url"
                autoFocus
                type="url"
                dir="ltr"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/playlist.m3u"
                className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-brand-400"
              />
              <p className="text-xs leading-6 text-muted">
                قد تمنع بعض الخوادم الجلب المباشر من المتصفح (CORS)؛ عندها استخدم «لصق نص» أو «من
                ملف».
              </p>
            </div>
          )}

          {mode === "paste" && (
            <div className="grid gap-2">
              <label htmlFor="playlist-content" className="text-sm font-semibold">
                محتوى القائمة (m3u)
              </label>
              <textarea
                id="playlist-content"
                autoFocus
                dir="ltr"
                rows={8}
                value={pasted}
                onChange={(event) => setPasted(event.target.value)}
                placeholder={"#EXTM3U\n#EXTINF:-1,قناة\nhttps://example.com/stream.m3u8"}
                className="w-full resize-y rounded-xl border border-border-subtle bg-surface px-3 py-2 font-mono text-xs leading-6 outline-none focus:border-brand-400"
              />
            </div>
          )}

          {mode === "file" && (
            <div className="grid gap-2">
              <label htmlFor="playlist-file" className="text-sm font-semibold">
                ملف القائمة (m3u / m3u8)
              </label>
              <input
                id="playlist-file"
                type="file"
                accept=".m3u,.m3u8,.txt,audio/mpegurl,audio/x-mpegurl,application/vnd.apple.mpegurl,text/plain"
                onChange={(event) => {
                  void handleFile(event);
                }}
                className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm file:me-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white"
              />
              {fileName && (
                <p className="text-xs text-muted">
                  {fileContent
                    ? `تمت قراءة «${fileName}» (${fileContent.length} حرف). اضغط «حفظ القائمة».`
                    : `جارٍ قراءة «${fileName}»…`}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <label htmlFor="playlist-name" className="text-sm font-semibold">
              اسم القائمة <span className="font-normal text-muted">(اختياري)</span>
            </label>
            <input
              id="playlist-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="مثال: قنواتي المفضلة"
              className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-brand-400"
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl bg-danger-100/70 px-3 py-2 text-sm leading-6 text-danger-700 dark:bg-danger-500/10 dark:text-danger-400"
            >
              {errorMessage}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? "جارٍ المعالجة…" : "حفظ القائمة"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** اسم مقترح للقائمة من الرابط أو اسم الملف. */
function deriveName(mode: Mode, url: string, fileName: string | null): string {
  if (mode === "url") {
    try {
      const pathname = new URL(url).pathname;
      const last = pathname.split("/").filter(Boolean).at(-1);
      return last ? decodeURIComponent(last).replace(/\.(m3u8?|txt)$/i, "") : "";
    } catch {
      return "";
    }
  }
  if (mode === "file" && fileName) return fileName.replace(/\.(m3u8?|txt)$/i, "");
  return "";
}
