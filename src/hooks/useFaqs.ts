import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export const useFaqs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setFaqs(data || []);
    } catch (err: any) {
      console.error('Error fetching FAQs:', err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();

    // Set up realtime subscription
    const channel = supabase
      .channel('faqs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'faqs' },
        () => {
          fetchFaqs(); // Refresh list on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addFaq = async (faq: Omit<FAQ, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('faqs').insert([faq]);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error adding FAQ:', err.message);
      return false;
    }
  };

  const updateFaq = async (id: string, updates: Partial<FAQ>) => {
    try {
      const { error } = await supabase.from('faqs').update(updates).eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error updating FAQ:', err.message);
      return false;
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error deleting FAQ:', err.message);
      return false;
    }
  };

  return {
    faqs,
    loading,
    error,
    addFaq,
    updateFaq,
    deleteFaq,
    refreshFaqs: fetchFaqs
  };
};
