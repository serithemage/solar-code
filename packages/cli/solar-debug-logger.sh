#!/bin/bash

# Solar CLI Debug Logger
# Usage: ./solar-debug-logger.sh "your prompt here"

PROMPT="${1:-테스트 프롬프트}"
TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
LOG_DIR="./debug-logs"
FULL_LOG="$LOG_DIR/solar-full-$TIMESTAMP.log"
API_LOG="$LOG_DIR/solar-api-$TIMESTAMP.log"
SUMMARY_LOG="$LOG_DIR/solar-summary-$TIMESTAMP.log"

# Create log directory
mkdir -p "$LOG_DIR"

echo "🚀 Solar CLI Debug Session Started"
echo "📝 Prompt: $PROMPT"
echo "📁 Log Directory: $LOG_DIR"
echo "🕐 Timestamp: $TIMESTAMP"
echo ""

# Run Solar CLI with debug logging
echo "▶️  Running Solar CLI..."
UPSTAGE_API_KEY="$UPSTAGE_API_KEY" DEBUG=true npx solar --debug --prompt "$PROMPT" 2>&1 | while read -r line; do
    # Add timestamp to each line
    echo "$(date '+%Y-%m-%d %H:%M:%S.%3N') $line"
done | tee "$FULL_LOG"

echo ""
echo "📊 Extracting API logs..."
# Extract API-specific logs
grep -E "(🌞|🌊|🔐)" "$FULL_LOG" > "$API_LOG"

echo "📋 Creating summary..."
# Create summary
{
    echo "# Solar CLI Debug Session Summary"
    echo "Date: $(date)"
    echo "Prompt: $PROMPT"
    echo ""
    echo "## API Calls Summary"
    echo "Total API calls: $(grep -c "Solar API" "$FULL_LOG")"
    echo "Streaming requests: $(grep -c "🌊.*Request" "$FULL_LOG")"
    echo "Streaming responses: $(grep -c "🌊.*Response" "$FULL_LOG")"
    echo ""
    echo "## Performance Summary"
    echo "Average response time: $(grep "duration:" "$FULL_LOG" | grep -o '[0-9]*ms' | sed 's/ms//' | awk '{sum+=$1; count++} END {if(count>0) printf "%.0fms\n", sum/count; else print "N/A"}')"
    echo ""
    echo "## Files Generated"
    echo "- Full log: $FULL_LOG"
    echo "- API log: $API_LOG"
    echo "- Summary: $SUMMARY_LOG"
} > "$SUMMARY_LOG"

echo ""
echo "✅ Debug session completed!"
echo "📁 Files created:"
echo "   📄 Full log: $FULL_LOG"
echo "   🔌 API log: $API_LOG"  
echo "   📊 Summary: $SUMMARY_LOG"
echo ""
echo "🔍 Quick view of API calls:"
echo "$(grep -c "🌊" "$API_LOG") streaming API interactions logged"