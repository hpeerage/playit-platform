import { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import GNB from '../components/GNB';
import RoomCard from '../components/RoomCard';
import DetailPanel from '../components/DetailPanel';
import MemberListView from '../components/admin/MemberListView';
import OrderQueueView from '../components/admin/OrderQueueView';
import SeatMapView from '../components/admin/SeatMapView';
import ReportsView from '../components/admin/ReportsView';
import { useRooms } from '../hooks/useRooms';
import { cn } from '../lib/utils';
import { LayoutDashboard, Users, ShoppingBag, Monitor, BarChart3, Shield, Settings, Bell, Grid, Map as MapIcon } from 'lucide-react';

const AdminDashboard = () => {
  const { rooms, stats, updateRoomStatus, checkoutRoom } = useRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pendingOrders, setPendingOrders] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time order updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingOrders(prev => Math.max(0, prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate incoming admin calls
  const [notifications, setNotifications] = useState<{id: number, message: string}[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const id = Date.now();
        const station = Math.floor(Math.random() * 54) + 1;
        setNotifications(prev => [...prev, { id, message: `Station ${station}에서 관리자를 호출했습니다!` }]);
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, 8000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const selectedRoom = useMemo(() => 
    rooms.find(r => r.id === selectedRoomId) || null, 
    [rooms, selectedRoomId]
  );

  const dashStats = useMemo(() => ({
    ...stats,
    pendingOrders
  }), [stats, pendingOrders]);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'pcstatus', icon: Monitor, label: 'PC Status' },
    { id: 'inventory', icon: Shield, label: 'Security' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderMainContent = () => {
    switch (activeMenu) {
      case 'members':
        return <MemberListView />;
      case 'orders':
        return <OrderQueueView />;
      case 'reports':
        return <ReportsView />;
      case 'dashboard':
      case 'pcstatus':
      default:
        return (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="flex-1 grid-container custom-scrollbar transition-all duration-700 pb-10">
              <div className="col-span-full mb-6 mt-2 flex items-center justify-between px-2">
                 <div>
                    <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Station Monitoring</h2>
                    <div className="flex items-center gap-2">
                       <span className="text-xl font-black italic text-white leading-none">REAL-TIME STATUS</span>
                       <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-md border border-purple-500/20">{rooms.length} Units</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6">
                    {/* View Switcher */}
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
                        <button 
                          onClick={() => setViewMode('grid')}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                            viewMode === 'grid' ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "text-slate-500 hover:text-slate-300"
                          )}
                        >
                          <Grid className="w-3 h-3" /> Grid
                        </button>
                        <button 
                          onClick={() => setViewMode('map')}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                            viewMode === 'map' ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "text-slate-500 hover:text-slate-300"
                          )}
                        >
                          <MapIcon className="w-3 h-3" /> Map
                        </button>
                    </div>

                    <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5 h-fit">
                        {['All', 'Active', 'Empty', 'Error'].map((f) => (
                          <button key={f} className={cn(
                            "px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
                            f === 'All' ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                          )}>
                            {f}
                          </button>
                        ))}
                    </div>
                 </div>
              </div>

              {viewMode === 'grid' ? (
                <div className={cn(
                  "col-span-full grid-container-inner transition-all duration-700",
                  selectedRoomId ? "pr-[380px]" : "pr-0"
                )}>
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
              ) : (
                <div className={cn(
                  "col-span-full transition-all duration-700",
                  selectedRoomId ? "pr-[380px]" : "pr-0"
                )}>
                  <SeatMapView 
                    rooms={rooms}
                    selectedRoomId={selectedRoomId}
                    onRoomClick={(id) => setSelectedRoomId(id)}
                  />
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden select-none relative font-sans">
      <GNB activeMenu={activeMenu} setActiveMenu={setActiveMenu} items={navItems} />

      <div className="flex-1 flex flex-col min-w-0 ml-[80px] relative">
        <Header stats={dashStats} currentTime={currentTime} />

        <main className="flex-1 flex overflow-hidden relative">
          {renderMainContent()}

          {activeMenu === 'dashboard' || activeMenu === 'pcstatus' ? (
            <DetailPanel 
              room={selectedRoom}
              onClose={() => setSelectedRoomId(null)}
              onStatusChange={updateRoomStatus}
              onCheckout={checkoutRoom}
            />
          ) : null}
        </main>

        <footer className="h-8 bg-[#020617] border-t border-white/5 flex items-center px-8 justify-between shrink-0">
           <div className="flex items-center gap-6">
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 grow-green" />
                 Database Node Connected
              </span>
           </div>
           <div className="flex items-center gap-4 text-[9px] font-bold text-slate-700 uppercase italic">
              Terminal AZ-01-SECURE
           </div>
        </footer>
      </div>

      {/* Admin Notifications Overlay */}
      <div className="fixed bottom-12 right-6 z-[2000] flex flex-col gap-3 pointer-events-none">
        {notifications.map((n) => (
          <div key={n.id} className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border-l-4 border-l-red-500 border border-white/5 p-4 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-in slide-in-from-right duration-500 w-[320px]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <Bell className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black italic text-white uppercase tracking-tighter">Admin Call Received</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed uppercase">{n.message}</p>
                <button 
                  onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                  className="mt-2 text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors"
                >
                  Dismiss Call
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
