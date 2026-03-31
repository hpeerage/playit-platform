import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DeliveryPartner {
  id: string;
  name: string;
  category: string;
  description: string;
  min_order_amount: number;
  delivery_fee: number;
  rating: number;
  image_url: string;
  is_active: boolean;
}

export interface DeliveryMenu {
  id: string;
  partner_id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export const useDelivery = () => {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('delivery_partners')
          .select('*')
          .eq('is_active', true)
          .order('rating', { ascending: false });

        if (error) throw error;
        setPartners(data || []);
      } catch (err: any) {
        console.error('Error fetching delivery partners:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const fetchMenusByPartner = async (partnerId: string): Promise<DeliveryMenu[]> => {
    try {
      const { data, error } = await supabase
        .from('delivery_menus')
        .select('*')
        .eq('partner_id', partnerId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Error fetching menus:', err.message);
      return [];
    }
  };

  return { partners, loading, fetchMenusByPartner };
};
