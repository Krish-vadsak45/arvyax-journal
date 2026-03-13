"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import {
  TreePine,
  Waves,
  Mountain,
  Plus,
  History,
  BrainCircuit,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const environments = [
  { id: "forest", icon: TreePine, color: "text-green-500", bg: "bg-green-50" },
  { id: "ocean", icon: Waves, color: "text-blue-500", bg: "bg-blue-50" },
  {
    id: "mountain",
    icon: Mountain,
    color: "text-stone-500",
    bg: "bg-stone-50",
  },
];

export default function JournalApp() {
  const { isLoaded, userId: clerkUserId } = useAuth();
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [ambience, setAmbience] = useState("forest" as any);
  const [loading, setLoading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [insights, setInsights] = useState(null as any);
  const [status, setStatus] = useState(null as any);

  const fetchEntries = useCallback(async () => {
    if (!clerkUserId) return;
    try {
      const res = await axios.get("/api/journal");
      setEntries(res.data);
    } catch (error) {
      console.error("Error fetching entries", error);
    }
  }, [clerkUserId]);

  const fetchInsights = useCallback(async () => {
    if (!clerkUserId) return;
    try {
      const res = await axios.get(`/api/journal/insights/${clerkUserId}`);
      setInsights(res.data);
    } catch (error) {
      console.error("Error fetching insights", error);
    }
  }, [clerkUserId]);

  useEffect(() => {
    if (isLoaded && clerkUserId) {
      fetchEntries();
      fetchInsights();
    }
  }, [isLoaded, clerkUserId, fetchEntries, fetchInsights]);

  const handleSubmit = async (e: any) => {
    if (!clerkUserId) return;
    e.preventDefault();
    setLoading(true);
    setStatus("Creating Entry...");
    try {
      const { data: newEntry } = await axios.post("/api/journal", {
        ambience,
        text,
      });
      setStatus("Analyzing Emotion...");
      await axios.post("/api/journal/analyze", {
        text: newEntry.text,
        entryId: newEntry._id,
      });

      setText("");
      fetchEntries();
      fetchInsights();
      setStatus("Journal Saved Successfully!");
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error("Error creating entry", error);
      setStatus("Error: Could not save entry");
    } finally {
      setLoading(false);
    }
  };

  const handleManualAnalyze = async (entryId: string, text: string) => {
    setAnalyzingId(entryId);
    try {
      await axios.post("/api/journal/analyze", {
        text,
        entryId,
      });
      fetchEntries();
      fetchInsights();
    } catch (error) {
      console.error("Error manual analyze", error);
    } finally {
      setAnalyzingId(null);
    }
  };

  if (!isLoaded || !clerkUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="animate-spin text-stone-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans text-stone-800">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 mb-2 text-stone-900">
              My Wellness Journal
            </h1>
            <p className="text-stone-500">
              Record your thoughts after nature sessions.
            </p>
          </div>
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border text-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {status}
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form Section */}
          <section className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200 border border-stone-100">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-stone-700">
                <Plus className="h-5 w-5" /> New Session Journal
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-500 mb-3">
                    Which session did you complete?
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {environments.map((env) => (
                      <button
                        key={env.id}
                        type="button"
                        onClick={() => setAmbience(env.id)}
                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                          ambience === env.id
                            ? `${env.bg} border-neutral-300 ring-2 ring-neutral-200`
                            : "border-transparent bg-stone-50 hover:bg-neutral-100"
                        }`}
                      >
                        <env.icon className={`h-8 w-8 ${env.color} mb-2`} />
                        <span className="capitalize text-sm font-semibold">
                          {env.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-500 mb-2">
                    Your reflections
                  </label>
                  <textarea
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="How do you feel after this session?"
                    className="w-full h-40 p-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-stone-200 resize-none text-stone-800 placeholder-stone-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-zinc-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <BrainCircuit className="h-5 w-5" />
                  )}
                  {loading ? "Processing..." : "Save & Analyze Entry"}
                </button>
              </form>
            </div>

            {/* Past Entries */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-stone-700">
                <History className="h-5 w-5" /> Previous Reflections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entries.length === 0 && !loading && (
                  <span className="text-stone-400 italic">No entries yet.</span>
                )}
                {entries.map((expr: any) => (
                  <div
                    key={expr._id}
                    className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm transition-hover hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-600">
                        {expr.ambience}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(expr.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-stone-700 text-sm line-clamp-2 mb-4 leading-relaxed font-light italic">
                      "{expr.text}"
                    </p>
                    <div className="pt-4 border-t border-stone-50">
                      <div className="flex items-center justify-between mb-2">
                        {expr.emotion ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-tighter">
                            {expr.emotion}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-stone-300">
                            Awaiting Analysis
                          </span>
                        )}

                        <button
                          onClick={() =>
                            handleManualAnalyze(expr._id, expr.text)
                          }
                          disabled={analyzingId === expr._id}
                          className="text-[10px] flex items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50"
                        >
                          {analyzingId === expr._id ? (
                            <Loader2 className="animate-spin h-3 w-3" />
                          ) : (
                            <BrainCircuit className="h-3 w-3" />
                          )}
                          {analyzingId === expr._id
                            ? "Thinking..."
                            : "Re-Analyze"}
                        </button>
                      </div>

                      {expr.keywords && expr.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {expr.keywords.slice(0, 3).map((k: string) => (
                            <span
                              key={k}
                              className="text-[9px] bg-stone-50 text-stone-400 px-1.5 py-0.5 rounded-full border border-stone-100"
                            >
                              #{k}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar Insights */}
          <section className="space-y-6">
            <div className="bg-zinc-950 text-white rounded-3xl p-8 sticky top-12 shadow-2xl shadow-stone-300">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-8 text-white">
                <BrainCircuit className="h-6 w-6 text-indigo-300" /> Insights
                Engine
              </h2>

              {!insights ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div className="space-y-10">
                  <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                    <span className="text-stone-400 text-xs font-medium uppercase tracking-widest">
                      Total Sessions
                    </span>
                    <span className="text-2xl font-mono font-bold">
                      {insights.totalEntries}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-stone-400 text-xs font-medium uppercase tracking-widest">
                      Dominant Emotion
                    </span>
                    <p className="text-4xl font-black capitalize text-indigo-300">
                      {insights.topEmotion}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <span className="text-stone-400 text-xs font-medium uppercase tracking-widest">
                      Top Environment
                    </span>
                    <div className="flex items-center gap-3 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                      <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                        {insights.mostUsedAmbience === "forest" && (
                          <TreePine className="h-6 w-6 text-green-400" />
                        )}
                        {insights.mostUsedAmbience === "ocean" && (
                          <Waves className="h-6 w-6 text-blue-400" />
                        )}
                        {insights.mostUsedAmbience === "mountain" && (
                          <Mountain className="h-6 w-6 text-stone-400" />
                        )}
                      </div>
                      <span className="text-lg font-bold capitalize">
                        {insights.mostUsedAmbience}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-stone-400 text-xs font-medium uppercase tracking-widest">
                      Cloud of thought
                    </span>
                    <div className="flex flex-wrap gap-2 text-white">
                      {insights.recentKeywords.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/5 rounded-lg text-xs font-medium text-stone-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
