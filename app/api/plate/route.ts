import { getUserFromRequest } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
    const items = await prisma.plateItem.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return new Response(JSON.stringify(items), { headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
    const body = await req.json();
    const entry = {
      externalId: body.externalId ?? null,
      name: body.name ?? "Item",
      calories: body.calories ?? null,
      protein: body.protein ?? null,
      userId: user.id,
    };
    const created = await prisma.plateItem.create({ data: entry });
    return new Response(JSON.stringify(created), { status: 201, headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
    const body = await req.json();
    const id = body?.id;
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400, headers: { "content-type": "application/json" } });
    await prisma.plateItem.deleteMany({ where: { id: String(id), userId: user.id } });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
