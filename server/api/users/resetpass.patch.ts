import { constants } from "buffer";
import { checkToken } from "~/composables/defaults"
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';

const p = new PrismaClient()

export default defineEventHandler(async (event) => {
  await checkToken(event) || (() => {throw createError({statusCode: 401, statusMessage: 'Hibas token!'})})();
  const body = await readBody(event);
  const encryptedPass = await $fetch('/api/encrypt-password', {
    method: 'POST',
    headers: { key: useRuntimeConfig().secret_header },
    body: {
      id: body.uuid,
      password: body.password
    }
  });
  if (!encryptedPass.hashedpass) {
    throw createError({statusCode: 500, statusMessage: 'Hiba a jelszo titkositasa közben!'})
  }
  try {
  const result =  await p.users.update({
    where: {
      uuid: body.uuid
    },
    data: {
      password: encryptedPass.hashedpass
    },
    select: {
      password: true
    }
  })
  if (!result) throw createError({statusCode:500, statusMessage: 'Szerver hiba az uj jelszo tarolasakor!'})
  sendMail(body);
  } catch (error) {
    throw createError({statusCode:500, statusMessage: 'Szerver hiba az uj jelszo tarolasakor!'});
  }


  

})


const sendMail = async (data: { name: string, email: string, password: string }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: 'stab@finaldeal.hu',
      pass: useRuntimeConfig().zohomailPass,
    },
  });

  const mailOptions = {
    from: '"FinalDeal Trefort" <stab@finaldeal.hu>',
    to: data.email,
    subject: 'Új jelszó - FinalDeal Trefort',
    html: `
      <div style="background-color:#8B0000;padding:20px;font-family:Arial,sans-serif;color:#fff">
        <div style="max-width:600px;margin:auto;border:3px solid gold;border-radius:10px;padding:20px;background-color:#1a1a1a">
          <h2 style="text-align:center;color:gold">🎰 FinalDeal - Jelszó visszaállítás</h2>
          <p>Kedves <strong>${data.name}</strong>,</p>
          <p>Visszaállítottuk a jelszavadat a Trefort Stáb rendszerében.</p>
          <p><strong>Új jelszavad:</strong> <span style="color:#0f0;font-weight:bold">${data.password}</span></p>
          <p style="margin-top:20px;">Kérlek, lépj be és változtasd meg a jelszavadat mihamarabb!</p>
          <p style="color:#ccc;margin-top:40px;">Üdvözlettel,<br/>FinalDeal Trefort</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


