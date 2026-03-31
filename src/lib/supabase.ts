/* src/lib/supabase.ts - Full Type Definitions for Build Stability */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type RoomStatus = 'Empty' | 'Using' | 'Maintenance' | 'Cleaning';

export interface RoomPC {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'InUse';
  user_name?: string;
  specs?: string;
}

export interface Room {
  id: string;
  room_number: number;
  status: RoomStatus;
  zone: string | null;
  remaining_time: string | null;
  current_user_id: string | null;
  created_at: string;
  updated_at: string;
  // PMS (Motel/Hotel) Extended Fields
  room_type?: string;
  door_status?: 'Locked' | 'Open';
  power_status?: 'On' | 'Off';
  temperature?: number;
  stay_type?: '대실' | '숙박';
  check_in_time?: string;
  check_out_time?: string;
  outing_mode?: boolean;
  welcome_mode?: boolean;
  cleaning_report?: {
    staff: string;
    completed_at: string;
    notes?: string;
  };
  pcs?: RoomPC[];
}

export interface Member {
  id: string;
  user_id: string;
  name: string;
  rank: string;
  points: number;
  remaining_time: string;
  is_admin: boolean;
  profile_image?: string;
  last_login?: string;
  created_at: string;
}

export interface Order {
  id: string;
  room_id: string;
  user_id: string;
  items: any[];
  total_price: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  created_at: string;
  rooms?: {
    room_number: number;
  };
}

export interface Notification {
  id: string;
  type: 'CALL' | 'ORDER' | 'SYSTEM';
  message: string;
  room_id: string;
  is_read: boolean;
  created_at: string;
  rooms?: {
    room_number: number;
  };
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image_url?: string;
  description?: string;
}
