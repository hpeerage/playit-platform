/* src/pages/AdminDashboard.tsx - Premium High-Density DASH (Refactored) */
import { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import GNB from '../components/GNB';
import RoomCard from '../components/RoomCard';
import DetailPanel from '../components/DetailPanel';
import type { Room } from '../lib/supabase';
import { cn } from '../lib/utils';
import { LayoutDashboard, Users, Monitor, BarChart2, Shield, Settings } from 'lucide-react';

const INITIAL_ROOMS: Room[] = Array.from({ length: 54 }).map((_, i) => ({
  id: (i + 1).toString(),
  room_number: (i + 1).toString(),
  status: (i % 8 === 0) ? 'USING' : (i % 15 === 0) ? 'MAINTENANCE' : 'EMPTY',
  updated_at: new Date().toISOString()
}));

const AdminDashboard = () => {
  const [rooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedRoom = useMemo(() => 
    rooms.find(r => r.id === selectedRoomId) || null, 
    [rooms, selectedRoomId]
  );

  const stats = useMemo(() => {
    const using = rooms.filter(r => r.status === 'USING').length;
    const maintenance = rooms.filter(r => r.status === 'MAINTENANCE').length;
    const empty = rooms.length - using - maintenance;
    return { using, maintenance, empty, total: rooms.length, pendingOrders: 3 };
  }, [rooms]);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'pcstatus', icon: Monitor, label: 'PC Status' },
    { id: 'reports', icon: BarChart2, label: 'Reports' },
    { id: 'inventory', icon: Shield, label: 'Security' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden select-none">
      <GNB activeMenu={activeMenu} setActiveMenu={setActiveMenu} items={navItems} />

      <div className="flex-1 flex flex-col min-w-0 ml-[80px] relative">
        <Header stats={stats} currentTime={currentTime} />

        <main className="flex-1 flex overflow-hidden relative">
          <div className={cn(
            "flex-1 grid-container custom-scrollbar transition-all duration-700",
            selectedRoomId ? "pr-[380px]" : "pr-0"
          )}>
            <div className="col-span-full mb-6 mt-2 flex items-center justify-between">
               <div>
                  <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Station Monitoring</h2>
                  <div className="flex items-center gap-2">
                     <span className="text-xl font-black italic text-white leading-none">REAL-TIME STATUS</span>
                     <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-md border border-purple-500/20">{rooms.length} Units</span>
                  </div>
               </div>
               
               <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
                  {['All', 'Active', 'Empty', 'Error'].map((f) => (
                    <button key={f} className={cn(
                      "px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
                      f === 'All' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                    )}>
                      {f}
                    </button>
                  ))}
               </div>
            </div>

            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                roomNumber={room.room_number}
                status={room.status}
                remainingTime="02:45:10"
                isSelected={selectedRoomId === room.id}
                onClick={() => setSelectedRoomId(room.id)}
              />
            ))}
          </div>

          <DetailPanel 
            room={selectedRoom}
            onClose={() => setSelectedRoomId(null)}
          />
        </main>

        <footer className="h-8 bg-[#020617] border-t border-white/5 flex items-center px-8 justify-between shrink-0">
           <div className="flex items-center gap-6">
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-green" />
                 Database Node Connected
              </span>
           </div>
           <div className="flex items-center gap-4 text-[9px] font-bold text-slate-700 uppercase italic">
              Terminal AZ-01-SECURE
           </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
