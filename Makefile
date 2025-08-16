# Solar Code CLI Makefile
# Build and install Solar Code command-line tool

.PHONY: help deps build build-all install uninstall test lint format preflight clean start debug dev check install-dev uninstall-dev solar-retro

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
