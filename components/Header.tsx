"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const router = useRouter();
  const auth = useAuth();

  return (
    <header className="w-full border-b" style={{ background: 'var(--card-bg)' }}>
      <div className="max-w-3xl mx-auto p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="text-lg font-bold" onClick={() => router.push('/')}>NutriFind</button>
        </div>

        <div className="flex items-center gap-2">
          {!auth.isAuthenticated ? (
            <>
              <button className="btn btn-ghost" onClick={() => auth.openAuthModal('login')}>Login</button>
              <button className="btn btn-primary" onClick={() => auth.openAuthModal('register')}>Register</button>
            </>
          ) : (
            <>
              <div className="muted">Signed in as {auth.user?.email ?? 'you'}</div>
              <button className="btn btn-outline" onClick={() => auth.logout()}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
