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
    try {
      const raw = localStorage.getItem("auth_user");
      if (raw) {
        setUser(JSON.parse(raw));
        setIsAuthenticated(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function login(u: User) {
    setUser(u);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("auth_user", JSON.stringify(u));
    } catch (e) {}
    setShowAuthModal(false);
  }

  function logout() {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("auth_user");
    } catch (e) {}
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
