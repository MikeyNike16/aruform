"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Snapshot {
  id: number;
  date: string;
  isSnapshot: boolean;
  summary: string;
  snapshotData?: {
    selfDescription: string;
    coreValues: Array<{ value: string; explanation: string }>;
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
  snapshotAnswers?: {
    identity: string;
    values: string;
    becoming: string;
    uncertain: string;
    fear: string;
  };
}

export default function ComparePage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [leftYear, setLeftYear] = useState<string>("");
  const [rightYear, setRightYear] = useState<string>("");
  const [leftSnapshot, setLeftSnapshot] = useState<Snapshot | null>(null);
  const [rightSnapshot, setRightSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("entries") || "[]");
    const snapshotEntries = entries.filter((e: Snapshot) => e.isSnapshot);
    setSnapshots(snapshotEntries);

    if (snapshotEntries.length >= 2) {
      const years = snapshotEntries.map((s: Snapshot) => new Date(s.date).getFullYear());
      setLeftYear(Math.min(...years).toString());
      setRightYear(Math.max(...years).toString());
    }
  }, []);

  useEffect(() => {
    if (leftYear) {
      const snapshot = snapshots.find(
        (s) => new Date(s.date).getFullYear().toString() === leftYear
      );
      setLeftSnapshot(snapshot || null);
    }
  }, [leftYear, snapshots]);

  useEffect(() => {
    if (rightYear) {
      const snapshot = snapshots.find(
        (s) => new Date(s.date).getFullYear().toString() === rightYear
      );
      setRightSnapshot(snapshot || null);
    }
  }, [rightYear, snapshots]);

  const availableYears = Array.from(
    new Set(snapshots.map((s) => new Date(s.date).getFullYear().toString()))
  ).sort();

  const getComparisonStatus = (leftText: string, rightText: string): "stable" | "changed" | "reversed" => {
    if (!leftText || !rightText) return "changed";
    
    const leftLower = leftText.toLowerCase().trim();
    const rightLower = rightText.toLowerCase().trim();
    
    if (leftLower === rightLower) return "stable";
    
    const negationWords = ["not", "no longer", "don't", "doesn't", "won't", "isn't"];
    const hasNegation = negationWords.some(word => 
      rightLower.includes(word) || leftLower.includes(word)
    );
    
    const leftWords = new Set(leftLower.split(/\s+/));
    const rightWords = new Set(rightLower.split(/\s+/));
    const commonWords = [...leftWords].filter(w => rightWords.has(w)).length;
    const totalWords = leftWords.size + rightWords.size;
    const similarity = (2 * commonWords) / totalWords;
    
    if (hasNegation && similarity > 0.3) return "reversed";
    
    return "changed";
  };

  if (snapshots.length < 2) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-gray-700">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              aruform
            </Link>
            <Link
              href="/timeline"
              className="px-4 py-2 bg-slate-50 text-slate-800 rounded-lg hover:bg-slate-100 transition-all font-medium shadow-sm hover:shadow-md"
            >
              Back to Timeline
            </Link>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Not Enough Data</h2>
            <p className="text-gray-400 mb-6">
              You need at least 2 identity snapshots to compare. Create more snapshots to track
              your evolution over time.
            </p>
            <Link
              href="/snapshot"
              className="inline-block px-6 py-3 bg-stone-50 text-stone-800 rounded-lg hover:bg-stone-100 transition-all font-medium shadow-sm hover:shadow-md"
            >
              Create Snapshot
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            aruform
          </Link>
          <Link
            href="/timeline"
            className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Back to Timeline
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Identity Comparison</h1>
            <p className="text-gray-400 italic">
              Analyze how you&apos;ve evolved—what changed, what stayed stable, what reversed
            </p>
          </div>

          {/* Year Selection */}
          <div className="flex justify-center gap-8 mb-12">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Past Self</label>
              <select
                value={leftYear}
                onChange={(e) => setLeftYear(e.target.value)}
                className="px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    Me at {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end pb-3 text-2xl text-gray-600">→</div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Current Self</label>
              <select
                value={rightYear}
                onChange={(e) => setRightYear(e.target.value)}
                className="px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    Me at {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 bg-opacity-20 border border-green-600 rounded"></div>
              <span className="text-gray-400">Stable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded"></div>
              <span className="text-gray-400">Changed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 bg-opacity-20 border border-red-600 rounded"></div>
              <span className="text-gray-400">Reversed</span>
            </div>
          </div>

          {/* Comparison Grid */}
          {leftSnapshot && rightSnapshot ? (
            <div className="space-y-8">
              {/* Self-Description */}
              <ComparisonCard
                title="Self-Description"
                leftLabel={`Me at ${leftYear}`}
                rightLabel={`Me at ${rightYear}`}
                leftText={leftSnapshot.snapshotData?.selfDescription || leftSnapshot.snapshotAnswers?.identity || ""}
                rightText={rightSnapshot.snapshotData?.selfDescription || rightSnapshot.snapshotAnswers?.identity || ""}
                status={getComparisonStatus(
                  leftSnapshot.snapshotData?.selfDescription || leftSnapshot.snapshotAnswers?.identity || "",
                  rightSnapshot.snapshotData?.selfDescription || rightSnapshot.snapshotAnswers?.identity || ""
                )}
              />

              {/* Core Values */}
              <ComparisonCard
                title="Core Values"
                leftLabel={`Me at ${leftYear}`}
                rightLabel={`Me at ${rightYear}`}
                leftText={
                  leftSnapshot.snapshotData?.coreValues 
                    ? leftSnapshot.snapshotData.coreValues.map(v => `${v.value}: ${v.explanation}`).join("\n\n")
                    : leftSnapshot.snapshotAnswers?.values || ""
                }
                rightText={
                  rightSnapshot.snapshotData?.coreValues
                    ? rightSnapshot.snapshotData.coreValues.map(v => `${v.value}: ${v.explanation}`).join("\n\n")
                    : rightSnapshot.snapshotAnswers?.values || ""
                }
                status={getComparisonStatus(
                  leftSnapshot.snapshotData?.coreValues?.map(v => v.value).join(", ") || leftSnapshot.snapshotAnswers?.values || "",
                  rightSnapshot.snapshotData?.coreValues?.map(v => v.value).join(", ") || rightSnapshot.snapshotAnswers?.values || ""
                )}
              />

              {/* Beliefs - Free Will */}
              {(leftSnapshot.snapshotData?.beliefs.freeWill || rightSnapshot.snapshotData?.beliefs.freeWill) && (
                <ComparisonCard
                  title="Beliefs: Free Will"
                  leftLabel={`Me at ${leftYear}`}
                  rightLabel={`Me at ${rightYear}`}
                  leftText={leftSnapshot.snapshotData?.beliefs.freeWill || "—"}
                  rightText={rightSnapshot.snapshotData?.beliefs.freeWill || "—"}
                  status={getComparisonStatus(
                    leftSnapshot.snapshotData?.beliefs.freeWill || "",
                    rightSnapshot.snapshotData?.beliefs.freeWill || ""
                  )}
                />
              )}

              {/* Beliefs - Meaning */}
              {(leftSnapshot.snapshotData?.beliefs.meaning || rightSnapshot.snapshotData?.beliefs.meaning) && (
                <ComparisonCard
                  title="Beliefs: Meaning"
                  leftLabel={`Me at ${leftYear}`}
                  rightLabel={`Me at ${rightYear}`}
                  leftText={leftSnapshot.snapshotData?.beliefs.meaning || "—"}
                  rightText={rightSnapshot.snapshotData?.beliefs.meaning || "—"}
                  status={getComparisonStatus(
                    leftSnapshot.snapshotData?.beliefs.meaning || "",
                    rightSnapshot.snapshotData?.beliefs.meaning || ""
                  )}
                />
              )}

              {/* Beliefs - Morality */}
              {(leftSnapshot.snapshotData?.beliefs.morality || rightSnapshot.snapshotData?.beliefs.morality) && (
                <ComparisonCard
                  title="Beliefs: Morality"
                  leftLabel={`Me at ${leftYear}`}
                  rightLabel={`Me at ${rightYear}`}
                  leftText={leftSnapshot.snapshotData?.beliefs.morality || "—"}
                  rightText={rightSnapshot.snapshotData?.beliefs.morality || "—"}
                  status={getComparisonStatus(
                    leftSnapshot.snapshotData?.beliefs.morality || "",
                    rightSnapshot.snapshotData?.beliefs.morality || ""
                  )}
                />
              )}

              {/* Beliefs - Purpose */}
              {(leftSnapshot.snapshotData?.beliefs.purpose || rightSnapshot.snapshotData?.beliefs.purpose) && (
                <ComparisonCard
                  title="Beliefs: Purpose"
                  leftLabel={`Me at ${leftYear}`}
                  rightLabel={`Me at ${rightYear}`}
                  leftText={leftSnapshot.snapshotData?.beliefs.purpose || "—"}
                  rightText={rightSnapshot.snapshotData?.beliefs.purpose || "—"}
                  status={getComparisonStatus(
                    leftSnapshot.snapshotData?.beliefs.purpose || "",
                    rightSnapshot.snapshotData?.beliefs.purpose || ""
                  )}
                />
              )}

              {/* Becoming - Moving Toward */}
              <ComparisonCard
                title="Moving Toward"
                leftLabel={`Me at ${leftYear}`}
                rightLabel={`Me at ${rightYear}`}
                leftText={leftSnapshot.snapshotData?.becoming.movingToward || leftSnapshot.snapshotAnswers?.becoming || ""}
                rightText={rightSnapshot.snapshotData?.becoming.movingToward || rightSnapshot.snapshotAnswers?.becoming || ""}
                status={getComparisonStatus(
                  leftSnapshot.snapshotData?.becoming.movingToward || leftSnapshot.snapshotAnswers?.becoming || "",
                  rightSnapshot.snapshotData?.becoming.movingToward || rightSnapshot.snapshotAnswers?.becoming || ""
                )}
              />

              {/* Becoming - Moving Away */}
              {(leftSnapshot.snapshotData?.becoming.movingAway || rightSnapshot.snapshotData?.becoming.movingAway) && (
                <ComparisonCard
                  title="Moving Away From"
                  leftLabel={`Me at ${leftYear}`}
                  rightLabel={`Me at ${rightYear}`}
                  leftText={leftSnapshot.snapshotData?.becoming.movingAway || "—"}
                  rightText={rightSnapshot.snapshotData?.becoming.movingAway || "—"}
                  status={getComparisonStatus(
                    leftSnapshot.snapshotData?.becoming.movingAway || "",
                    rightSnapshot.snapshotData?.becoming.movingAway || ""
                  )}
                />
              )}

              {/* Fears & Doubts */}
              <ComparisonCard
                title="Fears &amp; Doubts"
                leftLabel={`Me at ${leftYear}`}
                rightLabel={`Me at ${rightYear}`}
                leftText={leftSnapshot.snapshotData?.fearsDoubts || leftSnapshot.snapshotAnswers?.fear || leftSnapshot.snapshotAnswers?.uncertain || ""}
                rightText={rightSnapshot.snapshotData?.fearsDoubts || rightSnapshot.snapshotAnswers?.fear || rightSnapshot.snapshotAnswers?.uncertain || ""}
                status={getComparisonStatus(
                  leftSnapshot.snapshotData?.fearsDoubts || leftSnapshot.snapshotAnswers?.fear || "",
                  rightSnapshot.snapshotData?.fearsDoubts || rightSnapshot.snapshotAnswers?.fear || ""
                )}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              Select two years to compare
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface ComparisonCardProps {
  title: string;
  leftLabel: string;
  rightLabel: string;
  leftText: string;
  rightText: string;
  status: "stable" | "changed" | "reversed";
}

function ComparisonCard({
  title,
  leftLabel,
  rightLabel,
  leftText,
  rightText,
  status,
}: ComparisonCardProps) {
  const statusStyles = {
    stable: "bg-green-600 bg-opacity-10 border-green-600",
    changed: "bg-yellow-600 bg-opacity-10 border-yellow-600",
    reversed: "bg-red-600 bg-opacity-10 border-red-600",
  };

  const statusLabels = {
    stable: "Stable",
    changed: "Changed",
    reversed: "Reversed",
  };

  return (
    <div className={`border rounded-lg p-6 ${statusStyles[status]}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className="text-sm px-3 py-1 rounded-full bg-gray-900 bg-opacity-50">
          {statusLabels[status]}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">{leftLabel}</div>
          <p className="text-gray-300 whitespace-pre-wrap">{leftText || "—"}</p>
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">{rightLabel}</div>
          <p className="text-gray-100 whitespace-pre-wrap font-medium">{rightText || "—"}</p>
        </div>
      </div>
    </div>
  );
}
