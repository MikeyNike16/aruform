"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Entry {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("entries");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const deleteEntry = (id: number) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const updated = entries.filter((e) => e.id !== id);
      setEntries(updated);
      localStorage.setItem("entries", JSON.stringify(updated));
    }
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Entry
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Your Journal Entries</h1>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No entries yet. Start your existential journey today.
              </p>
              <Link
                href="/write"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Write Your First Entry
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <article
                  key={entry.id}
                  className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-semibold">{entry.title}</h2>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap line-clamp-3">
                    {entry.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
