import React from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3.5 flex items-start gap-3 animate-slide-up">
      <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-400 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-300 font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400/60 hover:text-red-300 transition-colors text-sm"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
}
