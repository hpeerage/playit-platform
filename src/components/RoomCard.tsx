/* src/components/RoomCard.tsx */
import React, { useState, useEffect } from 'react';
import { Monitor, AlertCircle, User, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import type { RoomStatus } from '../lib/supabase';

interface RoomCardProps {
  roomNumber: string;
  status: RoomStatus;
  initialSeconds?: number;
  isSelected?: boolean;
  onClick: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  roomNumber, 
  status, 
  initialSeconds = 13515, // 약 3시간 45분
  isSelected, 
  onClick 
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const isUsing = status === 'USING';
  const isError = status === 'MAINTENANCE';
  const isEmpty = status === 'EMPTY' || status === 'CLEANING';

  useEffect(() => {
    let timer: number;
    if (isUsing && seconds > 0) {
      timer = window.setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isUsing, seconds]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "room-card-square group",
        isUsing && "room-card-using",
        isError && "animate-blink-red",
        isSelected && "ring-2 ring-white ring-inset border-white"
      )}
    >
      {/* 객실 번호 */}
      <span className={cn(
        "text-[11px] font-bold mb-1",
        isUsing ? "text-white" : "text-slate-400"
      )}>
        {roomNumber}호
      </span>

      {/* 상태 아이콘 */}
      <div className="mb-1">
        {isUsing ? (
          <User className="w-5 h-5 text-white" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 text-white" />
        ) : (
          <Monitor className="w-4 h-4 text-slate-600 group-hover:text-purple-400" />
        )}
      </div>

      {/* 남은 시간 / 상태 */}
      <div className="flex flex-col items-center">
        {isUsing && (
          <div className="flex items-center gap-1 animate-timer">
            <Clock className="w-2.5 h-2.5 text-white/70" />
            <span className="text-[9px] font-mono font-bold text-white tracking-tighter">
              {formatTime(seconds)}
            </span>
          </div>
        )}
        {isEmpty && (
          <span className="text-[9px] font-bold text-slate-600 tracking-tighter">
            빈 객실
          </span>
        )}
        {isError && (
          <span className="text-[8px] font-black text-white uppercase">
            점검 중
          </span>
        )}
      </div>
      
      {/* 선택 효과 */}
      {isSelected && (
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
      )}
    </div>
  );
};

export default RoomCard;
