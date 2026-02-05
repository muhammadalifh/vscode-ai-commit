# 🤖 AI Commit Generator (Multi-Provider)

> **Stop wasting time writing commit messages.** Let AI analyze your code changes and generate clear, detailed, and professional commit messages in seconds.

![VSCode Extension](https://img.shields.io/badge/vscode-extension-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.2.0-brightgreen)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/muhammadalifh.vscode-ai-commit-gen)
![Rating](https://img.shields.io/visual-studio-marketplace/r/muhammadalifh.vscode-ai-commit-gen)

---

## 🤔 Why This Extension?

**The Problem:**
Writing good commit messages is tedious. Developers often resort to vague messages like "fix bug" or "update code" because crafting a proper description takes time and mental effort—especially after a long coding session.

**The Solution:**
This extension uses **AI** to read your actual code changes (`git diff`) and generate a **meaningful, descriptive commit message** that follows best practices. No more guessing, no more "WIP" commits.

---

## 🎯 Who Is This For?

- 👨‍💻 **Solo developers** who want cleaner git history without the effort
- 👥 **Teams** that enforce commit message standards (like Conventional Commits)
- 🎓 **Beginners** learning how to write proper commit messages
- ⚡ **Anyone** who values productivity over repetitive tasks

---

## ✨ What Does It Do?

| Feature | Description |
|---------|-------------|
| 🔄 **Multi-Provider AI** | Uses 4 free AI providers (Groq, OpenRouter, Mistral, Cohere) with automatic fallback if one fails |
| 📝 **Conventional Commits** | Generates messages in `feat:`, `fix:`, `docs:` format automatically |
| 🌐 **Multi-Language** | Supports English and Indonesian output |
| 🎯 **Smart Context** | Detects your tech stack (React, Python, etc.) to give relevant descriptions |
| ⚡ **One-Click Operation** | Press a button or use a shortcut—done in 2 seconds |
| 📋 **Flexible Output** | Copy to clipboard, auto-fill SCM input, or edit before using |
| 🚀 **Performance Optimized** | Fast models with 78-91 tok/s throughput |

---

## 🚀 Quick Start

### 1️⃣ Install
Search **"AI Commit Generator"** in VSCode Extensions and click **Install**.

### 2️⃣ Get a FREE API Key
You need at least one API key (all are **FREE**):

| Provider | Speed | Get Key | Free Limit | Recommended? |
|----------|-------|---------|------------|--------------|
| **Groq** | ⚡⚡⚡ | [console.groq.com](https://console.groq.com) | 30 req/min | ✅ **Best** |
| **OpenRouter** | ⚡⚡ | [openrouter.ai](https://openrouter.ai) | Free credits | ✅ Good |
| **Mistral** | ⚡⚡ | [console.mistral.ai](https://console.mistral.ai) | ~2000/day | ✅ Good |
| **Cohere** | ⚡ | [dashboard.cohere.com](https://dashboard.cohere.com) | 1000/month | ⚠️ Fallback |

> 💡 **Pro Tip:** Add multiple API keys for better reliability!

### 3️⃣ Configure
1. Open VSCode Settings (`Ctrl + ,` / `Cmd + ,`)
2. Search **"AI Commit"**
3. Paste your API key(s) in the appropriate field(s)

### 4️⃣ Generate!
1. Make some code changes
2. Stage your files (`git add .`)
3. Click the **✨ sparkle icon** in Source Control panel
   - Or press `Ctrl+Shift+G` then `Ctrl+Shift+M`
   - Or open Command Palette (`Ctrl+Shift+P`) → **"AI: Generate Commit Message"**
4. Done! Your commit message is ready 🎉

---

## ⚙️ Configuration

### General Settings

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| **Preferred Provider** | `auto`, `groq`, `openrouter`, `mistral`, `cohere` | `auto` | Choose AI provider (auto = smart fallback) |
| **Commit Style** | `conventional`, `detailed`, `simple` | `conventional` | Message format style |
| **Language** | `english`, `indonesian` | `english` | Output language |
| **Output Mode** | `clipboard`, `scm`, `editor` | `clipboard` | Where to put the message |

### Provider-Specific Settings

Each provider has dedicated settings for:
- 🔑 API Key
- 🤖 Model Selection
- 🌐 API Base URL (optional)

#### Available Models (as of v1.2.0)

**Groq:**
- `llama-3.3-70b-versatile` ⚡ (Recommended - Balanced)
- `llama-3.3-70b-specdec` 🚀 (Ultra Fast - Speculative Decoding)

**OpenRouter:**
- `arcee-ai/trinity-large-preview:free` 🎯 (Best Free)
- `arcee-ai/trinity-mini-preview:free` ⚡ (Fastest - 2.8s latency)

**Mistral:**
- `codestral-latest` 💻 (Best for Code)
- `ministral-8b-latest` 🪶 (Lightweight - 91.5 tok/s)
- `open-mistral-nemo` 🔓 (Open Source - 78.6 tok/s)

**Cohere:**
- `command-r-plus` 🧠 (Most Capable)
- `command-r` ⚖️ (Balanced)
- `command-r7b-12-2024` 🚀 (Fastest - 88.8 tok/s)

---

## 📝 Commit Style Examples

### 🎯 Conventional (Recommended)
```
feat(auth): implement OAuth2 login flow

- Add Google OAuth provider integration
- Create session management middleware
- Update user model to support external auth
```

### 📄 Detailed
```
Implement OAuth2 login flow with Google provider

This commit adds complete OAuth2 authentication support including
session management and user model updates for external providers.

Changes include:
- Google OAuth2 integration
- Session middleware
- User model extensions
```

### ⚡ Simple
```
Add OAuth2 login with Google provider
```

---

## 🔒 Privacy & Security

- ✅ **Your API keys are stored locally** on your machine (in VSCode settings)
- ✅ **Code diffs are sent directly** to the AI provider you choose
- ✅ **The extension developer has NO access** to your keys or code
- ✅ **Open source** — inspect the code yourself on [GitHub](https://github.com/muhammadalifh/vscode-ai-commit)
- ✅ **No telemetry or tracking** — your privacy is respected

---

## 🐛 Troubleshooting

### ❌ "No API key configured"
**Solution:** Add at least one API key in VSCode Settings → search "AI Commit"

### ❌ "Failed to generate commit message"
**Solutions:**
1. Check if you have staged changes (`git add .`)
2. Verify your API key is valid
3. Try a different provider (set Preferred Provider to another option)
4. Check internet connection

### ❌ Rate limit errors
**Solution:** The extension will automatically try the next provider. Consider adding multiple API keys for better reliability.

### ⚠️ Slow generation
**Solutions:**
1. Use faster models (e.g., Groq's `llama-3.3-70b-specdec`)
2. Switch to lightweight models (e.g., Mistral's `ministral-8b-latest`)
3. Check your internet speed

---

## 🛠️ For Developers

Want to contribute or run locally?

```bash
# Clone repository
git clone https://github.com/muhammadalifh/vscode-ai-commit.git
cd vscode-ai-commit

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Launch Extension Development Host
# Press F5 in VSCode
```

### Project Structure
```
vscode-ai-commit/
├── src/
│   ├── extension.ts          # Main entry point
│   ├── providers/             # AI provider implementations
│   ├── services/              # Core services
│   └── utils/                 # Helper functions
├── package.json              # Extension manifest
└── tsconfig.json             # TypeScript config
```

### Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📊 Performance Benchmarks

| Provider | Model | Speed | Latency | Quality |
|----------|-------|-------|---------|---------|
| Groq | llama-3.3-70b-specdec | ⚡⚡⚡ | ~1.5s | ⭐⭐⭐⭐⭐ |
| OpenRouter | trinity-mini | ⚡⚡⚡ | ~2.8s | ⭐⭐⭐⭐ |
| Mistral | ministral-8b | ⚡⚡ | ~3.2s | ⭐⭐⭐⭐ |
| Cohere | command-r7b | ⚡ | ~4.1s | ⭐⭐⭐ |

*Benchmarks based on average response time for 200-line diffs*

---

## 🔄 Changelog

See [CHANGELOG.md](./changelog.md) for version history.

---

## 📝 License

MIT License — use it freely, even commercially.

See [LICENSE](./LICENSE.txt) for full text.

---

## 🙏 Credits & Acknowledgments

Built with ❤️ by [Muhammad Alif H](https://github.com/muhammadalifh)

### Powered By:
- [Groq](https://groq.com) — Lightning-fast LLaMA 3.3 70B inference
- [OpenRouter](https://openrouter.ai) — Unified API for multiple models
- [Mistral AI](https://mistral.ai) — Open-source excellence
- [Cohere](https://cohere.com) — Enterprise-grade language models

### Special Thanks:
- VSCode Extension API team
- The open-source community
- All contributors and users

---

## 💬 Support & Feedback

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/muhammadalifh/vscode-ai-commit/issues)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/muhammadalifh/vscode-ai-commit/discussions)
- ⭐ **Like it?** Star the repo and leave a review!
- 📧 **Contact:** [Your Email]

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=muhammadalifh/vscode-ai-commit&type=Date)](https://star-history.com/#muhammadalifh/vscode-ai-commit&Date)

---

**Made with 💻 and ☕ by developers, for developers.**