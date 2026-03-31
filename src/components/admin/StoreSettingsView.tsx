import React, { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash2, Building2, LayoutGrid, Info } from 'lucide-react';

const SETTINGS_STORAGE_KEY = 'playit-pms-settings';

interface FloorPlan {
  floor: number;
  count: number;
}

interface StoreSettingsViewProps {
  onReconfigure: (plans: FloorPlan[]) => void;
  currentRoomCount: number;
}

const StoreSettingsView: React.FC<StoreSettingsViewProps> = ({ onReconfigure, currentRoomCount }) => {
  const [plans, setPlans] = useState<FloorPlan[]>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { floor: 1, count: 8 },
      { floor: 2, count: 8 },
      { floor: 3, count: 8 },
      { floor: 4, count: 8 },
      { floor: 5, count: 8 },
      { floor: 6, count: 8 }
    ];
  });

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const handleUpdate = (index: number, count: number) => {
    const newPlans = [...plans];
    newPlans[index].count = Math.max(0, count);
    setPlans(newPlans);
  };

  const addFloor = () => {
    const nextFloor = plans.length > 0 ? plans[plans.length - 1].floor + 1 : 1;
    setPlans([...plans, { floor: nextFloor, count: 0 }]);
  };

  const removeFloor = (index: number) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (confirm('전체 객실 배치를 새로 설정하시겠습니까? (기본 상태로 초기화됩니다)')) {
      onReconfigure(plans);
      alert('매장 배치가 성공적으로 변경되었습니다.');
    }
  };

  const totalCalculated = plans.reduce((acc, p) => acc + p.count, 0);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">System Configuration</h2>
            <div className="flex items-center gap-3">
               <span className="text-3xl font-black italic text-white leading-none uppercase tracking-tighter">Store Layout Settings</span>
               <div className="h-6 w-px bg-white/10" />
               <Settings className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-900/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6">
           <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem]">
              <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Current Active Rooms</div>
              <div className="text-2xl font-black text-white">{currentRoomCount} Units</div>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem]">
              <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Planned Room Total</div>
              <div className={currentRoomCount !== totalCalculated ? "text-2xl font-black text-amber-500" : "text-2xl font-black text-emerald-500"}>
                {totalCalculated} Units
              </div>
           </div>
           <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem]">
              <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Total Floors</div>
              <div className="text-2xl font-black text-white">{plans.length}F Building</div>
           </div>
        </div>

        {/* Configuration List */}
        <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-3">
                 <Building2 className="w-5 h-5 text-purple-400" /> 층별 객실 수 설정
              </h3>
              <button 
                onClick={addFloor}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl text-[10px] border border-white/10 font-bold transition-all"
              >
                 <Plus className="w-3.5 h-3.5" /> ADD FLOOR
              </button>
           </div>

           <div className="space-y-3">
              {plans.map((plan, index) => (
                <div key={index} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5 transition-all hover:bg-white/[0.05]">
                   <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl font-black italic text-purple-500 border border-white/5">
                      {plan.floor}F
                   </div>
                   <div className="flex-1">
                      <div className="text-[9px] text-slate-500 font-black uppercase pl-1 mb-1">Number of Rooms</div>
                      <div className="flex items-center gap-3">
                         <input 
                           type="range" 
                           min="0" 
                           max="32" 
                           value={plan.count} 
                           onChange={(e) => handleUpdate(index, parseInt(e.target.value))}
                           className="flex-1 accent-purple-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                         />
                         <input 
                           type="number" 
                           value={plan.count}
                           onChange={(e) => handleUpdate(index, parseInt(e.target.value))}
                           className="w-20 bg-slate-950 border border-white/10 rounded-lg py-1 px-3 text-center text-sm font-black text-purple-400 focus:outline-none focus:border-purple-500"
                         />
                      </div>
                   </div>
                   <button 
                     onClick={() => removeFloor(index)}
                     className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                   >
                      <Trash2 className="w-5 h-5" />
                   </button>
                </div>
              ))}
           </div>

           <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex items-start gap-4">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                 <h4 className="text-xs font-black text-amber-500 uppercase">Warning: Reconfiguration</h4>
                 <p className="text-[11px] font-bold text-amber-200/60 leading-relaxed">
                   층별 객실 수를 수정하고 저장하면 기존의 모든 실시간 데이터가 초기화되고 새로운 레이아웃으로 재생성됩니다. 실제 운영 환경에서는 데이터베이스 마이그레이션이 수반되어야 합니다.
                 </p>
              </div>
           </div>
        </div>

        {/* Visual Preview Placeholder */}
        <div className="bg-slate-900/20 border border-dashed border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center">
           <LayoutGrid className="w-10 h-10 text-slate-800 mb-3" />
           <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Layout Preview Sync Pending</p>
        </div>

      </div>
    </div>
  );
};

export default StoreSettingsView;
