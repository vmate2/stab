import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log(body);

    if (body.type == 'szponzor') {
      for (const sponsor of body.sponsors) {
        await sendEmailSponsor(sponsor);
      }
    } else if (body.type == 'newUser') {
      return await sendEmailNewUser(body);
    }
  } catch (error: any) {
    console.error('Handler Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error while sending emails',
      message: error.message || error,
    });
  }
});

async function sendEmailNewUser(body: any) {
  console.log('EMAILCREDS: ', useRuntimeConfig().emailPass);
  

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'trefortstab@gmail.com',
      pass: useRuntimeConfig().emailPass,
    },
  });

  const mailOptions = {
    from: '"Trefort Stáb" <trefortstab@gmail.com>',
    to: body.email,
    subject: body.subject,
    text: body.text,
    html: body.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return {
      status: 200,
      statusMessage: 'Sikeres létrehozás',
    };
  } catch (error: any) {
    console.error('sendEmailNewUser Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send new user email',
      message: error.message || error,
    });
  }
}

async function sendEmailSponsor(sponsor: any) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'trefortstab@gmail.com',
      pass: useRuntimeConfig().emailPass,
    },
  });

  let szoveg;
  switch (sponsor.type) {
    case 'díszlet':
      szoveg = 'kemény papír, A/4-es színes papír, hurkapálca, ragasztó, fa- és temperafesték';
      break;
    case 'faanyag':
      szoveg = 'egyutas és szabvány raklapok, cseréplécek, mindenfajta deszkák és lécek, csavarok, szegek';
      break;
    case 'raklap':
      szoveg = 'egyutas és szabvány raklapok';
      break;
    case 'étel':
      szoveg = 'bármilyen nem gyorsan romlandó étel';
      break;
    case 'tárgyi':
      szoveg = 'bármilyen tárgyi vagy anyagi támogatás';
      break;
    default:
      szoveg = 'Támogatás';
      break;
  }

  const mailOptions = {
    from: 'trefortstab@gmail.com',
    to: sponsor.email,
    subject: 'Szponzorációs felkeresés',
    text: `Hello ${sponsor.name}, köszönjük a támogatásod!\n\nA szükséges támogatás típusa: ${szoveg}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Sponsor email sent:', info.response);
    return 'Sponsor email sent';
  } catch (error: any) {
    console.error('sendEmailSponsor Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send sponsor email',
      message: error.message || error,
    });
  }
}
