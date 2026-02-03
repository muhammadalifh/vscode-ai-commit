# 🤖 AI Commit Message Generator

Generate detailed, clear commit messages using AI with multi-provider fallback.

![VSCode Extension](https://img.shields.io/badge/vscode-extension-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🔄 **5 AI Providers** with automatic fallback (Groq → OpenRouter → Gemini → Mistral → Cohere)
- 📝 **Conventional Commits** format support
- 🌐 **Multi-language** support (English & Indonesian)
- 🎯 **Smart Detection** of tech stack and change context
- ⚡ **One-click** commit message generation
- 📋 **Multiple Output Options** (clipboard, SCM input box, or edit inline)

## 🚀 Quick Start

### 1. Install the Extension

```bash
# From the vscode-ai-commit directory
npm install
npm run compile
```

Then press `F5` to open Extension Development Host.

### 2. Configure API Keys

Open VSCode Settings (`Ctrl+,`) and search for "AI Commit". Set at least one API key:

| Provider | Setting | Free Tier |
|----------|---------|-----------|
| **Groq** | `aiCommit.groqApiKey` | 30 RPM |
| **OpenRouter** | `aiCommit.openrouterApiKey` | Free credits |
| **Gemini** | `aiCommit.geminiApiKey` | 15 RPM |
| **Mistral** | `aiCommit.mistralApiKey` | ~2000/day |
| **Cohere** | `aiCommit.cohereApiKey` | 1000/month |

Or set environment variables:
```bash
GROQ_API_KEY=your_key
GEMINI_API_KEY=your_key
# ... etc
```

### 3. Generate Commit Message

1. Stage your changes with `git add`
2. Open Command Palette (`Ctrl+Shift+P`)
3. Run "**AI: Generate Commit Message**"
4. Choose what to do with the generated message:
   - **Copy to Clipboard** - paste it yourself
   - **Use in SCM Input** - auto-fill the Source Control input box
   - **Edit...** - modify before using

**Keyboard Shortcut:** `Ctrl+Shift+G Ctrl+Shift+M`

## ⚙️ Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `aiCommit.preferredProvider` | enum | `auto` | Preferred provider or auto-fallback |
| `aiCommit.commitStyle` | enum | `conventional` | `conventional`, `detailed`, or `simple` |
| `aiCommit.language` | enum | `english` | `english` or `indonesian` |

### Commit Styles

**Conventional (recommended):**
```
feat(auth): implement OAuth2 login flow

- Add Google OAuth provider integration
- Create session management middleware
```

**Detailed:**
```
Implement OAuth2 login flow with Google provider

This commit adds complete OAuth2 authentication support including
session management and user model updates for external providers.
```

**Simple:**
```
Add OAuth2 login with Google provider
```

## 📁 Project Structure

```
vscode-ai-commit/
├── src/
│   ├── extension.ts        # Entry point
│   ├── config.ts           # Configuration management
│   ├── providers/
│   │   ├── base.ts         # Provider interface
│   │   ├── groq.ts         # Groq LLaMA provider
│   │   ├── gemini.ts       # Google Gemini
│   │   ├── openrouter.ts   # OpenRouter
│   │   ├── mistral.ts      # Mistral AI
│   │   ├── cohere.ts       # Cohere Command-R+
│   │   └── index.ts        # Fallback orchestrator
│   └── services/
│       ├── git.ts          # Git operations
│       └── prompt.ts       # Prompt builder
├── package.json
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
```

## 📝 License

MIT License - see [LICENSE](./LICENSE)

## 🙏 Credits

Built with ❤️ by [SolverAID](https://gitlab.com/solveraid)

AI Providers:
- [Groq](https://groq.com) - LLaMA 3.3 70B
- [OpenRouter](https://openrouter.ai) - Multi-model routing
- [Google AI](https://ai.google.dev) - Gemini Flash
- [Mistral AI](https://mistral.ai) - Mistral Large
- [Cohere](https://cohere.com) - Command-R+
