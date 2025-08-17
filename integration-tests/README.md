# Solar Code Integration Tests

Comprehensive end-to-end integration test suite for Solar Code that validates real-world usage scenarios, tool execution, and API integration with the Upstage Solar Pro2 model.

## Overview

The integration tests provide comprehensive validation of Solar Code functionality by testing complete user workflows, tool interactions, and API communication in realistic environments. These tests ensure that all components work together correctly and that Solar Code delivers reliable AI-powered coding assistance.

## Test Architecture

### 🧪 Test Framework

#### TestRig Class

The core testing infrastructure that provides:

- **Environment Setup**: Creates isolated test environments
- **File System Management**: Creates and manages test files and directories
- **Solar CLI Execution**: Runs Solar CLI commands with real API integration
- **Tool Call Validation**: Verifies tool execution and responses
- **Output Analysis**: Analyzes and validates Solar Pro2 responses

#### Test Execution Flow

1. **Setup**: Create isolated test environment
2. **Preparation**: Set up test files and configuration
3. **Execution**: Run Solar CLI commands with real Solar Pro2 API
4. **Validation**: Verify tool calls and output correctness
5. **Cleanup**: Clean up test environment

### 🛠️ Test Categories

#### File System Operations (`file-system.test.js`)

Tests core file operation tools:

- **File Reading**: `read_file` tool validation
- **File Writing**: `write_file` tool with content verification
- **File Editing**: In-place file modification testing
- **Directory Operations**: `ls` tool and directory navigation

#### Text Processing (`replace.test.js`)

Tests text manipulation and editing:

- **Content Replacement**: Text substitution and modification
- **Pattern Matching**: Regular expression and pattern-based editing
- **Multi-file Operations**: Batch text processing across files

#### Shell Integration (`run_shell_command.test.js`)

Tests command execution capabilities:

- **Command Execution**: Shell command running with `shell` tool
- **Output Capture**: Command output validation
- **Error Handling**: Command failure and error reporting
- **Security**: Sandbox execution validation

#### Web Operations (`google_web_search.test.js`)

Tests web integration features:

- **Web Search**: `web_search` tool functionality
- **Content Fetching**: `web_fetch` tool validation
- **API Integration**: External service interaction testing

#### Memory Management (`save_memory.test.js`)

Tests conversation context and memory:

- **Context Persistence**: Long-term conversation memory
- **Memory Retrieval**: Context recall and utilization
- **Session Management**: Multi-turn conversation handling

#### MCP Integration (`simple-mcp-server.test.js`, `mcp_server_cyclic_schema.test.js`)

Tests Model Context Protocol functionality:

- **MCP Server Communication**: External MCP server integration
- **Schema Validation**: MCP schema handling and validation
- **Tool Extension**: Extended tool capabilities via MCP

#### Multi-file Operations (`read_many_files.test.js`, `list_directory.test.js`)

Tests batch and multi-file operations:

- **Bulk File Reading**: Reading multiple files efficiently
- **Directory Listing**: Comprehensive directory analysis
- **Pattern Matching**: File discovery and filtering

## Test Environment Setup

### Prerequisites

```bash
# Required environment variables
export UPSTAGE_API_KEY="up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export GEMINI_SANDBOX="none|docker|podman"  # Optional, defaults to none
```

### Sandbox Configuration

Integration tests support multiple sandbox environments:

#### No Sandbox (`GEMINI_SANDBOX=none`)

- **Direct Execution**: Tools run directly on host system
- **Fastest**: Minimal overhead for rapid testing
- **Security**: Limited isolation, suitable for development

#### Docker Sandbox (`GEMINI_SANDBOX=docker`)

- **Container Isolation**: Tools run in Docker containers
- **Security**: Strong isolation between tools and host
- **Requirements**: Docker Desktop or Docker Engine

#### Podman Sandbox (`GEMINI_SANDBOX=podman`)

- **Container Isolation**: Tools run in Podman containers
- **Rootless**: Rootless container execution support
- **Requirements**: Podman installation

## Running Tests

### Complete Test Suite

