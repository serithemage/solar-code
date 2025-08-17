# Solar Core Package

The core package serves as the backend engine for Solar Code, handling all interactions with the Upstage Solar Pro2 API, tool orchestration, and core business logic. This package provides the foundation for AI-powered coding assistance and tool execution.

## Overview

The core package (`@google/gemini-cli-core`) implements the backend architecture that powers Solar Code. It manages Solar API communication, prompt construction, tool execution, and state management for AI-assisted development workflows.

## Architecture

### Key Components

#### 🧠 AI Integration (`src/core/`)

- **SolarContentGenerator**: Primary interface to Upstage Solar Pro2 API
- **Client Management**: API client configuration and connection handling
- **Prompt Engineering**: Context-aware prompt construction and management
- **Token Management**: Intelligent token usage optimization and limits

#### 🛠️ Tool System (`src/tools/`)

- **Tool Registry**: Registration and discovery of available tools
- **Tool Execution**: Secure execution environment with user confirmation
- **File Operations**: read-file, write-file, edit, ls, grep, glob
- **System Integration**: shell, web-fetch, web-search, memory management
- **MCP Integration**: Model Context Protocol client for extended capabilities

#### ⚙️ Configuration (`src/config/`)

- **Solar Configuration**: Upstage API settings and validation
- **Model Management**: Solar Pro2 model configuration and selection
- **Environment Configuration**: API endpoints, timeouts, and retry logic

#### 🔧 Services (`src/services/`)

- **File Discovery**: Intelligent file and directory discovery
- **Git Integration**: Repository context and branch management
- **Shell Execution**: Secure command execution with sandboxing
- **Loop Detection**: Prevention of infinite execution loops

#### 🔍 Utilities (`src/utils/`)

- **File Operations**: Advanced file system utilities and search
- **Text Processing**: Content analysis and formatting
- **Error Handling**: Robust error reporting and recovery
- **Memory Management**: Conversation context and session management

## Key Features

### 🚀 Solar Pro2 Integration

- **OpenAI-Compatible API**: Seamless integration with Upstage Solar Pro2
- **JSON Schema Handling**: Converts structured requests to prompt instructions
- **Error Recovery**: Intelligent handling of API errors and billing issues
- **Streaming Support**: Real-time response streaming for better UX

### 🔐 Security & Sandboxing

- **Tool Confirmation**: User approval required for destructive operations
- **Sandbox Execution**: Isolated environment for potentially dangerous commands
- **Input Validation**: Comprehensive validation of user inputs and API responses
- **Permission Model**: Granular control over tool capabilities

### 📈 Performance Optimization

- **Token Efficiency**: Smart token usage and context management
- **Caching**: Intelligent caching of API responses and tool results
- **Parallel Execution**: Concurrent tool execution where safe
- **Memory Management**: Efficient handling of large codebases and conversations

## Solar API Integration

### Authentication

```typescript
import { SolarConfig } from '@google/gemini-cli-core';

const config: SolarConfig = {
  apiKey: process.env.UPSTAGE_API_KEY,
  model: 'solar-pro2',
  baseUrl: 'https://api.upstage.ai/v1/solar',
  maxTokens: 4096,
  timeout: 120000,
  retryCount: 3,
};
```

### Content Generation

```typescript
import { SolarContentGenerator } from '@google/gemini-cli-core';

const generator = new SolarContentGenerator(config);
const response = await generator.generateContent({
  contents: [
    {
      role: 'user',
      parts: [{ text: 'Help me optimize this code' }],
    },
  ],
});
```

## Tool System

### Built-in Tools

#### File Operations

- **read-file**: Read file contents with encoding detection
- **write-file**: Write content to files with confirmation
- **edit**: Intelligent file editing with diff support
- **ls**: Directory listing with filtering options
- **grep**: Content search with regex support
- **glob**: Pattern-based file discovery

#### System Integration

- **shell**: Secure command execution with sandboxing
- **web-fetch**: HTTP requests with proxy support
- **web-search**: Web search capabilities
- **memory**: Conversation context management

#### Development Tools

- **mcp-client**: Model Context Protocol integration
- **mcp-tool**: Extended MCP tool capabilities

### Custom Tool Development

```typescript
import { Tool, ToolResult } from '@google/gemini-cli-core';

export class CustomTool implements Tool {
  name = 'custom-tool';
  description = 'Custom tool implementation';

  async execute(params: any): Promise<ToolResult> {
    // Tool implementation
    return { success: true, output: 'Result' };
  }
}
```

## Configuration Management

### Environment Variables

```bash
UPSTAGE_API_KEY="up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # Required
UPSTAGE_MODEL="solar-pro2"                              # Default model
UPSTAGE_BASE_URL="https://api.upstage.ai/v1/solar"     # API endpoint
UPSTAGE_MAX_TOKENS=4096                                 # Token limit
UPSTAGE_TIMEOUT=120000                                  # Request timeout (ms)
UPSTAGE_RETRY_COUNT=3                                   # Retry attempts
```

### Configuration Validation

```typescript
import { validateUpstageConfig } from '@google/gemini-cli-core';

const config = validateUpstageConfig({
  apiKey: process.env.UPSTAGE_API_KEY,
  model: 'solar-pro2',
});
```

