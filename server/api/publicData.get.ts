import { PrismaClient } from "@prisma/client"
const p = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    interface returnData {
      expense: number
      income: number
      sponsorCount: number
      stabtagCount: number
    }
    const stabcash = await p.stabcash.findMany({
      select: {
        income: true,
        expense: true
      }
    });
    const stabtagCount = await p.stabtagok.count();
    const sponsorCount = await p.szponzorok.count({
      where: {
        status: '✔️'
      }
    })


    // Konvertáljuk a BigInt mezőket stringgé
    const safeResult = convertBigIntToString(stabcash);
    console.log('NEW object: ', safeResult);

    const data:returnData = {
      expense: safeResult[0].expense,
      income: safeResult[0].income,
      stabtagCount: stabtagCount,
      sponsorCount: sponsorCount
      
    }
    console.log(data);
    
    return data;
    
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Szerver hiba!' })
  }
})

function convertBigIntToString(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "bigint") {
        newObj[key] = value.toString();
      } else {
        newObj[key] = convertBigIntToString(value);
      }
    }


    
    return newObj;


  }
  return obj;
}
