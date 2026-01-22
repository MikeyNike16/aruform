"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [entryCount, setEntryCount] = useState(0);
  const [recentEntries, setRecentEntries] = useState(0);
  const [stabilityScore, setStabilityScore] = useState(0);
  const [avgMood, setAvgMood] = useState(0);
  const [avgEnergy, setAvgEnergy] = useState(0);
  const [avgStress, setAvgStress] = useState(0);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("entries") || "[]");
    const count = entries.length;
    setEntryCount(count);
    
    // Count entries from the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = entries.filter((e: any) => new Date(e.date) > weekAgo).length;
    setRecentEntries(recent);
    
    // Calculate stability score (higher with more entries and consistency)
    const score = count > 0 ? Math.min(100, Math.round((count * 8) + (recent * 5))) : 0;
    setStabilityScore(score);
    
    // Calculate average mood, energy, stress from last 7 entries
    const recentForState = entries.slice(0, 7).filter((e: any) => e.mood !== undefined);
    if (recentForState.length > 0) {
      const totalMood = recentForState.reduce((sum: number, e: any) => sum + (e.mood || 5), 0);
      const totalEnergy = recentForState.reduce((sum: number, e: any) => sum + (e.energy || 5), 0);
      const totalStress = recentForState.reduce((sum: number, e: any) => sum + (e.stress || 5), 0);
      setAvgMood(Math.round(totalMood / recentForState.length));
      setAvgEnergy(Math.round(totalEnergy / recentForState.length));
      setAvgStress(Math.round(totalStress / recentForState.length));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12 text-center">
            <h1 className="text-6xl font-bold mb-4">
              aruform
            </h1>
            <p className="text-xl text-gray-400 mb-8 italic">
              a place to meet yourself
            </p>
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-lg text-gray-300 leading-relaxed italic font-bold">
                We spend our lives becoming. Each moment, each choice, each quiet conviction shapes 
                the contours of who we are. Yet how often do we pause to witness this unfolding? 
                aruform is not just a journaling app—it's an invitation to sit with yourself. Not 
                merely to record what you did, but to trace the beliefs that move beneath the surface. 
                To ask what you hold as true, and to watch, with gentle curiosity, how these truths 
                are sculpting the person you are learning to be.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                href="/write"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Start Writing
              </Link>
              <Link
                href="/entries"
                className="px-8 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-semibold"
              >
                View Entries
              </Link>
            </div>
          </section>

          <section className="my-16 max-w-2xl mx-auto">
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-50">
              <h2 className="text-2xl font-bold mb-3 text-center">State Tracker</h2>
              <p className="text-gray-300 italic mb-6 text-center text-sm">
                {entryCount > 0 ? "Your recent emotional patterns" : "Track the rhythms beneath your thoughts"}
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-200 font-medium">Mood</span>
                    <span className="text-xs text-gray-400">{avgMood > 0 ? `${avgMood}/10` : "No data yet"}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500">Low</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full mx-3 relative overflow-hidden">
                      {avgMood > 0 && (
                        <div 
                          className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${(avgMood / 10) * 100}%` }}
                        />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">High</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-200 font-medium">Energy</span>
                    <span className="text-xs text-gray-400">{avgEnergy > 0 ? `${avgEnergy}/10` : "No data yet"}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500">Depleted</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full mx-3 relative overflow-hidden">
                      {avgEnergy > 0 && (
                        <div 
                          className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${(avgEnergy / 10) * 100}%` }}
                        />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">Vibrant</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-200 font-medium">Stress</span>
                    <span className="text-xs text-gray-400">{avgStress > 0 ? `${avgStress}/10` : "No data yet"}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500">Calm</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full mx-3 relative overflow-hidden">
                      {avgStress > 0 && (
                        <div 
                          className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-300"
                          style={{ width: `${(avgStress / 10) * 100}%` }}
                        />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">Overwhelmed</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="my-16 max-w-2xl mx-auto">
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-50">
              <h2 className="text-2xl font-bold mb-3 text-center">Belief Stability Index</h2>
              <p className="text-gray-300 italic mb-6 text-center text-sm">
                A mirror showing how your convictions are shifting
              </p>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="inline-block relative">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 - (282.7 * stabilityScore / 100)}
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-400">{stabilityScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total entries</span>
                    <span className="text-gray-400 font-mono">{entryCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Entries this week</span>
                    <span className="text-gray-400 font-mono">{recentEntries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Reflection consistency</span>
                    <span className="text-gray-400 font-mono">{entryCount > 0 ? "Active" : "Start writing"}</span>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <p className="text-xs text-gray-400 italic text-center">
                    {entryCount > 0 
                      ? "Your beliefs are evolving. This index reflects your engagement with self-reflection—keep exploring." 
                      : "Start journaling to track how your beliefs and perspectives evolve over time."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="my-16 max-w-2xl mx-auto">
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-50">
              <h2 className="text-2xl font-bold mb-3 text-center">Identity Snapshots</h2>
              <p className="text-gray-300 italic mb-6 text-center text-sm">
                Once a month or quarter, reflect on these five questions
              </p>
              <div className="space-y-4">
                <div className="border-l-2 border-gray-600 pl-3">
                  <h3 className="text-base font-semibold mb-1 text-gray-200">
                    1. Who do you think you are right now?
                  </h3>
                  <p className="text-xs text-gray-400 italic">
                    Describe yourself as you see yourself in this moment.
                  </p>
                </div>
                <div className="border-l-2 border-gray-600 pl-3">
                  <h3 className="text-base font-semibold mb-1 text-gray-200">
                    2. What do you value most?
                  </h3>
                  <p className="text-xs text-gray-400 italic">
                    Name what matters to you above all else right now.
                  </p>
                </div>
                <div className="border-l-2 border-gray-600 pl-3">
                  <h3 className="text-base font-semibold mb-1 text-gray-200">
                    3. What are you trying to become?
                  </h3>
                  <p className="text-xs text-gray-400 italic">
                    What version of yourself are you moving toward?
                  </p>
                </div>
                <div className="border-l-2 border-gray-600 pl-3">
                  <h3 className="text-base font-semibold mb-1 text-gray-200">
                    4. What feels uncertain in your life?
                  </h3>
                  <p className="text-xs text-gray-400 italic">
                    Where does ambiguity or unknowing live right now?
                  </p>
                </div>
                <div className="border-l-2 border-gray-600 pl-3">
                  <h3 className="text-base font-semibold mb-1 text-gray-200">
                    5. What do you fear losing or failing to become?
                  </h3>
                  <p className="text-xs text-gray-400 italic">
                    What possibility or part of yourself concerns you most?
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/write"
                  className="inline-block px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Update Your Snapshot
                </Link>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Reflect Deeply</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Engage with fundamental questions about meaning, purpose, and existence.
              </p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Track Growth</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Observe how your thoughts and perspectives evolve over time.
              </p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Find Clarity</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover insights about yourself and your relationship with the world.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 aruform. all rights reserved. a space for existential reflection.</p>
        </div>
      </footer>
    </div>
  );
}
