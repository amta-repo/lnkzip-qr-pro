import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ExternalLink, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Redirect = () => {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToUrl = async () => {
      if (!shortCode) {
        setError('Invalid short code');
        setLoading(false);
        return;
      }

      try {
        // Get the URL
        const { data: urlData, error: urlError } = await supabase
          .from('urls')
          .select('*')
          .eq('short_code', shortCode)
          .eq('is_active', true)
          .single();

        if (urlError || !urlData) {
          setError('Short URL not found');
          setLoading(false);
          return;
        }

        // Track click
        const { error: clickError } = await supabase.from('clicks').insert({
          url_id: urlData.id,
          ip_address: 'web',
          user_agent: navigator.userAgent
        });

        if (!clickError) {
          // Increment click count
          await supabase.rpc('increment_click', { url_id: urlData.id });
        }

        // Set URL for display
        setUrl(urlData.original_url);
        setLoading(false);

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = urlData.original_url;
        }, 2000);

      } catch (error) {
        console.error('Redirect error:', error);
        setError('Something went wrong');
        setLoading(false);
      }
    };

    redirectToUrl();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="glass-card w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
            <p className="text-muted-foreground text-center">
              Please wait while we redirect you to your destination.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
        <Card className="glass-card w-full max-w-md">
          <CardHeader className="text-center">
            <QrCode className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Link Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              {error}. The link you're looking for doesn't exist or has been disabled.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="hero"
              className="w-full"
            >
              Go to lnkzip-QR Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
      <Card className="glass-card w-full max-w-md">
        <CardHeader className="text-center">
          <QrCode className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>Redirecting to:</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground break-all">
              {url}
            </p>
          </div>
          
          <p className="text-muted-foreground">
            You will be redirected automatically in a few seconds...
          </p>
          
          <Button 
            onClick={() => window.location.href = url!}
            variant="hero"
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Go Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Redirect;