import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';

interface TableQRCodeProps {
  tableId: number;
  tableLabel: string;
  floor: string | number;
  section?: string;
}

export function TableQRCode({
  tableId,
  tableLabel,
  floor,
  section,
}: TableQRCodeProps): JSX.Element {
  const qrRef = useRef<HTMLDivElement>(null);

  const qrData = JSON.stringify({
    restaurantId: 'RESTO-001',
    tableId,
    tableNumber: tableLabel,
    floor,
    section,
    type: 'dine_in',
    source: 'table_qr',
    version: '1.0',
    orderingUrl: `/customer/menu?tableId=${tableId}`,
  });

  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector('svg');

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;

      ctx?.drawImage(img, 0, 0, 600, 600);

      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');

      downloadLink.download = `${tableLabel}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src =
      'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef}>
        <QRCodeSVG
          value={qrData}
          size={80}
          level="H"
          includeMargin
        />
      </div>

      <span className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
        {tableLabel}
      </span>

      <button
        type="button"
        onClick={downloadQRCode}
        className="mt-2 flex items-center gap-1 rounded-lg bg-orange-500 px-2 py-1 text-[10px] font-medium text-white hover:bg-orange-600 transition-colors"
      >
        <Download className="h-3 w-3" />
        Download QR
      </button>
    </div>
  );
}