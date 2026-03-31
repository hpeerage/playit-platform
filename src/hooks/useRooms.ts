import { useState, useCallback, useEffect } from 'react';
import { type Room, type RoomStatus, type RoomPC } from '../lib/supabase';

const STORAGE_KEY = 'playit-pms-rooms';

// Helper to generate IDs
const generatePCForRoom = (roomNum: number, status: RoomStatus): RoomPC[] => {
   const pcCount = 1 + (roomNum % 4); 
   return Array.from({ length: pcCount }, (_, pci) => ({
      id: `pc-${roomNum}-${Date.now()}-${pci + 1}`,
      name: `PC-${pci + 1}`,
      status: status === 'Using' ? (pci === 0 ? 'InUse' : 'Online') : 'Offline',
      user_name: status === 'Using' && pci === 0 ? 'Demo User' : undefined,
      specs: 'RTX 4080 | 32GB RAM'
   }));
};

const generateInitialRooms = (): Room[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved rooms', e);
    }
  }

  // Fallback to default generation (8 rooms per floor * 6 floors = 48)
  return Array.from({ length: 48 }, (_, i) => {
    const status: RoomStatus = i % 7 === 0 ? 'Using' : 'Empty';
    const floorHeight = 8;
    const floor = 1 + Math.floor(i / floorHeight);
    const roomNum = floor * 100 + (i % floorHeight) + 1;
    
    return {
      id: `room-gen-${i + 1}-${Date.now()}`,
      room_number: roomNum,
      status: status,
      zone: roomNum.toString(),
      remaining_time: status === 'Using' ? '04:00:00' : null,
      current_user_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      room_type: '디럭스 더블',
      door_status: status === 'Using' ? 'Locked' : 'Open',
      power_status: status === 'Using' ? 'On' : 'Off',
      temperature: 22.5,
      stay_type: status === 'Using' ? '숙박' : undefined,
      pcs: generatePCForRoom(roomNum, status)
    };
  });
};

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>(generateInitialRooms());
  const [loading] = useState(false);

  // Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

  const reconfigureStore = useCallback((floorPlans: { floor: number, count: number }[]) => {
    const newRooms: Room[] = [];
    floorPlans.forEach(plan => {
       for (let i = 1; i <= plan.count; i++) {
          const roomNum = plan.floor * 100 + i;
          newRooms.push({
             id: `room-pms-${roomNum}-${Date.now()}`,
             room_number: roomNum,
             status: 'Empty',
             zone: roomNum.toString(),
             remaining_time: null,
             current_user_id: null,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString(),
             room_type: '디럭스 더블',
             door_status: 'Open',
             power_status: 'Off',
             temperature: 22.5,
             pcs: generatePCForRoom(roomNum, 'Empty')
          });
       }
    });
    setRooms(newRooms);
  }, []);

  const updateRoomStatus = useCallback(async (roomId: string, status: RoomStatus) => {
    setRooms(prev => prev.map(r => 
      r.id === roomId 
        ? { 
            ...r, 
            status, 
            power_status: status === 'Using' ? 'On' : 'Off',
            door_status: status === 'Using' ? 'Locked' : 'Open',
            check_in_time: status === 'Using' ? new Date().toISOString() : undefined,
            pcs: r.pcs?.map(pc => ({ ...pc, status: status === 'Using' ? 'Online' : 'Offline' }))
          } 
        : r
    ));
  }, []);

  const updateRoom = useCallback(async (roomId: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, ...updates } : r));
  }, []);

  const checkoutRoom = useCallback(async (roomId: string) => {
    updateRoomStatus(roomId, 'Empty');
  }, [updateRoomStatus]);

  const sendRemoteCommand = useCallback(async (roomId: string, command: string, payload?: any) => {
    if (command === 'TOGGLE_DOOR') {
      const r = rooms.find(room => room.id === roomId);
      if (r) updateRoom(roomId, { door_status: r.door_status === 'Locked' ? 'Open' : 'Locked' });
    } else if (command === 'TOGGLE_POWER') {
       const r = rooms.find(room => room.id === roomId);
       if (r) {
          const newPower = r.power_status === 'On' ? 'Off' : 'On';
          updateRoom(roomId, { 
             power_status: newPower,
             pcs: r.pcs?.map(pc => ({ ...pc, status: newPower === 'On' ? 'Online' : 'Offline' }))
          });
       }
    } else if (command === 'ADD_PC') {
       const r = rooms.find(room => room.id === roomId);
       if (r) {
          const nextId = (r.pcs?.length || 0) + 1;
          updateRoom(roomId, { pcs: [...(r.pcs || []), { id: `pc-new-${Date.now()}`, name: `PC-${nextId}`, status: r.power_status === 'On' ? 'Online' : 'Offline', specs: 'New Asset' }] });
       }
    } else if (command === 'REMOVE_PC') {
       const r = rooms.find(room => room.id === roomId);
       if (r && payload.pcId) updateRoom(roomId, { pcs: r.pcs?.filter(pc => pc.id !== payload.pcId) });
    } else if (command === 'PC_WAKE_UP' || command === 'PC_SHUTDOWN' || command === 'PC_RESTART') {
        const r = rooms.find(room => room.id === roomId);
        if (r && payload.pcId) {
           const newSStatus = command === 'PC_WAKE_UP' ? 'Online' : (command === 'PC_SHUTDOWN' ? 'Offline' : 'Online');
           updateRoom(roomId, { pcs: r.pcs?.map(pc => pc.id === payload.pcId ? { ...pc, status: newSStatus } : pc) });
        }
    } else if (command === 'UPDATE_STAY_TYPE') {
       updateRoom(roomId, { stay_type: payload.stayType });
    }
  }, [rooms, updateRoom]);

  const stats = {
    totalRooms: rooms.length,
    activeRooms: rooms.filter(r => r.status === 'Using').length,
    emptyRooms: rooms.filter(r => r.status === 'Empty').length,
    maintenanceRooms: rooms.filter(r => r.status === 'Maintenance').length
  };

  return { rooms, stats, loading, error: null, updateRoomStatus, updateRoom, checkoutRoom, sendRemoteCommand, reconfigureStore, refreshRooms: () => {} };
};
