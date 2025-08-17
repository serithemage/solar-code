# Solar CLI Package

The CLI package provides the user-facing frontend for Solar Code, a command-line AI workflow tool powered by Upstage Solar Pro2. This package handles user interaction, UI rendering, and the overall user experience.

## Overview

Solar CLI (`@upstage/solar-cli`) is built using React and Ink to provide a modern, interactive terminal interface. It serves as the frontend layer that communicates with the core package to deliver AI-powered coding assistance.

## Architecture

### Key Components

#### 🖥️ User Interface (`src/ui/`)

- **React/Ink Components**: Terminal-based UI components for interactive experiences
- **Themes**: Customizable color schemes and visual styles
- **Command Processing**: Handles user input and command execution
- **State Management**: React Context for session, settings, and streaming state

#### ⚙️ Configuration (`src/config/`)

- **Authentication**: Solar API key management and validation
- **Settings**: User preferences, editor integration, and CLI behavior
- **Sandboxing**: Security configuration for tool execution

#### 🔧 Services (`src/services/`)

- **Command Loading**: Built-in and file-based command loaders
- **MCP Prompts**: Model Context Protocol integration for AI assistance
- **Tool Scheduling**: Coordination of tool execution workflows

#### 🛠️ Utilities (`src/utils/`)

- **Git Integration**: Branch detection and repository utilities
- **Sandbox Management**: Secure environment for tool execution
- **Update Handling**: Automatic update notifications and management

## Key Features

### 🎨 Modern Terminal UI

- **Interactive Components**: Real-time UI updates using React/Ink
- **Theme System**: Multiple built-in themes with customization support
- **Responsive Design**: Adapts to different terminal sizes and capabilities
- **Accessibility**: Keyboard navigation and screen reader support

### 🔐 Security & Authentication

- **Solar API Key**: Secure authentication with Upstage Solar Pro2
- **Sandbox Execution**: Isolated environment for potentially dangerous operations
- **User Confirmation**: Interactive approval for file system modifications

### 🚀 Performance Optimizations

- **Streaming Responses**: Real-time AI response rendering
- **Memory Management**: Efficient handling of large conversations
- **Caching**: Intelligent caching of commands and responses

## Configuration

### Environment Variables

```bash
UPSTAGE_API_KEY="up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # Required
UPSTAGE_MODEL="solar-pro2"                              # Optional (default)
```

### Settings Management

Settings are managed through the interactive settings dialog or configuration files:

- User-level: `~/.solar/config.yaml`
- Project-level: `.solar/config.yaml`

## Development

### Scripts

- `npm run build` - Build the CLI package
- `npm start` - Start CLI in development mode
- `npm run debug` - Start with Node.js debugger
- `npm test` - Run test suite
- `npm run typecheck` - TypeScript type checking

### Architecture Patterns

#### React/Ink Integration

```typescript
// Example component structure
export function CommandComponent() {
  const { settings } = useSettings();
  const { session } = useSession();

  return (
    <Box>
      <Text>Solar Code CLI</Text>
    </Box>
  );
}
```

#### Solar API Integration

```typescript
// Solar API authentication flow
import { useAuthCommand } from './hooks/useAuthCommand';

const auth = useAuthCommand();
await auth.authenticate();
```

### Testing Strategy

- **Unit Tests**: Component and utility function testing with Vitest
- **Integration Tests**: Full CLI workflow testing with ink-testing-library
- **E2E Tests**: Complete user journey validation

## Dependencies

### Production Dependencies

- **@google/gemini-cli-core**: Core Solar Code functionality
- **ink**: React for CLI interfaces
- **react**: Component framework
- **yargs**: Command-line argument parsing
- **zod**: Runtime type validation

### Development Dependencies

- **@testing-library/react**: React component testing
- **vitest**: Fast unit testing framework
- **typescript**: Type checking and compilation

## File Structure

```
src/
├── ui/                     # React/Ink UI components
│   ├── components/         # Reusable UI components
│   ├── commands/           # Command-specific components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   └── themes/             # Theme system
├── config/                 # Configuration management
│   ├── auth.ts            # Authentication configuration
│   ├── settings.ts        # User settings management
│   └── settingsSchema.ts  # Settings validation
├── services/               # Business logic services
│   ├── CommandService.ts  # Command execution service
│   └── McpPromptLoader.ts # MCP integration
└── utils/                  # Utility functions
    ├── gitUtils.ts        # Git repository utilities
    └── sandbox.ts         # Sandbox management
```

## Integration Points

### Core Package Integration

The CLI package communicates with the core package through well-defined interfaces:

- **Tool Execution**: Requests tool execution through core package
- **AI Communication**: Sends prompts and receives responses via core
- **Configuration**: Shares configuration state with core package

### VS Code Extension

- **IDE Integration**: Seamless integration with VS Code companion extension
- **File Synchronization**: Real-time file change notifications
- **Debugging Support**: Enhanced debugging capabilities in IDE context

## Contributing

### Development Guidelines

1. **Component Design**: Follow React/Ink best practices for terminal UIs
2. **Type Safety**: Use TypeScript strictly with proper type definitions
3. **Testing**: Maintain comprehensive test coverage for all components
4. **Accessibility**: Ensure keyboard navigation and screen reader compatibility

### Code Style

- Use ESLint configuration provided in the repository
- Follow Prettier formatting rules
- Maintain consistent import/export patterns

## Troubleshooting

### Common Issues

- **Authentication Errors**: Verify `UPSTAGE_API_KEY` format and validity
- **Terminal Rendering**: Check terminal capabilities and theme compatibility
- **Performance Issues**: Monitor memory usage and enable debugging logs

### Debug Logging

Enable detailed logging for troubleshooting:

```bash
DEBUG=solar:* npm start
```

## Related Documentation

- [Core Package Documentation](../core/README.md)
- [Architecture Overview](../../docs/architecture.md)
- [Configuration Guide](../../docs/cli/configuration.md)
- [Theme System](../../docs/cli/themes.md)
