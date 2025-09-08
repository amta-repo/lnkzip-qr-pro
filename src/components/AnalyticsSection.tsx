import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Globe, Calendar, MousePointer } from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  const analyticsData = [
    {
      title: 'Total Scans',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
      description: 'QR code scans this month'
    },
    {
      title: 'Unique Visitors',
      value: '987',
      change: '+8%',
      trend: 'up',
      icon: Users,
      description: 'Individual users who scanned'
    },
    {
      title: 'Click-through Rate',
      value: '68%',
      change: '+5%',
      trend: 'up',
      icon: MousePointer,
      description: 'Users who clicked after scanning'
    },
    {
      title: 'Top Location',
      value: 'United States',
      change: '45%',
      trend: 'neutral',
      icon: Globe,
      description: 'Most scans by country'
    },
    {
      title: 'Peak Time',
      value: '2-4 PM',
      change: 'Daily',
      trend: 'neutral',
      icon: Calendar,
      description: 'Highest activity period'
    },
    {
      title: 'Growth Rate',
      value: '23%',
      change: 'vs last month',
      trend: 'up',
      icon: TrendingUp,
      description: 'Overall engagement growth'
    }
  ];

  return (
    <section id="analytics" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2">
            <BarChart3 className="w-4 h-4" />
            Real-time Analytics
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Track Your
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Performance </span>
            in Real-time
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get detailed insights into your QR code performance with comprehensive analytics dashboard.
            Monitor scans, user behavior, and optimize your campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsData.map((item, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.trend === 'up' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' :
                  item.trend === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                  'bg-muted'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{item.value}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20' :
                    item.trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/20' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {item.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="glass-card max-w-2xl mx-auto">
            <CardContent className="p-8">
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics Dashboard</h3>
              <p className="text-muted-foreground mb-6">
                Get access to detailed reports, heatmaps, conversion tracking, and export capabilities with our Pro plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Badge variant="outline" className="px-4 py-2">Device Analytics</Badge>
                <Badge variant="outline" className="px-4 py-2">Geographic Insights</Badge>
                <Badge variant="outline" className="px-4 py-2">Time-based Reports</Badge>
                <Badge variant="outline" className="px-4 py-2">Export Data</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};