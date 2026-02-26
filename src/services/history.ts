/**
 * Commit Message History
 * Stores and retrieves recent commit messages for reuse
 */
import * as vscode from 'vscode';

const HISTORY_KEY = 'aiCommit.commitHistory';
const MAX_HISTORY = 10;

interface HistoryEntry {
  message: string;
  provider: string;
  timestamp: number;
}

let _context: vscode.ExtensionContext | undefined;

/**
 * Initialize history service with extension context
 */
export function initHistory(context: vscode.ExtensionContext): void {
  _context = context;
}

/**
 * Save a commit message to history
 */
export async function saveToHistory(message: string, provider: string): Promise<void> {
  if (!_context) { return; }

  const history = getHistoryEntries();

  // Avoid duplicates (same message)
  const filtered = history.filter(h => h.message !== message);

  // Add new entry at the beginning
  filtered.unshift({
    message,
    provider,
    timestamp: Date.now()
  });

  // Keep only last N entries
  const trimmed = filtered.slice(0, MAX_HISTORY);

  await _context.globalState.update(HISTORY_KEY, trimmed);
}

/**
 * Get all history entries
 */
function getHistoryEntries(): HistoryEntry[] {
  if (!_context) { return []; }
  return _context.globalState.get<HistoryEntry[]>(HISTORY_KEY, []);
}

/**
 * Format a timestamp to a relative time string
 */
function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) { return 'just now'; }
  if (minutes < 60) { return `${minutes}m ago`; }
  if (hours < 24) { return `${hours}h ago`; }
  return `${days}d ago`;
}

/**
 * Show commit history QuickPick with reuse options
 */
export async function showHistoryPicker(): Promise<void> {
  const history = getHistoryEntries();

  if (history.length === 0) {
    vscode.window.showInformationMessage('No commit message history yet. Generate a commit message first!');
    return;
  }

  interface HistoryQuickPickItem extends vscode.QuickPickItem {
    entry?: HistoryEntry;
    action: 'use' | 'copy' | 'clear';
  }

  const items: HistoryQuickPickItem[] = history.map((entry, index) => {
    // Show first line as label, rest as detail
    const lines = entry.message.split('\n');
    const firstLine = lines[0];
    const hasBody = lines.length > 1;

    return {
      label: `${index + 1}. ${firstLine}`,
      description: `${entry.provider} — ${formatRelativeTime(entry.timestamp)}`,
      detail: hasBody ? lines.slice(1).join(' ').trim().substring(0, 100) : undefined,
      entry,
      action: 'use' as const
    };
  });

  // Add separator + clear option
  items.push({
    label: '',
    kind: vscode.QuickPickItemKind.Separator,
    action: 'clear'
  });

  items.push({
    label: '$(trash) Clear History',
    description: `Remove all ${history.length} entries`,
    action: 'clear'
  });

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: `${history.length} recent commit message(s)`,
    title: '📜 Commit Message History'
  });

  if (!selected) { return; }

  if (selected.action === 'clear') {
    const confirm = await vscode.window.showWarningMessage(
      'Clear all commit message history?',
      { modal: true },
      'Clear'
    );
    if (confirm === 'Clear' && _context) {
      await _context.globalState.update(HISTORY_KEY, []);
      vscode.window.showInformationMessage('Commit history cleared.');
    }
    return;
  }

  if (selected.entry) {
    // Ask what to do with the selected message
    const actionItems: (vscode.QuickPickItem & { action: string })[] = [
      {
        label: '$(git-commit) Fill SCM Input',
        description: 'Put this message in the Source Control input box',
        action: 'scm'
      },
      {
        label: '$(copy) Copy to Clipboard',
        description: 'Copy the full commit message',
        action: 'copy'
      },
      {
        label: '$(edit) Open in Editor',
        description: 'Open as a text document for editing',
        action: 'editor'
      }
    ];

    const actionChoice = await vscode.window.showQuickPick(actionItems, {
      placeHolder: 'What would you like to do with this message?',
      title: '📜 Reuse Commit Message'
    });

    if (!actionChoice) { return; }

    switch (actionChoice.action) {
      case 'scm': {
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (gitExtension) {
          const git = gitExtension.exports.getAPI(1);
          if (git.repositories.length > 0) {
            git.repositories[0].inputBox.value = selected.entry.message;
            vscode.window.showInformationMessage('Commit message filled in SCM input.');
          }
        }
        break;
      }
      case 'copy':
        await vscode.env.clipboard.writeText(selected.entry.message);
        vscode.window.showInformationMessage('Commit message copied to clipboard.');
        break;
      case 'editor': {
        const doc = await vscode.workspace.openTextDocument({
          content: selected.entry.message,
          language: 'plaintext'
        });
        await vscode.window.showTextDocument(doc);
        break;
      }
    }
  }
}
