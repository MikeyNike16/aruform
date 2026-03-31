import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    // TODO: wire this to a real provider (Buttondown/Mailchimp/Resend/etc.) via env vars.
    // For now, we just acknowledge. In Vercel logs you'll still see the signups if you want.
    console.log(`[waitlist] ${new Date().toISOString()} ${email}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
