/**
 * Mistral AI Provider
 * Fallback 3 - Mistral Large
 */
import axios from 'axios';
import { AIProvider, ProviderType } from './base';
import { getConfig } from '../config';

export class MistralProvider implements AIProvider {
  get name(): string {
    return `Mistral (${getConfig().mistralModel})`;
  }
  readonly id = ProviderType.MISTRAL;
  
  private readonly API_URL = 'https://api.mistral.ai/v1/chat/completions';
  
  isAvailable(): boolean {
    return !!getConfig().mistralApiKey;
  }
  
  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    const config = getConfig();
    const apiKey = config.mistralApiKey;
    
    if (!apiKey) {
      throw new Error('Mistral API key not configured');
    }
    
    const response = await axios.post(
      this.API_URL,
      {
        model: config.mistralModel,
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
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    return response.data.choices[0].message.content;
  }
}
