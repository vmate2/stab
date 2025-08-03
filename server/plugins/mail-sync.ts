import { defineNitroPlugin, useRuntimeConfig } from '#imports';
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineNitroPlugin(async() => {

  await syncEmails();

  setInterval(async() => {
    await syncEmails()
  }, 5000*60);
});


async function syncEmails() {
  const storedEmails = await prisma.email.findMany({
    select: { messageId: true }
  });

  const currentEmails = await $fetch('/api/emails', {
    headers: {
      'Authorization': useRuntimeConfig().secret_header
    }
  });

  const storedIds = new Set(storedEmails.map(e => e.messageId));
  console.warn(storedEmails.length);
  
  const newEmails = currentEmails.filter(email => email.messageId && !storedIds.has(email.messageId));

  for (const email of newEmails) {
    await prisma.email.create({
      data: {
        messageId: email.messageId,
        from: email.from,
        subject: email.subject,
        date: new Date(email.date),
        textBody: email.text || null,
        htmlBody: email.html || null,
        opened: false,
        to: email.to
      }
    });
  }

  console.log(`✅ Synced ${newEmails.length} new emails.`);
}

