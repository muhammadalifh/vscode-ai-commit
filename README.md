# 🤖 AI Commit Generator (Multi-Provider)

> **Stop wasting time writing commit messages.** Let AI analyze your code changes and generate clear, detailed, and professional commit messages in seconds.

![VSCode Extension](https://img.shields.io/badge/vscode-extension-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.1.0-brightgreen)

---

## 🤔 Why This Extension?

**The Problem:**
Writing good commit messages is tedious. Developers often resort to vague messages like "fix bug" or "update code" because crafting a proper description takes time and mental effort—especially after a long coding session.

**The Solution:**
This extension uses **AI** to read your actual code changes (`git diff`) and generate a **meaningful, descriptive commit message** that follows best practices. No more guessing, no more "WIP" commits.

---

## 🎯 Who Is This For?

- **Solo developers** who want cleaner git history without the effort.
- **Teams** that enforce commit message standards (like Conventional Commits).
- **Beginners** learning how to write proper commit messages.
- **Anyone** who values productivity over repetitive tasks.

---

## ✨ What Does It Do?

| Feature | Description |
|---------|-------------|
| 🔄 **Multi-Provider AI** | Uses 4 free AI providers (Groq, OpenRouter, Mistral, Cohere) with automatic fallback if one fails. |
| 📝 **Conventional Commits** | Generates messages in `feat:`, `fix:`, `docs:` format automatically. |
| 🌐 **Multi-Language** | Supports English and Indonesian output. |
| 🎯 **Smart Context** | Detects your tech stack (React, Python, etc.) to give relevant descriptions. |
| ⚡ **One-Click Operation** | Press a button or use a shortcut—done in 2 seconds. |
| 📋 **Flexible Output** | Copy to clipboard, auto-fill SCM input, or edit before using. |

---

## 🚀 How To Use

### Step 1: Install
Search **"AI Commit Generator"** in VSCode Extensions and click **Install**.

### Step 2: Get a FREE API Key
You need at least one API key (all are **FREE**):

| Provider | Get Key | Free Limit |
|----------|---------|------------|
| **Groq** (Recommended) | [console.groq.com](https://console.groq.com) | 30 requests/min |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai) | Free credits |
| **Mistral** | [console.mistral.ai](https://console.mistral.ai) | ~2000/day |
| **Cohere** | [dashboard.cohere.com](https://dashboard.cohere.com) | 1000/month |

### Step 3: Configure
1. Open VSCode Settings (`Ctrl + ,`)
2. Search **"AI Commit"**
3. Paste your API key in the appropriate field

### Step 4: Generate!
1. Make some code changes
2. Stage your files (`git add .`)
3. Click the **✨ sparkle icon** in Source Control panel
   - Or press `Ctrl+Shift+G` then `Ctrl+Shift+M`
   - Or open Command Palette → "AI: Generate Commit Message"
4. Done! Your commit message is ready.

---

## ⚙️ Configuration Options

| Setting | Options | Default |
|---------|---------|---------|
| **Preferred Provider** | `auto`, `groq`, `openrouter`, `mistral`, `cohere` | `auto` |
| **Commit Style** | `conventional`, `detailed`, `simple` | `conventional` |
| **Language** | `english`, `indonesian` | `english` |

### Commit Style Examples

**Conventional (Recommended):**
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

---

## 🔒 Privacy & Security

- ✅ **Your API keys are stored locally** on your machine.
- ✅ **Code diffs are sent directly** to the AI provider you choose.
- ✅ **The extension developer has NO access** to your keys or code.
- ✅ **Open source** — inspect the code yourself on [GitHub](https://github.com/muhammadalifh/vscode-ai-commit).

---

## 🛠️ For Developers

Want to contribute or run locally?

```bash
git clone https://github.com/muhammadalifh/vscode-ai-commit.git
cd vscode-ai-commit
npm install
npm run compile
# Press F5 to launch Extension Development Host
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

---

## 📝 License

MIT License — use it freely, even commercially.

---

## 🙏 Credits

Built with ❤️ by [Muhammad Alif H](https://github.com/muhammadalifh)

**Powered by:**
- [Groq](https://groq.com) — LLaMA 3.3 70B
- [OpenRouter](https://openrouter.ai) — Arcee Trinity Large
- [Mistral AI](https://mistral.ai) — Codestral
- [Cohere](https://cohere.com) — Command R+