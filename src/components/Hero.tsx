import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Zap, Shield, BarChart3, Smartphone, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Hero: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleCreateQR = () => {
    const qrSection = document.getElementById('qr-generator-section');
    if (qrSection) {
      qrSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2">
                <Zap className="w-4 h-4" />
                Generate QR Codes in Seconds
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Professional
                <span className="bg-gradient-hero bg-clip-text text-transparent"> QR Codes </span>
                for Your Business
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                Create stunning, trackable QR codes with advanced customization. 
                Perfect for marketing campaigns, business cards, and digital experiences.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                <span>Dynamic QR Codes</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Advanced Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                <span>Mobile Optimized</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="group" onClick={handleGetStarted}>
                Start Creating Free
                <QrCode className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" onClick={handleCreateQR}>
                Create QR Code Now
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Global CDN</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse-glow"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse-glow animation-delay-1000"></div>
            
            <div className="relative z-10 w-full flex items-center justify-center">
              <div className="bg-gradient-hero/10 rounded-3xl border shadow-elegant p-16 max-w-2xl mx-auto">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Try Our QR Generator Below</h3>
                  <p className="text-muted-foreground">Create your first QR code in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};