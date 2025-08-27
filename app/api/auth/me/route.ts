import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  return NextResponse.json({ ok: true, token: token?.value ?? null });
}