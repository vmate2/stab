import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const sponsors = body.sponsors;

  try {
    // Delete all existing rows
    await prisma.szponzorok.deleteMany();

    // Insert new data
    const insertData = sponsors.map((sponsor: any) => ({
      contact: sponsor.contact,
      desc: sponsor.desc,
      email: sponsor.email,
      id: sponsor.id,
      name: sponsor.name,
      phone: sponsor.phone ? String(sponsor.phone) : null,
      status: sponsor.status,
    }));

    await prisma.szponzorok.createMany({
      data: insertData,
    });

    return { status: 'success', message: 'Data inserted successfully' };
  } catch (error) {
    console.error('Error inserting data:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
