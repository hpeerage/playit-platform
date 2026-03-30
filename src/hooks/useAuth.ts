/* src/hooks/useAuth.ts - Extreme Demo Bypass Mode */
import { useCallback } from 'react';

export const useAuth = () => {
  // 모든 인증 로직을 무시하고 즉시 데모 데이터를 반환합니다.
  return {
    user: { 
      id: 'demo-admin-uuid', 
      email: 'admin@playit.com',
      user_metadata: { full_name: 'DEMO_ADMIN_USER' }
    } as any,
    member: {
      id: 'demo-member-id',
      user_id: 'demo-admin-uuid',
      name: 'DEMO_ADMIN',
      rank: 'VIP',
      points: 999999,
      remaining_time: '999:59:59',
      is_admin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as any,
    isAdmin: true,
    loading: false,
    signOut: async () => { 
      sessionStorage.clear();
      window.location.href = '/#/login'; 
    },
    refreshProfile: useCallback(() => {}, [])
  };
};
