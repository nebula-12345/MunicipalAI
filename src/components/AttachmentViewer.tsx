import { Attachment } from '@/types/email';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, File } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AttachmentViewerProps {
  attachments: Attachment[];
}

export const AttachmentViewer = ({ attachments }: AttachmentViewerProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const handleDownload = (attachment: Attachment) => {
    // In a real app, this would trigger actual download
    console.log('Downloading:', attachment.name);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Attachments ({attachments.length})</h3>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <Card key={attachment.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">
                  {getFileIcon(attachment.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDownload(attachment)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
