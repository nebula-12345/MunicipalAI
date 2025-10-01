import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const departmentColors: Record<string, string> = {
    'administration': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    'finance': 'bg-green-500/10 text-green-700 dark:text-green-300',
    'public-works': 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
    'planning': 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    'human-resources': 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
  };

  if (!user) return null;

  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">City Hall Email Portal</h1>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className={departmentColors[user.department]}>
            {user.department.replace('-', ' ')}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
