import puppeteer from 'puppeteer';

export class PdfService {
  static async generate(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '30px',
        bottom: '30px',
        left: '30px',
        right: '30px',
      },
    });

    await browser.close();

    return Buffer.from(pdfUint8Array);
  }
}
