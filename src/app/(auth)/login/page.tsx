import * as React from "react";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata = { title: "Sign In | Dr.Retina" };

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm text-slate-500" aria-busy="true">Loading sign-in...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
