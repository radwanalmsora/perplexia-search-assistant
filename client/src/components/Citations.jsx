import React from "react";
import { ExternalLink, BookOpen } from "lucide-react";

export default function Citations({ citations }) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-brand-400" />
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
          Sources ({citations.length})
        </h3>
      </div>
      <div className="grid gap-2">
        {citations.map((citation, index) => {
          let hostname = citation.url;
          try {
            hostname = new URL(citation.url).hostname.replace("www.", "");
          } catch {
            // keep raw url
          }
          return (
            <a
              key={`${citation.url}-${index}`}
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-brand-600/50 rounded-lg px-3.5 py-2.5 transition-all"
            >
              <span className="flex-shrink-0 w-5 h-5 bg-gray-700 group-hover:bg-brand-600 text-gray-400 group-hover:text-white text-xs font-mono rounded flex items-center justify-center transition-colors">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 group-hover:text-white truncate transition-colors">
                  {citation.title}
                </p>
                <p className="text-xs text-gray-500 truncate">{hostname}</p>
              </div>
              <ExternalLink className="flex-shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-brand-400 transition-colors mt-0.5" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
