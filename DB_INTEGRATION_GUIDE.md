# Playit Platform - Database Integration Guide

이 문서는 현재 시뮬레이션 기반으로 작동하는 Playit 플랫폼을 실제 Supabase 데이터베이스와 연동하는 기술적 절차를 안내합니다.

## 1. 초기 인프라 구축 (Supabase)

### SQL 스키마 적용
1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 새 프로젝트를 생성합니다.
2. 사이드바의 **SQL Editor**로 이동합니다.
3. [supabase_schema.sql](file:///Users/hoonlee/Library/Mobile%20Documents/com~apple~CloudDocs/Documents/Hpeerage/01.project/03.Playit/supabase_schema.sql)의 내용을 복사하여 붙여넣고 **Run**을 클릭합니다.

### 환경 변수 설정
1. **Settings -> API** 메뉴로 이동합니다.
2. `Project URL`과 `anon public key`를 복사합니다.
3. 프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 작성합니다:
   ```env
   VITE_SUPABASE_URL=당신의_URL
   VITE_SUPABASE_ANON_KEY=당신의_ANON_KEY
   ```

## 2. 실시간 데이터 동기화 (Realtime)

### Realtime 설정 활성화
- Supabase 대시보드의 **Database -> Replication** 메뉴로 이동합니다.
- `supabase_realtime` 소스에서 **Rooms**, **Orders** 테이블을 활성화(Enabled)로 변경하세요. 이렇게 하면 좌석 상태나 주문 내역이 바뀔 때 클라이언트가 즉각적으로 반응할 수 있습니다.

## 3. 프론트엔드 코드 전환 가이드

### useRooms 훅 업데이트
- 현재 [useRooms.ts](file:///Users/hoonlee/Library/Mobile%20Documents/com~apple~CloudDocs/Documents/Hpeerage/01.project/03.Playit/src/hooks/useRooms.ts)는 `useState`에 고정된 데이터를 사용합니다.
- `supabase-js` 라이브러리를 통해 실제 API 호출로 변경해야 합니다.

### 전환 지점 (예시):
- **데이터 로드**: `supabase.from('rooms').select('*')` 호출로 대체합니다.
- **실시간 구독**: `supabase.channel('room-updates').on('postgres_changes', ...)`를 사용합니다.
- **상태 업데이트**: `supabase.from('rooms').update({ status }).match({ id })`를 사용합니다.

## 4. 주의사항
- **RLS(Row Level Security)**: 보안을 위해 기본적으로 RLS가 활성화될 수 있습니다. 테스트 중에는 대시보드의 테이블 설정에서 RLS를 잠시 끄거나, 적절한 정책(Policies)을 추가해 주세요.
- **Base 경로**: GitHub Pages 배포 시 `vite.config.ts`의 `base` 경로가 올바르게 설정되어 있는지 다시 확인하세요.
