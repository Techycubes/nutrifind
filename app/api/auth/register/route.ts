import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, createTokenCookie } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email || "").toLowerCase().trim();
    const password = body?.password;
    const name = body?.name || null;
    if (!email || !password) return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400, headers: { "content-type": "application/json" } });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return new Response(JSON.stringify({ error: "Email already in use" }), { status: 400, headers: { "content-type": "application/json" } });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    const token = signToken({ userId: user.id });
    const cookie = createTokenCookie(token);
    const out = { id: user.id, email: user.email, name: user.name };
    return new Response(JSON.stringify(out), { status: 200, headers: { "content-type": "application/json", "Set-Cookie": cookie } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
