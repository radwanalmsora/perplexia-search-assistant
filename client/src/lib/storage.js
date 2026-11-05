const API_KEY_STORAGE = "perplexia_api_key";
const MODEL_STORAGE = "perplexia_model";
const EFFORT_STORAGE = "perplexia_effort";

export function getApiKey() {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || "";
  } catch {
    return "";
  }
}

export function saveApiKey(key) {
  try {
    localStorage.setItem(API_KEY_STORAGE, key);
  } catch {
    // localStorage might be unavailable in some contexts
  }
}

export function clearApiKey() {
  try {
    localStorage.removeItem(API_KEY_STORAGE);
  } catch {
    // no-op
  }
}

export function getStoredModel() {
  try {
    return localStorage.getItem(MODEL_STORAGE) || "openai/gpt-5.6-sol";
  } catch {
    return "openai/gpt-5.6-sol";
  }
}

export function saveModel(model) {
  try {
    localStorage.setItem(MODEL_STORAGE, model);
  } catch {
    // no-op
  }
}

export function getStoredEffort() {
  try {
    return localStorage.getItem(EFFORT_STORAGE) || "low";
  } catch {
    return "low";
  }
}

export function saveEffort(effort) {
  try {
    localStorage.setItem(EFFORT_STORAGE, effort);
  } catch {
    // no-op
  }
}
