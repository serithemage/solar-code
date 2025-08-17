# 🔧 Solar CLI 무한 루프 문제 해결 방안

## 🎯 문제 근본 원인

**위치**: `packages/core/src/core/client.ts:359-370`

```typescript
if (nextSpeakerCheck?.next_speaker === 'model') {
  const nextRequest = [{ text: 'Please continue.' }];
  yield *
    this.sendMessageStream(
      nextRequest,
      signal,
      prompt_id,
      boundedTurns - 1,
      initialModel,
    );
}
```

**원인**:

1. `nextSpeakerChecker`가 Solar API를 호출하여 대화 지속 여부 판단
2. "model"이 다음 발화자라고 판단하면 자동으로 "Please continue." 생성
3. 이로 인해 무한 루프 발생

## 💡 해결 방안 (3가지 옵션)

### 🚨 옵션 1: 즉시 해결 (Auto-Continue 비활성화)

**장점**: 즉시 문제 해결, Gemini CLI와 동일한 동작
**단점**: 기존 기능 완전 제거

```typescript
// packages/core/src/core/client.ts
// 라인 359-370을 주석 처리 또는 조건부 비활성화
if (false && nextSpeakerCheck?.next_speaker === 'model') {
  // 자동 연속 기능 비활성화
}
```

### ⚖️ 옵션 2: 설정을 통한 제어

**장점**: 사용자 선택권 제공, 기존 기능 보존
**단점**: 구현 복잡도 증가

```typescript
// 설정 추가
const autoContiueEnabled = this.config.getAutoContineEnabled() ?? false;

if (autoContiueEnabled && nextSpeakerCheck?.next_speaker === 'model') {
  const nextRequest = [{ text: 'Please continue.' }];
  yield *
    this.sendMessageStream(
      nextRequest,
      signal,
      prompt_id,
      boundedTurns - 1,
      initialModel,
    );
}
```

### 🛡️ 옵션 3: 안전 가드 추가

**장점**: 무한 루프 방지하면서 기능 유지
**단점**: 여전히 불필요한 API 호출 발생 가능

```typescript
// 연속 호출 카운터 추가
private continuationCount = new Map<string, number>();
private maxContinuations = 3;

if (nextSpeakerCheck?.next_speaker === 'model') {
  const currentCount = this.continuationCount.get(prompt_id) || 0;
  if (currentCount < this.maxContinuations) {
    this.continuationCount.set(prompt_id, currentCount + 1);
    const nextRequest = [{ text: 'Please continue.' }];
    yield* this.sendMessageStream(nextRequest, signal, prompt_id, boundedTurns - 1, initialModel);
  }
}
```

## 🏃‍♂️ 권장 해결책: 옵션 1 (즉시 비활성화)

**이유**:

1. Gemini CLI는 이 기능 없이 정상 작동
2. 사용자 경험 개선 (무한 대기 방지)
3. API 비용 절약
4. 즉시 적용 가능

### 구체적 구현:

```typescript
// packages/core/src/core/client.ts 라인 359 수정
if (false) {
  // nextSpeakerCheck?.next_speaker === 'model'로 되어 있던 것을 false로 변경
  const nextRequest = [{ text: 'Please continue.' }];
  // ... 기존 코드
}
```

## 🧪 테스트 계획

### 수정 전 테스트

```bash
DEBUG=true npx solar --debug --prompt "테스트" > test-before.log
# 예상: 무한 루프, 2000+ 줄 로그
```

### 수정 후 테스트

```bash
DEBUG=true npx solar --debug --prompt "테스트" > test-after.log
# 예상: 정상 완료, ~40줄 로그
```

### 검증 기준

- [ ] 로그 길이 < 100줄
- [ ] API 호출 1-2회만
- [ ] 즉시 완료 (< 10초)
- [ ] "Please continue" 자동 생성 없음

## 📊 기대 효과

| 항목      | 수정 전   | 수정 후   | 개선율    |
| --------- | --------- | --------- | --------- |
| 로그 길이 | 2,042줄   | ~40줄     | 95% 감소  |
| API 호출  | 100+ 회   | 1-2회     | 98% 감소  |
| 완료 시간 | 6분+      | <10초     | 97% 단축  |
| 토큰 사용 | 수천 토큰 | 수십 토큰 | 90%+ 절약 |

## 🔄 롤백 계획

문제 발생 시 간단한 코드 되돌리기:

```typescript
// 원복 시
if (nextSpeakerCheck?.next_speaker === 'model') {
  // 원래 코드 복원
}
```

---

**추천**: 즉시 옵션 1을 적용하여 문제 해결 후, 필요시 옵션 2로 확장
