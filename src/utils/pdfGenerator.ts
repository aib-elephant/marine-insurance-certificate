import { jsPDF } from 'jspdf';
import { CERTIFICATE_CLAUSES } from '../data/certificateDefaults';
import { MarineCertificateData } from '../types/certificate';
import { formatCertificateDate, formatIndianNumber } from './csvHelpers';

async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawSignatureVector(doc: jsPDF, originX: number, originY: number, scale = 0.14) {
  // Exact vector path matching public/assets/indusind-signature.svg (viewBox 200x120)
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.38);
  doc.setLineCap('round');
  doc.setLineJoin('round');

  const pt = (x: number, y: number): [number, number] => [
    originX + x * scale,
    originY + y * scale,
  ];

  // Tall 'A' leg + loop + right sweep
  const stroke1: [number, number][] = [
    pt(43, 114),
    pt(28, 22),
    pt(70, 101),
    pt(58, 95),
    pt(42, 90),
    pt(27, 89),
    pt(44, 85),
    pt(58, 78),
    pt(69, 73),
    pt(72, 74),
    pt(73, 89),
    pt(76, 93),
    pt(85, 84),
    pt(103, 62),
    pt(134, 29),
  ];

  for (let i = 0; i < stroke1.length - 1; i++) {
    doc.line(stroke1[i][0], stroke1[i][1], stroke1[i + 1][0], stroke1[i + 1][1]);
  }

  // Upper diagonal cross-stroke
  const [sx1, sy1] = pt(101, 32);
  const [sx2, sy2] = pt(182, 13);
  doc.line(sx1, sy1, sx2, sy2);
}

