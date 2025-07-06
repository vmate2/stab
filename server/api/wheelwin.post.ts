
import QRCode from 'qrcode'
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const p = new PrismaClient();

export default defineEventHandler(async (event) => {
  console.log(await readBody(event));

  const winID = event.node.req.headers['X-Request-Id'] || event.node.req.headers['x-request-id'];

  console.log(winID);
  
  if (!winID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Missing X-Request-Id header',
    });
  }

  const body = await readBody(event);

  if (!body || typeof body !== 'object' || !body.type || !body.amount) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Invalid request body',
    });
  }
  console.log('generating qrcode');
  
  const qrCode = await generateQRcode(body, winID);

  if (!qrCode) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not generate QR code',
    });
  }
  console.log('qrcode generated, storing to DB');
  

  const result = await storeToDB(body, qrCode, winID);

  if (result.success) {
    console.log('Data stored successfully, sending QR code');
    const result = await sendQRcode(qrCode, body);
    return {requestId: winID, success: true}
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error: Could not store data to database',
  });

})

async function generateQRcode(data: object, winID:any) {
  console.warn('Generating QR code with data:', winID);
  
  const formattedData = {
    ...data,
    winID: winID
  };

  console.warn('Formatted data for QR code:', formattedData);
  const payload = encrypt(formattedData);
  try {
    const qr = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
    return qr // base64 string
  } catch (err) {
    console.error('QR generation error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not generate QR code',
    })
  }
}

async function storeToDB(data: any, qrcode: string, winID: string) {
  console.log('DATA: ',data);
  try {
    const existing = await p.wheelWin.findFirst({
      where: {
        OR: [
          {email: data.email},
          {name: data.name},
        ]
      },
      select: {
        createdAt: true,
      }
    });

    console.log('EXISTING: ', existing);
    

    const createdAt = new Date(existing.createdAt);
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    const diffHours = diff / (1000 * 60 * 60);

    //if (diffHours < 24) {
    //  console.error('Too many requests in 24 hours');
    //  throw createError({
    //    statusCode: 429,
    //    statusMessage: 'Too Many Requests: Please wait before submitting again',
    //    message: 'You can only submit once every 24 hours'
    //  });
    //}
    } catch (error:any) {
    console.error('Error checking existing win:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not check existing win',
      message: error.message || 'Error checking existing win'
    });
  }
  
  try {
      const result = await p.wheelWin.create({
        data: {
          winID: winID,
          type: data.type,
          amount: parseInt(data.amount) || 1,
          name: data.name || 'N/A',
          email: data.email || null,
          qrcode: qrcode,
        }
      });
      if (!result) {
        console.error('Failed to store data to database');
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error: Could not store data to database',
          message: 'Failed to store data to database'
        });
      }
    
      return { success: true, message: 'Data stored successfully' };
  } catch (error:any) {
    console.error('Error storing data to DB:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Could not store data to database',
      message: error.message || 'Error storing data to database'
    });
  }


}

async function sendQRcode(qrcode:any, data: any) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'trefortstab@gmail.com',
      pass: useRuntimeConfig().emailPass,
    },
  });

  const mailOptions = {
      from: '"Trefort Stáb" <trefortstab@gmail.com>',
      to: data.email,
      subject: 'Nyereményed a Trefort Stáb kerékből',
      text: `Kedves ${data.name},

    Gratulálunk! Nyereményed a Trefort Stáb kerékből:

    Típus: ${data.type}
    Mennyiség: ${data.amount}

    A nyereményed beváltásához mutasd fel az alábbi QR kódot a GaraCity-ben (Szent István tér) a FinalDeal stáb bódéjában.

    Üdvözlettel,
    FinalDeal Trefort`,
      html: `
        <p>Kedves ${data.name},</p>
        <p>Gratulálunk! Nyereményed a Trefort Stáb kerékből:</p>
        <p><strong>Típus:</strong> ${data.type}<br/>
        <strong>Mennyiség:</strong> ${data.amount}</p>
        <p>A nyereményed beváltásához mutasd fel az alábbi QR kódot a GaraCity-ben (Szent István tér) a FinalDeal stáb bódéjában:</p>
        <p><img src="cid:qr-code" alt="QR kód" /></p>
        <p>Üdvözlettel,<br/>FinalDeal Trefort</p>
      `,
      attachments: [
        {
          filename: 'qr_code.png',
          content: qrcode.split(',')[1], // csak a base64 adat
          encoding: 'base64',
          cid: 'qr-code', // ezt használjuk az <img src="cid:qr-code">-ban
        }
      ]
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return {
      status: 200,
      statusMessage: 'Sikeres nyeremény értesítés',
    };
  } catch (error: any) {
    console.error('sendQRcode Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send QR code email',
      message: error.message || error,
    });
  }
  
}



function encrypt(data: object): string {
  const secret = createHash('sha256')
    .update(useRuntimeConfig().qrSecret)
    .digest() // 32 bytes key

  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-cbc', secret, iv)

  const json = JSON.stringify(data)
  let encrypted = cipher.update(json, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  return JSON.stringify({
    iv: iv.toString('base64'),
    data: encrypted,
  })
}

function decrypt(payload: string): object | null {
  const { iv, data } = JSON.parse(payload)

  const key = createHash('sha256')
    .update(useRuntimeConfig().qrSecret)
    .digest()

  const decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'))
  let decrypted = decipher.update(data, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}
