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
    case 'getStabtagokForClient': 
    const data = await getStabtagokForClient(body.data);
    return data;
    case 'addStabtag':
      return await addStabtag(body.data);
    case 'createTransaction': 
    return await createTrans(body.data);
    case 'queryPolorendeles':
      return queryPolorendeles();
    default:
      return true;
  }
})

async function createTrans(data:object) {
  if (!data) {
    return false;
  }
  console.log(data);
  const db = hubDatabase();
  if (data.comment) {
  const query = `INSERT INTO tranzakciok (title, type, category, amount, comment) VALUES (?, ?, ?, ?, ?)`;
  const params = [data.transTitle, data.transType, data.category, data.osszeg, data.comment]
  } else {
  const query = `INSERT INTO tranzakciok (title, type, category, amount) VALUES (?, ?, ?, ?)`;
  const params = [data.transTitle, data.transType, data.category, data.osszeg]
  }


}

const queryPolorendeles= async () => {
  const db = hubDatabase();
  const query = `SELECT * FROM polorendeles`;
  const result = await db.prepare(query).all();
  console.log(result);
  return result;
}

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

async function getStabtagokForClient(data:any) {
  const db = hubDatabase();

}

// Assuming `hubDatabase` is a function that sets up and returns the database connection

export const addStabtag = async (data: any) => {
  // Call the database connection function
  const db = hubDatabase();

  // Extract data from the request body
  const { 
    vnev, 
    knev, 
    dob, 
    stabcash, 
    userid, 
    acclvl, 
    kezeltsponzorok, 
    email, 
    phone, 
    pfp, 
    last_login, 
    bio, 
    school, 
    assigned_tasks, 
    city, 
    attendance,
    last_updated 
  } = data;

  console.log(data)
  const query = `
  INSERT INTO stabtagok (
    vnev, knev, dob, stabcash, userid, acclvl, kezeltsponzorok, email, phone,
    pfp, last_login, bio, school, assigned_tasks, city, attendance, last_updated
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  // Set the parameters to bind to the query
  const params = [
    vnev, knev, dob, stabcash, userid, acclvl, kezeltsponzorok, email, phone,
    pfp, last_login, bio, school, assigned_tasks, city, attendance, last_updated
  ];

  try {
    // Execute the prepared query with the bound parameters
    const result = await db.prepare(query).bind(...params).run();
    
    // Return a successful response
    return { status: 200, body: { message: 'Staff added successfully!' } };
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error inserting staff:', error);
    
    // Return an error response
    return { status: 500, body: { message: 'Error inserting staff' } };
  }
};

type uzenet = {
  id: number;
  from: string;
  time: string;
  title: string;
  text: string;
  voteTitle?: string;
  votechoices?: Array<string>;
  progresses?: Array<number>;
  images?: Array<string>;
};


// Example: Mapping database data to the factory function
function toClient(data: { id:number, from:string, time:string, title:string, text:string, voteTitle?:string, voteChoices:Array<string>, progresses:Array<number>, images?: Array<string>  }): uzenet {
return data;
}

// Example usage:
const dbData = { id: 2, from: 'Varga Máté', time: '2023.02.30', title: 'cim', text: 'hosszu szoveg', voteTitle: 'xd', voteChoices: ['da', 'dd'], progresses: [1, 99]};
const user = toClient(dbData);
//onsole.log(user)