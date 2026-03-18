/* src/components/client/LauncherCard.tsx */
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LauncherCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

const LauncherCard: React.FC<LauncherCardProps> = ({ title, description, icon: Icon, color, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-end w-[320px] h-[480px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform hover:scale-105 hover:z-10",
        "bg-slate-900/50 border border-white/5 hover:border-purple-500/50 shadow-2xl hover:shadow-[0_40px_80px_rgba(139,92,246,0.3)]"
      )}
    >
      {/* Background Gradient & Pattern */}
      <div className={cn("absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500", color)} />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-0" />

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col items-start gap-4">
        <div className={cn(
          "p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition-all duration-500",
          "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] group-hover:bg-purple-600 group-hover:text-white"
        )}>
           <Icon className="w-10 h-10 text-purple-400 group-hover:text-white transition-colors" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase group-hover:text-purple-400 transition-colors">
            {title}
          </h2>
          <p className="text-sm font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-widest leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          Launch Module <span className="animate-pulse">→</span>
        </div>
      </div>
      
      {/* Border Glow line */}
      <div className="absolute inset-0 border border-white/5 rounded-[32px] group-hover:border-purple-500/50 transition-colors pointer-events-none" />
    </div>
  );
};

export default LauncherCard;
