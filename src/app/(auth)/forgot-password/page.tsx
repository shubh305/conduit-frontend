"use client";

import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setSubmitted(true);
        toast.success("Reset link sent");
    }, 1000);
  };

  return (
    <AuthLayout
        title="Reset Password"
        subtitle="Enter your email to restore access."
        cyberSideContent={
            <>
              {`// ACCESS RECOVERY`}<br/>
              {`// IDENTITY VERIFICATION REQUIRED`}
            </>
        }
    >
       {!submitted ? (
           <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
             <div className="space-y-2">
                <Input 
                   type="email" 
                   placeholder="NAME@EXAMPLE.COM" 
                   required 
                   className="bg-transparent border-gray-700 focus:border-white transition-colors"
                />
             </div>
             <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "PROCESSING..." : "SEND RESET LINK"}
             </Button>
             <div className="text-center mt-4">
                <Link href="/login" className="text-xs font-mono text-gray-500 hover:text-white uppercase">
                    Back to Login
                </Link>
             </div>
           </form>
       ) : (
           <div className="text-center space-y-4">
              <div className="p-4 border border-green-500/30 bg-green-500/10 text-green-500 font-mono text-xs">
                 RECOVERY PROTOCOL INITIATED. CHECK YOUR INBOX.
              </div>
              <Button onClick={() => setSubmitted(false)} variant="ghost" className="text-xs">
                 TRY ANOTHER EMAIL
              </Button>
           </div>
       )}
    </AuthLayout>
  );
}
