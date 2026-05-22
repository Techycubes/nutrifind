// Server route: fallback to USDA FoodData Central
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;
    const query = sp.get("query") || "";

    const key = process.env.USDA_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing USDA_API_KEY" }), { status: 400, headers: { "content-type": "application/json" } });
    }

    const apiUrl = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
    apiUrl.searchParams.set("api_key", key);
    apiUrl.searchParams.set("query", query);
    apiUrl.searchParams.set("pageSize", "12");

    const resp = await fetch(apiUrl.toString(), { method: "GET" });
    const data = await resp.json();
    return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
