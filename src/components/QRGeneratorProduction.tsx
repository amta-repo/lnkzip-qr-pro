import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Download, Palette, Settings, Smartphone, Globe, FileText, User, Wifi, Gift, Image, Video, Link, Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface QRGeneratorProductionProps {
  className?: string;
  showCustomization?: boolean;
  tier?: 'free' | 'standard' | 'premium';
}

const QR_TYPES = [
  { id: 'url', label: 'URL/Website', icon: Globe, description: 'Link to any website' },
  { id: 'text', label: 'Text', icon: FileText, description: 'Plain text message' },
  { id: 'vcard', label: 'Contact (vCard)', icon: User, description: 'Contact information', premium: true },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, description: 'Wi-Fi credentials', premium: true },
  { id: 'sms', label: 'SMS', icon: Smartphone, description: 'Pre-filled SMS message' },
  { id: 'email', label: 'Email', icon: FileText, description: 'Email address' },
  { id: 'phone', label: 'Phone', icon: Smartphone, description: 'Phone number' },
  { id: 'social', label: 'Social Links', icon: Link, description: 'Social media profiles', premium: true },
  { id: 'coupon', label: 'Coupon', icon: Gift, description: 'Discount codes', premium: true },
  { id: 'image', label: 'Image', icon: Image, description: 'Image URL', premium: true },
  { id: 'video', label: 'Video', icon: Video, description: 'Video URL', premium: true },
];

const QR_FRAMES = [
  { id: 'none', label: 'No Frame' },
  { id: 'basic', label: 'Basic' },
  { id: 'modern', label: 'Modern' },
  { id: 'elegant', label: 'Elegant' },
];

