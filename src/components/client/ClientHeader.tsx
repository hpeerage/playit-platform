import { useState, useEffect } from 'react';
import { Clock, Battery, Wifi, User } from 'lucide-react';

const ClientHeader = () => {
  const [timeLeft, setTimeLeft] = useState(8085); // 02:14:45 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="flex justify-between items-center py-4 px-10 select-none bg-slate-950/20 backdrop-blur-sm border-b border-white/5">
      {/* Left: Branding / Station Info */}
      <div className="flex items-center gap-4">
        <img 
          src="/playit-platform/logo.svg" 
          alt="Playit Logo" 
          className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Station 24</span>
          </div>
          <h1 className="text-2xl font-black italic text-white tracking-tighter uppercase leading-none">PLAYIT <span className="text-purple-500">CLIENT</span></h1>
        </div>
      </div>

      {/* Right: Compact Stats & User */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 opacity-60">
                <Clock className="w-3 h-3 text-purple-400" />
                <span className="text-[9px] font-bold text-purple-300 uppercase tracking-widest">Time Remaining</span>
              </div>
              <div className="text-4xl font-black tabular-nums leading-none tracking-tighter text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                {formatTime(timeLeft)}
              </div>
           </div>
        </div>
        
        <div className="h-10 w-[1px] bg-white/10" />

        <div className="flex flex-col items-end gap-1">
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <User className="w-3 h-3 text-purple-500" /> <span>JIWOO PARK</span>
           </div>
           <div className="flex items-center gap-3 text-slate-600">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-3.5 h-3.5" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
