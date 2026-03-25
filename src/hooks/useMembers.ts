/* src/hooks/useMembers.ts */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Member } from '../lib/supabase';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setMembers(data || []);
      } catch (err: any) {
        console.error('Error fetching members:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();

    const channel = supabase
      .channel('members-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          setMembers((prev) => {
            if (eventType === 'INSERT') return [...prev, newRecord as Member];
            if (eventType === 'UPDATE') return prev.map(m => m.id === (newRecord as Member).id ? (newRecord as Member) : m);
            if (eventType === 'DELETE') return prev.filter(m => m.id !== (oldRecord as { id: string }).id);
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateMemberPoints = useCallback(async (memberId: string, points: number) => {
    const { error } = await supabase
      .from('members')
      .update({ points, updated_at: new Date().toISOString() })
      .eq('id', memberId);
    if (error) console.error('Error updating points:', error.message);
  }, []);

  return {
    members,
    loading,
    error,
    updateMemberPoints
  };
};
