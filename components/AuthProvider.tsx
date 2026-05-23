"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import AuthModal from "./AuthModal";

type AuthMode = "login" | "register";

type User = { email?: string } | null;

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  login: (user: User) => void;
  logout: () => void;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  showAuthModal: boolean;
  authMode: AuthMode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  useEffect(() => {
    // check server-side session
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setIsAuthenticated(true);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  async function login(u: User) {
    setUser(u);
    setIsAuthenticated(true);
    try {
      // merge any local plate into server
      const raw = localStorage.getItem("my_plate");
      if (raw) {
        const items = JSON.parse(raw);
        await fetch("/api/plate/merge", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ items }) });
        localStorage.removeItem("my_plate");
      }
      localStorage.setItem("auth_user", JSON.stringify(u));
    } catch (e) {}
    setShowAuthModal(false);
  }

  function logout() {
    (async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (e) {}
      setUser(null);
      setIsAuthenticated(false);
      try {
        localStorage.removeItem("auth_user");
      } catch (e) {}
    })();
  }

  function openAuthModal(mode: AuthMode = "login") {
    setAuthMode(mode);
    setShowAuthModal(true);
  }

  function closeAuthModal() {
    setShowAuthModal(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, openAuthModal, closeAuthModal, showAuthModal, authMode }}>
      {children}
      <AuthModal open={showAuthModal} mode={authMode} onClose={closeAuthModal} onLogin={login} />
    </AuthContext.Provider>
  );
}
