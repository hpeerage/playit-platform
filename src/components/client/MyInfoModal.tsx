/* src/components/client/MyInfoModal.tsx */
import React from 'react';
import { X, UserCircle2, Award, Clock, History, CreditCard, TrendingUp } from 'lucide-react';

interface MyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useAuth } from '../../hooks/useAuth';

const MyInfoModal: React.FC<MyInfoModalProps> = ({ isOpen, onClose }) => {
  const { member, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Connections을 해제하시겠습니까?')) {
      await signOut();
      onClose();
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
        <div className="relative text-white font-black uppercase tracking-widest animate-pulse">Loading Identity...</div>
      </div>
    );
  }

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
                   <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">{member?.name || 'GUEST'}</h2>
                   <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black rounded-full border border-amber-500/20 uppercase tracking-widest">{member?.rank || 'Silver'} MEMBER</span>
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
              <div className="text-3xl font-black text-white italic tracking-tighter tabular-nums mb-1">{(member?.points || 0).toLocaleString()} <span className="text-xs text-amber-500 uppercase not-italic">PT</span></div>
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
              <div className="text-3xl font-black text-white italic tracking-tighter tabular-nums mb-1">{member?.remaining_time || '00:00:00'}</div>
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
              <div className="p-8 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center opacity-30">
                 <History className="w-8 h-8 mb-2" />
                 <p className="text-[10px] font-black uppercase tracking-widest">No recent activity found</p>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-950/40 border-t border-white/5 flex items-center justify-between shrink-0">
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">Account secured by Playit Multi-Factor Authentication</p>
           <div className="flex gap-4">
              <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/10">Edit Profile</button>
              <button 
                onClick={handleSignOut}
                className="px-6 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 transition-all border border-red-500/20"
              >
                End Session
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfoModal;
