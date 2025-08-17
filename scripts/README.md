# Solar Code Build Scripts

This directory contains build scripts, utilities, and automation tools for Solar Code development, testing, and deployment. These scripts provide the foundation for the Solar Code development workflow.

## Overview

The scripts directory includes Node.js-based build tools that handle TypeScript compilation, package bundling, asset management, testing coordination, and deployment preparation for the Solar Code project.

## Core Scripts

### 🔨 Build System

#### `build.js`

Main build orchestrator that coordinates the entire build process:

- **Dependency Management**: Automatically runs `npm install` if `node_modules` is missing
- **Package Building**: Builds all workspace packages in dependency order
- **Bundle Creation**: Creates the final distribution bundle
- **Asset Management**: Copies necessary assets and configuration files

```bash
npm run build        # Build all packages and create bundle
```

#### `build_package.js`

Individual package builder for workspace packages:

- **TypeScript Compilation**: Compiles TypeScript source to JavaScript
- **Validation**: Ensures script is run from correct package directory
- **Output Management**: Handles dist/ directory creation and cleanup

```bash
# Run from package directory
npm run build
```

#### `build_sandbox.js`

Sandbox environment builder for secure tool execution:

- **Container Building**: Creates Docker/Podman sandbox images
- **Security Configuration**: Sets up sandboxing profiles
- **Asset Preparation**: Prepares sandbox execution environment

#### `build_vscode_companion.js`

VS Code extension builder:

- **Extension Compilation**: Builds the VS Code IDE companion
- **Asset Management**: Handles extension assets and manifests
- **Distribution Preparation**: Prepares extension for marketplace

### 🚀 Development & Runtime

#### `start.js`

Development server and CLI launcher:

- **Build Status Checking**: Validates build status before starting
- **Development Mode**: Launches CLI in development mode with hot-reload
- **Memory Management**: Configures heap size for optimal performance
- **Debug Support**: Provides debugging capabilities and logging

```bash
npm start           # Start in development mode
npm run debug       # Start with debugger attached
```

#### `check-build-status.js`

Build validation and status reporting:

- **Package Validation**: Checks if all packages are built and up-to-date
- **Dependency Verification**: Validates workspace dependencies
- **Warning Generation**: Creates warning files for missing builds
- **Status Reporting**: Provides detailed build status information

### 🧹 Maintenance & Utilities

#### `clean.js`

Project cleanup utility:

- **Build Artifacts**: Removes dist/, coverage/, and build outputs
- **Dependencies**: Optionally removes node_modules/
- **Cache Cleanup**: Clears various cache directories
- **Temporary Files**: Removes log files and temporary artifacts

```bash
npm run clean       # Clean build artifacts
```

#### `copy_bundle_assets.js`

Asset management for distribution bundle:

- **Sandbox Assets**: Copies sandbox configuration files
- **Configuration Files**: Handles runtime configuration assets
- **Binary Assets**: Manages platform-specific binaries

#### `copy_files.js`

Generic file copying utility with pattern matching:

- **Pattern Matching**: Supports glob patterns for file selection
- **Directory Handling**: Recursively copies directory structures
- **Preservation**: Maintains file permissions and metadata

### 📦 Release & Distribution

#### `generate-git-commit-info.js`

Git integration for build metadata:

- **Commit Information**: Extracts current commit hash and metadata
- **Build Timestamps**: Adds build time information
- **Generated Files**: Creates git-commit.ts for runtime access
- **Version Tracking**: Integrates with version management

#### `get-release-version.js`

Version management and release preparation:

- **Version Extraction**: Gets current version from package.json
- **Release Tags**: Handles git tag extraction
- **Version Validation**: Validates semantic versioning
- **Release Notes**: Supports release note generation

#### `prepare-package.js`

Package preparation for publishing:

- **Metadata Validation**: Validates package.json fields
- **File Inclusion**: Ensures correct files are included in package
- **Dependency Verification**: Validates dependencies and versions
- **Distribution Preparation**: Prepares packages for npm publishing

### 🔧 Platform & Environment

#### `sandbox_command.js`

Sandbox execution management:

- **Command Execution**: Executes commands in sandboxed environments
- **Security Enforcement**: Applies security policies and restrictions
- **Resource Management**: Manages sandbox resource allocation
- **Cross-Platform**: Supports Docker, Podman, and native sandboxing

#### `test-windows-paths.js`

Windows path compatibility testing:

- **Path Validation**: Tests Windows-specific path handling
- **Cross-Platform**: Ensures compatibility across operating systems
- **Edge Cases**: Tests special characters and long paths

#### `create_alias.sh`

Shell script for creating command aliases:

- **CLI Aliases**: Creates convenient command aliases
- **Path Setup**: Configures PATH for global CLI access
- **Shell Integration**: Supports various shell environments

### 📊 Telemetry & Monitoring

