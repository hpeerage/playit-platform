/* src/pages/ClientLauncher.tsx */
import { useState, useEffect } from 'react';
import { Gamepad2, ShoppingBag, Headset, User, Bell } from 'lucide-react';
import ClientHeader from '../components/client/ClientHeader';
import GameListModal from '../components/client/GameListModal';
import FoodOrderModal from '../components/client/FoodOrderModal';
import MyInfoModal from '../components/client/MyInfoModal';
import DeliveryOrderModal from '../components/client/DeliveryOrderModal';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const ClientLauncher = () => {
  const { user, member } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState<{title: string, message: string} | null>(null);
  
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  // 실시간 주문 상태 감지
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`user-orders-${user.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          if (payload.new.status === 'Completed' && payload.old.status !== 'Completed') {
            setToastConfig({
              title: 'ORDER COMPLETED',
              message: '주문하신 음식이 준비되었습니다. 곧 조리대에서 가져다 드릴게요!'
            });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 원격 명령 구독 (WBS 3단계)
  useEffect(() => {
    if (!user) return;

    // 현재 클라이언트의 room_id를 가져옴 (여기서는 임시로 첫번째 room을 사용하거나 room_number 1번 검색)
    const setupCommandSubscription = async () => {
      const { data: roomData } = await supabase.from('rooms').select('id').eq('room_number', 1).single();
      if (!roomData) return;

      const channel = supabase
        .channel(`remote-ctrl-${roomData.id}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'remote_commands',
            filter: `room_id=eq.${roomData.id}`
          },
          async (payload: any) => {
            const { command, payload: cmdPayload, id: cmdId } = payload.new;
            
            if (command === 'LOGOUT') {
              setToastConfig({
                title: 'TERMINAL TERMINATED',
                message: '관리자에 의해 세션이 종료되었습니다. 잠시 후 로그아웃됩니다.'
              });
              setShowToast(true);
              setTimeout(() => {
                supabase.auth.signOut();
                window.location.href = '/login';
              }, 3000);
            } else if (command === 'MESSAGE') {
              setToastConfig({
                title: 'ADMIN MESSAGE',
                message: cmdPayload.message || '관리자로부터 메시지가 도착했습니다.'
              });
              setShowToast(true);
              setTimeout(() => setShowToast(false), 8000);
            }

            // 실행 완료 표시
            await supabase.from('remote_commands').update({ is_executed: true }).eq('id', cmdId);
          }
        )
        .subscribe();

      return channel;
    };

    let activeChannel: any;
    setupCommandSubscription().then(ch => activeChannel = ch);

    return () => {
      if (activeChannel) supabase.removeChannel(activeChannel);
    };
  }, [user]);

  const handleCallAdmin = async () => {
    try {
      setToastConfig({
        title: 'Request Sent',
        message: 'An admin has been notified.'
      });
      setShowToast(true);
      
      // 알림 전송 (room_number 1번으로 임시 가정)
      const { data: rooms } = await supabase.from('rooms').select('id').eq('room_number', 1).single();
      
      await supabase.from('notifications').insert({
        type: 'Call',
        message: `${member?.name || 'GUEST'}(ID: ${user?.email?.split('@')[0]})님이 Station 1에서 관리자를 호출했습니다.`,
        room_id: rooms?.id,
        is_read: false
      });

      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Call Admin failed:', error);
    }
  };


  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-hidden relative font-sans">
      {/* Immersive Gaming Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E1B4B]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#a855f71a,transparent_70%)]" />
      
      {/* Layered Content */}
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        <ClientHeader />

        <main className="flex-1 flex flex-col justify-center px-10 py-6 overflow-x-auto custom-scrollbar">
          <div className="mb-6 px-2">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500/60 mb-1 block">Authentication Node Connected</span>
             <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
               {member?.name ? `WELCOME, ${member.name}` : 'Ready to Play?'}
             </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-10 px-2 relative z-10 w-full max-w-6xl mx-auto">
            {[
                { title: 'GAME START', icon: Gamepad2, color: 'from-fuchsia-600 to-purple-600', shadow: 'shadow-purple-500/20', onClick: () => setIsGameModalOpen(true) },
                { title: 'ORDER FOOD', icon: ShoppingBag, color: 'from-blue-600 to-cyan-600', shadow: 'shadow-blue-500/20', onClick: () => setIsFoodModalOpen(true) },
                { title: 'CALL ADMIN', icon: Headset, color: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-500/20', onClick: handleCallAdmin },
                { title: 'MY INFO', icon: User, color: 'from-orange-600 to-amber-600', shadow: 'shadow-orange-500/20', onClick: () => setIsInfoModalOpen(true) }
            ].map((item, i) => (
                <button 
                    key={i} 
                    className={cn(
                        "group relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.08] hover:border-white/20 active:scale-95",
                        "flex flex-col items-center justify-center gap-6 overflow-hidden",
                        `hover:${item.shadow}`
                    )}
                    onClick={item.onClick}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={cn("w-20 h-20 rounded-[1.8rem] bg-gradient-to-br flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500", item.color)}>
                        <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-sm font-black italic tracking-[0.2em] text-white/50 group-hover:text-white transition-colors uppercase relative z-10">{item.title}</span>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/5 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                </button>
            ))}
          </div>

          {/* Footer Promo Section */}
          <div className="mt-4 px-2 flex items-center justify-between border-t border-white/5 pt-10">
             <div className="flex items-center gap-10">
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Identity</span>
                   <span className="text-sm font-bold text-white uppercase italic tracking-tighter">
                     {member?.rank || 'SILVER'} LEVEL [{(member?.points || 0).toLocaleString()} PT]
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Terminal Session</span>
                   <span className="text-sm font-bold text-slate-400 uppercase italic tabular-nums tracking-tighter">
                     {member?.remaining_time || '00:00:00'} LEFT
                   </span>
                </div>
             </div>
             
             <div className="px-6 py-2 bg-purple-600 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse cursor-pointer hover:bg-purple-500 transition-colors">
                Support Available
             </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <GameListModal isOpen={isGameModalOpen} onClose={() => setIsGameModalOpen(false)} />
      <FoodOrderModal isOpen={isFoodModalOpen} onClose={() => setIsFoodModalOpen(false)} />
      <MyInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
      <DeliveryOrderModal 
        isOpen={isDeliveryModalOpen} 
        onClose={() => setIsDeliveryModalOpen(false)} 
        roomNumber={1} 
      />

      {/* Modern Notification Toast */}
      <div className={cn(
        "fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out",
        showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}>
        <div className="bg-slate-950/90 backdrop-blur-xl border border-purple-500/30 px-8 py-4 rounded-2xl flex items-center gap-4 shadow-[0_20px_50px_rgba(139,92,246,0.3)]">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center animate-bounce shrink-0">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-black italic text-white uppercase tracking-tighter">
              {toastConfig?.title || 'Notification'}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {toastConfig?.message || 'New update available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLauncher;
