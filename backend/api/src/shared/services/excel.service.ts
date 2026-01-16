import { Workbook } from 'exceljs';

type ExcelTable = {
  title: string;
  columns: string[];
  rows: (string | number | null)[][];
};

export class ExcelService {
  static async generate(table: ExcelTable): Promise<Buffer> {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet(table.title);

    sheet.addRow(table.columns);

    table.rows.forEach(row => {
      sheet.addRow(row);
    });

    sheet.columns.forEach(col => {
      col.width = 30;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
