# Solar Code CLI Makefile
# Build and install Solar Code command-line tool

.PHONY: help deps build build-all install uninstall test lint format preflight clean start debug dev check install-dev uninstall-dev solar-retro debug-log debug-api debug-live debug-filter debug-clean logs

help:
	@echo "Solar Code CLI - Build and Installation"
	@echo ""
	@echo "📋 Available targets:"
	@echo "  help          - Show this help message"
	@echo "  deps          - Install npm dependencies"
	@echo "  build         - Build the Solar Code CLI"
	@echo "  build-all     - Build the main project and sandbox"
	@echo "  install       - Install Solar Code globally (npm install -g)"
	@echo "  uninstall     - Remove Solar Code from system"
	@echo "  install-dev   - Install for development (npm link)"
	@echo "  uninstall-dev - Remove development symlink"
	@echo "  test          - Run all tests"
	@echo "  lint          - Run ESLint checks"
	@echo "  format        - Format code with Prettier"
	@echo "  preflight     - Run complete quality check pipeline"
	@echo "  clean         - Remove generated files and caches"
	@echo "  start         - Start Solar Code in development mode"
	@echo "  debug         - Start Solar Code in debug mode"
	@echo "  dev           - Setup development environment"
	@echo "  check         - Verify Solar Code installation"
	@echo ""
	@echo "🐛 Debugging targets:"
	@echo "  debug-log     - Run with debug logging (timestamped)"
	@echo "  debug-api     - Log API calls only"
	@echo "  debug-perf    - Debug with performance metrics"
	@echo "  debug-help    - Show all debug commands"
	@echo ""
	@echo "  solar-retro   - Display Solar Code retro logo"
	@echo ""
	@echo "🚀 Quick start:"
	@echo "  make install    # Build and install Solar Code globally"
	@echo "  solar --help    # Verify installation"
	@echo ""
	@echo "💻 Development:"
	@echo "  make dev         # Setup development environment"
	@echo "  make install-dev # Install with symlink for development"

# Install dependencies
deps:
	@echo "📦 Installing dependencies..."
	npm ci

# Build the project
build: deps
	@echo "🔨 Building Solar Code CLI..."
	npm run build
	npm run bundle

# Build all including sandbox
build-all: deps
	@echo "🔨 Building Solar Code CLI with sandbox..."
	npm run build:all

# Install Solar Code globally
install: build
	@echo "🚀 Installing Solar Code globally..."
	npm install -g .
	@echo ""
	@echo "✅ Solar Code installed successfully!"
	@echo "📍 You can now use 'solar' command from anywhere."
	@echo "🔧 Run 'solar --help' to get started."

# Uninstall Solar Code
uninstall:
	@echo "🗑️  Uninstalling Solar Code..."
	npm uninstall -g @upstage/solar-cli
	@echo "✅ Solar Code uninstalled successfully!"

# Install for development (symlink)
install-dev: build
	@echo "🔗 Installing Solar Code locally for development..."
	npm link
	@echo "✅ Solar Code linked for development!"
	@echo "📍 Changes will be reflected immediately."

# Remove development symlink
uninstall-dev:
	@echo "🔗 Removing development symlink..."
	npm unlink -g @upstage/solar-cli
	@echo "✅ Development symlink removed!"

# Run tests
test: deps
	@echo "🧪 Running all tests..."
	npm test

# Lint code
lint: deps
	@echo "🧹 Running linter..."
	npm run lint

# Fix linting issues
lint-fix: deps
	@echo "🧹 Fixing linting issues..."
	npm run lint:fix

# Format code
format: deps
	@echo "📝 Formatting code..."
	npm run format

# Run complete quality check
preflight: deps
	@echo "🚀 Running complete quality check pipeline..."
	npm run preflight

# Clean build artifacts and caches
clean:
	@echo "🧹 Cleaning build artifacts and caches..."
	npm run clean
	rm -rf node_modules
	rm -rf packages/*/node_modules
	rm -rf bundle
	rm -rf packages/*/dist
	rm -rf .git/.cache
	rm -rf .eslintcache
	@echo "✅ Clean completed!"

# Start in development mode
start: deps
	@echo "🚀 Starting Solar Code in development mode..."
	npm run start

# Start in debug mode
debug: deps
	@echo "🐛 Starting Solar Code in debug mode..."
	npm run debug

