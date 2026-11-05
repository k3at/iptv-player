import { NextResponse } from "next/server";

// يعمل هذا المسار في وضع التصدير الثابت أيضاً (GET فقط).
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "iptv-player",
    time: new Date().toISOString(),
  });
}
