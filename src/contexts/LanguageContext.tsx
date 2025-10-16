import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ka';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.title': 'City Hall Email Portal',
    'header.logout': 'Logout',
    
    // Auth
    'auth.title': 'City Hall Email Portal',
    'auth.subtitle': 'Sign in to access your department\'s emails',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.emailPlaceholder': 'your.email@cityhall.gov',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.signIn': 'Sign in',
    'auth.signingIn': 'Signing in...',
    'auth.demoCredentials': 'Demo Credentials:',
    'auth.passwordLabel': 'Password:',
    
    // Departments
    'dept.administration': 'Administrative Service',
    'dept.finance': 'Financial Policy and Public Procurement',
    'dept.social': 'Social Service',
    'dept.audit': 'Audit Service',
    'dept.culture': 'Culture, Sports, Education and Youth Affairs',
    'dept.infrastructure': 'Municipal and Housing Infrastructure Development',
    
    // Email List
    'email.search': 'Search emails...',
    'email.allStatus': 'All Status',
    'email.pending': 'Pending',
    'email.responded': 'Responded',
    'email.forwarded': 'Forwarded',
    'email.closed': 'Closed',
    'email.archived': 'Archived',
    'email.noEmails': 'No emails found',
    'email.tryAdjusting': 'Try adjusting your filters or search query',
    
    // Email Detail
    'email.from': 'From',
    'email.to': 'To',
    'email.attachments': 'Attachments',
    'email.quickActions': 'Quick Actions',
    'email.accept': 'Accept',
    'email.reject': 'Reject',
    'email.requestInfo': 'Request Info',
    'email.forward': 'Forward',
    'email.customReply': 'Custom Reply',
    'email.acknowledge': 'Acknowledge',
    'email.archiveEmail': 'Archive Email',
    'email.urgent': 'Urgent',
    'email.high': 'High',
    'email.normal': 'Normal',
    'email.low': 'Low',
    'email.dueToday': 'Due today',
    'email.dueTomorrow': 'Due tomorrow',
    'email.dueIn': 'Due in',
    'email.days': 'days',
    'email.overdue': 'Overdue by',
    
    // Response Modal
    'response.title': 'Response',
    'response.generating': 'Generating AI response...',
    'response.editResponse': 'Edit your response below before sending:',
    'response.send': 'Send Response',
    'response.cancel': 'Cancel',
  },
  ka: {
    // Header
    'header.title': 'მერიის ელ-ფოსტის პორტალი',
    'header.logout': 'გასვლა',
    
    // Auth
    'auth.title': 'მერიის ელ-ფოსტის პორტალი',
    'auth.subtitle': 'შედით თქვენი დეპარტამენტის ელ-ფოსტის სანახავად',
    'auth.email': 'ელ-ფოსტა',
    'auth.password': 'პაროლი',
    'auth.emailPlaceholder': 'თქვენი.ელფოსტა@cityhall.gov',
    'auth.passwordPlaceholder': 'შეიყვანეთ პაროლი',
    'auth.signIn': 'შესვლა',
    'auth.signingIn': 'შესვლა...',
    'auth.demoCredentials': 'დემო მონაცემები:',
    'auth.passwordLabel': 'პაროლი:',
    
    // Departments
    'dept.administration': 'ადმინისტრაციული სამსახური',
    'dept.finance': 'საფინანსო პოლიტიკა და სახელმწიფო შესყიდვები',
    'dept.social': 'სოციალური სამსახური',
    'dept.audit': 'აუდიტის სამსახური',
    'dept.culture': 'კულტურის, სპორტის, განათლების და ახალგაზრდობის საქმეთა სამსახური',
    'dept.infrastructure': 'მუნიციპალური და საბინაო ინფრასტრუქტურის განვითარების სამსახური',
    
    // Email List
    'email.search': 'ელ-ფოსტის ძებნა...',
    'email.allStatus': 'ყველა სტატუსი',
    'email.pending': 'მოლოდინში',
    'email.responded': 'პასუხგაცემული',
    'email.forwarded': 'გადაგზავნილი',
    'email.closed': 'დახურული',
    'email.archived': 'დაარქივებული',
    'email.noEmails': 'ელ-ფოსტა ვერ მოიძებნა',
    'email.tryAdjusting': 'სცადეთ ფილტრების ან ძიების შეცვლა',
    
    // Email Detail
    'email.from': 'გამგზავნი',
    'email.to': 'მიმღები',
    'email.attachments': 'დანართები',
    'email.quickActions': 'სწრაფი მოქმედებები',
    'email.accept': 'მიღება',
    'email.reject': 'უარყოფა',
    'email.requestInfo': 'ინფორმაციის მოთხოვნა',
    'email.forward': 'გადაგზავნა',
    'email.customReply': 'პასუხი',
    'email.acknowledge': 'დადასტურება',
    'email.archiveEmail': 'დაარქივება',
    'email.urgent': 'გადაუდებელი',
    'email.high': 'მაღალი',
    'email.normal': 'ნორმალური',
    'email.low': 'დაბალი',
    'email.dueToday': 'დღეს უნდა გაკეთდეს',
    'email.dueTomorrow': 'ხვალ უნდა გაკეთდეს',
    'email.dueIn': 'დარჩა',
    'email.days': 'დღე',
    'email.overdue': 'ვადაგადაცილებული',
    
    // Response Modal
    'response.title': 'პასუხი',
    'response.generating': 'პასუხის გენერირება...',
    'response.editResponse': 'დაარედაქტირეთ პასუხი გაგზავნამდე:',
    'response.send': 'პასუხის გაგზავნა',
    'response.cancel': 'გაუქმება',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
