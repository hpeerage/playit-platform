/* src/components/admin/ReportsView.tsx */

import { BarChart3, TrendingUp, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, Coffee, Laptop, Utensils } from 'lucide-react';
import { cn } from '../../lib/utils';

const REVENUE_DATA = [
  { day: 'Mon', value: 450000 },
  { day: 'Tue', value: 380000 },
  { day: 'Wed', value: 520000 },
  { day: 'Thu', value: 410000 },
  { day: 'Fri', value: 680000 },
  { day: 'Sat', value: 920000 },
  { day: 'Sun', value: 850000 },
];

const ReportsView = () => {
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.value));

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 overflow-y-auto custom-scrollbar">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '₩4,210,000', change: '+12.5%', isUp: true, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Active Users', value: '342', change: '+5.2%', isUp: true, icon: Users, color: 'text-blue-400' },
          { label: 'Avg. Stay Time', value: '3.4h', change: '-2.1%', isUp: false, icon: BarChart3, color: 'text-purple-400' },
          { label: 'Total Orders', value: '89', change: '+18.4%', isUp: true, icon: ShoppingBag, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/30 border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all group shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-xl bg-white/5 border border-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black tracking-tighter uppercase px-2 py-0.5 rounded-full border",
                stat.isUp ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"
              )}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">{stat.label}</h4>
            <span className="text-2xl font-black text-white italic tracking-tighter group-hover:text-purple-400 transition-colors uppercase">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart Section */}
        <div className="xl:col-span-2 bg-slate-900/30 border border-white/5 p-8 rounded-[2rem] flex flex-col shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] -z-10 group-hover:bg-purple-600/10 transition-all duration-1000" />
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-lg font-black italic text-white uppercase tracking-tighter">Weekly Revenue Trend</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Daily Performance (Last 7 Days)</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-purple-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg shadow-purple-900/30">WEEKLY</button>
              <button className="px-3 py-1.5 bg-white/5 text-slate-500 text-[10px] font-black uppercase rounded-lg hover:text-slate-300 transition-colors">MONTHLY</button>
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-4 h-[240px] px-2 mb-4">
            {REVENUE_DATA.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                <div className="relative w-full flex items-end justify-center h-full">
                  <div 
                    className="w-full max-w-[40px] bg-slate-800/50 border border-white/5 rounded-t-xl transition-all duration-1000 group-hover/bar:bg-purple-500 group-hover/bar:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-950 px-2 py-1 rounded text-[9px] font-black text-purple-400 whitespace-nowrap border border-purple-500/20">
                       ₩{(d.value / 10000).toFixed(0)}만
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover/bar:text-white transition-colors">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Items Section */}
        <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[2rem] flex flex-col shadow-2xl">
          <h3 className="text-lg font-black italic text-white uppercase tracking-tighter mb-8">Popular Items</h3>
          <div className="space-y-4">
            {[
              { name: 'Cheese Burger Set', category: 'Food', count: 124, price: '₩12,500', icon: Utensils, color: 'bg-amber-500/10 text-amber-500' },
              { name: 'Iced Americano', category: 'Drink', count: 98, price: '₩4,500', icon: Coffee, color: 'bg-blue-500/10 text-blue-500' },
              { name: 'Gaming Zone A', category: 'Seats', count: 85, price: '₩1,500/h', icon: Laptop, color: 'bg-purple-500/10 text-purple-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border border-white/5", item.color)}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-white uppercase italic tracking-tighter">{item.name}</h4>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-white tabular-nums">{item.count} <span className="text-slate-600">Sales</span></div>
                  <div className="text-[10px] font-bold text-emerald-400 italic tabular-nums">{item.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-white/5">
             <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="relative z-10">
                   <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Performance Insight</h4>
                   <p className="text-xs font-bold text-white/90 leading-relaxed uppercase italic">
                      "이번 주 금요일 매출이 역대 최고치를 기록했습니다. <span className="text-purple-400">주말 이벤트</span>의 영향으로 분석됩니다."
                   </p>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rotate-12 -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-700" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
