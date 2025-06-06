"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "./types";
import { mockUser } from "./data/mock-user";
import { useRouter } from "next/navigation";

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  signup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage on mount
    const storedUser = localStorage.getItem("conduit_user");
    if (storedUser) {
      try {

        const user = JSON.parse(storedUser);
        setTimeout(() => setUser(user), 0);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("conduit_user");
      }
    }
    setTimeout(() => setIsLoading(false), 0);
  }, []);

  const login = () => {
    // Demo login: simply set the mock user
    setUser(mockUser);
    localStorage.setItem("conduit_user", JSON.stringify(mockUser));
    router.push("/");
  };

  const signup = () => {
    // Demo signup: same as login
    setUser(mockUser);
    localStorage.setItem("conduit_user", JSON.stringify(mockUser));
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("conduit_user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error: null, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
