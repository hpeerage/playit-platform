/* src/components/client/ChatWidget.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useChat } from '../../hooks/useChat';
import type { Member } from '../../lib/supabase';

interface ChatWidgetProps {
  roomId: string | null;
  member: Member | null;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ roomId, member }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage, markAsRead } = useChat(roomId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 새 메시지 수신 시 스크롤 하단 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (isOpen) {
      markAsRead();
    }
  }, [messages, isOpen, markAsRead]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !member) return;

    try {
      await sendMessage(inputValue, 'User', member.id);
      setInputValue('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const unreadCount = messages.filter(m => m.sender_type === 'Admin' && !m.is_read).length;

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[500px] bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-black italic text-white uppercase tracking-tighter leading-none mb-1">Support Node</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Admin Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-6">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                  Terminal Support Connected.<br />Ask anything to the admin.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.sender_type === 'Admin';
                return (
                  <div key={msg.id} className={cn(
                    "flex flex-col max-w-[85%]",
                    isAdmin ? "self-start items-start" : "self-end items-end"
                  )}>
                    <div className={cn(
                      "px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed break-words",
                      isAdmin 
                        ? "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none" 
                        : "bg-purple-600 text-white shadow-lg shadow-purple-900/20 rounded-tr-none"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter mt-1 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-6 bg-slate-900/50 border-t border-white/5">
            <div className="relative group">
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Secure transmission..."
                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-3xl flex items-center justify-center relative transition-all duration-500 shadow-2xl group",
          isOpen ? "bg-slate-900 text-slate-400 rotate-90" : "bg-purple-600 text-white shadow-purple-900/40 hover:-translate-y-1"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-7 h-7" />}
        
        {!isOpen && unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-[#0F172A] animate-bounce">
            {unreadCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
