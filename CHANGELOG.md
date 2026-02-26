# Changelog

All notable changes to the "AI Commit Message Generator" extension will be documented in this file.

## [1.4.0] - 2026-02-26

### ✨ Added
- **API Key Manager** (`AI: Manage API Keys`) — New command with show/hide toggle, copy, edit, and remove for all provider API keys
  - Shortcut: `Ctrl+Shift+G` → `Ctrl+Shift+K`
  - Masked key display (e.g., `gsk-••••...a3f2`) with reveal toggle
  - Quick actions: Copy to clipboard, Edit inline, Remove with confirmation
  - Direct links to get FREE API keys for unconfigured providers
- **Provider Status Check** (`AI: Check Provider Status`) — Test all configured API keys with a single command
  - Shows real-time latency for each provider
  - Friendly error messages (Invalid key, Rate limited, Timeout)
  - Summary of working vs failing providers
- **Commit Message History** (`AI: Commit History`) — Browse and reuse last 10 generated commit messages
  - Shortcut: `Ctrl+Shift+G` → `Ctrl+Shift+H`
  - Reuse options: Fill SCM input, Copy to clipboard, Open in editor
  - Shows provider name and relative timestamp for each entry
  - Clear history option with confirmation
- **Output Mode Setting** (`aiCommit.outputMode`) — Choose where generated commit messages go
  - `scm` — Fill Source Control input box (default, existing behavior)
  - `clipboard` — Copy to clipboard only
  - `editor` — Open in a new editor tab for review/editing
- **Status Bar Button** — `🔑 AI Keys` button in status bar for one-click access to Key Manager
- **SCM Panel Icons** — Key Manager (🔑) and History (📜) icons in Source Control panel header
- **Welcome Notification** — First-run onboarding with "Setup API Keys" button for new users

### 🔒 Security
- **SecretStorage Migration** — API keys moved from plain text settings to VS Code's encrypted SecretStorage
  - Existing keys are auto-migrated on first run
  - API key input fields removed from Settings UI
  - Keys can only be managed through the Key Manager command

### 🔄 Changed
- **Error Dialog**: "No API key" error now shows "Manage Keys" button alongside "Open Settings"
- **Commit Generation**: Messages are automatically saved to history after generation

**Full Changelog**: https://github.com/muhammadalifh/vscode-ai-commit/compare/v1.3.0...v1.4.0

---

## [1.3.0] - 2026-02-10

### ✨ Added
- **Smart Change Detection**: Interactive Quick Pick dialog when no staged changes found
  - `Stage All & Generate` — auto-stage all changes then generate commit message
  - `Use Unstaged Changes` — generate from unstaged changes without staging
  - `Cancel` — abort the operation
- **Multi-Repository Support**: Prompt user to select repository when multiple are open
- **`git add -A` Integration**: New `stageAllChanges()` service for auto-staging

### 🐛 Fixed
- **Null Safety**: Added response validation for Groq, Mistral, and Cohere providers (matching OpenRouter's pattern)
- **Silent Unstaged Fallback**: Replaced confusing silent fallback with explicit user choice dialog

### 🗑️ Removed
- **Gemini Provider**: Fully removed Google Gemini provider (was never registered in provider index)
  - Removed `gemini.ts`, Gemini config entries, and `GEMINI` enum value

**Full Changelog**: https://github.com/muhammadalifh/vscode-ai-commit/compare/v1.2.1...v1.3.0

---

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