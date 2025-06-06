"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Identity established.");
      signup();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <label className="font-mono text-xs text-gray-400 uppercase tracking-wider block">
          Email
        </label>
        <Input 
          type="email" 
          name="email" 
          placeholder="EMAIL ORDER"
          className="bg-noir-bg border-gray-700 focus:border-white transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="font-mono text-xs text-gray-400 uppercase tracking-wider block">
          Username
        </label>
        <Input 
          type="text" 
          name="username" 
          placeholder="CODENAME"
          className="bg-noir-bg border-gray-700 focus:border-white transition-colors"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="font-mono text-xs text-gray-400 uppercase tracking-wider block">
          Password
        </label>
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
        className="w-full bg-white text-black hover:bg-gray-200 mt-6 font-bold"
        disabled={isLoading}
      >
        {isLoading ? "INITIALIZING..." : "CREATE ACCOUNT"}
      </Button>

      <div className="text-center pt-4">
         <span className="font-mono text-xs text-gray-500">
            ALREADY INITIALIZED?{" "}
            <Link href="/login" className="text-white hover:underline">
              SIGN IN
            </Link>
          </span>
      </div>
    </form>
  );
}
