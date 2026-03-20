/* src/components/client/GameListModal.tsx */
import React from 'react';
import { X, Play, Star, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GameListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GAMES = [
  { id: 1, title: 'League of Legends', category: 'MOBA', rating: 4.9, players: '1.2M', color: 'from-blue-600/20' },
  { id: 2, title: 'Valorant', category: 'FPS', rating: 4.8, players: '800K', color: 'from-red-600/20' },
  { id: 3, title: 'PUBG', category: 'Battle Royale', rating: 4.6, players: '500K', color: 'from-orange-600/20' },
  { id: 4, title: 'Lost Ark', category: 'MMORPG', rating: 4.7, players: '300K', color: 'from-purple-600/20' },
  { id: 5, title: 'Overwatch 2', category: 'FPS', rating: 4.5, players: '400K', color: 'from-amber-600/20' },
  { id: 6, title: 'MapleStory', category: 'RPG', rating: 4.4, players: '200K', color: 'from-emerald-600/20' },
];

const GameListModal: React.FC<GameListModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl h-full max-h-[800px] bg-slate-900/40 border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-500">
        
        {/* Header */}
        <div className="p-8 flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                <TrendingUp className="w-6 h-6 text-purple-400" />
             </div>
             <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Popular Titles</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Ready to deploy gaming instance</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all hover:rotate-90 duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Game Grid */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES.map((game) => (
              <div 
                key={game.id}
                className={cn(
                  "group relative p-6 rounded-3xl bg-slate-800/30 border border-white/5 hover:border-purple-500/50 transition-all duration-500 cursor-pointer overflow-hidden",
                  "hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]"
                )}
              >
                {/* Accent Background */}
                <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", game.color)} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {game.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-black">{game.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black italic text-white mb-1 group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                    {game.title}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
                    {game.players} Active Sessions
                  </p>

                  <button className="w-full h-12 rounded-xl bg-white/5 group-hover:bg-purple-600 border border-white/10 group-hover:border-purple-500 flex items-center justify-center gap-2 text-white transition-all duration-300 transform group-hover:scale-[1.02]">
                    <Play className="w-4 h-4 fill-current group-hover:animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Launch Game</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-slate-950/40 border-t border-white/5 flex justify-center shrink-0">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">Select a title to begin your gaming experience</p>
        </div>
      </div>
    </div>
  );
};

export default GameListModal;
