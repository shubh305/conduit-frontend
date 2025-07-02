"use client";

import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/error-utils";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      await login({
        usernameOrEmail: formData.get("usernameOrEmail") as string,
        password: formData.get("password") as string,
      });
    } catch (error) {
      handleApiError(error, "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div className="space-y-2">
        <label className="font-mono text-xs text-foreground-muted uppercase tracking-wider block">Email or Username</label>
        <Input type="text" name="usernameOrEmail" placeholder="ENTER IDENTIFIER" className="bg-noir-bg border-noir-border focus:border-accent transition-colors text-foreground" required />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="font-mono text-xs text-foreground-muted uppercase tracking-wider block">Password</label>
          <Link href="/forgot-password" className="font-mono text-[10px] text-foreground-subtle hover:text-accent">
            FORGOT?
          </Link>
        </div>
        <Input type="password" name="password" placeholder="••••••••" className="bg-noir-bg border-noir-border focus:border-accent transition-colors text-foreground" required />
      </div>

      <Button type="submit" className="w-full bg-foreground text-noir-bg hover:bg-accent mt-8 font-bold" disabled={isLoading}>
        {isLoading ? "AUTHENTICATING..." : "SIGN IN"}
      </Button>

      <div className="text-center">
        <span className="font-mono text-xs text-foreground-subtle">
          DON&apos;T HAVE AN ACCOUNT?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            REGISTER
          </Link>
        </span>
      </div>
    </form>
  );
}
