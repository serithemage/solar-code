/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthType } from '@google/gemini-cli-core';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateAuthMethod } from './auth.js';

vi.mock('./settings.js', () => ({
  loadEnvironment: vi.fn(),
}));

describe('validateAuthMethod', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('USE_SOLAR', () => {
    it('should return null if UPSTAGE_API_KEY is set', () => {
      process.env.UPSTAGE_API_KEY = 'up_test_key_123456789012345';
      expect(validateAuthMethod(AuthType.USE_SOLAR)).toBeNull();
    });

    it('should return an error message if UPSTAGE_API_KEY is not set', () => {
      expect(validateAuthMethod(AuthType.USE_SOLAR)).toBe(
        'UPSTAGE_API_KEY environment variable not found.\n\n' +
          'To use Solar Pro2:\n' +
          '1. Get your API key from: https://console.upstage.ai/\n' +
          '2. Set environment variable: export UPSTAGE_API_KEY="your_key_here"\n' +
          '3. Or create a .env file with: UPSTAGE_API_KEY=your_key_here\n\n' +
          'No reload needed if using .env file!',
      );
    });
  });

  it('should return an error message for an invalid auth method', () => {
    expect(validateAuthMethod('invalid-method')).toBe(
      'Invalid auth method selected: invalid-method',
    );
  });
});
