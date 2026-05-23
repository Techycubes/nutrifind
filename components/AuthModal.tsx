"use client";

import React, { useState } from "react";

export default function AuthModal({ open, mode, onClose, onLogin }: { open: boolean; mode: "login" | "register"; onClose: () => void; onLogin: (u: { email?: string } | null) => void; }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md p-6 bg-[var(--card-bg)] rounded-2xl card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{mode === "login" ? "Sign In" : "Register"}</h3>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin({ email }); }}>
          <input className="w-full p-3 border rounded mb-3 bg-[var(--card-bg)]" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full p-3 border rounded mb-4 bg-[var(--card-bg)]" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit">{mode === "login" ? "Sign in" : "Create account"}</button>
            <button className="btn btn-outline" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
