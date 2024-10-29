export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  switch (body.type) {
    case 'checkTimeout':
      if (body.key === await constructKey()) {
        return checkDB(body.data)
      } else {
        return sendError(event, createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
          data: {
            message: 'Authentication required. Please provide a valid token.'
          }
        }));
      }
  
    default:
      break;
  }
})

const checkDB = async (ip: any) => {
  const db = hubDatabase();
  const ipToCheck = ip;
  console.log(ip);
  const query = `SELECT * FROM jelentkezok WHERE ip = ?;`; // Fix query syntax

  const result = await db.prepare(query).bind(ipToCheck).all();

  if (result.results.length > 0) {
    console.log("IP exists in the jelentkezok table:", result.results);
    
    // Get the date from the database
    const dbDate = new Date(result.results[0].date);  // Assuming 'date' column is there
    const currentDate = new Date();

    // Check if the difference is less than or equal to 30 minutes (1800000 milliseconds)
    const timeDiff = currentDate.getTime() - dbDate.getTime();
    
    if (timeDiff <= 30 * 60 * 1000) {
      console.log("Within 30 minutes window.");
      return true;
    } else {
      console.log("More than 30 minutes have passed.");
      return false;
    }

  } else {
    console.log("IP not found.");
    return false;
  }
};



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

  console.log(formattedDate);
  return await getHashedDate(formattedDate);
}

async function getHashedDate(formattedDate:string) {
  return sha256(formattedDate).then(hash => {
    return hash;
  });
}

async function sha256(message:string) {
  // Encode the input message as a Uint8Array
  const msgBuffer = new TextEncoder().encode(message);

  // Hash the message using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // Convert the ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string

  return hashHex;
}