"use client";

import React, { useState } from "react";

export default function RecipeCard({ recipe }: { recipe: any }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="p-4 rounded-2xl shadow bg-white flex items-center justify-between">
      <div>
        <div className="font-medium">{recipe.title || recipe.name}</div>
        <div className="text-sm text-zinc-500">{recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : "—"}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          className="text-sm text-green-600"
          onClick={() => {
            try {
              const raw = localStorage.getItem("my_plate");
              const arr = raw ? JSON.parse(raw) : [];
              const entry = {
                id: recipe.id ?? `${recipe.title ?? recipe.name}-${Date.now()}`,
                name: recipe.title ?? recipe.name ?? "Recipe",
                calories: recipe.nutrition?.calories ?? undefined,
                protein: undefined,
              };
              arr.push(entry);
              localStorage.setItem("my_plate", JSON.stringify(arr));
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Add to Plate
        </button>
        {added && <div className="text-sm text-green-700">Added</div>}
      </div>
    </div>
  );
}