export const QRGeneratorProduction: React.FC<QRGeneratorProductionProps> = ({
  className = '',
  showCustomization = true,
  tier = 'free'
}) => {
  const [qrType, setQrType] = useState('url');
  const [qrData, setQrData] = useState('https://example.com');
  const [qrColor, setQrColor] = useState('#3B82F6');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(256);
  const [frame, setFrame] = useState('none');
  const [title, setTitle] = useState('');
  const [createShortUrl, setCreateShortUrl] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateQRContent = () => {
    switch (qrType) {
      case 'url':
        return qrData;
      case 'text':
        return qrData;
      case 'email':
        return `mailto:${qrData}`;
      case 'phone':
        return `tel:${qrData}`;
      case 'sms':
        return `sms:${qrData}`;
      case 'wifi':
        return `WIFI:T:WPA;S:NetworkName;P:${qrData};H:false;;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${qrData}\nEND:VCARD`;
      default:
        return qrData;
    }
  };

  const saveQRCode = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please enter a title for your QR code"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-qr', {
        body: {
          title: title.trim(),
          qrType,
          content: qrData,
          qrColor,
          bgColor,
          size,
          frameStyle: frame,
          createShortUrl: createShortUrl && qrType === 'url'
        }
      });

      if (error) throw error;

      toast({
        title: "QR Code saved!",
        description: data.shortUrl 
          ? `QR Code saved with short URL: ${data.shortUrl}` 
          : "QR Code saved successfully"
      });

      // Reset form
      setTitle('');
      setQrData(qrType === 'url' ? 'https://example.com' : '');

    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save QR code. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadQR = async (format: 'png' | 'jpg' | 'svg') => {
    if (!qrRef.current) return;
    
    setIsGenerating(true);
    
    try {
      if (format === 'svg') {
        const svgElement = qrRef.current.querySelector('svg');
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `qr-code.${format}`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } else {
        const canvas = await html2canvas(qrRef.current, {
          backgroundColor: bgColor,
          scale: 2,
        });
        
        const url = canvas.toDataURL(`image/${format}`, 0.9);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-code.${format}`;
        a.click();
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download QR code. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isPremiumFeature = (feature: string) => {
    const premiumFeatures = ['vcard', 'wifi', 'social', 'coupon', 'image', 'video'];
    return premiumFeatures.includes(feature) && tier === 'free';
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Generator Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              QR Code Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title Input */}
            <div>
              <Label htmlFor="qr-title" className="text-base font-semibold">
                Title *
              </Label>
              <Input
                id="qr-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your QR code"
                className="mt-2"
                required
              />
            </div>

            {/* QR Type Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block">QR Code Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QR_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => !isPremiumFeature(type.id) && setQrType(type.id)}
                    disabled={isPremiumFeature(type.id)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 text-left relative
                      ${qrType === type.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                      }
                      ${isPremiumFeature(type.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover-lift'}
                    `}
                  >
                    <type.icon className="w-5 h-5 mb-2 text-primary" />
                    <div className="text-sm font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                    {type.premium && tier === 'free' && (
                      <Badge variant="secondary" className="absolute top-1 right-1 text-xs">Pro</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Data Input */}
            <div>
              <Label htmlFor="qr-data" className="text-base font-semibold">
                {qrType === 'url' ? 'Website URL' : 
                 qrType === 'email' ? 'Email Address' :
                 qrType === 'phone' ? 'Phone Number' :
                 qrType === 'wifi' ? 'Wi-Fi Password' :
                 'Content'}
              </Label>
              <Input
                id="qr-data"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                placeholder={
                  qrType === 'url' ? 'https://example.com' :
                  qrType === 'email' ? 'contact@example.com' :
                  qrType === 'phone' ? '+1234567890' :
                  qrType === 'wifi' ? 'Enter Wi-Fi password' :
                  'Enter your content'
                }
                className="mt-2"
                required
              />
            </div>

            {/* Short URL Option */}
            {qrType === 'url' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="create-short-url"
                  checked={createShortUrl}
                  onCheckedChange={setCreateShortUrl}
                />
                <Label htmlFor="create-short-url" className="text-sm">
                  Create short URL for tracking
                </Label>
              </div>
            )}

            {/* Customization Options */}
            {showCustomization && (
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>
                
                <TabsContent value="colors" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">QR Color</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full mt-2 h-10 justify-start"
                          >
                            <div 
                              className="w-4 h-4 rounded mr-2" 
                              style={{ backgroundColor: qrColor }}
                            />
                            {qrColor}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <HexColorPicker color={qrColor} onChange={setQrColor} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Background</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full mt-2 h-10 justify-start"
                          >
                            <div 
                              className="w-4 h-4 rounded mr-2" 
                              style={{ backgroundColor: bgColor }}
                            />
                            {bgColor}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <HexColorPicker color={bgColor} onChange={setBgColor} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="style" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Frame Style</Label>
                    <Select value={frame} onValueChange={setFrame}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QR_FRAMES.map((frameOption) => (
                          <SelectItem key={frameOption.id} value={frameOption.id}>
                            {frameOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Size</Label>
                    <Select value={size.toString()} onValueChange={(value) => setSize(parseInt(value))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="128">Small (128px)</SelectItem>
                        <SelectItem value="256">Medium (256px)</SelectItem>
                        <SelectItem value="512">Large (512px)</SelectItem>
                        <SelectItem value="1024">Extra Large (1024px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Save Button */}
            <Button 
              onClick={saveQRCode} 
              disabled={isSaving || !title.trim() || !qrData.trim()}
              className="w-full"
              variant="hero"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save QR Code'}
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Preview & Download
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Display */}
            <div className="flex justify-center">
              <div 
                ref={qrRef}
                className={`
                  inline-block p-6 bg-white rounded-2xl
                  ${frame === 'basic' ? 'qr-frame-basic' : ''}
                  ${frame === 'modern' ? 'qr-frame-modern' : ''}
                  ${frame === 'elegant' ? 'qr-frame-elegant' : ''}
                `}
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeSVG
                  value={generateQRContent()}
                  size={Math.min(size, 300)}
                  fgColor={qrColor}
                  bgColor={bgColor}
                  level="M"
                />
              </div>
            </div>

            {/* Download Options */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Download Options</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => downloadQR('png')}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button
                  onClick={() => downloadQR('jpg')}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  JPG
                </Button>
                <Button
                  onClick={() => downloadQR('svg')}
                  disabled={isGenerating || tier === 'free'}
                  variant="outline"
                  className="w-full relative"
                >
                  <Download className="w-4 h-4 mr-2" />
                  SVG
                  {tier === 'free' && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">Pro</Badge>
                  )}
                </Button>
              </div>
              
              {tier === 'free' && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upgrade to Standard for SVG downloads and premium features
                  </p>
                  <Button variant="premium" size="sm">
                    Upgrade Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};