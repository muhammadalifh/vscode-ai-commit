/**
 * Google Gemini AI Provider
 * Fallback 2 - Gemini Flash
 */
import axios from 'axios';
import { AIProvider, ProviderType } from './base';
import { getConfig } from '../config';

export class GeminiProvider implements AIProvider {
  readonly name = 'Google Gemini Flash';
  readonly id = ProviderType.GEMINI;

  private getApiUrl(model: string): string {
    const apiKey = getConfig().geminiApiKey;
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  }
  
  isAvailable(): boolean {
    return !!getConfig().geminiApiKey;
  }
  
  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    const config = getConfig();
    const apiKey = config.geminiApiKey;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }
    
    const response = await axios.post(
      this.getApiUrl(config.geminiModel),
      {
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    return response.data.candidates[0].content.parts[0].text;
  }
}
