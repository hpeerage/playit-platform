/* src/components/RoomCard.tsx */
import React from 'react';
import { User, LogIn, LogOut, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';
import type { RoomStatus } from '../lib/supabase';

interface RoomCardProps {
  roomNumber: string;
  status: RoomStatus;
  onCheckIn: () => void;
  onCheckOut: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ roomNumber, status, onCheckIn, onCheckOut }) => {
  const isUsing = status === 'USING';

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-3xl p-6 glass-card transition-standard h-[22rem]",
      isUsing 
        ? "border-blue-500/20 glow-primary" 
        : "border-zinc-800/10"
    )}>
      {/* Dynamic Status Aura */}
      <div className={cn(
        "absolute -top-12 -right-12 h-40 w-40 rounded-full blur-[60px] transition-opacity duration-1000",
        isUsing ? "bg-blue-600/30 opacity-100" : "bg-purple-600/10 opacity-40 group-hover:opacity-60"
      )} />

      {/* Room Header */}
      <div className="flex items-start justify-between mb-8 z-10">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter text-white group-hover:text-blue-400 transition-colors">
            {roomNumber}
          </h3>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Room Unit</p>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border",
          isUsing 
            ? "border-blue-500/40 bg-blue-500/10 text-blue-400" 
            : "border-zinc-800 bg-zinc-900/40 text-zinc-500"
        )}>
          <span className={cn(
            "h-1.5 w-1.5 rounded-full",
            isUsing ? "bg-blue-400 animate-pulse" : "bg-zinc-700"
          )} />
          {isUsing ? 'Active' : 'Empty'}
        </div>
      </div>

      {/* PC Status Visualization */}
      <div className="flex-1 space-y-5 z-10">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
            isUsing ? "bg-blue-500/10 text-blue-400" : "bg-zinc-900/50 text-zinc-600"
          )}>
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">System Load</p>
            <p className="text-sm font-medium text-zinc-300">{isUsing ? 'RTX 4080 • Stable' : 'Offline'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
            isUsing ? "bg-purple-500/10 text-purple-400" : "bg-zinc-900/50 text-zinc-600"
          )}>
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Occupancy</p>
            <p className="text-sm font-medium text-zinc-300">{isUsing ? 'Authorized User' : 'No Access'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn(
              "h-1 flex-1 rounded-full",
              isUsing ? (i === 2 ? "bg-emerald-500/20" : "bg-emerald-500") : "bg-zinc-800"
            )} />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 z-10">
        {!isUsing ? (
          <button
            onClick={onCheckIn}
            className="group/btn relative w-full overflow-hidden rounded-2xl bg-white p-3.5 text-black font-black uppercase tracking-widest text-xs transition-all hover:bg-white/90 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              Check In
            </span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform translate-y-full group-hover/btn:translate-y-0" />
          </button>
        ) : (
          <button
            onClick={onCheckOut}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3.5 text-zinc-400 font-black uppercase tracking-widest text-xs transition-all hover:bg-zinc-800 hover:text-white active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <LogOut className="h-4 w-4" />
              Release Unit
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
