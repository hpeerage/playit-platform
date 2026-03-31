import { useState } from 'react';
import { 
  X, CheckCircle2, Trash2, Sparkles, Settings2, 
  Power, DoorClosed, DoorOpen, Wind, ShieldAlert,
  ThermometerSun, CalendarCheck, UserCheck, Wrench, 
  AlertTriangle, ChevronRight, Activity, BedDouble, 
  Monitor, MonitorOff, RotateCcw, Zap, Plus, MinusCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { Room, RoomStatus } from '../lib/supabase';

interface DetailPanelProps {
  room: Room | null;
  onClose: () => void;
  onStatusChange: (roomId: string, status: RoomStatus) => void;
  onCheckout: (roomId: string) => void;
  onRemoteCommand: (roomId: string, command: string, payload?: any) => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ room, onClose, onStatusChange, onCheckout, onRemoteCommand }) => {
  const [selectedPCId, setSelectedPCId] = useState<string | null>(null);

  if (!room) return null;

  const isOccupied = room.status === 'Using';

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const selectedPC = room.pcs?.find(pc => pc.id === selectedPCId);

  const handleRemovePC = () => {
    if (selectedPC && confirm(`PC [${selectedPC.name}]를 이 객실에서 정말로 제거하시겠습니까?`)) {
      onRemoteCommand(room.id, 'REMOVE_PC', { pcId: selectedPC.id });
      setSelectedPCId(null);
    }
  };

  const handleAddPC = () => {
     onRemoteCommand(room.id, 'ADD_PC');
  };

  return (
    <aside className={cn(
      "fixed top-0 right-0 h-full bg-[#050914] border-l border-white/5 shadow-[-40px_0_80px_rgba(0,0,0,0.9)] z-[2000] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
      room ? "w-full md:w-[480px] translate-x-0" : "w-0 translate-x-full"
    )}>
      <div className="flex flex-col h-full relative">
        {/* Background Accent */}
        <div className={cn(
          "absolute top-0 right-0 w-96 h-96 blur-[120px] pointer-events-none opacity-20 transition-colors duration-1000",
          room.status === 'Using' ? "bg-emerald-500" :
          room.status === 'Empty' ? "bg-slate-500" :
          room.status === 'Cleaning' ? "bg-blue-500" : "bg-red-500"
        )} />

        {/* 1. Header (Room Basic Info) */}
        <div className="p-6 pb-4 flex items-start justify-between relative z-10 border-b border-white/5 bg-[#050914]/80 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border",
                room.status === 'Using' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                room.status === 'Maintenance' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                room.status === 'Cleaning' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"
              )}>
                {room.status === 'Using' ? 'Occupied (입실중)' : 
                 room.status === 'Empty' ? 'Vacant (공실)' : 
                 room.status === 'Cleaning' ? 'Cleaning (청소중)' : 'Out of Order (점검중)'}
              </span>
            </div>
            <h3 className="text-3xl font-black italic text-white tracking-tighter flex items-center gap-3">
              {room.room_number.toString().padStart(3, '0')}호
              <span className="text-sm font-bold text-slate-400 not-italic tracking-normal flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                <BedDouble className="w-4 h-4" /> {room.room_type || '디럭스 더블'}
              </span>
            </h3>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all group shrink-0">
            <X className="w-5 h-5 text-slate-400 group-hover:text-white group-active:scale-95 transition-transform" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10">
          
          {/* Quick Access Status Changes */}
          <div className="grid grid-cols-4 gap-2">
             <button onClick={() => onStatusChange(room.id, 'Using')} className={cn("py-2.5 rounded-xl border text-[10px] font-black uppercase transition-all flex flex-col items-center gap-1", room.status === 'Using' ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10")}>
               <CheckCircle2 className="w-4 h-4" /> 입실
             </button>
             <button onClick={() => onStatusChange(room.id, 'Empty')} className={cn("py-2.5 rounded-xl border text-[10px] font-black uppercase transition-all flex flex-col items-center gap-1", room.status === 'Empty' ? "bg-slate-200 text-slate-950 border-white" : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10")}>
               <Trash2 className="w-4 h-4" /> 공실
             </button>
             <button onClick={() => onStatusChange(room.id, 'Cleaning')} className={cn("py-2.5 rounded-xl border text-[10px] font-black uppercase transition-all flex flex-col items-center gap-1", room.status === 'Cleaning' ? "bg-blue-500 text-white border-blue-500" : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10")}>
               <Sparkles className="w-4 h-4" /> 청소
             </button>
             <button onClick={() => onStatusChange(room.id, 'Maintenance')} className={cn("py-2.5 rounded-xl border text-[10px] font-black uppercase transition-all flex flex-col items-center gap-1", room.status === 'Maintenance' ? "bg-red-500 text-white border-red-500" : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10")}>
               <Settings2 className="w-4 h-4" /> 점검
             </button>
          </div>

          {/* PC Management Section with Add/Remove */}
          <div className="bg-slate-900/60 rounded-[24px] p-5 border border-white/5">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                   <Monitor className="w-4 h-4 text-blue-400" /> 객실 내 PC 관리
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-bold text-slate-500">{room.pcs?.length} Units</span>
                   <button 
                     onClick={handleAddPC}
                     className="p-1 px-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg flex items-center gap-1 transition-all active:scale-95 text-[10px] font-black"
                   >
                     <Plus className="w-3 h-3" /> ADD PC
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-4 gap-3 mb-6">
                {room.pcs?.map((pc) => (
                   <button 
                     key={pc.id}
                     onClick={() => setSelectedPCId(pc.id === selectedPCId ? null : pc.id)}
                     className={cn(
                       "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all relative group",
                       selectedPCId === pc.id ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-white/5 border-white/10 hover:bg-white/10"
                     )}
                   >
                      <div className="relative">
                         <Monitor className={cn(
                           "w-8 h-8 transition-colors",
                           pc.status === 'InUse' ? "text-emerald-500" : (pc.status === 'Online' ? "text-blue-400" : "text-slate-600")
                         )} />
                         <div className={cn(
                           "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900",
                           pc.status === 'InUse' ? "bg-emerald-500 animate-pulse" : (pc.status === 'Online' ? "bg-blue-500" : "bg-slate-600")
                         )} />
                      </div>
                      <span className="text-[10px] font-black text-white uppercase">{pc.name}</span>
                   </button>
                ))}
                {(!room.pcs || room.pcs.length === 0) && (
                   <div className="col-span-4 py-8 text-center bg-black/20 rounded-2xl border border-dashed border-white/5">
                      <p className="text-[11px] font-bold text-slate-600 uppercase">No PC Assets in this Room</p>
                   </div>
                )}
             </div>

             {/* PC Selected Control Interface */}
             {selectedPC ? (
               <div className="bg-black/20 rounded-2xl p-4 border border-white/5 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-tight">
                           {selectedPC.name} 
                           {(selectedPC.status === 'InUse' || selectedPC.status === 'Online') && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">CONNECTED</span>
                           )}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{selectedPC.specs}</p>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <button 
                          onClick={handleRemovePC}
                          className="flex items-center gap-1 text-[9px] font-black text-rose-500 hover:text-rose-400 uppercase transition-colors"
                        >
                           <MinusCircle className="w-3 h-3" /> Remove Asset
                        </button>
                        <div className="text-right">
                           <div className="text-[10px] text-slate-600 font-black uppercase">User</div>
                           <div className="text-xs font-bold text-slate-300 italic">{selectedPC.user_name || 'N/A'}</div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                     <button 
                       onClick={() => onRemoteCommand(room.id, 'PC_WAKE_UP', { pcId: selectedPC.id })}
                       className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 transition-all active:scale-95"
                     >
                        <Zap className="w-4 h-4" />
                        <span className="text-[8px] font-black uppercase">Wake Up</span>
                     </button>
                     <button 
                       onClick={() => onRemoteCommand(room.id, 'PC_SHUTDOWN', { pcId: selectedPC.id })}
                       className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-all active:scale-95"
                     >
                        <MonitorOff className="w-4 h-4" />
                        <span className="text-[8px] font-black uppercase">Shutdown</span>
                     </button>
                     <button 
                       onClick={() => onRemoteCommand(room.id, 'PC_RESTART', { pcId: selectedPC.id })}
                       className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-red-500/10 transition-all active:scale-95"
                     >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-[8px] font-black uppercase">Restart</span>
                     </button>
                  </div>
               </div>
             ) : (
                room.pcs && room.pcs.length > 0 && (
                   <div className="py-2 text-center border-t border-white/5 border-dashed">
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Select ID to Manage Asset</p>
                   </div>
                )
             )}
          </div>

          {/* IoT Controls */}
          <div className="bg-slate-900/60 rounded-[24px] p-5 border border-white/5">
             <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                <Power className="w-4 h-4 text-purple-400" /> 객실 원격 제어 (IoT)
             </div>
             
             <div className="grid grid-cols-2 gap-3 mb-3">
                <button 
                  onClick={() => onRemoteCommand(room.id, 'TOGGLE_DOOR')}
                  className={cn("p-4 rounded-xl border transition-all text-left relative overflow-hidden group", room.door_status === 'Locked' ? "bg-white/5 border-white/10" : "bg-rose-500/20 border-rose-500/50")}
                >
                   <div className="flex justify-between items-start mb-2">
                     {room.door_status === 'Locked' ? <DoorClosed className="w-5 h-5 text-slate-400" /> : <DoorOpen className="w-5 h-5 text-rose-400" />}
                     <div className={cn("w-2 h-2 rounded-full", room.door_status === 'Locked' ? "bg-slate-500" : "bg-rose-500 animate-pulse")} />
                   </div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">도어락 상태</div>
                   <div className={cn("text-sm font-black", room.door_status === 'Locked' ? "text-white" : "text-rose-400")}>
                     {room.door_status === 'Locked' ? 'LOCKED (잠금)' : 'OPENED (개방됨)'}
                   </div>
                </button>

                <button 
                  onClick={() => onRemoteCommand(room.id, 'TOGGLE_POWER')}
                  className={cn("p-4 rounded-xl border transition-all text-left relative overflow-hidden group", room.power_status === 'On' ? "bg-amber-500/20 border-amber-500/50" : "bg-white/5 border-white/10")}
                >
                   <div className="flex justify-between items-start mb-2">
                     <Power className={cn("w-5 h-5", room.power_status === 'On' ? "text-amber-400" : "text-slate-400")} />
                     <div className={cn("w-2 h-2 rounded-full", room.power_status === 'On' ? "bg-amber-500 glow-green" : "bg-slate-500")} />
                   </div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">객실 전등 (Master)</div>
                   <div className={cn("text-sm font-black", room.power_status === 'On' ? "text-amber-400" : "text-white")}>
                     {room.power_status === 'On' ? 'POWER ON' : 'POWER OFF'}
                   </div>
                </button>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-blue-500/20 rounded-lg"><Wind className="w-4 h-4 text-blue-400" /></div>
                     <div>
                       <div className="text-[9px] text-slate-400 font-bold uppercase">설정 온도</div>
                       <div className="text-sm font-black text-white">{room.temperature || 22.5}°C</div>
                     </div>
                   </div>
                </div>

                {isOccupied ? (
                  <button 
                    onClick={() => onRemoteCommand(room.id, 'TOGGLE_OUTING')}
                    className={cn("rounded-xl p-3 border transition-colors flex items-center gap-2", room.outing_mode ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300" : "bg-white/5 border-white/5 text-slate-400")}
                  >
                     <ShieldAlert className="w-4 h-4" />
                     <div className="text-left font-black text-[11px] leading-tight flex-1">
                        외출 절전 모드<br/><span className={cn("text-[8px] uppercase", room.outing_mode ? "text-indigo-400" : "text-slate-500")}>{room.outing_mode ? 'ACTIVE' : 'INACTIVE'}</span>
                     </div>
                  </button>
                ) : (
                  <button 
                    onClick={() => onRemoteCommand(room.id, 'TOGGLE_WELCOME')}
                    className={cn("rounded-xl p-3 border transition-colors flex items-center gap-2", room.welcome_mode ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "bg-white/5 border-white/5 text-slate-400")}
                  >
                     <ThermometerSun className="w-4 h-4" />
                     <div className="text-left font-black text-[11px) leading-tight flex-1">
                        웰컴 프리히팅<br/><span className={cn("text-[8px] uppercase", room.welcome_mode ? "text-emerald-400" : "text-slate-500")}>{room.welcome_mode ? 'ACTIVE' : 'INACTIVE'}</span>
                     </div>
                  </button>
                )}
             </div>
          </div>

          {/* Booking Info */}
          <div className="bg-slate-900/60 rounded-[24px] p-5 border border-white/5 relative overflow-hidden">
             {isOccupied && (
               <div className={cn("absolute top-5 right-[-30px] w-[120px] text-center rotate-45 text-[9px] font-black uppercase py-1 shadow-lg", room.stay_type === '대실' ? "bg-rose-500 text-white" : "bg-indigo-500 text-white")}>
                 {room.stay_type} 진행중
               </div>
             )}
             
             <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                <CalendarCheck className="w-4 h-4 text-emerald-400" /> 예약 및 투숙 관리
             </div>

             {isOccupied ? (
               <div className="space-y-4">
                 <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg w-fit">
                    <button onClick={() => onRemoteCommand(room.id, 'UPDATE_STAY_TYPE', { stayType: '대실' })} className={cn("px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all", room.stay_type === '대실' ? "bg-rose-500 text-white shadow-md" : "text-slate-400 hover:bg-white/5")}>대실 (Day Use)</button>
                    <button onClick={() => onRemoteCommand(room.id, 'UPDATE_STAY_TYPE', { stayType: '숙박' })} className={cn("px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all", room.stay_type === '숙박' ? "bg-indigo-500 text-white shadow-md" : "text-slate-400 hover:bg-white/5")}>숙박 (Overnight)</button>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold mb-1">입실 시간 (Check-in)</div>
                      <div className="text-sm font-black text-white">{formatTime(room.check_in_time)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold mb-1">퇴실 예정 (Check-out)</div>
                      <div className="text-sm font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded w-fit">
                        {formatTime(room.check_out_time)}
                      </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> 
                        <span className="text-[11px] font-bold text-slate-300">신분증 스캔 완료 (키오스크)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold pl-5">예약 경로: 야놀자 (초특가)</div>
                    </div>
                 </div>

                 <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl shadow-lg transition-all border border-white/10 active:scale-95">시간 연장 (+1H)</button>
                    <button 
                      onClick={() => onCheckout(room.id)}
                      className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95"
                    >
                      퇴실 처리 (Checkout)
                    </button>
                 </div>
               </div>
             ) : (
               <div className="py-6 text-center text-slate-500">
                 <CalendarCheck className="w-8 h-8 mx-auto mb-2 opacity-20" />
                 <p className="text-xs font-bold">현재 투숙 중인 고객이 없습니다.<br/>(예약 조회 가능)</p>
               </div>
             )}
          </div>

          {/* Maintenance */}
          <div className="bg-slate-900/60 rounded-[24px] p-5 border border-white/5">
             <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                <Wrench className="w-4 h-4 text-blue-400" /> 청소 및 유지보수
             </div>
             
             <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                   <div className="flex items-start gap-3">
                     <div className="p-2 bg-blue-500/20 rounded-lg mt-0.5"><Sparkles className="w-4 h-4 text-blue-400" /></div>
                     <div>
                       <div className="text-xs font-black text-white mb-0.5">청소 완료 보고</div>
                       <div className="text-[10px] text-slate-400 font-bold">작업자: {room.cleaning_report?.staff || '청소팀 박여사'}</div>
                     </div>
                   </div>
                   <div className="text-[10px] text-blue-400 font-bold text-right">
                     {room.cleaning_report ? formatTime(room.cleaning_report.completed_at) : '오늘 13:10'} 완료
                   </div>
                </div>

                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                   <div className="flex items-start gap-3">
                     <div className="p-2 bg-emerald-500/20 rounded-lg mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
                     <div>
                       <div className="text-xs font-black text-white mb-0.5">객실 비품 및 미니바</div>
                       <div className="text-[10px] text-slate-400 font-bold">타월 4장, 생수 3병 보충됨</div>
                     </div>
                   </div>
                   <button className="text-[10px] text-slate-300 bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 transition-colors">내역 보기</button>
                </div>

                <button className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 transition-all group">
                   <div className="flex items-center gap-2 text-xs font-bold">
                     <AlertTriangle className="w-4 h-4" /> 시설 고장 리포트 접수
                   </div>
                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#050914] border-t border-white/5 flex items-center justify-center shrink-0">
           <div className="flex items-center gap-2 text-slate-600 font-black uppercase tracking-widest text-[8px]">
              <Activity className="w-3 h-3" /> System Integrity Validated : 12ms
           </div>
        </div>
      </div>
    </aside>
  );
};

export default DetailPanel;
