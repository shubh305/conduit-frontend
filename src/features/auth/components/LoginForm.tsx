"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back!");
      login();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div className="space-y-2">
        <label className="font-mono text-xs text-gray-400 uppercase tracking-wider block">
          Email or Username
        </label>
        <Input 
          type="text" 
          name="usernameOrEmail" 
          placeholder="ENTER IDENTIFIER"
          className="bg-noir-bg border-gray-700 focus:border-white transition-colors"
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="font-mono text-xs text-gray-400 uppercase tracking-wider block">
            Password
          </label>
          <Link href="/forgot-password" className="font-mono text-[10px] text-gray-500 hover:text-white">
            FORGOT?
          </Link>
        </div>
        <Input 
          type="password" 
          name="password" 
          placeholder="••••••••"
          className="bg-noir-bg border-gray-700 focus:border-white transition-colors"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-white text-black hover:bg-gray-200 mt-8 font-bold"
        disabled={isLoading}
      >
        {isLoading ? "AUTHENTICATING..." : "SIGN IN"}
      </Button>

      <div className="text-center">
         <span className="font-mono text-xs text-gray-500">
            DON&apos;T HAVE AN ACCOUNT?{" "}
            <Link href="/signup" className="text-white hover:underline">
              REGISTER
            </Link>
          </span>
      </div>
    </form>
  );
}
