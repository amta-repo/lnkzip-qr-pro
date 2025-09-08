import React from 'react';
import { QRGeneratorProduction } from './QRGeneratorProduction';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export const QRGeneratorSection: React.FC = () => {
  return (
    <section id="qr-generator-section" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2">
            <Zap className="w-4 h-4" />
            Free QR Code Generator
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Create Your First
            <span className="bg-gradient-hero bg-clip-text text-transparent"> QR Code </span>
            Now
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience our powerful QR code generator with real-time preview. 
            Choose from multiple formats and customize to match your brand.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-3xl border shadow-elegant p-8 lg:p-12">
            <QRGeneratorProduction 
              className="w-full" 
              showCustomization={true}
              tier="free"
            />
          </div>
        </div>
      </div>
    </section>
  );
};