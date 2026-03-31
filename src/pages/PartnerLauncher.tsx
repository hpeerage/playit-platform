import { useState } from 'react';
import { Store, CheckCircle, Clock, Truck, ShoppingBag, ChevronDown } from 'lucide-react';
import { useDelivery } from '../hooks/useDelivery';
import { usePartnerOrders } from '../hooks/usePartnerOrders';
import { cn } from '../lib/utils';

const STATUS_MAP = {
  'Pending': { label: '신규 주문', color: 'bg-rose-500', icon: ShoppingBag },
  'Cooking': { label: '조리중', color: 'bg-amber-500', icon: Clock },
  'Delivering': { label: '배달중', color: 'bg-blue-500', icon: Truck },
  'Completed': { label: '완료됨', color: 'bg-emerald-500', icon: CheckCircle }
};

const PartnerLauncher = () => {
  const { partners, loading: partnersLoading } = useDelivery();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { orders, updateOrderStatus } = usePartnerOrders(selectedPartnerId);

  // Default selection for demo
  if (!partnersLoading && partners.length > 0 && !selectedPartnerId) {
    setSelectedPartnerId(partners[0].id);
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${(d.getMonth()+1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')} ${formatTime(dateStr)}`;
  };

  const selectedPartner = partners.find(p => p.id === selectedPartnerId);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const activeOrders = orders.filter(o => ['Cooking', 'Delivering'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'Completed').slice(0, 10); // 최근 10개만

  if (partnersLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 animate-pulse">Loading Partners...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white font-sans overflow-hidden">
      
      {/* Header */}
      <header className="h-20 border-b border-white/5 bg-slate-900/50 flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-4 text-amber-500">
          <Store className="w-8 h-8" />
          <h1 className="text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap">Playit Delivery Partner</h1>
        </div>

        {/* Partner Selector (For Demo) */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 border border-white/10 px-6 py-3 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center overflow-hidden">
              {selectedPartner?.image_url ? (
                <img src={selectedPartner.image_url} alt="img" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <span className="font-bold">{selectedPartner?.name || '업체 선택'}</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {partners.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPartnerId(p.id);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3",
                    selectedPartnerId === p.id && "bg-amber-500/10 text-amber-500"
                  )}
                >
                  <img src={p.image_url!} alt="img" className="w-8 h-8 rounded-md object-cover" />
                  <span className="font-bold flex-1 truncate">{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Pending Orders Sidebar (새로운 주문) */}
        <div className="w-[400px] border-r border-white/5 bg-slate-900/30 flex flex-col relative z-0">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-rose-500/10 to-transparent pointer-events-none" />
          
          <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
            <h2 className="text-xl font-black text-rose-400 flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 animate-pulse" /> 신규 주문 접수
            </h2>
            <span className="bg-rose-500 text-white font-black px-3 py-1 rounded-full text-sm">
              {pendingOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {pendingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                <ShoppingBag className="w-16 h-16 mb-4" />
                <p className="font-bold">대기 중인 신규 주문이 없습니다.</p>
              </div>
            ) : pendingOrders.map(order => (
              <div key={order.id} className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(243,24,111,0.15)] animate-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white">Station {order.rooms?.room_number || '?'}</h3>
                    <p className="text-xs text-rose-400 font-bold mt-1">{formatTime(order.created_at)} 주문</p>
                  </div>
                  <span className="text-xl font-black text-amber-400">{order.total_amount.toLocaleString()}원</span>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <ul className="space-y-2">
                    {order.items.map(item => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-300">{item.delivery_menus?.name}</span>
                        <span className="text-white font-bold">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  {order.special_instructions && (
                    <div className="mt-4 pt-4 border-t border-white/10 text-xs text-amber-300 font-bold p-2 bg-amber-500/10 rounded-lg">
                      요청: {order.special_instructions}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'Cooking')}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl text-lg transition-transform active:scale-95 shadow-lg shadow-rose-500/20"
                >
                  주문 접수 및 조리 시작
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active & Completed Orders Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-8 overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-950 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />
            
            <div className="flex h-full gap-8 min-w-max">
              {/* 조리중 & 배달중 (진행 구역) */}
              <div className="w-[450px] flex flex-col bg-slate-900/50 border border-white/5 rounded-[32px] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" /> 진행 중 (조리 / 배달)
                  </h3>
                  <span className="bg-white/10 text-white font-bold px-3 py-1 rounded-full text-xs">
                    {activeOrders.length}건
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {activeOrders.map(order => (
                    <div key={order.id} className="bg-slate-800 border border-white/5 rounded-2xl p-5 group transition-all hover:bg-slate-800/80">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                           <span className={cn(
                             "text-[10px] font-black uppercase px-2 py-0.5 rounded-full w-fit mb-2",
                             order.status === 'Cooking' ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                           )}>
                             {STATUS_MAP[order.status as keyof typeof STATUS_MAP].label}
                           </span>
                           <h4 className="text-lg font-bold text-white leading-none">Station {order.rooms?.room_number || '?'}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-white">{order.total_amount.toLocaleString()}원</div>
                          <div className="text-xs text-slate-400 font-medium mt-1">{formatTime(order.created_at)} 접수</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-300 mb-5">
                       {order.items.length === 1 
                         ? `${order.items[0].delivery_menus?.name}` 
                         : `${order.items[0].delivery_menus?.name} 외 ${order.items.length - 1}건`}
                      </div>
                      
                      {order.status === 'Cooking' ? (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'Delivering')}
                          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Truck className="w-4 h-4" /> 배달 출발 (조리 완료)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'Completed')}
                          className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> 배달 완료 (전달 끝)
                        </button>
                      )}
                    </div>
                  ))}
                  {activeOrders.length === 0 && (
                    <div className="text-center text-slate-500 font-bold py-10 opacity-50">진행 중인 주문이 없습니다.</div>
                  )}
                </div>
              </div>

              {/* 배달 완료 (최근 기록) */}
              <div className="w-[450px] flex flex-col bg-slate-900/20 border border-emerald-500/10 rounded-[32px] overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                <div className="p-6 border-b border-emerald-500/10 flex items-center justify-between">
                  <h3 className="text-lg font-black text-emerald-500/70 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> 최근 완료 내역
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                  {completedOrders.map(order => (
                    <div key={order.id} className="flex justify-between items-center p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                       <div>
                         <span className="text-sm font-bold text-white block">Station {order.rooms?.room_number || '?'} 배달완료</span>
                         <span className="text-xs text-slate-500 block">
                           {order.items.length === 1 ? order.items[0].delivery_menus?.name : `${order.items[0].delivery_menus?.name} 외 ${order.items.length - 1}소`}
                         </span>
                       </div>
                       <div className="text-right">
                         <span className="text-sm font-black text-emerald-500 block">{order.total_amount.toLocaleString()}원</span>
                         <span className="text-[10px] text-slate-500 font-bold block">{formatDateTime(order.created_at)}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default PartnerLauncher;
