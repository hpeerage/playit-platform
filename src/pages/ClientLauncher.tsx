import { Gamepad2, ShoppingCart, Headset, UserCircle2 } from 'lucide-react';
import ClientHeader from '../components/client/ClientHeader';
import LauncherCard from '../components/client/LauncherCard';

const ClientLauncher = () => {
  const menuItems = [
    { title: "Game Start", description: "최신 인기 게임 바로 실행", icon: Gamepad2, color: "bg-blue-500" },
    { title: "Order Food", description: "맛있는 음식과 간식 주문", icon: ShoppingCart, color: "bg-emerald-500" },
    { title: "Call Admin", description: "도움이 필요할 때 관리자 호출", icon: Headset, color: "bg-red-500" },
    { title: "My Info", description: "내 계정 및 포인트 확인", icon: UserCircle2, color: "bg-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-hidden relative font-sans">
      {/* Immersive Gaming Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E1B4B]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#a855f71a,transparent_70%)]" />
      
      {/* Layered Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <ClientHeader />

        <main className="flex-1 flex flex-col justify-center px-10 pb-20 overflow-x-auto custom-scrollbar">
          <div className="mb-10">
             <span className="text-xs font-black uppercase tracking-[0.4em] text-purple-500/60 mb-2 block">Menu Category</span>
             <h2 className="text-4xl font-black italic tracking-tighter text-white">READY TO PLAY?</h2>
          </div>

          <div className="flex gap-8 pb-10">
            {menuItems.map((item, index) => (
              <LauncherCard 
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={item.color}
              />
            ))}
          </div>

          {/* Footer Promo Section */}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-10">
             <div className="flex items-center gap-10">
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ongoing Event</span>
                   <span className="text-sm font-bold text-white uppercase italic">Summer Gaming Festival [X2 Points]</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Node</span>
                   <span className="text-sm font-bold text-slate-400 uppercase italic tabular-nums">AZ-NODE-24-GPU</span>
                </div>
             </div>
             
             <div className="px-6 py-2 bg-purple-600 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse cursor-pointer hover:bg-purple-500 transition-colors">
                Support Available
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientLauncher;
