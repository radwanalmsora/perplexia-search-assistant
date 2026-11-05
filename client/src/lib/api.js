const PERPLEXITY_API_URL = "https://api.perplexity.ai/v1/agent";

export async function searchPerplexity({ apiKey, model, input, effort, instructions }) {
  const requestBody = {
    apiKey,
    model,
    input,
    effort: effort || undefined,
    instructions: instructions || undefined,
    tools: [{ type: "web_search" }],
  };

  // Try the backend proxy first (avoids CORS, works in dev mode)
  try {
    const proxyResponse = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (proxyResponse.ok) {
      return await proxyResponse.json();
    }

    // If proxy returns a structured error (not a network/404), surface it
    if (proxyResponse.status !== 404) {
      const errorData = await proxyResponse.json().catch(() => null);
      throw new Error(errorData?.error || `Request failed with status ${proxyResponse.status}`);
    }
  } catch (err) {
    // If the error is a structured API error (not a network failure), rethrow
    if (err.message && !err.message.includes("Failed to fetch") && !err.message.includes("NetworkError") && !err.message.includes("fetch")) {
      throw err;
    }
    // Network failure — fall through to direct API call
  }

  // Fallback: call Perplexity API directly (for static hosting without backend)
  const directBody = {
    model: model || "openai/gpt-5.6-sol",
    input: input.trim(),
    tools: [{ type: "web_search" }],
  };

  if (effort) {
    directBody.reasoning = { effort };
  }

  if (instructions) {
    directBody.instructions = instructions;
  }

  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(directBody),
  });

  const data = await response.json();

  if (!response.ok) {
    let errorMessage = `Perplexity API error (${response.status})`;
    if (response.status === 401) {
      errorMessage = "Invalid API key. Please check your Perplexity API key and try again.";
    } else if (response.status === 429) {
      errorMessage = "Rate limit exceeded or insufficient credits. Please check your Perplexity account.";
    } else if (response.status === 403) {
      errorMessage = "Access denied. Your API key may not have permission to use this model.";
    } else if (data.error?.message) {
      errorMessage = data.error.message;
    } else if (data.detail) {
      errorMessage = data.detail;
    } else if (data.message) {
      errorMessage = data.message;
    }
    throw new Error(errorMessage);
  }

  return data;
}

export function extractAnswerText(data) {
  if (data.output_text) {
    return data.output_text;
  }

  if (data.output && Array.isArray(data.output)) {
    const textParts = data.output
      .filter((item) => item.type === "message" || item.type === "text")
      .map((item) => {
        if (item.content && Array.isArray(item.content)) {
          return item.content
            .filter((c) => c.type === "text" || typeof c === "string")
            .map((c) => (typeof c === "string" ? c : c.text))
            .join("\n");
        }
        if (item.text) return item.text;
        return "";
      })
      .filter(Boolean);
    if (textParts.length > 0) return textParts.join("\n\n");
  }

  if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
    return data.choices[0].message?.content || "";
  }

  if (typeof data.content === "string") {
    return data.content;
  }

  return "";
}

export function extractCitations(data) {
  const citations = [];

  if (data.citations && Array.isArray(data.citations)) {
    for (const c of data.citations) {
      if (typeof c === "string") {
        citations.push({ url: c, title: c });
      } else if (c && typeof c === "object") {
        citations.push({
          url: c.url || c.link || c.href || "#",
          title: c.title || c.url || c.link || "Source",
        });
      }
    }
  }

  if (data.search_results && Array.isArray(data.search_results)) {
    for (const r of data.search_results) {
      if (!citations.find((c) => c.url === (r.url || r.link))) {
        citations.push({
          url: r.url || r.link || "#",
          title: r.title || r.url || "Source",
        });
      }
    }
  }

  if (data.output && Array.isArray(data.output)) {
    for (const item of data.output) {
      if (item.type === "web_search_call" && item.results) {
        for (const r of item.results) {
          if (!citations.find((c) => c.url === (r.url || r.link))) {
            citations.push({
              url: r.url || r.link || "#",
              title: r.title || r.url || "Source",
            });
          }
        }
      }
    }
  }

  return citations;
}

export function extractUsage(data) {
  if (data.usage) {
    return {
      promptTokens: data.usage.prompt_tokens || data.usage.input_tokens || 0,
      completionTokens: data.usage.completion_tokens || data.usage.output_tokens || 0,
      totalTokens: data.usage.total_tokens || 0,
    };
  }
  return null;
}
