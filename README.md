# Solar Code

[![Solar Code CI](https://github.com/serithemage/solar-code/actions/workflows/ci.yml/badge.svg)](https://github.com/serithemage/solar-code/actions/workflows/ci.yml)

```
  ********   *******   **           **     *******           ******    *******   *******   ********
 **//////   **/////** /**          ****   /**////**         **////**  **/////** /**////** /**///// 
/**        **     //**/**         **//**  /**   /**        **    //  **     //**/**    /**/**      
/*********/**      /**/**        **  //** /*******   *****/**       /**      /**/**    /**/******* 
////////**/**      /**/**       **********/**///**  ///// /**       /**      /**/**    /**/**////  
       /**//**     ** /**      /**//////**/**  //**       //**    **//**     ** /**    ** /**      
 ********  //*******  /********/**     /**/**   //**       //******  //*******  /*******  /********
////////    ///////   //////// //      // //     //         //////    ///////   ///////   //////// 
```

**🚀 새로운 시작!** Solar Code는 [QwenLM의 qwen-code](https://github.com/QwenLM/qwen-code)에서 영감을 받아 [Gemini CLI](https://github.com/google-gemini/gemini-cli)를 기반으로 제작되고 있는 프로젝트입니다. [Upstage Solar Pro2](https://www.upstage.ai/blog/ko/solar-pro-2-preview-introduction) 모델을 사용하는 명령줄 AI 워크플로우 도구로 개발 중입니다.

Gemini CLI의 우수한 기능과 인터페이스를 유지하면서 국내 AI 모델인 Solar Pro2를 활용하여, 한국 개발자들에게 최적화된 AI 코딩 도구를 제공하는 것이 목표입니다.

## 주요 기능

Solar Code를 사용하면 다음과 같은 작업을 수행할 수 있습니다:

- Solar Pro2의 강력한 코드 이해 능력을 활용한 대규모 코드베이스 쿼리 및 편집
- PDF나 스케치로부터 새로운 앱 생성 (멀티모달 기능 활용)
- PR 쿼리나 복잡한 리베이스 처리와 같은 운영 작업 자동화
- MCP 서버를 통한 도구 및 새로운 기능 연결
- 코드 리뷰, 리팩토링, 테스트 생성 등 다양한 개발 작업 지원

## 프로젝트 상태

🎉 **새로운 오픈소스 프로젝트** - Solar Code는 이제 막 시작한 오픈소스 프로젝트입니다! 

여러분의 기여와 참여를 진심으로 환영합니다. 함께 Solar Pro2를 활용한 최고의 개발 도구를 만들어나가요! 

### 작업 진행 상황

#### Phase 1: 기본 설정 및 모델 통합
- [ ] 모델 설정을 Solar Pro2로 변경
- [ ] Solar Pro2 API 통합
- [ ] 환경 변수 설정 (`SOLAR_API_KEY`, `SOLAR_MODEL`, `SOLAR_BASE_URL`)

#### Phase 2: 브랜딩 및 UI
- [ ] Solar 테마 생성
- [ ] 브랜딩 요소 업데이트

#### Phase 3: API 호환성
- [ ] API 어댑터 구현
- [ ] 기능 지원 확인 (Function Calling, 스트리밍 등)

## 빠른 시작

### 사전 요구사항

- [Node.js 20](https://nodejs.org/en/download) 이상
- Solar Pro2 API 키 (출시 예정)

### 설치 방법 (예정)

```bash
# NPM으로 설치
npm install -g @serithemage/solar-code

# 또는 직접 실행
npx https://github.com/serithemage/solar-code
```

### 환경 설정 (예정)

```bash
# Solar Pro2 API 키 설정
export SOLAR_API_KEY="YOUR_API_KEY"
export SOLAR_MODEL="solar-pro2"
export SOLAR_BASE_URL="https://api.upstage.ai"  # 예시 URL
```

## 🤝 기여하기

**여러분의 기여가 필요합니다!** Solar Code는 커뮤니티와 함께 성장하는 오픈소스 프로젝트입니다. 

코딩 경험이나 기여 규모에 상관없이 모든 기여를 환영합니다:

- 🐛 버그 신고 및 수정
- ✨ 새로운 기능 제안 및 구현  
- 📖 문서 개선
- 🧪 테스트 작성
- 💡 아이디어 제안
- ❓ 질문 및 토론 참여

**첫 기여를 고려 중이신가요?** 이슈에서 `good first issue` 라벨을 찾아보세요!

### 개발 환경 설정

```bash
# 리포지토리 클론
git clone https://github.com/serithemage/solar-code.git
cd solar-code

# 의존성 설치
npm install

# 개발 모드 실행
npm run dev
```

### 기여 가이드라인

1. 이슈를 먼저 생성하여 작업 내용을 논의해주세요
2. 기능 브랜치를 생성하여 작업해주세요
3. 테스트를 작성하고 통과시켜주세요
4. PR을 생성할 때 변경사항을 명확히 설명해주세요

## 업스트림 프로젝트

Solar Code는 다음 프로젝트들을 기반으로 합니다:

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) - 원본 프로젝트
- [Qwen Code](https://github.com/QwenLM/qwen-code) - 모델 통합 패턴 참고

업스트림 변경사항은 정기적으로 검토하여 선택적으로 머지됩니다.

## 라이선스

이 프로젝트는 원본 Gemini CLI의 라이선스를 따릅니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 💬 커뮤니티 & 지원

우리는 열린 커뮤니티를 지향합니다! 언제든지 참여해주세요:

- 🐛 **이슈 신고**: [GitHub Issues](https://github.com/serithemage/solar-code/issues)
- 💭 **아이디어 토론**: [GitHub Discussions](https://github.com/serithemage/solar-code/discussions)
- 📢 **업데이트 소식**: Watch 버튼을 눌러 최신 소식을 받아보세요

새로운 기여자와 사용자 모두 환영합니다! 질문이나 제안사항이 있으시면 부담없이 이슈를 열어주세요.

## 로드맵

- [ ] Solar Pro2 API 통합 완료
- [ ] 기본 CLI 기능 구현
- [ ] 테스트 커버리지 80% 달성
- [ ] 문서화 완료
- [ ] v1.0 정식 릴리스

---

<div align="center">

**🌟 Star this repo** if you find it useful!

**참고**: Solar Code는 Upstage나 Google과 공식적으로 제휴하지 않은 독립적인 커뮤니티 프로젝트입니다.

</div>