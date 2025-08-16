# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Solar Code** (@upstage/solar-cli), a command-line AI workflow tool powered by **Upstage Solar Pro2** that connects to your tools, understands your code, and accelerates your workflows. It's based on the Gemini CLI architecture but enhanced to work with Upstage's Solar Pro2 model, with special optimization for Korean developers and organizations.

## Development Commands

### Building the Project

- `npm run build` - Build all packages
- `npm run build:all` - Build main CLI + sandbox + VS Code companion
- `npm run build:packages` - Build workspace packages only
- `npm run bundle` - Create distribution bundle (includes git commit info generation)

### Development & Testing

- `npm start` - Start CLI in development mode
- `npm run debug` - Start with Node.js debugger attached
- `npm test` - Run all tests across workspaces
- `npm run test:ci` - Run CI tests including script tests
- `npm run test:e2e` - Run end-to-end integration tests
- `npm run test:integration:all` - Run all integration tests (none/docker/podman sandbox variants)

### Code Quality

- `npm run lint` - Lint TypeScript files
- `npm run lint:fix` - Auto-fix linting issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

### Comprehensive Workflow

- `npm run preflight` - Complete quality check pipeline (clean → install → format → lint → build → typecheck → test)

## Architecture Overview

Solar Code follows a **modular monorepo architecture** with distinct separation of concerns, adapted from the Gemini CLI architecture:

### Core Packages Structure

```
packages/
├── cli/           # Frontend: User interface, input handling, display rendering
├── core/          # Backend: Solar API client, tool orchestration, prompt management
├── test-utils/    # Shared testing utilities
└── vscode-ide-companion/  # VS Code extension integration
```

### Key Architectural Patterns

#### 1. **CLI-Core Separation**

- **CLI Package (`packages/cli`)**: Handles user interaction, UI rendering (React/Ink), settings management, Solar authentication flows
- **Core Package (`packages/core`)**: Manages Solar API communication, tool execution, prompt construction, and state management

#### 2. **Solar API Integration**

Located in `packages/core/src/core/`, the Solar integration includes:

- **SolarContentGenerator**: Primary interface to Upstage Solar Pro2 API
- **UpstageConfig**: Configuration validation and management for Solar API keys
- **Solar Types**: TypeScript definitions for Solar API requests and responses
- **JSON Schema Handling**: Converts Gemini's JSON schema requests to Solar-compatible prompts

#### 3. **Authentication System**

Solar Code supports multiple authentication methods:

- **Solar API Key**: Primary method using `UPSTAGE_API_KEY` environment variable
- **API Key Format**: Validates `up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` format
- **Fallback Support**: Maintains compatibility with other authentication methods for development

#### 4. **Tool System Architecture**

Located in `packages/core/src/tools/`, tools extend Solar's capabilities:

- **File Operations**: read-file, write-file, edit, ls, grep, glob
- **System Integration**: shell, web-fetch, web-search
- **Development**: memory management, MCP (Model Context Protocol) client
- **Tool Lifecycle**: Registration → Validation → User Confirmation → Execution → Result Processing

#### 5. **Request Flow**

1. User input (CLI) → Core package → Solar Pro2 API
2. Solar response → Tool execution (with user approval for destructive operations)
3. Tool results → Solar API → Formatted response → CLI display

#### 6. **Configuration System**

Multi-layered configuration with workspace/user/global settings:

- `packages/cli/src/config/` - Authentication, settings schemas, key bindings
- `packages/core/src/config/upstageConfig.ts` - Solar-specific configuration validation
- `.env.example` - Environment variable template for Solar setup
- Settings merge hierarchy with validation and error handling

## Key Development Concepts

### Solar Pro2 Integration

- **Model Configuration**: Uses `solar-pro2` as the default model
- **API Endpoint**: `https://api.upstage.ai/v1/solar/chat/completions`
- **OpenAI Compatibility**: Solar API follows OpenAI-compatible format with adaptations
- **JSON Schema Handling**: Converts Gemini's responseSchema to prompt instructions for Solar
- **Error Handling**: Provides user-friendly messages for credit/billing issues

### Environment Configuration

Required environment variables for Solar Code:

