import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Conduit",
  description: "Sign in to your Conduit account",
};

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your credentials to access the studio."
      cyberSideContent={
        <>
           {`// SYSTEM ACCESS`}<br/>
           {`// UNAUTHORIZED PERSONNEL WILL BE LOGGED`}
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
