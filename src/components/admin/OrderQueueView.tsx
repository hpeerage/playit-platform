/* src/components/admin/OrderQueueView.tsx */
import { useState } from 'react';
import { ShoppingCart, CheckCircle2, Clock, XCircle, ChevronRight, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Order {
  id: string;
  station: string;
  user: string;
  items: string;
  total: number;
  time: string;
  status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', station: '12', user: '김철수', items: '치즈버거 세트 x1, 콜라 x1', total: 12500, time: '14:22:15', status: 'PENDING' },
  { id: 'ORD-002', station: '05', user: '이영희', items: '아이스 아메리카노 x2', total: 9000, time: '14:30:20', status: 'PREPARING' },
  { id: 'ORD-003', station: '34', user: '박지민', items: '새우탕면 x1', total: 4500, time: '14:15:00', status: 'COMPLETED' },
  { id: 'ORD-004', station: '21', user: '최동현', items: '불닭볶음면 x1, 사이다 x1', total: 6000, time: '14:45:10', status: 'PENDING' },
];

const OrderQueueView = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const updateOrderStatus = (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="flex-1 flex flex-col p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Live Order Queue</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pending Requests: {orders.filter(o => o.status === 'PENDING').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className={cn(
            "bg-slate-900/30 border rounded-2xl p-5 transition-all hover:shadow-2xl group relative overflow-hidden",
            order.status === 'PENDING' ? "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]" :
            order.status === 'PREPARING' ? "border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]" :
            "border-white/5 opacity-60"
          )}>
            {/* Status Indicator */}
            <div className={cn(
              "absolute top-0 right-0 px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl",
              order.status === 'PENDING' ? "bg-amber-500 text-slate-950" :
              order.status === 'PREPARING' ? "bg-blue-500 text-white" :
              order.status === 'COMPLETED' ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"
            )}>
              {order.status}
            </div>

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950/50 flex flex-col items-center justify-center border border-white/5">
                  <span className="text-[8px] font-black text-slate-600 uppercase">ST</span>
                  <span className="text-lg font-black text-white italic tabular-nums">{order.station}</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                    {order.id} <ChevronRight className="w-3 h-3 text-slate-600" />
                  </h4>
                  <div className="flex items-center gap-2 text-slate-500">
                    <User className="w-3 h-3" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{order.user}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/30 rounded-xl p-4 mb-6 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Order Items</span>
              </div>
              <p className="text-xs font-bold text-slate-300 leading-relaxed uppercase">
                {order.items}
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Total Amount</span>
                <span className="text-sm font-black italic text-emerald-400 tabular-nums lowercase first-letter:uppercase">₩{order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Bar */}
            {(order.status === 'PENDING' || order.status === 'PREPARING') && (
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => updateOrderStatus(order.id, order.status === 'PENDING' ? 'PREPARING' : 'COMPLETED')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/20",
                    order.status === 'PENDING' ? "bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-slate-950" : 
                    "bg-blue-600 border border-blue-500 text-white hover:bg-blue-500"
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" /> 
                  {order.status === 'PENDING' ? 'Set Preparing' : 'Set Completed'}
                </button>
                <button 
                  onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                  className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-center"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-4 mt-4 px-1">
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-800" /> Received: {order.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderQueueView;
