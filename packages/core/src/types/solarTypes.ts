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
  tools?: Array<Record<string, unknown>>; // Function calling support (TBD)
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
      content: string;
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
