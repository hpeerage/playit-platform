/* src/App.tsx */
import { useState, useMemo } from 'react';
import { 
  Zap, Monitor, Clock, LogOut, CheckCircle2, AlertCircle, ShoppingCart, User, X
} from 'lucide-react';
import RoomCard from './components/RoomCard';
import type { Room } from './lib/supabase';
import { cn } from './lib/utils';

// Generate 50 rooms for a professional PC room feel
const INITIAL_ROOMS: Room[] = Array.from({ length: 50 }).map((_, i) => ({
  id: (i + 1).toString(),
  room_number: (101 + i).toString(),
  status: (i % 7 === 0) ? 'USING' : (i % 12 === 0) ? 'MAINTENANCE' : 'EMPTY',
  updated_at: new Date().toISOString()
}));

function App() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const selectedRoom = useMemo(() => 
    rooms.find(r => r.id === selectedRoomId), 
    [rooms, selectedRoomId]
  );

  const stats = useMemo(() => {
    const using = rooms.filter(r => r.status === 'USING').length;
    const maintenance = rooms.filter(r => r.status === 'MAINTENANCE').length;
    return { using, maintenance, total: rooms.length };
  }, [rooms]);

  const handleAction = (roomId: string, newStatus: Room['status']) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e293b] text-[#f8fafc] font-sans selection:bg-purple-500/30 overflow-hidden">
      
      {/* 1. FIXED HEADER: Playit Admin Ribbon */}
      <header className="h-[60px] bg-[#0f172a] border-b border-white/5 flex items-center px-6 justify-between select-none shrink-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
           <div className="bg-[#8b5cf6] p-1.5 rounded-lg shadow-lg shadow-purple-500/20">
              <Zap className="w-5 h-5 text-white fill-white" />
           </div>
           <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter uppercase italic text-white leading-none">Playit Admin</span>
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase opacity-60">Control Center Enterprise v2.0</span>
           </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">Total Units</span>
                 <span className="text-lg font-black italic">{stats.total}</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="flex flex-col items-end">
                 <span className="text-[10px] text-[#8b5cf6] font-bold uppercase leading-none mb-1">Active PC</span>
                 <span className="text-lg font-black italic text-[#8b5cf6]">{stats.using}</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="flex flex-col items-end">
                 <span className="text-[10px] text-red-500 font-bold uppercase leading-none mb-1">Alerts</span>
                 <span className="text-lg font-black italic text-red-500">{stats.maintenance}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5">
                 <User className="w-4 h-4 text-[#8b5cf6]" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black italic">SUPER_MANAGER</span>
                 <span className="text-[8px] font-bold text-emerald-400 uppercase">Online</span>
              </div>
           </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE: Sticky-like Grid + Slide-in Sidebar */}
      <main className="flex-1 flex overflow-hidden relative">
         {/* Fixed aspect Grid Area */}
         <div className={cn(
           "flex-1 grid-container custom-scrollbar transition-all duration-300",
           selectedRoomId ? "pr-[400px]" : "pr-0"
         )}>
            {rooms.map((room, idx) => (
              <RoomCard
                key={room.id}
                roomNumber={room.room_number}
                status={room.status}
                initialSeconds={10000 + (idx * 1200)}
                isSelected={selectedRoomId === room.id}
                onClick={() => setSelectedRoomId(room.id)}
              />
            ))}
         </div>

         {/* 3. DETAIL SIDEBAR (Right) - Absolute Slide-in over Grid */}
         <aside className={cn(
           "detail-sidebar transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
           selectedRoomId ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
         )}>
            {selectedRoom ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-[#8b5cf6] rounded-full" />
                      <h3 className="text-xl font-black italic uppercase tracking-tighter">Unit #{selectedRoom.room_number}</h3>
                   </div>
                   <button 
                     onClick={() => setSelectedRoomId(null)}
                     className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/5"
                   >
                     <X className="w-5 h-5 text-slate-500" />
                   </button>
                </div>

                <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                   {/* Status Card */}
                   <div className="p-6 rounded-3xl bg-[#1e293b] border border-white/5 shadow-inner">
                      <div className="flex items-center gap-5 mb-5">
                         <div className={cn(
                           "w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5",
                           selectedRoom.status === 'USING' ? "bg-purple-500/10 text-[#8b5cf6]" : "bg-slate-800/50 text-slate-500"
                         )}>
                            <Monitor className="w-7 h-7" />
                         </div>
                         <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Status Dashboard</div>
                            <div className={cn(
                              "text-lg font-black italic",
                              selectedRoom.status === 'USING' ? "text-[#8b5cf6]" : "text-white"
                            )}>
                               {selectedRoom.status === 'USING' ? "SESSION ACTIVE" : "SYSTEM IDLE"}
                            </div>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 pt-5 border-t border-white/5">
                         <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mb-0.5">Start Timestamp</div>
                            <div className="text-xs font-black italic tracking-tighter">14:52:10</div>
                         </div>
                         <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mb-0.5">Uptime Meter</div>
                            <div className="text-xs font-black italic text-[#8b5cf6] tracking-tighter">02h 45m 12s</div>
                         </div>
                      </div>
                   </div>

                   {/* Order Status Section */}
                   <div className="p-6 rounded-3xl bg-[#1e293b] border border-white/5">
                      <div className="flex items-center justify-between mb-5">
                         <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-emerald-400" />
                            <span className="text-[11px] font-black uppercase tracking-widest italic">Order Manifest</span>
                         </div>
                         <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">In Process</span>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[12px] bg-black/30 p-4 rounded-2xl border border-white/5 group hover:border-[#8b5cf6]/30 transition-colors">
                            <span className="text-slate-400 group-hover:text-white">Iced Americano (L)</span>
                            <span className="font-black italic text-slate-200">$4.50</span>
                         </div>
                         <div className="flex justify-between items-center text-[12px] bg-black/30 p-4 rounded-2xl border border-white/5 group hover:border-[#8b5cf6]/30 transition-colors">
                            <span className="text-slate-400 group-hover:text-white">Spicy Ramen Combo</span>
                            <span className="font-black italic text-slate-200">$8.90</span>
                         </div>
                      </div>
                   </div>

                   {/* Control Actions */}
                   <div className="space-y-4 pt-6">
                      <button 
                        onClick={() => handleAction(selectedRoom.id, 'USING')}
                        className="w-full h-16 bg-[#8b5cf6] hover:bg-purple-600 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20 active:scale-[0.98] group"
                      >
                         <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Approve Session
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <button 
                           onClick={() => handleAction(selectedRoom.id, 'MAINTENANCE')}
                           className="h-14 bg-red-400/5 hover:bg-red-400/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:border-red-500/40"
                         >
                            <AlertCircle className="w-4 h-4" /> Set Error
                         </button>
                         <button 
                           onClick={() => handleAction(selectedRoom.id, 'EMPTY')}
                           className="h-14 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:text-white"
                         >
                            <LogOut className="w-4 h-4" /> Remote Shut
                         </button>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                   <div className="flex items-center gap-3 p-5 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                      <Clock className="w-4 h-4 text-slate-700" />
                      <div className="flex flex-col">
                         <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Core Synchronized</span>
                         <span className="text-[11px] font-black italic tracking-tighter text-slate-400">{new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex-1" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-800 opacity-20 select-none">
                 <Monitor className="w-20 h-20 mb-6" />
                 <p className="text-xs font-black uppercase tracking-[0.6em] text-center leading-loose">Awaiting Command<br/>Selection</p>
              </div>
            )}
         </aside>
      </main>

      {/* 4. OPERATIONAL FOOTER */}
      <footer className="h-[28px] bg-[#0f172a] flex items-center px-6 justify-between shrink-0 select-none border-t border-white/5 z-50 shadow-inner">
         <div className="flex items-center gap-6">
            <span className="text-[9px] font-black text-slate-500 italic uppercase tracking-[0.2em] flex items-center gap-2">
               <Zap className="w-3 h-3 text-[#8b5cf6]" /> Connection: 100% Stable
            </span>
            <div className="h-3 w-[px] bg-white/5" />
            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter italic">Server Node: playit-hub-az1</span>
         </div>
         <div className="flex items-center gap-4 text-[9px] font-black text-slate-800 uppercase italic tracking-widest">
            UPTIME: {Math.floor(Date.now()/1000000)}ms
         </div>
      </footer>
    </div>
  );
}

export default App;
