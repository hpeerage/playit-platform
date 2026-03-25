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
          .select('*')
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

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          setOrders((prev) => {
            if (eventType === 'INSERT') return [newRecord as Order, ...prev];
            if (eventType === 'UPDATE') return prev.map(o => o.id === (newRecord as Order).id ? (newRecord as Order) : o);
            if (eventType === 'DELETE') return prev.filter(o => o.id !== (oldRecord as { id: string }).id);
            return prev;
          });
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
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (error) console.error('Error updating order status:', error.message);
  }, []);

  return {
    orders,
    loading,
    error,
    updateOrderStatus
  };
};
