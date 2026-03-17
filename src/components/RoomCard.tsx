/* src/components/RoomCard.tsx */
import React from 'react';
import { Monitor, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { RoomStatus } from '../lib/supabase';

interface RoomCardProps {
  roomNumber: string;
  status: RoomStatus;
  progress?: number; // 0 to 100 for the progress bar
  isSelected?: boolean;
  onClick: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  roomNumber, 
  status, 
  progress = 0, 
  isSelected, 
  onClick 
}) => {
  const isUsing = status === 'USING';
  const isMaintenance = status === 'MAINTENANCE';

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col h-[140px] w-full rounded-2xl p-4 transition-all duration-300 select-none cursor-pointer card-room overflow-hidden",
        isSelected ? "border-[#8b5cf6]/60 bg-[#8b5cf6]/10 ring-2 ring-[#8b5cf6]/40 z-10" : "hover:border-[#8b5cf6]/40"
      )}
    >
      {/* 1. Header: Room # */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          "text-sm font-black italic tracking-tighter",
          isUsing ? "text-[#8b5cf6]" : "text-slate-500"
        )}>
          {roomNumber}
        </span>
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          isUsing ? "bg-[#8b5cf6] animate-pulse" : isMaintenance ? "bg-red-500" : "bg-slate-700"
        )} />
      </div>

      {/* 2. Main: Status Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        {isUsing ? (
          <div className="flex flex-col items-center animate-in">
             <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] mb-1">
                <Monitor className="w-5 h-5" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-[#8b5cf6]/80">Active</span>
          </div>
        ) : isMaintenance ? (
          <div className="flex flex-col items-center text-red-400">
             <AlertCircle className="w-6 h-6 mb-1" />
             <span className="text-[9px] font-black uppercase tracking-widest">Error</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-600">
             <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Empty</span>
          </div>
        )}
      </div>

      {/* 3. Bottom: Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5 text-[9px] font-bold">
           <span className={isUsing ? "text-slate-300" : "text-slate-600"}>
              {isUsing ? "Session Progress" : "System Idle"}
           </span>
           {isUsing && <span className="text-[#8b5cf6]">{progress}%</span>}
        </div>
        <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
           <div 
             className={cn(
               "h-full transition-all duration-1000",
               isUsing ? "bg-gradient-to-r from-[#8b5cf6] to-purple-400" : "bg-slate-700 w-0"
             )} 
             style={{ width: isUsing ? `${progress}%` : '0%' }}
           />
        </div>
      </div>
      
      {/* Background Decor */}
      <div className={cn(
        "absolute top-0 right-0 w-12 h-12 bg-purple-500/10 blur-3xl rounded-full transition-opacity duration-500",
        isUsing ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
};

export default RoomCard;
