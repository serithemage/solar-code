/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Colors } from '../colors.js';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import { LoadedSettings, SettingScope } from '../../config/settings.js';
import { AuthType } from '@google/gemini-cli-core';
import { validateAuthMethod } from '../../config/auth.js';

interface AuthDialogProps {
  onSelect: (authMethod: AuthType | undefined, scope: SettingScope) => void;
  settings: LoadedSettings;
  initialErrorMessage?: string | null;
}

function parseDefaultAuthType(
  defaultAuthType: string | undefined,
): AuthType | null {
  if (
    defaultAuthType &&
    Object.values(AuthType).includes(defaultAuthType as AuthType)
  ) {
    return defaultAuthType as AuthType;
  }
  return null;
}

export function AuthDialog({
  onSelect,
  settings,
  initialErrorMessage,
}: AuthDialogProps): React.JSX.Element {
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (initialErrorMessage) {
      return initialErrorMessage;
    }

    const defaultAuthType = parseDefaultAuthType(
      process.env.GEMINI_DEFAULT_AUTH_TYPE,
    );

    if (process.env.GEMINI_DEFAULT_AUTH_TYPE && defaultAuthType === null) {
      return (
        `Invalid value for GEMINI_DEFAULT_AUTH_TYPE: "${process.env.GEMINI_DEFAULT_AUTH_TYPE}". ` +
        `Valid values are: ${Object.values(AuthType).join(', ')}.`
      );
    }

    if (
      process.env.UPSTAGE_API_KEY &&
      (!defaultAuthType || defaultAuthType === AuthType.USE_SOLAR)
    ) {
      return 'Existing Solar API key detected (UPSTAGE_API_KEY). Select "Solar API Key" option to use it.';
    }
    
    return null;
  });
  const items = [
    {
      label: 'Use Solar API Key (Solar Pro2)',
      value: AuthType.USE_SOLAR,
    },
  ];

  const initialAuthIndex = items.findIndex((item) => {
    if (settings.merged.selectedAuthType) {
      return item.value === settings.merged.selectedAuthType;
    }

    const defaultAuthType = parseDefaultAuthType(
      process.env.GEMINI_DEFAULT_AUTH_TYPE,
    );
    if (defaultAuthType) {
      return item.value === defaultAuthType;
    }

    // Default to Solar API Key (the only option)
    return item.value === AuthType.USE_SOLAR;
  });

  const handleAuthSelect = (authMethod: AuthType) => {
    const error = validateAuthMethod(authMethod);
    if (error) {
      setErrorMessage(error);
    } else {
      setErrorMessage(null);
      onSelect(authMethod, SettingScope.User);
    }
  };

  useInput((_input, key) => {
    if (key.escape) {
      // Prevent exit if there is an error message.
      // This means they user is not authenticated yet.
      if (errorMessage) {
        return;
      }
      if (settings.merged.selectedAuthType === undefined) {
        // Prevent exiting if no auth method is set
        setErrorMessage(
          'You must select an auth method to proceed. Press Ctrl+C twice to exit.',
        );
        return;
      }
      onSelect(undefined, SettingScope.User);
    }
  });

  return (
    <Box
      borderStyle="round"
      borderColor={Colors.Gray}
      flexDirection="column"
      padding={1}
      width="100%"
    >
      <Text bold>Solar Code Setup</Text>
      <Box marginTop={1}>
        <Text>Set up your Solar Pro2 API key to get started:</Text>
      </Box>
      <Box marginTop={1}>
        <RadioButtonSelect
          items={items}
          initialIndex={initialAuthIndex}
          onSelect={handleAuthSelect}
          isFocused={true}
        />
      </Box>
      {errorMessage && (
        <Box marginTop={1}>
          <Text color={Colors.AccentRed}>{errorMessage}</Text>
        </Box>
      )}
      <Box marginTop={1}>
        <Text color={Colors.Gray}>(Use Enter to select)</Text>
      </Box>
      <Box marginTop={1}>
        <Text>Get your API key from Upstage Console:</Text>
      </Box>
      <Box marginTop={1}>
        <Text color={Colors.AccentBlue}>
          https://console.upstage.ai/
        </Text>
      </Box>
    </Box>
  );
}
