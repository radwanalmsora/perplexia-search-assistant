import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const PERPLEXITY_API_URL = process.env.PERPLEXITY_API_URL || "https://api.perplexity.ai/v1/agent";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.post("/api/search", async (req, res) => {
  const { apiKey, model, input, effort, instructions, tools } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "Missing API key. Please provide your Perplexity API key." });
  }

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    return res.status(400).json({ error: "Missing search query. Please provide a question or prompt." });
  }

  const requestBody = {
    model: model || "openai/gpt-5.6-sol",
    input: input.trim(),
    tools: tools || [{ type: "web_search" }],
  };

  if (effort) {
    requestBody.reasoning = { effort };
  }

  if (instructions) {
    requestBody.instructions = instructions;
  }

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Perplexity API error (${response.status})`;
      let errorCode = response.status;

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        } else if (errorJson.detail) {
          errorMessage = errorJson.detail;
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        if (errorText.trim()) {
          errorMessage = errorText.trim();
        }
      }

      if (response.status === 401) {
        errorMessage = "Invalid API key. Please check your Perplexity API key and try again.";
      } else if (response.status === 429) {
        errorMessage = "Rate limit exceeded or insufficient credits. Please check your Perplexity account.";
      } else if (response.status === 403) {
        errorMessage = "Access denied. Your API key may not have permission to use this model.";
      }

      return res.status(response.status).json({
        error: errorMessage,
        code: errorCode,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    return res.status(500).json({
      error: "Failed to connect to Perplexity API. Please check your network connection and try again.",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
