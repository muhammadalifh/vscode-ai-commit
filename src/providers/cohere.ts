/**
 * Cohere AI Provider
 * Fallback 4 - Command-R+
 */
import axios from 'axios';
import { AIProvider, ProviderType } from './base';
import { getConfig } from '../config';

export class CohereProvider implements AIProvider {
  get name(): string {
    return `Cohere (${getConfig().cohereModel})`;
  }
  readonly id = ProviderType.COHERE;
  
  private readonly API_URL = 'https://api.cohere.ai/v2/chat';
  
  isAvailable(): boolean {
    return !!getConfig().cohereApiKey;
  }
  
  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    const config = getConfig();
    const apiKey = config.cohereApiKey;
    
    if (!apiKey) {
      throw new Error('Cohere API key not configured');
    }
    
    const response = await axios.post(
      this.API_URL,
      {
        model: config.cohereModel,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    return response.data.message.content[0].text;
  }
}
