/**
 * OpenRouter AI Provider
 * Fallback 1 - LLaMA 3.1 70B via OpenRouter
 */
import axios from 'axios';
import { AIProvider, ProviderType } from './base';
import { getConfig } from '../config';

export class OpenRouterProvider implements AIProvider {
  get name(): string {
    return `OpenRouter (${getConfig().openrouterModel})`;
  }
  readonly id = ProviderType.OPENROUTER;
  
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  
  isAvailable(): boolean {
    return !!getConfig().openrouterApiKey;
  }
  
  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    const config = getConfig();
    const apiKey = config.openrouterApiKey;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }
    
    const response = await axios.post(
      this.API_URL,
      {
        model: config.openrouterModel,
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
          'HTTP-Referer': 'https://github.com/muhammadalifh/vscode-ai-commit',
          'X-Title': 'AI Commit Generator'
        },
        timeout: 30000
      }
    );
    
    const content = response.data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('OpenRouter response error:', JSON.stringify(response.data));
      throw new Error('OpenRouter returned empty content. Try a different model or check your API key.');
    }
    
    return content;
  }
}
