// Server route: proxies to Spoonacular complexSearch
// Note: Spoonacular free tier is limited (~150 requests/day)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;
    const query = sp.get("query") || "";
    const minProtein = sp.get("minProtein");
    const maxCalories = sp.get("maxCalories");
    const diet = sp.get("diet") || "";
    const type = sp.get("type") || "";

    const key = process.env.SPOONACULAR_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing SPOONACULAR_API_KEY" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const apiUrl = new URL("https://api.spoonacular.com/recipes/complexSearch");
    apiUrl.searchParams.set("query", query);
    apiUrl.searchParams.set("addRecipeNutrition", "true");
    apiUrl.searchParams.set("number", "12");
    if (diet) apiUrl.searchParams.set("diet", diet);
    if (type) apiUrl.searchParams.set("type", type);
    if (minProtein) apiUrl.searchParams.set("minProtein", minProtein);
    if (maxCalories) apiUrl.searchParams.set("maxCalories", maxCalories);
    apiUrl.searchParams.set("apiKey", key);

    const resp = await fetch(apiUrl.toString());
    const data = await resp.json();
    return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
