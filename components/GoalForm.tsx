"use client";

import React, { useState } from "react";

type Props = {
  onSearch: (params: { calories?: number; protein?: number; diet?: string; mealType?: string }) => void;
};

export default function GoalForm({ onSearch }: Props) {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [diet, setDiet] = useState("");
  const [mealType, setMealType] = useState("");

  return (
    <form
      className="w-full max-w-md p-4 bg-white rounded-2xl shadow"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch({ calories: Number(calories) || undefined, protein: Number(protein) || undefined, diet, mealType });
      }}
    >
      <div className="mb-3">
        <label className="block text-sm font-medium">Target calories</label>
        <input className="w-full mt-1 p-2 border rounded" type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Target protein (g)</label>
        <input className="w-full mt-1 p-2 border rounded" type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value))} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Dietary preference</label>
        <select className="w-full mt-1 p-2 border rounded" value={diet} onChange={(e) => setDiet(e.target.value)}>
          <option value="">None</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten free">Gluten-free</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Meal type</label>
        <select className="w-full mt-1 p-2 border rounded" value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="any">Any</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>
      <button className="w-full py-2 px-4 rounded bg-green-600 text-white">Find Foods</button>
    </form>
  );
}
