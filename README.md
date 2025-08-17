# 면담 주간 시간표 📅

교수와 학생 간의 면담 일정을 관리하고 시각화하는 웹 애플리케이션입니다.

## ✨ 주요 기능

- **주간 시간표 뷰**: 월요일부터 금요일까지의 면담 일정을 한눈에 확인
- **학기별 구분**: 1학기, 2학기, 하계방학, 동계방학 자동 구분
- **면담 관리**: 면담 일정 추가, 수정, 삭제 기능
- **교수 스케줄 관리**: 교수님의 개인 스케줄 관리 기능
- **반응형 디자인**: 모바일과 데스크톱에서 모두 사용 가능

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Date Handling**: Day.js
- **Package Manager**: pnpm

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone [repository-url]
cd time_table
```

### 2. 의존성 설치
```bash
pnpm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 Supabase 설정을 추가하세요:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. 개발 서버 실행
```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── interview/     # 면담 관련 API
│   │   └── professor-schedule/ # 교수 스케줄 API
│   ├── login/             # 로그인 페이지
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── InterviewModal.tsx # 면담 모달
│   ├── ProfessorScheduleModal.tsx # 교수 스케줄 모달
│   ├── Timetable.tsx      # 시간표 컴포넌트
│   └── TimetableContainer.tsx # 시간표 컨테이너
├── common/               # 공통 타입 및 상수
│   ├── const.ts          # 상수 정의
│   └── types.ts          # TypeScript 타입 정의
└── utils/                # 유틸리티 함수
    ├── localStorage.ts   # 로컬 스토리지 관리
    ├── supabase/         # Supabase 클라이언트
    └── utils.ts          # 기타 유틸리티 함수
```

## 🔧 사용법

### 면담 일정 관리
1. 시간표에서 원하는 시간대를 클릭하여 면담 일정 추가
2. 학생 이름, 과목, 면담 내용 등을 입력
3. 면담 일정 수정 및 삭제 가능

### 교수 스케줄 관리
1. 교수님 계정으로 로그인
2. 개인 스케줄을 설정하여 면담 불가능한 시간 표시
3. 스케줄 변경 시 실시간 업데이트

## 📊 데이터베이스 스키마

### users 테이블 (면담 일정)
- `id`: 고유 식별자
- `name`: 학생 이름
- `email`: 이메일
- `subject`: 과목명
- `meeting_detail`: 면담 내용
- `date`: 면담 날짜
- `start_time`: 시작 시간
- `end_time`: 종료 시간
- `state`: 면담 상태

### admin 테이블 (교수 스케줄)
- `id`: 고유 식별자
- `date`: 날짜
- `start_time`: 시작 시간
- `end_time`: 종료 시간

## 🚀 배포

### Vercel 배포 (권장)
1. GitHub 저장소를 Vercel에 연결
2. 환경 변수 설정
3. 자동 배포 완료
