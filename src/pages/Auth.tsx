import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { validateCredentials } from '@/data/mockUsers';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Languages } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      const user = validateCredentials(email, password);
      
      if (user) {
        login(user);
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${user.name} - ${user.department}`,
        });
        navigate('/');
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ka' : 'en')}
              >
                <Languages className="h-4 w-4 mr-2" />
                {language === 'en' ? 'ქარ' : 'ENG'}
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">{t('auth.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('auth.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2 text-foreground">{t('auth.demoCredentials')}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• admin@cityhall.gov ({t('dept.administration')})</p>
              <p>• finance@cityhall.gov ({t('dept.finance')})</p>
              <p>• social@cityhall.gov ({t('dept.social')})</p>
              <p>• audit@cityhall.gov ({t('dept.audit')})</p>
              <p>• culture@cityhall.gov ({t('dept.culture')})</p>
              <p>• infrastructure@cityhall.gov ({t('dept.infrastructure')})</p>
              <p className="mt-2 font-medium">{t('auth.passwordLabel')} <span className="font-mono">password123</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