# Development setup
dev: deps
	@echo "💻 Setting up development environment..."
	npm run build
	@echo "✅ Development setup completed!"
	@echo "🔧 You can now run 'make start' or 'make install-dev'"

# Check installation
check:
	@echo "🔍 Checking Solar Code installation..."
	@which solar > /dev/null && echo "✅ Solar Code is installed at: $$(which solar)" || echo "❌ Solar Code is not installed"
	@solar --version 2>/dev/null && echo "✅ Solar Code is working!" || echo "❌ Solar Code command not working"

solar-retro:
	@echo "🌞 Solar Code - Retro Terminal Experience"
	@echo "========================================="
	@node solar-code/solar-retro.js

# ========================================
# 🐛 Debugging Targets
# ========================================

# Debug log with timestamp (default prompt)
debug-log:
	@echo "🐛 Starting debug session with logging..."
	@mkdir -p debug-logs
	@TIMESTAMP=$$(date '+%Y%m%d-%H%M%S') && \
	UPSTAGE_API_KEY=$(UPSTAGE_API_KEY) DEBUG=true npx solar --debug --yolo --prompt "hello.md에 'Hellow World' 문자열을 적어줘" 2>&1 | \
	while read line; do echo "$$(date '+%Y-%m-%d %H:%M:%S') $$line"; done | \
	tee "debug-logs/solar-debug-$$TIMESTAMP.log"
	@echo "✅ Debug log saved to debug-logs/"

# Debug with custom prompt
debug-prompt:
	@echo "🐛 Starting debug session with custom prompt..."
	@read -p "Enter prompt: " prompt; \
	mkdir -p debug-logs; \
	TIMESTAMP=$$(date '+%Y%m%d-%H%M%S') && \
	UPSTAGE_API_KEY=$(UPSTAGE_API_KEY) DEBUG=true npx solar --debug --yolo --prompt "$$prompt" 2>&1 | \
	while read line; do echo "$$(date '+%Y-%m-%d %H:%M:%S') $$line"; done | \
	tee "debug-logs/solar-debug-$$TIMESTAMP.log"
	@echo "✅ Debug log saved to debug-logs/"

# Debug API calls only
debug-api:
	@echo "🔌 Logging API calls only..."
	@mkdir -p debug-logs
	@TIMESTAMP=$$(date '+%Y%m%d-%H%M%S') && \
	UPSTAGE_API_KEY=$(UPSTAGE_API_KEY) DEBUG=true npx solar --debug --yolo --prompt "테스트" 2>&1 | \
	grep -E '(🌞|🌊|🔐|Solar API|Request|Response)' | \
	tee "debug-logs/solar-api-$$TIMESTAMP.log"
	@echo "✅ API log saved to debug-logs/"

# Live debug with colorized output
debug-live:
	@echo "🔴 Starting live debug session (press Ctrl+C to stop)..."
	@UPSTAGE_API_KEY=$(UPSTAGE_API_KEY) DEBUG=true npx solar --debug --yolo

# Debug with filtering
debug-filter:
	@echo "🔍 Debug with custom filter..."
	@read -p "Enter filter pattern (e.g., 'error|warning'): " filter; \
	mkdir -p debug-logs; \
	TIMESTAMP=$$(date '+%Y%m%d-%H%M%S') && \
	UPSTAGE_API_KEY=$(UPSTAGE_API_KEY) DEBUG=true npx solar --debug --yolo --prompt "테스트" 2>&1 | \
	grep -E "$$filter" | \
	tee "debug-logs/solar-filtered-$$TIMESTAMP.log"
	@echo "✅ Filtered log saved to debug-logs/"

# Run the debug logger script
debug-script:
	@echo "📜 Running debug logger script..."
	@chmod +x packages/cli/solar-debug-logger.sh
	@cd packages/cli && ./solar-debug-logger.sh "$(PROMPT)"