```bash
# Run all integration tests
npm run test:integration:all

# Run tests with specific sandbox
GEMINI_SANDBOX=docker npm run test:integration:all
```

### Individual Test Categories

```bash
# Run specific test file
node integration-tests/file-system.test.js

# Run with debug output
DEBUG=solar:* node integration-tests/file-system.test.js
```

### Continuous Integration

```bash
# CI test execution with coverage
npm run test:e2e
```

## Test Structure

### TestRig API

#### Environment Management

```javascript
const rig = new TestRig();
await rig.setup('test name'); // Create isolated environment
```

#### File System Operations

```javascript
// Create test files
rig.createFile('test.txt', 'content');
rig.createDir('test-dir');

// File system structure
rig.createFile('src/index.js', 'console.log("hello");');
rig.createFile('package.json', '{"name": "test"}');
```

#### Command Execution

```javascript
// Run Solar CLI command
const result = await rig.run('read the file test.txt');

// Wait for specific tool calls
const toolCall = await rig.waitForToolCall('read_file');
```

#### Validation Helpers

```javascript
// Validate tool execution
assert.ok(foundToolCall, 'Expected read_file tool call');

// Validate output content
assert.ok(result.includes('expected content'));

// Debug information
printDebugInfo(rig, result, additionalInfo);
```

### Example Test Implementation

```javascript
import { strict as assert } from 'assert';
import { test } from 'node:test';
import { TestRig, validateModelOutput } from './test-helper.js';

test('should process multiple files', async () => {
  const rig = new TestRig();
  await rig.setup('multiple files test');

  // Setup test files
  rig.createFile('file1.txt', 'content 1');
  rig.createFile('file2.txt', 'content 2');
  rig.createDir('subdir');
  rig.createFile('subdir/file3.txt', 'content 3');

  // Execute command
  const result = await rig.run(
    'read all .txt files and summarize their contents',
  );

  // Validate tool calls
  const readCalls = await rig.waitForToolCalls('read_file', 3);
  assert.equal(readCalls.length, 3, 'Expected 3 read_file calls');

  // Validate output
  assert.ok(result.includes('content 1'), 'Should include file1 content');
  assert.ok(result.includes('content 2'), 'Should include file2 content');
  assert.ok(result.includes('content 3'), 'Should include file3 content');

  await rig.cleanup();
});
```

## Test Data Management

### File System Structures

Common test file structures are created using helper methods:

```javascript
// Simple project structure
rig.createFile(
  'package.json',
  JSON.stringify({
    name: 'test-project',
    version: '1.0.0',
    scripts: { start: 'node index.js' },
  }),
);
rig.createFile('index.js', 'console.log("Hello Solar Code");');
rig.createFile('README.md', '# Test Project');

// Complex project structure
rig.createDir('src');
rig.createFile('src/app.ts', 'export class App {}');
rig.createDir('tests');
rig.createFile('tests/app.test.ts', 'describe("App", () => {});');
```

### Test Configuration

```javascript
// Custom Solar configuration for tests
rig.createFile(
  '.solar/config.yaml',
  `
model: solar-pro2
max_tokens: 2048
tools:
  - read_file
  - write_file
  - shell
`,
);
```

## Validation and Debugging

### Tool Call Validation

```javascript
// Wait for specific tool with timeout
const toolCall = await rig.waitForToolCall('read_file', 10000);

// Validate tool parameters
assert.equal(toolCall.parameters.path, 'test.txt');

// Multiple tool calls
const toolCalls = await rig.waitForToolCalls('read_file', 2);
```

### Output Validation

```javascript
// Content validation
assert.ok(result.includes('expected text'));

// Pattern matching
assert.match(result, /pattern.*match/);

// JSON validation
const parsed = JSON.parse(extractJsonFromResult(result));
assert.equal(parsed.status, 'success');
```

### Debug Information

```javascript
// Print comprehensive debug info
printDebugInfo(rig, result, {
  'Expected tool': 'read_file',
  'Found tool calls': toolCalls.length,
  'Output length': result.length,
});

// Custom debug output
console.log('Tool execution log:', rig.getToolLog());
console.log('API request history:', rig.getRequestHistory());
```

