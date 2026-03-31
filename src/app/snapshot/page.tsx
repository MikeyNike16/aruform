"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CORE_VALUE_OPTIONS = [
  "Family / Love / Loyalty",
  "Happiness",
  "Autonomy / Freedom",
  "Respect",
  "Trustworthiness / Honesty",
  "Kindness / Compassion",
  "Security / Stability",
  "Integrity / Responsibility",
  "Health / Balance",
  "Faith / Spirituality",
];

const FREE_WILL_OPTIONS = [
  {
    label: "Ability to Choose",
    description: "The capacity to select between different possible courses of action.",
  },
  {
    label: "Acting Without Coercion",
    description: "Making decisions free from external force, threats, or manipulation.",
  },
  {
    label: "Control Over My Actions",
    description: "Having the power to guide or direct what I do based on my own reasons or desires.",
  },
  {
    label: "Moral Responsibility",
    description: "The kind of control needed to be praised or blamed for my choices.",
  },
  {
    label: "Self-Determination",
    description: "Being the ultimate source of my own decisions and actions.",
  },
  {
    label: "Freedom to Do Otherwise",
    description: "The sense that I could have chosen differently in a given situation.",
  },
  {
    label: "Rational Deliberation",
    description: "The ability to weigh options, think things through, and act accordingly.",
  },
  {
    label: "Acting on My True Desires",
    description: "Doing what I genuinely want, without inner compulsion or addiction overriding me.",
  },
];

const MEANING_OPTIONS = [
  "Having Purpose",
  "Feeling I Matter",
  "Life Makes Sense",
  "Deep Connections",
  "Personal Growth",
  "Helping Others",
  "Living Authentically",
  "Inner Fulfillment",
  "Life is subjective; I create my own meaning",
  "There is no ultimate meaning",
];

const MORALITY_OPTIONS = [
  "Right vs Wrong",
  "No Harm to Others",
  "Fairness & Justice",
  "Kindness & Care",
  "Honesty & Trust",
  "Respect & Dignity",
  "Being a Good Person",
  "It's Subjective / Cultural",
];

const PURPOSE_OPTIONS = [
  "Having Direction",
  "Clear Goals",
  "Making a Difference",
  "Helping Others",
  "Personal Growth",
  "Living Authentically",
  "Feeling Fulfilled",
  "There is no purpose",
];

