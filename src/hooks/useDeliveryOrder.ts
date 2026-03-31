import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface DeliveryOrder {
  id: string;
  user_id: string | null;
  room_id: string;
  partner_id: string;
  total_amount: number;
  status: string; // 'Pending', 'Accepted', 'Cooking', 'Delivering', 'Completed', 'Cancelled'
  special_instructions: string;
  created_at: string;
}

export interface OrderItemInput {
  menu_id: string;
  quantity: number;
  price: number; // 단가
}

export const useDeliveryOrder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const placeOrder = async (
    roomId: string,
    partnerId: string,
    items: OrderItemInput[],
    specialInstructions: string = ''
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // 1. Insert Order
      const { data: orderParams, error: orderError } = await supabase
        .from('delivery_orders')
        .insert({
          user_id: user?.id || null,
          room_id: roomId,
          partner_id: partnerId,
          total_amount: totalAmount,
          status: 'Pending',
          special_instructions: specialInstructions
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderId = orderParams.id;

      // 2. Insert Order Items
      const orderItems = items.map(item => ({
        order_id: orderId,
        menu_id: item.menu_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('delivery_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Optionals: Notify admin just in case
      await supabase.from('notifications').insert({
        type: 'Delivery',
        message: '외부 배달 주문이 접수되었습니다.',
        room_id: roomId,
        is_read: false
      });

      return true;
    } catch (err: any) {
      console.error('Error placing delivery order:', err.message);
      alert('주문 처리 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading };
};
