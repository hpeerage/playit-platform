/* src/App.tsx */
import { useState, useMemo } from 'react';
import { 
  Zap, Users, Activity, ChevronRight, Monitor, Clock, Package, DollarSign, 
  Search, Info, Terminal, MessageSquare, LogOut, Settings, Bell, RefreshCw, Layers, AlertCircle
} from 'lucide-react';
import RoomCard from './components/RoomCard';
import type { Room } from './lib/supabase';
import { cn } from './lib/utils';

// Mock Data for Playit Control Center (30 Rooms)
const INITIAL_ROOMS: Room[] = Array.from({ length: 30 }).map((_, i) => ({
  id: (i + 1).toString(),
  room_number: (301 + i).toString(),
  status: Math.random() > 0.6 ? 'USING' : Math.random() > 0.1 ? 'EMPTY' : 'MAINTENANCE',
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
    { id: '2', time: '14:35:10', message: 'Room 301 session started.', type: 'INFO' },
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
      setLogs(prev => [{ id: Date.now().toString(), time: new Date().toLocaleTimeString(), message: 'Manual DB sync successful.', type: 'SYSTEM' }, ...prev]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-[#f8fafc] font-sans overflow-hidden">
      
      {/* 1. Header: Playit Control Center Ribbon */}
      <header className="h-[64px] bg-[#1e293b] border-b border-black/20 flex items-center px-6 justify-between select-none shrink-0 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="bg-[#8b5cf6] p-1.5 rounded-lg shadow-lg shadow-purple-500/20 pulse-active">
                <Zap className="w-5 h-5 text-white fill-white" />
             </div>
             <div className="flex flex-col leading-none">
                <span className="font-black text-lg tracking-tighter uppercase italic text-[#8b5cf6]">Playit</span>
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Control Hub</span>
             </div>
          </div>
          
          <div className="h-6 w-[1.5px] bg-slate-700/50" />
          
          <nav className="flex items-center gap-1">
             {['Overview', 'Members', 'Analytics', 'Settings'].map((tab, i) => (
                <button key={i} className={cn(
                   "px-4 py-2 text-xs font-bold tracking-tight uppercase rounded-lg transition-all",
                   i === 0 ? "text-[#8b5cf6] bg-[#8b5cf6]/10" : "text-slate-400 hover:text-white"
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
               placeholder="Search Units..." 
               className="bg-[#0f172a] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs w-48 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all outline-none"
            />
          </div>
          <button onClick={handleManualSync} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:text-[#8b5cf6] transition-all">
            <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
          </button>
          <button className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:text-[#8b5cf6] transition-all relative">
            <Bell className="w-4 h-4" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-slate-800 rounded-full" />
          </button>
        </div>
      </header>

      {/* 2. Main Workspace: 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: [Sidebar - Room Detailed Info] */}
        <aside className="w-[320px] bg-[#1e293b] border-r border-[#334155]/20 flex flex-col p-6 overflow-y-auto select-none shrink-0 z-20 shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Target Unit Context</h3>
             <Info className="h-4 w-4 text-slate-600" />
          </div>

          {selectedRoom && selectedRoom.status === 'USING' ? (
            <div className="animate-in space-y-8 flex flex-col h-full">
               <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#334155]/40 border border-slate-700/50">
                 <div className="w-14 h-14 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center relative overflow-hidden group flex-shrink-0">
                   <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${selectedRoom.id}`} alt="User" className="w-10 h-10 drop-shadow-lg" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#8b5cf6]/20 to-transparent" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="text-[10px] text-slate-500 font-bold mb-1 tracking-tight">Room Unit {selectedRoom.room_number}</div>
                   <div className="text-sm font-black tracking-tight text-white normal-case italic truncate">GUEST_{selectedRoom.room_number}</div>
                   <div className="flex items-center gap-1.5 mt-1.5 px-2 py-0.5 w-fit rounded bg-[#8b5cf6]/20 text-[#8b5cf6] text-[8px] font-black uppercase tracking-widest">
                      Verified Access
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 {[
                   { label: 'Check-In Time', value: 'Today 14:32', icon: Clock },
                   { label: 'Time Remaining', value: '08:42:11', icon: Terminal, color: 'text-purple-400' },
                   { label: 'Unpaid Orders', value: '$24.50', icon: DollarSign, color: 'text-emerald-400' },
                   { label: 'Active Services', value: '4 Assets', icon: Package },
                 ].map((row, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#0f172a]/40 border border-slate-800/50 hover:border-slate-700 transition-colors">
                     <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold">
                        <row.icon className="w-4 h-4 opacity-70" />
                        <span>{row.label}</span>
                     </div>
                     <span className={cn("text-[11px] font-black italic tracking-tight text-slate-200", row.color)}>{row.value}</span>
                   </div>
                 ))}
               </div>

               <div className="mt-auto pt-8 space-y-3">
                 <button className="w-full flex items-center justify-center gap-3 bg-[#8b5cf6] hover:bg-purple-500 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.1em] text-white shadow-lg shadow-purple-500/20 cursor-pointer active:scale-95 transition-all">
                    <MessageSquare className="w-4 h-4" /> Message User
                 </button>
                 <div className="grid grid-cols-2 gap-3">
                   <button className="flex items-center justify-center gap-2 bg-[#334155] hover:bg-slate-600 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-200 cursor-pointer transition-all">
                      <Settings className="w-4 h-4" /> Reset
                   </button>
                   <button className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 cursor-pointer transition-all">
                      <LogOut className="w-4 h-4" /> Shutdown
                   </button>
                 </div>
               </div>
            </div>
          ) : selectedRoom ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 animate-in">
               <div className="w-24 h-24 rounded-full bg-slate-800/30 flex items-center justify-center mb-6">
                  <Monitor className="w-10 h-10 opacity-20" />
               </div>
               <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-1">Room {selectedRoom.room_number}</p>
               <p className="text-[10px] font-medium text-slate-700 italic">No Authorized Session Active</p>
               <button 
                  onClick={() => setRooms(rooms.map(r => r.id === selectedRoom.id ? {...r, status: 'USING'} : r))}
                  className="mt-8 px-10 py-4 bg-[#334155] hover:bg-[#8b5cf6] text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
               >
                 Authorize Session
               </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 italic text-slate-500">
               <Layers className="w-12 h-12 mb-4" />
               <p className="text-[11px] font-bold tracking-widest uppercase">Select Unit to Command</p>
            </div>
          )}
        </aside>

        {/* CENTER + BOTTOM Workspace Container */}
        <main className="flex-1 flex flex-col overflow-hidden">
           
           {/* [Center Main - Room Grid] */}
           <section className="flex-1 p-8 overflow-y-auto bg-[#0f172a] relative">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex flex-col leading-tight">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Operational Status</span>
                    <h2 className="text-xl font-black italic tracking-tighter uppercase text-white flex items-center gap-3">
                       Unit Grid View
                       <span className="text-slate-700 text-sm font-light italic normal-case tracking-tight pr-2">/{stats.total} total nodes</span>
                    </h2>
                 </div>
                 
                 <div className="flex items-center gap-6 bg-[#1e293b]/50 p-2 rounded-2xl border border-slate-800/50">
                    {[
                       { label: 'Active', count: stats.using, color: 'bg-[#8b5cf6]' },
                       { label: 'Empty', count: stats.total - stats.using, color: 'bg-slate-700' },
                    ].map((s, i) => (
                       <div key={i} className="flex items-center gap-3 px-4">
                          <div className={cn("w-2 h-2 rounded-full", s.color)} />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                          <span className="text-xs font-black text-white">{s.count}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    roomNumber={room.room_number}
                    status={room.status}
                    progress={room.status === 'USING' ? Math.floor(Math.random() * 80) + 10 : 0}
                    isSelected={selectedRoomId === room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                  />
                ))}
              </div>
           </section>

           {/* [BOTTOM FEED - Real-Time System Logs] */}
           <footer className="h-[220px] bg-[#0f172a] border-t border-[#334155]/20 flex flex-col shrink-0 z-10">
              <div className="h-10 bg-[#1e293b]/50 border-b border-black/10 flex items-center px-8 justify-between">
                 <div className="flex items-center gap-3">
                    <Activity className="w-3.5 h-3.5 text-[#8b5cf6]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Global Operation Feed</span>
                 </div>
                 <div className="flex items-center gap-6 text-[9px] font-bold text-slate-600">
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> API: Latency 22ms</div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> WS: Connection Stable</div>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] space-y-3 bg-[#0f172a]/80">
                 {logs.map((log) => (
                    <div key={log.id} className="flex gap-5 items-start animate-in group">
                       <span className="text-slate-600 font-bold whitespace-nowrap">[{log.time}]</span>
                       <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                          log.type === 'SYSTEM' ? "bg-slate-800 text-slate-400" :
                          log.type === 'ORDER' ? "bg-emerald-500/20 text-emerald-400" :
                          log.type === 'ERROR' ? "bg-red-500/20 text-red-500" :
                          "bg-[#8b5cf6]/20 text-[#8b5cf6]"
                       )}>
                          {log.type}
                       </span>
                       <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
                       <div className="flex-1" />
                       <span className="text-[9px] text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">SEQ_HUB_V1.0.4</span>
                    </div>
                 ))}
                 <div className="flex gap-5 items-center opacity-40">
                    <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                    <span className="text-slate-800 italic">SYSTEM IDLE: Hub heartbeat verified. Awaiting external triggers...</span>
                 </div>
              </div>
           </footer>
        </main>
      </div>

      {/* [GLOBAL STATUS BAR] */}
      <div className="h-[28px] bg-[#8b5cf6] flex items-center px-6 justify-between shrink-0 select-none overflow-hidden">
         <div className="flex items-center gap-6">
            <span className="text-[9px] font-black text-white italic uppercase tracking-widest">Master Admin Auth Process Verified</span>
            <div className="h-3 w-[1px] bg-white/20" />
            <div className="flex items-center gap-2 text-[9px] font-bold text-white/80">
               <Users className="w-3 h-3" />
               Connected: {stats.using*2+12} Users
            </div>
         </div>
         <div className="flex items-center gap-4 text-[9px] font-black text-white uppercase italic tracking-[0.2em]">
            Server Uptime: 142:18:55
            <div className="w-4 h-4 rounded ml-2 bg-white/20 flex items-center justify-center">
               <ChevronRight className="w-3 h-3" />
            </div>
         </div>
      </div>
    </div>
  );
}

export default App;
