ui/ux 는 기본 구조는 영어로 만든다.

# K-YAYO 프로젝트 진행 상황

## 완료된 작업

### 진행 1: 프로젝트 초기 설정 및 기본 구조

- **Next.js 프로젝트 설정**: TypeScript, Tailwind CSS, ESLint 설정 완료
- **Firebase 설정**: Firebase Authentication 및 Firestore 연동 완료
- **기본 라우팅 구조**: App Router 기반 동적 라우팅 구현
- **반응형 디자인**: 모바일 우선 반응형 디자인 적용

### 진행 2: 내비게이션 시스템 구현

- **NavigationBar 컴포넌트**: 7개 주 메뉴 (K-Info, K-Culture, K-Enter, K-Promo, K-ACTOR, K-POP, K-Blogs) 구현
- **드롭다운 메뉴**: 메뉴 클릭 시 하단에 1차 하위 리스트가 나타나는 기능
- **동적 라우팅**: 1차 하위 리스트의 각 항목을 2차 하위 리스트 페이지로 이동하는 Link 구성
- **페이지 이동 시 메뉴 닫기**: `usePathname`과 `useEffect`를 사용하여 페이지 이동 시 드롭다운 메뉴 자동 닫기

### 진행 3: 데이터 파일 구조 생성

모든 내비게이션별 데이터 파일이 `public/data/` 폴더에 생성되었습니다:

#### K-Info

- `public/data/k-info/architecture.txt`
- `public/data/k-info/international.txt`
- `public/data/k-info/language.txt`
- `public/data/k-info/region.txt`
- `public/data/k-info/tourism.txt`
- `public/data/k-info/university.txt`

#### K-Culture

- `public/data/k-culture/cuisine.txt`
- `public/data/k-culture/foods.txt`
- `public/data/k-culture/music.txt`
- `public/data/k-culture/region.txt`
- `public/data/k-culture/sports.txt`
- `public/data/k-culture/tourism.txt`

#### K-Enter

- `public/data/k-enter/animation.txt`
- `public/data/k-enter/drama.txt`
- `public/data/k-enter/game.txt`
- `public/data/k-enter/movie.txt`
- `public/data/k-enter/webtoon.txt`
- `public/data/k-enter/youtuber.txt`

#### K-Promo

- `public/data/k-promo/company.txt`
- `public/data/k-promo/doctor.txt`
- `public/data/k-promo/shopping.txt`

#### K-ACTOR

- `public/data/k-actor/man.txt`
- `public/data/k-actor/woman.txt`

#### K-POP

- `public/data/k-pop/idole-man.txt`
- `public/data/k-pop/idole-woman.txt`

#### K-Blogs

- `public/data/k-blogs/news.txt`
- `public/data/k-blogs/politic.txt`
- `public/data/k-blogs/event.txt`
- `public/data/k-blogs/free-board.txt`

### 진행 4: 사용자 인증 시스템 구현

- **Firebase Authentication**: 구글 로그인 및 이메일/비밀번호 로그인 구현
- **AuthContext**: 전역 인증 상태 관리
- **AuthGuard**: 보호된 라우트를 위한 인증 가드 컴포넌트
- **로그인/로그아웃**: 모든 페이지에서 접근 가능한 로그인/로그아웃 기능

### 진행 5: 사용자 프로필 및 포인트 시스템

- **UserService 클래스**: 사용자 데이터 관리, 포인트 계산, 권한 관리
- **UserProfile 컴포넌트**: 모달 형태의 사용자 프로필 페이지
- **포인트 시스템**:
  - 글 작성: 첫 10개까지 0.1점, 이후 0.05점
  - 댓글 작성: 첫 10개까지 0.05점, 이후 0.03점
  - 대댓글 작성: 첫 10개까지 0.02점, 이후 0.01점
  - 좋아요/싫어요: 100개당 ±1점
- **회원 등급 시스템**: 7단계 등급 (새싹멤버 ~ 최고멤버, 감사멤버)
- **닉네임 변경**: 1회 무료, 2회부터 10포인트 소모

### 진행 6: 권한 시스템 구현

- **5단계 권한 시스템**: OWNER → ADMIN → NAVI_ADMIN → CHANNEL_ADMIN → BOARD_ADMIN → MEMBER
- **권한 확인 함수**: `canManageUsers`, `canManageContent`, `canAppointAdmins` 등
- **조건부 렌더링**: 권한별 UI 컴포넌트 표시 제어
- **관리자 색상 시스템**: 권한별 지팡이 색상 정의

