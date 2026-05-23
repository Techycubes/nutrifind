import { getUserFromRequest } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const toCreate = items.map((it: any) => ({
      userId: user.id,
      externalId: it.id ?? null,
      name: it.name ?? "Item",
      calories: typeof it.calories === "number" ? it.calories : (it.calories ? Number(it.calories) : null),
      protein: typeof it.protein === "number" ? it.protein : (it.protein ? Number(it.protein) : null),
    }));
    // createMany for efficiency; duplicates might be inserted but that's acceptable for initial merge
    if (toCreate.length) {
      await prisma.plateItem.createMany({ data: toCreate });
    }
    const itemsOut = await prisma.plateItem.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return new Response(JSON.stringify(itemsOut), { status: 200, headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
