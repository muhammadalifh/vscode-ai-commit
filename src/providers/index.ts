/**
 * AI Provider Orchestrator
 * Manages provider fallback mechanism
 */
import { AIProvider, ProviderType } from './base';
import { GroqProvider } from './groq';
import { OpenRouterProvider } from './openrouter';
import { GeminiProvider } from './gemini';
import { MistralProvider } from './mistral';
import { CohereProvider } from './cohere';
import { getConfig } from '../config';

// Provider instances (singleton pattern)
const providers = new Map<ProviderType, AIProvider>();
providers.set(ProviderType.GROQ, new GroqProvider());
providers.set(ProviderType.OPENROUTER, new OpenRouterProvider());

providers.set(ProviderType.MISTRAL, new MistralProvider());
providers.set(ProviderType.COHERE, new CohereProvider());

// Default fallback order
const FALLBACK_ORDER: ProviderType[] = [
  ProviderType.GROQ,
  ProviderType.OPENROUTER,
  ProviderType.MISTRAL,
  ProviderType.COHERE
];


/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Get list of available providers based on configured API keys
 */
export function getAvailableProviders(): AIProvider[] {
  const config = getConfig();
  let available: AIProvider[] = [];
  
  // 1. Collect ALL available providers first
  const allEnabledProviders: AIProvider[] = [];
  for (const type of FALLBACK_ORDER) {
     const provider = providers.get(type);
     if (provider?.isAvailable()) {
       allEnabledProviders.push(provider);
     }
  }

  // 2. Apply strategy
  if (config.preferredProvider === 'random') {
    // Randomize order
    available = shuffleArray(allEnabledProviders);
  } else if (config.preferredProvider !== 'auto') {
    // Specific provider first
    const preferred = providers.get(config.preferredProvider as ProviderType);
    if (preferred?.isAvailable()) {
      available.push(preferred);
      // Add others as fallback
      available.push(...allEnabledProviders.filter(p => p !== preferred));
    } else {
      // If preferred not available, fallback to default order
      available = allEnabledProviders;
    }
  } else {
    // Default 'auto' priority
    available = allEnabledProviders;
  }
  
  return available;
}

export interface CallResult {
  response: string;
  provider: AIProvider;
}

/**
 * Call AI with automatic fallback mechanism
 * Tries each provider in order until one succeeds
 */
export async function callWithFallback(
  systemPrompt: string,
  userPrompt: string,
  onProgress?: (message: string) => void
): Promise<CallResult> {
  const availableProviders = getAvailableProviders();
  
  if (availableProviders.length === 0) {
    throw new Error(
      'No AI providers configured. Please set at least one API key in settings or environment variables.'
    );
  }
  
  let lastError: Error | null = null;
  
  for (const provider of availableProviders) {
    try {
      onProgress?.(`Trying ${provider.name}...`);
      
      const response = await provider.call(systemPrompt, userPrompt);
      
      onProgress?.(`${provider.name} succeeded!`);
      
      return { response, provider };
      
    } catch (error) {
      lastError = error as Error;
      const errorMsg = lastError.message;
      
      // Check for rate limit
      if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('rate')) {
        onProgress?.(`${provider.name} rate limited, trying next...`);
      } else {
        onProgress?.(`${provider.name} failed, trying next...`);
      }
      
      continue;
    }
  }
  
  throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
}

export { AIProvider, ProviderType };
