"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signUp } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = signUp({ name, email, password });
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/write");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border border-gray-800 rounded-2xl bg-gray-900/50 backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-400 mb-6">Save entries under your own profile.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-gray-700 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-gray-700 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-gray-700 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
