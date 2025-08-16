/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthType, Config } from '@google/gemini-cli-core';
import { validateAuthMethod } from './config/auth.js';

function getAuthTypeFromEnv(): AuthType | undefined {
  if (process.env.UPSTAGE_API_KEY) {
    return AuthType.USE_SOLAR;
  }
  return undefined;
}

export async function validateNonInteractiveAuth(
  configuredAuthType: AuthType | undefined,
  useExternalAuth: boolean | undefined,
  nonInteractiveConfig: Config,
) {
  const effectiveAuthType = configuredAuthType || getAuthTypeFromEnv();

  if (!effectiveAuthType) {
    console.error(
      `Please set UPSTAGE_API_KEY environment variable before running Solar Code CLI.\n\n` +
      `To get your API key:\n` +
      `1. Visit: https://console.upstage.ai/\n` +
      `2. Set environment variable: export UPSTAGE_API_KEY="your_key_here"\n` +
      `3. Or create a .env file with: UPSTAGE_API_KEY=your_key_here`,
    );
    process.exit(1);
  }

  if (!useExternalAuth) {
    const err = validateAuthMethod(effectiveAuthType);
    if (err != null) {
      console.error(err);
      process.exit(1);
    }
  }

  await nonInteractiveConfig.refreshAuth(effectiveAuthType);
  return nonInteractiveConfig;
}
