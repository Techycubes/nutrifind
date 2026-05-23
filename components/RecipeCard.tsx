"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function RecipeCard({ recipe }: { recipe: any }) {
  const [added, setAdded] = useState(false);
  const auth = useAuth();

  return (
    <div className="p-4 card soft-shadow flex items-center justify-between">
      <div>
        <div className="font-medium">{recipe.title || recipe.name}</div>
        <div className="text-sm muted">{recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : "—"}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              if (!auth.isAuthenticated) return auth.openAuthModal("login");
              const entry = {
                name: recipe.title ?? recipe.name ?? "Recipe",
                calories: recipe.nutrition?.calories ?? null,
                protein: null,
              };
              const res = await fetch('/api/plate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entry) });
              if (res.status === 401) return auth.openAuthModal('login');
              if (!res.ok) throw new Error('Failed to add');
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Add to Plate
        </button>
        {added && <div className="badge" style={{ background: "#ecfdf5", color: "#065f46" }}>Added</div>}
      </div>
    </div>
  );
}
