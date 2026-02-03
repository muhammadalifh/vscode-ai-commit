/**
 * OpenRouter AI Provider
 * Fallback 1 - LLaMA 3.1 70B via OpenRouter
 */
import axios from 'axios';
import { AIProvider, ProviderType } from './base';
import { getConfig } from '../config';

export class OpenRouterProvider implements AIProvider {
  readonly name = 'OpenRouter LLaMA 3.1 70B';
  readonly id = ProviderType.OPENROUTER;
  
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly MODEL = 'meta-llama/llama-3.1-70b-instruct:free';
  
  isAvailable(): boolean {
    return !!getConfig().openrouterApiKey;
  }
  
  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = getConfig().openrouterApiKey;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }
    
    const response = await axios.post(
      this.API_URL,
      {
        model: this.MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/solveraid/ai-commit-generator',
          'X-Title': 'AI Commit Generator'
        },
        timeout: 30000
      }
    );
    
    return response.data.choices[0].message.content;
  }
}
