"use client";

import React, { useState } from "react";
import ProductSearch from "../../components/ProductSearch";
import GoalForm from "../../components/GoalForm";
import SponsoredCard from "../../components/SponsoredCard";
import FoodCard from "../../components/FoodCard";
import RecipeCard from "../../components/RecipeCard";

export default function ResultsPage() {
  const [tab, setTab] = useState<"foods" | "recipes">("foods");
  const [foods, setFoods] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function normalizeList(x: any) {
    if (!x) return [];
    if (Array.isArray(x)) return x;
    if (Array.isArray(x.products)) return x.products;
    if (Array.isArray(x.results)) return x.results;
    if (Array.isArray(x.recipes)) return x.recipes;
    return [];
  }

  async function handleGoalSearch(params: any) {
    setLoading(true);
    try {
      const foodsPromise = fetch(`/api/foods?search_terms=&maxCalories=${params.calories ?? ""}&minProtein=${params.protein ?? ""}`).then((r) => r.json());
      const recipesPromise = fetch(`/api/recipes?query=${encodeURIComponent(params.diet ?? "")}&minProtein=${params.protein ?? ""}&maxCalories=${params.calories ?? ""}&diet=${encodeURIComponent(params.diet ?? "")}`).then((r) => r.json());
      const [foodsData, recipesData] = await Promise.all([foodsPromise, recipesPromise]);
      setFoods(normalizeList(foodsData));
      setRecipes(normalizeList(recipesData));
      setTab("foods");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <div className="mb-4">
        <SponsoredCard />
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Product Search</h2>
        <ProductSearch />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Goal-based Search</h2>
        <GoalForm onSearch={handleGoalSearch} />

        {loading && <div className="mt-3">Loading results…</div>}

        <div className="mt-4">
          <div className="flex gap-2 mb-3">
            <button className={`px-3 py-1 rounded ${tab === "foods" ? "bg-green-600 text-white" : "border"}`} onClick={() => setTab("foods")}>
              Foods
            </button>
            <button className={`px-3 py-1 rounded ${tab === "recipes" ? "bg-green-600 text-white" : "border"}`} onClick={() => setTab("recipes")}>
              Recipes
            </button>
          </div>

          {tab === "foods" ? (
            foods.length ? (
              <div className="grid grid-cols-1 gap-4">{foods.map((p, i) => <FoodCard key={p.code ?? i} product={p} />)}</div>
            ) : (
              <div className="text-zinc-500">No foods found. Try different goals.</div>
            )
          ) : recipes.length ? (
            <div className="grid grid-cols-1 gap-4">{recipes.map((r, i) => <RecipeCard key={r.id ?? i} recipe={r} />)}</div>
          ) : (
            <div className="text-zinc-500">No recipes found. Try different goals.</div>
          )}
        </div>
      </section>
    </div>
  );
}
