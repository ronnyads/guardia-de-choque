import { NextResponse, type NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 12;
const WINDOW_MS  = 60_000;

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const r   = rateLimitMap.get(ip);
  if (!r || now > r.reset) { rateLimitMap.set(ip, { count: 1, reset: now + WINDOW_MS }); return false; }
  r.count++;
  rateLimitMap.set(ip, r);
  return r.count > RATE_LIMIT;
}

const SEC: Record<string, string> = {
  "X-Frame-Options":         "SAMEORIGIN",
  "X-Content-Type-Options":  "nosniff",
  "Referrer-Policy":         "strict-origin-when-cross-origin",
  "Permissions-Policy":      "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security":"max-age=63072000; includeSubDomains; preload",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/checkout")) {
    if (isRateLimited(getClientIp(request))) {
      return NextResponse.json(
        { success: false, error: "Muitas tentativas. Aguarde 1 minuto." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  const res = NextResponse.next();
  Object.entries(SEC).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
