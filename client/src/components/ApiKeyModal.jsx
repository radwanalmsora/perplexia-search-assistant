import React, { useState } from "react";
import { Key, X, Eye, EyeOff, Check, Loader2, Trash2, ExternalLink } from "lucide-react";
import { getApiKey, saveApiKey, clearApiKey } from "../lib/storage.js";
import { searchPerplexity } from "../lib/api.js";

export default function ApiKeyModal({ open, onClose, onSaved, onCleared }) {
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (open) {
      setKeyInput(getApiKey());
      setStatus(null);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  async function handleVerify() {
    if (!keyInput.trim()) {
      setError("Please enter your Perplexity API key.");
      return;
    }

    setVerifying(true);
    setError("");
    setStatus(null);

    try {
      await searchPerplexity({
        apiKey: keyInput.trim(),
        model: "perplexity/sonar",
        input: "Hello, respond with: OK",
        effort: "low",
      });
      saveApiKey(keyInput.trim());
      setStatus("verified");
      setTimeout(() => {
        onSaved();
        onClose();
      }, 800);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Failed to verify API key. Please check your key.");
    } finally {
      setVerifying(false);
    }
  }

  function handleClear() {
    clearApiKey();
    setKeyInput("");
    setStatus(null);
    setError("");
    onCleared();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-600/20 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">API Key Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">
              Enter your Perplexity API key. It will be stored locally in your browser only —
              it is never sent to any database.
            </p>
            <a
              href="https://docs.perplexity.ai/guides/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 transition-colors"
            >
              How to get an API key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !verifying && handleVerify()}
              placeholder="pplx-xxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={() => setShowKey((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              aria-label={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>

          {status === "verified" && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 animate-fade-in">
              <Check className="w-4 h-4" />
              API key verified and saved successfully!
            </div>
          )}

          {status === "error" && error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 animate-fade-in">
              {error}
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={handleVerify}
              disabled={verifying || !keyInput.trim()}
              className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Verify & Save
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-lg border border-gray-700 hover:border-red-500/50 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
