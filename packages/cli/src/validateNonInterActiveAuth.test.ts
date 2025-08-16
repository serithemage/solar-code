/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateNonInteractiveAuth,
  NonInteractiveConfig,
} from './validateNonInterActiveAuth.js';
import { AuthType } from '@google/gemini-cli-core';
import * as auth from './config/auth.js';

describe('validateNonInterActiveAuth', () => {
  let originalEnvUpstageApiKey: string | undefined;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let processExitSpy: ReturnType<typeof vi.spyOn>;
  let refreshAuthMock: jest.MockedFunction<
    (authType: AuthType) => Promise<unknown>
  >;

  beforeEach(() => {
    originalEnvUpstageApiKey = process.env.UPSTAGE_API_KEY;
    delete process.env.UPSTAGE_API_KEY;
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit(${code}) called`);
    });
    refreshAuthMock = vi.fn().mockResolvedValue('refreshed');
  });

  afterEach(() => {
    if (originalEnvUpstageApiKey !== undefined) {
      process.env.UPSTAGE_API_KEY = originalEnvUpstageApiKey;
    } else {
      delete process.env.UPSTAGE_API_KEY;
    }
    vi.restoreAllMocks();
  });

  it('exits if no auth type is configured or env vars set', async () => {
    const nonInteractiveConfig: NonInteractiveConfig = {
      refreshAuth: refreshAuthMock,
    };
    try {
      await validateNonInteractiveAuth(
        undefined,
        undefined,
        nonInteractiveConfig,
      );
      expect.fail('Should have exited');
    } catch (e) {
      expect((e as Error).message).toContain('process.exit(1) called');
    }
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Please set UPSTAGE_API_KEY environment variable'),
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('uses USE_SOLAR if UPSTAGE_API_KEY is set', async () => {
    process.env.UPSTAGE_API_KEY = 'up_fake_key_123456789012345678901234567890';
    const nonInteractiveConfig: NonInteractiveConfig = {
      refreshAuth: refreshAuthMock,
    };
    await validateNonInteractiveAuth(
      undefined,
      undefined,
      nonInteractiveConfig,
    );
    expect(refreshAuthMock).toHaveBeenCalledWith(AuthType.USE_SOLAR);
  });

  it('uses configuredAuthType if provided', async () => {
    // Set required env var for USE_SOLAR
    process.env.UPSTAGE_API_KEY = 'up_fake_key_123456789012345678901234567890';
    const nonInteractiveConfig: NonInteractiveConfig = {
      refreshAuth: refreshAuthMock,
    };
    await validateNonInteractiveAuth(
      AuthType.USE_SOLAR,
      undefined,
      nonInteractiveConfig,
    );
    expect(refreshAuthMock).toHaveBeenCalledWith(AuthType.USE_SOLAR);
  });

  it('exits if validateAuthMethod returns error', async () => {
    // Mock validateAuthMethod to return error
    vi.spyOn(auth, 'validateAuthMethod').mockReturnValue('Auth error!');
    const nonInteractiveConfig: NonInteractiveConfig = {
      refreshAuth: refreshAuthMock,
    };
    try {
      await validateNonInteractiveAuth(
        AuthType.USE_SOLAR,
        undefined,
        nonInteractiveConfig,
      );
      expect.fail('Should have exited');
    } catch (e) {
      expect((e as Error).message).toContain('process.exit(1) called');
    }
    expect(consoleErrorSpy).toHaveBeenCalledWith('Auth error!');
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('skips validation if useExternalAuth is true', async () => {
    // Mock validateAuthMethod to return error to ensure it's not being called
    const validateAuthMethodSpy = vi
      .spyOn(auth, 'validateAuthMethod')
      .mockReturnValue('Auth error!');
    const nonInteractiveConfig: NonInteractiveConfig = {
      refreshAuth: refreshAuthMock,
    };

    // Even with an invalid auth type, it should not exit
    // because validation is skipped.
    await validateNonInteractiveAuth(
      'invalid-auth-type' as AuthType,
      true, // useExternalAuth = true
      nonInteractiveConfig,
    );

    expect(validateAuthMethodSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(processExitSpy).not.toHaveBeenCalled();
    // We still expect refreshAuth to be called with the (invalid) type
    expect(refreshAuthMock).toHaveBeenCalledWith('invalid-auth-type');
  });
});
