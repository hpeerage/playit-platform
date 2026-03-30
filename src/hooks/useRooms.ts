/* src/hooks/useRooms.ts */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Room } from '../lib/supabase';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (err: any) {
      console.error('Error fetching rooms:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();

    // 실시간 구독
    const channel = supabase
      .channel('rooms-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          setRooms((prev) => {
            if (eventType === 'INSERT') return [...prev, newRecord as Room].sort((a, b) => a.room_number - b.room_number);
            if (eventType === 'UPDATE') return prev.map(r => r.id === (newRecord as Room).id ? (newRecord as Room) : r);
            if (eventType === 'DELETE') return prev.filter(r => r.id !== (oldRecord as { id: string }).id);
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRooms]);

  const stats = {
    totalRooms: rooms.length,
    activeRooms: rooms.filter(r => r.status === 'Using').length,
    emptyRooms: rooms.filter(r => r.status === 'Empty').length,
    errorRooms: rooms.filter(r => r.status === 'Maintenance').length,
  };

  const updateRoomStatus = async (roomId: string, status: Room['status'], userId: string | null = null) => {
    const { error } = await supabase
      .from('rooms')
      .update({ 
        status, 
        current_user_id: userId
      })
      .eq('id', roomId);
    if (error) console.error('Error updating room status:', error.message);
  };

  const checkoutRoom = async (roomId: string) => {
    const { error } = await supabase
      .from('rooms')
      .update({ 
        status: 'Empty', 
        current_user_id: null
      })
      .eq('id', roomId);
    if (error) console.error('Error checking out room:', error.message);
  };

  const sendRemoteCommand = async (roomId: string, command: 'LOGOUT' | 'MESSAGE' | 'LOGIN_BYPASS', payload: any = {}) => {
    const { error } = await supabase
      .from('remote_commands')
      .insert({
        room_id: roomId,
        command,
        payload,
        is_executed: false
      });
    if (error) console.error('Error sending remote command:', error.message);
  };

  return {
    rooms,
    stats,
    loading,
    error,
    updateRoomStatus,
    checkoutRoom,
    sendRemoteCommand,
    refreshRooms: fetchRooms
  };
};
