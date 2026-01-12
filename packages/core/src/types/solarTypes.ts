/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Supported Solar model types (based on actual Upstage API 2025)
 */
export type SupportedSolarModel =
  | 'solar-pro2'
  | 'solar-mini'
  | 'solar-pro-2'
  | 'solar-pro'
  | 'solar-1-mini-chat'
  | 'solar-1-mini';

/**
 * Solar API configuration interface
 */
export interface SolarConfig {
  apiKey: string;
  model: SupportedSolarModel;
  baseUrl?: string;
  maxTokens?: number;
  timeout?: number;
  retryCount?: number;
  reasoningEffort?: 'high' | 'medium' | 'low';
}

/**
 * Solar API function definition (OpenAI-compatible format)
 */
export interface SolarFunction {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<
        string,
        {
          type: string;
          description?: string;
          enum?: string[];
        }
      >;
      required?: string[];
    };
  };
}

/**
 * Solar API request parameters
 */
export interface SolarRequestParams {
  model: SupportedSolarModel;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
  tools?: SolarFunction[]; // Solar API Function Calling support
  tool_choice?:
    | 'auto'
    | 'none'
    | { type: 'function'; function: { name: string } };
  reasoning_effort?: 'high' | 'medium' | 'low'; // Solar Pro2 reasoning capability
}

/**
 * Solar API function call structure
 */
export interface SolarFunctionCall {
  name: string;
  arguments: string; // JSON string
}

/**
 * Solar API response structure (non-streaming)
 */
export interface SolarResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: 'function';
        function: SolarFunctionCall;
      }>;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Solar API streaming response structure
 */
export interface SolarStreamingResponse {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  system_fingerprint?: string | null;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
      tool_calls?: Array<{
        index?: number;
        id?: string;
        type?: 'function';
        function?: {
          name?: string;
          arguments?: string;
        };
      }>;
    };
    logprobs?: unknown;
    finish_reason?: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
