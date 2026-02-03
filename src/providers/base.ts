/**
 * AI Provider Interface
 * All providers must implement this interface
 */

export interface AIProvider {
  /** Human-readable name of the provider */
  readonly name: string;
  
  /** Provider identifier */
  readonly id: string;
  
  /** Check if this provider is configured */
  isAvailable(): boolean;
  
  /**
   * Call the AI API
   * @param systemPrompt System instructions
   * @param userPrompt User message with diff context
   * @returns AI response text
   */
  call(systemPrompt: string, userPrompt: string): Promise<string>;
}

export enum ProviderType {
  GROQ = 'groq',
  OPENROUTER = 'openrouter',
  GEMINI = 'gemini',
  MISTRAL = 'mistral',
  COHERE = 'cohere'
}
