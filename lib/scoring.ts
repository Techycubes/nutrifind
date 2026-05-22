import type { Product, ScoredProduct } from "./types";

function getN(product: Product | undefined, keys: string[]): number | undefined {
  if (!product?.nutriments) return undefined;
  for (const k of keys) {
    const direct = product.nutriments[k as string];
    if (typeof direct === "number") return direct;
    const alt = k.replace(/-/g, "_");
    const altv = product.nutriments[alt];
    if (typeof altv === "number") return altv;
  }
  return undefined;
}

export function scoreProduct(product: Product | undefined): ScoredProduct {
  const baseMap: Record<string, number> = { a: 95, b: 75, c: 55, d: 35, e: 15 };
  const gradeKey = (product?.nutriscore_grade || "").toLowerCase();
  const base = baseMap[gradeKey] ?? 50;

  const novaVal = Number(product?.nova_group ?? 0) || 0;
  const novaDeduct = novaVal === 2 ? 5 : novaVal === 3 ? 10 : novaVal === 4 ? 20 : 0;

  const additives = product?.additives_tags ?? [];
  const additiveDeduct = Math.min(additives.length * 3, 20);

  const proteins = getN(product, ["proteins_100g", "proteins-100g", "proteins"]) ?? 0;
  const fiber = getN(product, ["fiber_100g", "fiber-100g", "fiber"]) ?? 0;
  const sugars = getN(product, ["sugars_100g", "sugars-100g", "sugars"]) ?? 0;
  const satFat = getN(product, ["saturated-fat_100g", "saturated_fat_100g", "saturated-fat-100g", "saturated_fat"]) ?? 0;
  const sodium = getN(product, ["sodium_100g", "sodium-100g", "sodium"]) ?? 0;
  const energy = getN(product, ["energy-kcal_100g", "energy-kcal", "energy_100g", "energy"]) ?? 0;

  const positives: string[] = [];
  if (proteins > 5) positives.push("Good source of protein");
  if (fiber > 3) positives.push("High in fiber");
  if (sugars < 5) positives.push("Low in sugar");
  if (satFat < 1.5) positives.push("Low in saturated fat");
  if (sodium < 0.3) positives.push("Low in sodium");

  const warnings: string[] = [];
  if (sugars > 15) warnings.push("High sugar content");
  if (satFat > 5) warnings.push("High saturated fat");
  if (sodium > 0.6) warnings.push("High sodium");
  if (Number(product?.nova_group) === 4) warnings.push("Ultra-processed food");
  if (energy > 400) warnings.push("High calorie density");

  let score = base - novaDeduct - additiveDeduct;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#eab308" : score >= 25 ? "#f97316" : "#ef4444";

  const mappedAdditives = additives.map((tag) => {
    const name = String(tag).split(":").pop() ?? String(tag);
    // conservative default risk mapping — real data could be analyzed more precisely
    const risk: "low" | "moderate" | "high" = "moderate";
    return { name, risk } as const;
  });

  const grade = product?.nutriscore_grade
    ? String(product.nutriscore_grade).toUpperCase()
    : score >= 75
    ? "A"
    : score >= 50
    ? "B"
    : score >= 25
    ? "C"
    : score >= 0
    ? "D"
    : "?";

  return {
    score,
    grade,
    color,
    positives,
    warnings,
    additives: mappedAdditives,
  };
}
