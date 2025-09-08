import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Link as LinkIcon, 
  BarChart3, 
  Plus, 
  TrendingUp,
  Users,
  Scan,
  Calendar
} from 'lucide-react';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { ActivityDetailsModal } from '@/components/ActivityDetailsModal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { activities, loading } = useActivityTracker();
  const { user } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState([
    { label: 'Total QR Codes', value: '0', icon: QrCode, color: 'text-primary' },
    { label: 'Short Links', value: '0', icon: LinkIcon, color: 'text-accent' },
    { label: 'Total Scans', value: '0', icon: Scan, color: 'text-success' },
    { label: 'Total Clicks', value: '0', icon: TrendingUp, color: 'text-warning' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setStats([
          { label: 'Total QR Codes', value: '0', icon: QrCode, color: 'text-primary' },
          { label: 'Short Links', value: '0', icon: LinkIcon, color: 'text-accent' },
          { label: 'Total Scans', value: '0', icon: Scan, color: 'text-success' },
          { label: 'Total Clicks', value: '0', icon: TrendingUp, color: 'text-warning' },
        ]);
        return;
      }

      try {
        // Get QR codes count and total scans
        const { data: qrData, error: qrError } = await supabase
          .from('qr_codes')
          .select('scan_count')
          .eq('user_id', user.id);

        const qrCount = qrData?.length || 0;
        const totalScans = qrData?.reduce((sum, qr) => sum + (qr.scan_count || 0), 0) || 0;

        // Get URLs count and total clicks
        const { data: urlData, error: urlError } = await supabase
          .from('urls')
          .select('click_count')
          .eq('user_id', user.id);

        const urlCount = urlData?.length || 0;
        const totalClicks = urlData?.reduce((sum, url) => sum + (url.click_count || 0), 0) || 0;

        setStats([
          { label: 'Total QR Codes', value: qrCount.toString(), icon: QrCode, color: 'text-primary' },
          { label: 'Short Links', value: urlCount.toString(), icon: LinkIcon, color: 'text-accent' },
          { label: 'Total Scans', value: totalScans.toLocaleString(), icon: Scan, color: 'text-success' },
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: TrendingUp, color: 'text-warning' },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your QR codes.</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <LinkIcon className="w-4 h-4 mr-2" />
              New Short Link
            </Button>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Create QR Code
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-muted rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                          <div className="w-16 h-8 bg-muted rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first QR code or short URL to see activity here
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/'}
                    >
                      Get Started
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 rounded-lg border hover-lift cursor-pointer transition-all hover:shadow-md"
                        onClick={() => handleActivityClick(activity)}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={activity.type === 'qr_code' ? {
                              backgroundColor: `${activity.bg_color}20`,
                              border: `2px solid ${activity.qr_color}40`
                            } : {
                              backgroundColor: 'hsl(var(--primary) / 0.1)',
                              border: '2px solid hsl(var(--primary) / 0.2)'
                            }}
                          >
                            {activity.type === 'qr_code' ? (
                              <QrCode 
                                className="w-5 h-5" 
                                style={{ color: activity.qr_color }}
                              />
                            ) : (
                              <LinkIcon className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.type === 'qr_code' ? 'QR Code' : 'Short URL'} • {formatTimeAgo(activity.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {activity.type === 'qr_code' ? activity.scans : activity.clicks}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.type === 'qr_code' ? 'scans' : 'clicks'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Plan Info */}
          <div className="space-y-6">
            {/* Current Plan */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Free Plan</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      5 QR codes per month
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>QR Codes Used</span>
                      <span>3/5</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <Button variant="premium" className="w-full">
                    Upgrade to Standard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <QrCode className="w-4 h-4 mr-2" />
                  Create URL QR Code
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Create vCard QR Code
                  <Badge variant="secondary" className="ml-auto">Pro</Badge>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Shorten URL
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ActivityDetailsModal
        activity={selectedActivity}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Dashboard;