### 진행 7: 게시판 시스템 구현

- **게시글 CRUD**: 생성, 읽기, 수정, 삭제 기능
- **Firestore 연동**: `posts` 컬렉션을 사용한 데이터 저장
- **실시간 업데이트**: `onSnapshot`을 사용한 실시간 데이터 동기화
- **게시글 목록 페이지**: `/[category]/[subCategory]/[board]/page.tsx`
- **게시글 상세 페이지**: `/[category]/[subCategory]/[board]/[postId]/page.tsx`
- **글쓰기 페이지**: `/[category]/[subCategory]/[board]/write/page.tsx`

### 진행 8: 댓글 및 대댓글 시스템

- **CommentItem 컴포넌트**: 재귀적으로 댓글과 대댓글을 표시하는 구조
- **계층 구조**: 대댓글은 들여쓰기와 왼쪽 테두리로 구분
- **실시간 업데이트**: 댓글/대댓글의 실시간 업데이트 기능
- **트랜잭션 기반**: Firestore 트랜잭션을 사용한 데이터 정합성 보장
- **삭제 로직**: 대댓글이 있는 댓글 삭제 시, 부모 댓글과 모든 자식 대댓글을 함께 삭제

### 진행 9: 좋아요/싫어요 시스템

- **토글 기능**: 사용자당 하나만 선택 가능하며, 반복 클릭 시 취소
- **상호 배타적**: 좋아요와 싫어요는 상호 배타적 (좋아요 클릭 시 싫어요 자동 취소)
- **트랜잭션 기반**: 데이터 정합성 보장
- **게시글 및 댓글**: 게시글과 댓글/대댓글 모두에 적용

### 진행 10: K-Blogs 블로그 형식 구현

- **블로그 형식 라우팅**: `/k-blogs/[subCategory]/[board]/` 구조
- **권한 시스템**:
  - News, Politic, Event: 소유자 및 전체 관리자만 글쓰기 가능
  - Free Board: 모든 로그인 사용자 글쓰기 가능
  - 모든 섹션에서 댓글/대댓글 가능
- **조건부 UI**: 권한에 따른 글쓰기 버튼 표시/숨김
- **권한 안내 메시지**: 권한이 없는 사용자에게 적절한 안내

### 진행 11: 홈페이지 최신글 목록 구현

- **반응형 레이아웃**: Mobile(1개씩), Tablet(2개씩), PC(4개씩) 그리드 시스템
- **K-Blogs 섹션**: News, Event, Politic, Free Board 각각 1개씩 최신글 표시
- **Boards 섹션**: K-Info, K-Culture, K-Enter, K-Promo, K-ACTOR, K-POP 각각 1개씩 최신글 표시
- **최신글 카드**: 제목, 내용 미리보기, 작성자, 작성일, 섹션명 표시
- **로딩 상태**: 스켈레톤 UI로 사용자 경험 개선

### 진행 12: 광고 시스템 구현

- **AdBanner 컴포넌트**: 가로형, 세로형, 정사각형 광고 배너 지원
- **임시 플레이스홀더**: Google AdSense 연동 전까지 임시 광고 영역 제공
- **반응형 광고**: 화면 크기에 따라 적절한 광고 크기 조정
- **홈페이지 광고**: 최신글 목록 사이에 광고 삽입

### 진행 13: 미디어 첨부 기능 구현

- **이미지 업로드**: 최대 3장까지 이미지 첨부 가능
- **동영상 업로드**: 30초 이하 동영상 첨부 가능
- **첨부파일**: 다양한 형식의 파일 첨부 지원
- **미디어 표시**: 상세 페이지에서 이미지 갤러리, 동영상 플레이어, 첨부파일 다운로드 기능
- **UI 구현**: 글쓰기 페이지에 미디어 선택 및 제거 기능 (Firebase Storage 연동은 미완성)

### 진행 14: 내비게이션 개선

- **Breadcrumb 컴포넌트**: 상세 페이지에서 현재 위치 경로 표시
- **TopBar 버튼 위치 변경**: 홈가기 버튼을 뒤로가기 버튼 앞으로 이동
- **한국어 UI**: 모든 텍스트를 한국어로 변경하여 사용성 향상

### 진행 15: Firebase 최적화

- **Firestore 색인 설정**: `firestore-indexes.json` 파일 생성
- **복합 쿼리 최적화**: `posts` 컬렉션 (boardPath + createdAt), `comments` 컬렉션 (postId + parentId + createdAt)
- **트랜잭션 기반 데이터 정합성**: 모든 데이터 수정 작업에서 트랜잭션 사용

