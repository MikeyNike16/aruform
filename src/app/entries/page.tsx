"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import KiviatChart from "@/components/KiviatChart";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, User } from "@/lib/auth";
import { getEntriesForUser, migrateAnonymousEntriesIfNeeded } from "@/lib/entries";

interface Entry {
  id: number;
  title: string;
  content: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  meaning?: number;
  existentialDread?: number;
  connection?: number;
  authenticity?: number;
  summary?: string;
  validatingArguments?: string[];
  counterArguments?: string[];
}

export default function EntriesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/signup");
      return;
    }

    migrateAnonymousEntriesIfNeeded(user);
    setCurrentUser(user);

    try {
      const parsed = getEntriesForUser(user);
      const sorted = parsed.sort(
        (a: Entry, b: Entry) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEntries(sorted);
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMoodColor = (value: number) => {
    if (value <= 3) return "from-red-500 to-orange-500";
    if (value <= 6) return "from-yellow-500 to-amber-500";
    return "from-emerald-500 to-cyan-400";
  };

  const getEnergyColor = (value: number) => {
    if (value <= 3) return "from-gray-500 to-gray-400";
    if (value <= 6) return "from-yellow-500 to-green-400";
    return "from-green-500 to-emerald-400";
  };

  const getStressColor = (value: number) => {
    if (value <= 3) return "from-blue-500 to-cyan-400";
    if (value <= 6) return "from-yellow-500 to-orange-400";
    return "from-orange-500 to-red-500";
  };

  const truncateContent = (content: string, length: number = 150) => {
    if (content.length <= length) return content;
    return content.substring(0, length) + "...";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            aruform
          </Link>
          <Link
            href="/write"
            className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
          >
            Write New Entry
          </Link>
          <div className="hidden sm:flex items-center gap-3">
            {currentUser && <span className="text-sm text-gray-400">{currentUser.name}</span>}
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="px-3 py-2 bg-white/5 border border-gray-500/30 text-gray-300 rounded-xl hover:bg-gray-300/10 transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Your Journal Entries</h1>

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No entries yet. Start writing to track your existential journey.
            </p>
            <Link
              href="/write"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all"
            >
              Write Your First Entry
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/entries/${entry.id}`}
                className="block p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-cyan-300/50 hover:bg-white/5 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: Entry info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{entry.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {formatDate(entry.date)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {truncateContent(entry.content)}
                    </p>

                    {/* Emotional state trackers (condensed) */}
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Mood:</span>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getMoodColor(entry.mood)}`}
                            style={{ width: `${(entry.mood / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-300 font-semibold">{entry.mood}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Energy:</span>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getEnergyColor(entry.energy)}`}
                            style={{ width: `${(entry.energy / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-300 font-semibold">{entry.energy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Stress:</span>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getStressColor(entry.stress)}`}
                            style={{ width: `${(entry.stress / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-300 font-semibold">{entry.stress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Kiviat chart */}
                  <div className="flex-shrink-0">
                    <KiviatChart
                      meaning={entry.meaning}
                      existentialDread={entry.existentialDread}
                      connection={entry.connection}
                      authenticity={entry.authenticity}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}