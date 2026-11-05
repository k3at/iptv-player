"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type HlsJs from "hls.js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { isHlsUrl, type Channel } from "@/lib/m3u";
import { loadVolume, saveVolume } from "@/lib/storage";

type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";
type MediaStatus = Exclude<PlayerStatus, "idle">;

const STATUS_TEXT: Record<PlayerStatus, string> = {
  idle: "لم تُختَر أي قناة بعد",
  loading: "جارٍ تجهيز البث…",
  playing: "يتم التشغيل الآن",
  paused: "التشغيل متوقف مؤقتاً",
  error: "تعذّر تشغيل هذا البث",
};

/**
 * مشغّل الفيديو: يشغّل بث HLS عبر hls.js (يُحمَّل ديناميكياً عند الحاجة فقط)
 * وأي صيغة يدعمها المتصفح أصلاً (MP4 مثلاً)، مع أزرار تشغيل وصوت وملء شاشة.
 * ملاحظة: يمنحه الأب مفتاحاً (key) لكل قناة، فتجرى إعادة تهيئة نظيفة عند التبديل.
 */
export function VideoPlayer({ channel }: { channel: Channel | null }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<HlsJs | null>(null);
  const runTokenRef = useRef(0);

  const [mediaStatus, setMediaStatus] = useState<MediaStatus>("loading");
  const [attempt, setAttempt] = useState(0);
  const [volume, setVolume] = useState<number>(() =>
    typeof window === "undefined" ? 1 : (loadVolume() ?? 1),
  );
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // حالة مشتقة: بلا قناة = خمول.
  const status: PlayerStatus = channel ? mediaStatus : "idle";

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.volume = volume;
    saveVolume(volume);
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const destroyHls = useCallback(() => {
    const hls = hlsRef.current;
    if (hls) {
      hls.destroy();
      hlsRef.current = null;
    }
  }, []);

  const stopMedia = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.removeAttribute("src");
    video.load();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel) return;

    // رمز تشغيل مميز لكل تنفيذ: أي تنفيذ أقدم (مثلاً من إعادة تركيب StrictMode)
    // يتوقف عن العمل فوراً بدل أن يزاحم التنفيذ الأحدث.
    const runToken = runTokenRef.current + 1;
    runTokenRef.current = runToken;
    const isCurrent = () => runTokenRef.current === runToken;

    destroyHls();

    const startNative = () => {
      if (!isCurrent()) return;
      video.src = channel.url;
      const promise = video.play();
      if (promise)
        promise.catch(() => {
          if (isCurrent()) setMediaStatus("paused");
        });
    };

    const start = async () => {
      try {
        // صيغة عادية (MP4 مثلاً): مشغل المتصفح مباشرة.
        if (!isHlsUrl(channel.url)) {
          startNative();
          return;
        }

        const { default: Hls } = await import("hls.js");
        if (!isCurrent()) return;

        // HLS: hls.js أولاً (عبر MSE)، والمشغل الأصلي بديل فقط لمن لا يدعم MSE (Safari/iOS).
        if (!Hls.isSupported()) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            startNative();
            return;
          }
          setMediaStatus("error");
          return;
        }

        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        let retriedNetwork = false;
        let retriedMedia = false;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!isCurrent()) return;
          const promise = video.play();
          if (promise)
            promise.catch(() => {
              if (isCurrent()) setMediaStatus("paused");
            });
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data.fatal || !isCurrent()) return;

          if (data.type === Hls.ErrorTypes.NETWORK_ERROR && !retriedNetwork) {
            retriedNetwork = true;
            hls.startLoad();
            return;
          }

          if (data.type === Hls.ErrorTypes.MEDIA_ERROR && !retriedMedia) {
            retriedMedia = true;
            hls.recoverMediaError();
            return;
          }

          hls.destroy();
          if (hlsRef.current === hls) hlsRef.current = null;
          setMediaStatus("error");
        });

        hls.loadSource(channel.url);
        hls.attachMedia(video);
      } catch {
        if (isCurrent()) setMediaStatus("error");
      }
    };

    void start();

    return () => {
      runTokenRef.current += 1;
      destroyHls();
      stopMedia();
    };
  }, [channel, attempt, destroyHls, stopMedia]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !channel) return;
    if (video.paused) {
      const promise = video.play();
      if (promise) promise.catch(() => {});
    } else {
      video.pause();
    }
  }, [channel]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void containerRef.current?.requestFullscreen?.();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      data-player-status={status}
      className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-subtle bg-black"
    >
      <video
        ref={videoRef}
        playsInline
        className="size-full bg-black"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlaying={() => setMediaStatus("playing")}
        onWaiting={() => setMediaStatus("loading")}
        onPause={() => setMediaStatus((previous) => (previous === "playing" ? "paused" : previous))}
        onEnded={() => setMediaStatus("paused")}
        onError={() => {
          if (!hlsRef.current) setMediaStatus("error");
        }}
      />

      <p className="sr-only" role="status">
        {STATUS_TEXT[status]}
      </p>

      {status === "idle" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/10 text-white/80">
              <TvIcon className="size-7" />
            </span>
            <p className="mt-4 font-bold text-white">اختر قناة من القائمة لبدء المشاهدة</p>
            <p className="mt-1 text-sm text-white/60">
              تُشغَّل البثوث مباشرة داخل متصفحك بجودة المصدر.
            </p>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/40">
          <div className="text-center">
            <span
              aria-hidden="true"
              className="mx-auto block size-10 animate-spin rounded-full border-2 border-white/20 border-t-white"
            />
            <p className="mt-3 text-sm font-semibold text-white">جارٍ تجهيز البث…</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-black/85 p-6 text-center">
          <div className="max-w-md">
            <p className="text-lg font-bold text-white">تعذّر تشغيل هذا البث</p>
            <p className="mt-2 text-sm leading-7 text-white/70">
              قد يكون الرابط غير متاح حالياً، أو أن المصدر يمنع التشغيل من المتصفح (سياسة CORS).
              جرّب قناة أخرى أو أعد المحاولة.
            </p>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => {
                setMediaStatus("loading");
                setAttempt((value) => value + 1);
              }}
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      )}

      {status === "paused" && channel && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="متابعة التشغيل"
          className="absolute inset-0 grid cursor-pointer place-items-center bg-black/45"
        >
          <span className="grid size-16 place-items-center rounded-full bg-white/15 backdrop-blur">
            <PlayIcon className="size-7 text-white" />
          </span>
        </button>
      )}

      {channel && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pt-10 pb-2.5">
          <ControlButton label={status === "playing" ? "إيقاف مؤقت" : "تشغيل"} onClick={togglePlay}>
            {status === "playing" ? <PauseIcon /> : <PlayIcon />}
          </ControlButton>
          <ControlButton
            label={muted || volume === 0 ? "إلغاء كتم الصوت" : "كتم الصوت"}
            onClick={() => setMuted((value) => !value)}
          >
            {muted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
          </ControlButton>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(event) => {
              const next = Number(event.target.value);
              setVolume(next);
              setMuted(next === 0);
            }}
            aria-label="مستوى الصوت"
            className="h-1.5 w-24 cursor-pointer accent-brand-400"
          />
          <span className="flex-1" />
          <ControlButton
            label={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
            onClick={toggleFullscreen}
          >
            <FullscreenIcon active={isFullscreen} />
          </ControlButton>
        </div>
      )}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 shrink-0 place-items-center rounded-xl text-white/85 transition-colors hover:bg-white/15 hover:text-white"
    >
      {children}
    </button>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 4.5v15l13-7.5-13-7.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" fill="currentColor" stroke="none" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" fill="currentColor" stroke="none" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </svg>
  );
}

function FullscreenIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {active ? (
        <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
      ) : (
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
      )}
    </svg>
  );
}

function TvIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="m17 2-5 5-5-5" />
    </svg>
  );
}
