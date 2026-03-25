/* src/components/RoomCard.tsx - Premium High-Density Version */
import React from 'react';
import { cn } from '../lib/utils';
import type { RoomStatus } from '../lib/supabase';

interface RoomCardProps {
  roomNumber: number;
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
  const isUsing = status === 'Using';
  const isMaintenance = status === 'Maintenance';
  const isCleaning = status === 'Cleaning';

  return (
    <div 
      onClick={onClick}
      className={cn(
        "aspect-square flex flex-col p-1.5 rounded-lg border transition-all duration-500 cursor-pointer overflow-hidden relative group",
        "bg-[#161c2e]/40 border-white/5 hover:border-white/10",
        isUsing && "glow-purple bg-purple-500/10 border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.1)]",
        (isMaintenance || isCleaning) && "glow-red bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
        isSelected && "ring-1 ring-purple-500/50 border-purple-500/50 scale-[1.02] z-10 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
      )}
    >
      {/* 1. Header: PC Index & Status Dot */}
      <div className="flex justify-between items-center mb-0.5">
        <span className={cn(
          "text-[9px] font-black tracking-tighter opacity-80",
          isUsing ? "text-white" : "text-slate-500"
        )}>
           #{roomNumber % 10}
        </span>
        <div className={cn(
          "w-1 h-1 rounded-full",
          isUsing ? "bg-purple-500 glow-purple" : (isMaintenance || isCleaning) ? "bg-red-500 glow-red animate-pulse" : "bg-slate-800"
        )} />
      </div>
 
      {/* 2. Body: Status Label / Time */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-1">
        {isUsing ? (
          <div className="flex flex-col items-center scale-90">
             <div className="text-[10px] font-mono font-black text-white leading-none tracking-tighter">
                {remainingTime.split(':').slice(0, 2).join(':')}
             </div>
             <div className="text-[5px] font-bold text-slate-600 uppercase tracking-tighter mt-0.5 whitespace-nowrap">Left</div>
          </div>
        ) : (
          <div className="flex flex-col items-center opacity-30 group-hover:opacity-100 transition-opacity">
             <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter leading-none">
                {isMaintenance ? 'FIX' : isCleaning ? 'DIRTY' : 'OFF'}
             </span>
          </div>
        )}
      </div>
 
      {/* 3. Selection Glow Overlay */}
      {isUsing && (
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default RoomCard;
