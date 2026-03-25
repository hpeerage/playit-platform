/* src/components/client/DeliveryOrderModal.tsx */
import React from 'react';
import { X, Truck, Info, MapPin, AlertCircle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DeliveryOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomNumber?: number;
}

const DeliveryOrderModal: React.FC<DeliveryOrderModalProps> = ({ isOpen, onClose, roomNumber = 1 }) => {
  const handleNotifyAdmin = async () => {
    try {
      // 1. 해당 room_number의 UUID 가져오기
      const { data: room } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_number', roomNumber)
        .single();

      // 2. 관리자 알림 생성
      await supabase.from('notifications').insert({
        type: 'Delivery',
        message: `Station ${roomNumber}번 좌석에서 배달 음식을 주문했습니다.`,
        room_id: room?.id,
        is_read: false
      });

      alert('관리자에게 배달 소식이 전달되었습니다. 외부 배달원 도착 시 안내해 드립니다.');
      onClose();
    } catch (error) {
      console.error('Delivery notification failed:', error);
      alert('알림 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-500">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                 <Truck className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                 <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">Delivery Order</h2>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">외부 배달 음식 주문 안내</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all">
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
           <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                 <MapPin className="w-4 h-4 text-purple-400" />
                 <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Delivery Address</h3>
              </div>
              <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5">
                 <p className="text-sm font-bold text-slate-300">서울특별시 중구 플레이잇 사거리 72, <span className="text-purple-400 font-black">2층 Playit PC ZONE</span></p>
                 <p className="text-xs font-bold text-slate-500 mt-2 uppercase">좌석 번호: Station {roomNumber}</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Info className="w-4 h-4 text-blue-500" />
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase">
                    배달 시 <span className="text-white font-black italic">"문 앞 보관"</span> 및 <span className="text-white font-black italic">"좌석 번호 기재"</span>를 요청하시면 더욱 빠른 확인이 가능합니다.
                 </p>
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase">
                    외부 음식 반입 시 쓰레기 처리는 지정된 분리수거함을 이용해 주시기 바랍니다.
                 </p>
              </div>
           </div>
        </div>

        {/* Action Button */}
        <div className="p-8 bg-slate-950/40 border-t border-white/5 flex flex-col gap-4">
           <button 
              onClick={handleNotifyAdmin}
              className="w-full h-16 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-2xl flex items-center justify-center gap-3 text-white transition-all shadow-lg shadow-amber-900/20 group"
           >
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span className="text-sm font-black uppercase tracking-[0.2em]">Notify Admin to Wait</span>
           </button>
           <p className="text-[10px] font-bold text-slate-600 text-center uppercase tracking-widest">관리자에게 알림을 보내면 음식 도착 시 채팅이나 호출로 안내해 드립니다.</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderModal;
