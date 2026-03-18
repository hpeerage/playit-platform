/* src/components/Header.tsx */
import React from 'react';
import { Zap, User as UserIcon, LogOut } from 'lucide-react';

interface HeaderProps {
  stats: {
    total: number;
    using: number;
    empty: number;
    pendingOrders: number;
  };
  currentTime: Date;
}

const Header: React.FC<HeaderProps> = ({ stats, currentTime }) => {
  return (
    <header className="header-premium h-[70px] bg-slate-950 border-b border-white/5 flex items-center px-[40px] justify-between z-[1000] relative">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer group">
         <Zap className="w-6 h-6 text-purple-400 fill-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
         <span className="font-black text-2xl tracking-tighter uppercase italic text-purple-400">Playit</span>
      </div>

      {/* Live Summary Chips (Ant Design Style) */}
      <div className="flex-1 flex items-center justify-center gap-4 px-10">
         <div className="summary-chip bg-slate-800/50 text-slate-400 border border-white/5">
            <span className="opacity-60">전체:</span>
            <span>{stats.total}</span>
         </div>
         <div className="summary-chip bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span className="opacity-60">사용 중:</span>
            <span>{stats.using}</span>
         </div>
         <div className="summary-chip bg-slate-800/80 text-slate-300 border border-white/5">
            <span className="opacity-60">빈 객실:</span>
            <span>{stats.empty}</span>
         </div>
         <div className="summary-chip bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">
            <span className="opacity-60">주문 대기:</span>
            <span>{stats.pendingOrders}</span>
         </div>
      </div>

      {/* Admin Profile & Clock */}
      <div className="flex items-center gap-8">
         <div className="flex flex-col items-end">
            <span className="text-xl font-black italic tabular-nums tracking-tighter text-white">
              {currentTime.toLocaleTimeString('ko-KR', { hour12: false })}
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">실시간 동기화</span>
         </div>
         
         <div className="h-8 w-[1px] bg-white/10" />

         <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 py-1.5 pl-2 pr-4 rounded-xl border border-white/5">
               <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center border border-purple-500/30">
                  <UserIcon className="w-4 h-4 text-purple-400" />
               </div>
               <span className="text-sm font-black italic whitespace-nowrap">마스터_관리자</span>
            </div>
            <button className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/30 group">
               <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-500 transition-colors" />
            </button>
         </div>
      </div>
    </header>
  );
};

export default Header;
