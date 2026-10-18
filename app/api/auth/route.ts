import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const envPwd = process.env.APP_PASSWORD ?? "admin123";
  if (password === envPwd) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth", "yes", { httpOnly: true, path: "/" });
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
