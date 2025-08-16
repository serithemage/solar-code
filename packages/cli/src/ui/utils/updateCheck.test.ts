/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { checkForUpdates } from './updateCheck.js';

const getPackageJson = vi.hoisted(() => vi.fn());
vi.mock('../../utils/package.js', () => ({
  getPackageJson,
}));

const updateNotifier = vi.hoisted(() => vi.fn());
vi.mock('update-notifier', () => ({
  default: updateNotifier,
}));

describe('checkForUpdates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetAllMocks();
    // Clear DEV environment variable before each test
    delete process.env.DEV;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should always return null (update check disabled for Solar Code)', async () => {
    getPackageJson.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
    });
    updateNotifier.mockReturnValue({
      fetchInfo: vi
        .fn()
        .mockResolvedValue({ current: '1.0.0', latest: '1.1.0' }),
    });
    const result = await checkForUpdates();
    expect(result).toBeNull();
    expect(getPackageJson).not.toHaveBeenCalled();
    expect(updateNotifier).not.toHaveBeenCalled();
  });

  it('should return null even with package.json present', async () => {
    getPackageJson.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
    });
    const result = await checkForUpdates();
    expect(result).toBeNull();
  });

  it('should return null even with newer versions available', async () => {
    getPackageJson.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
    });
    updateNotifier.mockReturnValue({
      fetchInfo: vi
        .fn()
        .mockResolvedValue({ current: '1.0.0', latest: '1.1.0' }),
    });

    const result = await checkForUpdates();
    expect(result).toBeNull();
  });

  it('should return null for nightly versions', async () => {
    getPackageJson.mockResolvedValue({
      name: 'test-package',
      version: '1.2.3-nightly.1',
    });

    const fetchInfoMock = vi.fn().mockImplementation(({ distTag }) => {
      if (distTag === 'nightly') {
        return Promise.resolve({
          latest: '1.2.3-nightly.2',
          current: '1.2.3-nightly.1',
        });
      }
      if (distTag === 'latest') {
        return Promise.resolve({
          latest: '1.2.3',
          current: '1.2.3-nightly.1',
        });
      }
      return Promise.resolve(null);
    });

    updateNotifier.mockImplementation(({ pkg, distTag }) => ({
      fetchInfo: () => fetchInfoMock({ pkg, distTag }),
    }));

    const result = await checkForUpdates();
    expect(result).toBeNull();
  });

  it('should handle errors gracefully and still return null', async () => {
    getPackageJson.mockRejectedValue(new Error('test error'));
    const result = await checkForUpdates();
    expect(result).toBeNull();
  });
});
