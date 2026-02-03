/**
 * Prompt Builder
 * Constructs system and user prompts for commit message generation
 */
import { getConfig } from '../config';

/**
 * Build system prompt based on configuration
 */
export function buildSystemPrompt(): string {
  const config = getConfig();
  const isIndonesian = config.language === 'indonesian';
  
  let styleGuide = '';
  
  switch (config.commitStyle) {
    case 'conventional':
      styleGuide = `
You MUST use Conventional Commits format:
- feat: new feature
- fix: bug fix
- refactor: code refactoring
- docs: documentation
- style: formatting, missing semicolons, etc.
- test: adding tests
- chore: maintenance tasks
- perf: performance improvements

Format: <type>(<optional scope>): <description>

Example:
feat(auth): implement OAuth2 login flow

- Add Google OAuth provider integration
- Create session management middleware
- Update user model with provider fields
`;
      break;
      
    case 'detailed':
      styleGuide = `
Write a detailed commit message complying with the following structure:

1. **Subject Line**:
   - Limit to 50 characters.
   - Imperative mood ("Add" not "Added").
   - Clear and concise summary.

2. **Body**:
   - Leave one blank line after the subject.
   - Explain **WHAT** changed (high-level summary).
   - Explain **WHY** the change was necessary (context/problem).
   - Explain **HOW** it was addressed (technical details).
   - List specific side-effects, breaking changes, or migrations if any.
   - Use bullet points for readability.
   - Wrap lines at 72 characters.
`;
      break;
      
    case 'simple':
      styleGuide = `
Write a simple, clear commit message:
- One line, 50-72 characters
- Start with a verb (Add, Fix, Update, Remove, Refactor)
- Be specific about what changed
`;
      break;
  }
  
  const languageNote = isIndonesian 
    ? '\n\nIMPORTANT: Write the commit message in Bahasa Indonesia.'
    : '';
  
  return `You are an expert software developer who writes clear, concise, and meaningful git commit messages.

Your task is to analyze the provided git diff and generate an appropriate commit message.

${styleGuide}

Rules:
1. Be specific about what changed, not vague
2. Focus on the WHY, not just the WHAT
3. Keep the subject line under 72 characters
4. Use present tense ("Add feature" not "Added feature")
5. Don't include the diff in your response, only the commit message
6. If there are multiple unrelated changes, suggest splitting the commit
${languageNote}

Respond with ONLY the commit message, no explanations or markdown formatting.`;
}

/**
 * Build user prompt with diff context
 */
export function buildUserPrompt(
  diff: string,
  files: string[],
  techStack: string,
  stats: { additions: number; deletions: number }
): string {
  // Truncate diff if too long
  const maxDiffLength = 8000;
  let truncatedDiff = diff;
  
  if (diff.length > maxDiffLength) {
    truncatedDiff = diff.substring(0, maxDiffLength) + '\n\n... (diff truncated for brevity)';
  }
  
  return `## Context
- **Tech Stack:** ${techStack}
- **Files Changed:** ${files.length} file(s)
- **Changes:** +${stats.additions} additions, -${stats.deletions} deletions
- **Files:**
${files.map(f => `  - ${f}`).join('\n')}

## Git Diff
\`\`\`diff
${truncatedDiff}
\`\`\`

Based on the above diff, generate a commit message.`;
}
