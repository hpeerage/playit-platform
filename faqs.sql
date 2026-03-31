-- faqs.sql: Create faqs table and seed initial data

-- 1. Create FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated read access
CREATE POLICY "Allow public read access to faqs" 
    ON public.faqs FOR SELECT 
    USING (is_active = true);

-- Allow authenticated users to manage faqs
CREATE POLICY "Allow authenticated full access to faqs" 
    ON public.faqs FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 2. Insert initial FAQ data from Google Sheets
INSERT INTO public.faqs (category, question, answer, sort_order) VALUES
('입실/체크인', '예약했는데 키는 어디서 받나요?', '키오스크 이용 방법 및 예약 번호 입력 안내', 1),
('미성년자 확인', '신분증 검사는 어떻게 하나요?', '키오스크 신분증 인식 및 성인 인증 절차 안내', 2),
('결제/환불', '현금 결제나 영수증 발급은 어떻게 하죠?', '키오스크 현금 투입구 위치 및 모바일 영수증 안내', 3),
('주차 관리', '주차 셔터가 안 열려요 / 주차는 어디에?', '지정 주차 구역 확인 및 셔터 수동 개폐 방법', 4),
('객실 이용', '입실했는데 불이 안 들어와요.', '카드 키 홀더 삽입 및 마스터 스위치 위치 안내', 5),
('비품/어메니티', '수건이나 물이 더 필요한데 어디서 받나요?', '복도 공용 비품함 위치 또는 추가 비용 안내', 6),
('퇴실 절차', '나갈 때 키는 어디에 두나요?', '엘리베이터 내 키 반납함 또는 키오스크 반납 안내', 7),
('시설 고장', '와이파이 비밀번호가 뭐예요? / TV가 안 나와요.', '객실 내 안내 문구 위치 및 공유기 재부팅 안내', 8),
('연장 이용', '시간을 연장하고 싶은데 어떻게 결제하나요?', '퇴실 전 키오스크 방문 또는 관리자 유선 연락 안내', 9),
('긴급 상황', '새벽에 문이 안 잠기거나 문제가 생기면요?', '24시간 비상 연락망(인터폰/전화) 위치 강조', 10);
