/* src/hooks/useRooms.ts */
import { useState, useMemo, useCallback } from 'react';
import type { Room, RoomStatus } from '../lib/supabase';

const INITIAL_ROOMS: Room[] = Array.from({ length: 54 }).map((_, i) => ({
  id: (i + 1).toString(),
  room_number: (i + 1).toString(),
  status: (i % 8 === 0) ? 'USING' : (i % 15 === 0) ? 'MAINTENANCE' : 'EMPTY',
  updated_at: new Date().toISOString()
}));


export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);

  // [REAL-TIME INTEGRATION]
  // 실제 Supabase 연동 시 useEffect 내에서 실시간 구독을 설정하세요.
  /*
  useEffect(() => {
    // 1. 초기 데이터 로드: supabase.from('rooms').select('*').then(({ data }) => setRooms(data));
    // 2. 실시간 구독: 
    const channel = supabase
      .channel('rooms-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, (payload) => {
        // 데이터 변경 시 setRooms 업데이트 로직 수행
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  */

  const updateRoomStatus = useCallback((roomId: string, newStatus: RoomStatus) => {
    // [SUPABASE UPDATE]
    // await supabase.from('rooms').update({ status: newStatus }).match({ id: roomId });
    
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, status: newStatus, updated_at: new Date().toISOString() } 
        : room
    ));
  }, []);

  const checkoutRoom = useCallback((roomId: string) => {
    // [SUPABASE CHECKOUT]
    // 1. 주문 내역 정산 처리: await supabase.from('orders').update({ status: 'Completed' }).match({ room_id: roomId });
    // 2. 좌석 상태 변경: updateRoomStatus(roomId, 'EMPTY');
    
    updateRoomStatus(roomId, 'EMPTY');
  }, [updateRoomStatus]);

  const stats = useMemo(() => {
    const using = rooms.filter(r => r.status === 'USING').length;
    const maintenance = rooms.filter(r => r.status === 'MAINTENANCE').length;
    const cleaning = rooms.filter(r => r.status === 'CLEANING').length;
    const empty = rooms.length - using - maintenance - cleaning;
    
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
    updateRoomStatus,
    checkoutRoom
  };
};
