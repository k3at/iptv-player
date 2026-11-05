import { parseM3u, type Playlist } from "@/lib/m3u";

export const DEMO_PLAYLIST_ID = "demo";

/**
 * القائمة التجريبية: روابط بث عامة مخصصة للاختبار من Apple وMux
 * وUnified Streaming وAmazon CloudFront وW3C وMDN.
 * تحققنا من تشغيل كل رابط داخل متصفح حقيقي قبل شحنه، واستُبعد كل ما فشل.
 */
export const DEMO_PLAYLIST_CONTENT = `#EXTM3U
#EXTINF:-1 tvg-id="mux-bbb" group-title="بث HLS تجريبي",Big Buck Bunny HLS
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 tvg-id="apple-bipbop" group-title="بث HLS تجريبي",Apple BipBop HLS
https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8
#EXTINF:-1 tvg-id="mux-tos" group-title="بث HLS تجريبي",Tears of Steel HLS
https://test-streams.mux.dev/tos_ismc/main.m3u8
#EXTINF:-1 tvg-id="us-tos" group-title="بث HLS تجريبي",Tears of Steel Unified
https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8
#EXTINF:-1 tvg-id="cf-bipbop" group-title="بث HLS تجريبي",BipBop CloudFront
https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8
#EXTINF:-1 tvg-id="mux-pts" group-title="بث HLS تجريبي",Mux PTS Shift
https://test-streams.mux.dev/pts_shift/master.m3u8
#EXTINF:-1 tvg-id="sintel-trailer" group-title="فيديو MP4 تجريبي",Sintel Trailer MP4
https://media.w3.org/2010/05/sintel/trailer.mp4
#EXTINF:-1 tvg-id="mdn-flower" group-title="فيديو MP4 تجريبي",Flower MP4
https://mdn.github.io/shared-assets/videos/flower.mp4
`;

/** ينشئ كائن القائمة التجريبية الجاهزة. */
export function createDemoPlaylist(): Playlist {
  return {
    id: DEMO_PLAYLIST_ID,
    name: "القائمة التجريبية",
    source: "demo",
    origin: null,
    addedAt: Date.now(),
    content: DEMO_PLAYLIST_CONTENT,
    channels: parseM3u(DEMO_PLAYLIST_CONTENT),
  };
}
