"use client";

import React, { useState } from "react";
import FoodCard from "./FoodCard";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      const items = data.products || data.results || data;
      setResults(Array.isArray(items) ? items : []);
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form className="flex gap-2 mb-4" onSubmit={search}>
        <input className="flex-1 p-3 border rounded-full" placeholder="Search product or food" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        {results.map((p: any, i: number) => (
          <FoodCard key={p.code ?? i} product={p} />
        ))}
      </div>
    </div>
  );
}
