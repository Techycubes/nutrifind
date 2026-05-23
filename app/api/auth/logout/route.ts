import { removeTokenCookie } from "../../../../lib/auth";

export async function POST() {
  try {
    const cookie = removeTokenCookie();
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json", "Set-Cookie": cookie } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
