/* src/components/RoomCard.tsx */
import React from 'react';
import { Monitor, User, Info, Clock, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';
import type { RoomStatus } from '../lib/supabase';

interface RoomCardProps {
  roomNumber: string;
  status: RoomStatus;
  userName?: string;
  timeUsed?: string;
  isSelected?: boolean;
  onClick: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  roomNumber, 
  status, 
  userName, 
  timeUsed, 
  isSelected, 
  onClick 
}) => {
  const isUsing = status === 'USING';
  const isCleaning = status === 'CLEANING';
  const isMaintenance = status === 'MAINTENANCE';

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col h-[100px] w-full border text-[11px] p-2 leading-tight transition-erp select-none cursor-pointer",
        isSelected ? "ring-2 ring-cyan-500 ring-inset z-20 shadow-lg shadow-cyan-500/20 scale-[1.03] rounded-sm" : "",
        isUsing 
          ? "bg-cyan-900/40 border-cyan-800/80 hover:bg-cyan-900/60" 
          : isCleaning 
          ? "bg-amber-900/40 border-amber-800/80 hover:bg-amber-900/60"
          : isMaintenance 
          ? "bg-rose-900/40 border-rose-800/80 hover:bg-rose-900/60"
          : "bg-[#1e1e22] border-[#2a2a2e] hover:bg-[#222226]"
      )}
    >
      {/* Top Bar: Room # & Monitor Icon */}
      <div className="flex items-center justify-between mb-1.5">
        <span className={cn(
          "font-black tracking-tight text-sm",
          isUsing ? "text-cyan-400" : "text-zinc-500"
        )}>
          {roomNumber}
        </span>
        <div className={cn(
          "h-4 w-4 flex items-center justify-center rounded-sm",
          isUsing ? "bg-cyan-500 text-black shadow-sm" : "bg-zinc-800 text-zinc-600"
        )}>
          <Monitor className="h-3 w-3 stroke-[3]" />
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 flex flex-col justify-center gap-1">
        {isUsing ? (
          <>
            <div className="flex items-center gap-1.5 text-white font-bold">
              <User className="h-3 w-3 text-cyan-400" />
              <span className="truncate">{userName || 'GUEST_USER'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400/80 font-mono text-[10px]">
              <Clock className="h-3 w-3" />
              <span>{timeUsed || '00:00:00'}</span>
            </div>
          </>
        ) : isCleaning ? (
          <div className="flex items-center gap-1.5 text-amber-500 font-bold uppercase tracking-wider">
             <Terminal className="h-3 w-3" />
             <span>Cleaning</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-zinc-600 italic">
             <span>Available</span>
          </div>
        )}
      </div>

      {/* Status Indicators (Tiny bottom bar) */}
      <div className="mt-1 flex gap-1">
        <div className={cn("h-1 flex-1 rounded-full", isUsing ? "bg-cyan-400" : "bg-zinc-800")} />
        <div className={cn("h-1 w-1 rounded-full", isUsing ? "bg-emerald-400" : "bg-zinc-800")} />
      </div>
    </div>
  );
};

export default RoomCard;
