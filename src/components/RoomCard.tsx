/* src/components/RoomCard.tsx - Premium High-Density Version */
import React from 'react';
import { cn } from '../lib/utils';
import type { RoomStatus } from '../lib/supabase';

interface RoomCardProps {
  roomNumber: string;
  status: RoomStatus;
  remainingTime?: string;
  isSelected?: boolean;
  onClick: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  roomNumber, 
  status, 
  remainingTime = "00:00:00",
  isSelected, 
  onClick 
}) => {
  const isUsing = status === 'USING';
  const isError = status === 'MAINTENANCE';

  return (
    <div 
      onClick={onClick}
      className={cn(
        "aspect-square flex flex-col p-3 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden relative group",
        "bg-[#161c2e]/60 border-white/5 hover:border-white/20",
        isUsing && "glow-purple bg-purple-500/10 border-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.15)]",
        isError && "glow-red bg-red-500/10 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]",
        isSelected && "ring-2 ring-purple-500/50 border-purple-500/50 scale-[1.02] z-10 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
      )}
    >
      {/* 1. Header: Room ID & Status Dot */}
      <div className="flex justify-between items-center mb-1">
        <span className={cn(
          "text-[11px] font-black tracking-tight uppercase",
          isUsing ? "text-white" : "text-slate-500"
        )}>
          PC {roomNumber.padStart(2, '0')}
        </span>
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          isUsing ? "bg-purple-500 glow-purple" : isError ? "bg-red-500 glow-red animate-pulse" : "bg-slate-700"
        )} />
      </div>

      {/* 2. Body: Status Label / Time */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {isUsing ? (
          <div className="flex flex-col items-center">
             <div className="text-[14px] font-mono font-black text-white leading-none tracking-tighter">
                {remainingTime}
             </div>
             <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">Remaining</div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center">
             <span className="text-[9px] font-black text-red-400 uppercase tracking-wider">Error</span>
             <span className="text-[6px] text-red-400/60 uppercase font-bold mt-0.5">Hardware Fail</span>
          </div>
        ) : (
          <div className="flex flex-col items-center opacity-40 group-hover:opacity-100 transition-opacity">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Empty</span>
             <span className="text-[6px] text-slate-600 uppercase font-bold mt-0.5">Available</span>
          </div>
        )}
      </div>

      {/* 3. Footer: Sub-info / Client Icon */}
      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
         <div className="flex gap-1">
            <div className={cn("w-1 h-1 rounded-full", isUsing ? "bg-purple-500/50" : "bg-slate-800")} />
            <div className={cn("w-1 h-1 rounded-full", isUsing ? "bg-purple-500/50" : "bg-slate-800")} />
         </div>
         <span className="text-[8px] font-bold text-slate-700 uppercase italic">Playit_OS</span>
      </div>
      
      {/* Active Selection Glow */}
      {isUsing && (
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default RoomCard;
