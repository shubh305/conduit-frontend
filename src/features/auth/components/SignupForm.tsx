"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleApiError } from "@/lib/error-utils";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      await signup({
        email: formData.get("email") as string,
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        displayName: formData.get("displayName") as string,
      });
    } catch (error) {
      handleApiError(error, "Failed to create account. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <label className="font-mono text-xs text-foreground-muted uppercase tracking-wider block">Display Name</label>
        <Input type="text" name="displayName" placeholder="AGENT NAME" className="bg-noir-bg border-noir-border focus:border-accent transition-colors text-foreground" required />
      </div>

      <div className="space-y-2">
        <label className="font-mono text-xs text-foreground-muted uppercase tracking-wider block">Email</label>
        <Input type="email" name="email" placeholder="EMAIL ORDER" className="bg-noir-bg border-noir-border focus:border-accent transition-colors text-foreground" required />
      </div>

      <div className="space-y-2">
        <label className="font-mono text-xs text-foreground-muted uppercase tracking-wider block">Username</label>
        <Input type="text" name="username" placeholder="CODENAME" className="bg-noir-bg border-noir-border focus:border-accent transition-colors text-foreground" required />
      </div>

      <div className="space-y-2">
        <label className="font-mono text-xs text-foreground-muted uppercase tracking-wider block">Password</label>
        <Input type="password" name="password" placeholder="••••••••" className="bg-noir-bg border-noir-border focus:border-accent transition-colors text-foreground" required />
      </div>

      <Button type="submit" className="w-full bg-foreground text-noir-bg hover:bg-accent mt-6 font-bold" disabled={isLoading}>
        {isLoading ? "INITIALIZING..." : "CREATE ACCOUNT"}
      </Button>

      <div className="text-center pt-4">
        <span className="font-mono text-xs text-foreground-subtle">
          ALREADY INITIALIZED?{" "}
          <Link href="/login" className="text-accent hover:underline">
            SIGN IN
          </Link>
        </span>
      </div>
    </form>
  );
}
