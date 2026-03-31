/* src/components/admin/SeatMapView.tsx */
import React from 'react';
import { Monitor, Crown, Gamepad2, Users, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import type { Room, Order } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface SeatMapViewProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  orders?: Order[];
}

const SeatMapView: React.FC<SeatMapViewProps> = ({ rooms, selectedRoomId, onRoomClick, orders = [] }) => {
  // 간단한 구역 할당 로직 (실제로는 DB 속성으로 관리 가능)
  const getZone = (num: number) => {
    if (num <= 12) return { id: 'VIP', label: 'VIP Zone', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-400/5' };
    if (num <= 30) return { id: 'FPS', label: 'FPS Pro Zone', icon: Gamepad2, color: 'text-blue-400', bg: 'bg-blue-400/5' };
    return { id: 'COMMON', label: 'General Zone', icon: Users, color: 'text-slate-400', bg: 'bg-slate-400/5' };
  };

  const zones = ['VIP', 'FPS', 'COMMON'];

  return (
    <div className="flex-1 p-6 overflow-auto custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="min-w-[1000px] space-y-12 pb-20">
        {zones.map(zoneId => {
          const zoneInfo = zoneId === 'VIP' ? getZone(1) : zoneId === 'FPS' ? getZone(13) : getZone(31);
          const zoneRooms = rooms.filter(r => getZone(r.room_number).id === zoneId);

          return (
            <div key={zoneId} className={cn("p-8 rounded-3xl border border-white/5 relative group transition-all duration-700", zoneInfo.bg)}>
              {/* Zone Header */}
              <div className="absolute -top-4 left-8 px-5 py-2 bg-slate-900 border border-white/10 rounded-2xl flex items-center gap-3 shadow-2xl">
                <zoneInfo.icon className={cn("w-4 h-4", zoneInfo.color)} />
                <span className="text-xs font-black italic text-white uppercase tracking-tighter">{zoneInfo.label}</span>
                <span className="text-[9px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{zoneRooms.length} Seats</span>
              </div>

              <div className="grid grid-cols-6 lg:grid-cols-10 gap-4 mt-4">
                {zoneRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => onRoomClick(room.id)}
                    className={cn(
                      "aspect-square rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-500 relative group/seat scale-100 active:scale-90",
                      selectedRoomId === room.id ? "border-purple-500 ring-2 ring-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-purple-500/10" : "border-white/5 bg-slate-900/40 hover:border-white/20 hover:bg-slate-800",
                    )}
                  >
                    <Monitor className={cn(
                      "w-4 h-4 transition-colors",
                      room.status === 'Using' ? "text-emerald-400" :
                      room.status === 'Maintenance' ? "text-red-400" :
                      room.status === 'Cleaning' ? "text-blue-400" : "text-slate-600"
                    )} />
                    <span className="text-[10px] font-black italic tabular-nums text-white/80">{room.room_number.toString().padStart(2, '0')}</span>
                    
                    {/* Tiny Status Dot */}
                    <div className={cn(
                       "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full",
                       room.status === 'Using' ? "bg-emerald-500 glow-green" :
                       room.status === 'Maintenance' ? "bg-red-500" : "bg-transparent"
                    )} />

                    {/* Hover Info Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-950 px-2 py-1 rounded text-[8px] font-bold text-slate-400 opacity-0 group-hover/seat:opacity-100 transition-opacity whitespace-nowrap z-10 border border-white/10 pointer-events-none">
                       {room.status === 'Using' ? 'Park Ji-Woo' : room.status}
                    </div>

                    {/* Order Status Badge */}
                    {(() => {
                      const activeOrder = orders.find(o => {
                        const matchStatus = o.status === 'Pending' || o.status === 'Processing';
                        const matchId = o.room_id === room.id;
                        const matchNumber = o.rooms?.room_number === room.room_number;
                        const matchDemo = o.rooms?.room_number === 1011 && room.room_number === 1; // 1011번 데모 클라이언트를 1번 PC에 매핑
                        return matchStatus && (matchId || matchNumber || matchDemo);
                      });
                      if (!activeOrder) return null;
                      return (
                        <div className={cn(
                          "absolute bottom-1 right-1 flex items-center gap-1 px-1 py-0.5 rounded shadow-lg z-20 border border-white/10",
                          activeOrder.status === 'Pending' ? "bg-amber-500 text-amber-950 animate-pulse" : "bg-blue-500 text-white"
                        )}>
                           {activeOrder.status === 'Pending' ? (
                             <ShoppingBag className="w-1.5 h-1.5" />
                           ) : (
                             <UtensilsCrossed className="w-1.5 h-1.5" />
                           )}
                           <span className="text-[5px] font-black tracking-tight whitespace-nowrap pt-[0.5px]">
                             {activeOrder.status === 'Pending' ? '주문' : '조리'}
                           </span>
                        </div>
                      );
                    })()}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Map Legend */}
      <div className="fixed bottom-12 left-[110px] bg-slate-900/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-8 shadow-2xl z-50">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 glow-green" />
            <span className="text-[9px] font-black uppercase text-slate-300">Using</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-600" />
            <span className="text-[9px] font-black uppercase text-slate-300">Empty</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[9px] font-black uppercase text-slate-300">Error</span>
         </div>
         <div className="flex items-center gap-2 border-l border-white/10 pl-8 ml-2">
            <Crown className="w-3 h-3 text-amber-400" />
            <span className="text-[9px] font-black uppercase text-slate-300">VIP</span>
         </div>
      </div>
    </div>
  );
};

export default SeatMapView;
