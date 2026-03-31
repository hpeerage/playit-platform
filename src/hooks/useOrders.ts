/* src/hooks/useOrders.ts */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Order } from '../lib/supabase';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // 최신 주문이 위로 오도록 정렬
        const { data, error } = await supabase
          .from('orders')
          .select('*, rooms(room_number)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err: any) {
        console.error('Error fetching orders:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const channelId = `orders-realtime-${Math.random()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const fetchAndAddOrder = async (record: Order) => {
            const { data } = await supabase.from('rooms').select('room_number').eq('id', record.room_id).single();
            const orderWithRoom = { ...record, rooms: data || undefined };
            setOrders(prev => [orderWithRoom, ...prev]);
          };

          if (payload.eventType === 'INSERT') {
            fetchAndAddOrder(payload.new as Order);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) => prev.map(o => o.id === (payload.new as Order).id ? { ...o, ...(payload.new as Order) } : o));
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter(o => o.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) console.error('Error updating order status:', error.message);
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    const { data, error } = await supabase.rpc('cancel_order', { p_order_id: orderId });
    if (error) console.error('Error cancelling order:', error.message);
    if (data && !data.success) console.error('Refund failed:', data.message);
  }, []);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    cancelOrder
  };
};
