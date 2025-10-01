import { ActionType, Email } from '@/types/email';

export const generateAIResponse = (email: Email, actionType: ActionType): string => {
  const timestamp = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  switch (actionType) {
    case 'accept':
      return `Dear ${email.sender},

Thank you for your correspondence dated ${email.timestamp.toLocaleDateString()}.

After careful review of your request regarding "${email.subject}", we are pleased to inform you that your request has been approved.

We will proceed with the necessary arrangements and will keep you informed of any developments. If you have any questions or need further clarification, please do not hesitate to contact us.

Best regards,
City Hall ${email.department.charAt(0).toUpperCase() + email.department.slice(1).replace('-', ' ')} Department
${timestamp}`;

    case 'reject':
      return `Dear ${email.sender},

Thank you for your correspondence dated ${email.timestamp.toLocaleDateString()}.

After careful consideration of your request regarding "${email.subject}", we regret to inform you that we are unable to accommodate your request at this time.

This decision was made after thorough review of all relevant factors and applicable regulations. If you would like to discuss this matter further or have additional information to provide, please feel free to contact our office.

We appreciate your understanding.

Sincerely,
City Hall ${email.department.charAt(0).toUpperCase() + email.department.slice(1).replace('-', ' ')} Department
${timestamp}`;

    case 'request-info':
      return `Dear ${email.sender},

Thank you for your inquiry dated ${email.timestamp.toLocaleDateString()} regarding "${email.subject}".

To properly process your request, we need additional information:

1. [Please specify the required documentation]
2. [Additional details needed]
3. [Any clarifications required]

Please provide the requested information at your earliest convenience. Once we receive the complete information, we will be able to proceed with your request.

If you have any questions, please don't hesitate to contact us.

Best regards,
City Hall ${email.department.charAt(0).toUpperCase() + email.department.slice(1).replace('-', ' ')} Department
${timestamp}`;

    case 'forward':
      return `Dear Colleague,

I am forwarding the below email from ${email.sender} regarding "${email.subject}" for your department's attention and appropriate action.

Please review and respond directly to the sender at ${email.senderEmail}.

Original message:
From: ${email.sender} <${email.senderEmail}>
Date: ${email.timestamp.toLocaleDateString()}
Subject: ${email.subject}

${email.body}

Thank you for your assistance.

Best regards,
City Hall ${email.department.charAt(0).toUpperCase() + email.department.slice(1).replace('-', ' ')} Department
${timestamp}`;

    case 'acknowledge':
      return `Dear ${email.sender},

This message confirms receipt of your email dated ${email.timestamp.toLocaleDateString()} regarding "${email.subject}".

Your request has been logged and assigned reference number REF-${Date.now().toString().slice(-6)}. We are currently reviewing your inquiry and will respond with a detailed reply within 3-5 business days.

If you need to reference this matter in future correspondence, please include the reference number above.

Thank you for your patience.

Best regards,
City Hall ${email.department.charAt(0).toUpperCase() + email.department.slice(1).replace('-', ' ')} Department
${timestamp}`;

    case 'custom':
      return `Dear ${email.sender},

Thank you for your email regarding "${email.subject}".

[Please provide your custom response here]

Best regards,
City Hall ${email.department.charAt(0).toUpperCase() + email.department.slice(1).replace('-', ' ')} Department
${timestamp}`;

    default:
      return '';
  }
};
