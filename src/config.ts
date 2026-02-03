/**
 * Configuration Management
 * Reads from VSCode settings and environment variables
 */
import * as vscode from 'vscode';

export interface Config {
  groqApiKey: string;
  groqModel: string;
  openrouterApiKey: string;
  openrouterModel: string;
  geminiApiKey: string;
  geminiModel: string;
  mistralApiKey: string;
  mistralModel: string;
  cohereApiKey: string;
  cohereModel: string;
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
    groqApiKey: (config.get<string>('groqApiKey') || process.env.GROQ_API_KEY || '').trim(),
    groqModel: config.get<string>('groqModel') || 'llama-3.3-70b-versatile',
    openrouterApiKey: (config.get<string>('openrouterApiKey') || process.env.OPENROUTER_API_KEY || '').trim(),
    openrouterModel: config.get<string>('openrouterModel') || 'stepfun/step-3.5-flash:free',
    geminiApiKey: (config.get<string>('geminiApiKey') || process.env.GEMINI_API_KEY || '').trim(),
    geminiModel: config.get<string>('geminiModel') || 'gemini-1.5-flash',
    mistralApiKey: (config.get<string>('mistralApiKey') || process.env.MISTRAL_API_KEY || '').trim(),
    mistralModel: config.get<string>('mistralModel') || 'codestral-latest',
    cohereApiKey: (config.get<string>('cohereApiKey') || process.env.COHERE_API_KEY || '').trim(),
    cohereModel: config.get<string>('cohereModel') || 'command-r-plus-08-2024',
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
