import { Email, Department, EmailStatus, Priority } from '@/types/email';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Search, Filter, AlertCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (email: Email) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: EmailStatus | 'all';
  onStatusFilterChange: (status: EmailStatus | 'all') => void;
}

const departmentColors: Record<Department, string> = {
  'administration': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'finance': 'bg-green-500/10 text-green-700 dark:text-green-300',
  'social': 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  'audit': 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  'culture': 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
  'infrastructure': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
};

const statusColors: Record<EmailStatus, string> = {
  'pending': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  'responded': 'bg-green-500/10 text-green-700 dark:text-green-300',
  'forwarded': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'closed': 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
  'archived': 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
};

const priorityColors: Record<Priority, string> = {
  'urgent': 'bg-red-500/10 text-red-700 dark:text-red-300',
  'high': 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  'normal': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'low': 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
};

const formatDueDate = (dueDate: Date | undefined, t: (key: string) => string): string | null => {
  if (!dueDate) return null;
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return `${t('email.overdue')} ${Math.abs(days)} ${t('email.days')}`;
  if (days === 0) return t('email.dueToday');
  if (days === 1) return t('email.dueTomorrow');
  return `${t('email.dueIn')} ${days} ${t('email.days')}`;
};

export const EmailList = ({
  emails,
  selectedEmailId,
  onSelectEmail,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: EmailListProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="border-b p-4 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Inbox</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('email.search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('email.allStatus')}</SelectItem>
            <SelectItem value="pending">{t('email.pending')}</SelectItem>
            <SelectItem value="responded">{t('email.responded')}</SelectItem>
            <SelectItem value="forwarded">{t('email.forwarded')}</SelectItem>
            <SelectItem value="closed">{t('email.closed')}</SelectItem>
            <SelectItem value="archived">{t('email.archived')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              'border-b p-4 cursor-pointer transition-colors hover:bg-accent',
              selectedEmailId === email.id && 'bg-accent',
              !email.isRead && 'bg-muted/50'
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className={cn(
                'font-medium text-sm',
                !email.isRead ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {email.sender}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {email.timestamp.toLocaleDateString()}
              </span>
            </div>

            <h3 className={cn(
              'text-sm mb-2 line-clamp-1',
              !email.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'
            )}>
              {email.subject}
            </h3>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {email.body}
            </p>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className={cn('text-xs', priorityColors[email.priority])}>
                {email.priority === 'urgent' && <AlertCircle className="h-3 w-3 mr-1" />}
                {t(`email.${email.priority}`)}
              </Badge>
              <Badge variant="secondary" className={cn('text-xs', statusColors[email.status])}>
                {t(`email.${email.status}`)}
              </Badge>
              {email.dueDate && (
                <Badge variant="outline" className={cn(
                  'text-xs',
                  formatDueDate(email.dueDate, t)?.includes(t('email.overdue')) && 'border-red-500 text-red-700 dark:text-red-300'
                )}>
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDueDate(email.dueDate, t)}
                </Badge>
              )}
              {email.hasAttachments && (
                <Badge variant="outline" className="text-xs">
                  📎 {email.attachments?.length || 0}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
