# Solar Test Utils Package

Shared testing utilities for Solar Code that provide common testing infrastructure and helpers for file system testing, mocking, and test setup across all packages.

## Overview

The test-utils package (`@google/gemini-cli-test-utils`) provides essential testing utilities that are shared across the Solar Code monorepo. It focuses on file system testing helpers that enable comprehensive testing of file operations, tool execution, and integration scenarios.

## Features

### 🗂️ File System Test Helpers

The package provides utilities for creating and managing temporary file systems during testing, enabling realistic testing of file operations without affecting the actual file system.

#### `FileSystemStructure` Type

A flexible type definition that allows you to define complex directory structures using a simple JavaScript object notation:

```typescript
type FileSystemStructure = {
  [name: string]:
    | string // File content
    | FileSystemStructure // Subdirectory
    | Array<string | FileSystemStructure>; // Directory with mixed content
};
```

#### `createTmpDir()` Function

Creates a temporary directory with a specified structure:

```typescript
import { createTmpDir } from '@google/gemini-cli-test-utils';

const tmpDir = await createTmpDir({
  'package.json': '{"name": "test-project"}',
  src: {
    'index.ts': 'export default "Hello World";',
    utils: {
      'helpers.ts': '// Helper functions',
    },
  },
  tests: ['unit.test.ts', 'integration.test.ts'],
});
```

#### `cleanupTmpDir()` Function

Safely removes temporary directories and all contents:

```typescript
import { cleanupTmpDir } from '@google/gemini-cli-test-utils';

await cleanupTmpDir(tmpDir);
```

## Usage Examples

### Basic File Structure Testing

```typescript
import { createTmpDir, cleanupTmpDir } from '@google/gemini-cli-test-utils';

describe('File operations', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await createTmpDir({
      'config.json': '{"debug": true}',
      src: {
        'main.js': 'console.log("Hello");',
        lib: ['index.js', 'utils.js'],
      },
    });
  });

  afterEach(async () => {
    await cleanupTmpDir(tmpDir);
  });

  test('should read configuration file', async () => {
    // Test file reading operations
    const configPath = path.join(tmpDir, 'config.json');
    const content = await fs.readFile(configPath, 'utf-8');
    expect(JSON.parse(content)).toEqual({ debug: true });
  });
});
```

### Complex Directory Structure

```typescript
const complexStructure = {
  // Root files
  'README.md': '# Test Project',
  'package.json': JSON.stringify(
    {
      name: 'test-project',
      version: '1.0.0',
    },
    null,
    2,
  ),

  // Source directory with nested structure
  src: {
    'index.ts': 'export * from "./components";',
    components: {
      'Button.tsx': 'export const Button = () => <button />;',
      'Input.tsx': 'export const Input = () => <input />;',
    },
    utils: {
      'helpers.ts': 'export const helper = () => {};',
      'constants.ts': 'export const API_URL = "localhost";',
    },
  },

  // Test directory with mixed content
  tests: [
    'setup.ts', // Empty files
    'teardown.ts',
    {
      unit: ['button.test.tsx', 'input.test.tsx'],
    },
    {
      integration: {
        'api.test.ts': '// API integration tests',
      },
    },
  ],

  // Configuration directories
  config: {
    'development.json': '{"env": "dev"}',
    'production.json': '{"env": "prod"}',
  },
};

const tmpDir = await createTmpDir(complexStructure);
```

### Integration with Solar Code Tools

```typescript
import { createTmpDir, cleanupTmpDir } from '@google/gemini-cli-test-utils';
import { ReadFileTool, LsTool } from '@google/gemini-cli-core';

describe('Solar Code tool integration', () => {
  let tmpDir: string;
  let readTool: ReadFileTool;
  let lsTool: LsTool;

  beforeEach(async () => {
    tmpDir = await createTmpDir({
      'solar.config.yaml': 'api_key: test-key',
      src: {
        'app.ts': 'import { Solar } from "solar";',
        components: ['Header.tsx', 'Footer.tsx'],
      },
    });

    readTool = new ReadFileTool();
    lsTool = new LsTool();
  });

  afterEach(async () => {
    await cleanupTmpDir(tmpDir);
  });

  test('should list directory contents', async () => {
    const result = await lsTool.execute({ path: tmpDir });
    expect(result.output).toContain('solar.config.yaml');
    expect(result.output).toContain('src');
  });

  test('should read file content', async () => {
    const configPath = path.join(tmpDir, 'solar.config.yaml');
    const result = await readTool.execute({ path: configPath });
    expect(result.output).toContain('api_key: test-key');
  });
});
```

