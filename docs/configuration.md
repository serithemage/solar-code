# Solar Code Configuration Guide

This guide explains how to configure Solar Code to work with both Gemini and Solar Pro2 APIs.

## Quick Start

### Solar Pro2 Setup

1. **Get your API key** from [Upstage Console](https://console.upstage.ai/)
2. **Set environment variable**:
   ```bash
   export UPSTAGE_API_KEY="up-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```
3. **Test the setup**:
   ```bash
   solar --model solar-pro2 --prompt "Hello, Solar!"
   ```

### Auto Setup Guide

For detailed setup instructions, run:

```bash
solar --solar-setup
```

## Environment Variables

### Solar Pro2 (Required)

| Variable          | Required | Default | Description                                  |
| ----------------- | -------- | ------- | -------------------------------------------- |
| `UPSTAGE_API_KEY` | **Yes**  | -       | Your Upstage API key from console.upstage.ai |

### Solar Pro2 (Optional)

| Variable              | Required | Default                           | Description                                               |
| --------------------- | -------- | --------------------------------- | --------------------------------------------------------- |
| `UPSTAGE_MODEL`       | No       | `solar-pro2`                      | Model to use (`solar-pro2`, `solar-mini`, `solar-1-mini`) |
| `UPSTAGE_BASE_URL`    | No       | `https://api.upstage.ai/v1/solar` | API base URL                                              |
| `UPSTAGE_MAX_TOKENS`  | No       | `4096`                            | Maximum tokens per response (1-8192)                      |
| `UPSTAGE_TIMEOUT`     | No       | `120000`                          | Request timeout in milliseconds (1000-300000)             |
| `UPSTAGE_RETRY_COUNT` | No       | `3`                               | Number of retry attempts on failure (0-10)                |

### Gemini (Legacy Support)

| Variable                | Required | Default | Description                  |
| ----------------------- | -------- | ------- | ---------------------------- |
| `GEMINI_API_KEY`        | No       | -       | Google Gemini API key        |
| `GOOGLE_API_KEY`        | No       | -       | Google API key for Vertex AI |
| `GOOGLE_CLOUD_PROJECT`  | No       | -       | Google Cloud project ID      |
| `GOOGLE_CLOUD_LOCATION` | No       | -       | Google Cloud location        |

## Configuration Methods

### 1. Environment Variables (Recommended)

```bash
# Solar Pro2
export UPSTAGE_API_KEY="up-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export UPSTAGE_MODEL="solar-pro2"

# Or Gemini
export GEMINI_API_KEY="your_gemini_key_here"
```

### 2. .env File

Create a `.env` file in your project root:

```env
# Solar Pro2 Configuration
UPSTAGE_API_KEY=up-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
UPSTAGE_MODEL=solar-pro2
UPSTAGE_MAX_TOKENS=4096

# Gemini Configuration (optional, for fallback)
GEMINI_API_KEY=your_gemini_key_here
```

### 3. Command Line Arguments

```bash
# Use Solar Pro2
solar --model solar-pro2 --auth-type solar-api-key

# Use Gemini
solar --model gemini-2.0-flash --auth-type gemini-api-key
```

## Authentication Methods

Solar Code supports multiple authentication methods:

### `--auth-type solar-api-key`

- Uses Upstage API with UPSTAGE_API_KEY
- Supports all Solar models (solar-pro2, solar-mini, solar-1-mini)
- Best for Solar Pro2 usage

### `--auth-type gemini-api-key`

- Uses Google Gemini API with GEMINI_API_KEY
- Supports all Gemini models
- Direct API access

### `--auth-type oauth-personal`

- Uses OAuth2 authentication with Google
- Interactive login flow
- Default for authenticated usage

### `--auth-type vertex-ai`

- Uses Google Cloud Vertex AI
- Requires GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION
- Enterprise usage

### `--auth-type cloud-shell`

- Uses Google Cloud Shell authentication
- Automatic in Cloud Shell environments
- No setup required

## Model Selection

### Solar Models

| Model          | Context Length | Best For                        |
| -------------- | -------------- | ------------------------------- |
| `solar-pro2`   | 4,096 tokens   | General purpose, high quality   |
| `solar-mini`   | 4,096 tokens   | Faster responses, lighter tasks |
| `solar-1-mini` | 4,096 tokens   | Legacy support                  |

### Gemini Models

| Model              | Context Length   | Best For                      |
| ------------------ | ---------------- | ----------------------------- |
| `gemini-2.0-flash` | 1,048,576 tokens | Large contexts, complex tasks |
| `gemini-1.5-pro`   | 2,097,152 tokens | Maximum context length        |
| `gemini-1.5-flash` | 1,048,576 tokens | Balanced performance          |

## Usage Examples

### Solar Pro2 Examples

```bash
# Basic usage
solar --model solar-pro2 --prompt "Explain quantum computing"

# Interactive mode
solar --model solar-pro2 --prompt-interactive "Let's build a React app"

# With custom settings
UPSTAGE_MAX_TOKENS=2048 solar --model solar-pro2 -p "Write a poem"

# Debug mode
solar --model solar-pro2 --debug --prompt "Debug this code"
```

### Gemini Examples

```bash
# Large context with Gemini
solar --model gemini-2.0-flash --all-files --prompt "Analyze this codebase"

# Vertex AI
solar --model gemini-1.5-pro --auth-type vertex-ai --prompt "Enterprise query"
```

### Mixed Usage

```bash
# Auto-detect based on model
solar --model solar-pro2      # Uses Solar API automatically
solar --model gemini-2.0-flash # Uses Gemini API automatically

# Override authentication
solar --model solar-pro2 --auth-type solar-api-key
solar --model gemini-2.0-flash --auth-type gemini-api-key
```

## Troubleshooting

### Common Issues

#### "UPSTAGE_API_KEY is required"

```bash
# Solution: Set your API key
export UPSTAGE_API_KEY="up-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Or get setup help
solar --solar-setup
```

#### "Invalid UPSTAGE_API_KEY format"

- API keys should start with "up-" followed by 30+ alphanumeric characters
- Verify your key at https://console.upstage.ai/

#### "Model not supported"

```bash
# Check available models
solar --help

# Valid Solar models: solar-pro2, solar-mini, solar-1-mini
# Valid Gemini models: gemini-2.0-flash, gemini-1.5-pro, etc.
```

#### Connection timeout

```bash
# Increase timeout for slow networks
export UPSTAGE_TIMEOUT=300000  # 5 minutes

# Or reduce for faster failure
export UPSTAGE_TIMEOUT=30000   # 30 seconds
```

#### Rate limiting

```bash
# Increase retry count
export UPSTAGE_RETRY_COUNT=5

# Add delay between requests (handled automatically)
```

### Debug Mode

Use `--debug` flag for detailed debugging information:

```bash
solar --debug --model solar-pro2 --prompt "Test prompt"
```

This shows:

- API endpoint URLs
- Request/response details
- Token usage statistics
- Performance metrics

### Configuration Validation

Check your configuration:

```bash
# Show setup guide
solar --solar-setup

# Test with a simple prompt
solar --model solar-pro2 --prompt "Hello"

# Verify model selection
solar --debug --model solar-pro2 --prompt "Test" | grep -i "model"
```

## Priority Order

Configuration values are resolved in this order (highest to lowest priority):

1. **Command line arguments** (`--model`, `--auth-type`)
2. **Environment variables** (`UPSTAGE_API_KEY`, `UPSTAGE_MODEL`)
3. **Settings file** (if implemented in future versions)
4. **Default values** (`solar-pro2` for Solar, `gemini-2.0-flash` for Gemini)

## Security Considerations

### API Key Storage

- **Never commit API keys** to version control
- Use environment variables or secure secret management
- Consider using `.env` files with `.gitignore`

### Network Security

- All API calls use HTTPS
- API keys are sent securely via Authorization headers
- No API keys are logged (even in debug mode)

### Local Storage

- No API keys are stored locally by default
- Session data is stored in temporary directories
- Clear sensitive data with `rm -rf ~/.gemini/`

## Advanced Configuration

### Custom Base URLs

For self-hosted or proxy deployments:

```bash
# Custom Upstage endpoint
export UPSTAGE_BASE_URL="https://my-proxy.example.com/v1/solar"

# Custom Gemini endpoint (via proxy)
export HTTPS_PROXY="https://my-proxy.example.com:8080"
```

### Performance Tuning

```bash
# Optimize for speed
export UPSTAGE_MAX_TOKENS=1024
export UPSTAGE_TIMEOUT=60000

# Optimize for quality
export UPSTAGE_MAX_TOKENS=4096
export UPSTAGE_TIMEOUT=180000
export UPSTAGE_RETRY_COUNT=5
```

### Development Setup

```bash
# Development environment
export NODE_ENV=development
export DEBUG=true
export UPSTAGE_API_KEY="up-dev-key-here"

# Enable all debugging
solar --debug --model solar-pro2 --prompt "Debug test"
```

## Getting Help

- **Setup guide**: `solar --solar-setup`
- **Command help**: `solar --help`
- **Model list**: `solar --help | grep -A 20 "Model"`
- **GitHub Issues**: [Report problems](https://github.com/serithemage/solar-code/issues)
- **Upstage Console**: [API key management](https://console.upstage.ai/)

---

_This documentation is for Solar Code version 0.1.18+. For earlier versions, some features may not be available._
