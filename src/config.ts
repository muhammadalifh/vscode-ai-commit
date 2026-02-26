/**
 * Configuration Management
 * Reads from VSCode SecretStorage (API keys) and settings (preferences)
 * Environment variables are used as final fallback for API keys
 */
import * as vscode from 'vscode';

export interface Config {
  groqApiKey: string;
  groqModel: string;
  openrouterApiKey: string;
  openrouterModel: string;
  mistralApiKey: string;
  mistralModel: string;
  cohereApiKey: string;
  cohereModel: string;
  preferredProvider: 'auto' | 'random' | 'groq' | 'openrouter' | 'mistral' | 'cohere';
  commitStyle: 'conventional' | 'detailed' | 'simple';
  language: 'english' | 'indonesian';
  outputMode: 'clipboard' | 'scm' | 'editor';
}

// Secret key names used in SecretStorage
const SECRET_KEYS = ['groqApiKey', 'openrouterApiKey', 'mistralApiKey', 'cohereApiKey'] as const;
type SecretKeyName = typeof SECRET_KEYS[number];

// Module-level cache for secret keys (loaded async, read sync)
const secretKeyCache: Record<string, string> = {};
let _secrets: vscode.SecretStorage | undefined;

/**
 * Initialize SecretStorage and load keys into cache
 */
export async function initSecrets(context: vscode.ExtensionContext): Promise<void> {
  _secrets = context.secrets;
  
  for (const key of SECRET_KEYS) {
    const value = await _secrets.get(`aiCommit.${key}`);
    if (value) {
      secretKeyCache[key] = value;
    }
  }
}

/**
 * Migrate API keys from VS Code settings to SecretStorage
 * Clears the settings values after migration
 */
export async function migrateKeysFromSettings(): Promise<number> {
  if (!_secrets) { return 0; }
  
  const config = vscode.workspace.getConfiguration('aiCommit');
  let migrated = 0;
  
  for (const key of SECRET_KEYS) {
    const settingValue = (config.get<string>(key) || '').trim();
    const secretValue = secretKeyCache[key] || '';
    
    // Only migrate if settings has a value and secrets doesn't
    if (settingValue && !secretValue) {
      await _secrets.store(`aiCommit.${key}`, settingValue);
      secretKeyCache[key] = settingValue;
      
      // Clear the setting value
      await config.update(key, '', vscode.ConfigurationTarget.Global);
      migrated++;
    }
  }
  
  return migrated;
}

/**
 * Get a secret API key from cache
 */
export function getSecretKey(key: SecretKeyName): string {
  return secretKeyCache[key] || '';
}

/**
 * Store a secret API key
 */
export async function setSecretKey(key: SecretKeyName, value: string): Promise<void> {
  if (!_secrets) { return; }
  
  if (value) {
    await _secrets.store(`aiCommit.${key}`, value);
    secretKeyCache[key] = value;
  } else {
    await _secrets.delete(`aiCommit.${key}`);
    delete secretKeyCache[key];
  }
}

/**
 * Get configuration from VSCode settings + SecretStorage cache
 */
export function getConfig(): Config {
  const config = vscode.workspace.getConfiguration('aiCommit');
  
  return {
    // API keys: SecretStorage cache → settings fallback → env var fallback
    groqApiKey: (secretKeyCache['groqApiKey'] || config.get<string>('groqApiKey') || process.env.GROQ_API_KEY || '').trim(),
    groqModel: config.get<string>('groqModel') || 'llama-3.3-70b-versatile',
    openrouterApiKey: (secretKeyCache['openrouterApiKey'] || config.get<string>('openrouterApiKey') || process.env.OPENROUTER_API_KEY || '').trim(),
    openrouterModel: config.get<string>('openrouterModel') || 'arcee-ai/trinity-large-preview:free',
    mistralApiKey: (secretKeyCache['mistralApiKey'] || config.get<string>('mistralApiKey') || process.env.MISTRAL_API_KEY || '').trim(),
    mistralModel: config.get<string>('mistralModel') || 'codestral-latest',
    cohereApiKey: (secretKeyCache['cohereApiKey'] || config.get<string>('cohereApiKey') || process.env.COHERE_API_KEY || '').trim(),
    cohereModel: config.get<string>('cohereModel') || 'command-r-plus-08-2024',
    preferredProvider: config.get('preferredProvider') || 'auto',
    commitStyle: config.get('commitStyle') || 'conventional',
    language: config.get('language') || 'english',
    outputMode: config.get('outputMode') || 'scm'
  };
}

/**
 * Check if at least one provider is configured
 */
export function hasAnyProvider(): boolean {
  const config = getConfig();
  return !!(
    config.groqApiKey ||
    config.openrouterApiKey ||
    config.mistralApiKey ||
    config.cohereApiKey
  );
}
