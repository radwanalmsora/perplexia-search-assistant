import React from "react";
import { ChevronDown } from "lucide-react";
import { MODELS, EFFORT_LEVELS } from "../lib/models.js";

export default function SettingsBar({ model, effort, onModelChange, onEffortChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="appearance-none bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg pl-3.5 pr-9 py-2 text-sm text-gray-200 focus:outline-none focus:border-brand-500 transition-all cursor-pointer"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={effort}
          onChange={(e) => onEffortChange(e.target.value)}
          className="appearance-none bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg pl-3.5 pr-9 py-2 text-sm text-gray-200 focus:outline-none focus:border-brand-500 transition-all cursor-pointer"
        >
          {EFFORT_LEVELS.map((e) => (
            <option key={e.id} value={e.id}>
              Effort: {e.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}