## 현재 진행 중인 작업

### 진행 16: 관리자 시스템 완성 ✅

- **관리자 페이지**: 5단계 권한 시스템에 따른 관리자 대시보드 구현 완료
  - 권한별 접근 제어: OWNER, ADMIN, NAVI_ADMIN, CHANNEL_ADMIN, BOARD_ADMIN 접근 가능
  - 기능별 권한 필터링: 각 기능에 필요한 최소 권한 설정
  - 영어 UI: 모든 텍스트를 영어로 구성 (memo.md 요구사항 반영)
- **사용자 관리 페이지** (`/admin/users`): 사용자 목록 조회, 권한 변경, 포인트 관리, 감사멤버 설정
- **콘텐츠 관리 페이지** (`/admin/content`): 게시글/댓글 조회, 삭제 기능
- **통계 페이지** (`/admin/analytics`): 사용자 통계, 포인트 통계, API 사용량 통계
- **포인트 시스템 페이지** (`/admin/points`): 포인트 규칙 관리, 거래 내역, 포인트 지급/차감
- **사용자 피드백 페이지** (`/admin/feedback`): 피드백 조회, 답변 기능
- **사이트 설정 페이지** (`/admin/settings`): 기본 설정, 보안 설정, 포인트 규칙, 기능 설정

### 진행 17: Firebase 연동 문제 해결 ✅

- **managedAreas undefined 오류 수정**: Firebase에 undefined 값을 저장하지 않도록 로직 개선
- **권한 변경 로직 개선**:
  - 소유자가 자기 자신의 권한을 낮출 수 없도록 제한
  - 소유자가 아닌 사용자가 소유자 권한을 부여할 수 없도록 제한
  - 권한 변경 시 적절한 검증 로직 추가
- **ADMIN_COLORS 타입 오류 수정**: MEMBER 역할에 대한 색상 추가
- **로그인 오류 메시지 개선**: 구글 로그인과 이메일 로그인 구분하여 적절한 오류 메시지 표시
- **관리자 활동 로그 개선**: undefined 값이 포함되지 않도록 로그 데이터 검증

### 진행 23: Vercel 배포 환경 문제 해결 ✅

- **Firebase 환경변수 설정**:
  - `.env.local` 파일 생성 및 Firebase 설정 추가
  - Vercel 환경변수 설정 가이드 제공 (`firebase-env-example.txt`)

### 진행 24: 댓글 시스템 UI/UX 개선 ✅

- **댓글 레이아웃 최적화**:
  - 2줄 구조로 변경: 1줄(댓글 내용) + 2줄(아이디/버튼들)
  - 컴팩트한 디자인으로 불필요한 공간 제거
- **공간 효율성 향상**:
  - 패딩 축소: `p-2`에서 `p-1`로 최소화
  - 프로필 이미지 축소: `w-8 h-8`에서 `w-6 h-6`로 축소
  - 아이콘 크기 축소: 12px에서 10px로 최소화
  - 간격 압축: 댓글 간격과 여백 최소화 (`space-y-2` → `space-y-1`)
- **사용성 개선**:
  - 아이디 위치 변경: 맨 밑으로 이동하여 가독성 향상
  - 버튼 배치: 한 줄에 깔끔하게 정렬 (좋아요/싫어요/답글/수정/삭제)
  - 글씨 크기: `text-xs`로 컴팩트하게 유지
- **대댓글 구조 개선**:
  - 들여쓰기 축소: `ml-6`에서 `ml-4`로 줄임
  - 패딩 축소: `pl-3`에서 `pl-2`로 줄임
  - 간격 압축: `mt-2`에서 `mt-1`로 줄임

### 진행 25: 숨겨진 Admin 접근 기능 구현 ✅

- **UserProfile 컴포넌트에 숨겨진 기능 추가**:
  - "Admin Information" 텍스트를 3번 클릭 시 admin 페이지(`/admin`)로 이동
  - 관리자 권한이 있는 사용자에게만 표시 (`canManageUsers(user.role)`)
- **보안 및 사용성 특징**:
  - **시각적 피드백 없음**: 마우스 호버 시 아무런 변화 없음
  - **텍스트 선택 방지**: `userSelect: 'none'`으로 텍스트 선택 불가
  - **시간 제한**: 3초 내에 3번 클릭해야 함 (3초 초과 시 카운터 리셋)
  - **일반 사용자 모름**: 우연한 클릭으로는 작동하지 않음