## Development

### Scripts

- `npm run build` - Build the core package
- `npm test` - Run comprehensive test suite
- `npm run typecheck` - TypeScript type checking
- `npm run test:ci` - CI testing with coverage

### Testing Strategy

- **Unit Tests**: Individual component and utility testing
- **Integration Tests**: Solar API and tool integration testing
- **Mock Testing**: Comprehensive mocking of external dependencies
- **Error Testing**: Edge case and error condition validation

## File Structure

```
src/
├── core/                   # Core AI and API logic
│   ├── solarContentGenerator.ts  # Solar Pro2 API client
│   ├── client.ts          # API client management
│   ├── prompts.ts         # Prompt engineering
│   └── tokenLimits.ts     # Token management
├── tools/                  # Tool system implementation
│   ├── read-file.ts       # File reading operations
│   ├── write-file.ts      # File writing operations
│   ├── shell.ts           # Command execution
│   └── mcp-client.ts      # MCP integration
├── config/                 # Configuration management
│   ├── upstageConfig.ts   # Solar API configuration
│   ├── models.ts          # Model definitions
│   └── config.ts          # General configuration
├── services/               # Business logic services
│   ├── fileDiscoveryService.ts  # File discovery
│   ├── gitService.ts      # Git integration
│   └── shellExecutionService.ts # Command execution
├── utils/                  # Utility functions
│   ├── fileUtils.ts       # File operations
│   ├── textUtils.ts       # Text processing
│   └── filesearch/        # Advanced file search
├── types/                  # TypeScript definitions
│   └── solarTypes.ts      # Solar API types
└── telemetry/             # Usage analytics
    ├── metrics.ts         # Performance metrics
    └── loggers.ts         # Event logging
```

## Key Solar Enhancements

### Solar Pro2 Optimizations

- **Korean Language Support**: Enhanced support for Korean developers
- **API Compatibility**: OpenAI-compatible interface with Solar-specific adaptations
- **Error Handling**: Specialized error messages for billing and credit issues
- **Performance Tuning**: Optimized for Solar Pro2 model characteristics

### JSON Schema Conversion

The core package converts Gemini-style JSON schemas to Solar-compatible prompt instructions:

```typescript
// Gemini schema → Solar prompt conversion
const solarPrompt = convertSchemaToPrompt(geminiSchema);
```

### Memory Management

Advanced memory handling for large Korean codebases:

- **Context Optimization**: Intelligent context window management
- **Token Estimation**: Accurate token counting for Solar Pro2
- **Conversation Persistence**: Long-term conversation memory

## Integration Points

### CLI Package Integration

- **Command Processing**: Receives and processes commands from CLI
- **Response Streaming**: Provides real-time response updates
- **Tool Orchestration**: Manages tool execution workflows

### VS Code Extension

- **IDE Context**: Provides workspace context and file information
- **Live Updates**: Real-time synchronization with editor state
- **Debugging Support**: Enhanced debugging capabilities

### MCP Integration

- **Protocol Support**: Full Model Context Protocol implementation
- **OAuth Flow**: Secure authentication for MCP servers
- **Tool Extension**: Extensible tool system via MCP

## Error Handling

### Solar API Errors

- **Authentication**: Invalid API key detection and guidance
- **Billing**: Credit insufficient error handling with resolution steps
- **Rate Limiting**: Intelligent retry with exponential backoff
- **Network**: Connection error recovery and fallback strategies

### Tool Execution Errors

- **Validation**: Input validation and sanitization
- **Sandboxing**: Secure execution environment error handling
- **Recovery**: Automatic recovery from transient failures

## Performance Metrics

### Monitoring

- **API Latency**: Solar API response time tracking
- **Token Usage**: Token consumption monitoring and optimization
- **Tool Performance**: Individual tool execution metrics
- **Memory Usage**: Memory consumption tracking and optimization

### Optimization Strategies

- **Caching**: Multi-layer caching for API responses and tool results
- **Batching**: Intelligent request batching for efficiency
- **Prefetching**: Predictive content prefetching
- **Context Management**: Smart context window optimization

## Contributing

### Development Guidelines

1. **Solar Integration**: Maintain compatibility with Solar Pro2 API
2. **Type Safety**: Use strict TypeScript with comprehensive type definitions
3. **Testing**: Maintain high test coverage with focus on integration tests
4. **Performance**: Optimize for Korean text processing and large codebases

### Code Standards

- Follow ESLint configuration for consistent code style
- Use Prettier for automated formatting
- Maintain comprehensive JSDoc documentation
- Implement proper error handling and logging

## Troubleshooting

### Common Issues

- **API Authentication**: Verify Solar API key format (`up_` prefix)
- **Token Limits**: Monitor token usage and implement pagination
- **Tool Permissions**: Check sandbox configuration and file permissions
- **Network Issues**: Verify proxy settings and network connectivity

### Debug Logging

Enable detailed logging for troubleshooting:

```bash
DEBUG=solar:core:* npm test
```

## Related Documentation

- [CLI Package Documentation](../cli/README.md)
- [Architecture Overview](../../docs/architecture.md)
- [Tool System Documentation](../../docs/tools/index.md)
- [Solar Integration Guide](../../solar-code/UPSTAGE_API_SETUP.md)
