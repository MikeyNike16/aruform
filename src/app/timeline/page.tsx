"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Snapshot {
  id: number;
  date: string;
  year: number;
  summary: string;
  snapshotData?: {
    selfDescription: string;
    coreValues: Array<{ value: string; explanation?: string }>;
    beliefs: {
      freeWill: string;
      meaning: string;
      morality: string;
      purpose: string;
    };
    becoming: {
      movingToward: string;
      movingAway: string;
    };
    fearsDoubts: string;
  };
  // Legacy format
  answers?: {
    identity: string;
    values: string;
    becoming: string;
    uncertain: string;
    fear: string;
  };
}

export default function TimelinePage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("entries") || "[]");
    // Filter for identity snapshots (entries with isSnapshot flag)
    const snapshotEntries = entries
      .filter((e: any) => e.isSnapshot)
      .map((e: any) => ({
        id: e.id,
        date: e.date,
        year: new Date(e.date).getFullYear(),
        summary: e.summary || "Identity snapshot",
        answers: e.snapshotAnswers || {},
      }))
      .sort((a: Snapshot, b: Snapshot) => b.year - a.year);
    
    setSnapshots(snapshotEntries);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            aruform
          </Link>
          <div className="flex gap-3">
            <Link
              href="/compare"
              className="px-4 py-2 bg-slate-50 text-slate-800 rounded-lg hover:bg-slate-100 transition-all font-medium shadow-sm hover:shadow-md"
            >
              Compare
            </Link>
            <Link
              href="/entries"
              className="px-4 py-2 bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100 transition-all font-medium shadow-sm hover:shadow-md border border-amber-100"
            >
              All Entries
            </Link>
            <Link
              href="/write"
              className="px-4 py-2 bg-stone-50 text-stone-800 rounded-lg hover:bg-stone-100 transition-all font-medium shadow-sm hover:shadow-md"
            >
              New Entry
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Identity Timeline</h1>
            <p className="text-gray-400 italic">
              Your life as chapters—each year a snapshot of who you were
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This is not daily-use. This is life-use.
            </p>
          </div>

          {snapshots.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-6">
                Your timeline is waiting to be written. Create your first identity snapshot.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-stone-50 text-stone-800 rounded-lg hover:bg-stone-100 transition-all font-medium shadow-md hover:shadow-lg"
              >
                Create First Snapshot
              </Link>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>

              <div className="space-y-16">
                {snapshots.map((snapshot, index) => (
                  <div key={snapshot.id} className="relative pl-24">
                    {/* Year node */}
                    <div className="absolute left-0 w-20 h-20 bg-gray-900 border-3 border-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <span className="text-lg font-bold text-blue-400">
                        {snapshot.year}
                      </span>
                    </div>

                    {/* Snapshot card */}
                    <div 
                      className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-50 hover:bg-opacity-70 transition-all cursor-pointer hover:border-blue-600"
                      onClick={() => setSelectedSnapshot(selectedSnapshot?.id === snapshot.id ? null : snapshot)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-semibold text-blue-300">
                          {snapshot.summary}
                        </h3>
                        <button className="text-xs text-gray-500 hover:text-gray-300">
                          {selectedSnapshot?.id === snapshot.id ? "Collapse ▲" : "Expand ▼"}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        {new Date(snapshot.date).toLocaleDateString("en-US", { 
                          month: "long", 
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>

                      {selectedSnapshot?.id === snapshot.id && (
                        <div className="mt-6 space-y-4 border-t border-gray-700 pt-4">
                          {snapshot.snapshotData ? (
                            <>
                              <div>
                                <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                  Self-Description
                                </h4>
                                <p className="text-gray-300 text-sm">
                                  {snapshot.snapshotData.selfDescription}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                  Core Values
                                </h4>
                                <div className="space-y-2">
                                  {snapshot.snapshotData.coreValues.map((v, i) => (
                                    <div key={i} className="pl-3 border-l-2 border-blue-600">
                                      <div className="font-medium text-gray-200 text-sm">{v.value}</div>
                                      {v.explanation ? (
                                        <div className="text-gray-400 text-xs">{v.explanation}</div>
                                      ) : null}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {(snapshot.snapshotData.beliefs.freeWill || snapshot.snapshotData.beliefs.meaning || snapshot.snapshotData.beliefs.morality || snapshot.snapshotData.beliefs.purpose) && (
                                <div>
                                  <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                    Beliefs
                                  </h4>
                                  <div className="grid grid-cols-2 gap-3 text-xs">
                                    {snapshot.snapshotData.beliefs.freeWill && (
                                      <div>
                                        <div className="font-medium text-gray-400">Free Will</div>
                                        <p className="text-gray-300">{snapshot.snapshotData.beliefs.freeWill}</p>
                                      </div>
                                    )}
                                    {snapshot.snapshotData.beliefs.meaning && (
                                      <div>
                                        <div className="font-medium text-gray-400">Meaning</div>
                                        <p className="text-gray-300">{snapshot.snapshotData.beliefs.meaning}</p>
                                      </div>
                                    )}
                                    {snapshot.snapshotData.beliefs.morality && (
                                      <div>
                                        <div className="font-medium text-gray-400">Morality</div>
                                        <p className="text-gray-300">{snapshot.snapshotData.beliefs.morality}</p>
                                      </div>
                                    )}
                                    {snapshot.snapshotData.beliefs.purpose && (
                                      <div>
                                        <div className="font-medium text-gray-400">Purpose</div>
                                        <p className="text-gray-300">{snapshot.snapshotData.beliefs.purpose}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-semibold text-blue-400 mb-2">Moving Toward</h4>
                                  <p className="text-gray-300 text-sm">{snapshot.snapshotData.becoming.movingToward}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-blue-400 mb-2">Moving Away From</h4>
                                  <p className="text-gray-300 text-sm">{snapshot.snapshotData.becoming.movingAway}</p>
                                </div>
                              </div>
                              {snapshot.snapshotData.fearsDoubts && (
                                <div>
                                  <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                    Fears &amp; Doubts
                                  </h4>
                                  <p className="text-gray-300 text-sm">{snapshot.snapshotData.fearsDoubts}</p>
                                </div>
                              )}
                            </>
                          ) : snapshot.answers?.identity ? (
                            // Legacy format
                            <>
                              <div>
                                <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                  Who you thought you were:
                                </h4>
                                <p className="text-gray-300 text-sm italic">
                                  {snapshot.answers.identity}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                  What you valued most:
                                </h4>
                                <p className="text-gray-300 text-sm italic">
                                  {snapshot.answers.values}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                  What you were trying to become:
                                </h4>
                                <p className="text-gray-300 text-sm italic">
                                  {snapshot.answers.becoming}
                                </p>
                              </div>
                              {snapshot.answers.uncertain && (
                                <div>
                                  <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                    What felt uncertain:
                                  </h4>
                                  <p className="text-gray-300 text-sm italic">
                                    {snapshot.answers.uncertain}
                                  </p>
                                </div>
                              )}
                              {snapshot.answers.fear && (
                                <div>
                                  <h4 className="text-sm font-semibold text-blue-400 mb-2">
                                    What you feared:
                                  </h4>
                                  <p className="text-gray-300 text-sm italic">
                                    {snapshot.answers.fear}
                                  </p>
                                </div>
                              )}
                            </>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
