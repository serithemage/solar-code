/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_SOLAR_MODEL, SOLAR_MAX_TOKENS } from './models.js';
import { SupportedSolarModel } from '../types/solarTypes.js';

/**
 * Upstage API configuration interface
 */
export interface UpstageConfig {
  apiKey: string;
  model: SupportedSolarModel;
  baseUrl: string;
  maxTokens: number;
  timeout: number;
  retryCount: number;
}

/**
 * Configuration error class for Upstage-specific errors
 */
export class UpstageConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpstageConfigError';
  }
}

/**
 * Default Upstage configuration values
 */
export const UPSTAGE_DEFAULTS = {
  baseUrl: 'https://api.upstage.ai/v1/solar',
  maxTokens: SOLAR_MAX_TOKENS,
  timeout: 120000, // 120 seconds
  retryCount: 3,
} as const;

/**
 * Validates and creates Upstage configuration from environment variables
 *
 * @returns {UpstageConfig} Validated Upstage configuration
 * @throws {UpstageConfigError} When required configuration is missing or invalid
 */
export function validateUpstageConfig(): UpstageConfig {
  const apiKey = process.env.UPSTAGE_API_KEY;

  if (!apiKey) {
    throw new UpstageConfigError(
      'UPSTAGE_API_KEY is required for Solar Pro2.\n' +
        '\n' +
        'Setup instructions:\n' +
        '1. Get your API key from: https://console.upstage.ai/\n' +
        '2. Set the environment variable:\n' +
        '   export UPSTAGE_API_KEY="your_key_here"\n' +
        '\n' +
        'Or create a .env file in your project root:\n' +
        '   UPSTAGE_API_KEY=your_key_here',
    );
  }

  // Validate API key format (basic check)
  if (!isValidApiKeyFormat(apiKey)) {
    throw new UpstageConfigError(
      'UPSTAGE_API_KEY format appears invalid.\n' +
        '\n' +
        'Expected format: up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n' +
        'Current value: ' +
        apiKey.substring(0, 8) +
        '...\n' +
        '\n' +
        'Please verify your API key at: https://console.upstage.ai/',
    );
  }

  // Parse and validate optional numeric values
  const maxTokens = parseEnvNumber(
    'UPSTAGE_MAX_TOKENS',
    UPSTAGE_DEFAULTS.maxTokens,
    1,
    8192,
  );
  const timeout = parseEnvNumber(
    'UPSTAGE_TIMEOUT',
    UPSTAGE_DEFAULTS.timeout,
    1000,
    300000,
  );
  const retryCount = parseEnvNumber(
    'UPSTAGE_RETRY_COUNT',
    UPSTAGE_DEFAULTS.retryCount,
    0,
    10,
  );

  // Validate model name
  const modelString = process.env.UPSTAGE_MODEL || DEFAULT_SOLAR_MODEL;
  if (!isValidSolarModel(modelString)) {
    throw new UpstageConfigError(
      `Invalid UPSTAGE_MODEL: "${modelString}"\n` +
        '\n' +
        'Supported models:\n' +
        '- solar-pro2 (recommended, latest)\n' +
        '- solar-mini\n' +
        '- solar-pro-2 (deprecated)\n' +
        '- solar-pro (deprecated)\n' +
        '- solar-1-mini-chat (deprecated)\n' +
        '- solar-1-mini (deprecated)',
    );
  }
  const model: SupportedSolarModel = modelString; // Type assertion is safe after validation

  // Validate base URL
  const baseUrl = process.env.UPSTAGE_BASE_URL || UPSTAGE_DEFAULTS.baseUrl;
  if (!isValidUrl(baseUrl)) {
    throw new UpstageConfigError(
      `Invalid UPSTAGE_BASE_URL: "${baseUrl}"\n` +
        '\n' +
        'Expected format: https://api.upstage.ai/v1/solar\n' +
        'Or your custom endpoint URL',
    );
  }

  return {
    apiKey,
    model,
    baseUrl,
    maxTokens,
    timeout,
    retryCount,
  };
}

/**
 * Checks if the API key format appears valid
 */
function isValidApiKeyFormat(apiKey: string): boolean {
  // Upstage API keys start with "up_" followed by alphanumeric characters (typically 26-32 chars total)
  return /^up_[a-zA-Z0-9]{23,}$/.test(apiKey);
}

/**
 * Validates if the model name is supported
 */
function isValidSolarModel(model: string): model is SupportedSolarModel {
  const supportedModels: SupportedSolarModel[] = [
    'solar-pro2',
    'solar-mini',
    'solar-pro-2',
    'solar-pro',
    'solar-1-mini-chat',
    'solar-1-mini',
  ];
  return supportedModels.includes(model as SupportedSolarModel);
}

/**
 * Validates if the URL format is correct
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return url.startsWith('https://');
  } catch {
    return false;
  }
}

/**
 * Parses environment variable as number with validation
 */
function parseEnvNumber(
  envVar: string,
  defaultValue: number,
  min: number,
  max: number,
): number {
  const value = process.env[envVar];
  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new UpstageConfigError(
      `Invalid ${envVar}: "${value}"\n` +
        `Expected a number between ${min} and ${max}`,
    );
  }

  if (parsed < min || parsed > max) {
    throw new UpstageConfigError(
      `${envVar} out of range: ${parsed}\n` +
        `Expected a number between ${min} and ${max}`,
    );
  }

  return parsed;
}

/**
 * Gets Upstage configuration with fallback to defaults
 * Use this when you want to handle errors gracefully
 */
export function getUpstageConfigSafely(): UpstageConfig | null {
  try {
    return validateUpstageConfig();
  } catch (error) {
    // Return null on configuration errors - let calling code handle it
    if (error instanceof UpstageConfigError) {
      return null;
    }
    throw error; // Re-throw unexpected errors
  }
}

/**
 * Prints environment variable setup guide
 */
export function printUpstageSetupGuide(): void {
  console.log('Solar Code - Upstage API Setup Guide');
  console.log('=====================================\n');

  console.log('Required environment variables:');
  console.log(
    '  UPSTAGE_API_KEY       Your Upstage API key (get from https://console.upstage.ai/)\n',
  );

  console.log('Optional environment variables:');
  console.log(
    `  UPSTAGE_MODEL         Model to use (default: ${DEFAULT_SOLAR_MODEL})`,
  );
  console.log(
    `  UPSTAGE_BASE_URL      API endpoint (default: ${UPSTAGE_DEFAULTS.baseUrl})`,
  );
  console.log(
    `  UPSTAGE_MAX_TOKENS    Max tokens per response (default: ${UPSTAGE_DEFAULTS.maxTokens})`,
  );
  console.log(
    `  UPSTAGE_TIMEOUT       Request timeout in ms (default: ${UPSTAGE_DEFAULTS.timeout})`,
  );
  console.log(
    `  UPSTAGE_RETRY_COUNT   Number of retries (default: ${UPSTAGE_DEFAULTS.retryCount})\n`,
  );

  console.log('Example .env file:');
  console.log('  UPSTAGE_API_KEY=up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log(`  UPSTAGE_MODEL=${DEFAULT_SOLAR_MODEL}`);
  console.log('  # Other variables use defaults if not specified\n');

  console.log('Export directly (Linux/macOS):');
  console.log('  export UPSTAGE_API_KEY="up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"');
  console.log('  export UPSTAGE_MODEL="solar-pro2"\n');

  console.log('Set temporarily (Windows):');
  console.log('  set UPSTAGE_API_KEY=up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('  set UPSTAGE_MODEL=solar-pro2');
}
