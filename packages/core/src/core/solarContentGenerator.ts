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
import {
  SolarConfig,
  SolarRequestParams,
  SolarResponse,
  SolarStreamingResponse,
  SolarFunction,
} from '../types/solarTypes.js';

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
      throw new Error(
        `Solar API error: ${error instanceof Error ? error.message : String(error)}`,
      );
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
      throw new Error(
        `Solar streaming API error: ${error instanceof Error ? error.message : String(error)}`,
      );
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

  private convertToSolarRequest(
    req: GenerateContentParameters,
    stream: boolean,
  ): SolarRequestParams {
    const messages = this.convertContentsToMessages(req.contents);

    // CRITICAL: Enhanced debug logging for tools
    console.log('🔧 SOLAR TOOLS DEBUG - convertToSolarRequest called:', {
      hasReqConfig: !!req.config,
      hasConfigTools: !!req.config?.tools,
      toolsLength: Array.isArray(req.config?.tools)
        ? req.config.tools.length
        : 0,
      configKeys: req.config ? Object.keys(req.config) : [],
      reqModel: req.model,
      reqContents: Array.isArray(req.contents) ? req.contents.length : 1,
    });

    if (req.config?.tools) {
      console.log(
        '🔧 SOLAR TOOLS FOUND:',
        Array.isArray(req.config.tools)
          ? req.config.tools.map((t) => ({
              type: typeof t,
              keys: Object.keys(t),
              hasFunctionDeclarations: 'functionDeclarations' in t,
              functionDeclarationsLength:
                'functionDeclarations' in t
                  ? (t as { functionDeclarations?: unknown[] })
                      .functionDeclarations?.length || 0
                  : 0,
            }))
          : [
              {
                type: typeof req.config.tools,
                keys: Object.keys(req.config.tools),
              },
            ],
      );
    } else {
      console.log(
        '🔧 SOLAR TOOLS NOT FOUND - req.config?.tools is null/undefined',
      );
    }

    // Handle JSON schema requests - Solar API doesn't support responseSchema directly
    // So we need to modify the prompt to request JSON format
    if (
      req.config?.responseSchema ||
      req.config?.responseMimeType === 'application/json'
    ) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        // Add JSON format instruction to the last user message
        lastMessage.content +=
          '\n\nPlease respond with a valid JSON object only. Do not include any text before or after the JSON. The response should be parseable by JSON.parse().';
      }
    }

    // Use the model from config instead of request to ensure correct Solar model
    const solarRequest: SolarRequestParams = {
      model: this.config.model,
      messages,
      max_tokens: this.config.maxTokens,
      temperature: req.config?.temperature,
      stream,
    };

    // Add reasoning_effort parameter if configured
    if (this.config.reasoningEffort) {
      solarRequest.reasoning_effort = this.config.reasoningEffort;
    }

    // Convert Gemini tools to Solar functions
    if (req.config?.tools && req.config.tools.length > 0) {
      console.log('🔧 Converting Gemini tools to Solar functions:', {
        toolCount: req.config.tools.length,
        toolTypes: req.config.tools.map((tool) => typeof tool),
      });
      solarRequest.tools = this.convertGeminiToolsToSolarFunctions(
        req.config.tools,
      );
      solarRequest.tool_choice = 'auto'; // Enable automatic function calling
      console.log('🔧 Solar functions generated:', {
        functionCount: solarRequest.tools.length,
        functionNames: solarRequest.tools.map((f) => f.function.name),
      });
    } else {
      console.log('🔧 No tools to convert - tools not found in req.config');
    }

    return solarRequest;
  }

  /**
   * Converts Gemini Tools to Solar API Function format
   */
  private convertGeminiToolsToSolarFunctions(
    geminiTools: unknown[],
  ): SolarFunction[] {
    const solarFunctions: SolarFunction[] = [];

    for (const tool of geminiTools) {
      // Handle different tool types
      if (tool && typeof tool === 'object' && 'functionDeclarations' in tool) {
        // Standard Gemini Tool with functionDeclarations
        const declarations = (tool as { functionDeclarations: unknown[] })
          .functionDeclarations;
        for (const func of declarations) {
          if (func && typeof func === 'object' && 'name' in func) {
            const funcObj = func as {
              name: string;
              description?: string;
              parameters?: unknown;
            };
            solarFunctions.push({
              type: 'function' as const,
              function: {
                name: funcObj.name,
                description: funcObj.description || '',
                parameters: {
                  type: 'object',
                  properties: this.convertGeminiParametersToSolar(
                    funcObj.parameters,
                  ),
                  required: this.extractRequiredParameters(funcObj.parameters),
                },
              },
            });
          }
        }
      } else if (tool && typeof tool === 'object' && 'name' in tool) {
        // Direct function-like tool
        const directTool = tool as {
          name: string;
          description?: string;
          parameters?: unknown;
        };
        solarFunctions.push({
          type: 'function' as const,
          function: {
            name: directTool.name,
            description: directTool.description || '',
            parameters: {
              type: 'object',
              properties: this.convertGeminiParametersToSolar(
                directTool.parameters,
              ),
              required: this.extractRequiredParameters(directTool.parameters),
            },
          },
        });
      }
    }

    return solarFunctions;
  }

  /**
   * Converts Gemini parameters schema to Solar format
   */
  private convertGeminiParametersToSolar(
    parameters: unknown,
  ): Record<string, { type: string; description?: string; enum?: string[] }> {
    if (
      !parameters ||
      typeof parameters !== 'object' ||
      !('properties' in parameters)
    ) {
      return {};
    }

    const paramObj = parameters as { properties: Record<string, unknown> };
    const solarProperties: Record<
      string,
      { type: string; description?: string; enum?: string[] }
    > = {};

    for (const [key, value] of Object.entries(paramObj.properties)) {
      const prop = value as {
        type?: string;
        description?: string;
        enum?: string[];
      };
      solarProperties[key] = {
        type: prop.type || 'string',
        description: prop.description,
        ...(prop.enum && { enum: prop.enum }),
      };
    }

    return solarProperties;
  }

  /**
   * Extracts required parameters from Gemini schema
   */
  private extractRequiredParameters(parameters: unknown): string[] {
    if (
      parameters &&
      typeof parameters === 'object' &&
      'required' in parameters
    ) {
      const paramObj = parameters as { required: unknown };
      return Array.isArray(paramObj.required)
        ? paramObj.required.filter(
            (item): item is string => typeof item === 'string',
          )
        : [];
    }
    return [];
  }

  private convertContentsToMessages(
    contents: ContentListUnion,
  ): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    // Handle ContentListUnion - convert to Content[]
    const contentArray = this.normalizeContents(contents);

    return contentArray.map((content) => {
      const role =
        content.role === 'model'
          ? 'assistant'
          : (content.role as 'user' | 'system');
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
      if (
        contents.length > 0 &&
        typeof contents[0] === 'object' &&
        contents[0] !== null &&
        'role' in contents[0]
      ) {
        return contents as Content[];
      } else {
        // Array of Parts
        return [{ parts: contents as Part[], role: 'user' }];
      }
    }
    // Single Content
    if (
      typeof contents === 'object' &&
      contents !== null &&
      'role' in contents
    ) {
      return [contents as Content];
    }
    // Single Part
    return [{ parts: [contents as Part], role: 'user' }];
  }

  private extractTextFromParts(parts: Part[]): string {
    return parts
      .map((part) => {
        if ('text' in part) {
          return part.text;
        }
        // Handle other part types if needed in the future
        return '';
      })
      .join('');
  }

  private async makeApiCall(
    request: SolarRequestParams,
  ): Promise<SolarResponse> {
    const requestStart = Date.now();

    // Enhanced debug logging with more detailed information
    console.log('🌞 Solar API Request:', {
      url: `${this.baseUrl}/chat/completions`,
      model: request.model,
      messagesCount: request.messages?.length || 0,
      maxTokens: request.max_tokens,
      temperature: request.temperature ?? 'default',
      stream: request.stream ? 'enabled' : 'disabled',
      timestamp: new Date().toISOString(),
      lastUserMessage:
        request.messages?.length > 0
          ? request.messages[request.messages.length - 1]?.content?.slice(
              0,
              100,
            ) + '...'
          : 'none',
    });

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
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
        if (
          errorData?.error?.code === 'api_key_is_not_allowed' ||
          errorData?.error?.message?.includes('insufficient credit')
        ) {
          throw new Error(
            `💳 Solar API 크레딧이 부족합니다.\n\n` +
              `해결 방법:\n` +
              `1. https://console.upstage.ai/billing 방문\n` +
              `2. 결제 수단 등록 또는 크레딧 추가\n` +
              `3. Solar Code CLI 재시작\n\n` +
              `상세 오류: ${errorData?.error?.message || errorText}`,
          );
        }
      } catch (_parseError) {
        // If JSON parsing fails, continue with original error
      }

      throw new Error(
        `Solar API request failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const solarResponse = (await response.json()) as SolarResponse;
    const requestDuration = Date.now() - requestStart;

    // Enhanced response logging
    console.log('🌞 Solar API Response:', {
      status: response.status,
      duration: `${requestDuration}ms`,
      model: solarResponse.model,
      usage: solarResponse.usage,
      finishReason: solarResponse.choices?.[0]?.finish_reason,
      responseLength: solarResponse.choices?.[0]?.message?.content?.length || 0,
      firstChars:
        solarResponse.choices?.[0]?.message?.content?.slice(0, 100) + '...' ||
        'none',
      timestamp: new Date().toISOString(),
    });

    return solarResponse;
  }

  private async makeStreamingApiCall(
    request: SolarRequestParams,
  ): Promise<ReadableStream> {
    const requestStart = Date.now();

    // Enhanced debug logging for streaming requests
    console.log('🌊 Solar API Streaming Request:', {
      url: `${this.baseUrl}/chat/completions`,
      model: request.model,
      messagesCount: request.messages?.length || 0,
      maxTokens: request.max_tokens,
      temperature: request.temperature ?? 'default',
      stream: 'enabled',
      toolsCount: request.tools?.length || 0,
      toolChoice: request.tool_choice || 'none',
      hasReasoningEffort: !!request.reasoning_effort,
      timestamp: new Date().toISOString(),
      lastUserMessage:
        request.messages?.length > 0
          ? request.messages[request.messages.length - 1]?.content?.slice(
              0,
              100,
            ) + '...'
          : 'none',
    });

    // Log function calling details if tools are present
    if (request.tools && request.tools.length > 0) {
      console.log('🔧 Solar API Function Calling:', {
        toolCount: request.tools.length,
        toolNames: request.tools.map((tool) => tool.function.name),
        toolChoice: JSON.stringify(request.tool_choice),
        firstToolSchema: request.tools[0]
          ? {
              name: request.tools[0].function.name,
              hasParameters: !!request.tools[0].function.parameters,
              parameterProps: Object.keys(
                request.tools[0].function.parameters?.properties || {},
              ),
            }
          : null,
      });
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
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
        if (
          errorData?.error?.code === 'api_key_is_not_allowed' ||
          errorData?.error?.message?.includes('insufficient credit')
        ) {
          throw new Error(
            `💳 Solar API 크레딧이 부족합니다.\n\n` +
              `해결 방법:\n` +
              `1. https://console.upstage.ai/billing 방문\n` +
              `2. 결제 수단 등록 또는 크레딧 추가\n` +
              `3. Solar Code CLI 재시작\n\n` +
              `상세 오류: ${errorData?.error?.message || errorText}`,
          );
        }
      } catch (_parseError) {
        // If JSON parsing fails, continue with original error
      }

      throw new Error(
        `Solar streaming API request failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const requestDuration = Date.now() - requestStart;

    // Enhanced response logging for streaming
    console.log('🌊 Solar API Streaming Response:', {
      status: response.status,
      duration: `${requestDuration}ms`,
      headers: {
        contentType: response.headers.get('content-type'),
        transferEncoding: response.headers.get('transfer-encoding'),
      },
      timestamp: new Date().toISOString(),
      note: 'Stream initiated successfully',
    });

    return response.body!;
  }

  private convertFromSolarResponse(
    solarResponse: SolarResponse,
  ): GenerateContentResponse {
    const choice = solarResponse.choices[0];

    const response = new GenerateContentResponse();

    // Convert function calls if present
    const parts: Part[] = [];

    // Add text content if available
    if (choice.message.content) {
      parts.push({ text: choice.message.content });
    }

    // Add function calls if present
    if (choice.message.tool_calls) {
      for (const toolCall of choice.message.tool_calls) {
        if (toolCall.type === 'function') {
          parts.push({
            functionCall: {
              name: toolCall.function.name,
              args: JSON.parse(toolCall.function.arguments),
            },
          });
        }
      }
    }

    response.candidates = [
      {
        content: {
          parts,
          role: 'model',
        },
        finishReason: this.mapFinishReason(choice.finish_reason),
        index: choice.index,
      },
    ];

    response.usageMetadata = {
      promptTokenCount: solarResponse.usage.prompt_tokens,
      candidatesTokenCount: solarResponse.usage.completion_tokens,
      totalTokenCount: solarResponse.usage.total_tokens,
    };

    return response;
  }

  private convertFromSolarStreamingResponse(
    solarStreamingResponse: SolarStreamingResponse,
  ): GenerateContentResponse {
    const choice = solarStreamingResponse.choices[0];

    const response = new GenerateContentResponse();

    // Handle streaming delta content
    const content = choice.delta.content || '';
    const role = choice.delta.role || 'model';
    const parts: Part[] = [];

    // Add text content if present
    if (content) {
      parts.push({ text: content });
    }

    // Handle streaming tool calls
    if (choice.delta.tool_calls && choice.delta.tool_calls.length > 0) {
      for (const toolCall of choice.delta.tool_calls) {
        if (
          toolCall.type === 'function' &&
          toolCall.function?.name &&
          toolCall.function?.arguments
        ) {
          try {
            const parsedArgs = JSON.parse(
              toolCall.function.arguments,
            ) as Record<string, unknown>;
            parts.push({
              functionCall: {
                name: toolCall.function.name,
                args: parsedArgs,
              },
            });
          } catch (parseError) {
            console.error(
              '🌊 Solar Stream: Failed to parse tool call arguments:',
              {
                toolCall: toolCall.function,
                error:
                  parseError instanceof Error
                    ? parseError.message
                    : String(parseError),
              },
            );
          }
        }
      }
    }

    response.candidates = [
      {
        content: {
          parts,
          role,
        },
        finishReason: choice.finish_reason
          ? this.mapFinishReason(choice.finish_reason)
          : undefined,
        index: choice.index,
      },
    ];

    // Include usage metadata if available (typically only in the last chunk)
    if (solarStreamingResponse.usage) {
      response.usageMetadata = {
        promptTokenCount: solarStreamingResponse.usage.prompt_tokens,
        candidatesTokenCount: solarStreamingResponse.usage.completion_tokens,
        totalTokenCount: solarStreamingResponse.usage.total_tokens,
      };
    }

    return response;
  }

  private async *convertStreamFromSolarResponse(
    stream: ReadableStream,
  ): AsyncGenerator<GenerateContentResponse> {
    console.log('🌊 Solar Stream: Starting stream conversion');
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Enhanced completion detection - ensure stream is properly terminated
          console.log('🌊 Solar Stream: Reader done, terminating');
          break;
        }

        // Decode and append to buffer to handle partial chunks
        const chunk = decoder.decode(value, { stream: true });
        console.log(
          '🌊 Solar Stream Raw Chunk:',
          JSON.stringify(chunk.slice(0, 200)),
        );
        buffer += chunk;
        const lines = buffer.split('\n');

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              // Enhanced completion detection for [DONE] signal
              console.log('🌊 Solar Stream: [DONE] signal received');
              return;
            }

            try {
              const parsed: SolarStreamingResponse = JSON.parse(data);
              console.log('🌊 Solar Stream JSON Parsed Successfully:', {
                hasChoices: !!parsed.choices && parsed.choices.length > 0,
                hasRole: !!parsed.choices?.[0]?.delta?.role,
                hasContent: !!parsed.choices?.[0]?.delta?.content,
                hasToolCalls: !!parsed.choices?.[0]?.delta?.tool_calls,
                toolCallsLength:
                  parsed.choices?.[0]?.delta?.tool_calls?.length || 0,
              });
              const response = this.convertFromSolarStreamingResponse(parsed);

              // Log the parsed content for debugging
              const candidate = response.candidates?.[0];
              if (
                candidate?.content?.parts &&
                candidate.content.parts.length > 0
              ) {
                const parts = candidate.content.parts;
                const textParts = parts.filter(
                  (p): p is { text: string } =>
                    'text' in p && typeof p.text === 'string',
                );
                const functionParts = parts.filter(
                  (
                    p,
                  ): p is {
                    functionCall: {
                      name: string;
                      args?: Record<string, unknown>;
                    };
                  } => 'functionCall' in p,
                );

                console.log('🌊 Solar Stream Chunk:', {
                  textCount: textParts.length,
                  text:
                    textParts.length > 0
                      ? textParts[0].text.slice(0, 100)
                      : undefined,
                  functionCallCount: functionParts.length,
                  functionCalls: functionParts.map((p) => ({
                    name: p.functionCall.name,
                    hasArgs: !!p.functionCall.args,
                  })),
                  finishReason: candidate.finishReason,
                });
              }

              // Enhanced: Check for stop finish reason
              if (response.candidates?.[0]?.finishReason === 'STOP') {
                // Stream completion detected - proper termination will happen
                console.log('🌊 Solar Stream: STOP finish reason detected');
              }

              yield response;
            } catch (parseError) {
              // Log parsing errors for debugging with more detail
              console.error('🌊 Solar Stream Parse Error:', {
                dataLength: data.length,
                dataStart: data.slice(0, 150),
                dataEnd: data.slice(-50),
                isIncomplete: !data.endsWith('}'),
                error:
                  parseError instanceof Error
                    ? parseError.message
                    : String(parseError),
              });
              continue;
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        console.log(
          '🌊 Solar Stream: Processing remaining buffer:',
          buffer.slice(0, 100),
        );
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
      .flatMap((content) => content.parts || [])
      .filter((part) => part && 'text' in part)
      .map((part) => (part as { text: string }).text)
      .join('');

    // Rough estimation: ~4 characters per token
    return Math.ceil(totalText.length / 4);
  }
}
