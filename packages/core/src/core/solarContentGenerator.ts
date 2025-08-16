/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Content,
  CountTokensParameters,
  CountTokensResponse,
  EmbedContentParameters,
  EmbedContentResponse,
  GenerateContentParameters,
  GenerateContentResponse,
  Part,
  FinishReason,
  ContentListUnion,
} from '@google/genai';
import { ContentGenerator } from './contentGenerator.js';
import { SolarConfig, SolarRequestParams, SolarResponse } from '../types/solarTypes.js';

/**
 * ContentGenerator implementation for Solar Pro2 API
 * Uses OpenAI-compatible API endpoint: https://api.upstage.ai/v1/solar/chat/completions
 */
export class SolarContentGenerator implements ContentGenerator {
  private readonly config: SolarConfig;
  private readonly baseUrl: string;

  constructor(config: SolarConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.upstage.ai/v1/solar';
  }

  async generateContent(
    req: GenerateContentParameters,
    _userPromptId: string,
  ): Promise<GenerateContentResponse> {
    const solarRequest = this.convertToSolarRequest(req, false);
    
    try {
      const response = await this.makeApiCall(solarRequest);
      return this.convertFromSolarResponse(response);
    } catch (error) {
      throw new Error(`Solar API error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async generateContentStream(
    req: GenerateContentParameters,
    _userPromptId: string,
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    const solarRequest = this.convertToSolarRequest(req, true);
    
    try {
      const stream = await this.makeStreamingApiCall(solarRequest);
      return this.convertStreamFromSolarResponse(stream);
    } catch (error) {
      throw new Error(`Solar streaming API error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async countTokens(req: CountTokensParameters): Promise<CountTokensResponse> {
    // Solar API doesn't have a separate token counting endpoint
    // We'll estimate tokens based on content length (rough approximation: ~4 chars per token)
    const totalTokens = this.estimateTokens(req.contents);
    
    return {
      totalTokens,
    };
  }

  async embedContent(
    _req: EmbedContentParameters,
  ): Promise<EmbedContentResponse> {
    throw new Error('Solar API does not support embedContent operation');
  }

  private convertToSolarRequest(req: GenerateContentParameters, stream: boolean): SolarRequestParams {
    const messages = this.convertContentsToMessages(req.contents);
    
    // Handle JSON schema requests - Solar API doesn't support responseSchema directly
    // So we need to modify the prompt to request JSON format
    if (req.config?.responseSchema || req.config?.responseMimeType === 'application/json') {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        // Add JSON format instruction to the last user message
        lastMessage.content += '\n\nPlease respond with a valid JSON object only. Do not include any text before or after the JSON. The response should be parseable by JSON.parse().';
      }
    }
    
    // Use the model from config instead of request to ensure correct Solar model
    return {
      model: this.config.model,
      messages,
      max_tokens: this.config.maxTokens,
      temperature: req.config?.temperature,
      stream,
    };
  }

  private convertContentsToMessages(contents: ContentListUnion): Array<{ role: 'user' | 'assistant' | 'system'; content: string; }> {
    // Handle ContentListUnion - convert to Content[]
    const contentArray = this.normalizeContents(contents);
    
    return contentArray.map(content => {
      const role = content.role === 'model' ? 'assistant' : (content.role as 'user' | 'system');
      const contentText = this.extractTextFromParts(content.parts || []);
      
      return {
        role,
        content: contentText,
      };
    });
  }

  private normalizeContents(contents: ContentListUnion): Content[] {
    if (typeof contents === 'string') {
      return [{ parts: [{ text: contents }], role: 'user' }];
    }
    if (Array.isArray(contents)) {
      // Check if it's an array of Content or Part
      if (contents.length > 0 && typeof contents[0] === 'object' && contents[0] !== null && 'role' in contents[0]) {
        return contents as Content[];
      } else {
        // Array of Parts
        return [{ parts: contents as Part[], role: 'user' }];
      }
    }
    // Single Content
    if (typeof contents === 'object' && contents !== null && 'role' in contents) {
      return [contents as Content];
    }
    // Single Part
    return [{ parts: [contents as Part], role: 'user' }];
  }


  private extractTextFromParts(parts: Part[]): string {
    return parts
      .map(part => {
        if ('text' in part) {
          return part.text;
        }
        // Handle other part types if needed in the future
        return '';
      })
      .join('');
  }

  private async makeApiCall(request: SolarRequestParams): Promise<SolarResponse> {
    // Debug: Log the request for troubleshooting
    console.log('Solar API Request:', {
      url: `${this.baseUrl}/chat/completions`,
      model: request.model,
      messagesCount: request.messages?.length || 0,
      maxTokens: request.max_tokens,
    });

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Enhanced error handling with response body
      const errorText = await response.text();
      console.error('Solar API Error Response:', errorText);
      
      // Parse error response for user-friendly messages
      try {
        const errorData = JSON.parse(errorText);
        if (errorData?.error?.code === 'api_key_is_not_allowed' || 
            errorData?.error?.message?.includes('insufficient credit')) {
          throw new Error(`💳 Solar API 크레딧이 부족합니다.\n\n` +
            `해결 방법:\n` +
            `1. https://console.upstage.ai/billing 방문\n` +
            `2. 결제 수단 등록 또는 크레딧 추가\n` +
            `3. Solar Code CLI 재시작\n\n` +
            `상세 오류: ${errorData?.error?.message || errorText}`);
        }
      } catch (_parseError) {
        // If JSON parsing fails, continue with original error
      }
      
      throw new Error(`Solar API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json() as Promise<SolarResponse>;
  }

  private async makeStreamingApiCall(request: SolarRequestParams): Promise<ReadableStream> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Enhanced error handling for streaming requests
      const errorText = await response.text();
      console.error('Solar Streaming API Error Response:', errorText);
      
      // Parse error response for user-friendly messages
      try {
        const errorData = JSON.parse(errorText);
        if (errorData?.error?.code === 'api_key_is_not_allowed' || 
            errorData?.error?.message?.includes('insufficient credit')) {
          throw new Error(`💳 Solar API 크레딧이 부족합니다.\n\n` +
            `해결 방법:\n` +
            `1. https://console.upstage.ai/billing 방문\n` +
            `2. 결제 수단 등록 또는 크레딧 추가\n` +
            `3. Solar Code CLI 재시작\n\n` +
            `상세 오류: ${errorData?.error?.message || errorText}`);
        }
      } catch (_parseError) {
        // If JSON parsing fails, continue with original error
      }
      
      throw new Error(`Solar streaming API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.body!;
  }

  private convertFromSolarResponse(solarResponse: SolarResponse): GenerateContentResponse {
    const choice = solarResponse.choices[0];
    
    const response = new GenerateContentResponse();
    response.candidates = [{
      content: {
        parts: [{ text: choice.message.content }],
        role: 'model',
      },
      finishReason: this.mapFinishReason(choice.finish_reason),
      index: choice.index,
    }];
    response.usageMetadata = {
      promptTokenCount: solarResponse.usage.prompt_tokens,
      candidatesTokenCount: solarResponse.usage.completion_tokens,
      totalTokenCount: solarResponse.usage.total_tokens,
    };
    
    return response;
  }

  private async* convertStreamFromSolarResponse(
    stream: ReadableStream
  ): AsyncGenerator<GenerateContentResponse> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              return;
            }
            
            try {
              const parsed: SolarResponse = JSON.parse(data);
              yield this.convertFromSolarResponse(parsed);
            } catch (_parseError) {
              // Skip malformed JSON chunks
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private mapFinishReason(solarFinishReason: string): FinishReason {
    switch (solarFinishReason) {
      case 'stop':
        return FinishReason.STOP;
      case 'length':
        return FinishReason.MAX_TOKENS;
      default:
        return FinishReason.FINISH_REASON_UNSPECIFIED;
    }
  }

  private estimateTokens(contents: ContentListUnion): number {
    const contentArray = this.normalizeContents(contents);
    const totalText = contentArray
      .flatMap(content => content.parts || [])
      .filter(part => part && 'text' in part)
      .map(part => (part as { text: string }).text)
      .join('');
    
    // Rough estimation: ~4 characters per token
    return Math.ceil(totalText.length / 4);
  }
}