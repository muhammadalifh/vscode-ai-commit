# Changelog

All notable changes to the "AI Commit Message Generator" extension will be documented in this file.

## [1.2.1] - 2026-02-05

### 🔄 Changed
- 📝 Minor documentation updates (README & CHANGELOG)
- 📦 Bumped version to 1.2.1 for package consistency

**Full Changelog**: https://github.com/muhammadalifh/vscode-ai-commit/compare/v1.2.0...v1.2.1

---

## [1.2.0] - 2026-02-05

### ✨ Added
- **OpenRouter**: Added `arcee-ai/trinity-mini-preview:free` model
  - ⚡ Fast Free option with 2.8s latency
- **Mistral**: New models added
  - 🪶 `ministral-8b-latest` - Lightweight (91.5 tok/s)
  - 🔓 `open-mistral-nemo` - Open Source (78.6 tok/s)
- **Cohere**: Added `command-r7b-12-2024`
  - 🚀 Most efficient Cohere model (88.8 tok/s)

### 🔄 Changed
- 📊 Updated model descriptions with performance metrics from benchmark results
- 🔧 Fixed default OpenRouter model in config to match package.json

### 🗑️ Removed
- **Mistral**: Removed deprecated `open-mistral-7b`
- **Cohere**: Removed deprecated `command-light` and `command` models

---

## [1.1.0] - 2026-02-03

### 🔄 Changed
- 🎨 **Settings UI**: Split into "General" and "Providers" sections for better organization
- 🔔 **Dynamic Notifications**: Now show specific provider and model names (e.g. `OpenRouter (arcee-ai/...)`)
- 🔄 **OpenRouter**: Updated to use `arcee-ai/trinity-large-preview:free` as primary free model
- 🔀 **Fallback Order**: Updated priority to `Groq` → `OpenRouter` → `Mistral` → `Cohere`

### 🗑️ Removed
- **Gemini**: Temporarily disabled Google Gemini provider due to improved reliability focus

---

## [1.0.0] - 2026-02-03

### 🎉 Initial Release

#### 🤖 AI Features
- ✅ 5 AI providers with automatic fallback (Groq, OpenRouter, Gemini, Mistral, Cohere)
- 📝 Conventional Commits format support
- 🌐 Multi-language support (English, Indonesian)
- 🔍 Smart tech stack detection

#### ⚙️ Configuration
- 🎨 Multiple commit styles (conventional, detailed, simple)
- 🔐 Environment variable support for API keys
- 🔔 Progress notification with cancellation support

#### 📤 Output Options
- 📋 Copy to clipboard
- 💬 Insert to SCM input
- ✏️ Inline edit in commit message