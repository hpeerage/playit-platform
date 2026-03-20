/* src/components/client/MyInfoModal.tsx */
import React from 'react';
import { X, UserCircle2, Award, Clock, History, CreditCard, ChevronRight } from 'lucide-react';

interface MyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const USER_DATA = {
  name: 'HOON LEE',
  level: 'Platinum Member',
  points: 15420,
  timeLeft: '02:45:10',
  usedToday: '01:15:00',
  recentActivity: [
    { id: 1, type: 'Game', title: 'League of Legends', date: 'Today, 10:20', duration: '45m' },
    { id: 2, type: 'Order', title: 'Premium Ramen + Cola', date: 'Yesterday, 19:45', cost: '8,500원' },
    { id: 3, type: 'Game', title: 'Valorant', date: 'Yesterday, 18:00', duration: '1h 20m' },
  ]
};

const MyInfoModal: React.FC<MyInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-full max-h-[750px] bg-slate-900/40 border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-500">
        
        {/* Header Section */}
        <div className="p-10 pb-6 flex items-start justify-between">
          <div className="flex items-center gap-6">
             <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-[0_10px_30px_rgba(245,158,11,0.3)]">
                <div className="w-full h-full rounded-[30px] bg-slate-900 flex items-center justify-center">
                   <UserCircle2 className="w-12 h-12 text-amber-500" />
                </div>
             </div>
             <div>
                <div className="flex items-center gap-3 mb-1">
                   <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">{USER_DATA.name}</h2>
                   <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black rounded-full border border-amber-500/20 uppercase tracking-widest">{USER_DATA.level}</span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">User Node AZ-42-PREMIUM</p>
             </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all hover:rotate-90 duration-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 px-10 mb-10">
           <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] group hover:bg-white/[0.08] transition-all">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    <Award className="w-4 h-4 text-amber-500" />
                 </div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Total Points</span>
              </div>
              <div className="text-3xl font-black text-white italic tracking-tighter tabular-nums mb-1">{USER_DATA.points.toLocaleString()} <span className="text-xs text-amber-500 uppercase not-italic">PT</span></div>
              <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
                 <TrendingUp className="w-3 h-3 text-emerald-500" /> +1,200 This Week
              </div>
           </div>

           <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] group hover:bg-white/[0.08] transition-all">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Clock className="w-4 h-4 text-purple-500" />
                 </div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Remaining Time</span>
              </div>
              <div className="text-3xl font-black text-white italic tracking-tighter tabular-nums mb-1">{USER_DATA.timeLeft}</div>
              <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Estimated 3 Sessions Left</div>
           </div>

           <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] group hover:bg-white/[0.08] transition-all">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                 </div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Plan Status</span>
              </div>
              <div className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Active</div>
              <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Renews in 12 Days</div>
           </div>
        </div>

        {/* Recent Activity Section */}
        <div className="flex-1 px-10 pb-10 overflow-hidden flex flex-col">
           <div className="flex items-center gap-3 mb-6 shrink-0">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">Recent Terminal Activity</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {USER_DATA.recentActivity.map((activity) => (
                <div key={activity.id} className="group p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-white/10">
                         {activity.type === 'Game' ? <Gamepad2 className="w-6 h-6 text-blue-400" /> : <ShoppingCart className="w-6 h-6 text-emerald-400" />}
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-white uppercase tracking-tight">{activity.title}</h4>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{activity.date}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 text-right">
                      <div>
                         <span className="text-xs font-black text-white italic tracking-tighter uppercase">{activity.duration || activity.cost}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-950/40 border-t border-white/5 flex items-center justify-between shrink-0">
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">Account secured by Playit Multi-Factor Authentication</p>
           <div className="flex gap-4">
              <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/10">Edit Profile</button>
              <button className="px-6 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 transition-all border border-red-500/20">End Session</button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Mock dependencies for local scope in case of import issues during development
import { Gamepad2, ShoppingCart, TrendingUp } from 'lucide-react';

export default MyInfoModal;
