# Upstage Solar Pro2 API 설정 가이드

Solar Code에서 Upstage Solar Pro2 모델을 사용하기 위한 API 키 설정 방법을 안내합니다.

**참고 문서**: [Upstage 공식 Getting Started](https://console.upstage.ai/docs/getting-started)

## 📋 필수 환경 변수

Solar Code는 다음 환경 변수를 사용합니다:

### 필수 환경 변수

- `UPSTAGE_API_KEY`: Upstage API 키 (필수)

### 선택적 환경 변수

- `UPSTAGE_MODEL`: 사용할 Solar 모델명 (기본값: `solar-pro2`)
- `UPSTAGE_BASE_URL`: API 엔드포인트 URL (기본값: `https://api.upstage.ai/v1/solar`)
- `UPSTAGE_MAX_TOKENS`: 최대 토큰 수 (기본값: `4096`)
- `UPSTAGE_TIMEOUT`: API 타임아웃 (기본값: `120000ms`)
- `UPSTAGE_RETRY_COUNT`: 재시도 횟수 (기본값: `3`)

## 🔑 API 키 발급 방법

**Upstage 공식 가이드**: https://console.upstage.ai/docs/getting-started

### 1단계: 계정 생성

1. **Upstage 콘솔 접속**
   - https://console.upstage.ai/ 방문
   - 계정 생성 (신규 가입 시 **$10 무료 크레딧** 제공)

### 2단계: API 키 생성

1. **API Keys 페이지 이동**
   - 콘솔 로그인 후 `/api-keys` 페이지 이동
   - 또는 메뉴에서 "API Keys" 선택

2. **새 API 키 생성**
   - **"Create new key"** 버튼 클릭
   - API 키 이름 입력 (예: "Solar Code Development")
   - 생성된 API 키 복사 및 안전한 곳에 보관
   - ⚠️ **중요**: API 키는 생성 시 한 번만 표시됩니다

### 3단계: API 기능 확인

Upstage API는 다음 기능들을 제공합니다:

- **Chat**: 대화형 AI (Solar Pro2)
- **Document parsing**: 문서 파싱
- **Information extraction**: 정보 추출
- **Structured outputs**: 구조화된 출력
- **Function calling**: 도구 호출
- **Embeddings**: 벡터 임베딩

## ⚙️ 환경 변수 설정 방법

### 1. 임시 설정 (현재 터미널 세션에만 적용)

```bash
# 필수 설정
export UPSTAGE_API_KEY="your_upstage_api_key_here"

# 선택적 설정
export UPSTAGE_MODEL="solar-pro2"
export UPSTAGE_BASE_URL="https://api.upstage.ai/v1/solar"
export UPSTAGE_MAX_TOKENS="4096"
export UPSTAGE_TIMEOUT="120000"
export UPSTAGE_RETRY_COUNT="3"
```

### 2. 영구 설정 (권장)

#### macOS / Linux (bash/zsh)

**~/.bashrc 또는 ~/.zshrc에 추가:**

```bash
# Solar Code 환경 변수 설정
export UPSTAGE_API_KEY="your_upstage_api_key_here"
export UPSTAGE_MODEL="solar-pro2"
export UPSTAGE_BASE_URL="https://api.upstage.ai/v1/solar"

# 설정 적용
source ~/.bashrc  # 또는 source ~/.zshrc
```

**명령어로 한 번에 추가:**

```bash
# bash 사용자
echo 'export UPSTAGE_API_KEY="your_upstage_api_key_here"' >> ~/.bashrc
echo 'export UPSTAGE_MODEL="solar-pro2"' >> ~/.bashrc
source ~/.bashrc

# zsh 사용자 (macOS 기본)
echo 'export UPSTAGE_API_KEY="your_upstage_api_key_here"' >> ~/.zshrc
echo 'export UPSTAGE_MODEL="solar-pro2"' >> ~/.zshrc
source ~/.zshrc
```

#### Windows

**PowerShell:**

```powershell
# 임시 설정
$env:UPSTAGE_API_KEY="your_upstage_api_key_here"
$env:UPSTAGE_MODEL="solar-pro2"

# 영구 설정 (사용자 환경 변수)
[Environment]::SetEnvironmentVariable("UPSTAGE_API_KEY", "your_upstage_api_key_here", "User")
[Environment]::SetEnvironmentVariable("UPSTAGE_MODEL", "solar-pro2", "User")
```

**Command Prompt:**

```cmd
# 임시 설정
set UPSTAGE_API_KEY=your_upstage_api_key_here
set UPSTAGE_MODEL=solar-pro2

# 영구 설정
setx UPSTAGE_API_KEY "your_upstage_api_key_here"
setx UPSTAGE_MODEL "solar-pro2"
```

### 3. .env 파일을 이용한 설정 (권장)

**프로젝트별 설정:**

```bash
# 프로젝트 루트 디렉터리에 .solar/.env 파일 생성
mkdir -p .solar
cat >> .solar/.env <<'EOF'
UPSTAGE_API_KEY=your_upstage_api_key_here
UPSTAGE_MODEL=solar-pro2
UPSTAGE_BASE_URL=https://api.upstage.ai/v1/solar
UPSTAGE_MAX_TOKENS=4096
UPSTAGE_TIMEOUT=120000
UPSTAGE_RETRY_COUNT=3
EOF
```

**사용자 전체 설정:**

```bash
# 홈 디렉터리에 .solar/.env 파일 생성
mkdir -p ~/.solar
cat >> ~/.solar/.env <<'EOF'
UPSTAGE_API_KEY=your_upstage_api_key_here
UPSTAGE_MODEL=solar-pro2
UPSTAGE_BASE_URL=https://api.upstage.ai/v1/solar
EOF
```

## 📁 .env 파일 검색 순서

Solar Code는 다음 순서로 .env 파일을 검색합니다:

1. **현재 디렉터리부터 상위로 검색:**
   - `.solar/.env`
   - `.env`

2. **홈 디렉터리:**
   - `~/.solar/.env`
   - `~/.env`

> **중요:** 첫 번째로 발견된 파일만 사용되며, 여러 파일이 병합되지 않습니다.

## ✅ 설정 확인

환경 변수가 올바르게 설정되었는지 확인:

```bash
# API 키 설정 확인 (보안상 마지막 4자리만 표시)
echo "UPSTAGE_API_KEY: ${UPSTAGE_API_KEY: -4}"

# 다른 환경 변수 확인
echo "UPSTAGE_MODEL: $UPSTAGE_MODEL"
echo "UPSTAGE_BASE_URL: $UPSTAGE_BASE_URL"
```

## 🚀 Solar Code 실행

환경 변수 설정 후 Solar Code 실행:

```bash
cd your-project/
npm start  # 또는 solar (패키지 설치 후)
```

## 🛠️ 문제 해결

### API 키 관련 오류

**오류 메시지:**

```
❌ UPSTAGE_API_KEY is required
```

**해결 방법:**

1. API 키가 올바르게 설정되었는지 확인
2. 터미널 재시작 후 다시 시도
3. `.env` 파일 위치 및 내용 확인

### API 호출 실패

**오류 메시지:**

```
❌ API call failed: 401 Unauthorized
```

**해결 방법:**

1. API 키의 유효성 확인
2. Upstage 콘솔에서 API 키 상태 확인
3. 새로운 API 키 생성 후 재설정

### 네트워크 연결 오류

**오류 메시지:**

```
❌ Network error: timeout
```

**해결 방법:**

1. 인터넷 연결 상태 확인
2. `UPSTAGE_TIMEOUT` 값 증가
3. 방화벽/프록시 설정 확인

## 🔗 추가 리소스

Upstage에서 제공하는 유용한 리소스들:

### 공식 문서 및 예제

- **[GitHub Cookbook](https://github.com/UpstageAI/cookbook)**: 종합적인 사용 예제
- **[Solar Prompt Cookbook](https://console.upstage.ai/docs/solar-prompt-cookbook)**: Solar 모델 프롬프트 가이드
- **[Solar Pro 2 Prompt Handbook](https://console.upstage.ai/docs/solar-pro2-handbook)**: Solar Pro2 전용 가이드

### API 테스트

API 키 설정 후 간단한 테스트:

```bash
# Solar Pro2 API 테스트 (curl 사용)
curl -X POST "https://api.upstage.ai/v1/solar/chat/completions" \
  -H "Authorization: Bearer $UPSTAGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "solar-pro2",
    "messages": [
      {
        "role": "user",
        "content": "안녕하세요! Solar Pro2입니다. 한국어로 답변해주세요."
      }
    ],
    "max_tokens": 100
  }'
```

## 🔒 보안 주의사항

1. **API 키 보안:**
   - API 키를 코드에 하드코딩하지 마세요
   - `.env` 파일을 Git에 커밋하지 마세요
   - `.gitignore`에 `.env`, `.solar/.env` 추가

2. **권한 관리:**
   - API 키에는 필요한 최소 권한만 부여
   - 주기적으로 API 키 갱신 (Upstage 콘솔에서 관리)
   - 사용하지 않는 API 키는 즉시 비활성화

3. **크레딧 관리:**
   - 신규 가입 시 $10 무료 크레딧 제공
   - Upstage 콘솔에서 사용량 모니터링
   - 크레딧 소진 전 충전 또는 요금제 설정

## 📞 지원

설정 관련 문제가 지속되면:

- **[Upstage 공식 문서](https://console.upstage.ai/docs/getting-started)**
- **[Upstage GitHub Cookbook](https://github.com/UpstageAI/cookbook)**
- **[Solar Code GitHub Issues](https://github.com/solar-code/solar-code/issues)**

---

이 가이드를 따라 설정하면 Solar Code에서 Upstage Solar Pro2를 성공적으로 사용할 수 있습니다.
