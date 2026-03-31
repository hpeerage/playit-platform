import React, { useMemo } from 'react';
import { BedDouble, ShoppingBag, UtensilsCrossed, Building2, UserCircle2, Clock } from 'lucide-react';
import type { Room, Order } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface SeatMapViewProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  orders?: Order[];
}

const SeatMapView: React.FC<SeatMapViewProps> = ({ rooms, selectedRoomId, onRoomClick, orders = [] }) => {
  
  // Group rooms by Floor
  const floorGroups = useMemo(() => {
    return rooms.reduce((acc, room) => {
      const floor = Math.floor(room.room_number / 100);
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(room);
      return acc;
    }, {} as Record<number, Room[]>);
  }, [rooms]);

  const sortedFloors = Object.keys(floorGroups).map(Number).sort((a, b) => a - b);

  return (
    <div className="flex-1 p-6 overflow-auto custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="min-w-[1000px] space-y-16 pb-20">
        
        {sortedFloors.map(floor => {
          const floorRooms = floorGroups[floor];

          return (
            <div key={floor} className="relative">
              {/* Floor Header Label */}
              <div className="flex items-center gap-3 mb-6 px-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                 <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em]">{floor}F Floor Map</span>
                 <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              {/* Floor Container */}
              <div className="bg-[#121829]/30 rounded-[2.5rem] p-10 border border-white/5 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none" />
                
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-5 relative z-10">
                  {floorRooms.map(room => {
                    const activeOrder = orders.find(o => {
                      const matchStatus = o.status === 'Pending' || o.status === 'Processing';
                      const matchId = o.room_id === room.id;
                      const matchNumber = o.rooms?.room_number === room.room_number;
                      const matchDemo = o.rooms?.room_number === 1011 && room.room_number === 1;
                      return matchStatus && (matchId || matchNumber || matchDemo);
                    });

                    return (
                      <button
                        key={room.id}
                        onClick={() => onRoomClick(room.id)}
                        className={cn(
                          "aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-500 relative group/seat transform-gpu",
                          selectedRoomId === room.id 
                            ? "bg-purple-600 border-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.3)] scale-[1.05] z-10" 
                            : "bg-[#0a0f1a] border-white/10 hover:border-white/30 hover:bg-[#161c2e] hover:-translate-y-1 active:scale-95"
                        )}
                      >
                        {/* Bed Icon for Room feeling */}
                        <BedDouble className={cn(
                          "w-5 h-5 transition-all duration-500",
                          selectedRoomId === room.id ? "text-white" :
                          room.status === 'Using' ? "text-emerald-400 group-hover/seat:scale-110" :
                          room.status === 'Maintenance' ? "text-red-400" :
                          room.status === 'Cleaning' ? "text-blue-400" : "text-slate-700"
                        )} />
                        
                        <span className={cn(
                          "text-[11px] font-black italic tracking-tighter transition-colors",
                          selectedRoomId === room.id ? "text-white" : "text-slate-400"
                        )}>
                          {room.room_number}
                        </span>
                        
                        {/* Status Pulse Dot */}
                        <div className={cn(
                           "absolute top-2 right-2 w-1.5 h-1.5 rounded-full ring-2 ring-[#0a0f1a]",
                           room.status === 'Using' ? "bg-emerald-500 animate-pulse glow-green" :
                           room.status === 'Maintenance' ? "bg-red-500" :
                           room.status === 'Cleaning' ? "bg-blue-500" : "bg-transparent"
                        )} />

                        {/* Hover Overlay Info */}
                        {room.status === 'Using' && (
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 border border-white/10 rounded-lg opacity-0 group-hover/seat:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100] flex items-center gap-1.5 shadow-2xl">
                              <UserCircle2 className="w-3 h-3 text-emerald-400" />
                              <span className="text-[9px] font-black text-slate-300">Park Ji-Woo</span>
                              <div className="w-px h-2 bg-white/10" />
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span className="text-[9px] font-bold text-slate-500">02:30</span>
                           </div>
                        )}

                        {/* Order Indicator */}
                        {activeOrder && (
                          <div className={cn(
                            "absolute -bottom-1 -right-1 flex items-center gap-1 px-1.5 py-0.5 rounded-md shadow-xl z-20 border border-white/10",
                            activeOrder.status === 'Pending' ? "bg-amber-500 text-amber-950" : "bg-blue-600 text-white"
                          )}>
                             {activeOrder.status === 'Pending' ? <ShoppingBag className="w-2 h-2" /> : <UtensilsCrossed className="w-2 h-2" />}
                             <span className="text-[6px] font-black uppercase tracking-tighter">{activeOrder.status === 'Pending' ? 'ORD' : 'COOK'}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend Footer */}
      <div className="fixed bottom-12 left-[120px] bg-[#050914]/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[1.5rem] flex items-center gap-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-bottom-5 duration-700">
         <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 glow-green animate-pulse" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Occupied</span>
         </div>
         <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vacant</span>
         </div>
         <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cleaning</span>
         </div>
         <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Alert</span>
         </div>
         <div className="w-px h-4 bg-white/10" />
         <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <Building2 className="w-4 h-4 text-purple-500" /> Floor Map Mode
         </div>
      </div>
    </div>
  );
};

export default SeatMapView;
