# Contributing to AI Commit Message Generator

Thank you for your interest in contributing! 🎉

## 🚀 How to Contribute

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/vscode-ai-commit.git
cd vscode-ai-commit
npm install
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow the existing code style
- Add tests if applicable
- Update documentation as needed

### 4. Test Your Changes

```bash
npm run compile
# Press F5 to test in Extension Development Host
```

### 5. Submit a Pull Request

- Provide a clear description of your changes
- Reference any related issues

## 📋 Guidelines

### Code Style

- Use TypeScript
- Follow existing patterns in the codebase
- Use meaningful variable and function names

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new provider support
fix: resolve rate limit handling
docs: update README examples
```

### Adding a New AI Provider

1. Create a new file in `src/providers/` (e.g., `newprovider.ts`)
2. Implement the `AIProvider` interface from `base.ts`
3. Register the provider in `src/providers/index.ts`
4. Add configuration settings in `package.json`
5. Update documentation

## 🐛 Reporting Bugs

Please open an issue with:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, VSCode version, etc.)

## 💡 Feature Requests

Open an issue with:

- Clear description of the feature
- Use case / why it would be useful
- Any implementation ideas (optional)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make this project better! ❤️
