import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, createTokenCookie } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email || "").toLowerCase().trim();
    const password = body?.password;
    if (!email || !password) return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400, headers: { "content-type": "application/json" } });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: { "content-type": "application/json" } });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: { "content-type": "application/json" } });

    const token = signToken({ userId: user.id });
    const cookie = createTokenCookie(token);
    const out = { id: user.id, email: user.email, name: user.name };
    return new Response(JSON.stringify(out), { status: 200, headers: { "content-type": "application/json", "Set-Cookie": cookie } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
