import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface Table {
  id: number;
  label: string;
  floor: number;
  section: string;
}

export async function downloadAllQRCodes(
  tables: Table[]
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  pdf.setFontSize(18);
  pdf.text('Restaurant Table QR Codes', 15, 15);

  let x = 15;
  let y = 25;

  const cardWidth = 85;
  const cardHeight = 60;
  const qrSize = 35;

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    const qrData = JSON.stringify({
      restaurantId: 'RESTO-001',
      tableId: table.id,
      tableNumber: table.label,
      floor: table.floor,
      section: table.section,
      type: 'dine_in',
      source: 'table_qr',
      version: '1.0',
      orderingUrl: `/customer/menu?tableId=${table.id}`,
    });

    const qrImage = await QRCode.toDataURL(qrData);

    pdf.setDrawColor(220);
    pdf.roundedRect(
      x,
      y,
      cardWidth,
      cardHeight,
      3,
      3
    );

    pdf.setFontSize(14);
    pdf.text(table.label, x + 5, y + 8);

    pdf.setFontSize(10);
    pdf.text(
      `${table.section} • Floor ${table.floor}`,
      x + 5,
      y + 14
    );

    pdf.addImage(
      qrImage,
      'PNG',
      x + 25,
      y + 18,
      qrSize,
      qrSize
    );

    if (i % 2 === 0) {
      x = 110;
    } else {
      x = 15;
      y += 70;
    }

    if (y > 240 && i < tables.length - 1) {
      pdf.addPage();

      pdf.setFontSize(18);
      pdf.text('Restaurant Table QR Codes', 15, 15);

      x = 15;
      y = 25;
    }
  }

  pdf.save('Restaurant-Table-QRCodes.pdf');
}