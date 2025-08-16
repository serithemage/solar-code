#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// ANSI color codes for smooth Solar gradient
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
};

// SOLAR ASCII art - retro terminal style
export const solarLogo = `
> solar-code

 ███         ███████   ███████  ██       █████  ███████ 
░░░███      ██░░░░░░  ██░░░░░██░██      ██░░░██░██░░░░██
  ░░░███    ░██████  ░██    ░██░██     ░███████░███████ 
    ░░░███  ░░░░░░██ ░██    ░██░██     ░██░░░██░██░░░██ 
    ███░         ░██ ░██    ░██░██     ░██  ░██░██  ░░██
  ███░      ███████  ░░███████ ░███████░██  ░██░██   ░██
 ░░░░       ░░░░░░░   ░░░░░░░  ░░░░░░░░░░░   ░░ ░░    ░░ 
`;

function applySolarGradient(asciiArt) {
  const lines = asciiArt.trim().split('\n');
  let result = '';

  // Ultra-smooth Solar gradient array with 100 steps
  const gradient = [];

  // Generate smooth 100 color steps with better interpolation
  for (let i = 0; i < 100; i++) {
    const progress = i / 99; // 0 to 1

    let r, g, b;

    // Use gentler progression for ultra-smooth yellow to orange transition
    const easeProgress = progress; // Use linear progression for smoother control

    // Yellow to Red gradient
    // Use smooth progression from bright yellow (255,255,0) to red (255,0,0)
    const smoothProgress = easeProgress * easeProgress * (3 - 2 * easeProgress); // Smooth S-curve

    r = 255; // Keep red at maximum for both yellow and red
    g = Math.round(255 - smoothProgress * 255); // 255 to 0 (yellow to red)
    b = 0; // Keep blue at 0 for pure yellow/red colors

    // Use more precise RGB to ANSI conversion with dithering
    const ansiR = Math.max(0, Math.min(5, Math.round(r / 51)));
    const ansiG = Math.max(0, Math.min(5, Math.round(g / 51)));
    const ansiB = Math.max(0, Math.min(5, Math.round(b / 51)));
    const ansiColor = 16 + 36 * ansiR + 6 * ansiG + ansiB;

    gradient.push(`\x1b[38;5;${ansiColor}m`);
  }

  lines.forEach((line, lineIndex) => {
    let coloredLine = '';

    // Calculate effective line length excluding leading/trailing spaces
    const trimmedLine = line.trim();
    const leadingSpaces = line.indexOf(trimmedLine);
    const effectiveLength = trimmedLine.length;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      // Apply gradient to block characters and letters
      if (
        char === '█' ||
        char === '░' ||
        (char !== ' ' && char !== '>' && char !== '-' && char !== '\n')
      ) {
        // Calculate smooth gradient position with interpolation
        const relativePos = Math.max(0, i - leadingSpaces);
        const normalizedPos =
          effectiveLength > 0 ? relativePos / effectiveLength : 0;

        // Add slight vertical offset for more natural gradient feel
        const verticalOffset = lineIndex * 0.02; // Subtle vertical gradient component
        const adjustedPos = Math.min(
          1,
          Math.max(0, normalizedPos + verticalOffset),
        );

        // Use floating-point index for smoother interpolation
        const floatIndex = adjustedPos * (gradient.length - 1);
        const lowerIndex = Math.floor(floatIndex);
        const upperIndex = Math.min(lowerIndex + 1, gradient.length - 1);

        // For now, use simple selection (could add interpolation later)
        const gradientIndex = Math.round(floatIndex);
        const color = gradient[Math.min(gradientIndex, gradient.length - 1)];

        coloredLine += color + char + colors.reset;
      } else {
        coloredLine += char;
      }
    }

    result += coloredLine + '\n';
  });

  return result;
}

function displaySolarLogo() {
  console.clear();
  console.log('\n');

  const coloredLogo = applySolarGradient(solarLogo);
  console.log(coloredLogo);

  // Tips section
  console.log(colors.dim + 'Tips for getting started:' + colors.reset);
  console.log(
    colors.dim +
      '1. Ask questions, edit files, or run commands.' +
      colors.reset,
  );
  console.log(
    colors.dim + '2. Be specific for the best results.' + colors.reset,
  );
  console.log(colors.dim + '3. /help for more information.' + colors.reset);

  console.log('\n');
  process.stdout.write('> ');
}

// Run only if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  displaySolarLogo();
}
