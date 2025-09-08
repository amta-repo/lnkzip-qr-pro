import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X,
  QrCode, 
  BarChart3, 
  Crown,
  Zap,
  Shield,
  Star
} from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '5 static QR codes per month',
      '10 short URLs',
      'Basic QR types (URL, text)',
      'PNG, JPG downloads',
      'Basic color customization',
      'Scan count tracking'
    ],
    limitations: [
      'No dynamic QR codes',
      'No logo overlay',
      'No SVG export',
      'No advanced analytics',
      'No custom domains'
    ],
    cta: 'Get Started Free',
    variant: 'outline' as const,
    popular: false
  },
  {
    name: 'Standard',
    price: '$9',
    period: 'per month',
    description: 'For growing businesses',
    features: [
      '50 dynamic QR codes',
      'Unlimited short URLs',
      'All QR types (vCard, WiFi, etc.)',
      'Logo overlay & custom colors',
      'PNG, JPG, SVG downloads',
      'Edit QR destinations',
      'Basic analytics (device, location)',
      'Email support'
    ],
    limitations: [
      'No custom domains',
      'No API access',
      'No bulk operations'
    ],
    cta: 'Start Free Trial',
    variant: 'hero' as const,
    popular: true
  },
  {
    name: 'Premium',
    price: '$17',
    period: 'per month',
    description: 'For power users & teams',
    features: [
      'Unlimited dynamic QR codes',
      'Custom domains for short URLs',
      'Advanced analytics dashboard',
      'Bulk QR generation',
      'API access',
      'Custom frames & styling',
      'Priority support',
      'Team collaboration',
      'White-label options',
      'Advanced integrations'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    variant: 'premium' as const,
    popular: false
  }
];

const faqs = [
  {
    question: 'What are dynamic QR codes?',
    answer: 'Dynamic QR codes allow you to change the destination URL after the QR code has been created and printed. This is perfect for marketing campaigns where you might want to update content without reprinting.'
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. When upgrading, you\'ll have immediate access to new features. When downgrading, changes take effect at your next billing cycle.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact us within 30 days for a full refund.'
  },
  {
    question: 'What happens to my QR codes if I cancel?',
    answer: 'Your static QR codes will continue to work forever. Dynamic QR codes will redirect to a default page after your subscription ends, but you can reactivate them by subscribing again.'
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            <Crown className="w-4 h-4 mr-2" />
            Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose the perfect plan for
            <span className="bg-gradient-hero bg-clip-text text-transparent"> your business</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. All plans include our core QR code generation with no hidden fees.
          </p>
          
          {/* Plan Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-muted-foreground">Monthly</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="w-14 h-8 bg-muted rounded-full p-1 cursor-pointer">
                <div className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"></div>
              </div>
            </div>
            <span className="text-muted-foreground">
              Annual 
              <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`
                  glass-card hover-lift relative
                  ${plan.popular ? 'ring-2 ring-primary scale-105 lg:scale-110' : ''}
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Button 
                    variant={plan.variant} 
                    className="w-full mb-8"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        What's included:
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                          <X className="w-4 h-4" />
                          Not included:
                        </h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Compare all features
            </h2>
            <p className="text-xl text-muted-foreground">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Features</th>
                      <th className="text-center p-4 font-semibold">Free</th>
                      <th className="text-center p-4 font-semibold">Standard</th>
                      <th className="text-center p-4 font-semibold">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="p-4">QR Codes per month</td>
                      <td className="text-center p-4">5 static</td>
                      <td className="text-center p-4">50 dynamic</td>
                      <td className="text-center p-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Short URLs</td>
                      <td className="text-center p-4">10</td>
                      <td className="text-center p-4">Unlimited</td>
                      <td className="text-center p-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Analytics</td>
                      <td className="text-center p-4">Basic</td>
                      <td className="text-center p-4">Advanced</td>
                      <td className="text-center p-4">Advanced</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Custom domains</td>
                      <td className="text-center p-4"><X className="w-4 h-4 mx-auto text-muted-foreground" /></td>
                      <td className="text-center p-4"><X className="w-4 h-4 mx-auto text-muted-foreground" /></td>
                      <td className="text-center p-4"><Check className="w-4 h-4 mx-auto text-success" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">API Access</td>
                      <td className="text-center p-4"><X className="w-4 h-4 mx-auto text-muted-foreground" /></td>
                      <td className="text-center p-4"><X className="w-4 h-4 mx-auto text-muted-foreground" /></td>
                      <td className="text-center p-4"><Check className="w-4 h-4 mx-auto text-success" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses creating professional QR codes with QRPro.
            </p>
            <Button variant="hero" size="xl">
              <Zap className="w-5 h-5 mr-2" />
              Start Your Free Trial
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;