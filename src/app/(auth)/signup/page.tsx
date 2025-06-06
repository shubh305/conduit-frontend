import { SignupForm } from "@/features/auth/components/SignupForm";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Conduit",
  description: "Create your Conduit account",
};

export default function SignupPage() {
  return (
    <AuthLayout 
      title="Join Conduit" 
      subtitle="Create your global identity."
      cyberSideContent={
        <>
          {`// NEW OPERATOR REGISTRATION`}<br/>
          {`// ESTABLISH YOUR FREQUENCY`}
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
