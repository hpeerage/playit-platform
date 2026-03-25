import { useState } from 'react';
import { Gamepad2, ShoppingCart, Headset, UserCircle2, Bell, Truck } from 'lucide-react';
import ClientHeader from '../components/client/ClientHeader';
import LauncherCard from '../components/client/LauncherCard';
import GameListModal from '../components/client/GameListModal';
import FoodOrderModal from '../components/client/FoodOrderModal';
import MyInfoModal from '../components/client/MyInfoModal';
import DeliveryOrderModal from '../components/client/DeliveryOrderModal';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

const ClientLauncher = () => {
  const [showToast, setShowToast] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const handleCallAdmin = async () => {
    try {
      setShowToast(true);
      
      // 알림 전송 (room_number 1번으로 임시 가정)
      const { data: rooms } = await supabase.from('rooms').select('id').eq('room_number', 1).single();
      
      await supabase.from('notifications').insert({
        type: 'Call',
        message: 'Station 1에서 관리자를 호출했습니다.',
        room_id: rooms?.id,
        is_read: false
      });

      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Call Admin failed:', error);
    }
  };

  const menuItems = [
    { 
      title: "Game Start", 
      description: "최신 인기 게임 바로 실행", 
      icon: Gamepad2, 
      color: "bg-blue-500", 
      onClick: () => setIsGameModalOpen(true) 
    },
    { 
      title: "Order Food", 
      description: "맛있는 음식과 간식 주문", 
      icon: ShoppingCart, 
      color: "bg-emerald-500", 
      onClick: () => setIsFoodModalOpen(true) 
    },
    { 
      title: "Call Admin", 
      description: "도움이 필요할 때 관리자 호출", 
      icon: Headset, 
      color: "bg-red-500", 
      onClick: handleCallAdmin 
    },
    { 
      title: "My Info", 
      description: "내 계정 및 포인트 확인", 
      icon: UserCircle2, 
      color: "bg-amber-500",
      onClick: () => setIsInfoModalOpen(true)
    },
    { 
      title: "Delivery Order", 
      description: "외부 배달 음식 주문 안내", 
      icon: Truck,
      color: "bg-purple-500",
      onClick: () => setIsDeliveryModalOpen(true)
    },
  ];

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
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500/60 mb-1 block">Menu Category</span>
             <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">Ready to Play?</h2>
          </div>

          <div className="flex gap-8 pb-10 px-2">
            {menuItems.map((item, index) => (
              <LauncherCard 
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={item.color}
                onClick={item.onClick}
              />
            ))}
          </div>

          {/* Footer Promo Section */}
          <div className="mt-4 px-2 flex items-center justify-between border-t border-white/5 pt-10">
             <div className="flex items-center gap-10">
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ongoing Event</span>
                   <span className="text-sm font-bold text-white uppercase italic tracking-tighter">Summer Gaming Festival [X2 Points]</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Node</span>
                   <span className="text-sm font-bold text-slate-400 uppercase italic tabular-nums tracking-tighter">AZ-NODE-24-GPU</span>
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
        roomNumber={1} // Temporary fallback or logic to get current room
      />

      {/* Modern Notification Toast */}
      <div className={cn(
        "fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out",
        showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}>
        <div className="bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 px-8 py-4 rounded-2xl flex items-center gap-4 shadow-[0_20px_50px_rgba(139,92,246,0.3)]">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center animate-bounce">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-black italic text-white uppercase tracking-tighter">Request Sent</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">An admin has been notified.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLauncher;