- **기술적 구현**:
  - `adminClickCount` 상태로 클릭 횟수 관리
  - `lastClickTime` 상태로 마지막 클릭 시간 추적
  - `handleAdminClick` 함수로 클릭 로직 처리
  - `useRouter`로 admin 페이지 이동
  - 타입 안전성: User 타입의 `managedAreas` 속성 사용

### 진행 26: 네비게이션 스크롤 동작 최적화 ✅

- **스크롤 기반 메뉴 제어 시스템 구현**:
  - **위쪽 스크롤**: 항상 1차 하부리스트 닫기 (사용자 의도 반영)
  - **아래쪽 스크롤**: 페이지 상단 근처(200px 이하)에서만 메뉴 닫기
  - **페이지 하단**: 메뉴 유지하여 콘텐츠 탐색 편의성 제공
- **성능 최적화**:
  - `requestAnimationFrame`을 사용한 부드러운 스크롤 처리
  - `passive: true` 옵션으로 스크롤 성능 향상
  - 스크롤 이벤트 쓰로틀링으로 불필요한 처리 방지
- **사용자 경험 개선**:
  - **일관된 동작**: 페이지 어디서든 네비게이션 클릭 시 동일한 반응
  - **콘텐츠 탐색 편의**: 긴 리스트(100개 이상)에서도 메뉴가 방해되지 않음
  - **자연스러운 인터랙션**: 스크롤 방향에 따른 예측 가능한 메뉴 동작
- **해결된 문제들**:
  - 위쪽에서 네비게이션 클릭 시 1차 하부리스트 정상 표시
  - 아래쪽에서 네비게이션 클릭 시 1차 하부리스트가 사라지는 문제 해결
  - 드래그/터치 시 메뉴 자동 닫기 기능 유지
  - 페이지 위치에 따른 차별화된 메뉴 동작

## 다음 단계 계획

### 우선순위 높음

- [x] 관리자 시스템 완전 구현 (5단계 권한 시스템)
- [x] 햄버거 메뉴 기능 완전 구현
- [x] 사용자 프로필 및 설정 페이지 구현
- [x] 고객 지원 및 법적 페이지 구현
- [x] Vercel 배포 환경 문제 해결 (Firebase 설정, 구글 로그인)
- [x] 2차 하부리스트 로딩 문제 해결 (API 라우트 방식)

### 진행 18: 햄버거 메뉴 시스템 완전 구현 ✅

- **햄버거 메뉴 구조 개선**: 서브메뉴 방식에서 직접 네비게이션 방식으로 변경
- **이벤트 전파 문제 해결**: `e.stopPropagation()`을 사용하여 클릭 이벤트 충돌 해결
- **직접 페이지 이동**: 메뉴 버튼 클릭 시 바로 해당 페이지로 이동
- **자동 메뉴 닫기**: 페이지 이동 시 자동으로 햄버거 메뉴 닫기
- **구현된 메뉴 항목**:
  - **개인정보 관리**: Edit Profile, Email Verification, Change Password, Delete Account
  - **알림 설정**: Ad Notifications, Email Notifications
  - **포인트 시스템**: Point Shop, Recharge Points, Transaction History
  - **고객 지원**: Send Feedback, Contact Support
  - **법적 페이지**: Terms of Service, Privacy Policy, Legal Notices

### 진행 19: 사용자 프로필 및 설정 페이지 구현 ✅

- **계정 삭제 페이지** (`/profile/delete-account`):

  - 계정 정보 표시 (이메일, 닉네임, 포인트, 가입일)
  - 삭제될 데이터 목록 표시
  - "DELETE" 입력 확인 절차
  - Firebase Auth 및 Firestore 데이터 완전 삭제
  - 경고 메시지 및 안전장치 구현

- **알림 설정 페이지**:
  - **광고 알림 설정** (`/settings/ad-notifications`):
    - 푸시 알림, 이메일 알림, 앱 내 알림 설정
    - 마케팅 알림, 일일/주간 다이제스트 설정
    - 설정 저장 기능 (Firestore 연동 준비)
  - **이메일 알림 설정** (`/settings/email-notifications`):
    - 콘텐츠 알림 (새 글, 댓글, 답글, 좋아요, 멘션)
    - 시스템 알림 (시스템 업데이트, 보안 알림, 뉴스레터)
    - 설정 저장 기능 (Firestore 연동 준비)

### 진행 20: 고객 지원 및 법적 페이지 구현 ✅