# Debug with performance metrics
debug-perf:
	@echo "📊 Debug with performance metrics..."
	@mkdir -p debug-logs
	@TIMESTAMP=$$(date '+%Y%m%d-%H%M%S') && \
	LOG_FILE="debug-logs/solar-perf-$$TIMESTAMP.log" && \
	UPSTAGE_API_KEY=$(UPSTAGE_API_KEY) DEBUG=true time -p npx solar --debug --yolo --prompt "테스트" 2>&1 | \
	tee "$$LOG_FILE" && \
	echo "" >> "$$LOG_FILE" && \
	echo "=== Performance Summary ===" >> "$$LOG_FILE" && \
	echo "Total API calls: $$(grep -c 'Solar API' $$LOG_FILE)" >> "$$LOG_FILE" && \
	echo "Average response time: $$(grep 'duration:' $$LOG_FILE | grep -o '[0-9]*ms' | sed 's/ms//' | awk '{sum+=$$1; count++} END {if(count>0) printf \"%.0fms\", sum/count; else print \"N/A\"}')" >> "$$LOG_FILE"
	@echo "✅ Performance log saved to debug-logs/"

# Debug with memory profiling
debug-memory:
	@echo "💾 Debug with memory profiling..."
	@mkdir -p debug-logs
	@TIMESTAMP=$$(date '+%Y%m%d-%H%M%S') && \
	NODE_OPTIONS="--max-old-space-size=4096" \
	UPSTAGE_API_KEY=$(UPSTAGE_API_KEY) DEBUG=true \
	npx solar --debug --yolo --show-memory-usage --prompt "테스트" 2>&1 | \
	tee "debug-logs/solar-memory-$$TIMESTAMP.log"
	@echo "✅ Memory profile log saved to debug-logs/"

# Debug with verbose output
debug-verbose:
	@echo "📢 Debug with verbose output..."
	@mkdir -p debug-logs
	@TIMESTAMP=$$(date '+%Y%m%d-%H%M%S') && \
	UPSTAGE_API_KEY=$(UPSTAGE_API_KEY) DEBUG=true VERBOSE=true \
	npx solar --debug --yolo --prompt "테스트" 2>&1 | \
	tee "debug-logs/solar-verbose-$$TIMESTAMP.log"
	@echo "✅ Verbose log saved to debug-logs/"

# Show recent debug logs
logs:
	@echo "📋 Recent debug logs:"
	@ls -lht debug-logs/ 2>/dev/null | head -10 || echo "No debug logs found. Run 'make debug-log' to create one."

# Show log summary
log-summary:
	@echo "📊 Debug log summary:"
	@if [ -d debug-logs ]; then \
		echo "Total logs: $$(ls debug-logs/*.log 2>/dev/null | wc -l)"; \
		echo "Total size: $$(du -sh debug-logs 2>/dev/null | cut -f1)"; \
		echo "Latest log: $$(ls -t debug-logs/*.log 2>/dev/null | head -1)"; \
	else \
		echo "No debug logs directory found."; \
	fi

# Clean debug logs
debug-clean:
	@echo "🧹 Cleaning debug logs..."
	@rm -rf debug-logs/
	@rm -f solar-debug*.log
	@rm -f solar-api*.log
	@rm -f solar-*.log
	@echo "✅ Debug logs cleaned!"

# Debug help
debug-help:
	@echo "🐛 Solar Code Debug Commands"
	@echo "============================="
	@echo ""
	@echo "📋 Available debug targets:"
	@echo "  make debug-log      - Run with debug logging (timestamped)"
	@echo "  make debug-prompt   - Debug with custom prompt (interactive)"
	@echo "  make debug-api      - Log API calls only"
	@echo "  make debug-live     - Live debug session (interactive)"
	@echo "  make debug-filter   - Debug with custom filter"
	@echo "  make debug-script   - Run the debug logger script"
	@echo "  make debug-perf     - Debug with performance metrics"
	@echo "  make debug-memory   - Debug with memory profiling"
	@echo "  make debug-verbose  - Debug with verbose output"
	@echo "  make logs           - Show recent debug logs"
	@echo "  make log-summary    - Show debug log statistics"
	@echo "  make debug-clean    - Clean all debug logs"
	@echo "  make debug-help     - Show this help message"
	@echo ""
	@echo "🔧 Examples:"
	@echo "  make debug-log                    # Basic debug logging"
	@echo "  make debug-prompt                 # Interactive prompt input"
	@echo "  make debug-api                    # API-only logging"
	@echo "  make debug-script PROMPT='test'   # Run with specific prompt"
	@echo ""
	@echo "📁 Logs are saved to: debug-logs/"
