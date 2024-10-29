import { defineEventHandler, readBody, sendError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (body.key === await constructKey()) {
    return await jelentkezesDbUpload(body.data);
  } else {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message: 'Authentication required. Please provide a valid token.'
      }
    }));
  }

});


async function jelentkezesDbUpload(data: any) {
  console.log(data)
  const db = hubDatabase();
  try {
    const stmt = db.prepare('INSERT INTO jelentkezok (name, email, phone, school, raer, bemutatkozas, ip, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    await stmt.bind(data.name, data.email, data.phone, data.school, data.raer, data.personaldesc, data.ip, data.date).run();

    return { code: 200, data: 'inserted successfully' };
  } catch (error) {
    console.error('Error inserting data:', error);
    throw new Error('Database insert failed');
  }
}
const constructKey = async () => {
  const date = new Date();
  const formattedDate = date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).replace(',', '');
  return await getHashedDate(formattedDate);
}

async function getHashedDate(formattedDate:string) {
  return sha256(formattedDate).then(hash => {
    return hash;
  });
}

async function sha256(message:string) {
  const msgBuffer = new TextEncoder().encode(message);

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}




