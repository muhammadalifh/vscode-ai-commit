/**
 * Configuration Management
 * Reads from VSCode settings and environment variables
 */
import * as vscode from 'vscode';

export interface Config {
  groqApiKey: string;
  openrouterApiKey: string;
  geminiApiKey: string;
  mistralApiKey: string;
  cohereApiKey: string;
  preferredProvider: 'auto' | 'random' | 'groq' | 'openrouter' | 'gemini' | 'mistral' | 'cohere';
  commitStyle: 'conventional' | 'detailed' | 'simple';
  language: 'english' | 'indonesian';
}

/**
 * Get configuration from VSCode settings with environment variable fallback
 */
export function getConfig(): Config {
  const config = vscode.workspace.getConfiguration('aiCommit');
  
  return {
    groqApiKey: config.get('groqApiKey') || process.env.GROQ_API_KEY || '',
    openrouterApiKey: config.get('openrouterApiKey') || process.env.OPENROUTER_API_KEY || '',
    geminiApiKey: config.get('geminiApiKey') || process.env.GEMINI_API_KEY || '',
    mistralApiKey: config.get('mistralApiKey') || process.env.MISTRAL_API_KEY || '',
    cohereApiKey: config.get('cohereApiKey') || process.env.COHERE_API_KEY || '',
    preferredProvider: config.get('preferredProvider') || 'auto',
    commitStyle: config.get('commitStyle') || 'conventional',
    language: config.get('language') || 'english'
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
    config.geminiApiKey ||
    config.mistralApiKey ||
    config.cohereApiKey
  );
}
