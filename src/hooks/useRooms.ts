/* src/hooks/useRooms.ts */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Room, RoomStatus } from '../lib/supabase';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. 초기 데이터 로드 및 실시간 구독 설정
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        console.log('Fetching rooms...', new Date().toISOString());
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('room_number', { ascending: true });

        console.log('Supabase Response:', { count: data?.length, error });
        if (error) throw error;
        setRooms(data || []);
      } catch (err: any) {
        console.error('Error fetching rooms:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    // 실시간 구독 설정
    const channel = supabase
      .channel('rooms-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          setRooms((prev) => {
            if (eventType === 'INSERT') {
              return [...prev, newRecord as Room].sort((a, b) => a.room_number - b.room_number);
            }
            if (eventType === 'UPDATE') {
              return prev.map(room => room.id === (newRecord as Room).id ? (newRecord as Room) : room);
            }
            if (eventType === 'DELETE') {
              return prev.filter(room => room.id !== (oldRecord as { id: string }).id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateRoomStatus = useCallback(async (roomId: string, newStatus: RoomStatus) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ 
          status: newStatus,
          last_status_change: new Date().toISOString()
        })
        .eq('id', roomId);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating room status:', err.message);
    }
  }, []);

  const checkoutRoom = useCallback(async (roomId: string) => {
    try {
      // 1. 좌석 상태 변경 (Empty로)
      // 실제 구현 시 주문 내역 확인 등의 추가 로직이 필요할 수 있습니다.
      const { error } = await supabase
        .from('rooms')
        .update({ 
          status: 'Empty',
          current_user_id: null,
          last_status_change: new Date().toISOString()
        })
        .eq('id', roomId);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error checking out room:', err.message);
    }
  }, []);

  const stats = useMemo(() => {
    const using = rooms.filter(r => r.status === 'Using').length;
    const maintenance = rooms.filter(r => r.status === 'Maintenance').length;
    const cleaning = rooms.filter(r => r.status === 'Cleaning').length;
    const empty = rooms.filter(r => r.status === 'Empty').length;
    
    return { 
      using, 
      maintenance, 
      cleaning,
      empty, 
      total: rooms.length 
    };
  }, [rooms]);

  return {
    rooms,
    stats,
    loading,
    error,
    updateRoomStatus,
    checkoutRoom
  };
};
