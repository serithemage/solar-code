# Solar Code Debugging Guide

## 🐛 Quick Start

Solar Code provides comprehensive debugging tools through the Makefile for easier development and troubleshooting.

### Basic Debug Commands

```bash
# View all debug commands
make debug-help

# Basic debug logging with timestamps
make debug-log

# Debug with custom prompt (interactive)
make debug-prompt

# Log API calls only
make debug-api

# Live debug session (interactive)
make debug-live
```

### Advanced Debugging

```bash
# Performance metrics and timing
make debug-perf

# Memory profiling
make debug-memory

# Verbose output (maximum detail)
make debug-verbose

# Custom filter pattern
make debug-filter
# Then enter pattern like: error|warning|Solar API

# Run the debug script with custom prompt
make debug-script PROMPT="Create a hello.txt file"
```

### Log Management

```bash
# View recent debug logs
make logs

# Show log statistics
make log-summary

# Clean all debug logs
make debug-clean
```

## 📁 Log Storage

All debug logs are saved to the `debug-logs/` directory with timestamps:
- `solar-debug-YYYYMMDD-HHMMSS.log` - Full debug logs
- `solar-api-YYYYMMDD-HHMMSS.log` - API-only logs
- `solar-perf-YYYYMMDD-HHMMSS.log` - Performance logs
- `solar-memory-YYYYMMDD-HHMMSS.log` - Memory profile logs

## 🔧 Environment Variables

```bash
# Required for API access
export UPSTAGE_API_KEY="your_api_key_here"

# Enable debug mode
export DEBUG=true

# Enable verbose output
export VERBOSE=true

# Set memory limit (in MB)
export NODE_OPTIONS="--max-old-space-size=4096"
```

## 📊 Performance Analysis

The `make debug-perf` command provides:
- Total API call count
- Average response time calculation
- Timing metrics using `time` command
- Performance summary in log file

## 🔍 Filtering and Analysis

### API Call Analysis
```bash
# Extract only API interactions
make debug-api

# Or manually filter existing logs
grep -E '(🌞|🌊|🔐)' debug-logs/solar-debug-*.log
```

### Error Analysis
```bash
# Filter for errors and warnings
make debug-filter
# Enter: error|warning|Error|Warning

# Or search in existing logs
grep -i error debug-logs/*.log
```

### Performance Metrics
```bash
# Extract response times from logs
grep 'duration:' debug-logs/*.log | grep -o '[0-9]*ms'

# Count API calls
grep -c 'Solar API' debug-logs/*.log
```

## 💡 Tips

1. **For API debugging**: Use `make debug-api` to focus on API calls only
2. **For performance issues**: Use `make debug-perf` to identify bottlenecks
3. **For memory issues**: Use `make debug-memory` with heap monitoring
4. **For general debugging**: Start with `make debug-log` for complete logs

## 📜 Debug Logger Script

The project includes a dedicated debug script at `packages/cli/solar-debug-logger.sh`:

```bash
# Run directly
./packages/cli/solar-debug-logger.sh "your prompt"

# Or through Make
make debug-script PROMPT="your prompt"
```

This script creates:
- Full timestamped logs
- Filtered API logs
- Performance summary report

## 🚨 Common Issues

### API Key Not Set
```bash
# Set your API key first
export UPSTAGE_API_KEY="up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Permission Denied
```bash
# Make scripts executable
chmod +x packages/cli/solar-debug-logger.sh
```

### Out of Memory
```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=8192" make debug-memory
```

## 📝 Log Format

Debug logs include:
- Timestamps for each line
- API request/response details
- Performance metrics
- Memory usage (when enabled)
- Error stack traces
- Tool execution logs

Example log entry:
```
2024-08-17 23:10:40 🌞 Solar API Request
2024-08-17 23:10:40 Model: solar-pro2
2024-08-17 23:10:41 🌊 Streaming Response Started
2024-08-17 23:10:42 Duration: 1234ms
```

## 🔗 Related Documentation

- [Debug Logging Guide](packages/cli/debug-logging-guide.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Solar API Documentation](solar-code/UPSTAGE_API_SETUP.md)