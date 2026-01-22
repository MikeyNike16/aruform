"use client";

import { useState } from "react";
import Link from "next/link";

export default function WritePage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);

  const handleSave = () => {
    // For now, just save to localStorage
    const entry = {
      id: Date.now(),
      title: title || "Untitled Entry",
      content,
      date: new Date().toISOString(),
      mood,
      energy,
      stress,
    };

    const entries = JSON.parse(localStorage.getItem("entries") || "[]");
    entries.unshift(entry);
    localStorage.setItem("entries", JSON.stringify(entries));

    alert("Entry saved!");
    setTitle("");
    setContent("");
    setMood(5);
    setEnergy(5);
    setStress(5);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            aruform
          </Link>
          <div className="flex gap-4">
            <Link
              href="/entries"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              View Entries
            </Link>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Entry
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 p-4 border border-gray-700 bg-gray-900 bg-opacity-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-4 text-gray-200">How are you feeling?</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Mood</label>
                  <span className="text-xs text-gray-400">{mood}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Energy</label>
                  <span className="text-xs text-gray-400">{energy}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Stress</label>
                  <span className="text-xs text-gray-400">{stress}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="mb-6 p-4 border border-blue-900 bg-blue-950 bg-opacity-30 rounded-lg">
            <p className="text-sm text-gray-300 italic leading-relaxed mb-3">
              <span className="font-semibold text-blue-400">Note:</span> AI will thoughtfully analyze 
              your journaling to offer both support for your beliefs and counterpoints to consider. 
              This isn't about proving you wrong—it's about keeping your mind open, exploring different 
              perspectives, and broadening your horizons as you become.
            </p>
            <p className="text-xs text-gray-400 italic leading-relaxed border-t border-gray-700 pt-3">
              <span className="font-semibold text-gray-300">Privacy:</span> Your entries remain completely 
              confidential to you. AI does not store your writing—this is purely about helping you navigate 
              your own mind with clarity and compassion.
            </p>
          </div>
          <input
            type="text"
            placeholder="Entry title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold mb-6 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:border-blue-600"
          />
          <textarea
            placeholder="What's on your mind? Explore questions about meaning, purpose, identity, freedom, responsibility, or any existential reflections..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[500px] px-4 py-3 text-lg bg-transparent focus:outline-none resize-none"
          />
        </div>
      </main>
    </div>
  );
}
