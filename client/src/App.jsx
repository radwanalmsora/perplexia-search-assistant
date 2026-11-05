import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Search,
  Key,
  Loader2,
  Send,
  Cpu,
  Zap,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import ApiKeyModal from "./components/ApiKeyModal.jsx";
import Citations from "./components/Citations.jsx";
import ErrorBanner from "./components/ErrorBanner.jsx";
import SettingsBar from "./components/SettingsBar.jsx";
import EmptyState from "./components/EmptyState.jsx";

import {
  getApiKey,
  getStoredModel,
  saveModel,
  getStoredEffort,
  saveEffort,
} from "./lib/storage.js";
import {
  searchPerplexity,
  extractAnswerText,
  extractCitations,
  extractUsage,
} from "./lib/api.js";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState([]);
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState("");
  const [model, setModel] = useState(getStoredModel());
  const [effort, setEffort] = useState(getStoredEffort());

  const inputRef = useRef(null);

  useEffect(() => {
    const key = getApiKey();
    setApiKey(key);
    if (!key) {
      setShowKeyModal(true);
    }
  }, []);

  function handleModelChange(newModel) {
    setModel(newModel);
    saveModel(newModel);
  }

  function handleEffortChange(newEffort) {
    setEffort(newEffort);
    saveEffort(newEffort);
  }

  function handleKeySaved() {
    setApiKey(getApiKey());
  }

  function handleKeyCleared() {
    setApiKey("");
    setAnswer("");
    setCitations([]);
    setUsage(null);
  }

  async function handleSearch() {
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setCitations([]);
    setUsage(null);

    try {
      const data = await searchPerplexity({
        apiKey,
        model,
        input: prompt.trim(),
        effort,
        instructions: "Provide a clear, well-structured answer with sources. Use markdown formatting.",
      });

      setAnswer(extractAnswerText(data));
      setCitations(extractCitations(data));
      setUsage(extractUsage(data));
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSearch();
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white leading-none">Perplexia</h1>
              <p className="text-[11px] text-gray-500 leading-none mt-0.5">Smart Search Assistant</p>
            </div>
          </div>

          <button
            onClick={() => setShowKeyModal(true)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all ${
              apiKey
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : "bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 border border-brand-600/30"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            {apiKey ? "API Key" : "Set API Key"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col">
        {/* Settings bar */}
        {apiKey && (
          <div className="mb-4">
            <SettingsBar
              model={model}
              effort={effort}
              onModelChange={handleModelChange}
              onEffortChange={handleEffortChange}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} onDismiss={() => setError("")} />
          </div>
        )}

        {/* Content area */}
        <div className="flex-1">
          {!answer && !loading && (
            <EmptyState hasApiKey={!!apiKey} onOpenSettings={() => setShowKeyModal(true)} />
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="relative">
                <div className="w-14 h-14 border-3 border-gray-700 border-t-brand-500 rounded-full animate-spin" />
                <Search className="absolute inset-0 m-auto w-6 h-6 text-brand-400" />
              </div>
              <p className="text-gray-400 text-sm mt-4 flex items-center gap-2">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" style={{ animationDelay: "400ms" }} />
                </span>
                Searching the web...
              </p>
            </div>
          )}

          {answer && !loading && (
            <div className="animate-slide-up">
              {/* Query echo */}
              <div className="mb-4 flex items-start gap-2.5">
                <div className="flex-shrink-0 w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center mt-0.5">
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 pt-1">{prompt}</p>
              </div>

              {/* Answer */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
                  <div className="w-6 h-6 bg-brand-600/20 rounded-md flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                    Answer
                  </span>
                  {usage && (
                    <span className="ml-auto text-[11px] text-gray-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        {usage.promptTokens + usage.completionTokens} tokens
                      </span>
                    </span>
                  )}
                </div>

                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {answer}
                  </ReactMarkdown>
                </div>

                <Citations citations={citations} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Search input bar */}
      <div className="sticky bottom-0 bg-gray-950/95 backdrop-blur-md border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative flex items-end gap-2.5">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={apiKey ? "Ask anything... (Ctrl+Enter to search)" : "Set your API key to start searching..."}
                disabled={!apiKey || loading}
                rows={1}
                className="w-full bg-gray-900 border border-gray-700 focus:border-brand-500 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: "50px", maxHeight: "150px" }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!apiKey || !prompt.trim() || loading}
              className="flex-shrink-0 w-[50px] h-[50px] bg-brand-600 hover:bg-brand-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl transition-all flex items-center justify-center"
              aria-label="Search"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-[11px] text-gray-600 mt-2 text-center">
            Powered by Perplexity Agent API · BYOK · Your key never leaves the proxy unlogged
          </p>
        </div>
      </div>

      <ApiKeyModal
        open={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSaved={handleKeySaved}
        onCleared={handleKeyCleared}
      />
    </div>
  );
}