```bash
UPSTAGE_API_KEY="up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # Required
UPSTAGE_MODEL="solar-pro2"                              # Optional (default)
UPSTAGE_BASE_URL="https://api.upstage.ai/v1/solar"     # Optional (default)
UPSTAGE_MAX_TOKENS=4096                                 # Optional (default)
UPSTAGE_TIMEOUT=120000                                  # Optional (default: 120s)
UPSTAGE_RETRY_COUNT=3                                   # Optional (default: 3)
```

### Memory Management

- Automatic heap size configuration (50% of system memory)
- Process relaunching with optimized memory settings
- Context-aware token management for large codebases
- Solar-specific token estimation for API requests

### Testing Strategy

- **Unit Tests**: Vitest framework across all packages
- **Integration Tests**: Real sandbox environments (Docker/Podman variants)
- **Solar API Tests**: Mock Solar API responses with proper error handling
- **E2E Tests**: Full workflow validation with Solar Pro2 interactions

## Development Guidelines

### Working with Solar API

When modifying Solar API integration in `packages/core/src/core/solarContentGenerator.ts`:

1. Maintain OpenAI-compatible request/response format
2. Handle Solar-specific error codes and messages
3. Implement proper JSON schema conversion for prompt instructions
4. Include comprehensive error handling for billing/credit issues
5. Test with actual Solar API key when possible

### Adding New Tools

Follow the pattern in `packages/core/src/tools/`:

1. Implement tool interface with proper schema validation
2. Add to tool registry with appropriate permissions
3. Include comprehensive tests with mocked Solar API dependencies
4. Consider user confirmation requirements for destructive operations

### React/UI Development

The CLI uses **Ink** (React for CLI) with:

- Component-based architecture in `packages/cli/src/ui/components/`
- Solar-themed components in `SolarAsciiArt.ts`
- Context providers for state management (Settings, Session, Streaming)
- Custom hooks for Solar API interactions in `packages/cli/src/ui/hooks/`

### Configuration Changes

When modifying settings:

- Update `packages/cli/src/config/settingsSchema.ts` for CLI settings
- Update `packages/core/src/config/upstageConfig.ts` for Solar-specific config
- Ensure proper validation and error handling
- Update `.env.example` with new environment variables
- Provide migration path for existing configurations

### Sandbox Development

When modifying sandbox behavior:

- Test across all supported runtimes (none/docker/podman)
- Ensure security boundaries are maintained
- Validate permission models work correctly with Solar API

## Testing Specific Functionality

### Run Single Test File

```bash
# In specific package
cd packages/core && npx vitest run tools/edit.test.ts

# Integration test
npm run test:integration:sandbox:none -- --filter "specific-test-name"
```

### Testing with Different Sandbox Configurations

```bash
GEMINI_SANDBOX=false npm run test:integration:sandbox:none
GEMINI_SANDBOX=docker npm run test:integration:sandbox:docker
GEMINI_SANDBOX=podman npm run test:integration:sandbox:podman
```

### Testing Solar API Integration

```bash
# Test with mock Solar API
cd packages/core && npx vitest run core/solarContentGenerator.test.ts

# Test with real Solar API (requires UPSTAGE_API_KEY)
UPSTAGE_API_KEY="your_key" npm run test:e2e
```

## Solar-Specific Development

### Authentication Development

Solar Code supports Solar API key authentication configured in `packages/cli/src/config/auth.ts`:

- Primary: Solar API key authentication with `UPSTAGE_API_KEY`
- API key format validation: `up_` prefix with 23+ alphanumeric characters
- Billing error handling: User-friendly credit insufficient messages
- Fallback: Maintains compatibility with other auth methods for development

### Model Configuration

Located in `packages/core/src/config/models.ts`:

- `DEFAULT_SOLAR_MODEL = 'solar-pro2'` - Primary model for Solar Code
- Supported models: `solar-pro2`, `solar-mini`, `solar-pro`, legacy models
- Model validation in `upstageConfig.ts` ensures only supported models are used

### Error Handling Patterns

Solar-specific error handling focuses on:

- API key format validation with helpful error messages
- Credit/billing error detection with resolution steps
- Solar API timeout and retry configuration
- JSON parsing improvements for Solar API responses

## Project Structure Notes

- `.solar/config.yaml` - Solar-specific bot configuration (renamed from `.gemini`)
- `SOLAR.md` - Solar-specific documentation (renamed from `GEMINI.md`)
- `solar-code/` - Project documentation and development resources
- Bundle output: `bundle/solar.js` - Main CLI executable
