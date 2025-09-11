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
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (response) {
      const data = await p.polorendeles.findMany({});
      if (!data || data.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'No sponsors found',
        });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Pólórendelés');  
      worksheet.columns = [
        { header: 'Sorszám', key: 'sorszam', alignment: { horizontal: 'center' } },
        { header: 'Méret', key: 'size' },
        { header: 'Felirat', key: 'felirat' },
      ];

      // Add data rows
      let sorszam = 1
      data.forEach((entry) => {
        worksheet.addRow({
          sorszam: sorszam,
          size: entry.size,
          felirat: entry.felirat
        });
        sorszam +=1
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



      const buffer = await workbook.xlsx.writeBuffer();
      event.node.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      event.node.res.setHeader('Content-Disposition', 'attachment; filename="polorendeles.xlsx"');
      event.node.res.end(buffer);

      return;

    }



  } catch (e: any) {
  console.error('Error in polorendeles post handler:', e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: e
    });
  }

})


