import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Email, ActionType, Department, EmailStatus } from '@/types/email';
import { mockEmails } from '@/data/mockEmails';
import { EmailList } from '@/components/EmailList';
import { EmailDetail } from '@/components/EmailDetail';
import { ResponseModal } from '@/components/ResponseModal';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType>('custom');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EmailStatus | 'all'>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const matchesSearch = 
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = 
        departmentFilter === 'all' || email.department === departmentFilter;

      const matchesStatus = 
        statusFilter === 'all' || email.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [emails, searchQuery, departmentFilter, statusFilter]);

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
      );
    }
  };

  const handleAction = (actionType: ActionType) => {
    setCurrentAction(actionType);
    setModalOpen(true);
  };

  const handleSendResponse = (response: string) => {
    if (selectedEmail) {
      setEmails((prev) =>
        prev.map((e) =>
          e.id === selectedEmail.id
            ? { ...e, status: 'responded' as EmailStatus }
            : e
        )
      );
      setSelectedEmail({ ...selectedEmail, status: 'responded' });
    }
  };

  const handleArchive = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId ? { ...e, status: 'archived' as EmailStatus } : e
      )
    );
    if (selectedEmail?.id === emailId) {
      setSelectedEmail({ ...selectedEmail, status: 'archived' });
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[30%] min-w-[320px]">
        <EmailList
          emails={filteredEmails}
          selectedEmailId={selectedEmail?.id || null}
          onSelectEmail={handleSelectEmail}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      <div className="flex-1">
        {selectedEmail ? (
          <>
            <EmailDetail 
              email={selectedEmail} 
              onAction={handleAction} 
              onArchive={handleArchive}
            />
            <ResponseModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              email={selectedEmail}
              actionType={currentAction}
              onSend={handleSendResponse}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                Select an email to view
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose an email from the list to see its details and respond
              </p>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Index;