- **고객 지원 페이지** (`/contact/support`):

  - 연락처 정보 표시 (이메일: info@k-yayo.com, 전화: +33 6 0701 0336)
  - 지원 시간 안내 (월-금 9AM-6PM KST)
  - 이슈 카테고리 선택 (기술적 문제, 계정 문제, 결제, 콘텐츠, 기능 요청 등)
  - 지원 요청 폼 (제목, 메시지, 사용자 정보 자동 포함)
  - 지원 요청 전송 기능 (이메일 서비스 연동 준비)

- **법적 페이지**:
  - **이용약관** (`/legal/terms`):
    - 서비스 이용 조건, 사용자 행동 규칙
    - 지적재산권, 책임 제한, 해지 조건
    - 한국 법률 적용, 연락처 정보
  - **개인정보처리방침** (`/legal/privacy`):
    - 수집하는 정보, 정보 사용 목적
    - 정보 공유 정책, 데이터 보안, 사용자 권리
    - 쿠키 정책, 국제 전송, 정책 변경 안내
  - **법적 고지** (`/legal/notices`):
    - 저작권 고지, 상표권 고지
    - 면책 조항, 책임 제한, DMCA 고지
    - 관할 법원, 분리 조항

### 진행 21: 포인트 시스템 페이지 구현 ✅

- **포인트 상점** (`/points/shop`): 아이템 구매 기능
- **포인트 충전** (`/points/recharge`): 포인트 충전 기능
- **거래 내역** (`/points/history`): 포인트 거래 기록 조회

### 진행 22: UI/UX 개선 및 버그 수정 ✅

- **햄버거 메뉴 클릭 이벤트 문제 해결**: 이벤트 버블링으로 인한 클릭 이벤트 충돌 해결
- **일관된 디자인 시스템**: 모든 페이지에서 동일한 헤더 스타일과 레이아웃 적용
- **사용자 인증 통합**: 로그인하지 않은 사용자 자동 리다이렉트
- **에러 처리 개선**: 적절한 에러 메시지와 로딩 상태 표시
- **반응형 디자인**: 모든 페이지에서 모바일, 태블릿, PC 지원
- [ ] 게시글 수정 및 삭제 기능 구현
- [ ] Firebase Storage 연동으로 실제 파일 업로드 구현
- [ ] 사용자 프로필 페이지 완성

### 우선순위 중간

- [ ] 번역 시스템 구현 (정적 번역 + 동적 번역)
- [ ] 2FA 인증 시스템 구현
- [ ] PWA 기능 완성 (Service Worker, Web App Manifest)
- [ ] SEO 최적화

### 우선순위 낮음

- [ ] 추가 보안 기능 (IP 제한, 세션 관리)
- [ ] 성능 최적화
- [ ] 사용자 경험 개선
- [ ] 다국어 지원 확장

## 기술적 특징

### 아키텍처

- **Next.js 14**: App Router 기반의 최신 React 프레임워크
- **TypeScript**: 타입 안전성을 위한 정적 타입 검사
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **Firebase**: Authentication, Firestore, Storage (예정)

### 데이터 관리

- **Firestore**: NoSQL 데이터베이스로 실시간 데이터 동기화
- **트랜잭션**: 데이터 정합성을 위한 원자적 작업
- **실시간 업데이트**: onSnapshot을 사용한 실시간 데이터 스트리밍

### 보안

- **Firebase Authentication**: 구글 로그인 및 이메일/비밀번호 인증
- **권한 기반 접근 제어**: 5단계 권한 시스템
- **Firestore Rules**: 데이터베이스 레벨 보안 규칙

### 성능

- **반응형 디자인**: 모바일 우선 반응형 레이아웃
- **최적화된 쿼리**: Firestore 색인을 통한 쿼리 성능 최적화
- **지연 로딩**: 필요한 데이터만 로드하는 효율적인 구조

## 현재 폴더 구조

```
k-yayo-apps/
├── public/
│   ├── data/
│   │   ├── k-actor/
│   │   ├── k-blogs/
│   │   ├── k-culture/
│   │   ├── k-enter/
│   │   ├── k-info/
│   │   ├── k-pop/
│   │   └── k-promo/
│   └── [기타 정적 파일들]
├── src/
│   ├── app/
│   │   ├── [category]/
│   │   ├── k-blogs/
│   │   ├── login/
│   │   ├── points/
│   │   ├── profile/
│   │   └── services/
│   ├── components/
│   │   ├── ads/
│   │   ├── auth/
│   │   ├── board/
│   │   └── layout/
│   ├── context/
│   ├── data/
│   ├── firebase/
│   ├── services/
│   ├── types/
│   └── utils/
└── [설정 파일들]
```
