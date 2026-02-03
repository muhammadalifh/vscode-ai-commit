/**
 * Groq AI Provider
 * Primary provider using LLaMA 3.3 70B
 */
import axios from 'axios';
import { AIProvider, ProviderType } from './base';
import { getConfig } from '../config';

export class GroqProvider implements AIProvider {
  readonly name = 'Groq LLaMA 3.3 70B';
  readonly id = ProviderType.GROQ;
  
  private readonly API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly MODEL = 'llama-3.3-70b-versatile';
  
  isAvailable(): boolean {
    return !!getConfig().groqApiKey;
  }
  
  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = getConfig().groqApiKey;
    
    if (!apiKey) {
      throw new Error('Groq API key not configured');
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
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    return response.data.choices[0].message.content;
  }
}
