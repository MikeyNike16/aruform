"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function WritePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  
  // Basic emotional state
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [stress, setStress] = useState(0);
  
  // Existential metrics
  const [meaning, setMeaning] = useState(0);
  const [existentialDread, setExistentialDread] = useState(0);
  const [connection, setConnection] = useState(0);
  const [authenticity, setAuthenticity] = useState(0);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<"idle" | "typing" | "analyzing" | "complete" | "fallback">("idle");
  const [analysisResult, setAnalysisResult] = useState<{
    summary?: string;
    validatingArguments?: string[];
    counterArguments?: string[];
  } | null>(null);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/signup");
      return;
    }

    migrateAnonymousEntriesIfNeeded(user);
    setCurrentUser(user);
  }, [router]);

  // Comprehensive sentiment analysis for mood/energy/stress
  useEffect(() => {
    if (content.length < 50) {
      setAnalysisStatus(content.length > 0 ? "typing" : "idle");
      return;
    }

    const text = content.toLowerCase();
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);

    // Expanded mood keywords with intensity weights
    const moodKeywords = {
      veryPositive: { words: ['ecstatic', 'thrilled', 'overjoyed', 'elated', 'euphoric', 'blissful', 'delighted', 'jubilant', 'radiant'], weight: 3 },
      positive: { words: ['happy', 'joy', 'joyful', 'excited', 'grateful', 'thankful', 'amazing', 'wonderful', 'fantastic', 'excellent', 'love', 'loving', 'great', 'good', 'better', 'best', 'beautiful', 'peaceful', 'content', 'satisfied', 'hopeful', 'optimistic', 'positive', 'proud', 'blessed', 'cheerful', 'pleased', 'glad', 'inspired', 'uplifted', 'encouraged', 'smiling', 'laughing', 'fulfilled', 'accomplished', 'successful', 'winning', 'bright', 'sunny', 'warm'], weight: 2 },
      slightlyPositive: { words: ['fine', 'okay', 'alright', 'decent', 'fair', 'acceptable', 'pleasant', 'nice', 'agreeable'], weight: 1 },
      slightlyNegative: { words: ['annoyed', 'bothered', 'concerned', 'uneasy', 'uncomfortable', 'disappointed', 'dissatisfied', 'down', 'blue', 'gloomy', 'dull', 'bland'], weight: -1 },
      negative: { words: ['sad', 'unhappy', 'depressed', 'anxious', 'worried', 'angry', 'mad', 'frustrated', 'upset', 'hurt', 'pain', 'painful', 'terrible', 'awful', 'horrible', 'bad', 'worse', 'worst', 'hate', 'hatred', 'hating', 'lonely', 'alone', 'isolated', 'empty', 'hollow', 'lost', 'confused', 'hopeless', 'pessimistic', 'negative', 'miserable', 'suffering', 'anguish', 'grief', 'sorrowful', 'heartbroken', 'devastated', 'rejected', 'abandoned', 'worthless', 'useless', 'failure', 'failing', 'defeated'], weight: -2 },
      veryNegative: { words: ['suicidal', 'despair', 'despairing', 'agonizing', 'tortured', 'tormented', 'unbearable', 'excruciating', 'destroyed', 'shattered', 'broken'], weight: -3 }
    };

    const energyKeywords = {
      veryHigh: { words: ['energized', 'invigorated', 'charged', 'pumped', 'fired up', 'electrified', 'unstoppable', 'powerful', 'vigorous', 'dynamic'], weight: 3 },
      high: { words: ['motivated', 'active', 'excited', 'productive', 'ambitious', 'driven', 'focused', 'ready', 'alert', 'awake', 'engaged', 'enthusiastic', 'lively', 'animated', 'spirited', 'vibrant', 'energetic', 'inspired', 'determined', 'strong', 'capable', 'alive'], weight: 2 },
      moderate: { words: ['steady', 'stable', 'balanced', 'normal', 'average', 'regular', 'routine'], weight: 1 },
      low: { words: ['tired', 'exhausted', 'drained', 'fatigued', 'sleepy', 'drowsy', 'lethargic', 'unmotivated', 'lazy', 'sluggish', 'weary', 'worn', 'spent', 'depleted', 'weak', 'feeble', 'listless', 'apathetic', 'indifferent', 'bored', 'uninterested', 'passive', 'slow'], weight: -2 },
      veryLow: { words: ['burnt out', 'burnout', 'collapsed', 'destroyed', 'completely drained', 'utterly exhausted', 'can\'t move', 'paralyzed', 'lifeless', 'dead inside'], weight: -3 }
    };

    const stressKeywords = {
      veryHigh: { words: ['overwhelmed', 'crushing', 'unbearable', 'breaking down', 'can\'t cope', 'falling apart', 'breaking point', 'too much', 'drowning', 'suffocating', 'panic', 'panicking', 'panicked', 'crisis', 'emergency'], weight: 3 },
      high: { words: ['stressed', 'stress', 'stressful', 'anxious', 'anxiety', 'pressure', 'pressured', 'worried', 'worrying', 'tense', 'tension', 'nervous', 'frantic', 'hectic', 'chaotic', 'struggling', 'struggle', 'difficult', 'hard', 'challenging', 'demanding', 'intense', 'urgent', 'rushed', 'deadline', 'overwhelm'], weight: 2 },
      moderate: { words: ['busy', 'occupied', 'working', 'task', 'responsibility', 'managing', 'handling', 'dealing'], weight: 1 },
      low: { words: ['calm', 'calming', 'relaxed', 'relaxing', 'peaceful', 'peace', 'tranquil', 'serene', 'quiet', 'still', 'restful', 'easy', 'simple', 'manageable', 'comfortable', 'balanced', 'centered', 'grounded', 'stable', 'secure', 'safe', 'protected'], weight: -2 },
      veryLow: { words: ['bliss', 'blissful', 'zen', 'meditative', 'enlightened', 'transcendent', 'completely at peace', 'perfectly calm', 'utterly relaxed'], weight: -3 }
    };

    // Negation words that flip sentiment
    const negations = ['not', 'no', 'never', 'neither', 'nobody', 'nothing', 'nowhere', 'don\'t', 'doesn\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 'shouldn\'t', 'couldn\'t', 'can\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'haven\'t', 'hasn\'t', 'hadn\'t'];

    // Intensifiers that amplify sentiment
    const intensifiers = ['very', 'extremely', 'incredibly', 'really', 'so', 'absolutely', 'completely', 'totally', 'utterly', 'quite', 'deeply', 'profoundly', 'highly'];

    // Function to analyze sentiment with context
    function analyzeSentiment(keywords: any) {
      let totalScore = 0;
      let matchCount = 0;

      sentences.forEach(sentence => {
        const sentenceWords = sentence.trim().split(/\s+/);
        
        sentenceWords.forEach((word, index) => {
          const cleanWord = word.replace(/[^a-z']/g, '');
          
          // Check each keyword category
          Object.values(keywords).forEach((category: any) => {
            category.words.forEach((keyword: string) => {
              if (keyword.includes(' ')) {
                // Multi-word phrase
                if (sentence.includes(keyword)) {
                  let score = category.weight;
                  
                  // Check for negation before the phrase
                  const phraseIndex = sentence.indexOf(keyword);
                  const beforePhrase = sentence.substring(Math.max(0, phraseIndex - 20), phraseIndex);
                  const hasNegation = negations.some(neg => beforePhrase.includes(neg));
                  
                  if (hasNegation) score *= -0.8; // Flip and slightly reduce
                  
                  totalScore += score;
                  matchCount++;
                }
              } else {
                // Single word
                if (cleanWord === keyword) {
                  let score = category.weight;
                  
                  // Check for negation (within 3 words before)
                  const prevWords = sentenceWords.slice(Math.max(0, index - 3), index);
                  const hasNegation = prevWords.some(w => negations.includes(w.replace(/[^a-z']/g, '')));
                  
                  if (hasNegation) score *= -0.8; // Flip and slightly reduce
                  
                  // Check for intensifier (within 2 words before)
                  const nearWords = sentenceWords.slice(Math.max(0, index - 2), index);
                  const hasIntensifier = nearWords.some(w => intensifiers.includes(w.replace(/[^a-z']/g, '')));
                  
                  if (hasIntensifier) score *= 1.3; // Amplify
                  
                  totalScore += score;
                  matchCount++;
                }
              }
            });
          });
        });
      });

      return { totalScore, matchCount };
    }

    // Analyze all three metrics
    const moodAnalysis = analyzeSentiment(moodKeywords);
    const energyAnalysis = analyzeSentiment(energyKeywords);
    const stressAnalysis = analyzeSentiment(stressKeywords);

    // Calculate normalized scores (1-10 scale)
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    
    // Mood: base at 5, adjust based on score density
    let moodScore = 0;
    if (moodAnalysis.matchCount > 0) {
      const density = moodAnalysis.totalScore / Math.max(sentenceCount, 1);
      moodScore = 5 + (density * 1.5);
      moodScore = Math.max(1, Math.min(10, Math.round(moodScore)));
    }

    // Energy: base at 0, adjust based on score density
    let energyScore = 0;
    if (energyAnalysis.matchCount > 0) {
      const density = energyAnalysis.totalScore / Math.max(sentenceCount, 1);
      energyScore = 5 + (density * 1.5);
      energyScore = Math.max(1, Math.min(10, Math.round(energyScore)));
    }

    // Stress: base at 0, higher scores = more stressed
    let stressScore = 0;
    if (stressAnalysis.matchCount > 0) {
      const density = stressAnalysis.totalScore / Math.max(sentenceCount, 1);
      stressScore = 5 + (density * 1.5);
      stressScore = Math.max(1, Math.min(10, Math.round(stressScore)));
    }

    // Update state with keyword-based analysis (fallback)
    setMood(moodScore);
    setEnergy(energyScore);
    setStress(stressScore);

    // Try AI analysis if content is long enough
    if (content.length >= 100) {
      analyzeWithAI();
    } else {
      setAnalysisStatus("typing");
    }
  }, [content]);

  // AI-powered sentiment analysis
  const analyzeWithAI = async () => {
    if (isAnalyzing || !content.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStatus("analyzing");
    try {
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!data.fallback && data.mood && data.energy && data.stress) {
        setMood(Math.round(data.mood));
        setEnergy(Math.round(data.energy));
        setStress(Math.round(data.stress));
        if (data.meaning) setMeaning(Math.round(data.meaning));
        if (data.existentialDread) setExistentialDread(Math.round(data.existentialDread));
        if (data.connection) setConnection(Math.round(data.connection));
        if (data.authenticity) setAuthenticity(Math.round(data.authenticity));
        setAnalysisStatus("complete");
      } else {
        setAnalysisStatus("fallback");
      }
    } catch (error) {
      console.error("AI analysis failed, using keyword-based fallback:", error);
      setAnalysisStatus("fallback");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateLocalReflection = (text: string) => {
    const cleaned = text.trim().replace(/\s+/g, " ");
    const snippet = cleaned.length > 180 ? `${cleaned.slice(0, 180)}...` : cleaned;

    return {
      summary: `You wrote about: "${snippet}". Your entry reflects what is emotionally present for you right now.`,
      validatingArguments: [
        "Your feelings make sense because your experience is real and deserves to be acknowledged.",
        "Taking time to write this down is a healthy step toward understanding yourself, which supports your perspective.",
      ],
      counterArguments: [
        "This moment may feel absolute, but emotions can shift with time, rest, and new information.",
        "Your first interpretation might be only one angle; a broader view could reveal options you cannot see yet.",
      ],
    };
  };

  const handleSave = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (!content.trim()) {
      alert("Please write something before saving!");
      return;
    }

    const entry: Entry = {
      id: Date.now(),
      title: title || "Untitled Entry",
      content,
      date: new Date().toISOString(),
      mood,
      energy,
      stress,
      meaning,
      existentialDread,
      connection,
      authenticity,
    };

    try {
      let hasReflection = false;
      const fallbackReflection = generateLocalReflection(content);

      // Fetch AI analysis for summary + arguments regardless of length
      try {
        const response = await fetch("/api/analyze-sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        const data = await response.json();

        // Attach analysis results to entry if available
        if (data.summary) {
          entry.summary = data.summary;
          entry.validatingArguments = data.validatingArguments;
          entry.counterArguments = data.counterArguments;

          // Store analysis result to show to user
          setAnalysisResult({
            summary: data.summary,
            validatingArguments: data.validatingArguments,
            counterArguments: data.counterArguments,
          });
          setShowAnalysisResult(true);
          hasReflection = true;
        } else {
          entry.summary = fallbackReflection.summary;
          entry.validatingArguments = fallbackReflection.validatingArguments;
          entry.counterArguments = fallbackReflection.counterArguments;
          setAnalysisResult(fallbackReflection);
          setShowAnalysisResult(true);
          hasReflection = true;
        }
      } catch (apiError) {
        console.error("Error fetching AI analysis:", apiError);
        // Use local fallback reflection when API analysis fails
        entry.summary = fallbackReflection.summary;
        entry.validatingArguments = fallbackReflection.validatingArguments;
        entry.counterArguments = fallbackReflection.counterArguments;
        setAnalysisResult(fallbackReflection);
        setShowAnalysisResult(true);
        hasReflection = true;
      }

      // Save the entry
      const entries = getEntriesForUser(currentUser);
      entries.unshift(entry);
      saveEntriesForUser(currentUser, entries);

      // Only redirect immediately when there's no reflection modal to show
      if (!hasReflection) {
        router.push("/entries");
      }
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
            {currentUser && (
              <span className="hidden sm:inline text-sm text-gray-400 self-center">
                {currentUser.name}
              </span>
            )}
            <Link
              href="/entries"
              className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
            >
              View Entries
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-gray-500/30 text-gray-300 rounded-2xl hover:bg-gray-300/10 hover:border-gray-400/50 transition-all font-medium"
            >
              Log Out
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-cyan-300/30 text-cyan-300 rounded-2xl hover:bg-cyan-300/20 hover:border-cyan-300/50 transition-all font-medium shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
            >
              Save Entry
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 p-4 border border-gray-700 bg-gray-900 bg-opacity-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-200">Emotional State</h3>
              <div className="flex items-center gap-2">
                {isAnalyzing && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-cyan-400">AI analyzing...</span>
                  </div>
                )}
                {!isAnalyzing && analysisStatus === "complete" && (
                  <span className="text-xs text-emerald-400">✓ Analysis complete</span>
                )}
                {!isAnalyzing && analysisStatus === "fallback" && (
                  <span className="text-xs text-yellow-400">Keyword fallback</span>
                )}
                {(analysisStatus === "idle" || analysisStatus === "typing") && (
                  <span className="text-xs text-gray-500">AI reflection appears after you save</span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Mood</label>
                  <span className="text-xs text-gray-400 font-mono">{mood}/10</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 ease-out"
                    style={{ width: `${(mood / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Energy</label>
                  <span className="text-xs text-gray-400 font-mono">{energy}/10</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700 ease-out"
                    style={{ width: `${(energy / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Stress</label>
                  <span className="text-xs text-gray-400 font-mono">{stress}/10</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700 ease-out"
                    style={{ width: `${(stress / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Existential Metrics Tracker */}
          <div className="mb-6 p-4 border border-purple-900 bg-purple-950 bg-opacity-30 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-200">Existential State</h3>
              <span className="text-xs text-purple-400">AI-detected themes</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Meaning / Purpose</label>
                  <span className="text-xs text-gray-400 font-mono">{meaning}/10</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all duration-700 ease-out"
                    style={{ width: `${(meaning / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Existential Dread</label>
                  <span className="text-xs text-gray-400 font-mono">{existentialDread}/10</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-700 ease-out"
                    style={{ width: `${(existentialDread / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Connection</label>
                  <span className="text-xs text-gray-400 font-mono">{connection}/10</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-700 ease-out"
                    style={{ width: `${(connection / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Authenticity</label>
                  <span className="text-xs text-gray-400 font-mono">{authenticity}/10</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-700 ease-out"
                    style={{ width: `${(authenticity / 10) * 100}%` }}
                  />
                </div>
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

      {/* Analysis Result Modal */}
      {showAnalysisResult && analysisResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-cyan-400/30 rounded-3xl max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl shadow-cyan-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">AI Reflection</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Summary</h3>
                <p className="text-gray-200 leading-relaxed">{analysisResult.summary}</p>
              </div>

              {analysisResult.validatingArguments && analysisResult.validatingArguments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-emerald-400 mb-3">Why You're Right to Feel This Way</h3>
                  <ul className="space-y-2">
                    {analysisResult.validatingArguments.map((arg, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-emerald-400 flex-shrink-0 mt-1">✓</span>
                        <span className="text-gray-200 text-sm">{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.counterArguments && analysisResult.counterArguments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-amber-400 mb-3">Things to Consider</h3>
                  <ul className="space-y-2">
                    {analysisResult.counterArguments.map((arg, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-amber-400 flex-shrink-0 mt-1">→</span>
                        <span className="text-gray-200 text-sm">{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  setShowAnalysisResult(false);
                  router.push("/entries");
                }}
                className="w-full px-4 py-3 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-xl hover:bg-cyan-500/30 transition-all font-medium"
              >
                View All Entries
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
