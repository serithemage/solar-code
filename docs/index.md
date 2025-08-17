# Welcome to Solar Code documentation

This documentation provides a comprehensive guide to installing, using, and developing Solar Code. This tool lets you interact with Upstage Solar Pro2 models through a command-line interface, bringing AI-powered coding assistance to your terminal.

## Overview

Solar Code brings the capabilities of Upstage Solar Pro2 models to your terminal in an interactive Read-Eval-Print Loop (REPL) environment. Based on the proven Gemini CLI architecture, Solar Code has been enhanced specifically for Solar Pro2 integration and optimized for Korean developers and organizations.

Solar Code consists of a client-side application (`packages/cli`) that communicates with a local server (`packages/core`), which in turn manages requests to the Upstage Solar API and its AI models. Solar Code also contains a comprehensive suite of tools for tasks such as performing file system operations, running shells, web fetching, and advanced coding assistance, all managed by `packages/core`.

### Key Features

- **Solar Pro2 Integration**: Native integration with Upstage Solar Pro2 for advanced AI coding assistance
- **Korean Language Support**: Enhanced support for Korean developers and documentation
- **Rich Tool Ecosystem**: Comprehensive set of development tools including file operations, shell commands, and web integration
- **VS Code Integration**: Seamless integration with VS Code through the IDE companion extension
- **Security**: Robust sandboxing and security features for safe tool execution

## Navigating the documentation

This documentation is organized into the following sections:

- **[Execution and Deployment](./deployment.md):** Information for running Solar Code.
- **[Architecture Overview](./architecture.md):** Understand the high-level design of Solar Code, including its components and how they interact with Solar Pro2.
- **CLI Usage:** Documentation for `packages/cli`.
  - **[CLI Introduction](./cli/index.md):** Overview of the command-line interface.
  - **[Commands](./cli/commands.md):** Description of available CLI commands.
  - **[Configuration](./cli/configuration.md):** Information on configuring the CLI.
  - **[Checkpointing](./checkpointing.md):** Documentation for the checkpointing feature.
  - **[Extensions](./extension.md):** How to extend the CLI with new functionality.
  - **[Telemetry](./telemetry.md):** Overview of telemetry in the CLI.
- **Core Details:** Documentation for `packages/core`.
  - **[Core Introduction](./core/index.md):** Overview of the core component.
  - **[Tools API](./core/tools-api.md):** Information on how the core manages and exposes tools.
- **Tools:**
  - **[Tools Overview](./tools/index.md):** Overview of the available tools.
  - **[File System Tools](./tools/file-system.md):** Documentation for the `read_file` and `write_file` tools.
  - **[Multi-File Read Tool](./tools/multi-file.md):** Documentation for the `read_many_files` tool.
  - **[Shell Tool](./tools/shell.md):** Documentation for the `run_shell_command` tool.
  - **[Web Fetch Tool](./tools/web-fetch.md):** Documentation for the `web_fetch` tool.
  - **[Web Search Tool](./tools/web-search.md):** Documentation for the `google_web_search` tool.
  - **[Memory Tool](./tools/memory.md):** Documentation for the `save_memory` tool.
- **Solar Code Specific:**
  - **[Solar Development Resources](../solar-code/README.md):** Solar-specific development resources, API setup, and Korean documentation.
  - **[Upstage API Setup Guide](../solar-code/UPSTAGE_API_SETUP.md):** Comprehensive guide for configuring Upstage Solar Pro2 API.
  - **[Development Tasks](../solar-code/DEVELOPMENT_TASKS.md):** Detailed development task breakdown and project management.
- **Package Documentation:**
  - **[CLI Package](../packages/cli/README.md):** Frontend package documentation and React/Ink UI components.
  - **[Core Package](../packages/core/README.md):** Backend package documentation and Solar Pro2 integration.
  - **[Test Utils](../packages/test-utils/README.md):** Shared testing utilities and file system helpers.
  - **[Scripts](../scripts/README.md):** Build scripts and development utilities.
  - **[Integration Tests](../integration-tests/README.md):** End-to-end integration test suite.
- **[Contributing & Development Guide](../CONTRIBUTING.md):** Information for contributors and developers, including setup, building, testing, and coding conventions.
- **[NPM Workspaces and Publishing](./npm.md):** Details on how the project's packages are managed and published.
- **[Troubleshooting Guide](./troubleshooting.md):** Find solutions to common problems and FAQs.
- **[Terms of Service and Privacy Notice](./tos-privacy.md):** Information on the terms of service and privacy notices applicable to your use of Solar Code.

We hope this documentation helps you make the most of Solar Code!
