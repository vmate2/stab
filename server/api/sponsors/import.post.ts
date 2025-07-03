import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
import ExcelJS from 'exceljs';


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);
  
  const token:any = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Token is missing',
    });
  }

  try {
    const response = await $fetch('/api/verifyJWT', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (response) {
      console.log('JWT verification successful, starting import...');
      try {
            const form = await readMultipartFormData(event);
            
    const file = form?.find(f => f.name === 'file');
    if (!file) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.data);
    const worksheet = workbook.getWorksheet(1);

    const jsonData: Record<string, any>[] = [];

    if (worksheet) {
      const headerRow = worksheet.getRow(1).values as string[];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header
        const rowData: Record<string, any> = {};
        row.values.slice(1).forEach((cell, idx) => {
          rowData[headerRow[idx + 1]] = cell;
        });
        // Only add if it has a name (Cégnév)
        if (rowData['Cégnév'] && String(rowData['Cégnév']).trim() !== '') {
          jsonData.push(rowData);
        }
      });
    }

    const formattedData = jsonData.map((entry, index) => ({
      id: index + 1,
      name: entry['Cégnév'] ?? '',
      email: (
        typeof entry.Email === 'string'
          ? entry.Email.toLowerCase()
          : typeof entry.Email?.text === 'string'
            ? entry.Email.text.toLowerCase()
            : typeof entry['Email'] === 'string'
              ? entry['Email'].toLowerCase()
              : null
      ),
      phone: entry['Telefonszám']?.toString() ?? null,
      contact: entry['Kapcsolattartó'] ?? null,
      status: entry.Folyamat ?? '',
      desc: entry['Weboldal + infók'],
      type: entry['Típus'] ?? 'money',
    }));
      console.log('formatted JSON data:', formattedData);

      const actionField = form?.find(f => f.name === 'action');
      const action = actionField?.data instanceof Buffer ? actionField.data.toString('utf-8') : 'keep';
      console.log('Action:', action);
      console.log('form data:', form);
      
      

      if (action === 'new') {
        console.log('Deleting existing sponsors...');
        
        await p.szponzorok.deleteMany();
      }

      const result = await p.szponzorok.createMany({
        data: formattedData.map(({ id, ...rest }) => rest),
        skipDuplicates: true,
      });

      console.log('Import successful:', result);
      return { success: true, message: 'Import successful', data: result };

      } catch (error:any) {
        console.error('Error processing file:', error);
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request: Error processing file',
          message: error.message || 'Error processing file'
        });
      }

    }



  } catch (e: any) {
  console.error('Error in sponsors post handler:', e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: e
    });
  }

})
