/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { render } from 'ink-testing-library';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthDialog } from './AuthDialog.js';
import { LoadedSettings } from '../../config/settings.js';
import { AuthType } from '@google/gemini-cli-core';

describe('AuthDialog', () => {
  const wait = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env.GEMINI_API_KEY = '';
    process.env.GEMINI_DEFAULT_AUTH_TYPE = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should show an error if the initial auth type is invalid', () => {
    process.env.GEMINI_API_KEY = '';

    const settings: LoadedSettings = new LoadedSettings(
      {
        settings: { customThemes: {}, mcpServers: {} },
        path: '',
      },
      {
        settings: {
          selectedAuthType: AuthType.USE_GEMINI,
        },
        path: '',
      },
      {
        settings: { customThemes: {}, mcpServers: {} },
        path: '',
      },
      [],
    );

    const { lastFrame } = render(
      <AuthDialog
        onSelect={() => {}}
        settings={settings}
        initialErrorMessage="GEMINI_API_KEY  environment variable not found"
      />,
    );

    expect(lastFrame()).toContain(
      'GEMINI_API_KEY  environment variable not found',
    );
  });

  describe('UPSTAGE_API_KEY environment variable', () => {
    it('should detect UPSTAGE_API_KEY environment variable', () => {
      process.env.UPSTAGE_API_KEY = 'up_foobar_123456789012345678901234567890';

      const settings: LoadedSettings = new LoadedSettings(
        {
          settings: {
            selectedAuthType: undefined,
            customThemes: {},
            mcpServers: {},
          },
          path: '',
        },
        {
          settings: { customThemes: {}, mcpServers: {} },
          path: '',
        },
        {
          settings: { customThemes: {}, mcpServers: {} },
          path: '',
        },
        [],
      );

      const { lastFrame } = render(
        <AuthDialog onSelect={() => {}} settings={settings} />,
      );

      expect(lastFrame()).toContain(
        'Existing Solar API key detected (UPSTAGE_API_KEY)',
      );
    });
  });

  it('should prevent exiting when no auth method is selected and show error message', async () => {
    const onSelect = vi.fn();
    const settings: LoadedSettings = new LoadedSettings(
      {
        settings: { customThemes: {}, mcpServers: {} },
        path: '',
      },
      {
        settings: {
          selectedAuthType: undefined,
          customThemes: {},
          mcpServers: {},
        },
        path: '',
      },
      {
        settings: { customThemes: {}, mcpServers: {} },
        path: '',
      },
      [],
    );

    const { lastFrame, stdin, unmount } = render(
      <AuthDialog onSelect={onSelect} settings={settings} />,
    );
    await wait();

    // Simulate pressing escape key
    stdin.write('\u001b'); // ESC key
    await wait();

    // Should show Solar setup dialog instead of calling onSelect
    expect(lastFrame()).toContain('Solar Code Setup');
    expect(onSelect).not.toHaveBeenCalled();
    unmount();
  });

  it('should not exit if there is already an error message', async () => {
    const onSelect = vi.fn();
    const settings: LoadedSettings = new LoadedSettings(
      {
        settings: { customThemes: {}, mcpServers: {} },
        path: '',
      },
      {
        settings: {
          selectedAuthType: undefined,
          customThemes: {},
          mcpServers: {},
        },
        path: '',
      },
      {
        settings: { customThemes: {}, mcpServers: {} },
        path: '',
      },
      [],
    );

    const { lastFrame, stdin, unmount } = render(
      <AuthDialog
        onSelect={onSelect}
        settings={settings}
        initialErrorMessage="Initial error"
      />,
    );
    await wait();

    expect(lastFrame()).toContain('Initial error');

    // Simulate pressing escape key
    stdin.write('\u001b'); // ESC key
    await wait();

    // Should not call onSelect
    expect(onSelect).not.toHaveBeenCalled();
    unmount();
  });

  it('should allow exiting when auth method is already selected', async () => {
    // Remove UPSTAGE_API_KEY to prevent error message
    const originalApiKey = process.env.UPSTAGE_API_KEY;
    delete process.env.UPSTAGE_API_KEY;

    const onSelect = vi.fn();
    const settings: LoadedSettings = new LoadedSettings(
      {
        settings: { customThemes: {}, mcpServers: {} },
        path: '',
      },
      {
        settings: {
          selectedAuthType: AuthType.USE_SOLAR,
          customThemes: {},
          mcpServers: {},
        },
        path: '',
      },
      {
        settings: { customThemes: {}, mcpServers: {} },
        path: '',
      },
      [],
    );

    const { stdin, unmount } = render(
      <AuthDialog onSelect={onSelect} settings={settings} />,
    );
    await wait();

    // Simulate pressing escape key
    stdin.write('\u001b'); // ESC key
    await wait();

    // With Solar auth already selected, ESC should trigger exit with undefined
    expect(onSelect).toHaveBeenCalledWith(undefined, 'User');
    unmount();

    // Restore environment variable
    if (originalApiKey) {
      process.env.UPSTAGE_API_KEY = originalApiKey;
    }
  });
});
