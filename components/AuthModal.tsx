"use client";

import React, { useState } from "react";

export default function AuthModal({ open, mode, onClose, onLogin }: { open: boolean; mode: "login" | "register"; onClose: () => void; onLogin: (u: { email?: string } | null) => void; }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }), credentials: "same-origin" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Authentication failed");
        return;
      }
      onLogin(data);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md p-6 bg-[var(--card-bg)] rounded-2xl card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{mode === "login" ? "Sign In" : "Register"}</h3>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input className="w-full p-3 border rounded mb-3 bg-[var(--card-bg)]" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full p-3 border rounded mb-4 bg-[var(--card-bg)]" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Please wait…" : (mode === "login" ? "Sign in" : "Create account")}</button>
            <button className="btn btn-outline" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
