/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { UpdateInfo } from 'update-notifier';

export const FETCH_TIMEOUT_MS = 2000;

export interface UpdateObject {
  message: string;
  update: UpdateInfo;
}

export async function checkForUpdates(): Promise<UpdateObject | null> {
  // Skip update check for Solar Code CLI (package not published)
  return null;
}
