/* src/components/admin/MemberListView.tsx */
import { useState } from 'react';
import { Search, Filter, MoreVertical, CreditCard, Clock, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Member {
  id: string;
  name: string;
  tier: 'VIP' | 'GOLD' | 'SILVER' | 'NORMAL';
  points: number;
  remainingTime: string;
  lastVisit: string;
  status: 'ONLINE' | 'OFFLINE';
}

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: '김철수', tier: 'VIP', points: 45000, remainingTime: '12:45:00', lastVisit: '2024-03-19', status: 'ONLINE' },
  { id: '2', name: '이영희', tier: 'GOLD', points: 12000, remainingTime: '05:20:00', lastVisit: '2024-03-18', status: 'OFFLINE' },
  { id: '3', name: '박지민', tier: 'SILVER', points: 3500, remainingTime: '02:10:00', lastVisit: '2024-03-19', status: 'ONLINE' },
  { id: '4', name: '최동현', tier: 'NORMAL', points: 800, remainingTime: '00:45:00', lastVisit: '2024-03-15', status: 'OFFLINE' },
  { id: '5', name: '한소희', tier: 'VIP', points: 89000, remainingTime: '45:00:00', lastVisit: '2024-03-19', status: 'ONLINE' },
];

const MemberListView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('All');

  const filteredMembers = MOCK_MEMBERS.filter(m => 
    (filterTier === 'All' || m.tier === filterTier) &&
    (m.name.includes(searchTerm) || m.id.includes(searchTerm))
  );

  return (
    <div className="flex-1 flex flex-col p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
          <input 
            type="text"
            placeholder="회원 이름 또는 ID 검색..." 
            className="bg-slate-900/50 border border-white/5 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all w-[320px] text-white placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 mr-2" />
          {['All', 'VIP', 'GOLD', 'SILVER', 'NORMAL'].map((tier) => (
            <button 
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                filterTier === tier ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10"
              )}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-slate-900/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/40 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Member Info</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tier</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Points</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Remaining Time</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-purple-500/30 transition-all">
                      <User className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white tracking-tight">{member.name}</span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tabular-nums">ID: {member.id.padStart(4, '0')}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase",
                    member.tier === 'VIP' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                    member.tier === 'GOLD' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    member.tier === 'SILVER' ? "bg-slate-400/10 text-slate-300 border border-slate-400/20" :
                    "bg-slate-800 text-slate-500"
                  )}>
                    {member.tier}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-bold text-slate-300 tabular-nums lowercase first-letter:uppercase">
                      {member.points.toLocaleString()} <span className="text-[10px] text-slate-600">pts</span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-bold text-slate-300 tabular-nums">
                      {member.remainingTime}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      member.status === 'ONLINE' ? "bg-emerald-500 glow-green" : "bg-slate-700"
                    )} />
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      member.status === 'ONLINE' ? "text-emerald-500" : "text-slate-600"
                    )}>
                      {member.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberListView;