## Testing Patterns

### Test Structure Organization

```typescript
// Recommended test structure pattern
const projectStructure = {
  // Project configuration
  'package.json': JSON.stringify(packageConfig),
  'tsconfig.json': JSON.stringify(tsConfig),
  '.solar': {
    'config.yaml': 'model: solar-pro2',
  },

  // Source code
  src: {
    'index.ts': sourceCode,
    lib: libFiles,
    types: typeDefinitions,
  },

  // Test files (empty for quick creation)
  tests: testFiles,

  // Documentation
  docs: documentationFiles,
};
```

### Common Testing Scenarios

#### Tool Execution Testing

```typescript
test('tool execution with file system', async () => {
  const tmpDir = await createTmpDir({
    'input.txt': 'test content',
    output: [], // Empty directory
  });

  // Execute tool that processes files
  const result = await tool.execute({
    input: path.join(tmpDir, 'input.txt'),
    output: path.join(tmpDir, 'output'),
  });

  // Verify results
  expect(result.success).toBe(true);

  await cleanupTmpDir(tmpDir);
});
```

#### Multi-Package Integration

```typescript
test('cross-package integration', async () => {
  const tmpDir = await createTmpDir({
    monorepo: {
      packages: {
        cli: {
          'package.json': '{"name": "@solar/cli"}',
          src: ['index.ts'],
        },
        core: {
          'package.json': '{"name": "@solar/core"}',
          src: ['index.ts'],
        },
      },
    },
  });

  // Test package interactions
  // ...

  await cleanupTmpDir(tmpDir);
});
```

## Development

### Scripts

- `npm run build` - Build the test utilities package
- `npm run typecheck` - TypeScript type checking

### Dependencies

- **Node.js Built-ins**: Uses `fs/promises`, `path`, and `os` modules
- **TypeScript**: Provides type definitions for the utilities
- **No External Dependencies**: Keeps the package lightweight and focused

## File Structure

```
src/
├── index.ts                     # Main exports
└── file-system-test-helpers.ts  # File system testing utilities
```

## Best Practices

### Temporary Directory Management

1. **Always Clean Up**: Use `afterEach` or `afterAll` to clean up temporary directories
2. **Unique Names**: The package automatically creates unique temporary directory names
3. **Cross-Platform**: Works consistently across Windows, macOS, and Linux

### File System Structure Design

1. **Realistic Structures**: Create structures that mirror real-world projects
2. **Meaningful Content**: Use realistic file content for better testing
3. **Edge Cases**: Include empty files, empty directories, and nested structures

### Performance Considerations

1. **Minimal Structures**: Create only the files needed for each test
2. **Parallel Cleanup**: Clean up directories in parallel when possible
3. **Reusable Structures**: Define common structures as constants

## Integration with Testing Frameworks

### Vitest Integration

```typescript
import { beforeEach, afterEach, describe, test, expect } from 'vitest';
import { createTmpDir, cleanupTmpDir } from '@google/gemini-cli-test-utils';

describe('Solar Code integration', () => {
  // Standard setup pattern
});
```

### Jest Integration

```typescript
import { createTmpDir, cleanupTmpDir } from '@google/gemini-cli-test-utils';

describe('Solar Code integration', () => {
  // Jest-compatible setup
});
```

## Error Handling

### Safe Cleanup

The `cleanupTmpDir` function uses safe removal options:

- `recursive: true` - Removes directories and contents
- `force: true` - Continues even if files don't exist

### Cross-Platform Compatibility

- Uses Node.js `os.tmpdir()` for platform-appropriate temporary directories
- Handles path separators correctly across operating systems
- Works with different file system permissions

## Contributing

### Guidelines

1. **Simplicity**: Keep utilities simple and focused
2. **Documentation**: Provide clear examples for all functions
3. **Testing**: Test the testing utilities themselves
4. **Backward Compatibility**: Maintain API stability

### Adding New Utilities

When adding new testing utilities:

1. Export from `index.ts`
2. Provide comprehensive TypeScript types
3. Include usage examples in documentation
4. Add appropriate error handling

## Related Documentation

- [CLI Package Testing](../cli/README.md#testing-strategy)
- [Core Package Testing](../core/README.md#testing-strategy)
- [Integration Tests](../../integration-tests/README.md)
- [Architecture Overview](../../docs/architecture.md)
