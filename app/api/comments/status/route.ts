import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const response = await fetch("https://giscus.app/api/discussions/categories?repo=asterunee%2FBlog", { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    return NextResponse.json({ ready: response.ok }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" } });
  } catch {
    return NextResponse.json({ ready: false }, { headers: { "Cache-Control": "public, s-maxage=300" } });
  }
}
