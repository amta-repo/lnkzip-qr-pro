import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Activity {
  id: string;
  type: 'qr_code' | 'short_url';
  title: string;
  content: string;
  short_url?: string;
  scans?: number;
  clicks?: number;
  created_at: string;
  qr_color?: string;
  bg_color?: string;
}

export const useActivityTracker = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchActivities = async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch QR codes
      const { data: qrData, error: qrError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (qrError) throw qrError;

      // Fetch URLs
      const { data: urlData, error: urlError } = await supabase
        .from('urls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (urlError) throw urlError;

      // Combine and sort activities
      const qrActivities: Activity[] = (qrData || []).map(qr => ({
        id: qr.id,
        type: 'qr_code' as const,
        title: qr.title,
        content: qr.content,
        short_url: qr.short_url,
        scans: qr.scan_count,
        created_at: qr.created_at,
        qr_color: qr.qr_color,
        bg_color: qr.bg_color
      }));

      const urlActivities: Activity[] = (urlData || []).map(url => ({
        id: url.id,
        type: 'short_url' as const,
        title: url.title || 'Short URL',
        content: url.original_url,
        short_url: `https://lnkzip.co/${url.short_code}`,
        clicks: url.click_count,
        created_at: url.created_at
      }));

      const allActivities = [...qrActivities, ...urlActivities]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  return {
    activities,
    loading,
    refetch: fetchActivities
  };
};