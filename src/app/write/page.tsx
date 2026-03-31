"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);

  // Analyze content and auto-adjust mood/energy/stress
  useEffect(() => {
    if (content.length < 50) return; // Wait for some content

    const text = content.toLowerCase();
    
    // Mood keywords
    const positiveWords = ['happy', 'joy', 'excited', 'grateful', 'amazing', 'wonderful', 'love', 'great', 'good', 'better', 'beautiful', 'peaceful', 'content', 'hopeful', 'optimistic', 'proud', 'blessed'];
    const negativeWords = ['sad', 'depressed', 'anxious', 'worried', 'angry', 'frustrated', 'upset', 'terrible', 'awful', 'bad', 'worse', 'hate', 'lonely', 'empty', 'lost', 'hopeless', 'miserable'];
    
    // Energy keywords
    const highEnergyWords = ['energized', 'motivated', 'active', 'excited', 'productive', 'ambitious', 'driven', 'focused', 'ready', 'pumped'];
    const lowEnergyWords = ['tired', 'exhausted', 'drained', 'fatigued', 'sleepy', 'lethargic', 'unmotivated', 'lazy', 'burnt out', 'weary'];
    
    // Stress keywords
    const stressedWords = ['stressed', 'overwhelmed', 'anxious', 'pressure', 'worried', 'panic', 'tense', 'nervous', 'frantic', 'struggling', 'difficult', 'hard', 'challenging'];
    const calmWords = ['calm', 'relaxed', 'peaceful', 'tranquil', 'serene', 'easy', 'simple', 'manageable', 'comfortable', 'balanced'];
    
    // Count occurrences
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    const highEnergyCount = highEnergyWords.filter(word => text.includes(word)).length;
    const lowEnergyCount = lowEnergyWords.filter(word => text.includes(word)).length;
    const stressedCount = stressedWords.filter(word => text.includes(word)).length;
    const calmCount = calmWords.filter(word => text.includes(word)).length;
    
    // Calculate mood (1-10 scale)
    const moodDiff = positiveCount - negativeCount;
    const newMood = Math.max(1, Math.min(10, 5 + moodDiff));
    
    // Calculate energy (1-10 scale)
    const energyDiff = highEnergyCount - lowEnergyCount;
    const newEnergy = Math.max(1, Math.min(10, 5 + energyDiff));
    
    // Calculate stress (1-10 scale, higher is more stressed)
    const stressDiff = stressedCount - calmCount;
    const newStress = Math.max(1, Math.min(10, 5 + stressDiff));
    
    // Update values
    setMood(newMood);
    setEnergy(newEnergy);
    setStress(newStress);
  }, [content]);

  const handleSave = () => {
    if (!content.trim()) {
      alert("Please write something before saving!");
      return;
    }

    const entry = {
      id: Date.now(),
      title: title || "Untitled Entry",
      content,
      date: new Date().toISOString(),
      mood,
      energy,
      stress,
    };

    try {
      const entries = JSON.parse(localStorage.getItem("entries") || "[]");
      entries.unshift(entry);
      localStorage.setItem("entries", JSON.stringify(entries));
      
      // Redirect to entries page to confirm save
      router.push("/entries");
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            aruform
          </Link>
          <div className="flex gap-3">
            <Link
              href="/entries"
              className="px-4 py-2 bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100 transition-all font-medium shadow-sm hover:shadow-md border border-amber-100"
            >
              View Entries
            </Link>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-stone-50 text-stone-800 rounded-lg hover:bg-stone-100 transition-all font-medium shadow-sm hover:shadow-md"
            >
              Save Entry
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 p-4 border border-gray-700 bg-gray-900 bg-opacity-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 text-gray-200">How are you feeling?</h3>
            <p className="text-xs text-gray-400 mb-4 italic">Auto-adjusting based on what you write...</p>
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
              This isn&apos;t about proving you wrong—it&apos;s about keeping your mind open, exploring different 
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
