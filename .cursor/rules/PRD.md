# Solar Code Project Requirements Document (PRD)

## 1. 프로젝트 개요

### 1.1 프로젝트명

Solar Code

### 1.2 프로젝트 목적

Gemini CLI의 모델을 Gemini에서 Upstage Solar Pro2로 교체하여 동작하는 코드 어시스턴트 도구 구현

### 1.3 프로젝트 배경

- QwenLM의 qwen-code 프로젝트와 동일한 접근방식 활용
- Gemini CLI의 우수한 기능과 인터페이스를 유지하면서 Solar Pro2 모델 사용
- 국내 AI 모델 생태계 확장에 기여

## 2. 작업 내용 (qwen-code 분석 기반)

### 2.1 Phase 1: 기본 설정 및 모델 통합

#### 2.1.1 모델 설정 업데이트

- [ ] `packages/core/src/config/models.ts`에서 `DEFAULT_GEMINI_MODEL`을 `'solar-pro2'`로 변경
- [ ] Solar Pro2 관련 상수 추가

#### 2.1.2 ContentGenerator 확장

- [ ] `packages/core/src/core/openaiContentGenerator.ts`를 Solar Pro2 API에 맞게 수정
- [ ] Solar Pro2 전용 파라미터 추가 (필요시)
- [ ] 타임아웃 및 재시도 설정 조정 (기본: 120초, 3회 재시도)

#### 2.1.3 환경 변수 정의

- [ ] Solar Pro2 환경 변수 설정 (`SOLAR_API_KEY`, `SOLAR_MODEL`, `SOLAR_BASE_URL`)
- [ ] `contentGenerator.ts`에서 새 환경 변수 처리 로직 추가

### 2.2 Phase 2: 브랜딩 및 UI

#### 2.2.1 테마 생성

- [ ] `packages/cli/src/ui/themes/solar-dark.ts` 생성
- [ ] `packages/cli/src/ui/themes/solar-light.ts` 생성
- [ ] `theme-manager.ts`에 Solar 테마 등록

#### 2.2.2 브랜딩 요소

- [ ] ASCII 아트를 Solar 브랜드로 변경
- [ ] 제품명 및 문서 업데이트

### 2.3 Phase 3: API 호환성 구현

#### 2.3.1 API 어댑터 레이어

- [ ] Solar Pro2 API 응답 형식 조사
- [ ] 필요시 변환 로직 구현
- [ ] 에러 핸들링 조정

#### 2.3.2 기능 지원 확인

- [ ] 도구 호출(Function Calling) 지원 확인 및 구현
- [ ] 스트리밍 응답 지원 확인 및 구현
- [ ] 토큰 카운트 기능 구현

### 2.4 Phase 4: 테스트 및 문서화

#### 2.4.1 테스트 업데이트

- [ ] Solar Pro2용 mock 데이터 생성
- [ ] 통합 테스트 업데이트
- [ ] E2E 테스트 조정

#### 2.4.2 문서화

- [ ] README.md Solar Pro2용으로 업데이트
- [ ] 환경 설정 가이드 작성
- [ ] API 제한사항 및 베스트 프랙티스 문서화

### 2.5 Phase 5: 최적화 및 품질 보증

#### 2.5.1 성능 최적화

- [ ] Solar Pro2 rate limit에 맞춘 조정
- [ ] 응답 시간 측정 및 최적화
- [ ] 메모리 사용량 최적화

#### 2.5.2 에러 핸들링

- [ ] Solar Pro2 전용 에러 코드 처리
- [ ] 사용자 친화적 에러 메시지 구현

## 3. 기술적 구현 세부사항

### 3.1 핵심 변경 파일

- `packages/core/src/config/models.ts` - 모델 설정
- `packages/core/src/core/contentGenerator.ts` - 추상 인터페이스
- `packages/core/src/core/openaiContentGenerator.ts` - API 통합 구현
- `packages/cli/src/ui/themes/` - UI 테마
- 환경 변수 처리 관련 파일

### 3.2 API 통합 방식

- OpenAI 호환 API 사용 (Solar Pro2가 OpenAI 호환인 경우)
- 필요시 전용 SDK 또는 REST API 직접 호출
- 인증 타입에 `USE_SOLAR` 추가

### 3.3 구현 우선순위

1. **높음**: Phase 1-3 (기본 동작 구현)
2. **중간**: Phase 4 (품질 보증)
3. **낮음**: Phase 5 (최적화)

## 4. 업스트림 관리 전략

### 4.1 추적 대상

- google-gemini/gemini-cli: 주요 기능 업데이트
- QwenLM/qwen-code: 모델 통합 패턴 참고

### 4.2 머지 전략

- 보안 패치: 즉시 적용
- 기능 업데이트: 호환성 검토 후 선택적 적용
- Solar Pro2 특화 코드는 별도 관리

## 5. 성공 지표

### 5.1 기능적 지표

- Gemini CLI 핵심 기능 100% 동작
- Solar Pro2 API 호출 성공률 > 99%
- 모든 CLI 명령어 정상 작동

### 5.2 품질 지표

- 기존 테스트 통과율 > 95%
- 평균 응답 시간 < 5초
- 에러 발생률 < 1%

## 6. 참고 자료

- [Gemini CLI Repository](https://github.com/google-gemini/gemini-cli)
- [Qwen Code Repository](https://github.com/QwenLM/qwen-code)
- [Solar Pro2 Introduction](https://www.upstage.ai/blog/ko/solar-pro-2-preview-introduction)
