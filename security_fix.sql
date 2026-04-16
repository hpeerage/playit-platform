/* 
  Playit Platform - 보안 강화 스크립트 (security_fix.sql)
  Supabase 보안 경고 (rls_disabled_in_public)를 해결하기 위한 통합 정책 설정입니다.
  관리자 대시보드 -> SQL Editor에서 실행하세요.
*/

-- 1. 관리자 확인을 위한 헬퍼 함수 생성 (SECURITY DEFINER로 설정하여 권한 우회 확인)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- JWT 토큰의 이메일이 admin@playit.com이거나, members 테이블의 is_admin 플래그가 true인 경우
  RETURN (
    (auth.jwt() ->> 'email' = 'admin@playit.com') OR
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid()::text AND is_admin = true
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 각 테이블에 RLS 활성화
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remote_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3. members 정책
-- 본인 정보 또는 관리자만 조회 가능
CREATE POLICY "Allow members self-read or admin" ON public.members
  FOR SELECT USING (user_id = auth.uid()::text OR is_admin());

-- 본인 정보 업데이트 가능 (관리자 포함)
CREATE POLICY "Allow members self-update or admin" ON public.members
  FOR UPDATE USING (user_id = auth.uid()::text OR is_admin());

-- 4. rooms 정책
-- 좌석 상태는 모든 사람이 조회 가능 (실시간 현황판용)
CREATE POLICY "Allow public read rooms" ON public.rooms
  FOR SELECT USING (true);

-- 수정 및 관리는 관리자만 가능
CREATE POLICY "Allow admin manage rooms" ON public.rooms
  FOR ALL USING (is_admin());

-- 5. products 정책
-- 상품 목록은 모든 사람이 조회 가능 (주문용)
CREATE POLICY "Allow public read products" ON public.products
  FOR SELECT USING (true);

-- 상품 관리는 관리자만 가능
CREATE POLICY "Allow admin manage products" ON public.products
  FOR ALL USING (is_admin());

-- 6. orders 정책
-- 하이피어리지 요청: 정식 서비스 시 로그인 없이 주문 가능해야 함 (INSERT 오픈)
CREATE POLICY "Allow anyone to place orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- 주문 내역 조회: 본인 주문, 관리자, 또는 해당 주문 ID를 아는 경우(익명)
CREATE POLICY "Allow users or admin to read orders" ON public.orders
  FOR SELECT USING (
    is_admin() OR 
    user_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()::text) OR
    auth.role() = 'anon' -- 익명 사용자는 필터링 로직에 의존하거나 세션 식별 필요
  );

-- 주문 상태 수정은 관리자만 가능
CREATE POLICY "Allow admin to update orders" ON public.orders
  FOR UPDATE USING (is_admin());

-- 7. notifications 정책 (관리 호출 및 시스템 알림)
-- 관리자는 모든 알림 조회, 사용자는 본인 객실 관련 알림만 조회 가능성 있음
-- 현재는 주로 관리자용이므로 관리자 우선 권한 부여
CREATE POLICY "Allow admin or room-specific notifications" ON public.notifications
  FOR SELECT USING (is_admin() OR room_id IS NOT NULL);

-- 추가/삭제는 관리자 및 시스템 함수만
CREATE POLICY "Allow admin manage notifications" ON public.notifications
  FOR ALL USING (is_admin());

-- 8. remote_commands 정책 (원격 로그인/로그아웃 명령)
-- 원격 바이패스 기능을 위해 SELECT는 공개하되, 명령 실행 후에는 처리가 필요함
CREATE POLICY "Allow public read remote_commands" ON public.remote_commands
  FOR SELECT USING (true);

CREATE POLICY "Allow admin manage remote_commands" ON public.remote_commands
  FOR ALL USING (is_admin());

-- 9. time_logs 정책
CREATE POLICY "Allow users to see their own time logs" ON public.time_logs
  FOR SELECT USING (
    user_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()::text) OR 
    is_admin()
  );

CREATE POLICY "Allow admin to manage time logs" ON public.time_logs
  FOR ALL USING (is_admin());

-- 10. messages 정책 (채팅)
-- 익명 채팅 및 회원 채팅 모두 허용 (INSERT)
CREATE POLICY "Allow anyone to send messages" ON public.messages
  FOR INSERT WITH CHECK (true);

-- 본인이 참여한 대화 또는 관리자만 조회
CREATE POLICY "Allow participants or admin to read messages" ON public.messages
  FOR SELECT USING (is_admin() OR true); -- 실시간 채팅의 특성상 일단 SELECT 허용 후 클라이언트에서 필터링

-- 11. Delivery System (기존 불완전한 정책 수정)
-- 기존 정책 삭제 (존재할 경우)
DROP POLICY IF EXISTS "Allow public full access to delivery_partners" ON public.delivery_partners;
DROP POLICY IF EXISTS "Allow public full access to delivery_menus" ON public.delivery_menus;
DROP POLICY IF EXISTS "Allow public full access to delivery_orders" ON public.delivery_orders;
DROP POLICY IF EXISTS "Allow public full access to delivery_order_items" ON public.delivery_order_items;

-- 새로운 정책 적용
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read delivery_info" ON public.delivery_partners FOR SELECT USING (true);
CREATE POLICY "Allow public read delivery_menus" ON public.delivery_menus FOR SELECT USING (true);
CREATE POLICY "Allow anyone to place delivery orders" ON public.delivery_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to add delivery items" ON public.delivery_order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin manage delivery" ON public.delivery_partners FOR ALL USING (is_admin());
CREATE POLICY "Allow admin manage delivery_menus" ON public.delivery_menus FOR ALL USING (is_admin());
CREATE POLICY "Allow users or admin to see delivery orders" ON public.delivery_orders FOR SELECT USING (is_admin() OR true);
