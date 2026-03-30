"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Phone, Loader2 } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      
      // 1. Sign up user via custom API to bypass email verification config errors
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      // 2. Immediately sign them in and establish their session locally
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // 3. Redirect directly to the dashboard with no verification wait
      router.push(redirectTo);
      router.refresh();
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // The custom verification flow UI has been removed, returning normal layout
  if (verificationSent) {
    return (
      <div className="text-center py-8">
        <Mail className="mx-auto h-12 w-12 text-accent mb-4" />
        <h2 className="text-2xl font-serif text-charcoal mb-2">Check your email</h2>
        <p className="text-charcoal/70 mb-6 font-medium">
          We sent a verification link to <span className="font-semibold text-charcoal">{email}</span>.<br />
          Please click the link to verify your account so you can login.
        </p>
        <button onClick={() => setVerificationSent(false)} className="text-sm text-accent hover:underline font-medium">
          Back to registration
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-charcoal mb-2 text-center">Create Account</h1>
      <p className="text-sm text-charcoal/60 text-center mb-8">Join K2K Adventurez for effortless bookings</p>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">{error}</div>}
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-charcoal/80 uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={16} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm text-charcoal"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-charcoal/80 uppercase tracking-wider">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={16} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm text-charcoal"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-charcoal/80 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm text-charcoal"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-charcoal/80 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={16} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm text-charcoal"
              placeholder="••••••••"
            />
          </div>
          <p className="text-[10px] text-charcoal/40 pl-1">Must be at least 6 characters long</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-dark transition-colors disabled:opacity-70 mt-4"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-charcoal/60">
        Already have an account?{" "}
        <Link href={`/login${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`} className="text-accent font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <Loader2 size={32} className="animate-spin text-accent/50" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

