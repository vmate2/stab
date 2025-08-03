import { connect } from 'imap-simple';
import { simpleParser } from 'mailparser';

const IMAP_CONFIG = {
  imap: {
    user: 'trefortstab@gmail.com',
    password: useRuntimeConfig().emailPass,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: {
      rejectUnauthorized: false
    }
  }
};

// Lista a kizárandó szolgáltató domainekből
const EXCLUDED_DOMAINS = [
  'google.com',
  'facebook.com',
  'instagram.com',
  'accounts.google.com',
  'notifications.facebookmail.com',
  'tiktok.com',
  'linkedin.com'
];

function isRelevantEmail(fromAddress?: string): boolean {
  if (!fromAddress) return false;
  const lower = fromAddress.toLowerCase();
  return !EXCLUDED_DOMAINS.some(domain => lower.includes(domain));
}

async function fetchEmailsFromBox(boxName: string, searchEmail?: string, isSent = false) {
  const connection = await connect(IMAP_CONFIG);
  await connection.openBox(boxName);

  let searchCriteria;
  if (searchEmail) {
    searchCriteria = isSent ? [['TO', searchEmail]] : [['FROM', searchEmail]];
  } else {
    searchCriteria = ['ALL'];
  }

  const fetchOptions = {
    bodies: [''],
    struct: true,
    markSeen: false
  };

  const messages = await connection.search(searchCriteria, fetchOptions);

  const parsedEmails = await Promise.all(
    messages.map(async (message) => {
      const all = message.parts.find(part => part.which === '');
      const parsed = await simpleParser(all?.body || '');

      return {
        from: parsed.from?.text,
        to: parsed.to?.text,
        subject: parsed.subject,
        date: parsed.date?.toISOString(),
        text: parsed.text,
        html: parsed.html,
        messageId: parsed.messageId || '',
        attachments: parsed.attachments.map(att => ({
          filename: att.filename,
          contentType: att.contentType,
          size: att.size
        }))
      };
    })
  );

  await connection.end();

  // Csak a releváns leveleket adja vissza
  return parsedEmails.filter(email => isRelevantEmail(email.from));
}

export async function getInboxEmails(email?: string) {
  return fetchEmailsFromBox('INBOX', email, false);
}

export async function getSentEmails(email?: string) {
  return fetchEmailsFromBox('[Gmail]/Sent Mail', email, true);
}
