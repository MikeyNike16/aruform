"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KiviatChart from "@/components/KiviatChart";
import { useParams, useRouter } from "next/navigation";
import { getCurrentUser, logout, User } from "@/lib/auth";
import {
  getEntriesForUser,
  migrateAnonymousEntriesIfNeeded,
  saveEntriesForUser,
} from "@/lib/entries";

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

export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);

  const generateLocalReflection = (text: string) => {
    const cleaned = text.trim().replace(/\s+/g, " ");
    const snippet = cleaned.length > 180 ? `${cleaned.slice(0, 180)}...` : cleaned;

    return {
      summary: `You wrote about: "${snippet}". Your entry reflects what is emotionally present for you right now.`,
      validatingArguments: [
        "Your feelings are valid because they come from your direct lived experience.",
        "Writing this down shows honest self-awareness, which supports your perspective.",
      ],
      counterArguments: [
        "The intensity of this moment may not define the whole picture over time.",
        "There may be alternative interpretations that could reduce pressure or self-judgment.",
      ],
    };
  };

  const generateAndPersistReflection = async (targetEntry: Entry, user: User) => {
    if (targetEntry.summary || isGeneratingReflection) return;

    setIsGeneratingReflection(true);
    try {
      let reflection: {
        summary: string;
        validatingArguments: string[];
        counterArguments: string[];
      };

      try {
        const response = await fetch("/api/analyze-sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: targetEntry.content }),
        });

        const data = await response.json();
        if (data.summary) {
          reflection = {
            summary: data.summary,
            validatingArguments: Array.isArray(data.validatingArguments)
              ? data.validatingArguments
              : [],
            counterArguments: Array.isArray(data.counterArguments)
              ? data.counterArguments
              : [],
          };
        } else {
          reflection = generateLocalReflection(targetEntry.content);
        }
      } catch {
        reflection = generateLocalReflection(targetEntry.content);
      }

      const updatedEntry: Entry = {
        ...targetEntry,
        summary: reflection.summary,
        validatingArguments: reflection.validatingArguments,
        counterArguments: reflection.counterArguments,
      };

      const allEntries = getEntriesForUser(user);
      const updatedEntries = allEntries.map((item: Entry) =>
        item.id === targetEntry.id ? updatedEntry : item
      );
      saveEntriesForUser(user, updatedEntries);
      setEntry(updatedEntry);
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/signup");
      return;
    }

    migrateAnonymousEntriesIfNeeded(user);
    setCurrentUser(user);

    try {
      const entries = getEntriesForUser(user);
      const entryId = Number(params?.id);
      const foundEntry = entries.find((item: Entry) => item.id === entryId) || null;
      setEntry(foundEntry);
      if (foundEntry && !foundEntry.summary) {
        generateAndPersistReflection(foundEntry, user);
      }
    } catch (error) {
      console.error("Error loading entry:", error);
      setEntry(null);
    } finally {
      setIsLoading(false);
    }
  }, [params?.id, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            aruform
          </Link>
          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="hidden sm:inline text-sm text-gray-400">{currentUser.name}</span>
            )}
            <Link
              href="/entries"
              className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium"
            >
              Back to Entries
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="px-4 py-2 bg-white/5 border border-gray-500/30 text-gray-300 rounded-2xl hover:bg-gray-300/10 transition-all font-medium"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading entry...</div>
          ) : !entry ? (
            <div className="p-8 border border-gray-700 rounded-2xl bg-gray-900/40 text-center">
              <p className="text-gray-300 mb-4">Entry not found.</p>
              <Link
                href="/entries"
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-xl hover:bg-cyan-500/30 transition-all"
              >
                Return to Entries
              </Link>
            </div>
          ) : (
            <article className="p-6 border border-gray-700 rounded-2xl bg-gray-900/40 space-y-6">
              <header>
                <h1 className="text-3xl font-bold mb-2">{entry.title}</h1>
                <p className="text-sm text-gray-400">{formatDate(entry.date)}</p>
              </header>

              <section>
                <h2 className="text-sm font-semibold text-gray-300 mb-3">Entry</h2>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-purple-300 mb-4">Existential State</h2>
                <div className="flex justify-center">
                  <KiviatChart
                    meaning={entry.meaning}
                    existentialDread={entry.existentialDread}
                    connection={entry.connection}
                    authenticity={entry.authenticity}
                    size={260}
                    showLabels={true}
                  />
                </div>
              </section>

              <section className="p-4 border border-cyan-500/30 bg-cyan-950/20 rounded-lg">
                <h2 className="text-sm font-semibold text-cyan-300 mb-3">AI Reflection</h2>

                {entry.summary ? (
                  <>
                    <p className="text-sm text-gray-200 leading-relaxed mb-4">{entry.summary}</p>

                    {entry.validatingArguments && entry.validatingArguments.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs font-semibold text-emerald-400 mb-2">
                          Why You&apos;re Right to Feel This Way
                        </h3>
                        <ul className="space-y-2">
                          {entry.validatingArguments.map((arg, i) => (
                            <li key={i} className="flex gap-2 text-xs">
                              <span className="text-emerald-400 flex-shrink-0">✓</span>
                              <span className="text-gray-300">{arg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {entry.counterArguments && entry.counterArguments.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-amber-400 mb-2">
                          Things to Consider
                        </h3>
                        <ul className="space-y-2">
                          {entry.counterArguments.map((arg, i) => (
                            <li key={i} className="flex gap-2 text-xs">
                              <span className="text-amber-400 flex-shrink-0">→</span>
                              <span className="text-gray-300">{arg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {isGeneratingReflection
                      ? "Generating reflection for this entry now..."
                      : "No AI reflection is available yet. Please refresh in a moment."}
                  </p>
                )}
              </section>

              <section className="border-t border-gray-700 pt-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Mood</p>
                    <p className="text-lg font-bold text-cyan-400">{entry.mood}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Energy</p>
                    <p className="text-lg font-bold text-green-400">{entry.energy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Stress</p>
                    <p className="text-lg font-bold text-orange-400">{entry.stress}</p>
                  </div>
                </div>
              </section>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
