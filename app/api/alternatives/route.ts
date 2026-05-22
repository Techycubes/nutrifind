import { scoreProduct } from "../../../lib/scoring";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;
    const category = sp.get("category") || sp.get("query") || "";

    if (!category) {
      return new Response(JSON.stringify({ error: "Missing category query" }), { status: 400, headers: { "content-type": "application/json" } });
    }

    const apiUrl = new URL("https://world.openfoodfacts.org/cgi/search.pl");
    apiUrl.searchParams.set("search_terms", category);
    apiUrl.searchParams.set("json", "1");
    apiUrl.searchParams.set("page_size", "24");

    const resp = await fetch(apiUrl.toString());
    const data = await resp.json();
    const products = (data.products || []).filter((p: any) => {
      const g = (p.nutriscore_grade || "").toLowerCase();
      return g === "a" || g === "b";
    });

    const slice = products.slice(0, 3).map((p: any) => ({ product: p, score: scoreProduct(p) }));
    return new Response(JSON.stringify({ alternatives: slice }), { headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
