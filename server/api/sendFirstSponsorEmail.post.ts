import { checkToken } from '~/composables/defaults'
import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()




const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

export default defineEventHandler(async () => {
  const szponzorok = await prisma.szponzorok.findMany({
    where: {
      sentFirstLetter: false,
      email: {
        not: null,
      },
      status: '❌'
    },
  })

  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trefortstab@gmail.com',
    pass: useRuntimeConfig().emailPass,
  },
})

  // Előkészítjük a leveleket
  const emails = await Promise.all(
    szponzorok.map(async (s) => {
      const messageId = `first-letter-${s.id}-${Date.now()}`
      let sponsortype = '';
      let sponsortypePlainText = '';
      switch (s.type) {
        case 'money':
          sponsortype = '<p>Kampányunk megvalósításához <strong>pénzbeli támogatást</strong> szeretnénk kérni. Ez segítene fedezni a kampányunk költségeit, mint például a <strong>plakátok</strong>, <strong>díszletelemek</strong> elkészítését, a rendezvényen felszolgált <strong>ételeket</strong>, illetve az egyéb kampányprogramjaink <strong>alapanyagainak</strong> költségét.</p>'
          sponsortypePlainText = 'Kampányunk megvalósításához pénzbeli támogatást szeretnénk kérni. Ez segítene fedezni a kampányunk költségeit, mint például a plakátok, díszletelemek elkészítését, a rendezvényen felszolgált ételeket illetve az egyéb kampányprogramjaink alapanyagainak költségét.';
          break;
        case 'money, giftcard':
          sponsortype = '<p>Kampányunk megvalósításához szeretnénk <strong>pénzbeli támogatást</strong>, <strong>levásárolható összegű utalványt</strong> vagy <strong>kisebb értékű ajándékutalványt</strong> kérni.</p><p>A pénzbeli támogatás segítene fedezni kampányunk költségeit, mint például a <strong>díszletelemek</strong>, valamint a rendezvény során felszolgált <strong>étel</strong> és <strong>ital</strong> biztosítását.</p><p>Az <strong>ajándékutalványokat</strong> a kampány során tartott programokon osztanánk ki az azokon résztvevő diákok számára.</p>'
          sponsortypePlainText = 'Kampányunk megvalósításához szeretnénk pénzbeli támogatást, levásárolható összegű utalványt vagy kisebb értékű ajándékutalványt kérni, a pénzbeli támogatás a kampányunk költségét fedezni mint például a díszletelemeket, a rendezvény során felszolgált ételt / italt. Az ajándékutalványokat a kampány során tartott programokon osztanánk ki az azokon résztvevő diákok számára. ';
        break;
        case 'money, item':
          sponsortype = '<p>Kampányunk megvalósításához szeretnénk <strong>pénzbeli</strong> és/vagy <strong>tárgyi támogatást</strong> kérni.</p><p>A pénzbeli támogatás segítene fedezni kampányunk költségeit, mint például a <strong>díszletelemek</strong>, valamint a rendezvény során felszolgált <strong>étel</strong> és <strong>ital</strong> biztosítását.</p><p>A kisebb értékű tárgyi támogatás pedig segítene a kampányprogramok megrendezésében és a díszletben.</p>'
          sponsortypePlainText = 'Kampányunk megvalósításához szeretnénk pénzbeli és/vagy tárgyi támogatást kérni, a pénzbeli támogatás a kampányunk költségét fedezni mint például a díszletelemeket, a rendezvény során felszolgált ételt / italt. A kisebb értékű tárgyi támogatás pedig segítene a kampányprogramok megrendezésében és a díszletben.';
          break;
          case 'item':
            sponsortype = '<p>Kampányunk megvalósításához szeretnénk <strong>tárgyi támogatást</strong> kérni.</p><p>A kisebb értékű tárgyi támogatás segítene a kampányprogramok megrendezésében és a díszletben.</p>'
            sponsortypePlainText = 'Kampányunk megvalósításához szeretnénk tárgyi támogatást kérni, a támogatás segítene a kampányprogramok megrendezésében és a díszletben.';
            break;
        default:
          console.error('Wrong or no type!')
          break;
      }


      return {
        id: s.id,
        email: s.email!,
        messageId,
        subject: `Támogatási megkeresés – ${s.name}`,
            html: `
            <!DOCTYPE html>
              <html lang="hu">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Garabonciás Napok - Szponzori felkérés</title>
              </head>
              <body style="margin:0;padding:0;background-color:#4b0c15;">
                <div style="max-width:800px;margin:40px auto;background-color:#2b0a10;padding:40px;border-radius:16px;box-shadow:0 0 25px rgba(0,0,0,0.6);border:2px solid #a71d31;color:#f8f8f8;font-family:Arial,sans-serif;">
                  <a href="https://finaldeal.hu/rolunk" target="_blank"><img src="https://i.imgur.com/GyjILxi.png" alt="FinalDeal Logó" style="display:block;margin:0 auto 25px;max-height:90px;"/></a> 

                  <h1 style="color:#f1b100;text-align:center;font-family:Arial,sans-serif;">Tisztelt <span style="color:#ffd700;font-weight:bold;">${s.name}</span>!</h1>

                  <div style="margin-bottom:30px;line-height:1.6;">
                    <p style="color:#f8f8f8;">Szeretnénk megkeresni Önöket szponzori együttműködés céljából a <span style="font-size:1.1em;font-weight:bold;color:#ffe44d;">2025. szeptember 28. és október 3.</span> között megrendezésre kerülő <a href="https://garabonciasnapok.hu" target="_blank" style="color:#f1b100;text-decoration:none;">Békéscsabai Garabonciás Napok</a> kapcsán, amely Magyarország legnagyobb középiskolás fesztiválja.</p>
                    <p>A rendezvényen <strong>1992</strong> óta Békéscsaba <strong>legnagyobb középiskolái</strong> mérettetik meg magukat, közel <strong>ezer</strong> diák vesz részt  a város több pontján szervezett kulturális és szórakoztató programokon.</p>
                  </div>

                  <h2 style="color:#f1b100;text-align:center;font-family:Arial,sans-serif;margin-top:40px;border-bottom:2px solid #f1b100;padding-bottom:8px;">Rólunk</h2>
                  <div style="margin-bottom:30px;line-height:1.6;">
                    <p style="color:#f8f8f8;">Idén <strong>Madai István Richárd</strong>, <strong>12/C</strong> osztályos tanuló képviseli iskolánkat, a <a href="https://taszi.hu" target="_blank" style="color:#f1b100;text-decoration:none;"><strong>BSZC Trefort Ágoston Technikum, Szakközépiskola és Kollégium</strong></a>ot.</p>
                    <p style="color:#f8f8f8;">Stábunk, a <strong>FinalDeal</strong> egy <i>energikus, összehangolt, precíz</i> csapat. <strong>Teljes erőfeszítéssel</strong> dolgozunk, hogy idén megszerezzük az <strong>1. helyet</strong> és ezáltal adjunk Békéscsabának egy <strong>Trefortos diákpolgármestert</strong>!</p>
                    <p>Kampánycéljaink között egy <strong>városi közösségi tér</strong> létrhozása is szerepel, mivel <strong>hisszük</strong>, hogy a diákoknak az iskolai elfoglaltságok mellett fontos a minőségi <strong>kikapcsolódás</strong> és <strong>közösségépítés</strong>.</p>  
                    <p style="color:#f8f8f8;">Ehhez kapcsolódik stábunk idei témavilága amely a <strong>kaszinók</strong> fényes színvilágát és életteli megjelenését idézi, mellyel reményeink szerint egy nagyon emlékezetes kampányt hozunk létre. Bővebben a <a href="https://finaldeal.hu/rolunk" style="font-size:1.1em;font-weight:bold;color:#ffe44d;text-decoration:none;">Weboldalon</a></p>
                  </div>

                  <h2 style="color:#f1b100;text-align:center;font-family:Arial,sans-serif;margin-top:40px;border-bottom:2px solid #f1b100;padding-bottom:8px;">Támogatásuk esetén az alábbiakat biztosítjuk</h2>
                  <div style="margin-bottom:30px;line-height:1.6;">
                    <ul style="color:#f8f8f8;padding-left:20px;">
                      <li><strong>Fizikai hirdetési</strong> lehetőségek a rendezvény helyszínén <i>(plakát, molinó, installációk)</i></li>
                      <li>Nagyobb összegű támogatás esetén logóelhelyezés a csapat <strong>pólóján</strong></li>
                      <li><strong>Online megjelenés</strong> Instagram és TikTok felületeinken</li>
                    </ul>
                  </div>

                  <h2 style="color:#f1b100;text-align:center;font-family:Arial,sans-serif;margin-top:40px;border-bottom:2px solid #f1b100;padding-bottom:8px;">Kérjük támogassanak minket</h2>
                  <div style="margin-bottom:30px;line-height:1.6;">
                   ${sponsortype}
                  </div>

                  <h2 style="color:#f1b100;text-align:center;font-family:Arial,sans-serif;margin-top:40px;border-bottom:2px solid #f1b100;padding-bottom:8px;">Miért szponzoráljanak minket?</h2>
                  <div style="margin-bottom:30px;line-height:1.6;">
                    <p style="color:#f8f8f8;">A rendezvény <strong>több ezer</strong> fiatalt és családot ér el. Támogatásukkal nemcsak a mi sikerünkhöz járulnak hozzá, hanem egy pozitív, modern <strong>vállalati képet</strong> is erősítenek a fiatal generáció szemében.</p>
                  </div>

                  <div style="display:flex;justify-content:space-around;align-items:center;gap:30px;margin:30px 0;">
                    <a href="https://bszc.hu" target="_blank"><img src="https://garabonciasnapok.hu/wp-content/uploads/2022/08/bekescsabai-szakkepzesi-centrum-470x177.png" alt="BSZC logó" style="max-height:70px;background:#1a0609;padding:10px;border-radius:10px;"/></a>
                   <a href="https://bekescsaba.hu"  target="_blank"><img src="https://garabonciasnapok.hu/wp-content/uploads/2022/08/bekescsaba-470x418.jpg" alt="Békéscsaba címer" style="max-height:70px;background:#1a0609;padding:10px;border-radius:10px;"/></a>
                   <!-- SVG logo left as is, Gmail will ignore most SVG styling -->
                  </div>

                  <div style="margin-top:50px;font-size:0.95em;border-top:1px solid #f1b100;padding-top:20px;">
                    <p style="color:#f8f8f8;"><strong>Kapcsolatfelvétel</strong></p>
                    <div style="margin-top:15px;">
                      <p style="color:#f8f8f8;"><strong><i>Kérjük a választ ugyanerre az email címre címezzék!</i></strong></p>
                      <p><a href="mailto:trefortstab@gmail.com" style="color:#f1b100;text-decoration:none;">trefortstab@gmail.com</a></p>
                    </div>
                    <div style="margin-top:15px;">
                      <p style="color:#f8f8f8;"><strong>Madai István Richárd</strong> - jelölt<br>
                        📞 +36 30 622 9608<br>
                        📧 <a href="mailto:madai-istvan-richard@finaldeal.hu" style="color:#f1b100;text-decoration:none;">madai-istvan-richard@finaldeal.hu</a></p>

                      <p style="color:#f8f8f8;"><strong>Varga Máté</strong> - kampányfőnök<br>
                        📞 +36 30 844 9812<br>
                        📧 <a href="mailto:vargamate@finaldeal.hu" style="color:#f1b100;text-decoration:none;">vargamate@finaldeal.hu</a></p>
                    </div>

                    <div style="margin-top:30px;text-align:center;">
                      <p style="color:#f8f8f8;">Köszönjük, hogy időt szánt levelünk elolvasására!</p>
                      <p style="color:#f8f8f8;font-size:1.1em;font-weight:bold;">Üdvözlettel,<br>
                      a FinalDeal csapata 🎲</p>
                    </div>
                  </div>
                </div>
              </body>
              </html>
              `,
            text: `Tisztelt ${s.name}!
              Szeretnénk megkeresni Önöket szponzori együttműködés céljából a 2025. szeptember 28. és október 3. között megrendezésre kerülő Békéscsabai Garabonciás Napok kapcsán, amely Magyarország legnagyobb középiskolás fesztiválja.

              A rendezvényen 1992 óta Békéscsaba legnagyobb középiskolái mérettetik meg magukat, melyen közel ezer diák vesz részt a város több pontján szervezett kulturális és szórakoztató programokon.

              Rólunk
              Idén Madai István Richárd, 12/C osztályos tanuló képviseli iskolánkat, a BSZC Trefort Ágoston Technikum, Szakközépiskola és Kollégiumot.

              Stábunk, a FinalDeal egy energikus, összehangolt, precíz csapat. Teljes erőfeszítéssel dolgozunk, hogy idén megszerezzük az 1. helyet és ezáltal adjunk Békéscsabának egy Trefortos diákpolgármestert!

              Kampánycéljaink között egy városi közösségi tér létrhozása is szerepel, mivel hisszük, hogy a diákoknak az iskolai elfoglaltságok mellett fontos a minőségi kikapcsolódás és közösségépítés.

              Ehhez kapcsolódik stábunk idei témavilága amely a kaszinók fényes színvilágát és életteli megjelenését idézi, mellyel reményeink szerint egy nagyon emlékezetes kampányt hozunk létre. Bővebben a Weboldalon

              Támogatásuk esetén az alábbiakat biztosítjuk
              Fizikai hirdetési lehetőségek a rendezvény helyszínén (plakát, molinó, installációk)
              Nagyobb összegű támogatás esetén logóelhelyezés a csapat pólóján
              Online megjelenés Instagram és TikTok felületeinken
              Kérjük támogassanak minket
              ${sponsortypePlainText}
              Miért szponzoráljanak minket?
              A rendezvény több ezer fiatalt és családot ér el. Támogatásukkal nemcsak a mi sikerünkhöz járulnak hozzá, hanem egy pozitív, modern vállalati képet is erősítenek a fiatal generáció szemében.

              Kapcsolatfelvétel

              Kérjük a választ ugyanerre az email címre címezzék!

              trefortstab@gmail.com

              Madai István Richárd - jelölt
              📞 +36 30 622 9608
              📧 madai-istvan-richard@finaldeal.hu

              Varga Máté - kampányfőnök
              📞 +36 30 844 9812
              📧 vargamate@finaldeal.hu

              Köszönjük, hogy időt szánt levelünk elolvasására!

              Üdvözlettel,
              a FinalDeal csapata 🎲`,
      }
    })
  )

  const batchSize = 10
  const delayMs = 60000 // 60 sec

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)

    await Promise.all(
      batch.map(async (emailData) => {
        try {
          await transporter.sendMail({
            from: 'FinalDeal | Trefort <trefortstab@gmail.com>',
            to: emailData.email,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
          })

          await prisma.szponzorok.update({
            where: { id: emailData.id },
            data: { sentFirstLetter: true,
                    status: '⏳'
                  },
          })
          console.log('ELKÜLDVE: ', emailData.to)

        } catch (error: any) {
          console.error('500,', error);
          
        }
      })
    )

    if (i + batchSize < emails.length) await wait(delayMs)
  }

  return {
    message: `Elküldve: ${emails.length} levél.`,
  }
})
