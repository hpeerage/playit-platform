/* src/hooks/useAuth.ts */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Member } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMemberProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          // 프로필이 없는 경우 (새 회원가입 등)
          console.warn('Member profile not found for user:', userId);
        } else {
          throw error;
        }
      }
      setMember(data || null);
    } catch (err) {
      console.error('Error fetching member profile:', err);
    }
  }, []);

  useEffect(() => {
    // 1. 초기 세션 확인
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchMemberProfile(session.user.id);
      }
      setLoading(false);
    };

    checkSession();

    // 2. 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchMemberProfile(session.user.id);
      } else {
        setMember(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchMemberProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    member,
    loading,
    signOut,
    refreshProfile: () => user && fetchMemberProfile(user.id)
  };
};
