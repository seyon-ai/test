import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt");
  const width = searchParams.get("width") || "1080";
  const height = searchParams.get("height") || "1920";
  const seed = searchParams.get("seed") || String(Math.floor(Math.random()*1e9));
  const nologo = searchParams.get("nologo") || "true";

  if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

  const encoded = encodeURIComponent(prompt);
  const key = process.env.POLLINATIONS_API_KEY;
  // FINAL endpoint: gen.pollinations.ai — never image.pollinations.ai
  let url = `https://gen.pollinations.ai/image/${encoded}?width=${width}&height=${height}&nologo=${nologo}&seed=${seed}`;
  // If key present, pass as query? Pollinations supports header or query; we use header server-side when fetching
  const headers: Record<string,string> = {};
  if (key) headers["Authorization"] = `Bearer ${key}`;

  try {
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) {
      const txt = await res.text().catch(()=> "");
      return NextResponse.json({ error: "Pollinations error", status: res.status, body: txt.slice(0,500) }, { status: 502 });
    }
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
        "X-IGMA-Proxy": "pollinations",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
