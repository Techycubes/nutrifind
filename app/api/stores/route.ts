// Server route: Kroger store lookup (requires KROGER_CLIENT_ID and KROGER_CLIENT_SECRET)
// This implementation requests an OAuth token and caches it in-memory for the process.

type KrogerToken = { access_token: string; expires_at: number } | null;

const globalAny: any = globalThis as any;

async function getKrogerToken(): Promise<string> {
  const clientId = process.env.KROGER_CLIENT_ID;
  const clientSecret = process.env.KROGER_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Missing KROGER_CLIENT_ID or KROGER_CLIENT_SECRET");

  if (!globalAny.__kroger_token) globalAny.__kroger_token = null as KrogerToken;
  const cached: KrogerToken = globalAny.__kroger_token;
  if (cached && cached.expires_at > Date.now()) return cached.access_token;

  const tokenUrl = "https://api.kroger.com/v1/connect/oauth2/token";
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: { Authorization: `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await resp.json();
  if (!data.access_token) throw new Error("Failed to get Kroger token");
  const expires = Date.now() + (Number(data.expires_in || 3600) - 60) * 1000;
  globalAny.__kroger_token = { access_token: data.access_token, expires_at: expires };
  return data.access_token;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;
    const lat = sp.get("lat");
    const lon = sp.get("lon");

    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: "Missing lat/lon" }), { status: 400, headers: { "content-type": "application/json" } });
    }

    const token = await getKrogerToken();
    // Kroger locations endpoint — filter usage can vary depending on API version
    const apiUrl = new URL("https://api.kroger.com/v1/locations");
    apiUrl.searchParams.set("filter.lat", lat);
    apiUrl.searchParams.set("filter.lon", lon);
    apiUrl.searchParams.set("filter.limit", "10");

    const resp = await fetch(apiUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await resp.json();
    return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
