/**
 * API Key Manager
 * Provides show/hide toggle, copy, edit, and remove functionality for API keys
 * Uses VS Code SecretStorage for secure key management
 */
import * as vscode from 'vscode';
import { getConfig, getSecretKey, setSecretKey } from '../config';

type SecretKeyName = 'groqApiKey' | 'openrouterApiKey' | 'mistralApiKey' | 'cohereApiKey';

interface ProviderKeyInfo {
  label: string;
  secretKey: SecretKeyName;
  configKey: string;
  envVar: string;
  getKeyLink: string;
}

const PROVIDERS: ProviderKeyInfo[] = [
  {
    label: 'Groq',
    secretKey: 'groqApiKey',
    configKey: 'groqApiKey',
    envVar: 'GROQ_API_KEY',
    getKeyLink: 'https://console.groq.com'
  },
  {
    label: 'OpenRouter',
    secretKey: 'openrouterApiKey',
    configKey: 'openrouterApiKey',
    envVar: 'OPENROUTER_API_KEY',
    getKeyLink: 'https://openrouter.ai'
  },
  {
    label: 'Mistral',
    secretKey: 'mistralApiKey',
    configKey: 'mistralApiKey',
    envVar: 'MISTRAL_API_KEY',
    getKeyLink: 'https://console.mistral.ai'
  },
  {
    label: 'Cohere',
    secretKey: 'cohereApiKey',
    configKey: 'cohereApiKey',
    envVar: 'COHERE_API_KEY',
    getKeyLink: 'https://dashboard.cohere.com'
  }
];

/**
 * Mask an API key showing only first 4 and last 4 characters
 */
function maskApiKey(key: string): string {
  if (!key) { return '(not set)'; }
  if (key.length <= 8) { return '****'; }
  return `${key.substring(0, 4)}${'•'.repeat(Math.min(key.length - 8, 20))}${key.substring(key.length - 4)}`;
}

/**
 * Get the API key value for a provider (from SecretStorage or config fallback)
 */
function getApiKey(provider: ProviderKeyInfo): string {
  const config = getConfig();
  switch (provider.secretKey) {
    case 'groqApiKey': return config.groqApiKey;
    case 'openrouterApiKey': return config.openrouterApiKey;
    case 'mistralApiKey': return config.mistralApiKey;
    case 'cohereApiKey': return config.cohereApiKey;
    default: return '';
  }
}

/**
 * Show the API Key Manager QuickPick
 */
export async function showKeyManager(): Promise<void> {
  // Track which keys are currently "revealed"
  const revealedKeys = new Set<string>();

  const showProviderList = async () => {
    const items: (vscode.QuickPickItem & { providerIndex?: number })[] = PROVIDERS.map((provider, index) => {
      const key = getApiKey(provider);
      const isRevealed = revealedKeys.has(provider.secretKey);
      const hasKey = !!key;

      let description: string;
      if (!hasKey) {
        description = '$(key) Not configured';
      } else if (isRevealed) {
        description = `$(eye) ${key}`;
      } else {
        description = `$(eye-closed) ${maskApiKey(key)}`;
      }

      return {
        label: `${hasKey ? '$(pass-filled)' : '$(circle-large-outline)'} ${provider.label}`,
        description,
        detail: hasKey ? '🔒 Stored securely • Click to manage' : `Get your FREE key at ${provider.getKeyLink}`,
        providerIndex: index
      };
    });

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a provider to manage its API key',
      title: '🔑 API Key Manager (Secure Storage)'
    });

    if (!selected || selected.providerIndex === undefined) { return; }

    await showProviderActions(PROVIDERS[selected.providerIndex], revealedKeys);
    // Loop back to provider list
    await showProviderList();
  };

  await showProviderList();
}

/**
 * Show actions for a specific provider
 */
async function showProviderActions(
  provider: ProviderKeyInfo,
  revealedKeys: Set<string>
): Promise<void> {
  const key = getApiKey(provider);
  const hasKey = !!key;
  const isRevealed = revealedKeys.has(provider.secretKey);

  interface ActionItem extends vscode.QuickPickItem {
    action: string;
  }

  const actions: ActionItem[] = [];

  if (hasKey) {
    // Toggle show/hide
    actions.push({
      label: isRevealed ? '$(eye-closed) Hide API Key' : '$(eye) Show API Key',
      description: isRevealed ? 'Mask the key again' : 'Reveal the full key',
      action: 'toggle'
    });

    // Copy
    actions.push({
      label: '$(copy) Copy API Key',
      description: 'Copy to clipboard',
      action: 'copy'
    });

    // Edit
    actions.push({
      label: '$(edit) Edit API Key',
      description: 'Replace with a new key',
      action: 'edit'
    });

    // Remove
    actions.push({
      label: '$(trash) Remove API Key',
      description: 'Delete this key from secure storage',
      action: 'remove'
    });
  } else {
    // Set new key
    actions.push({
      label: '$(add) Set API Key',
      description: 'Add a new API key (stored securely)',
      action: 'edit'
    });

    // Open link to get key
    actions.push({
      label: '$(link-external) Get FREE API Key',
      description: `Open ${provider.getKeyLink}`,
      action: 'open-link'
    });
  }

  // Back
  actions.push({
    label: '$(arrow-left) Back',
    description: 'Return to provider list',
    action: 'back'
  });

  const keyDisplay = hasKey
    ? (isRevealed ? key : maskApiKey(key))
    : 'Not configured';

  const selected = await vscode.window.showQuickPick(actions, {
    placeHolder: `${provider.label} — ${keyDisplay}`,
    title: `🔑 ${provider.label} API Key`
  });

  if (!selected || selected.action === 'back') { return; }

  switch (selected.action) {
    case 'toggle':
      if (isRevealed) {
        revealedKeys.delete(provider.secretKey);
      } else {
        revealedKeys.add(provider.secretKey);
      }
      // Show actions again with updated state
      await showProviderActions(provider, revealedKeys);
      break;

    case 'copy':
      await vscode.env.clipboard.writeText(key);
      vscode.window.showInformationMessage(`$(check) ${provider.label} API key copied to clipboard.`);
      break;

    case 'edit': {
      const newKey = await vscode.window.showInputBox({
        prompt: `Enter your ${provider.label} API key`,
        placeHolder: 'Paste your API key here...',
        password: true,
        value: hasKey ? key : '',
        ignoreFocusOut: true
      });

      if (newKey !== undefined) {
        await setSecretKey(provider.secretKey, newKey.trim());
        vscode.window.showInformationMessage(
          newKey.trim()
            ? `$(check) ${provider.label} API key saved securely.`
            : `$(check) ${provider.label} API key cleared.`
        );
      }
      break;
    }

    case 'remove': {
      const confirm = await vscode.window.showWarningMessage(
        `Remove ${provider.label} API key from secure storage?`,
        { modal: true },
        'Remove'
      );
      if (confirm === 'Remove') {
        await setSecretKey(provider.secretKey, '');
        revealedKeys.delete(provider.secretKey);
        vscode.window.showInformationMessage(`$(check) ${provider.label} API key removed.`);
      }
      break;
    }

    case 'open-link':
      vscode.env.openExternal(vscode.Uri.parse(provider.getKeyLink));
      break;
  }
}
