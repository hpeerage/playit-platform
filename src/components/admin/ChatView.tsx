/* src/components/admin/ChatView.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Monitor, Search, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { useChat } from '../../hooks/useChat';

interface ActiveChat {
  room_id: string;
  room_number: number;
  last_message?: string;
  last_time?: string;
  unread_count: number;
}

const ChatView = () => {
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage, markAsRead } = useChat(selectedRoomId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 활성 채팅 목록 불러오기 (메시지가 있는 방들)
  const fetchActiveChats = async () => {
    const { data: rooms } = await supabase.from('rooms').select('id, room_number');
    if (!rooms) return;

    const { data: messages } = await supabase
      .from('messages')
      .select('room_id, content, created_at, is_read, sender_type')
      .order('created_at', { ascending: false });

    if (!messages) return;

    const chatList: ActiveChat[] = rooms.map(r => {
      const roomMsgs = messages.filter(m => m.room_id === r.id);
      const lastMsg = roomMsgs[0];
      const unread = roomMsgs.filter(m => m.sender_type === 'User' && !m.is_read).length;

      return {
        room_id: r.id,
        room_number: r.room_number,
        last_message: lastMsg?.content,
        last_time: lastMsg?.created_at,
        unread_count: unread
      };
    }).filter(c => c.last_message) // 메시지가 있는 방만 표시
    .sort((a, b) => (b.last_time || '').localeCompare(a.last_time || ''));

    setActiveChats(chatList);
  };

  useEffect(() => {
    fetchActiveChats();
    
    const channel = supabase
      .channel('admin-chat-list')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => fetchActiveChats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (selectedRoomId) {
      markAsRead(); 
    }
  }, [messages, selectedRoomId, markAsRead]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedRoomId) return;

    try {
      await sendMessage(inputValue, 'Admin');
      setInputValue('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const selectedChat = activeChats.find(c => c.room_id === selectedRoomId);

  return (
    <div className="flex-1 flex overflow-hidden p-10 gap-8">
      {/* Left: Chat List */}
      <div className="w-96 flex flex-col bg-slate-900/40 border border-white/5 rounded-[40px] overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Active Channels</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search station..." 
              className="w-full h-12 bg-slate-950/50 border border-white/5 rounded-2xl px-6 pl-12 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {activeChats.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-6">
              <MessageSquare className="w-10 h-10 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">No active sessions</p>
            </div>
          ) : (
            activeChats.map((chat) => (
              <button
                key={chat.room_id}
                onClick={() => setSelectedRoomId(chat.room_id)}
                className={cn(
                  "w-full p-4 rounded-3xl flex items-center gap-4 transition-all duration-300",
                  selectedRoomId === chat.room_id 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" 
                    : "hover:bg-white/5 text-slate-400"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0",
                  selectedRoomId === chat.room_id ? "bg-white/20 border-white/20" : "bg-slate-800 border-white/5"
                )}>
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase text-white">
                      Station {chat.room_number}
                    </span>
                    <span className="text-[8px] font-bold opacity-50 uppercase">
                      {chat.last_time ? new Date(chat.last_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium truncate opacity-60">
                    {chat.last_message}
                  </p>
                </div>
                {chat.unread_count > 0 && selectedRoomId !== chat.room_id && (
                  <div className="w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shrink-0">
                    {chat.unread_count}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-900/40 border border-white/5 rounded-[40px] overflow-hidden relative">
        {!selectedRoomId ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
            <ShieldCheck className="w-20 h-20 mb-6" />
            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Support Terminal</h3>
            <p className="text-[10px] font-black uppercase tracking-widest mt-2">Select a channel to begin communication</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-inner">
                  <Monitor className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Station {selectedChat?.room_number}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Connection</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
              {messages.map((msg) => {
                const isAdmin = msg.sender_type === 'Admin';
                return (
                  <div key={msg.id} className={cn(
                    "flex flex-col max-w-[70%]",
                    isAdmin ? "self-end items-end" : "self-start items-start"
                  )}>
                    <div className={cn(
                      "px-6 py-4 rounded-[24px] text-sm font-medium leading-relaxed shadow-sm",
                      isAdmin 
                        ? "bg-purple-600 text-white rounded-tr-none" 
                        : "bg-slate-800 border border-white/5 text-slate-200 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* InputArea */}
            <form onSubmit={handleSend} className="p-8 bg-slate-950/50 border-t border-white/10">
              <div className="relative">
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full h-16 bg-slate-900/50 border border-white/5 rounded-[20px] px-8 pr-20 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/40"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatView;
