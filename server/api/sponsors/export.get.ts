import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
import ExcelJS from 'exceljs';


export default defineEventHandler(async (event) => {
  
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
      const data = await p.szponzorok.findMany({});
      if (!data || data.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'No sponsors found',
        });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Szponzorok');  
      worksheet.columns = [
        { header: 'Cégnév', key: 'name' },
        { header: 'Telefonszám', key: 'phone' },
        { header: 'Email', key: 'email' },
        { header: 'Kapcsolattartó', key: 'contact' },
        { header: 'Folyamat', key: 'status', style: { alignment: { horizontal: 'center' } } },
        { header: 'Weboldal + infók', key: 'desc' },
        { header: 'Típus', key: 'type' }
      ];

      // Add data rows
      data.forEach((entry) => {
        worksheet.addRow({
          name: entry.name,
          phone: entry.phone,
          email: entry.email,
          contact: entry.contact,
          status: entry.status,
          desc: entry.desc,
          type: entry.type
        });
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        let maxLength = 10;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
      });

      // Make header row bold
      worksheet.getRow(1).font = { bold: true };
      worksheet.getCell('E1').alignment = { horizontal: 'left' };

      data.forEach((entry) => {
        worksheet.addRow({
          name: entry.name,
          phone: entry.phone,
          email: entry.email,
          contact: entry.contact,
          status: entry.status,
          desc: entry.desc,
          type: entry.type
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      event.node.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      event.node.res.setHeader('Content-Disposition', 'attachment; filename="szponzorok.xlsx"');
      event.node.res.end(buffer);

      return;

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
