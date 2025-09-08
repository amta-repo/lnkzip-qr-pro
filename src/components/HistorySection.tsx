import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Link as LinkIcon, Copy, ExternalLink, Eye, Calendar, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QRCode {
  id: string;
  title: string;
  content: string;
  short_url?: string;
  scan_count: number;
  created_at: string;
  qr_color: string;
  bg_color: string;
}

interface URL {
  id: string;
  title?: string;
  original_url: string;
  short_code: string;
  click_count: number;
  created_at: string;
}

export const HistorySection: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [urls, setUrls] = useState<URL[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) {
      // No demo data for non-authenticated users
      setQrCodes([]);
      setUrls([]);
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

      setQrCodes(qrData || []);
      setUrls(urlData || []);
    } catch (error) {
      console.error('Error fetching history data:', error);
      toast({
        title: "Error",
        description: "Failed to load history data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2">
            <Calendar className="w-4 h-4" />
            Your History
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Access Your
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Previous Creations </span>
            Anytime
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {user 
              ? "View and manage all your QR codes and shortened URLs in one place. Copy, share, and track performance."
              : "Sign in to access your personal history and start creating QR codes and short URLs."
            }
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="qr-codes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="qr-codes" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                QR Codes ({qrCodes.length})
              </TabsTrigger>
              <TabsTrigger value="short-urls" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Short URLs ({urls.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr-codes" className="space-y-4">
              {qrCodes.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="p-12 text-center">
                    <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No QR codes yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first QR code using our generator above.
                    </p>
                    <Button 
                      onClick={() => document.getElementById('qr-generator-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Create QR Code
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {qrCodes.map((qr) => (
                    <Card key={qr.id} className="glass-card hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg border-2 flex items-center justify-center"
                                style={{ backgroundColor: qr.bg_color, borderColor: qr.qr_color }}
                              >
                                <QrCode className="w-5 h-5" style={{ color: qr.qr_color }} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{qr.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Created {formatDate(qr.created_at)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                                <span>{qr.scan_count} scans</span>
                              </div>
                              {qr.short_url && (
                                <Badge variant="outline">Short URL</Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground truncate">
                              {qr.content}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(qr.short_url || qr.content, qr.id)}
                            >
                              {copiedId === qr.id ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(qr.content, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="short-urls" className="space-y-4">
              {urls.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="p-12 text-center">
                    <LinkIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No short URLs yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first short URL using our generator above.
                    </p>
                    <Button 
                      onClick={() => document.getElementById('qr-generator-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Create Short URL
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {urls.map((url) => (
                    <Card key={url.id} className="glass-card hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <LinkIcon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {url.title || 'Short URL'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Created {formatDate(url.created_at)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                              <span>{url.click_count} clicks</span>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-primary">
                                https://lnkzip.co/{url.short_code}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {url.original_url}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(`https://lnkzip.co/${url.short_code}`, url.id)}
                            >
                              {copiedId === url.id ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(url.original_url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {!user && (
            <div className="mt-12 text-center">
              <Card className="glass-card max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <QrCode className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Want to see your own history?</h3>
                  <p className="text-muted-foreground mb-6">
                    Sign up for free to save all your QR codes and short URLs, access analytics, and manage everything in one place.
                  </p>
                  <Button variant="hero" onClick={() => window.location.href = '/auth'}>
                    Sign Up Free
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};