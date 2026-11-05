import React from "react";
import { Search, Sparkles, Clock, Zap, Globe, Shield } from "lucide-react";

export default function EmptyState({ hasApiKey, onOpenSettings }) {
  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-in">
        <div className="w-16 h-16 bg-brand-600/10 rounded-2xl flex items-center justify-center mb-5">
          <Shield className="w-8 h-8 text-brand-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Welcome to Perplexia
        </h2>
        <p className="text-gray-400 max-w-md mb-6">
          A smart search assistant powered by Perplexity Agent API. Bring your own API key —
          your key stays in your browser and is never stored on any server.
        </p>
        <button
          onClick={onOpenSettings}
          className="bg-brand-600 hover:bg-brand-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Set up your API key
        </button>
      </div>
    );
  }

  const suggestions = [
    { icon: Globe, text: "What are the latest developments in AI today?" },
    { icon: Zap, text: "Explain quantum computing in simple terms" },
    { icon: Clock, text: "What happened in tech news this week?" },
    { icon: Search, text: "Compare React vs Vue for enterprise apps" },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-fade-in">
      <div className="w-14 h-14 bg-brand-600/10 rounded-2xl flex items-center justify-center mb-4">
        <Search className="w-7 h-7 text-brand-400" />
      </div>
      <h2 className="text-lg font-semibold text-white mb-1.5">
        Ask anything, get sourced answers
      </h2>
      <p className="text-gray-400 text-sm max-w-md mb-8">
        Your search will use real-time web results with citations. Try one of these:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-left text-sm text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-all"
          >
            <s.icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
            {s.text}
          </div>
        ))}
      </div>
    </div>
  );
}
