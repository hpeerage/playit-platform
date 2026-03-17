/* src/lib/supabase.ts */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 초기화
// .env 파일에 VITE_SUPABASE_URL와 VITE_SUPABASE_ANON_KEY를 설정해야 합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type RoomStatus = 'EMPTY' | 'USING' | 'CLEANING' | 'MAINTENANCE';

export interface Room {
  id: string;
  room_number: string;
  status: RoomStatus;
  pc_id?: string;
  last_check_in?: string;
  updated_at: string;
}
