/* src/hooks/useChat.ts */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  room_id: string;
  sender_type: 'Admin' | 'User';
  sender_id?: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const useChat = (roomId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // 메시지 불러오기
  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchMessages();

    if (!roomId) return;

    // 실시간 구독
    const channel = supabase
      .channel(`chat-${roomId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, fetchMessages]);

  // 메시지 전송
  const sendMessage = async (content: string, senderType: 'Admin' | 'User', senderId?: string) => {
    if (!roomId || !content.trim()) return;

    try {
      const { error } = await supabase.from('messages').insert({
        room_id: roomId,
        sender_type: senderType,
        sender_id: senderId,
        content: content.trim()
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  // 읽음 처리
  const markAsRead = async () => {
    if (!roomId) return;
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('room_id', roomId)
        .eq('sender_type', 'Admin') // 사용자가 읽는 것이면 관리자가 보낸 것을 읽음 처리
        .eq('is_read', false);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    refreshMessages: fetchMessages
  };
};
