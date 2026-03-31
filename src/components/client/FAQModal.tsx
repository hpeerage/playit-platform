import { useState } from 'react';
import { Headset, X, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFaqs } from '../../hooks/useFaqs';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestCall: () => void;
}

const FAQModal = ({ isOpen, onClose, onRequestCall }: FAQModalProps) => {
  const { faqs, loading } = useFaqs();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const activeFaqs = faqs.filter(faq => faq.is_active);
  const categories = Array.from(new Set(activeFaqs.map(f => f.category)));

  // Filter based on search query
  const filteredFaqs = activeFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setOpenIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCallAdminClick = () => {
    onRequestCall();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,#8b5cf615,transparent_50%)] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-6 border-b border-white/5 relative z-10">
          <div>
            <div className="flex items-center gap-3 text-purple-400 mb-2">
              <MessageCircle className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-purple-400">Playit Support</span>
            </div>
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
              찾으시는 질문이 없다면 가장 하단의 '상담원 호출'을 구동해주세요.
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-8 py-4 border-b border-white/5 bg-slate-900/50 z-10 shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="궁금하신 내용을 검색해보세요 (예: 주차, 와이파이, 퇴실)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 font-bold transition-all placeholder:font-medium"
            />
          </div>
        </div>

        {/* FAQ List Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 z-10 custom-scrollbar relative">
          {loading ? (
             <div className="flex items-center justify-center py-20">
               <div className="w-8 h-8 rounded-full border-t-2 border-purple-500 animate-spin" />
             </div>
          ) : filteredFaqs.length === 0 ? (
             <div className="text-center py-20 text-slate-400 font-bold">
               검색 결과가 없습니다.
             </div>
          ) : (
             <div className="space-y-3">
               {categories.map(category => {
                 const categoryFaqs = filteredFaqs.filter(f => f.category === category);
                 if (categoryFaqs.length === 0) return null;
                 
                 return (
                   <div key={category} className="mb-6">
                     <h3 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                       {category}
                     </h3>
                     <div className="space-y-2">
                       {categoryFaqs.map((faq) => {
                         const isOpen = openIds.has(faq.id);
                         return (
                           <div 
                             key={faq.id} 
                             className={cn(
                               "rounded-xl border transition-all duration-300 overflow-hidden",
                               isOpen ? "bg-purple-900/20 border-purple-500/30" : "bg-white/5 border-transparent hover:border-white/10 hover:bg-white/[0.07]"
                             )}
                           >
                             <button
                               onClick={() => toggleFaq(faq.id)}
                               className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 outline-none group"
                             >
                               <span className={cn(
                                 "font-bold transition-colors",
                                 isOpen ? "text-purple-300" : "text-slate-200 group-hover:text-white"
                               )}>
                                 Q. {faq.question}
                               </span>
                               <div className={cn(
                                 "p-1 rounded-full transition-colors shrink-0",
                                 isOpen ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-slate-400"
                               )}>
                                 {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                               </div>
                             </button>
                             
                             {isOpen && (
                               <div className="px-5 pb-5 pt-1 text-slate-300 font-medium leading-relaxed animate-in slide-in-from-top-2 duration-300">
                                 A. {faq.answer}
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 );
               })}
             </div>
          )}
        </div>

        {/* Footer (Call Admin Action) */}
        <div className="p-8 border-t border-white/5 bg-slate-900/80 z-10 shrink-0">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between gap-6">
            <div>
              <h4 className="text-emerald-400 font-black uppercase tracking-tight mb-1 text-lg">
                도움이 더 필요하신가요?
              </h4>
              <p className="text-sm text-slate-400 font-bold">
                위 내용으로 해결되지 않으셨다면, 1:1 상담원을 호출해주세요.
              </p>
            </div>
            
            <button 
              onClick={handleCallAdminClick}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
            >
              <Headset className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm">Call Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQModal;
