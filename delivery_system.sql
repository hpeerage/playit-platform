-- delivery_system.sql
-- 배달 업체 관리 및 주문 관련 테이블 생성 쿼리 (Supabase SQL Editor용)

-- 1. 배달 업체 (Delivery Partners)
CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 한식, 중식, 일식, 양식, 분식, 야식 등
    description TEXT,
    min_order_amount INTEGER DEFAULT 0,
    delivery_fee INTEGER DEFAULT 0,
    rating NUMERIC(3, 1) DEFAULT 4.5,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. 배달 메뉴 (Delivery Menus)
CREATE TABLE IF NOT EXISTS public.delivery_menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES public.delivery_partners(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. 배달 주문 (Delivery Orders)
CREATE TABLE IF NOT EXISTS public.delivery_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- 참조 에러를 막기 위해 일반 외래키 없이 UUID로 저장 (데모/게스트 대응)
    room_id UUID REFERENCES public.rooms(id),
    partner_id UUID REFERENCES public.delivery_partners(id),
    total_amount INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Accepted, Cooking, Delivering, Completed, Cancelled
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. 배달 주문 상품 (Delivery Order Items)
CREATE TABLE IF NOT EXISTS public.delivery_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.delivery_orders(id) ON DELETE CASCADE,
    menu_id UUID REFERENCES public.delivery_menus(id),
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- RLS (Row Level Security) 설정
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_order_items ENABLE ROW LEVEL SECURITY;

-- 데모를 위한 전면 공개(Public Access) 정책
CREATE POLICY "Allow public full access to delivery_partners" ON public.delivery_partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to delivery_menus" ON public.delivery_menus FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to delivery_orders" ON public.delivery_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to delivery_order_items" ON public.delivery_order_items FOR ALL USING (true) WITH CHECK (true);

-- 초반 더미 데이터 구축 (제휴 업체 6곳)
DO $$
DECLARE
    p_id_1 UUID := gen_random_uuid();
    p_id_2 UUID := gen_random_uuid();
    p_id_3 UUID := gen_random_uuid();
    p_id_4 UUID := gen_random_uuid();
    p_id_5 UUID := gen_random_uuid();
    p_id_6 UUID := gen_random_uuid();
BEGIN
    INSERT INTO public.delivery_partners (id, name, category, description, rating, image_url) VALUES 
    (p_id_1, '황금룡 (중화요리)', '중식', '단짠단짠 맛이 일품인 불맛 짬뽕 맛집', 4.8, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400'),
    (p_id_2, '스시야카타 (프리미엄 초밥)', '일식', '매일 새벽에 공수해온 신선한 특급 초밥', 4.9, 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400'),
    (p_id_3, '루나 피크닉 스테이크하우스', '양식', '입안에서 사르르 녹는 최상급 채끝 스테이크', 4.7, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400'),
    (p_id_4, 'BBQ 스모크 치킨 본점', '야식', '야식엔 역시 겉바속촉 황금 치킨!', 4.6, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400'),
    (p_id_5, '엄마손 백반집', '한식', '내 집처럼 든든한 가성비 제육볶음 백반', 4.5, 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&q=80&w=400'),
    (p_id_6, '도깨비 떡볶이 타운', '분식', '매콤달콤 끝판왕 국물 떡볶이', 4.7, 'https://images.unsplash.com/photo-1548811579-017fc2a7f23e?auto=format&fit=crop&q=80&w=400');
    
    -- 메뉴 데이터
    -- 황금룡 (중식)
    INSERT INTO public.delivery_menus (partner_id, name, price, description, image_url) VALUES
    (p_id_1, '차돌박이 불짬뽕', 12000, '얼큰한 국물과 차돌의 환상 조합', 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400'),
    (p_id_1, '황금 짜장면', 8000, '불맛나는 특제 짜장 소스', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&q=80&w=400'),
    (p_id_1, '찹쌀 탕수육 (중)', 18000, '바삭바삭 쫄깃한 한국식 탕수육', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400');

    -- 스시야카타 (일식)
    INSERT INTO public.delivery_menus (partner_id, name, price, description, image_url) VALUES
    (p_id_2, '특선 모듬 초밥 (12p)', 22000, '연어, 광어, 새우, 장어 등 당일 직송 활어', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=400'),
    (p_id_2, '생연어 덮밥 (사케동)', 15000, '마블링 좋은 특A급 생연어만 사용', 'https://images.unsplash.com/photo-1601509749557-37d4f9b87fcf?auto=format&fit=crop&q=80&w=400');

    -- 이하 양식, 야식, 한식, 분식 메뉴들도 가상으로 대량 삽입합니다.
    INSERT INTO public.delivery_menus (partner_id, name, price, description, image_url) VALUES
    (p_id_3, '루나 스테이크 정식', 35000, '로즈마리 향이 은은한 통스테이크', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400'),
    (p_id_3, '트러플 크림 파스타', 18000, '진한 크림 텍스처', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=400'),
    
    (p_id_4, '크리스피 순살 세트', 21000, '뼈 바를 귀찮음 제로!', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400'),
    
    (p_id_5, '지리산 흑돼지 제육', 11000, '불향 가득 맵짠 정식', 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&q=80&w=400'),
    
    (p_id_6, '로제 떡볶이 세트', 16000, '여성 선호도 1위. 튀김 3종 포함', 'https://images.unsplash.com/photo-1548811579-017fc2a7f23e?auto=format&fit=crop&q=80&w=400');
END $$;
