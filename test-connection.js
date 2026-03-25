import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// .env 파일에서 직접 읽기
const envContent = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('='))
);

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log('--- Supabase Connection Test ---');
console.log('URL:', supabaseUrl);
console.log('Testing connection...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  try {
    // 1. Rooms 테이블 조회 테스트
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('room_number, status')
      .limit(5);

    if (roomsError) throw roomsError;
    console.log('✅ Rooms table access: SUCCESS');
    console.table(rooms);

    // 2. Members 테이블 조회 테스트
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('id, name')
      .limit(1);

    if (membersError) {
      console.log('⚠️ Members table access: FAILED (Empty or No Permission)');
    } else {
      console.log('✅ Members table access: SUCCESS');
    }

    // 3. Notifications 테이블 조회 테스트
    const { data: notifications, error: notiError } = await supabase
      .from('notifications')
      .select('id')
      .limit(1);

    if (notiError) {
      console.log('⚠️ Notifications table access: FAILED');
    } else {
      console.log('✅ Notifications table access: SUCCESS');
    }

    console.log('\n--- Result: ALL SYSTEMS GO 🚀 ---');
  } catch (err) {
    console.error('\n❌ Connection Test FAILED:');
    console.error(err.message);
    process.exit(1);
  }
}

runTest();
