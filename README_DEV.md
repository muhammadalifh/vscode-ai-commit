# 🤖 AI Commit Message Generator — Developer Guide

Generate detailed, clear commit messages using AI with multi-provider fallback.

![VSCode Extension](https://img.shields.io/badge/vscode-extension-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.4.1-brightgreen)

## ✨ Features

- 🔄 **4 AI Providers** with automatic fallback (Groq → OpenRouter → Mistral → Cohere)
- 📝 **Conventional Commits** format support
- 🌐 **Multi-language** support (English & Indonesian)
- 🎯 **Smart Detection** of tech stack and change context
- ⚡ **One-click** commit message generation
- 📋 **Multiple Output Options** (SCM input box, clipboard, or editor)
- 🔑 **Secure Key Management** via Key Manager with show/hide, copy, edit
- 🩺 **Provider Status Check** to test API keys
- 📜 **Commit History** with reuse capability
- 🔒 **SecretStorage** for encrypted API key storage

## 🚀 Quick Start

### 1. Install the Extension

```bash
# From the vscode-ai-commit directory
npm install
npm run compile
```

Then press `F5` to open Extension Development Host.

### 2. Configure API Keys

Use the **Key Manager** (click `🔑 AI Keys` in status bar or run `AI: Manage API Keys`):

| Provider | Free Tier | Get Key |
|----------|-----------|---------|
| **Groq** | 30 RPM | [console.groq.com](https://console.groq.com) |
| **OpenRouter** | Free credits | [openrouter.ai](https://openrouter.ai) |
| **Mistral** | ~2000/day | [console.mistral.ai](https://console.mistral.ai) |
| **Cohere** | 1000/month | [dashboard.cohere.com](https://dashboard.cohere.com) |

Or set environment variables:
```bash
GROQ_API_KEY=your_key
OPENROUTER_API_KEY=your_key
MISTRAL_API_KEY=your_key
COHERE_API_KEY=your_key
```

### 3. Generate Commit Message

1. Stage your changes with `git add`
2. Click the **✨ sparkle icon** in Source Control panel
3. Choose what to do with the generated message (based on Output Mode setting)

**Keyboard Shortcut:** `Ctrl+Shift+G` → `Ctrl+Shift+M`

## ⚙️ Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `aiCommit.preferredProvider` | enum | `auto` | Preferred provider or auto-fallback |
| `aiCommit.commitStyle` | enum | `conventional` | `conventional`, `detailed`, or `simple` |
| `aiCommit.language` | enum | `english` | `english` or `indonesian` |
| `aiCommit.outputMode` | enum | `scm` | `scm`, `clipboard`, or `editor` |

## 📁 Project Structure

```
vscode-ai-commit/
├── src/
│   ├── extension.ts          # Entry point, command registration
│   ├── config.ts             # Configuration + SecretStorage management
│   ├── providers/
│   │   ├── base.ts           # Provider interface & enum
│   │   ├── groq.ts           # Groq LLaMA provider
│   │   ├── openrouter.ts     # OpenRouter provider
│   │   ├── mistral.ts        # Mistral AI provider
│   │   ├── cohere.ts         # Cohere Command-R+ provider
│   │   └── index.ts          # Fallback orchestrator
│   ├── services/
│   │   ├── git.ts            # Git operations (diff, stage, etc.)
│   │   ├── prompt.ts         # AI prompt builder
│   │   ├── keyManager.ts     # API key management UI
│   │   ├── statusCheck.ts    # Provider health check
│   │   └── history.ts        # Commit message history
│   └── test/
│       ├── runTest.ts
│       └── suite/
│           ├── index.ts
│           └── prompt.test.ts
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript config
├── CHANGELOG.md
├── CONTRIBUTING.md
├── PUBLISHING.md
└── README.md
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Run in Extension Development Host
F5

# Build .vsix package
npx @vscode/vsce package
```

## 📝 License

MIT License - see [LICENSE](./LICENSE)

## 🙏 Credits

Built with ❤️ by [Muhammad Alif H](https://github.com/muhammadalifh)

AI Providers:
- [Groq](https://groq.com) - LLaMA 3.3 70B
- [OpenRouter](https://openrouter.ai) - Arcee Trinity Large
- [Mistral AI](https://mistral.ai) - Codestral
- [Cohere](https://cohere.com) - Command-R+
