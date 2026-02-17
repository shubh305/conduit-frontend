"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, register as apiRegister, getCurrentUser } from "./api";
import { setUnauthorizedHandler } from "@/lib/api-client";
import { getMyTenants } from "@/features/blog/api";
import { User, AuthState, LoginDto, RegisterDto } from "./types";
import { toast } from "sonner";
import { getRootDomain, getRootUrl } from "@/lib/utils";

import { setAuthCookie, getAuthCookie, removeAuthCookie } from "@/lib/auth-cookies";

interface AuthContextType extends AuthState {
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
  signup: (data: RegisterDto) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      const urlRefreshToken = urlParams.get("refreshToken");
      const isLoggingOut = urlParams.get("action") === "logout";

      if (isLoggingOut) {
        console.log("[Auth] Logout handshake detected. Clearing session...");
        removeAuthCookie("accessToken");
        removeAuthCookie("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("conduit_user");

        window.history.replaceState({}, document.title, window.location.pathname);
        setIsLoading(false);
        setUser(null);
        return;
      }

      if (urlToken) {
        setAuthCookie("accessToken", urlToken);
        localStorage.setItem("accessToken", urlToken);
        if (urlRefreshToken) {
          setAuthCookie("refreshToken", urlRefreshToken);
          localStorage.setItem("refreshToken", urlRefreshToken);
        }

        const newUrl =
          window.location.pathname +
          window.location.search
            .replace(/[?&]token=[^&]+/, "")
            .replace(/[?&]refreshToken=[^&]+/, "")
            .replace(/^[?&]/, "?");
        window.history.replaceState({}, document.title, newUrl);
      }

      const cookieToken = getAuthCookie("accessToken");
      const localToken = localStorage.getItem("accessToken");
      const token = cookieToken || localToken;

      console.log("[Auth] Init shared session:", {
        hostname: window.location.hostname,
        hasCookie: !!cookieToken,
        hasLocalStorage: !!localToken,
      });

      if (localToken && !cookieToken) {
        console.log("[Auth] Syncing localStorage token to cookies...");
        const refreshToken = localStorage.getItem("refreshToken");
        setAuthCookie("accessToken", localToken);
        if (refreshToken) setAuthCookie("refreshToken", refreshToken);

        if (getAuthCookie("accessToken")) {
          console.log("[Auth] Cookie successfully synced.");
        }
      }

      if (!token) {
        console.log("[Auth] No token found in storage.");
        setIsLoading(false);
        return;
      }
      try {
        console.log("[Auth] validating token...");
        const user = await getCurrentUser();

        if (!user) {
          throw new Error("Failed to get current user");
        }

        try {
          const myTenants = await getMyTenants();
          user.tenants = myTenants;
        } catch (e) {
          console.warn("[Auth] Failed to load tenants", e);
          if (user) {
            user.tenants = [];
          }
        }

        console.log("[Auth] User validated:", user.username);
        setUser(user);
      } catch (error) {
        console.error("[Auth] Initialization failed. Clearing session.", error);
        removeAuthCookie("accessToken");
        removeAuthCookie("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(
    async (data: LoginDto) => {
      try {
        const response = await apiLogin(data);
        setAuthCookie("accessToken", response.accessToken);
        setAuthCookie("refreshToken", response.refreshToken);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        const user = response.user;
        try {
          const tenants = await getMyTenants();
          user.tenants = tenants;
        } catch (e) {
          console.warn("[Auth] Failed to load tenants after login", e);
          user.tenants = [];
        }

        setUser(user);
        router.push("/");
        toast.success("Welcome back!");
      } catch (error) {
        throw error;
      }
    },
    [router],
  );

  const signup = useCallback(
    async (data: RegisterDto) => {
      try {
        const response = await apiRegister(data);
        setAuthCookie("accessToken", response.accessToken);
        setAuthCookie("refreshToken", response.refreshToken);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        const user = response.user;
        try {
          const tenants = await getMyTenants();
          user.tenants = tenants;
        } catch {
          user.tenants = [];
        }

        setUser(user);
        
        if (!user.onboardingCompleted) {
          router.push("/walkthrough");
        } else {
          router.push("/");
        }
        
        toast.success("Identity established.");
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    setUser(null);
    removeAuthCookie("accessToken");
    removeAuthCookie("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("conduit_user");

    const root = getRootDomain();

    if (root.includes("localhost")) {
      removeAuthCookie("accessToken", { domain: ".localhost", path: "/" });
      removeAuthCookie("refreshToken", { domain: ".localhost", path: "/" });
    }

    toast.success("Logged out.");

    const rootUrl = getRootUrl();
    window.location.href = `${rootUrl}login?action=logout`;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const newUser = await getCurrentUser();
      if (!newUser) return;

      try {
        const myTenants = await getMyTenants();
        newUser.tenants = myTenants;
      } catch (e) {
        console.warn("[Auth] Failed to reload tenants", e);
        newUser.tenants = [];
      }

      setUser(prev => {
        if (JSON.stringify(prev) === JSON.stringify(newUser)) {
          return prev;
        }
        return newUser;
      });
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      console.warn("[Auth] Unauthorized detected via API. Logging out.");
      logout();
    });
    return () => setUnauthorizedHandler(() => {});
  }, [logout]);

  return <AuthContext.Provider value={{ user, isLoading, error: null, login, logout, signup, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
