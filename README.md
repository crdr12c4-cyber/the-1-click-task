# The 1-Click Task

반복 일정 관리 앱

## 📱 기능

### 핵심 기능
- ✅ 할 일 제목 입력
- ✅ 시간 설정 (5분 단위)
- ✅ 반복 설정 (반복없음, 다음주 1번, 매주, 매월, 매년)
- ✅ 미리 알림 (분/시간/일 전)
- ✅ 태그 기능 (카테고리 분류)
- ✅ 시작 알람 + 완료 체크

### 무료/프리미엄 제한
| 기능 | 무료 | 프리미엄 |
|------|------|----------|
| 태그 개수 | 3개 | 무제한 |
| 매월 날짜 선택 | 1개 | 복수 선택 |
| 반복 일정 개수 | 1개 | 무제한 |

---

## 🚀 Play Store 배포 가이드

### 1단계: 사전 준비

#### 필요한 계정
1. **GitHub 계정** - https://github.com 에서 가입
2. **Expo 계정** - https://expo.dev 에서 가입
3. **Google Play 개발자 계정** - https://play.google.com/console 에서 $25 결제 후 등록

#### 필요한 파일 (직접 준비)
- `assets/icon.png` - 앱 아이콘 (1024x1024 px)
- `assets/splash.png` - 스플래시 화면 (1284x2778 px)
- `assets/adaptive-icon.png` - Android 적응형 아이콘 (1024x1024 px)
- 개인정보처리방침 URL

---

### 2단계: GitHub에 코드 업로드

1. GitHub에 로그인
2. 우측 상단 `+` → `New repository` 클릭
3. Repository name: `the-1-click-task` 입력
4. `Create repository` 클릭
5. `uploading an existing file` 클릭
6. 이 폴더의 모든 파일을 드래그 앤 드롭
7. `Commit changes` 클릭

---

### 3단계: Expo에서 빌드

1. https://expo.dev 로그인
2. 우측 상단 `Create a project` 클릭
3. GitHub 연동: `Import from GitHub` 선택
4. `the-1-click-task` 저장소 선택
5. 좌측 메뉴에서 `Builds` 클릭
6. `Create build` 클릭
7. Platform: `Android` 선택
8. Build profile: `production` 선택
9. `Start build` 클릭
10. 빌드 완료까지 약 15-30분 대기
11. 완료 후 `.aab` 파일 다운로드

---

### 4단계: Play Store에 앱 등록

1. https://play.google.com/console 접속
2. `앱 만들기` 클릭
3. 앱 정보 입력:
   - 앱 이름: The 1-Click Task
   - 기본 언어: 한국어
   - 앱/게임: 앱
   - 무료/유료: 무료 (나중에 인앱결제 추가)
4. `앱 만들기` 클릭

#### 스토어 등록정보 설정
- 앱 아이콘, 스크린샷, 설명 입력
- 개인정보처리방침 URL 입력
- 콘텐츠 등급 설문 완료

#### 앱 번들 업로드
1. `프로덕션` → `새 버전 만들기`
2. 다운로드한 `.aab` 파일 업로드
3. 출시 노트 작성
4. `검토 시작` 클릭

---

### 5단계: 검토 및 출시

- Google 검토: 보통 1-7일 소요
- 승인되면 자동으로 Play Store에 게시됨

---

## 📁 프로젝트 구조

```
the-1-click-task/
├── App.js                 # 앱 진입점
├── app.json              # Expo 설정
├── package.json          # 의존성
├── babel.config.js       # Babel 설정
├── assets/               # 이미지 리소스
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
└── src/
    ├── components/       # UI 컴포넌트
    │   ├── common/      # 공통 컴포넌트
    │   ├── TaskCard.js
    │   ├── DatePicker.js
    │   └── TimePicker.js
    ├── constants/        # 상수
    │   ├── theme.js     # 색상/스타일
    │   └── limits.js    # 제한 설정
    ├── context/          # 상태 관리
    │   └── AppContext.js
    ├── navigation/       # 네비게이션
    │   └── AppNavigation.js
    ├── screens/          # 화면
    │   ├── HomeScreen.js
    │   ├── AddTaskScreen.js
    │   ├── TaskDetailScreen.js
    │   ├── TagsScreen.js
    │   └── SettingsScreen.js
    └── utils/            # 유틸리티
        ├── storage.js
        ├── notifications.js
        └── dateUtils.js
```

---

## 🎨 아이콘/이미지 제작 팁

### 무료 도구
- **Figma** (figma.com) - 아이콘/UI 디자인
- **Canva** (canva.com) - 간단한 이미지
- **Remove.bg** - 배경 제거

### 권장 사양
- 앱 아이콘: 1024x1024px, PNG, 투명 배경 없음
- 스플래시: 1284x2778px, PNG
- 스크린샷: 1080x1920px 또는 1242x2208px

---

## ⚠️ 주의사항

1. **아이콘/스플래시 이미지는 직접 만들어야 합니다**
   - 저작권 문제 없는 이미지 사용
   
2. **개인정보처리방침 필수**
   - 무료 생성: privacy policy generator 검색
   
3. **결제 기능 (2단계)**
   - Google Play 인앱결제 연동 필요
   - 추후 업데이트에서 추가

---

## 📞 문의

문제가 있으면 GitHub Issues에 등록해주세요.
