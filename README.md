# K-YAYO Apps

한국을 통해 세계를 만나는 곳 - Next.js 기반의 프로그레시브 웹 앱(PWA)

## 프로젝트 개요

K-YAYO는 한국 문화 및 엔터테인먼트 관련 게시글을 전 세계 사용자들이 언어 장벽 없이 공유하고, 소통할 수 있는 커뮤니티 플랫폼입니다.

### 주요 기능

- **다양한 게시판**: K-Info, K-Culture, K-Enter, K-Promo, K-ACTOR, K-POP, K-Blogs
- **포인트 시스템**: 글 작성, 댓글, 좋아요를 통한 포인트 적립 및 사용
- **5단계 관리자 시스템**: OWNER → ADMIN → NAVI_ADMIN → CHANNEL_ADMIN → BOARD_ADMIN → MEMBER
- **다국어 지원**: 50개국어 지원 (예정)
- **PWA 지원**: 모바일 앱과 같은 사용자 경험

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Deployment**: Vercel (예정)

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/oninepa/k-yayo-apps.git
cd k-yayo-apps
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 Firebase 설정을 추가하세요:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Email
NEXT_PUBLIC_ADMIN_EMAIL=oninepa@gmail.com
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 프로젝트 구조

```
k-yayo-apps/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [category]/         # 동적 라우팅 (게시판 카테고리)
│   │   ├── admin/              # 관리자 페이지
│   │   ├── k-blogs/            # 블로그 형식 게시판
│   │   └── ...
│   ├── components/             # 재사용 가능한 컴포넌트
│   ├── context/                # React Context
│   ├── firebase/               # Firebase 설정
│   ├── services/               # 비즈니스 로직
│   ├── types/                  # TypeScript 타입 정의
│   └── utils/                  # 유틸리티 함수
├── public/
│   └── data/                   # 정적 데이터 파일
└── ...
```

## 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 배포 완료

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 연락처

- 이메일: oninepa@gmail.com
- GitHub: [@oninepa](https://github.com/oninepa)
