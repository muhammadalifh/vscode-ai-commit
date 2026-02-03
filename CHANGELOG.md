# Changelog

All notable changes to the "AI Commit Message Generator" extension will be documented in this file.

## [1.1.0] - 2026-02-03

### Changed
- **Settings UI**: Split into "General" and "Providers" sections for better organization.
- **Dynamic Notifications**: Notifications now show specific provider and model names (e.g. `OpenRouter (arcee-ai/...)`).
- **OpenRouter**: Updated to use `arcee-ai/trinity-large-preview:free` as primary free model.
- **Fallback Order**: Updated priority to `Groq` -> `OpenRouter` -> `Mistral` -> `Cohere`.

### Removed
- **Gemini**: Temporarily disabled Google Gemini provider due to improved reliability focus.

## [1.0.0] - 2026-02-03

### Added
- Initial release
- 5 AI providers with automatic fallback (Groq, OpenRouter, Gemini, Mistral, Cohere)
- Conventional Commits format support
- Multi-language support (English, Indonesian)
- Smart tech stack detection
- Multiple output options (clipboard, SCM input, inline edit)
- Configurable commit styles (conventional, detailed, simple)
- Environment variable support for API keys
- Progress notification with cancellation support
