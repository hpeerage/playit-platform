import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { type DeliveryOrder } from './useDeliveryOrder';

export interface FullPartnerOrder extends DeliveryOrder {
  rooms: { room_number: number } | null;
  delivery_partners: { name: string } | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    delivery_menus: { name: string } | null;
  }[];
}

export const usePartnerOrders = (partnerId?: string) => {
  const [orders, setOrders] = useState<FullPartnerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!partnerId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('delivery_orders')
        .select(`
          *,
          rooms(room_number),
          delivery_partners(name),
          items:delivery_order_items(
            id,
            quantity,
            price,
            delivery_menus(name)
          )
        `)
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as any || []);
    } catch (err: any) {
      console.error('Error fetching partner orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partnerId) {
      fetchOrders();

      const channel = supabase
        .channel(`partner_orders_${partnerId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'delivery_orders',
            filter: `partner_id=eq.${partnerId}`
          },
          () => {
             // Refresh list entirely on any change to capture joined data
             fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [partnerId]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('delivery_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error updating order:', err.message);
      return false;
    }
  };

  return { orders, loading, updateOrderStatus, refreshOrders: fetchOrders };
};
