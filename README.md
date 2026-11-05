# Perplexia — Smart Search Assistant

An open-source, interactive web application that provides a smart search assistant powered by the **Perplexity Agent API**. Built with a BYOK (Bring Your Own Key) model — users provide their own API key, which is stored locally in the browser and never persisted in any database.

## Features

- **BYOK Architecture** — Users enter their own Perplexity API key; it's stored in `localStorage` and never touches a database
- **Proxy Backend** — An Express server acts as a proxy to avoid CORS issues and protect the key in transit
- **Real-time Web Search** — Uses Perplexity's `web_search` tool for up-to-date, sourced answers
- **Markdown Rendering** — Answers are rendered with full Markdown support (tables, code blocks, lists, etc.)
- **Citations Panel** — Sources and links are displayed in an organized list beneath each answer
- **Model Selection** — Choose from multiple models (GPT-5.6, Claude, Gemini, Grok, Sonar, etc.)
- **Effort Control** — Adjust reasoning effort (low / medium / high) to balance speed and cost
- **Smart Error Handling** — Clear messages for invalid keys, rate limits, insufficient credits, and network errors
- **Key Management** — Verify, save, and clear your API key at any time
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop

## Project Structure

