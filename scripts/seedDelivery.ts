import { createClient } from '@supabase/supabase-js';

// 이 스크립트를 npx tsx scripts/seedDelivery.ts 로 실행할 수 있습니다.
// NOTE: 실제 사용할때는 환경변수가 필요하므로 스크립트 내에 직접 넣거나 dotenv를 사용해야 합니다.
// Playit 프로젝트의 env 변수를 읽어옵니다.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ .env 파일을 찾을 수 없거나 Supabase 정보가 부족합니다.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DUMMY_PARTNERS = [
  // 한식
  { name: '엄마손 백반집', category: '한식', description: '내 집처럼 든든한 가성비 제육볶음 백반', rating: 4.5, min_order_amount: 15000, delivery_fee: 2000, image_url: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&q=80&w=400' },
  { name: '진국 설렁탕', category: '한식', description: '가마솥에서 24시간 우려낸 진한 국물', rating: 4.8, min_order_amount: 10000, delivery_fee: 1000, image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=400' },
  // 중식
  { name: '황금룡 (중화요리)', category: '중식', description: '단짠단짠 맛이 일품인 불맛 짬뽕 맛집', rating: 4.8, min_order_amount: 12000, delivery_fee: 1500, image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400' },
  { name: '홍콩반점', category: '중식', description: '백종원의 검증된 찹쌀탕수육과 짬뽕', rating: 4.7, min_order_amount: 14000, delivery_fee: 2000, image_url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&q=80&w=400' },
  // 일식
  { name: '스시야카타 (프리미엄 초밥)', category: '일식', description: '매일 새벽에 공수해온 신선한 특급 초밥', rating: 4.9, min_order_amount: 20000, delivery_fee: 3000, image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400' },
  { name: '도쿄 돈카츠', category: '일식', description: '겉바속촉 흑돼지 수제 돈까스 전문', rating: 4.6, min_order_amount: 11000, delivery_fee: 1500, image_url: 'https://images.unsplash.com/photo-1596683853184-a8afaf8566ff?auto=format&fit=crop&q=80&w=400' },
  // 양식
  { name: '루나 피크닉 스테이크하우스', category: '양식', description: '입안에서 사르르 녹는 최상급 채끝 스테이크', rating: 4.7, min_order_amount: 30000, delivery_fee: 4000, image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400' },
  // 치킨
  { name: 'BBQ 스모크 치킨 본점', category: '치킨', description: '야식엔 역시 겉바속촉 황금 치킨!', rating: 4.6, min_order_amount: 18000, delivery_fee: 2000, image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400' },
  { name: '네네치킨 로데오점', category: '치킨', description: '치즈 솔솔 스노윙 치킨의 정석', rating: 4.8, min_order_amount: 17000, delivery_fee: 2000, image_url: 'https://images.unsplash.com/photo-1603566113885-2e65d21a55b3?auto=format&fit=crop&q=80&w=400' },
  // 피자
  { name: '파파존스 피자', category: '피자', description: '수퍼 파파스부터 핫치킨 피자까지', rating: 4.9, min_order_amount: 22000, delivery_fee: 0, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400' },
  // 분식
  { name: '도깨비 떡볶이 타운', category: '분식', description: '매콤달콤 끝판왕 국물 떡볶이', rating: 4.7, min_order_amount: 12000, delivery_fee: 1000, image_url: 'https://images.unsplash.com/photo-1548811579-017fc2a7f23e?auto=format&fit=crop&q=80&w=400' }
];

const MENUS_MAP: Record<string, any[]> = {
  '엄마손 백반집': [
    { name: '지리산 흑돼지 제육', price: 11000, description: '불향 가득 맵짠 제육볶음밥', image_url: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&q=80&w=400' },
    { name: '차돌 된장찌개', price: 9000, description: '구수한 집된장과 차돌박이의 만남' }
  ],
  '진국 설렁탕': [
    { name: '특 설렁탕', price: 13000, description: '고기가 듬뿍 들어간 뽀얀 국물', image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=400' },
    { name: '왕만두 (고기/김치)', price: 7000, description: '직접 빚은 손만두 5알' }
  ],
  '황금룡 (중화요리)': [
    { name: '차돌박이 불짬뽕', price: 12000, description: '얼큰한 국물과 차돌의 환상 조합', image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400' },
    { name: '찹쌀 탕수육 (중)', price: 18000, description: '바삭바삭 쫄깃한 한국식 탕수육' }
  ],
  '홍콩반점': [
    { name: '고기 짬뽕', price: 8500, description: '진한 고기 육수의 최고봉' },
    { name: '짜장면 곱빼기', price: 7000, description: '가성비 최고의 근본 짜장' }
  ],
  '스시야카타 (프리미엄 초밥)': [
    { name: '특선 모듬 초밥 (12p)', price: 22000, description: '연어, 광어, 새우, 장어 등 당일 직송 활어', image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=400' },
    { name: '생연어 덮밥 (사케동)', price: 15000, description: '마블링 좋은 특A급 생연어만 사용' }
  ],
  '도쿄 돈카츠': [
    { name: '히레카츠 정식 (안심)', price: 13000, description: '미오글로빈이 살아있는 부드러운 안심', image_url: 'https://images.unsplash.com/photo-1596683853184-a8afaf8566ff?auto=format&fit=crop&q=80&w=400' },
    { name: '치즈 듬뿍 카츠', price: 14000, description: '모짜렐라 치즈가 폭포처럼 흘러내려요' }
  ],
  '루나 피크닉 스테이크하우스': [
    { name: '루나 채끝 스테이크 (200g)', price: 35000, description: '로즈마리 향이 은은한 미디엄레어 파티', image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400' },
    { name: '트러플 크림 파스타', price: 18000, description: '진한 크림 텍스처와 트러플 오일 향' }
  ],
  'BBQ 스모크 치킨 본점': [
    { name: '황금 올리브 크리스피', price: 21000, description: '바삭! 소리부터 다른 오리지널 치킨', image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400' },
    { name: '양념/후라이드 반반', price: 23000, description: '가장 많이 팔리는 근본 조합' }
  ],
  '네네치킨 로데오점': [
    { name: '스노윙 치즈 순살', price: 22000, description: '단짠단짠 달콤한 치즈가루가 솔솔', image_url: 'https://images.unsplash.com/photo-1603566113885-2e65d21a55b3?auto=format&fit=crop&q=80&w=400' }
  ],
  '파파존스 피자': [
    { name: '존스 페이보릿 L', price: 29500, description: '이탈리안 소시지와 페퍼로니의 향연', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400' },
    { name: '비프 치즈 스틱', price: 11000, description: '고소한 치즈크러스트 스틱' }
  ],
  '도깨비 떡볶이 타운': [
    { name: '로제 떡볶이 세트', price: 16000, description: '여성 선호도 1위. 튀김 3종 포함', image_url: 'https://images.unsplash.com/photo-1548811579-017fc2a7f23e?auto=format&fit=crop&q=80&w=400' },
    { name: '모듬 순대 (내장 포함)', price: 6000, description: '찰순대와 신선한 내장 무침' }
  ]
};

async function seed() {
  console.log("🚀 시작: 기존 데이터베이스 내용 삭제 중...");
  await supabase.from('delivery_order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('delivery_orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('delivery_menus').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('delivery_partners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("🚚 1. 업체(Partners) 삽입 중...");
  for (const p of DUMMY_PARTNERS) {
    const { data: partnerData, error: partnerError } = await supabase
      .from('delivery_partners')
      .insert({ ...p, is_active: true })
      .select()
      .single();

    if (partnerError) {
      console.error(`❌ 에러: ${p.name} 삽입 중 오류`, partnerError.message);
      continue;
    }

    const partnerId = partnerData.id;
    console.log(`✅ ${p.name} 삽입 완료. 메뉴 삽입 시작...`);

    const menus = MENUS_MAP[p.name] || [];
    for (let i = 0; i < menus.length; i++) {
        const m = menus[i];
        await supabase.from('delivery_menus').insert({
            partner_id: partnerId,
            name: m.name,
            price: m.price,
            description: m.description,
            image_url: m.image_url || null,
            sort_order: i
        });
    }
  }

  console.log("🎉 모든 11개 업체와 메뉴 더미 데이터가 성공적으로 업로드되었습니다!");
}

seed();
