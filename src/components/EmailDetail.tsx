import { Email, ActionType } from '@/types/email';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Forward, 
  MessageSquare, 
  Mail 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailDetailProps {
  email: Email;
  onAction: (actionType: ActionType) => void;
}

const departmentColors: Record<string, string> = {
  'administration': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'finance': 'bg-green-500/10 text-green-700 dark:text-green-300',
  'public-works': 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  'planning': 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  'human-resources': 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
};

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  'responded': 'bg-green-500/10 text-green-700 dark:text-green-300',
  'forwarded': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'closed': 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
};

export const EmailDetail = ({ email, onAction }: EmailDetailProps) => {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-foreground">{email.subject}</h1>
          <div className="flex gap-2">
            <Badge variant="secondary" className={cn('text-xs', departmentColors[email.department])}>
              {email.department.replace('-', ' ')}
            </Badge>
            <Badge variant="secondary" className={cn('text-xs', statusColors[email.status])}>
              {email.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">From:</span>
            <span className="font-medium text-foreground">
              {email.sender} &lt;{email.senderEmail}&gt;
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">To:</span>
            <span className="text-foreground">{email.recipient}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Date:</span>
            <span className="text-foreground">
              {email.timestamp.toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </span>
          </div>
          {email.hasAttachments && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Attachments:</span>
              <Badge variant="outline" className="text-xs">
                📎 View attachments
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap text-foreground">{email.body}</div>
        </div>
      </div>

      <div className="border-t bg-card p-6">
        <h3 className="text-sm font-semibold mb-4 text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button
            onClick={() => onAction('accept')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3 flex-col"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-xs">Accept</span>
          </Button>

          <Button
            onClick={() => onAction('reject')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3 flex-col"
          >
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-xs">Reject</span>
          </Button>

          <Button
            onClick={() => onAction('request-info')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3 flex-col"
          >
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span className="text-xs">Request Info</span>
          </Button>

          <Button
            onClick={() => onAction('forward')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3 flex-col"
          >
            <Forward className="h-5 w-5 text-purple-600" />
            <span className="text-xs">Forward</span>
          </Button>

          <Button
            onClick={() => onAction('custom')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3 flex-col"
          >
            <MessageSquare className="h-5 w-5 text-orange-600" />
            <span className="text-xs">Custom Reply</span>
          </Button>

          <Button
            onClick={() => onAction('acknowledge')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3 flex-col"
          >
            <Mail className="h-5 w-5 text-gray-600" />
            <span className="text-xs">Acknowledge</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
