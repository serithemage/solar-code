/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthType } from '@google/gemini-cli-core';
import { loadEnvironment } from './settings.js';

export const validateAuthMethod = (authMethod: string): string | null => {
  loadEnvironment();



  if (authMethod === AuthType.USE_SOLAR) {
    if (!process.env.UPSTAGE_API_KEY) {
      return 'UPSTAGE_API_KEY environment variable not found.\n\n' +
        'To use Solar Pro2:\n' +
        '1. Get your API key from: https://console.upstage.ai/\n' +
        '2. Set environment variable: export UPSTAGE_API_KEY="your_key_here"\n' +
        '3. Or create a .env file with: UPSTAGE_API_KEY=your_key_here\n\n' +
        'No reload needed if using .env file!';
    }
    return null;
  }

  return 'Invalid auth method selected.';
};