## Error Handling and Recovery

### Test Resilience

```javascript
test('should handle API errors gracefully', async () => {
  const rig = new TestRig();
  await rig.setup('error handling test');

  try {
    // This might fail due to API limits
    const result = await rig.run('complex request');
    // Validate success case
  } catch (error) {
    // Validate error handling
    assert.ok(error.message.includes('API limit'));
  }

  await rig.cleanup();
});
```

### Timeout Handling

```javascript
// Configure timeouts for slow operations
const result = await rig.run('slow command', { timeout: 30000 });

// Tool call timeouts
const toolCall = await rig.waitForToolCall('slow_tool', 15000);
```

## Performance Testing

### Response Time Validation

```javascript
test('should respond within acceptable time', async () => {
  const rig = new TestRig();
  await rig.setup('performance test');

  const startTime = Date.now();
  const result = await rig.run('simple command');
  const responseTime = Date.now() - startTime;

  assert.ok(responseTime < 10000, 'Response should be under 10s');
  await rig.cleanup();
});
```

### Resource Usage Monitoring

```javascript
// Monitor memory and CPU usage during tests
const usage = rig.getResourceUsage();
assert.ok(usage.memory < 500 * 1024 * 1024, 'Memory under 500MB');
```

## CI/CD Integration

### Test Execution Pipeline

1. **Environment Setup**: Configure Solar API keys and sandbox
2. **Build Validation**: Ensure all packages are built
3. **Sandbox Preparation**: Build sandbox images if needed
4. **Test Execution**: Run integration tests with retries
5. **Result Collection**: Gather test results and logs
6. **Cleanup**: Clean up test environments and artifacts

### Test Matrix

Integration tests run across multiple configurations:

- **Sandbox Types**: none, docker, podman
- **Operating Systems**: macOS, Linux, Windows (WSL)
- **Node.js Versions**: 20.x, latest LTS

### Failure Handling

```bash
# Retry failed tests
npm run test:integration:retry

# Run tests with extended timeout
INTEGRATION_TIMEOUT=60000 npm run test:integration:all
```

## Development Guidelines

### Adding New Tests

1. **Test Naming**: Use descriptive test names that explain the scenario
2. **Setup/Cleanup**: Always use proper setup and cleanup
3. **Validation**: Include comprehensive validation of tool calls and output
4. **Error Cases**: Test both success and failure scenarios
5. **Documentation**: Document test purpose and expected behavior

### Test Best Practices

1. **Isolation**: Each test should be independent and isolated
2. **Determinism**: Tests should be deterministic and repeatable
3. **Performance**: Optimize tests for reasonable execution time
4. **Debugging**: Include debug information for test failures

### Code Style

```javascript
// Consistent test structure
test('should do something specific', async () => {
  // Setup
  const rig = new TestRig();
  await rig.setup('descriptive test name');

  // Arrange
  rig.createFile('input.txt', 'test data');

  // Act
  const result = await rig.run('command description');

  // Assert
  const toolCall = await rig.waitForToolCall('expected_tool');
  assert.ok(toolCall, 'Should call expected tool');
  assert.ok(result.includes('expected output'));

  // Cleanup
  await rig.cleanup();
});
```

## Troubleshooting

### Common Issues

- **API Key**: Verify `UPSTAGE_API_KEY` is correctly set
- **Sandbox**: Ensure Docker/Podman is running for container tests
- **Timeouts**: Increase timeout values for slow operations
- **File Permissions**: Check file system permissions in test environment

### Debug Mode

```bash
# Enable comprehensive debugging
DEBUG=solar:*,integration:* node integration-tests/file-system.test.js
```

### Test Logs

Test logs are automatically saved for debugging:

- **Test Output**: Complete test execution logs
- **API Requests**: Solar API request/response logs
- **Tool Execution**: Detailed tool execution traces

## Related Documentation

- [Core Package Documentation](../packages/core/README.md)
- [CLI Package Documentation](../packages/cli/README.md)
- [Tool System Documentation](../docs/tools/index.md)
- [Testing Strategy](../docs/integration-tests.md)
