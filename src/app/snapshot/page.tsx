"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SnapshotPage() {
  const router = useRouter();
  const [selfDescription, setSelfDescription] = useState("");
  const [coreValues, setCoreValues] = useState([
    { value: "", explanation: "" },
    { value: "", explanation: "" },
    { value: "", explanation: "" },
  ]);
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

  const addValue = () => {
    if (coreValues.length < 5) {
      setCoreValues([...coreValues, { value: "", explanation: "" }]);
    }
  };

  const removeValue = (index: number) => {
    if (coreValues.length > 3) {
      setCoreValues(coreValues.filter((_, i) => i !== index));
    }
  };

  const updateValue = (index: number, field: "value" | "explanation", text: string) => {
    const updated = [...coreValues];
    updated[index][field] = text;
    setCoreValues(updated);
  };

  const handleSave = () => {
    if (!selfDescription) {
      alert("Please complete the self-description section.");
      return;
    }

    const filledValues = coreValues.filter(v => v.value);
    if (filledValues.length < 3) {
      alert("Please specify at least 3 core values.");
      return;
    }

    const snapshot = {
      id: Date.now(),
      title: `Identity Snapshot - ${new Date().getFullYear()}`,
      date: new Date().toISOString(),
      isSnapshot: true,
      version: 1,
      snapshotData: {
        selfDescription,
        coreValues: filledValues,
        beliefs,
        becoming,
        fearsDoubts,
      },
      // Legacy format for backwards compatibility
      snapshotAnswers: {
        identity: selfDescription,
        values: filledValues.map(v => `${v.value}: ${v.explanation}`).join("\n"),
        becoming: becoming.movingToward,
        uncertain: fearsDoubts,
        fear: fearsDoubts,
      },
      summary: filledValues.map(v => v.value).slice(0, 3).join(", "),
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
              value={coreValues.filter(v => v.value).map(v => v.value).slice(0, 3).join(", ") || ""}
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
              <p className="text-sm text-gray-400 mb-4">Pick 3–5 values with short explanations</p>
              <div className="space-y-4">
                {coreValues.map((item, index) => (
                  <div key={index} className="border border-gray-700 rounded p-4 bg-gray-800 bg-opacity-30">
                    <div className="flex gap-3 mb-2">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => updateValue(index, "value", e.target.value)}
                        placeholder={`Value ${index + 1}`}
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-blue-600"
                      />
                      {coreValues.length > 3 && (
                        <button
                          onClick={() => removeValue(index)}
                          className="px-3 py-2 text-red-500 hover:bg-red-900 hover:bg-opacity-20 rounded"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <textarea
                      value={item.explanation}
                      onChange={(e) => updateValue(index, "explanation", e.target.value)}
                      placeholder="Why does this matter to you?"
                      className="w-full min-h-[60px] px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-blue-600 resize-none text-sm"
                    />
                  </div>
                ))}
                {coreValues.length < 5 && (
                  <button
                    onClick={addValue}
                    className="w-full py-2 border border-dashed border-stone-200 rounded hover:border-stone-300 hover:bg-stone-50 transition-all text-sm font-medium text-stone-600 hover:text-stone-800"
                  >
                    + Add Value
                  </button>
                )}
              </div>
            </section>

            {/* 3. Beliefs */}
            <section className="border border-gray-700 rounded-lg p-6 bg-gray-900 bg-opacity-30">
              <h2 className="text-2xl font-semibold mb-4">3. Beliefs</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Free Will</label>
                  <textarea
                    value={beliefs.freeWill}
                    onChange={(e) => setBeliefs({...beliefs, freeWill: e.target.value})}
                    placeholder="Do you believe you have free will? How much control do you have?"
                    className="w-full min-h-[80px] px-4 py-3 bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:outline-none focus:border-blue-600 resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Meaning</label>
                  <textarea
                    value={beliefs.meaning}
                    onChange={(e) => setBeliefs({...beliefs, meaning: e.target.value})}
                    placeholder="Where does meaning come from? What makes life meaningful?"
                    className="w-full min-h-[80px] px-4 py-3 bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:outline-none focus:border-blue-600 resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Morality</label>
                  <textarea
                    value={beliefs.morality}
                    onChange={(e) => setBeliefs({...beliefs, morality: e.target.value})}
                    placeholder="What makes something right or wrong?"
                    className="w-full min-h-[80px] px-4 py-3 bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:outline-none focus:border-blue-600 resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Purpose</label>
                  <textarea
                    value={beliefs.purpose}
                    onChange={(e) => setBeliefs({...beliefs, purpose: e.target.value})}
                    placeholder="What is your purpose? Do you need one?"
                    className="w-full min-h-[80px] px-4 py-3 bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:outline-none focus:border-blue-600 resize-none text-sm"
                  />
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
