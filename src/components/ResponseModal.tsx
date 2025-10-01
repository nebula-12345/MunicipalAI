import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Email, ActionType } from '@/types/email';
import { generateAIResponse } from '@/utils/aiResponses';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResponseModalProps {
  open: boolean;
  onClose: () => void;
  email: Email;
  actionType: ActionType;
  onSend: (response: string) => void;
}

const actionTitles: Record<ActionType, string> = {
  'accept': 'Accept Request',
  'reject': 'Reject Request',
  'request-info': 'Request More Information',
  'forward': 'Forward to Another Department',
  'custom': 'Custom Reply',
  'acknowledge': 'Acknowledge Receipt',
};

export const ResponseModal = ({ open, onClose, email, actionType, onSend }: ResponseModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipient, setRecipient] = useState(email.senderEmail);
  const [subject, setSubject] = useState(`Re: ${email.subject}`);
  const [body, setBody] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const generatedResponse = generateAIResponse(email, actionType);
      setBody(generatedResponse);
      setIsGenerating(false);
    }, 1500);
  };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      // Reset and generate when opening
      setRecipient(email.senderEmail);
      setSubject(`Re: ${email.subject}`);
      setBody('');
      handleGenerate();
    } else {
      onClose();
    }
  };

  const handleSend = () => {
    toast({
      title: 'Email Sent',
      description: `Your response has been sent to ${recipient}`,
    });
    onSend(body);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {actionTitles[actionType]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">To</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="recipient@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            {isGenerating ? (
              <div className="flex items-center justify-center h-64 border rounded-md bg-muted">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Generating AI response...</p>
                </div>
              </div>
            ) : (
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Email body"
                rows={12}
                className="font-mono text-sm"
              />
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button
            onClick={handleSend}
            disabled={isGenerating || !body.trim()}
          >
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
