/* src/components/RoomCard.tsx - Dual Mode PMS Version */
import React from 'react';
import { cn } from '../lib/utils';
import { ShoppingBag, UtensilsCrossed, BedDouble, Monitor } from 'lucide-react';
import type { RoomStatus, RoomPC } from '../lib/supabase';

interface RoomCardProps {
  roomNumber: number;
  status: RoomStatus;
  remainingTime?: string;
  isSelected?: boolean;
  orderStatus?: string;
  onClick: () => void;
  viewMode: 'room' | 'pc';
  pcs?: RoomPC[];
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  roomNumber, 
  status, 
  remainingTime = "00:00:00",
  isSelected, 
  orderStatus,
  onClick,
  viewMode,
  pcs = []
}) => {
  const isUsing = status === 'Using';
  const isMaintenance = status === 'Maintenance';
  const isCleaning = status === 'Cleaning';

  return (
    <div 
      onClick={onClick}
      className={cn(
        "aspect-square flex flex-col p-2.5 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden relative group",
        "bg-[#161c2e]/40 border-white/5 hover:border-white/20 hover:bg-[#1e263d]",
        isUsing && "bg-purple-500/10 border-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.1)]",
        (isMaintenance || isCleaning) && "bg-red-500/10 border-red-500/40",
        isSelected && "ring-2 ring-purple-500/50 border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.3)] scale-[1.05] z-10"
      )}
    >
      {/* 1. Header: Room Number & Status Dot */}
      <div className="flex justify-between items-center mb-1">
        <span className={cn(
          "text-[10px] font-black italic tracking-tighter transition-all",
          isUsing ? "text-white" : "text-slate-500"
        )}>
           {roomNumber}
        </span>
        <div className={cn(
          "w-1.5 h-1.5 rounded-full ring-2 ring-slate-950",
          isUsing ? "bg-emerald-500 glow-green animate-pulse" : (isMaintenance || isCleaning) ? "bg-red-500 animate-pulse" : "bg-slate-700"
        )} />
      </div>
 
      {/* 2. Body: Dual Mode Content */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-1 gap-1">
        {viewMode === 'room' ? (
          <>
            <BedDouble className={cn(
              "w-5 h-5 transition-all duration-500",
              isUsing ? "text-purple-400 scale-110" : "text-slate-700 group-hover:text-slate-500"
            )} />
            
            {isUsing ? (
              <div className="flex flex-col items-center">
                 <div className="text-[11px] font-mono font-black text-white leading-none tracking-tighter">
                    {remainingTime.split(':').slice(0, 2).join(':')}
                 </div>
                 <div className="text-[6px] font-bold text-slate-500 uppercase tracking-widest mt-1">TIME LEFT</div>
              </div>
            ) : (
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                {isMaintenance ? 'ALER' : isCleaning ? 'DIRT' : 'EMPTY'}
              </span>
            )}
          </>
        ) : (
          /* PC Management Mode View */
          <div className="grid grid-cols-2 gap-1.5 w-full h-full p-1 auto-rows-min mt-1">
             {pcs.slice(0, 4).map((pc, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center gap-0.5">
                   <Monitor className={cn(
                      "w-3.5 h-3.5",
                      pc.status === 'Online' ? "text-blue-400" : 
                      pc.status === 'InUse' ? "text-emerald-400 glow-green" : "text-slate-800"
                   )} />
                   <span className="text-[6px] font-black text-slate-600 uppercase tracking-tighter">PC-{idx+1}</span>
                </div>
             ))}
             {pcs.length === 0 && (
                <div className="col-span-2 h-full flex items-center justify-center">
                   <span className="text-[7px] font-black text-slate-800 uppercase italic">No PC Asset</span>
                </div>
             )}
          </div>
        )}
      </div>
 
      {/* 3. Footer Shadow Effect */}
      {isUsing && (
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
      )}

      {/* 4. Order Status Indicator */}
      {orderStatus && (
        <div className={cn(
          "absolute inset-0 bg-amber-500/90 backdrop-blur-sm flex flex-col items-center justify-center gap-1 animate-in fade-in duration-300 z-20",
          orderStatus === 'Pending' ? "bg-amber-500/90" : "bg-blue-600/90"
        )}>
           {orderStatus === 'Pending' ? (
             <ShoppingBag className="w-5 h-5 text-amber-950 animate-bounce" />
           ) : (
             <UtensilsCrossed className="w-5 h-5 text-white" />
           )}
           <span className={cn(
             "text-[8px] font-black uppercase tracking-widest",
             orderStatus === 'Pending' ? "text-amber-950" : "text-white"
           )}>
             {orderStatus === 'Pending' ? 'Orders' : 'Cooking'}
           </span>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
