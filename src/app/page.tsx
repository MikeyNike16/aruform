"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getEntriesForUser } from "@/lib/entries";

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}

function track(eventName: string, props?: Record<string, any>) {
  try {
    window.plausible?.(eventName, props ? { props } : undefined);
  } catch {
    // ignore
  }
}

type Entry = {
  date?: string;
  mood?: number;
  energy?: number;
  stress?: number;
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [entryCount, setEntryCount] = useState(0);
  const [recentEntries, setRecentEntries] = useState(0);
  const [stabilityScore, setStabilityScore] = useState(0);
  const [avgMood, setAvgMood] = useState(0);
  const [avgEnergy, setAvgEnergy] = useState(0);
  const [avgStress, setAvgStress] = useState(0);

  const [email, setEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    const user = getCurrentUser();
    setIsLoggedIn(Boolean(user));
    const entriesRaw = user
      ? getEntriesForUser(user)
      : JSON.parse(localStorage.getItem("entries") || "[]");
    const entries: Entry[] = Array.isArray(entriesRaw) ? entriesRaw : [];

    const sorted = entries
      .slice()
      .sort(
        (a, b) =>
          new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()
      );

    const count = sorted.length;
    setEntryCount(count);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = sorted.filter((e) => new Date(e.date || 0) > weekAgo).length;
    setRecentEntries(recent);

    const score = count > 0 ? Math.min(100, Math.round(count * 8 + recent * 5)) : 0;
    setStabilityScore(score);

    const recentForState = sorted.slice(0, 7).filter((e) => e.mood !== undefined);
    if (recentForState.length > 0) {
      const totalMood = recentForState.reduce((sum, e) => sum + (e.mood || 5), 0);
      const totalEnergy = recentForState.reduce((sum, e) => sum + (e.energy || 5), 0);
      const totalStress = recentForState.reduce((sum, e) => sum + (e.stress || 5), 0);
      setAvgMood(Math.round(totalMood / recentForState.length));
      setAvgEnergy(Math.round(totalEnergy / recentForState.length));
      setAvgStress(Math.round(totalStress / recentForState.length));
    }
  }, []);

  const schemaJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "aruform",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description: "Existential journaling for tracking reflection over time.",
      url: "https://aruform.com/",
    }),
    []
  );

  async function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    track("Waitlist Signup", { source: "homepage" });

    setWaitlistStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("bad_response");
      setWaitlistStatus("success");
      setEmail("");
    } catch {
      setWaitlistStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">aruform</h1>
          <nav className="hidden sm:flex items-center gap-3 text-sm text-gray-300">
            <a href="#how" className="hover:text-white transition-colors">
              How it works
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#feedback" className="hover:text-white transition-colors">
              Feedback
            </a>
            <a href="#waitlist" className="hover:text-white transition-colors">
              Updates
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* HERO */}
          <section className="text-center py-10">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-4">
              Existential journaling
            </p>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-[1.05]">
              a place to meet yourself
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Reflect deeply, track emotional patterns, and understand who you&apos;re becoming.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href={isLoggedIn ? "/write" : "/signup"}
                onClick={() => track("CTA Click", { cta: "start_writing" })}
                className="px-8 py-3 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
              >
                {isLoggedIn ? "Start Writing" : "Create Account"}
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
                >
                  Log In
                </Link>
              )}
              <a
                href="#waitlist"
                onClick={() => track("CTA Click", { cta: "waitlist" })}
                className="px-8 py-3 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
              >
                Get updates
              </a>
              <Link
                href="/snapshot"
                onClick={() => track("CTA Click", { cta: "snapshot" })}
                className="px-8 py-3 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
              >
                Create Snapshot
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-400">
              <span className="font-mono">{entryCount}</span> total entries •{" "}
              <span className="font-mono">{recentEntries}</span> this week
            </div>
          </section>

          {/* BENEFITS */}
          <section className="mt-14">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/40">
                <h3 className="text-lg font-semibold mb-2">Clarity, not noise</h3>
                <p className="text-gray-300 text-sm">
                  A minimal space designed to keep you honest—no endless feeds, no
                  performance.
                </p>
              </div>
              <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/40">
                <h3 className="text-lg font-semibold mb-2">Track your patterns</h3>
                <p className="text-gray-300 text-sm">
                  Mood, energy, stress—simple signals that reveal what your words
                  can’t.
                </p>
              </div>
              <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/40">
                <h3 className="text-lg font-semibold mb-2">Time makes it real</h3>
                <p className="text-gray-300 text-sm">
                  Return months later. Compare versions of yourself. Watch beliefs
                  evolve.
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how" className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">How it works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/40">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Step 1
                </p>
                <h3 className="text-lg font-semibold mb-2">Write</h3>
                <p className="text-gray-300 text-sm">
                  Free-write what’s true today. Add a quick mood/energy/stress
                  snapshot.
                </p>
              </div>
              <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/40">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Step 2
                </p>
                <h3 className="text-lg font-semibold mb-2">Snapshot</h3>
                <p className="text-gray-300 text-sm">
                  Every month (or quarter) answer a small set of identity questions.
                </p>
              </div>
              <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/40">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Step 3
                </p>
                <h3 className="text-lg font-semibold mb-2">Return</h3>
                <p className="text-gray-300 text-sm">
                  Timeline + compare views let you see change without guessing.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <Link
                href="/entries"
                onClick={() => track("CTA Click", { cta: "entries" })}
                className="px-6 py-2 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all text-sm font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
              >
                View Entries
              </Link>
              <Link
                href="/timeline"
                onClick={() => track("CTA Click", { cta: "timeline" })}
                className="px-6 py-2 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all text-sm font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
              >
                View Timeline
              </Link>
              <Link
                href="/compare"
                onClick={() => track("CTA Click", { cta: "compare" })}
                className="px-6 py-2 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all text-sm font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
              >
                Compare
              </Link>
            </div>
          </section>

          {/* SOCIAL PROOF */}
          <section className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">What people say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "I didn’t realize how much my mood tracked with sleep until I saw it in a month of entries.",
                  name: "Early user",
                },
                {
                  quote:
                    "The snapshot questions are brutal in a good way. Like checking in with a future version of me.",
                  name: "Early user",
                },
                {
                  quote:
                    "Simple enough that I actually use it. Deep enough that it changes how I think.",
                  name: "Early user",
                },
              ].map((t, i) => (
                <figure
                  key={i}
                  className="p-6 border border-gray-800 rounded-lg bg-gray-900/40"
                >
                  <blockquote className="text-gray-200 text-sm italic leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-xs text-gray-400">
                    — {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              (Replace these placeholders with real testimonials when you have them.)
            </p>
          </section>

          {/* FAQ */}
          <section id="faq" className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>

            <div className="space-y-3">
              <details className="border border-gray-800 rounded-lg bg-gray-900/40 p-5">
                <summary className="cursor-pointer font-medium text-gray-100">
                  Is aruform private?
                </summary>
                <p className="mt-3 text-sm text-gray-300">
                  Your entries are stored locally in your browser right now. (If
                  you want accounts + sync, we can add that later.)
                </p>
              </details>

              <details className="border border-gray-800 rounded-lg bg-gray-900/40 p-5">
                <summary className="cursor-pointer font-medium text-gray-100">
                  Is this therapy?
                </summary>
                <p className="mt-3 text-sm text-gray-300">
                  No—more like structured self-reflection. If you need mental health
                  support, a professional is the right move.
                </p>
              </details>

              <details className="border border-gray-800 rounded-lg bg-gray-900/40 p-5">
                <summary className="cursor-pointer font-medium text-gray-100">
                  What’s the best cadence?
                </summary>
                <p className="mt-3 text-sm text-gray-300">
                  Daily quick entries + a monthly snapshot tends to work well. But
                  anything consistent beats perfection.
                </p>
              </details>

              <details className="border border-gray-800 rounded-lg bg-gray-900/40 p-5">
                <summary className="cursor-pointer font-medium text-gray-100">
                  Can I export my data?
                </summary>
                <p className="mt-3 text-sm text-gray-300">
                  Not yet. If you want, we can add JSON/CSV export next.
                </p>
              </details>
            </div>
          </section>

          {/* FEEDBACK */}
          <section id="feedback" className="mt-16 max-w-2xl mx-auto">
            <div className="border border-gray-800 rounded-lg p-7 bg-gray-900/50 text-center">
              <h2 className="text-2xl font-bold mb-2">We&apos;d love to hear feedback</h2>
              <p className="text-gray-300 text-sm max-w-xl mx-auto">
                Tell us what feels useful, confusing, or missing so we can keep improving aruform.
              </p>
              <a
                href="mailto:your-email@example.com?subject=Aruform%20Feedback"
                onClick={() => track("Feedback Click", { source: "homepage" })}
                className="inline-block mt-5 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 font-medium hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
              >
                Send feedback
              </a>
            </div>
          </section>

          {/* PRODUCT SECTIONS (existing) */}
          <section className="mt-16 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/40">
                <h2 className="text-xl font-bold mb-2 text-center">State Tracker</h2>
                <p className="text-gray-300 italic mb-6 text-center text-sm">
                  {entryCount > 0
                    ? "Your recent emotional patterns"
                    : "Track the rhythms beneath your thoughts"}
                </p>

                <div className="space-y-4">
                  {[
                    { label: "Mood", value: avgMood, left: "Low", right: "High", color: "bg-blue-500" },
                    { label: "Energy", value: avgEnergy, left: "Depleted", right: "Vibrant", color: "bg-green-500" },
                    { label: "Stress", value: avgStress, left: "Calm", right: "Overwhelmed", color: "bg-red-500" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-200 font-medium">{row.label}</span>
                        <span className="text-xs text-gray-400">
                          {row.value > 0 ? `${row.value}/10` : "No data yet"}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-500">{row.left}</span>
                        <div className="flex-1 h-2 bg-gray-800 rounded-full mx-3 relative overflow-hidden">
                          {row.value > 0 && (
                            <div
                              className={`absolute left-0 top-0 h-full ${row.color} transition-all duration-300`}
                              style={{ width: `${(row.value / 10) * 100}%` }}
                            />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{row.right}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/40">
                <h2 className="text-xl font-bold mb-2 text-center">Belief Stability Index</h2>
                <p className="text-gray-300 italic mb-6 text-center text-sm">
                  A mirror showing how your convictions are shifting
                </p>

                <div className="text-center py-2">
                  <div className="inline-block relative">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 - (282.7 * stabilityScore) / 100}
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-400">{stabilityScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total entries</span>
                    <span className="text-gray-400 font-mono">{entryCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Entries this week</span>
                    <span className="text-gray-400 font-mono">{recentEntries}</span>
                  </div>
                  <div className="border-t border-gray-800 pt-3 mt-3">
                    <p className="text-xs text-gray-400 italic text-center">
                      {entryCount > 0
                        ? "Your beliefs are evolving. Keep exploring."
                        : "Start journaling to track how your beliefs evolve."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA / WAITLIST */}
          <section id="waitlist" className="mt-16 max-w-2xl mx-auto">
            <div className="border border-gray-800 rounded-lg p-7 bg-gray-900/50">
              <h2 className="text-2xl font-bold mb-2 text-center">Get updates</h2>
              <p className="text-gray-300 mb-6 text-center text-sm">
                Occasional emails when we ship meaningful improvements. No spam.
              </p>

              <form onSubmit={joinWaitlist} className="flex flex-col sm:flex-row gap-3">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="flex-1 rounded-lg bg-black/40 border border-gray-700 px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === "loading"}
                  className="px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 font-medium hover:bg-cyan-300/20 hover:border-cyan-300/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
                >
                  {waitlistStatus === "loading" ? "Joining…" : "Join"}
                </button>
              </form>

              <div className="mt-3 text-center text-sm">
                {waitlistStatus === "success" && <p className="text-green-400">You’re on the list.</p>}
                {waitlistStatus === "error" && (
                  <p className="text-red-400">Something went wrong. Try again in a moment.</p>
                )}
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/write"
                  onClick={() => track("CTA Click", { cta: "start_writing_bottom" })}
                  className="inline-block px-8 py-3 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
                >
                  Start Writing
                </Link>
              </div>

              <p className="mt-4 text-xs text-gray-500 text-center">
                (Email provider hookup is next—right now signups are logged server-side.)
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 aruform. all rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
