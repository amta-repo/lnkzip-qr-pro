import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { QRGeneratorSection } from '@/components/QRGeneratorSection';
import { AnalyticsSection } from '@/components/AnalyticsSection';
import { HistorySection } from '@/components/HistorySection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  QrCode, 
  BarChart3, 
  Link as LinkIcon,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Users,
  Star,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'Dynamic QR Codes',
    description: 'Create QR codes that can be edited after creation. Perfect for marketing campaigns.',
    highlight: true
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track scans, devices, locations, and timing with detailed analytics dashboard.',
    highlight: true
  },
  {
    icon: LinkIcon,
    title: 'URL Shortener',
    description: 'Shorten long URLs and generate QR codes for them. Manage all your links in one place.',
    highlight: false
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Perfect QR code generation and scanning experience on all mobile devices.',
    highlight: false
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Use your own domain for short links and maintain your brand consistency.',
    highlight: false
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with GDPR compliance and data protection.',
    highlight: false
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechCorp',
    content: 'QRPro transformed our marketing campaigns. The analytics insights are incredible!',
    rating: 5
  },
  {
    name: 'Mike Chen',
    role: 'Small Business Owner',
    company: 'Local Restaurant',
    content: 'Perfect for our contactless menu. Easy to use and customers love it.',
    rating: 5
  },
  {
    name: 'Emma Davis',
    role: 'Event Coordinator',
    company: 'Events Plus',
    content: 'Dynamic QR codes saved us so much time. We can update info without reprinting.',
    rating: 5
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* QR Generator Section */}
      <QRGeneratorSection />

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Everything you need for 
              <span className="bg-gradient-hero bg-clip-text text-transparent"> professional QR codes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From simple static codes to advanced dynamic campaigns with full analytics and branding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`glass-card hover-lift ${feature.highlight ? 'ring-2 ring-primary/20' : ''}`}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    feature.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  {feature.highlight && (
                    <Badge variant="secondary" className="mt-4">
                      Most Popular
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50M+</div>
              <div className="text-muted-foreground">QR Codes Generated</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">150+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <AnalyticsSection />

      {/* History Section */}
      <HistorySection />

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-4 h-4 mr-2" />
              Customer Success
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Loved by businesses
              <span className="bg-gradient-hero bg-clip-text text-transparent"> worldwide</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              Ready to create your first
              <span className="bg-gradient-hero bg-clip-text text-transparent"> QR code?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses using QRPro to create professional QR codes and track their performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" className="group">
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                View Pricing
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Start with 5 free QR codes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">QRPro</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Professional QR code generation and analytics platform for businesses worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Features</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Pricing</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">API</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Integrations</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">About</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Blog</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Careers</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Help Center</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Documentation</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Privacy</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer">Terms</div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 QRPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
