"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, authClient } from "@/lib/auth-client";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleDemoFill = () => {
    setEmail(process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@hrfashion.com");
    setPassword(process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Demo1234!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn.email({ email, password });
      
      if (error) {
        toast.error(error.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }
      
      toast.success("Successfully logged in");
      
      await authClient.getSession({
        fetchOptions: { cache: "no-store" } // Force fresh fetch to update navbar
      });
      const targetUrl = callbackUrl || "/";
      
      router.push(targetUrl);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signIn.social({ provider: "google", callbackURL: callbackUrl || "/" });
      if (error) {
        toast.error(error.message || "Failed to sign in with Google");
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 shadow-sm mt-12 md:mt-24 mb-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif mb-2">Welcome Back</h1>
        <p className="text-neutral-500 text-sm">Sign in to your HR Fashion account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Password</label>
            <Link href="#" className="text-xs text-neutral-500 hover:text-foreground underline underline-offset-4">Forgot?</Link>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full py-3 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center min-h-[48px]"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-background px-4 text-neutral-500">Or continue with</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className="w-full py-3 border border-neutral-200 dark:border-neutral-800 text-sm font-medium rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
        >
          {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </>
          )}
        </button>

        <button 
          type="button"
          onClick={handleDemoFill}
          className="w-full py-3 border border-neutral-200 dark:border-neutral-800 text-sm font-medium rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
        >
          Use Demo Account
        </button>
      </div>

      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-foreground hover:underline underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
