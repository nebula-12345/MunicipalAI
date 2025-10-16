import { Email, ActionType, Priority, EmailStatus } from '@/types/email';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Forward, 
  MessageSquare, 
  Mail,
  AlertCircle,
  Clock,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AttachmentViewer } from './AttachmentViewer';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmailDetailProps {
  email: Email;
  onAction: (actionType: ActionType) => void;
  onArchive: (emailId: string) => void;
}

const departmentColors: Record<string, string> = {
  'administration': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'finance': 'bg-green-500/10 text-green-700 dark:text-green-300',
  'social': 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  'audit': 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  'culture': 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
  'infrastructure': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
};

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  'responded': 'bg-green-500/10 text-green-700 dark:text-green-300',
  'forwarded': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'closed': 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
  'archived': 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
};

const priorityColors: Record<string, string> = {
  'urgent': 'bg-red-500/10 text-red-700 dark:text-red-300',
  'high': 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  'normal': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'low': 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
};

const formatDueDate = (dueDate: Date | undefined, t: (key: string) => string): string => {
  if (!dueDate) return 'No due date';
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return `${t('email.overdue')} ${Math.abs(days)} ${t('email.days')}`;
  if (days === 0) return t('email.dueToday');
  if (days === 1) return t('email.dueTomorrow');
  return `${t('email.dueIn')} ${days} ${t('email.days')}`;
};

export const EmailDetail = ({ email, onAction, onArchive }: EmailDetailProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-foreground">{email.subject}</h1>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className={cn('text-xs flex items-center gap-1', priorityColors[email.priority])}>
              {email.priority === 'urgent' && <AlertCircle className="h-3 w-3" />}
              {t(`email.${email.priority}`)}
            </Badge>
            <Badge variant="secondary" className={cn('text-xs', statusColors[email.status])}>
              {t(`email.${email.status}`)}
            </Badge>
            <Badge variant="outline" className={cn(
              'text-xs flex items-center gap-1',
              email.dueDate && new Date() > email.dueDate && 'border-red-500 text-red-700 dark:text-red-300'
            )}>
              <Clock className="h-3 w-3" />
              {formatDueDate(email.dueDate, t)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t('email.from')}:</span>
            <span className="font-medium text-foreground">
              {email.sender} &lt;{email.senderEmail}&gt;
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t('email.to')}:</span>
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
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap text-foreground">{email.body}</div>
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <AttachmentViewer attachments={email.attachments} />
        )}
      </div>

      <div className="border-t bg-gradient-to-b from-background to-muted/30 p-6">
        <h3 className="text-sm font-semibold mb-4 text-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {t('email.quickActions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <Button
            onClick={() => onAction('accept')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-4 flex-col hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-300 transition-all"
          >
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <span className="text-xs font-medium">{t('email.accept')}</span>
          </Button>

          <Button
            onClick={() => onAction('reject')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-4 flex-col hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 transition-all"
          >
            <XCircle className="h-6 w-6 text-red-600" />
            <span className="text-xs font-medium">{t('email.reject')}</span>
          </Button>

          <Button
            onClick={() => onAction('request-info')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-4 flex-col hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 transition-all"
          >
            <HelpCircle className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium">{t('email.requestInfo')}</span>
          </Button>

          <Button
            onClick={() => onAction('forward')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-4 flex-col hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 transition-all"
          >
            <Forward className="h-6 w-6 text-purple-600" />
            <span className="text-xs font-medium">{t('email.forward')}</span>
          </Button>

          <Button
            onClick={() => onAction('custom')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-4 flex-col hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 transition-all"
          >
            <MessageSquare className="h-6 w-6 text-orange-600" />
            <span className="text-xs font-medium">{t('email.customReply')}</span>
          </Button>

          <Button
            onClick={() => onAction('acknowledge')}
            variant="outline"
            className="flex items-center gap-2 h-auto py-4 flex-col hover:bg-gray-50 dark:hover:bg-gray-950/20 hover:border-gray-300 transition-all"
          >
            <Mail className="h-6 w-6 text-gray-600" />
            <span className="text-xs font-medium">{t('email.acknowledge')}</span>
          </Button>
        </div>

        {email.status !== 'archived' && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => onArchive(email.id)}
              variant="outline"
              className="w-full hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 transition-all"
            >
              <Archive className="h-4 w-4 mr-2" />
              {t('email.archiveEmail')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