export default function SnapshotPage() {
  const router = useRouter();
  const [selfDescription, setSelfDescription] = useState("");
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [freeWillSelections, setFreeWillSelections] = useState<string[]>([]);
  const [meaningSelections, setMeaningSelections] = useState<string[]>([]);
  const [moralitySelections, setMoralitySelections] = useState<string[]>([]);
  const [purposeSelections, setPurposeSelections] = useState<string[]>([]);
  const [beliefs, setBeliefs] = useState({
    freeWill: "",
    meaning: "",
    morality: "",
    purpose: "",
  });
  const [becoming, setBecoming] = useState({
    movingToward: "",
    movingAway: "",
  });
  const [fearsDoubts, setFearsDoubts] = useState("");

  const toggleCoreValue = (value: string) => {
    setCoreValues((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }

      if (current.length >= 5) {
        return current;
      }

      return [...current, value];
    });
  };

  const toggleFreeWillSelection = (label: string) => {
    setFreeWillSelections((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  const toggleMeaningSelection = (label: string) => {
    setMeaningSelections((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  const toggleMoralitySelection = (label: string) => {
    setMoralitySelections((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  const togglePurposeSelection = (label: string) => {
    setPurposeSelections((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  const handleSave = () => {
    if (!selfDescription) {
      alert("Please complete the self-description section.");
      return;
    }

    if (coreValues.length < 3) {
      alert("Please specify at least 3 core values.");
      return;
    }

    const selectedValues = coreValues.map((value) => ({ value, explanation: "" }));
    const freeWillSummary = freeWillSelections.join(", ");
    const meaningSummary = meaningSelections.join(", ");
    const moralitySummary = moralitySelections.join(", ");
    const purposeSummary = purposeSelections.join(", ");

    const snapshot = {
      id: Date.now(),
      title: `Identity Snapshot - ${new Date().getFullYear()}`,
      date: new Date().toISOString(),
      isSnapshot: true,
      version: 1,
      snapshotData: {
        selfDescription,
        coreValues: selectedValues,
        beliefs: {
          ...beliefs,
          freeWill: freeWillSummary,
          meaning: meaningSummary,
          morality: moralitySummary,
          purpose: purposeSummary,
        },
        becoming,
        fearsDoubts,
      },
      // Legacy format for backwards compatibility
      snapshotAnswers: {
        identity: selfDescription,
        values: coreValues.join(", "),
        becoming: becoming.movingToward,
        uncertain: fearsDoubts,
        fear: fearsDoubts,
      },
      summary: coreValues.slice(0, 3).join(", "),
    };

    const entries = JSON.parse(localStorage.getItem("entries") || "[]");
    entries.unshift(snapshot);
    localStorage.setItem("entries", JSON.stringify(entries));

    router.push("/timeline");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            aruform
          </Link>
          <div className="flex gap-3">
            <Link
              href="/timeline"
              className="px-4 py-2 bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100 transition-all font-medium shadow-sm hover:shadow-md border border-amber-100"
            >
              View Timeline
            </Link>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-stone-50 text-stone-800 rounded-lg hover:bg-stone-100 transition-all font-medium shadow-sm hover:shadow-md"
            >
              Save Snapshot
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3">Identity Snapshot</h1>
            <p className="text-gray-400">
              A chapter in your story—document who you are this year
            </p>
          </div>

          {/* Year Summary */}
          <div className="mb-6 border border-blue-600 rounded-lg p-6 bg-blue-600 bg-opacity-5">
            <label className="block text-sm font-medium mb-2 text-blue-400">
              Year Summary (for your timeline)
            </label>
            <input
              type="text"
              placeholder="e.g., 'Searching, uncertain, career-focused' or 'More confident, questioning free will'"
              value={coreValues.slice(0, 3).join(", ") || ""}
              readOnly
              className="w-full px-4 py-3 bg-gray-900 bg-opacity-50 rounded border border-gray-700 text-gray-400 text-sm italic"
            />
            <p className="text-xs text-gray-500 mt-2">
              This summary is auto-generated from your core values and will appear on your timeline
            </p>
          </div>

          <div className="space-y-8">
            {/* 1. Self-Description */}
            <section className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-30">
              <h2 className="text-2xl font-semibold mb-2">1. Self-Description</h2>
              <p className="text-sm text-gray-400 mb-4">In one paragraph, who are you?</p>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Write a clear, direct description of who you are right now..."
                className="w-full min-h-[120px] px-4 py-3 bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:outline-none focus:border-blue-600 resize-none"
              />
            </section>

            {/* 2. Core Values */}
            <section className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-30">
              <h2 className="text-2xl font-semibold mb-2">2. Core Values</h2>
              <p className="text-sm text-gray-400 mb-4">Choose 3-5 values that feel most true for you right now</p>
              <div className="flex flex-wrap gap-3">
                {CORE_VALUE_OPTIONS.map((value) => {
                  const isSelected = coreValues.includes(value);
                  const isDisabled = !isSelected && coreValues.length >= 5;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleCoreValue(value)}
                      disabled={isDisabled}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                          : "border-gray-700 bg-gray-800/60 text-gray-300 hover:border-blue-500 hover:text-white"
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Selected: {coreValues.length}/5. Choose at least 3.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {coreValues.map((value) => (
                  <span
                    key={value}
                    className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs text-blue-300"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </section>

            {/* 3. Beliefs */}
            <section className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-30">
              <h2 className="text-2xl font-semibold mb-4">3. Beliefs</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Free Will</label>
                  <p className="text-xs text-gray-500 mb-3">
                    Choose the statements that best match your view.
                  </p>
                  <div className="space-y-2">
                    {FREE_WILL_OPTIONS.map((option) => {
                      const isSelected = freeWillSelections.includes(option.label);
                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => toggleFreeWillSelection(option.label)}
                          className={`w-full text-left rounded-lg border px-4 py-3 transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-600/20"
                              : "border-gray-700 bg-gray-800/40 hover:border-blue-500/60"
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-100">{option.label}</div>
                          <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {freeWillSelections.length}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Meaning</label>
                  <p className="text-xs text-gray-500 mb-3">
                    Choose any that resonate.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MEANING_OPTIONS.map((option) => {
                      const isSelected = meaningSelections.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMeaningSelection(option)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-600/20 text-blue-100"
                              : "border-gray-700 bg-gray-800/40 text-gray-300 hover:border-blue-500/60"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {meaningSelections.length}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Morality</label>
                  <p className="text-xs text-gray-500 mb-3">
                    Choose any that resonate.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MORALITY_OPTIONS.map((option) => {
                      const isSelected = moralitySelections.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMoralitySelection(option)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-600/20 text-blue-100"
                              : "border-gray-700 bg-gray-800/40 text-gray-300 hover:border-blue-500/60"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {moralitySelections.length}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Purpose</label>
                  <p className="text-xs text-gray-500 mb-3">
                    Choose any that resonate.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PURPOSE_OPTIONS.map((option) => {
                      const isSelected = purposeSelections.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => togglePurposeSelection(option)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-600/20 text-blue-100"
                              : "border-gray-700 bg-gray-800/40 text-gray-300 hover:border-blue-500/60"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {purposeSelections.length}
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Becoming */}
            <section className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-30">
              <h2 className="text-2xl font-semibold mb-4">4. Becoming</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">What you&apos;re trying to become</label>
                  <textarea
                    value={becoming.movingToward}
                    onChange={(e) => setBecoming({...becoming, movingToward: e.target.value})}
                    placeholder="What version of yourself are you moving toward?"
                    className="w-full min-h-[80px] px-4 py-3 bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:outline-none focus:border-blue-600 resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">What you&apos;re moving away from</label>
                  <textarea
                    value={becoming.movingAway}
                    onChange={(e) => setBecoming({...becoming, movingAway: e.target.value})}
                    placeholder="What are you leaving behind or trying not to be?"
                    className="w-full min-h-[80px] px-4 py-3 bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:outline-none focus:border-blue-600 resize-none text-sm"
                  />
                </div>
              </div>
            </section>

            {/* 5. Fears & Doubts */}
            <section className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-30">
              <h2 className="text-2xl font-semibold mb-2">5. Fears &amp; Doubts</h2>
              <p className="text-sm text-gray-400 mb-4">What feels unresolved</p>
              <textarea
                value={fearsDoubts}
                onChange={(e) => setFearsDoubts(e.target.value)}
                placeholder="What uncertainties, fears, or unresolved questions do you carry?"
                className="w-full min-h-[120px] px-4 py-3 bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:outline-none focus:border-blue-600 resize-none"
              />
            </section>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSave}
              className="px-12 py-4 bg-stone-50 text-stone-800 rounded-lg hover:bg-stone-100 transition-all font-medium text-lg shadow-md hover:shadow-lg"
            >
              Save to Timeline
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
