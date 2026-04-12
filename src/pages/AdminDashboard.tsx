import { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import GNB from '../components/GNB';
import RoomCard from '../components/RoomCard';
import DetailPanel from '../components/DetailPanel';
import MemberListView from '../components/admin/MemberListView';
import OrderQueueView from '../components/admin/OrderQueueView';
import ReportsView from '../components/admin/ReportsView';
import ChatView from '../components/admin/ChatView';
import FAQManagementView from '../components/admin/FAQManagementView';
import StoreSettingsView from '../components/admin/StoreSettingsView';
import { useRooms } from '../hooks/useRooms';
import { useOrders } from '../hooks/useOrders';
import { supabase, type Notification as SupabaseNotification } from '../lib/supabase';
import { 
  Users, BarChart3, Settings, Monitor, MessageSquare, ShoppingBag, 
  X, Trash2, Bell, Clock, BedDouble
} from 'lucide-react';
import { cn } from '../lib/utils';

const ServiceTabContainer = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'faq'>('chat');
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex border-b border-white/5 bg-[#050914] px-10 pt-4 gap-8">
         <button 
           onClick={() => setActiveTab('chat')}
           className={cn(
             "pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2",
             activeTab === 'chat' ? "border-purple-500 text-white" : "border-transparent text-slate-500 hover:text-white"
           )}
         >
           Real-time Chat
         </button>
         <button 
           onClick={() => setActiveTab('faq')}
           className={cn(
             "pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2",
             activeTab === 'faq' ? "border-purple-500 text-white" : "border-transparent text-slate-500 hover:text-white"
           )}
         >
           FAQ Manager
         </button>
      </div>
      <div className="flex-1 overflow-hidden">
         {activeTab === 'chat' ? <ChatView /> : <FAQManagementView />}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { rooms, stats: roomStats, loading: roomsLoading, updateRoomStatus, checkoutRoom, sendRemoteCommand, reconfigureStore } = useRooms();
  const { orders } = useOrders();
  
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState('pms');
  const [viewMode, setViewMode] = useState<'room' | 'pc'>('room');
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState<SupabaseNotification[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<SupabaseNotification[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin_notifications')
      .on('postgres_changes' as any, { event: 'INSERT', table: 'notifications' }, (payload: any) => {
        setNotifications(prev => [payload.new as SupabaseNotification, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchRecentNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setRecentNotifications(data);
  };

  useEffect(() => {
    if (isHistoryOpen) {
      fetchRecentNotifications();
    }
  }, [isHistoryOpen, notifications]);

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setRecentNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = async () => {
    if (!confirm('모든 알림을 완전히 삭제하시겠습니까?')) return;
    await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setNotifications([]);
    setRecentNotifications([]);
  };

  // Memoized filtered rooms
  const filteredRooms = useMemo(() => {
    if (filter === 'All') return rooms;
    if (filter === 'Active') return rooms.filter(r => r.status === 'Using');
    if (filter === 'Empty') return rooms.filter(r => r.status === 'Empty');
    return rooms.filter(r => r.status === 'Maintenance');
  }, [rooms, filter]);

  const floorGroups = useMemo(() => {
    if (!filteredRooms || filteredRooms.length === 0) return {};
    return filteredRooms.reduce((acc, room) => {
      const roomNum = room.room_number;
      const floor = Math.floor(roomNum / 100);
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(room);
      return acc;
    }, {} as Record<number, typeof filteredRooms>);
  }, [filteredRooms]);

  const selectedRoom = useMemo(() => 
    rooms.find(r => r.id === selectedRoomId) || null, 
    [rooms, selectedRoomId]
  );

  const navItems = [
    { id: 'pms', icon: Monitor, label: 'PMS Dashboard' },
    { id: 'orders', icon: ShoppingBag, label: 'Sales & Orders' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'service', icon: MessageSquare, label: 'Service & FAQ' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const headerStats = {
    total: roomStats.totalRooms,
    using: roomStats.activeRooms,
    empty: roomStats.emptyRooms,
    pendingOrders: orders.filter(o => o.status === 'Pending').length
  };

  const renderMainContent = () => {
    if (roomsLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Synchronizing Data...</span>
          </div>
        </div>
      );
    }

    switch (activeMenu) {
      case 'members': return <MemberListView />;
      case 'orders': return <OrderQueueView />;
      case 'reports': return <ReportsView />;
      case 'service': return <ServiceTabContainer />;
      case 'settings': return <StoreSettingsView onReconfigure={reconfigureStore} currentRoomCount={rooms.length} />;
      case 'pms':
      default:
        return (
          <div className="flex flex-col min-h-full relative">
            <div className="flex-1 pb-20">
              <div className="mb-4 mt-6 flex items-center justify-between px-10">
                 <div>
                    <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Store Layout Monitoring</h2>
                    <div className="flex items-center gap-3">
                       <span className="text-2xl font-black italic text-white leading-none uppercase tracking-tighter">Real-Time Floor View</span>
                       <div className="h-4 w-px bg-white/10" />
                       <span className="text-purple-400 text-[11px] font-bold uppercase tracking-widest">{filteredRooms.length} Units Connected</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6">
                    <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                        <button onClick={() => setViewMode('room')} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'room' ? "bg-purple-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}>
                          <BedDouble className="w-3.5 h-3.5" /> Room Mode
                        </button>
                        <button onClick={() => setViewMode('pc')} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'pc' ? "bg-purple-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}>
                          <Monitor className="w-3.5 h-3.5" /> PC Mode
                        </button>
                    </div>

                    <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/5 h-fit">
                        {['All', 'Active', 'Empty', 'Error'].map((f) => (
                          <button key={f} onClick={() => setFilter(f)} className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", f === filter ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300")}>
                            {f}
                          </button>
                        ))}
                    </div>
                 </div>
              </div>

              <div className={cn("px-10 transition-all duration-700 min-h-0", selectedRoomId ? "pr-[420px]" : "pr-10")}>
                  {Object.entries(floorGroups).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([floor, rooms]) => (
                    <div key={floor} className="floor-section mb-10">
                      <div className="floor-label flex items-center gap-2 mb-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                         <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{floor}F Floor</span>
                         <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3">
                        {rooms.map((room) => {
                          const activeOrder = orders.find(o => {
                            const matchStatus = o.status === 'Pending' || o.status === 'Processing';
                            const matchId = o.room_id === room.id;
                            const matchNumber = o.rooms?.room_number === room.room_number;
                            const matchDemo = o.rooms?.room_number === 1011 && room.room_number === 1;
                            return matchStatus && (matchId || matchNumber || matchDemo);
                          });
                          return (
                            <RoomCard
                              key={room.id}
                              roomNumber={room.room_number}
                              status={room.status}
                              remainingTime={room.remaining_time || "00:00:00"}
                              isSelected={selectedRoomId === room.id}
                              orderStatus={activeOrder?.status}
                              onClick={() => setSelectedRoomId(room.id)}
                              viewMode={viewMode}
                              pcs={room.pcs}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <DetailPanel 
              room={selectedRoom} 
              onClose={() => setSelectedRoomId(null)} 
              onStatusChange={updateRoomStatus} 
              onCheckout={checkoutRoom}
              onRemoteCommand={sendRemoteCommand}
            />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex h-screen bg-[#050914] text-slate-200 overflow-hidden font-sans selection:bg-purple-500/30">
      <GNB activeMenu={activeMenu} setActiveMenu={setActiveMenu} items={navItems} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          stats={headerStats} 
          currentTime={currentTime}
          unreadCount={unreadCount}
          onBellClick={() => setIsHistoryOpen(true)}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#050914]">
          {renderMainContent()}
        </main>
      </div>

      {/* Notification History Sidebar */}
      {isHistoryOpen && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-[#020617] border-l border-white/5 z-[5000] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Bell className="w-5 h-5 text-purple-400" />
                 <span className="text-sm font-black uppercase tracking-widest text-white">Notifications History</span>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                 <X className="w-5 h-5 text-slate-500" />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notif) => (
                  <div key={notif.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl relative group">
                     <button 
                       onClick={() => deleteNotification(notif.id)}
                       className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-all"
                     >
                        <Trash2 className="w-3.5 h-3.5" />
                     </button>
                     <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-500">{new Date(notif.created_at).toLocaleString()}</span>
                     </div>
                     <p className="text-xs font-black text-purple-400 mb-1 uppercase tracking-widest">{notif.type} Alert</p>
                     <p className="text-[11px] text-slate-300 leading-relaxed font-bold">{notif.message}</p>
                     <div className="mt-2 text-[9px] text-slate-500 font-bold">Room #{notif.rooms?.room_number || 'Admin'}</div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
                   <Bell className="w-10 h-10 opacity-10" />
                   <span className="text-[10px] font-black uppercase tracking-widest">No notifications yet</span>
                </div>
              )}
           </div>

           <div className="p-6 border-t border-white/5">
              <button 
                onClick={clearAllNotifications}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                 Clear All History
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
