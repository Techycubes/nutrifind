// Server route: product lookup / search via OpenFoodFacts
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;
    const barcode = sp.get("barcode");
    const query = sp.get("query") || "";

    if (barcode) {
      const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`;
      const resp = await fetch(apiUrl);
      const data = await resp.json();
      return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
    }

    // fallback to search by name
    const apiSearch = new URL("https://world.openfoodfacts.org/cgi/search.pl");
    apiSearch.searchParams.set("search_terms", query);
    apiSearch.searchParams.set("json", "1");
    apiSearch.searchParams.set("page_size", "12");
    const resp = await fetch(apiSearch.toString());
    const data = await resp.json();
    return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
