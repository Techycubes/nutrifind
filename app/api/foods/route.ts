// Server route: search OpenFoodFacts
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;
    const query = sp.get("search_terms") || sp.get("query") || "";
    const maxKcal = sp.get("maxCalories") || sp.get("max_kcal") || "";
    const minProtein = sp.get("minProtein") || sp.get("min_protein") || "";

    const apiUrl = new URL("https://world.openfoodfacts.org/cgi/search.pl");
    apiUrl.searchParams.set("search_terms", query);
    if (maxKcal) apiUrl.searchParams.set("nutriment_energy_value", maxKcal);
    if (minProtein) apiUrl.searchParams.set("nutriment_proteins_value", minProtein);
    apiUrl.searchParams.set("json", "1");
    apiUrl.searchParams.set("page_size", "12");

    const resp = await fetch(apiUrl.toString());
    const data = await resp.json();
    return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
