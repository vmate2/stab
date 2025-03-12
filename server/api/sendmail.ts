import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);
  
  for (const sponsor of body.sponsors) {
    await sendEmail(sponsor);
  }
});

async function sendEmail(sponsor:any) {
  console.log('sending mail...');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'trefortstab@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  let szoveg;

  switch (sponsor.type) {
    case 'díszlet': //díszleti alapanyagok
      szoveg = 'kemény papír, A/4-es színes papír, hurkapálca, ragasztó, fa- és temperafesték'
      break;
    
    case 'faanyag': //Faanyag / raklap 
      szoveg = 'egyutas és szabvány raklapok, cseréplécek, mindenfajta deszkák és lécek, csavarok, szegek'
    break;

    case 'raklap': //csak raklap
      szoveg = 'egyutas és szabvány raklapok'
      break;

    case 'étel': //mindenfajta étel
      szoveg = 'bármilyen nem gyorsan romlandó étel'
    break;

    case 'tárgyi': //egyéb tárgyi mindenféle cégtől pl.: legó stb
      szoveg = 'bármilyen tárgyi vagy anyagi támogatás'
    break;

    default: //anyagi
      break;
  }

  const mailOptions = {
    from: 'trefortstab@gmail.com',
    to: sponsor.email,
    subject: 'Szponzorációs felkeresés',
    text: `Hello ${sponsor.name}, köszönjük a támogatásod!`,
    
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return 'Email sent';
  } catch (error) {
    console.error('Error:', error);
    return error;
  }
}