#### `telemetry.js`

Main telemetry coordination:

- **Usage Analytics**: Collects anonymous usage statistics
- **Performance Metrics**: Tracks performance data
- **Error Reporting**: Handles error telemetry
- **Privacy Compliance**: Ensures privacy policy compliance

#### `telemetry_gcp.js`

Google Cloud Platform telemetry integration:

- **GCP Integration**: Sends telemetry to Google Cloud
- **Data Formatting**: Formats data for GCP ingestion
- **Authentication**: Handles GCP service authentication

#### `telemetry_utils.js`

Telemetry utility functions:

- **Data Processing**: Common telemetry data processing
- **Privacy Filters**: Removes sensitive information
- **Batching**: Handles batched telemetry submission

#### `local_telemetry.js`

Local telemetry for development:

- **Development Mode**: Local telemetry for testing
- **File Output**: Writes telemetry to local files
- **Debug Support**: Provides telemetry debugging capabilities

### 🔄 Version Management

#### `version.js`

Version management utilities:

- **Version Reading**: Extracts version from various sources
- **Version Formatting**: Handles different version formats
- **Validation**: Validates version strings and formats

## Build Process Flow

### 1. Development Build

```bash
npm run build:all
```

1. `clean.js` - Clean previous builds
2. `check-build-status.js` - Validate build prerequisites
3. `generate-git-commit-info.js` - Generate git metadata
4. `build_package.js` - Build each package
5. `build.js` - Create final bundle
6. `copy_bundle_assets.js` - Copy runtime assets

### 2. Distribution Build

```bash
npm run bundle
```

1. All development build steps
2. `prepare-package.js` - Prepare packages for distribution
3. `build_vscode_companion.js` - Build VS Code extension
4. Asset optimization and compression

### 3. Testing Build

```bash
npm run test:ci
```

1. Standard build process
2. `build_sandbox.js` - Build test sandbox environments
3. Test execution with sandbox validation

## Configuration

### Environment Variables

Scripts respect various environment variables:

- `NODE_ENV` - Development/production mode
- `DEBUG` - Debug logging level
- `SOLAR_SANDBOX` - Sandbox configuration (docker/podman/none)
- `CI` - Continuous integration mode

### Build Configuration

Build configuration is managed through:

- `package.json` - Package-level build configuration
- `tsconfig.json` - TypeScript compilation settings
- `esbuild.config.js` - Bundle configuration
- Environment-specific config files

## Development Guidelines

### Adding New Scripts

When adding new build scripts:

1. **Follow Patterns**: Use existing script patterns and structure
2. **Error Handling**: Implement robust error handling and reporting
3. **Documentation**: Add comprehensive script documentation
4. **Testing**: Include script testing in CI pipeline

### Script Organization

- **Single Responsibility**: Each script should have a clear, single purpose
- **Reusability**: Create reusable utilities for common operations
- **Cross-Platform**: Ensure compatibility across operating systems
- **Performance**: Optimize for build speed and resource usage

### Error Handling

Scripts implement consistent error handling:

- **Exit Codes**: Use appropriate exit codes for different error types
- **Logging**: Provide clear, actionable error messages
- **Recovery**: Implement recovery mechanisms where possible
- **Validation**: Validate inputs and prerequisites

## Platform Support

### Operating Systems

- **macOS**: Full support with native sandboxing
- **Linux**: Full support with Docker/Podman sandboxing
- **Windows**: Full support with WSL and Docker Desktop

### Node.js Compatibility

- **Minimum Version**: Node.js 20+
- **ES Modules**: Scripts use ES module syntax
- **Modern APIs**: Utilizes modern Node.js APIs and features

## Performance Optimization

### Build Speed

- **Parallel Execution**: Builds packages in parallel where possible
- **Incremental Builds**: Only rebuilds changed components
- **Caching**: Implements intelligent caching strategies
- **Resource Management**: Optimizes memory and CPU usage

### Bundle Size

- **Tree Shaking**: Removes unused code from bundles
- **Code Splitting**: Splits bundles for optimal loading
- **Asset Optimization**: Compresses and optimizes assets
- **Dependency Analysis**: Analyzes and optimizes dependencies

## Troubleshooting

### Common Issues

- **Build Failures**: Check build status and dependency installation
- **Sandbox Issues**: Verify Docker/Podman installation and configuration
- **Path Problems**: Ensure correct working directory and PATH configuration
- **Permission Errors**: Check file and directory permissions

### Debug Mode

Enable debug logging for script troubleshooting:

```bash
DEBUG=* npm run build
```

### Build Status

Check detailed build status:

```bash
node scripts/check-build-status.js
```

## Related Documentation

- [Package Documentation](../packages/)
- [Development Workflow](../CONTRIBUTING.md)
- [Architecture Overview](../docs/architecture.md)
- [Deployment Guide](../docs/deployment.md)
