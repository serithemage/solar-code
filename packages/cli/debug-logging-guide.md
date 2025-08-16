# Solar CLI 디버그 로그 저장 방법들

## 1. 표준 출력과 에러를 모두 파일에 저장
UPSTAGE_API_KEY=$UPSTAGE_API_KEY DEBUG=true npx solar --debug --prompt "테스트" > solar-debug.log 2>&1

## 2. 콘솔과 파일에 동시 출력 (tee 사용)  
UPSTAGE_API_KEY=$UPSTAGE_API_KEY DEBUG=true npx solar --debug --prompt "테스트" 2>&1 | tee solar-debug.log

## 3. 타임스탬프와 함께 저장
UPSTAGE_API_KEY=$UPSTAGE_API_KEY DEBUG=true npx solar --debug --prompt "테스트" 2>&1 | while read line; do echo "$(date '+%Y-%m-%d %H:%M:%S') $line"; done | tee solar-debug-timestamped.log

## 4. 디버그 로그만 필터링해서 저장
UPSTAGE_API_KEY=$UPSTAGE_API_KEY DEBUG=true npx solar --debug --prompt "테스트" 2>&1 | grep -E '(🌞|🌊|🔐|DEBUG)' | tee solar-api-debug.log

## 5. 날짜별 로그 파일 생성
UPSTAGE_API_KEY=$UPSTAGE_API_KEY DEBUG=true npx solar --debug --prompt "테스트" 2>&1 | tee "solar-debug-$(date '+%Y%m%d-%H%M%S').log"

