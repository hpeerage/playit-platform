import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
  console.warn('   유저 목록 조회 등 관리자 기능 실행 시 권한 에러가 발생할 수 있습니다.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmin() {
  console.log('--- Admin System Check ---');
  
  // 1. Auth Admin API Test (Requires Service Role Key)
  try {
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      console.error('❌ List Users Error (Auth Admin):', userError.message);
      console.log('   정보: 관리자 기능을 위해서는 Supabase 대시보드에서 Service Role Key를 가져와 .env에 추가해야 합니다.');
    } else {
      console.log('✅ Auth Admin API Access: SUCCESS');
      const adminUser = users.users.find(u => u.email === 'admin@playit.com');
      if (adminUser) {
        console.log('   Admin User Found in Auth:', adminUser.id);
      } else {
        console.log('   Admin User NOT found in Auth list.');
      }
    }
  } catch (err: any) {
    console.error('❌ Auth Admin API Exception:', err.message);
  }

  // 2. Database Members Table Check (Can work with Anon Key if RLS is off or permissive)
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('*')
    .eq('is_admin', true)
    .maybeSingle();

  if (memberError) {
    console.error('❌ Member table fetch error:', memberError.message);
  } else if (member) {
    console.log('✅ Admin profile found in [members] table:', member.name);
  } else {
    console.log('ℹ️ No member with [is_admin=true] found in [members] table.');
  }
}

checkAdmin();
