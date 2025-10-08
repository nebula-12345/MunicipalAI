import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Email, ActionType } from '@/types/email';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { 
          email: {
            sender: email.sender,
            senderEmail: email.senderEmail,
            subject: email.subject,
            body: email.body
          },
          actionType 
        }
      });

      if (error) {
        console.error('Error generating response:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate response. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      setBody(data.response);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
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
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
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
              <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/30">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground font-medium">Generating AI response...</p>
                </div>
              </div>
            ) : (
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Email body"
                rows={12}
                className="text-sm resize-none"
              />
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Regenerate
          </Button>
          <Button
            onClick={handleSend}
            disabled={isGenerating || !body.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
