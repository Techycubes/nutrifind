import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const TOKEN_NAME = "token";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as any;
}

export function createTokenCookie(token: string) {
  return serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function removeTokenCookie() {
  return serialize(TOKEN_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getTokenFromRequest(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const parsed = parse(cookie || "");
    return parsed[TOKEN_NAME];
  } catch (e) {
    return undefined;
  }
}

export async function getUserFromRequest(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return null;
    const data = verifyToken(token);
    if (!data?.userId) return null;
    const { default: prisma } = await import("./prisma");
    const user = await prisma.user.findUnique({ where: { id: String(data.userId) }, select: { id: true, email: true, name: true } });
    return user;
  } catch (e) {
    return null;
  }
}
