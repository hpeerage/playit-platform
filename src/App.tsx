/* src/App.tsx */
import { useState, useMemo } from 'react';
import { 
  Zap, Users, Activity, Monitor, Clock, Package, DollarSign, 
  Search, Info, Terminal, MessageSquare, LogOut, Settings, RefreshCw, Layers
} from 'lucide-react';
import RoomCard from './components/RoomCard';
import type { Room } from './lib/supabase';
import { cn } from './lib/utils';

// Stable Mock Data - Fixed statuses for subagent testing
const INITIAL_ROOMS: Room[] = Array.from({ length: 30 }).map((_, i) => ({
  id: (i + 1).toString(),
  room_number: (301 + i).toString(),
  status: (i % 3 === 0) ? 'USING' : (i % 5 === 0) ? 'MAINTENANCE' : 'EMPTY',
  updated_at: new Date().toISOString()
}));

interface SystemLog {
  id: string;
  time: string;
  message: string;
  type: 'INFO' | 'ORDER' | 'SYSTEM' | 'ERROR';
}

function App() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', time: '14:32:01', message: 'System boot sequence complete.', type: 'SYSTEM' },
    { id: '2', time: '14:35:10', message: 'Room 303 session started.', type: 'INFO' },
    { id: '3', time: '14:40:45', message: 'Maintenance alert: Room 306 hardware check.', type: 'ERROR' },
  ]);

  const selectedRoom = useMemo(() => 
    rooms.find(r => r.id === selectedRoomId), 
    [rooms, selectedRoomId]
  );

  const stats = useMemo(() => {
    const using = rooms.filter(r => r.status === 'USING').length;
    return { using, total: rooms.length, rate: (using / rooms.length) * 100 };
  }, [rooms]);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLogs(prev => [{ id: Date.now().toString(), time: new Date().toLocaleTimeString(), message: 'Global state synced with master Hub.', type: 'SYSTEM' }, ...prev]);
    }, 800);
  };

  const handleCheckIn = (roomId: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'USING' } : r));
    setLogs(prev => [
      { id: Date.now().toString(), time: new Date().toLocaleTimeString(), message: `Room ${rooms.find(r => r.id === roomId)?.room_number} session authorized.`, type: 'INFO' },
      ...prev
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-[#f8fafc] font-sans overflow-hidden">
      
      {/* HEADER: Playit Ribbon */}
      <header className="h-[64px] bg-[#1e293b] border-b border-white/5 flex items-center px-6 justify-between select-none shrink-0 z-30 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="bg-[#8b5cf6] p-1.5 rounded-xl shadow-lg shadow-purple-500/30 pulse-active cursor-pointer">
                <Zap className="w-5 h-5 text-white fill-white" />
             </div>
             <div className="flex flex-col leading-none">
                <span className="font-black text-lg tracking-tighter uppercase italic text-[#8b5cf6]">Playit</span>
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase opacity-60">Control Hub v1.2</span>
             </div>
          </div>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          
          <nav className="flex items-center gap-1">
             {['Overview', 'Members', 'Assets', 'Logs'].map((tab, i) => (
                <button key={i} className={cn(
                   "px-4 py-2 text-[11px] font-black tracking-widest uppercase rounded-lg transition-all",
                   i === 0 ? "text-[#8b5cf6] bg-[#8b5cf6]/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}>
                   {tab}
                </button>
             ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
               type="text" 
               placeholder="IDENTIFY UNIT..." 
               className="bg-[#0f172a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-bold w-56 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all outline-none placeholder:text-slate-700"
            />
          </div>
          <button onClick={handleManualSync} className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#8b5cf6]/50 hover:text-[#8b5cf6] transition-all">
            <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
          </button>
          <div className="h-8 w-[1px] bg-white/5" />
          <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
             <div className="flex flex-col items-end leading-none">
                <span className="text-[10px] font-black text-white italic">ADMIN_PLAYIT</span>
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter">Super Access</span>
             </div>
             <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center">
                <Monitor className="w-4 h-4 text-[#8b5cf6]" />
             </div>
          </button>
        </div>
      </header>

      {/* 3-COLUMN LAYOUT: Sidebar | Main | Bottom Log */}
      <div className="flex-1 flex flex-row overflow-hidden bg-[#0f172a]">
        
        {/* LEFT: Target Context (300px) */}
        <aside className="w-[320px] bg-[#1e293b] border-r border-[#334155]/30 flex flex-col p-6 overflow-y-auto select-none shrink-0 z-20 shadow-2xl transition-all">
          <div className="mb-8 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Terminal className="h-3 w-3 text-[#8b5cf6]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Unit Context Panel</h3>
             </div>
             <Info className="h-4 w-4 text-slate-700 hover:text-slate-500 transition-colors" />
          </div>

          {selectedRoom ? (
            <div className="animate-in space-y-8 flex flex-col h-full">
               
               {/* Avatar & Unit ID */}
               <div className="flex items-center gap-5 p-5 rounded-3xl bg-[#0f172a]/80 border border-white/5 shadow-inner">
                 <div className="w-16 h-16 rounded-2xl bg-[#0f172a] border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0">
                   <img 
                     src={`https://api.dicebear.com/7.x/bottts/svg?seed=${selectedRoom.id}`} 
                     alt="User" 
                     width="40"
                     height="40"
                     className="w-10 h-10 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] object-contain"
                   />
                   <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#8b5cf6]/30 to-transparent opacity-50" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 opacity-60">Node {selectedRoom.room_number}</div>
                   <div className="text-base font-black tracking-tight text-white normal-case italic truncate">GUEST_{selectedRoom.room_number}_SID</div>
                   <div className="flex items-center gap-1.5 mt-2 px-2 py-0.5 w-fit rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Sync Priority
                   </div>
                 </div>
               </div>

               {selectedRoom.status === 'USING' ? (
                 <>
                   <div className="space-y-3">
                     {[
                       { label: 'Uptime', value: '01:42:15', icon: Clock },
                       { label: 'Time Credit', value: '08:17:45', icon: Activity, color: 'text-purple-400' },
                       { label: 'Session Value', value: '$12.42', icon: DollarSign, color: 'text-emerald-400' },
                       { label: 'Network Assets', value: 'Connected', icon: Package },
                     ].map((row, i) => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                         <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                            <row.icon className="w-3.5 h-3.5 group-hover:text-[#8b5cf6] transition-colors" />
                            <span>{row.label}</span>
                         </div>
                         <span className={cn("text-[11px] font-black italic tracking-tighter text-slate-200", row.color)}>{row.value}</span>
                       </div>
                     ))}
                   </div>

                   <div className="mt-auto pt-8 space-y-3">
                     <button className="w-full flex items-center justify-center gap-3 bg-[#8b5cf6] hover:bg-purple-600 py-4.5 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white shadow-xl shadow-purple-500/25 active:scale-[0.98] transition-all group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <MessageSquare className="w-4 h-4" /> Broadcast Msg
                     </button>
                     <div className="grid grid-cols-2 gap-3">
                       <button className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all border border-white/5">
                          <Settings className="w-4 h-4" /> Configure
                       </button>
                       <button className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 transition-all">
                          <LogOut className="w-4 h-4" /> Shutdown
                       </button>
                     </div>
                   </div>
                 </>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-slate-600 animate-in pt-10">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center mb-8 relative">
                       <Monitor className="w-12 h-12 opacity-10" />
                       <div className="absolute inset-0 bg-purple-500/5 rounded-full blur-2xl" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-2 text-slate-500 italic">Target: Room {selectedRoom.room_number}</p>
                    <p className="text-[10px] font-medium text-slate-700 italic max-w-[180px] text-center mb-10">Waiting for localized session authorization...</p>
                    <button 
                       onClick={() => handleCheckIn(selectedRoom.id)}
                       className="group relative px-12 py-5 bg-[#8b5cf6] text-white text-[11px] font-black rounded-2xl uppercase tracking-widest transition-all shadow-2xl hover:shadow-purple-500/30 active:scale-95 flex items-center gap-3"
                    >
                      <Zap className="w-4 h-4 fill-current group-hover:animate-pulse" />
                      Authorize Session
                    </button>
                 </div>
               )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 italic text-slate-600">
               <Layers className="w-12 h-12 mb-4 animate-bounce" />
               <p className="text-[10px] font-black tracking-[0.5em] uppercase text-center">Awaiting Node<br/>Selection</p>
            </div>
          )}
        </aside>

        {/* MAIN WORKSPACE (Grid + Bottom Feed) */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
           
           {/* Center Area: Room Grid */}
           <section className="flex-1 p-10 overflow-y-auto bg-[#0f172a] custom-scrollbar">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex flex-col leading-tight">
                    <span className="text-[10px] text-[#8b5cf6] font-black uppercase tracking-[0.5em] mb-1">Operational Visualization</span>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white flex items-center gap-3">
                       Unit Grid Matrix
                       <span className="text-slate-800 text-sm font-light italic normal-case tracking-tight mr-4"> / {stats.total} total</span>
                    </h2>
                 </div>
                 
                 <div className="flex items-center gap-8 bg-[#1e293b]/50 px-6 py-3 rounded-2xl border border-white/5 shadow-xl">
                    {[
                       { label: 'Active Sessions', count: stats.using, color: 'bg-[#8b5cf6]' },
                       { label: 'Empty Nodes', count: stats.total - stats.using, color: 'bg-slate-700' },
                    ].map((s, i) => (
                       <div key={i} className={cn("flex items-center gap-4", i === 1 && "border-l border-white/10 pl-8")}>
                          <div className={cn("w-2.5 h-2.5 rounded-full shadow-lg", s.color, s.label === 'Active Sessions' && "pulse-active")} />
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{s.label}</span>
                             <span className="text-sm font-black text-white italic">{s.count}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    roomNumber={room.room_number}
                    status={room.status}
                    progress={room.status === 'USING' ? (35 + (parseInt(room.id) * 7) % 55) : 0}
                    isSelected={selectedRoomId === room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                  />
                ))}
              </div>
           </section>

           {/* Bottom Area: Global Log Feed */}
           <footer className="h-[240px] bg-[#0f172a] border-t border-white/5 flex flex-col shrink-0 z-10 shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.5)]">
              <div className="h-12 bg-[#1e293b]/30 border-b border-black/20 flex items-center px-8 justify-between">
                 <div className="flex items-center gap-3">
                    <Activity className="w-3.5 h-3.5 text-[#8b5cf6] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Real-Time Operation Feed</span>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Latency: 18ms</div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Engine: Stable</div>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 font-mono text-[11px] space-y-4 bg-gradient-to-b from-[#0f172a] to-[#1e293b]/20">
                 {logs.map((log) => (
                    <div key={log.id} className="flex gap-6 items-start animate-in group">
                       <span className="text-slate-700 font-bold whitespace-nowrap min-w-[70px]">[{log.time}]</span>
                       <div className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest min-w-[65px] text-center",
                          log.type === 'SYSTEM' ? "bg-slate-800 text-slate-500" :
                          log.type === 'ORDER' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" :
                          log.type === 'ERROR' ? "bg-red-500/20 text-red-500 border border-red-500/20" :
                          "bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/20"
                       )}>
                          {log.type}
                       </div>
                       <span className="text-slate-400 group-hover:text-slate-100 transition-colors leading-relaxed">{log.message}</span>
                       <div className="flex-1" />
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-800 opacity-20" />
                    </div>
                 ))}
                 <div className="flex gap-6 items-center opacity-20 border-t border-white/5 pt-4">
                    <span className="text-slate-800">[{new Date().toLocaleTimeString()}]</span>
                    <span className="text-[9px] tracking-widest italic uppercase">Awaiting External Trigger Logs...</span>
                 </div>
              </div>
           </footer>
        </main>
      </div>

      {/* FOOTER BAR: System Status */}
      <footer className="h-[30px] bg-[#8b5cf6] flex items-center px-6 justify-between shrink-0 select-none shadow-[0_-4px_15px_rgba(139,92,246,0.2)]">
         <div className="flex items-center gap-8">
            <span className="text-[9px] font-black text-white italic uppercase tracking-[0.2em] flex items-center gap-2">
               <Monitor className="w-3 h-3" /> Master Admin Hub Access Verified
            </span>
            <div className="h-3 w-[1px] bg-white/30" />
            <div className="flex items-center gap-2 text-[9px] font-bold text-white/90">
               <Users className="w-3.5 h-3.5" />
               Current Fleet Load: {stats.using} Units
            </div>
         </div>
         <div className="flex items-center gap-5 text-[9px] font-black text-white uppercase italic tracking-[0.2em]">
            Hub Uptime: 284:12:05
            <div className="h-3 w-[1px] bg-white/30" />
            V1.28.4
         </div>
      </footer>
    </div>
  );
}

export default App;
