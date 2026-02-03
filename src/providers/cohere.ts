/**
 * Cohere AI Provider
 * Fallback 4 - Command-R+
 */
import axios from 'axios';
import { AIProvider, ProviderType } from './base';
import { getConfig } from '../config';

export class CohereProvider implements AIProvider {
  readonly name = 'Cohere Command-R+';
  readonly id = ProviderType.COHERE;
  
  private readonly API_URL = 'https://api.cohere.ai/v1/chat';
  private readonly MODEL = 'command-r-plus';
  
  isAvailable(): boolean {
    return !!getConfig().cohereApiKey;
  }
  
  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = getConfig().cohereApiKey;
    
    if (!apiKey) {
      throw new Error('Cohere API key not configured');
    }
    
    const response = await axios.post(
      this.API_URL,
      {
        model: this.MODEL,
        message: userPrompt,
        preamble: systemPrompt,
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
    
    return response.data.text;
  }
}
