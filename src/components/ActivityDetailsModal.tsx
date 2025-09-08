import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Link as LinkIcon, Copy, ExternalLink, Eye, Calendar, Check } from 'lucide-react';
import { Activity } from '@/hooks/useActivityTracker';
import { useToast } from '@/hooks/use-toast';

interface ActivityDetailsModalProps {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  activity,
  open,
  onOpenChange
}) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg border-2 flex items-center justify-center"
              style={activity.type === 'qr_code' ? {
                backgroundColor: activity.bg_color || '#FFFFFF',
                borderColor: activity.qr_color || '#3B82F6'
              } : undefined}
            >
              {activity.type === 'qr_code' ? (
                <QrCode 
                  className="w-5 h-5" 
                  style={{ color: activity.qr_color || '#3B82F6' }}
                />
              ) : (
                <LinkIcon className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{activity.title}</h3>
              <Badge variant="outline">
                {activity.type === 'qr_code' ? 'QR Code' : 'Short URL'}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Eye className="w-4 h-4" />
                {activity.type === 'qr_code' ? 'Scans' : 'Clicks'}
              </div>
              <div className="text-2xl font-bold">
                {activity.type === 'qr_code' ? activity.scans : activity.clicks}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                Created
              </div>
              <div className="text-lg font-semibold">
                {formatDate(activity.created_at)}
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Target URL
              </label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-muted/50 rounded-lg p-3 text-sm break-all">
                  {activity.content}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(activity.content, 'Target URL')}
                >
                  {copiedField === 'Target URL' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(activity.content, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {activity.short_url && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {activity.type === 'qr_code' ? 'QR Code URL' : 'Short URL'}
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-muted/50 rounded-lg p-3 text-sm break-all text-primary">
                    {activity.short_url}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(activity.short_url!, 'Short URL')}
                  >
                    {copiedField === 'Short URL' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(activity.short_url!, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Color info for QR codes */}
          {activity.type === 'qr_code' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Colors</label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border" 
                    style={{ backgroundColor: activity.qr_color }}
                  ></div>
                  <span className="text-sm">QR Color</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border" 
                    style={{ backgroundColor: activity.bg_color }}
                  ></div>
                  <span className="text-sm">Background</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};