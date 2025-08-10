# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Gemini CLI** (@google/gemini-cli), a command-line AI workflow tool that connects to your tools, understands your code, and accelerates your workflows. It uses Google's Gemini AI API to provide intelligent code assistance, file operations, and workflow automation.

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

The Gemini CLI follows a **modular monorepo architecture** with distinct separation of concerns:

### Core Packages Structure
```
packages/
├── cli/           # Frontend: User interface, input handling, display rendering
├── core/          # Backend: API client, tool orchestration, prompt management
├── test-utils/    # Shared testing utilities
└── vscode-ide-companion/  # VS Code extension integration
```

### Key Architectural Patterns

#### 1. **CLI-Core Separation**
- **CLI Package (`packages/cli`)**: Handles user interaction, UI rendering (React/Ink), settings management, authentication flows
- **Core Package (`packages/core`)**: Manages Gemini API communication, tool execution, prompt construction, and state management

#### 2. **Tool System Architecture** 
Located in `packages/core/src/tools/`, tools extend Gemini's capabilities:
- **File Operations**: read-file, write-file, edit, ls, grep, glob
- **System Integration**: shell, web-fetch, web-search  
- **Development**: memory management, MCP (Model Context Protocol) client
- **Tool Lifecycle**: Registration → Validation → User Confirmation → Execution → Result Processing

#### 3. **Request Flow**
1. User input (CLI) → Core package → Gemini API
2. Gemini response → Tool execution (with user approval for destructive operations)  
3. Tool results → Gemini API → Formatted response → CLI display

#### 4. **Configuration System**
Multi-layered configuration with workspace/user/global settings managed through:
- `packages/cli/src/config/` - Authentication, settings schemas, key bindings
- Settings merge hierarchy with validation and error handling

#### 5. **Authentication & Security**
- Multiple auth methods: OAuth2, API keys, Cloud Shell
- Sandbox execution environment for security isolation
- User confirmation required for file system modifications

## Key Development Concepts

### Memory Management
- Automatic heap size configuration (50% of system memory)
- Process relaunching with optimized memory settings
- Context-aware token management for large codebases

### Extensibility Patterns
- **MCP Server Integration**: Extensible protocol for tool capabilities
- **Extension System**: Plugin architecture for custom functionality  
- **Theme System**: Customizable UI themes with semantic color tokens

### Testing Strategy
- **Unit Tests**: Vitest framework across all packages
- **Integration Tests**: Real sandbox environments (Docker/Podman variants)
- **E2E Tests**: Full workflow validation with actual API interactions

## Development Guidelines

### Working with Tools
When adding new tools, follow the pattern in `packages/core/src/tools/`:
1. Implement tool interface with proper schema validation
2. Add to tool registry with appropriate permissions
3. Include comprehensive tests with mocked dependencies  
4. Consider user confirmation requirements for destructive operations

### React/UI Development  
The CLI uses **Ink** (React for CLI) with:
- Component-based architecture in `packages/cli/src/ui/components/`
- Context providers for state management (Settings, Session, Streaming)
- Custom hooks for complex interactions in `packages/cli/src/ui/hooks/`

### Configuration Changes
Modify settings schema in `packages/cli/src/config/settingsSchema.ts` and ensure:
- Proper validation and error handling
- Migration path for existing configurations
- Documentation in relevant CLI docs

### Sandbox Development
When modifying sandbox behavior:
- Test across all supported runtimes (none/docker/podman)
- Ensure security boundaries are maintained
- Validate permission models work correctly

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

## Authentication Development

The project supports multiple authentication methods configured in `packages/cli/src/config/auth.ts`:
- Google OAuth2 (interactive and programmatic)
- API key-based authentication
- Cloud Shell integration  
- External authentication providers

When working on auth features, test across different environments and ensure secure credential handling.