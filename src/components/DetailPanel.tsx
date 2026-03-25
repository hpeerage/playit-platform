import { X, Clock, Monitor, Activity, LogOut, Terminal, Zap, Settings2, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Room, RoomStatus } from '../lib/supabase';

interface DetailPanelProps {
  room: Room | null;
  onClose: () => void;
  onStatusChange: (roomId: string, status: RoomStatus) => void;
  onCheckout: (roomId: string) => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ room, onClose, onStatusChange, onCheckout }) => {
  return (
    <aside className={cn(
      "fixed top-0 right-0 h-full bg-[#0a0f1e] border-l border-white/5 shadow-[-40px_0_60px_rgba(0,0,0,0.8)] z-[2000] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
      room ? "w-[380px] translate-x-0" : "w-0 translate-x-full"
    )}>
      {room ? (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between bg-slate-950/30">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selected Station</span>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full glow-green",
                  room.status === 'Using' ? "bg-emerald-500" : 
                  room.status === 'Maintenance' ? "bg-red-500" :
                  room.status === 'Cleaning' ? "bg-blue-500" : "bg-slate-500"
                )} />
              </div>
              <h3 className="text-2xl font-black italic text-white tracking-tighter">PC {room.room_number.toString().padStart(2, '0')} <span className={cn(
                "text-sm not-italic ml-2 lowercase first-letter:uppercase",
                room.status === 'Using' ? "text-emerald-500" : "text-slate-500"
              )}>({room.status})</span></h3>
            </div>
            <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
              <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {/* 1. Status Controls */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                  <Settings2 className="w-3 h-3" />
                  Quick Management
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onStatusChange(room.id, 'Empty')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase transition-all",
                      room.status === 'Empty' ? "bg-slate-700 border-white/20 text-white" : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                    )}
                  >
                    <Trash2 className="w-3 h-3" /> Set Empty
                  </button>
                  <button 
                    onClick={() => onStatusChange(room.id, 'Cleaning')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase transition-all",
                      room.status === 'Cleaning' ? "bg-blue-600/40 border-blue-500/50 text-white" : "bg-white/5 border-white/5 text-slate-400 hover:bg-blue-500/20"
                    )}
                  >
                    <Activity className="w-3 h-3" /> Cleaning
                  </button>
                  <button 
                    onClick={() => onStatusChange(room.id, 'Maintenance')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase transition-all",
                      room.status === 'Maintenance' ? "bg-red-600/40 border-red-500/50 text-white" : "bg-white/5 border-white/5 text-slate-400 hover:bg-red-500/20"
                    )}
                  >
                    <Zap className="w-3 h-3" /> Maintenance
                  </button>
                  <button 
                    onClick={() => onStatusChange(room.id, 'Using')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase transition-all",
                      room.status === 'Using' ? "bg-emerald-600/40 border-emerald-500/50 text-white" : "bg-white/5 border-white/5 text-slate-400 hover:bg-emerald-500/20"
                    )}
                  >
                    <CheckCircle2 className="w-3 h-3" /> Set Using
                  </button>
               </div>
            </div>

            {/* 2. User Info (Only if using) */}
            {room.status === 'Using' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-white/5">
                    <span>Active Session</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-600 font-bold uppercase">User</span>
                        <span className="text-xs font-bold text-white">Park Ji-Woo</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-600 font-bold uppercase">Plan</span>
                        <span className="text-xs font-bold text-white">3hr / ₩5,000</span>
                    </div>
                </div>
              </div>
            )}

            {/* 3. Hardware Stats */}
            <div className="bg-slate-900/40 rounded-2xl p-5 border border-white/5 space-y-4 shadow-inner">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg"><Monitor className="w-4 h-4 text-slate-400" /></div>
                  <div className="flex flex-col">
                     <span className="text-[8px] text-slate-500 font-bold uppercase">Hardware Node</span>
                     <span className="text-[10px] font-bold text-slate-300">RTX 4080 | 32GB RAM</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                     <div className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-emerald-400" /><span className="text-[9px] font-bold text-slate-500 uppercase">Load</span></div>
                     <span className="text-sm font-black italic text-white tabular-nums">25%</span>
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-orange-400" /><span className="text-[9px] font-bold text-slate-500 uppercase">Temp</span></div>
                     <span className="text-sm font-black italic text-white tabular-nums">54°C</span>
                  </div>
               </div>
            </div>

            {/* 4. Action Buttons */}
            <div className="space-y-3 pt-4">
               {room.status === 'Using' ? (
                 <button 
                  onClick={() => onCheckout(room.id)}
                  className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-900/20 transition-all active:scale-[0.98]"
                 >
                    <LogOut className="w-4 h-4" /> End Session & Checkout
                 </button>
               ) : (
                 <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-xl border border-white/5 text-[10px] font-black uppercase transition-all shadow-lg">
                    <Terminal className="w-3.5 h-3.5" /> Maintenance Log
                 </button>
               )}
            </div>
          </div>

          <div className="p-6 bg-slate-950/40 border-t border-white/5">
             <div className="flex items-center justify-center gap-2 text-slate-700 font-black uppercase tracking-widest text-[8px]">
                <Clock className="w-3 h-3" /> Core Sync 1.345s
             </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
};

export default DetailPanel;