export async function generateCertificatePdf(
  data: MarineCertificateData,
  options: { includeFullClauses?: boolean } = {}
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const left = 8;
  const width = 194;
  const pageHeight = 297;
  const bottomLimit = pageHeight - 12;

  // Column widths summing to 194mm
  const c1 = 42;
  const c2 = 48;
  const c3 = 46;
  const c4 = 29;
  const c5 = 29;
  const x1 = left;
  const x2 = x1 + c1;
  const x3 = x2 + c2;
  const x4 = x3 + c3;
  const x5 = x4 + c4;

  const setFillBlue = () => doc.setFillColor(217, 234, 247);
  const setFillWhite = () => doc.setFillColor(255, 255, 255);
  const drawBorder = () => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.25);
  };

  const drawCell = (
    x: number,
    y: number,
    w: number,
    h: number,
    opts?: { fill?: boolean }
  ) => {
    drawBorder();
    if (opts?.fill) {
      setFillBlue();
      doc.rect(x, y, w, h, 'FD');
    } else {
      setFillWhite();
      doc.rect(x, y, w, h, 'D');
    }
  };

  const ensureSpace = (currentY: number, needed: number): number => {
    if (currentY + needed > bottomLimit) {
      doc.addPage();
      return 10;
    }
    return currentY;
  };

  let y = 7;

  // 1. Logo + Top Invoice Strip
  const logoDataUrl = await loadImageAsDataUrl('/assets/aistudio/image_cd2c1333.png');
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', left, y, 42, 11.7);
  } else {
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('IndusInd General Insurance', left, y + 7);
  }

  const invoiceStr = [
    data.invoiceNo,
    data.invoiceDate ? formatCertificateDate(data.invoiceDate) : '',
  ]
    .filter(Boolean)
    .join(' / ');

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text(data.runNo ? `Run ${data.runNo}` : '-', x3 + 8, y + 10.5, {
    align: 'center',
  });
  doc.text('Invoice No and Date', x3 + 22, y + 10.5);

  setFillBlue();
  doc.rect(x4 + 6, y + 6.5, c4 + c5 - 6, 5.2, 'F');
  doc.setFont('times', 'normal');
  doc.text(invoiceStr || '', x4 + 6 + (c4 + c5 - 6) / 2, y + 10.3, {
    align: 'center',
  });

  y += 12.5;

  // 2. MARINE INSURANCE CERTIFICATE Banner
  drawCell(left, y, width, 6.2);
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text('MARINE INSURANCE CERTIFICATE', left + width / 2, y + 4.3, {
    align: 'center',
  });
  y += 6.2;

  // 3. Issuing Office Address & Pre-signed Validity
  doc.setFontSize(8);
  const addrText = `${data.insurerName}${
    data.issuingOfficeAddress ? ', ' + data.issuingOfficeAddress : ''
  }`;
  const addrLines = doc.splitTextToSize(addrText, c1 + c2 - 3);
  const row2H = Math.max(13, 5 + addrLines.length * 3.3);
  drawCell(x1, y, c1 + c2, row2H);
  drawCell(x3, y, c3 + c4 + c5, row2H);

  doc.setFont('times', 'bold');
  doc.text('Issuing Office Address:', x1 + 1.5, y + 3.5);
  doc.setFont('times', 'normal');
  doc.text(addrLines, x1 + 1.5, y + 7);

  doc.setFont('times', 'bold');
  doc.text(
    'Since the certificate is pre-signed the same shall be valid only if:',
    x3 + 1.5,
    y + 3.5
  );
  doc.text(
    'a)    Counter signed by the Authorised Signatory of Insured',
    x3 + 1.5,
    y + 7.2
  );
  doc.text(
    'b)    Complies with special conditions of the certificate as mentioned herein.',
    x3 + 1.5,
    y + 10.7
  );
  y += row2H;

  // 4. Policy No / Certificate No. / Date of Issuance / Premium
  const hdrH = 4.6;
  drawCell(x1, y, c1, hdrH);
  drawCell(x2, y, c2, hdrH);
  drawCell(x3, y, c3, hdrH);
  drawCell(x4, y, c4 + c5, hdrH);

  doc.setFont('times', 'bold');
  doc.setFontSize(8);
  doc.text('Policy No', x1 + c1 / 2, y + 3.2, { align: 'center' });
  doc.text('Certificate No.', x2 + c2 / 2, y + 3.2, { align: 'center' });
  doc.text('Date of Issuance', x3 + c3 / 2, y + 3.2, { align: 'center' });
  doc.text('Premium', x4 + (c4 + c5) / 2, y + 3.2, { align: 'center' });
  y += hdrH;

  const premRowH = 3.8;
  const premTotalH = premRowH * 5;
  drawCell(x1, y, c1, premTotalH);
  drawCell(x2, y, c2, premTotalH, { fill: true });
  drawCell(x3, y, c3, premTotalH);
  drawCell(x4, y, c4 + c5, premTotalH);

  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.text(data.policyNo || '', x1 + c1 / 2, y + 8, { align: 'center' });
  if (data.policyStartDate || data.policyEndDate) {
    doc.setFontSize(6.8);
    doc.text(
      `(${formatCertificateDate(data.policyStartDate)} to ${formatCertificateDate(
        data.policyEndDate
      )})`,
      x1 + c1 / 2,
      y + 12,
      { align: 'center' }
    );
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.text(data.certificateNo || '', x2 + c2 / 2, y + 10, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.text(formatCertificateDate(data.dateOfIssuance), x3 + c3 / 2, y + 8, {
    align: 'center',
  });
  if (data.policyRate) {
    doc.setFontSize(6.8);
    doc.text(`Rate: ${data.policyRate}`, x3 + c3 / 2, y + 12, {
      align: 'center',
    });
  }

  const premItems = [
    ['Marine', data.premiumMarine || 'As per Policy'],
    ['Other Extras', data.premiumOtherExtras || 'As per Policy'],
    ['War & SRCC', data.premiumWarSrcc || 'As per Policy'],
    ['GST', data.premiumGst || 'As per Policy'],
    ['Total', data.premiumTotal || 'As per Policy'],
  ];
  premItems.forEach(([lbl, val], idx) => {
    const py = y + idx * premRowH;
    drawCell(x4, py, c4, premRowH);
    drawCell(x5, py, c5, premRowH);
    doc.setFont('times', idx === 4 ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.text(lbl, x4 + 1.2, py + 2.7);
    doc.text(val, x5 + c5 - 1.2, py + 2.7, { align: 'right' });
  });
  y += premTotalH;

  // 5. W. K. Webster Intro
  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  const websterIntro = doc.splitTextToSize(
    'In the event of loss or damage which may involve this certificate, immediate notice of loss or damage should be given to the company or to W. K. Webster at one of the following addresses:',
    width - 3
  );
  const introH = 2.5 + websterIntro.length * 3.1;
  drawCell(left, y, width, introH);
  doc.text(websterIntro, left + 1.5, y + 3.2);
  y += introH;

  // 6. W. K. Webster Table
  const wCol1 = 28;
  const wCol2 = 54;
  const wCol3 = 56;
  const wCol4 = width - wCol1 - wCol2 - wCol3;
  const wx1 = left;
  const wx2 = wx1 + wCol1;
  const wx3 = wx2 + wCol2;
  const wx4 = wx3 + wCol3;

  const wRows: [string, string, string, string, boolean?][] = [
    [
      'AREA',
      data.surveyAgents[0]?.region || 'America',
      data.surveyAgents[1]?.region || 'Europe, Africa & Middle East',
      data.surveyAgents[2]?.region || 'Asia - Far East',
      true,
    ],
    [
      'EMAIL :',
      data.surveyAgents[0]?.email || '',
      data.surveyAgents[1]?.email || '',
      data.surveyAgents[2]?.email || '',
    ],
    [
      'PH. NOS :',
      data.surveyAgents[0]?.phone || '',
      data.surveyAgents[1]?.phone || '',
      data.surveyAgents[2]?.phone || '',
    ],
    [
      'AFTER HOURS :',
      data.surveyAgents[0]?.afterHours || '',
      data.surveyAgents[1]?.afterHours || '',
      data.surveyAgents[2]?.afterHours || '',
    ],
    [
      'FAX NOS :',
      data.surveyAgents[0]?.fax || '',
      data.surveyAgents[1]?.fax || '',
      data.surveyAgents[2]?.fax || '',
    ],
  ];

  wRows.forEach(([k, a1, a2, a3, bold]) => {
    const rh = 3.6;
    drawBorder();
    doc.line(wx1, y, wx1, y + rh);
    doc.line(wx2, y, wx2, y + rh);
    doc.line(wx3, y, wx3, y + rh);
    doc.line(wx4, y, wx4, y + rh);
    doc.line(left + width, y, left + width, y + rh);
    doc.setFont('times', bold ? 'bold' : 'normal');
    doc.setFontSize(7.2);
    doc.text(k, wx1 + 1.2, y + 2.6);
    doc.text(a1, wx2 + 1.2, y + 2.6);
    doc.text(a2, wx3 + 1.2, y + 2.6);
    doc.text(a3, wx4 + 1.2, y + 2.6);
    y += rh;
  });

  // Address row
  const addrBoxH = 10.5;
  drawBorder();
  doc.rect(wx1, y, wCol1, addrBoxH, 'D');
  doc.rect(wx2, y, wCol2, addrBoxH, 'D');
  doc.rect(wx3, y, wCol3, addrBoxH, 'D');
  doc.rect(wx4, y, wCol4, addrBoxH, 'D');
  doc.setFont('times', 'normal');
  doc.setFontSize(7.1);
  doc.text('ADDRESS :', wx1 + 1.2, y + 2.8);

  [data.surveyAgents[0], data.surveyAgents[1], data.surveyAgents[2]].forEach(
    (ag, idx) => {
      if (!ag) return;
      const ax = [wx2, wx3, wx4][idx] + 1.2;
      const lines = [ag.companyName, ...ag.addressLines];
      lines.slice(0, 3).forEach((ln, li) => {
        doc.text(ln, ax, y + 2.8 + li * 3.1);
      });
    }
  );
  y += addrBoxH;

  // 7. Local Claims Notice & Claims Payable By
  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  const localLines = doc.splitTextToSize(
    `In the event of loss or damage which may involve this certificate, immediate notice of loss or damage should be given to the company at the following address: ${data.localClaimsNoticeAddress}`,
    width - 3
  );
  const localH = 2.5 + localLines.length * 3.1;
  drawCell(left, y, width, localH);
  doc.text(localLines, left + 1.5, y + 3.2);
  y += localH;

  const payH = 4.6;
  drawCell(left, y, width, payH);
  doc.text(`Claims payable by : ${data.claimsPayableBy}`, left + 1.5, y + 3.2);
  y += payH;

  // 8. CTD/BL/AWB/GR/RR No & Date
  const docRowH = 4.8;
  drawCell(x1, y, c1, docRowH);
  drawCell(x2, y, c2 + c3, docRowH, { fill: true });
  drawCell(x4, y, c4, docRowH);
  drawCell(x5, y, c5, docRowH, { fill: true });

  doc.setFont('times', 'bold');
  doc.setFontSize(7.8);
  doc.text('CTD/BL/AWB/GR/RR No :', x1 + 1.2, y + 3.3);
  doc.text('Date :', x4 + c4 / 2, y + 3.3, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.text(data.transportDocNo || '', x2 + (c2 + c3) / 2, y + 3.3, {
    align: 'center',
  });
  doc.text(
    data.transportDocDate ? formatCertificateDate(data.transportDocDate) : '',
    x5 + c5 / 2,
    y + 3.3,
    { align: 'center' }
  );
  y += docRowH;

  // 9. Insured & Basis of Valuation
  const insuredDetail = [
    data.insuredName,
    data.insuredSubline,
    data.gstNumber ? `GST Number: ${data.gstNumber}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  const insLines = doc.splitTextToSize(insuredDetail || ' ', c2 + c3 - 3);
  const insH = Math.max(8, 3 + insLines.length * 3.3);
  drawCell(x1, y, c1, insH);
  drawCell(x2, y, c2 + c3, insH);
  drawCell(x4, y, c4 + c5, insH);

  doc.setFont('times', 'bold');
  doc.setFontSize(8);
  doc.text('Insured', x1 + 1.2, y + 4.5);
  doc.setFont('times', 'normal');
  doc.text(insLines, x2 + 1.5, y + 3.6);
  doc.setFont('times', 'bold');
  doc.text('Basis of Valuation :', x4 + 1.5, y + 3.8);
  doc.setFont('times', 'normal');
  const bovLines = doc.splitTextToSize(
    data.basisOfValuation || '',
    c4 + c5 - 3
  );
  doc.text(bovLines, x4 + 1.5, y + 7.2);
  y += insH;

  // 10. Insured Address
  const insAddrLines = doc.splitTextToSize(
    data.insuredAddress || ' ',
    c2 + c3 + c4 + c5 - 3
  );
  const insAddrH = Math.max(6, 2.5 + insAddrLines.length * 3.2);
  drawCell(x1, y, c1, insAddrH);
  drawCell(x2, y, c2 + c3 + c4 + c5, insAddrH);
  doc.setFont('times', 'bold');
  doc.text('Address:', x1 + 1.2, y + 3.6);
  doc.setFont('times', 'normal');
  doc.text(insAddrLines, x2 + 1.5, y + 3.6);
  y += insAddrH;

  // 11. Insured Value / Ports / Transit Type / Mode of Transport
  const vSubH = 4.4;
  drawCell(x1, y, c1, vSubH);
  drawCell(x2, y, c2, vSubH);
  drawCell(x3, y, c3, vSubH);
  drawCell(x4, y, c4 + c5, vSubH);

  doc.setFont('times', 'bold');
  doc.setFontSize(7.8);
  doc.text('Insured Value ( INR )', x1 + 1.2, y + 3.1);
  doc.text('Port of Loading', x2 + 1.2, y + 3.1);
  doc.text('Port of Discharge', x3 + 1.2, y + 3.1);
  doc.text('Transit Type', x4 + 1.2, y + 3.1);
  y += vSubH;

  const vBodyH = vSubH * 3;
  drawCell(x2, y, c2, vBodyH, { fill: true });
  drawCell(x3, y, c3, vBodyH, { fill: true });

  drawCell(x1, y, c1, vSubH);
  drawCell(x1, y + vSubH, c1, vSubH);
  drawCell(x1, y + vSubH * 2, c1, vSubH);

  drawCell(x4, y, c4 + c5, vSubH, { fill: true });
  drawCell(x4, y + vSubH, c4 + c5, vSubH);
  drawCell(x4, y + vSubH * 2, c4 + c5, vSubH, { fill: true });

  doc.setFont('times', 'normal');
  doc.text(
    data.insuredValueInr ? formatIndianNumber(data.insuredValueInr) : '',
    x1 + c1 / 2,
    y + 3.1,
    { align: 'center' }
  );
  doc.setFont('times', 'bold');
  doc.text('Insured Value ( 1)', x1 + 1.2, y + vSubH + 3.1);
  doc.setFont('times', 'normal');
  doc.text(
    data.secondaryInsuredValue || data.insuredValueInr
      ? formatIndianNumber(data.secondaryInsuredValue || data.insuredValueInr)
      : '',
    x1 + c1 / 2,
    y + vSubH * 2 + 3.1,
    { align: 'center' }
  );

  doc.text(data.portOfLoading || '', x2 + c2 / 2, y + vBodyH / 2 + 1, {
    align: 'center',
  });
  doc.text(data.portOfDischarge || '', x3 + c3 / 2, y + vBodyH / 2 + 1, {
    align: 'center',
  });

  doc.text(data.transitType || '', x4 + (c4 + c5) / 2, y + 3.1, {
    align: 'center',
  });
  doc.setFont('times', 'bold');
  doc.text('Mode of Transport', x4 + 1.2, y + vSubH + 3.1);
  doc.setFont('times', 'normal');
  doc.text(
    data.modeOfTransport || '',
    x4 + (c4 + c5) / 2,
    y + vSubH * 2 + 3.1,
    { align: 'center' }
  );
  y += vBodyH;

  // 12. Voyage From / To / Vessel/Conveyance
  const voyH = 8.4;
  drawCell(x1, y, c1, voyH);
  drawCell(x2, y, c2, voyH, { fill: true });
  drawCell(x3, y, c3, voyH);
  drawCell(x4, y, c4 + c5, voyH / 2);
  drawCell(x4, y + voyH / 2, c4 + c5, voyH / 2, { fill: true });

  doc.setFont('times', 'bold');
  doc.text('Voyage From:', x1 + 1.2, y + 5.2);
  doc.setFont('times', 'normal');
  doc.text(data.voyageFrom || '', x2 + c2 / 2, y + 5.2, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.text('To:', x3 + 1.5, y + 5.2);
  setFillBlue();
  doc.rect(x3 + 9, y + 1.2, c3 - 11, voyH - 2.4, 'F');
  doc.setFont('times', 'normal');
  doc.text(data.voyageTo || '', x3 + 9 + (c3 - 11) / 2, y + 5.2, {
    align: 'center',
  });

  doc.setFont('times', 'bold');
  doc.text('Vessel/Conveyance', x4 + 1.2, y + 3);
  doc.setFont('times', 'normal');
  doc.text(data.vesselConveyance || '', x4 + (c4 + c5) / 2, y + voyH / 2 + 3, {
    align: 'center',
  });
  y += voyH;

  // 13. Consignor / Consignee
  const conLines1 = doc.splitTextToSize(data.consignorConsigneeName || ' ', c2 - 3);
  const conLines2 = doc.splitTextToSize(
    data.consignorConsigneeAddress || ' ',
    c4 + c5 - 3
  );
  const conH = Math.max(8, 3 + Math.max(conLines1.length, conLines2.length) * 3.2);
  drawCell(x1, y, c1, conH);
  drawCell(x2, y, c2, conH, { fill: true });
  drawCell(x3, y, c3, conH);
  drawCell(x4, y, c4 + c5, conH, { fill: true });

  doc.setFont('times', 'bold');
  doc.text('Consignor / Consignee Name:', x1 + 1.2, y + 3.8);
  doc.text('Consignor / Consignee Address', x3 + 1.2, y + 3.8);
  doc.setFont('times', 'normal');
  doc.text(conLines1, x2 + c2 / 2, y + 4.5, { align: 'center' });
  doc.text(conLines2, x4 + (c4 + c5) / 2, y + 4.5, { align: 'center' });
  y += conH;

  // 14. Cargo Schedule Table
  const cargoHdrH = 7;
  drawCell(x1, y, c1, cargoHdrH);
  drawCell(x3, y, c3, cargoHdrH);
  drawCell(x4, y, c4, cargoHdrH);
  drawCell(x5, y, c5, cargoHdrH);

  doc.setFont('times', 'bold');
  doc.text('Description of Goods', x1 + 1.2, y + 3.4);
  doc.text('Marks & Nos/', x3 + 1.2, y + 3.2);
  doc.text('Container No', x3 + 1.2, y + 6.1);
  doc.text('No & Kind of Pkgs.', x4 + 1.2, y + 3.4);
  doc.text('Commodity', x5 + 1.2, y + 3.4);

  const descLines = doc.splitTextToSize(data.descriptionOfGoods || ' ', c2 - 3);
  const commLines = doc.splitTextToSize(data.commodity || ' ', c5 - 3);
  const cargoBodyH = Math.max(
    22,
    4 + Math.max(descLines.length, commLines.length) * 3.1
  );

  drawCell(x2, y, c2, cargoHdrH + cargoBodyH, { fill: true });
  drawCell(x1, y + cargoHdrH, c1, cargoBodyH);
  drawCell(x3, y + cargoHdrH, c3, cargoBodyH, { fill: true });
  drawCell(x4, y + cargoHdrH, c4, cargoBodyH, { fill: true });
  drawCell(x5, y + cargoHdrH, c5, cargoBodyH);

  doc.setFont('times', 'normal');
  doc.setFontSize(7.6);
  doc.text(descLines, x2 + 1.5, y + 4.5);
  doc.text(data.marksAndNos || '', x3 + c3 / 2, y + cargoHdrH + cargoBodyH / 2, {
    align: 'center',
  });
  doc.text(
    data.noAndKindOfPkgs || '',
    x4 + c4 / 2,
    y + cargoHdrH + cargoBodyH / 2,
    { align: 'center' }
  );
  doc.setFontSize(7.2);
  doc.text(commLines, x5 + 1.2, y + cargoHdrH + 3.2);

  doc.setFont('times', 'bold');
  doc.setFontSize(7.4);
  doc.text(
    'Subject to Applicable Clauses mentioned below :',
    x1 + 1.2,
    y + cargoHdrH + cargoBodyH - 1.5
  );
  y += cargoHdrH + cargoBodyH;

  // 15. Clauses Text Block
  const activeClauses = CERTIFICATE_CLAUSES.filter((c) =>
    data.includedClauseIds.includes(c.id)
  );
  const clauseParagraph = [
    activeClauses
      .map((c) => (options.includeFullClauses ? c.fullText : c.title))
      .join(' · '),
    data.customEndorsements.trim()
      ? `Special Endorsements: ${data.customEndorsements.trim()}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  doc.setFont('times', 'normal');
  doc.setFontSize(6.9);
  const clauseLines = doc.splitTextToSize(clauseParagraph || 'As per Open Policy', width - 3);
  const clauseBoxH = Math.max(18, 3 + clauseLines.length * 2.65);

  y = ensureSpace(y, clauseBoxH + 35);
  drawCell(left, y, width, clauseBoxH);
  doc.text(clauseLines, left + 1.5, y + 3);
  y += clauseBoxH;

  // 16. LC Condition
  const lcH = 5.2;
  y = ensureSpace(y, lcH + 32);
  drawCell(x1, y, c1, lcH);
  drawCell(x2, y, width - c1, lcH, { fill: true });
  doc.setFont('times', 'bold');
  doc.setFontSize(7.8);
  doc.text('LC Condition :', x1 + 1.2, y + 3.6);
  doc.setFont('times', 'normal');
  doc.text(data.lcCondition || '', x2 + (width - c1) / 2, y + 3.6, {
    align: 'center',
  });
  y += lcH;

  // 17. Cheque realization
  const chqH = 5.2;
  drawCell(left, y, width, chqH);
  doc.setFont('times', 'bold');
  doc.setFontSize(8);
  doc.text(data.chequeRealizationNotice, left + width / 2, y + 3.6, {
    align: 'center',
  });
  y += chqH;

  // 18. Certification paragraph
  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  const declLines = doc.splitTextToSize(data.declarationText, width - 3);
  const declH = 2.5 + declLines.length * 3.1;
  drawCell(left, y, width, declH);
  doc.text(declLines, left + 1.5, y + 3.2);
  y += declH;

  // 19. Signatories
  const sigH = 22;
  y = ensureSpace(y, sigH + 6);
  drawCell(left, y, width, sigH);

  doc.setFont('times', 'bold');
  doc.setFontSize(8);
  const leftSigLabel = data.insuredSignatoryLabel.trim()
    ? data.insuredSignatoryLabel
    : data.insuredName.trim()
    ? `For ${data.insuredName}`
    : 'For Insured';
  const rightSigLabel = data.insurerSignatoryLabel.trim()
    ? data.insurerSignatoryLabel
    : 'For Indusind General Insurance Co Ltd';

  doc.text(leftSigLabel, left + 1.5, y + 4);
  doc.text('Authorised Signatory', left + 1.5, y + 14.5);
  if (data.insuredCounterSignDate) {
    doc.setFont('times', 'normal');
    doc.text(
      formatCertificateDate(data.insuredCounterSignDate),
      left + 1.5,
      y + 19.5
    );
  }

  doc.setFont('times', 'bold');
  doc.text(rightSigLabel, left + width - 1.5, y + 4, { align: 'right' });
  drawSignatureVector(doc, left + width - 38, y + 5, 0.13);
  doc.text('Authorised Signatory', left + width - 6, y + 14.5, {
    align: 'right',
  });
  y += sigH;

  // 20. Bottom Stamp Duty Note
  doc.setFont('times', 'bold');
  doc.setFontSize(7.5);
  doc.text(
    'Note : -Consolidated Stamp Duty is paid on the Open Policy',
    left,
    y + 4
  );

  const fileName = `MARINE_CERTIFICATE_${data.certificateNo || 'DRAFT'}.pdf`;
  doc.save(fileName);
}
