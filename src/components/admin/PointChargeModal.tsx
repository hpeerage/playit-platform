/* src/components/admin/PointChargeModal.tsx */
import React, { useState } from 'react';
import { X, CreditCard, Award, User, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Member } from '../../lib/supabase';

interface PointChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onSuccess: () => void;
}

const PointChargeModal: React.FC<PointChargeModalProps> = ({ isOpen, onClose, member, onSuccess }) => {
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [newRank, setNewRank] = useState<string>(member?.rank || 'Silver');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (member) {
      setNewRank(member.rank);
      setPointsToAdd(0);
      setSuccess(false);
    }
  }, [member]);

  const handleCharge = async () => {
    if (!member) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('members')
        .update({
          points: member.points + pointsToAdd,
          rank: newRank
        })
        .eq('id', member.id);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Charge failed:', err);
      alert('충전 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
         
         <div className="p-8 border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Identity Modification</h3>
               <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
                  <X className="w-5 h-5 text-slate-500" />
               </button>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <User className="w-5 h-5 text-purple-500" />
               </div>
               <div>
                  <p className="text-sm font-black text-white leading-none mb-1">{member.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">UID: @{member.user_id}</p>
               </div>
            </div>
         </div>

         <div className="p-8 space-y-8">
            {/* Rank Selection */}
            <div>
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Membership Authorization</label>
               <div className="grid grid-cols-4 gap-2">
                  {['Silver', 'Gold', 'Diamond', 'VIP'].map((rank) => (
                     <button
                        key={rank}
                        onClick={() => setNewRank(rank)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                           newRank === rank 
                           ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30" 
                           : "bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10"
                        }`}
                     >
                        {rank}
                     </button>
                  ))}
               </div>
            </div>

            {/* Point Input */}
            <div>
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Credit Injection (Points)</label>
               <div className="relative group">
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                  <input 
                     type="number"
                     placeholder="Injection Amount..."
                     value={pointsToAdd || ''}
                     onChange={(e) => setPointsToAdd(Number(e.target.value))}
                     className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xl font-black text-white focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
                  />
               </div>
               <div className="mt-3 flex gap-2">
                  {[1000, 5000, 10000, 50000].map(val => (
                     <button 
                        key={val}
                        onClick={() => setPointsToAdd(pts => pts + val)}
                        className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest transition-all"
                     >
                        +{val.toLocaleString()}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="p-8 bg-slate-950/40 border-t border-white/5">
            <button 
               onClick={handleCharge}
               disabled={loading || success}
               className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  success 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/30" 
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30"
               }`}
            >
               {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
               ) : success ? (
                  <>
                     <CheckCircle2 className="w-5 h-5" />
                     Injected Successfully
                  </>
               ) : (
                  <>
                     <Award className="w-5 h-5" />
                     Commit Synchronization
                  </>
               )}
            </button>
         </div>
      </div>
    </div>
  );
};

export default PointChargeModal;
