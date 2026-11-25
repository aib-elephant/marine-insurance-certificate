import { MarineCertificateData } from '../types/certificate';

export function formatIndianNumber(raw: string | number): string {
  const cleaned = String(raw).replace(/[^0-9.]/g, '');
  if (!cleaned) return '0';
  const num = Number(cleaned);
  if (Number.isNaN(num)) return String(raw);
  const [intPart, decPart] = cleaned.split('.');
  const lastThree = intPart.slice(-3);
  const otherNumbers = intPart.slice(0, -3);
  const formattedInt =
    otherNumbers !== ''
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
      : lastThree;
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

export function numberToIndianWords(raw: string | number): string {
  const cleaned = String(raw).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  const num = parseInt(cleaned, 10);
  if (Number.isNaN(num) || num === 0) return 'Zero Only';
  if (num > 9999999999) return '';

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const twoDigits = (n: number): string => {
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]}${n % 10 ? ' ' + ones[n % 10] : ''}`.trim();
  };

  const threeDigits = (n: number): string => {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    return `${h ? ones[h] + ' Hundred' : ''}${h && rem ? ' ' : ''}${rem ? twoDigits(rem) : ''}`.trim();
  };

  let n = num;
  const parts: string[] = [];

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  if (crore) parts.push(`${twoDigits(crore)} Crore`);

  const lakh = Math.floor(n / 100000);
  n %= 100000;
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);

  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);

  if (n > 0) parts.push(threeDigits(n));

  return `INR ${parts.join(' ')} Only`;
}

export function formatCertificateDate(isoDate: string): string {
  if (!isoDate) return '—';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const year = match[1];
  const monthIdx = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  if (monthIdx < 0 || monthIdx > 11) return isoDate;
  return `${day}-${months[monthIdx]}-${year}`;
}

export function parseFlexibleDateToIso(input: string): string {
  const trimmed = input.trim();
  if (!trimmed || trimmed === '0' || trimmed === '0-Jan-1900') return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const months: Record<string, string> = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  };

  const dmy = /^(\d{1,2})[-/\s]([A-Za-z]{3})[-/\s](\d{4})$/.exec(trimmed);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const mon = months[dmy[2].toLowerCase()];
    const year = dmy[3];
    if (mon) return `${year}-${mon}-${day}`;
  }
  return '';
}

function escapeCsvCell(value: string): string {
  const v = value ?? '';
  if (/[",\n\r]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export function exportCertificateToCsv(
  data: MarineCertificateData,
  clausesJoinedText: string
): string {
  const invoiceSummary = [
    data.invoiceNo,
    data.invoiceDate ? formatCertificateDate(data.invoiceDate) : '',
  ]
    .filter(Boolean)
    .join(' · ');

  const rows: string[][] = [
    ['RUN NO', '', data.runNo, '', '', data.transitType],
    ['', '', '1', data.referenceCode, '', data.modeOfTransport],
    ['Policy Start Date', formatCertificateDate(data.policyStartDate), 'Policy End Date', formatCertificateDate(data.policyEndDate), 'Policy rate:', data.policyRate],
    ['GST Number', data.gstNumber, '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '-', 'Invoice No and Date', invoiceSummary || '0', ''],
    ['MARINE INSURANCE CERTIFICATE', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    [
      'Issuing Office Address:',
      '',
      'Since the certificate is pre-signed the same shall be valid only if:',
      '',
      '',
      '',
    ],
    [
      `${data.insurerName}, ${data.issuingOfficeAddress}`,
      '',
      'a) Counter signed by the Authorised Signatory of Insured',
      '',
      '',
      '',
    ],
    [
      '',
      '',
      'b) Complies with special conditions of the certificate as mentioned herein.',
      '',
      '',
      '',
    ],
    ['Policy No', 'Certificate No.', 'Date of Issuance', '', 'Premium', ''],
    ['', '', '', '', 'Marine', data.premiumMarine],
    ['', '', '', '', 'Other Extras', data.premiumOtherExtras],
    [
      data.policyNo,
      data.certificateNo,
      formatCertificateDate(data.dateOfIssuance),
      '',
      'War & SRCC',
      data.premiumWarSrcc,
    ],
    ['', '', '', '', 'GST', data.premiumGst],
    ['', '', '', '', '', ''],
    ['', '', '', '', 'Total', data.premiumTotal],
    [
      'In the event of loss or damage which may involve this certificate, immediate notice of loss or damage should be given to the company or to W. K. Webster at one of the following addresses:',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      'AREA',
      data.surveyAgents[0]?.region || 'America',
      data.surveyAgents[1]?.region || 'Europe, Africa & Middle East',
      '',
      data.surveyAgents[2]?.region || 'Asia - Far East',
      '',
    ],
    [
      'EMAIL :',
      data.surveyAgents[0]?.email || '',
      data.surveyAgents[1]?.email || '',
      '',
      data.surveyAgents[2]?.email || '',
      '',
    ],
    [
      'PH. NOS :',
      data.surveyAgents[0]?.phone || '',
      data.surveyAgents[1]?.phone || '',
      '',
      data.surveyAgents[2]?.phone || '',
      '',
    ],
    [
      'AFTER HOURS :',
      data.surveyAgents[0]?.afterHours || '',
      data.surveyAgents[1]?.afterHours || '',
      '',
      data.surveyAgents[2]?.afterHours || '',
      '',
    ],
    [
      'FAX NOS :',
      data.surveyAgents[0]?.fax || '',
      data.surveyAgents[1]?.fax || '',
      '',
      data.surveyAgents[2]?.fax || '',
      '',
    ],
    [
      'ADDRESS :',
      data.surveyAgents[0]?.companyName || '',
      data.surveyAgents[1]?.companyName || '',
      '',
      data.surveyAgents[2]?.companyName || '',
      '',
    ],
    [
      '',
      data.surveyAgents[0]?.addressLines[0] || '',
      data.surveyAgents[1]?.addressLines[0] || '',
      '',
      data.surveyAgents[2]?.addressLines[0] || '',
      '',
    ],
    [
      '',
      data.surveyAgents[0]?.addressLines[1] || '',
      data.surveyAgents[1]?.addressLines[1] || '',
      '',
      data.surveyAgents[2]?.addressLines[1] || '',
      '',
    ],
    [
      `In the event of loss or damage which may involve this certificate, immediate notice of loss or damage should be given to the company at the following address: ${data.localClaimsNoticeAddress}`,
      '',
      '',
      '',
      '',
      '',
    ],
    [`Claims payable by : ${data.claimsPayableBy}`, '', '', '', '', ''],
    [
      'CTD/BL/AWB/GR/RR No :',
      data.transportDocNo || '0',
      '',
      'Date :',
      data.transportDocDate ? formatCertificateDate(data.transportDocDate) : '',
      '',
    ],
    [
      'Insured',
      data.insuredName,
      '',
      '',
      `Basis of Valuation : ${data.basisOfValuation}`,
      '',
    ],
    ['', data.insuredSubline, '', '', '', ''],
    ['Address:', data.insuredAddress, '', '', '', ''],
    ['Insured Value ( INR )', 'Port of Loading', 'Port of Discharge', '', 'Transit Type', ''],
    [
      formatIndianNumber(data.insuredValueInr),
      data.portOfLoading || '-',
      data.portOfDischarge || '-',
      '',
      data.transitType,
      '',
    ],
    [data.secondaryCurrencyLabel || 'Insured Value ( 1)', '', '', '', 'Mode of Transport', ''],
    [
      formatIndianNumber(data.secondaryInsuredValue || data.insuredValueInr),
      '',
      '',
      '',
      data.modeOfTransport,
      '',
    ],
    ['Voyage From:', data.voyageFrom, 'To:', data.voyageTo, 'Vessel/Conveyance', ''],
    ['', '', '', '', data.vesselConveyance, ''],
    [
      'Consignor / Consignee Name:',
      data.consignorConsigneeName,
      'Consignor / Consignee Address',
      '',
      data.consignorConsigneeAddress,
      '',
    ],
    [
      'Description of Goods',
      data.descriptionOfGoods,
      '',
      'Marks & Nos/ Container No',
      'No & Kind of Pkgs.',
      'Commodity',
    ],
    [
      'Subject to Applicable Clauses mentioned below :',
      '',
      '',
      data.marksAndNos,
      data.noAndKindOfPkgs,
      data.commodity,
    ],
    [clausesJoinedText, '', '', '', '', ''],
    ['LC Condition :', data.lcCondition || 'N/A', '', '', '', ''],
    [data.chequeRealizationNotice, '', '', '', '', ''],
    [data.declarationText, '', '', '', '', ''],
    [data.insuredSignatoryLabel, '', '', '', data.insurerSignatoryLabel, ''],
    ['Authorised Signatory', '', '', '', 'Authorised Signatory', ''],
    [
      data.insuredCounterSignDate
        ? formatCertificateDate(data.insuredCounterSignDate)
        : '',
      '',
      '',
      '',
      '',
      '',
    ],
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}

export function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    const next = csvText[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentCell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentCell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        currentRow.push(currentCell);
        currentCell = '';
      } else if (ch === '\r' && next === '\n') {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        i++;
      } else if (ch === '\n' || ch === '\r') {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += ch;
      }
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

export function extractCertificatePatchFromCsv(
  csvText: string
): Partial<MarineCertificateData> {
  const rows = parseCsvRows(csvText);
  const patch: Partial<MarineCertificateData> = {};

  const findRowIdx = (predicate: (r: string[]) => boolean) =>
    rows.findIndex(predicate);

  const runRowIdx = findRowIdx((r) => r[0]?.trim().toUpperCase() === 'RUN NO');
  if (runRowIdx !== -1) {
    const r0 = rows[runRowIdx];
    if (r0[2]?.trim()) patch.runNo = r0[2].trim();
    if (r0[5]?.trim()) patch.transitType = r0[5].trim();
    const r1 = rows[runRowIdx + 1];
    if (r1?.[3]?.trim()) patch.referenceCode = r1[3].trim();
    if (r1?.[5]?.trim()) patch.modeOfTransport = r1[5].trim();
  }

  const invIdx = findRowIdx((r) =>
    r.some((c) => c.toLowerCase().includes('invoice no and date'))
  );
  if (invIdx !== -1) {
    const row = rows[invIdx];
    const col = row.findIndex((c) =>
      c.toLowerCase().includes('invoice no and date')
    );
    const val = row[col + 1]?.trim();
    if (val && val !== '0') {
      const parts = val.split('·').map((s) => s.trim());
      patch.invoiceNo = parts[0] || val;
      if (parts[1]) {
        const parsedInvDate = parseFlexibleDateToIso(parts[1]);
        if (parsedInvDate) patch.invoiceDate = parsedInvDate;
      }
    }
  }

  const policyHdrIdx = findRowIdx((r) => r[0]?.trim() === 'Policy No');
  if (policyHdrIdx !== -1) {
    for (let i = policyHdrIdx + 1; i <= policyHdrIdx + 5 && i < rows.length; i++) {
      const r = rows[i];
      if (r[0]?.trim()) {
        patch.policyNo = r[0].trim();
        patch.certificateNo = r[1]?.trim() || '';
        const parsedDate = parseFlexibleDateToIso(r[2] || '');
        if (parsedDate) patch.dateOfIssuance = parsedDate;
      }
      if (r[4]?.trim() === 'Marine' && r[5]?.trim()) patch.premiumMarine = r[5].trim();
      if (r[4]?.trim() === 'Other Extras' && r[5]?.trim())
        patch.premiumOtherExtras = r[5].trim();
      if (r[4]?.trim() === 'War & SRCC' && r[5]?.trim())
        patch.premiumWarSrcc = r[5].trim();
      if (r[4]?.trim() === 'GST' && r[5]?.trim()) patch.premiumGst = r[5].trim();
      if (r[4]?.trim() === 'Total' && r[5]?.trim()) patch.premiumTotal = r[5].trim();
    }
  }

  const docIdx = findRowIdx((r) => r[0]?.includes('CTD/BL/AWB/GR/RR No'));
  if (docIdx !== -1) {
    const val = rows[docIdx][1]?.trim();
    patch.transportDocNo = val === '0' ? '' : val || '';
    const d = parseFlexibleDateToIso(rows[docIdx][4] || '');
    patch.transportDocDate = d;
  }

  const insuredIdx = findRowIdx((r) => r[0]?.trim() === 'Insured');
  if (insuredIdx !== -1) {
    if (rows[insuredIdx][1]?.trim()) patch.insuredName = rows[insuredIdx][1].trim();
    const bovCell = rows[insuredIdx][4] || '';
    if (bovCell.includes(':')) {
      patch.basisOfValuation = bovCell.split(':').slice(1).join(':').trim();
    }
    if (rows[insuredIdx + 1]?.[1]?.trim()) {
      patch.insuredSubline = rows[insuredIdx + 1][1].trim();
    }
  }

  const addrIdx = findRowIdx((r) => r[0]?.trim() === 'Address:');
  if (addrIdx !== -1 && rows[addrIdx][1]?.trim()) {
    patch.insuredAddress = rows[addrIdx][1].trim();
  }

  const valIdx = findRowIdx((r) => r[0]?.includes('Insured Value ( INR )'));
  if (valIdx !== -1 && rows[valIdx + 1]) {
    const r = rows[valIdx + 1];
    const cleanNum = (r[0] || '').replace(/[^0-9.]/g, '');
    if (cleanNum) patch.insuredValueInr = cleanNum;
    if (r[1]?.trim()) patch.portOfLoading = r[1].trim();
    if (r[2]?.trim()) patch.portOfDischarge = r[2].trim();
    if (r[4]?.trim()) patch.transitType = r[4].trim();
  }

  const secValIdx = findRowIdx((r) => r[0]?.includes('Insured Value ('));
  if (secValIdx !== -1 && secValIdx !== valIdx && rows[secValIdx + 1]) {
    const r = rows[secValIdx + 1];
    const cleanNum = (r[0] || '').replace(/[^0-9.]/g, '');
    if (cleanNum) patch.secondaryInsuredValue = cleanNum;
    if (r[4]?.trim()) patch.modeOfTransport = r[4].trim();
  }

  const voyIdx = findRowIdx((r) => r[0]?.trim() === 'Voyage From:');
  if (voyIdx !== -1) {
    patch.voyageFrom = rows[voyIdx][1]?.trim() || '';
    patch.voyageTo = rows[voyIdx][3]?.trim() || '';
    patch.vesselConveyance = rows[voyIdx + 1]?.[4]?.trim() || '';
  }

  const conIdx = findRowIdx((r) => r[0]?.includes('Consignor / Consignee Name:'));
  if (conIdx !== -1) {
    const cName = rows[conIdx][1]?.trim();
    const cAddr = rows[conIdx][4]?.trim();
    patch.consignorConsigneeName = cName === '0' ? '' : cName || '';
    patch.consignorConsigneeAddress = cAddr === '0' ? '' : cAddr || '';
  }

  const descIdx = findRowIdx((r) => r[0]?.trim() === 'Description of Goods');
  if (descIdx !== -1) {
    const desc = rows[descIdx][1]?.trim();
    patch.descriptionOfGoods = desc === '0' ? '' : desc || '';
    const subIdx = descIdx + 1;
    if (rows[subIdx]) {
      const m = rows[subIdx][3]?.trim();
      const p = rows[subIdx][4]?.trim();
      const comm = rows[subIdx][5]?.trim();
      patch.marksAndNos = m === '0' ? '' : m || '';
      patch.noAndKindOfPkgs = p === '0' ? '' : p || '';
      if (comm) patch.commodity = comm;
    }
  }

  const lcIdx = findRowIdx((r) => r[0]?.trim() === 'LC Condition :');
  if (lcIdx !== -1) {
    const lc = rows[lcIdx][1]?.trim();
    patch.lcCondition = lc === '0' ? '' : lc || '';
  }

  return patch;
}
