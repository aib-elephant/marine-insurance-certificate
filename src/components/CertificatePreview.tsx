import React, { useState } from 'react';
import { Eye, EyeOff, Printer } from 'lucide-react';
import { CERTIFICATE_CLAUSES } from '../data/certificateDefaults';
import { MarineCertificateData } from '../types/certificate';
import { formatCertificateDate, formatIndianNumber } from '../utils/csvHelpers';

interface CertificatePreviewProps {
  data: MarineCertificateData;
  onPrint: () => void;
  showToolbar?: boolean;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  data,
  onPrint,
  showToolbar = true,
}) => {
  const [showFullClauses, setShowFullClauses] = useState(false);

  const activeClauses = CERTIFICATE_CLAUSES.filter((c) =>
    data.includedClauseIds.includes(c.id)
  );

  const valOrBlank = (v: string) => (v && v.trim() !== '' ? v : '\u00A0');

  const invoiceDisplay = [
    data.invoiceNo,
    data.invoiceDate ? formatCertificateDate(data.invoiceDate) : '',
  ]
    .filter(Boolean)
    .join(' / ');

  const blueCell = 'bg-[#d9eaf7]';

  return (
    <div className="flex flex-col gap-3">
      {showToolbar && (
        <div className="no-print flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              Printable Certificate View
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              Certificate #{data.certificateNo || '—'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFullClauses((prev) => !prev)}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 transition-colors"
            >
              {showFullClauses ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Compact Clauses
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Expand Full Clauses
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / PDF
            </button>
          </div>
        </div>
      )}

      {/* Official PDF Extract Layout */}
      <div className="print-only-sheet cert-serif bg-white p-4 text-[10px] leading-[1.25] text-black">
        {/* Top Header above black certificate border: Logo + Invoice No and Date row */}
        <div className="mb-0.5 flex items-end justify-between gap-2">
          <div className="pb-1">
            <img
              src="/assets/aistudio/image_cd2c1333.png"
              alt="IndusInd General Insurance"
              referrerPolicy="no-referrer"
              className="h-11 w-auto object-contain"
            />
          </div>

          <table className="border-collapse text-[9.5px]">
            <tbody>
              <tr>
                <td className="px-3 py-0.5 text-center font-bold">
                  {data.runNo ? `Run ${data.runNo}` : '-'}
                </td>
                <td className="px-3 py-0.5 font-bold whitespace-nowrap">
                  Invoice No and Date
                </td>
                <td
                  className={`${blueCell} min-w-[110px] px-3 py-0.5 text-center font-medium`}
                >
                  {valOrBlank(invoiceDisplay)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main Certificate Grid Box */}
        <table className="w-full table-fixed border-collapse border border-black text-[9.5px]">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[26%]" />
            <col className="w-[24%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
          </colgroup>

          <tbody>
            {/* Row 1: MARINE INSURANCE CERTIFICATE Banner */}
            <tr>
              <td
                colSpan={5}
                className="border border-black py-1 text-center text-[11px] font-bold tracking-wide uppercase"
              >
                MARINE INSURANCE CERTIFICATE
              </td>
            </tr>

            {/* Row 2: Issuing Office Address & Pre-signed Validity */}
            <tr>
              <td
                colSpan={2}
                className="border border-black px-1.5 py-1 align-top"
              >
                <div className="font-bold">Issuing Office Address:</div>
                <div className="mt-0.5">
                  {data.insurerName}
                  {data.issuingOfficeAddress
                    ? `, ${data.issuingOfficeAddress}`
                    : ''}
                </div>
              </td>
              <td
                colSpan={3}
                className="border border-black px-1.5 py-1 align-top"
              >
                <div className="font-bold">
                  Since the certificate is pre-signed the same shall be valid
                  only if:
                </div>
                <div className="mt-0.5 font-bold">
                  a)&nbsp;&nbsp;&nbsp;&nbsp;Counter signed by the Authorised
                  Signatory of Insured
                </div>
                <div className="font-bold">
                  b)&nbsp;&nbsp;&nbsp;&nbsp;Complies with special conditions of
                  the certificate as mentioned herein.
                </div>
              </td>
            </tr>

            {/* Row 3: Policy No / Certificate No. / Date of Issuance / Premium */}
            <tr>
              <td className="border border-black px-1.5 py-0.5 text-center font-bold">
                Policy No
              </td>
              <td className="border border-black px-1.5 py-0.5 text-center font-bold">
                Certificate No.
              </td>
              <td className="border border-black px-1.5 py-0.5 text-center font-bold">
                Date of Issuance
              </td>
              <td
                colSpan={2}
                className="border border-black px-1.5 py-0.5 text-center font-bold"
              >
                Premium
              </td>
            </tr>

            <tr>
              <td
                rowSpan={5}
                className="border border-black px-1.5 py-1 text-center align-middle font-medium break-all"
              >
                <div>{valOrBlank(data.policyNo)}</div>
                {(data.policyStartDate || data.policyEndDate) && (
                  <div className="mt-1 text-[8px] text-neutral-700">
                    ({formatCertificateDate(data.policyStartDate)} to{' '}
                    {formatCertificateDate(data.policyEndDate)})
                  </div>
                )}
              </td>
              <td
                rowSpan={5}
                className={`${blueCell} border border-black px-1.5 py-1 text-center align-middle font-semibold`}
              >
                {valOrBlank(data.certificateNo)}
              </td>
              <td
                rowSpan={5}
                className="border border-black px-1.5 py-1 text-center align-middle"
              >
                <div>{formatCertificateDate(data.dateOfIssuance)}</div>
                {data.policyRate && (
                  <div className="mt-1 text-[8px] text-neutral-700">
                    Rate: {data.policyRate}
                  </div>
                )}
              </td>
              <td className="border-r border-b border-black px-1.5 py-0.5">
                Marine
              </td>
              <td className="border-b border-black px-1.5 py-0.5 text-right">
                {valOrBlank(data.premiumMarine)}
              </td>
            </tr>
            <tr>
              <td className="border-r border-b border-black px-1.5 py-0.5">
                Other Extras
              </td>
              <td className="border-b border-black px-1.5 py-0.5 text-right">
                {valOrBlank(data.premiumOtherExtras)}
              </td>
            </tr>
            <tr>
              <td className="border-r border-b border-black px-1.5 py-0.5">
                War &amp; SRCC
              </td>
              <td className="border-b border-black px-1.5 py-0.5 text-right">
                {valOrBlank(data.premiumWarSrcc)}
              </td>
            </tr>
            <tr>
              <td className="border-r border-b border-black px-1.5 py-0.5">
                GST
              </td>
              <td className="border-b border-black px-1.5 py-0.5 text-right">
                {valOrBlank(data.premiumGst)}
              </td>
            </tr>
            <tr>
              <td className="border-r border-black px-1.5 py-0.5 font-bold">
                Total
              </td>
              <td className="px-1.5 py-0.5 text-right font-bold">
                {valOrBlank(data.premiumTotal)}
              </td>
            </tr>

            {/* Row 4: W. K. Webster Notice Header */}
            <tr>
              <td colSpan={5} className="border border-black px-1.5 py-1">
                In the event of loss or damage which may involve this
                certificate, immediate notice of loss or damage should be given
                to the company or to W. K. Webster at one of the following
                addresses:
              </td>
            </tr>

            {/* Row 5: W. K. Webster Matrix */}
            <tr>
              <td className="border-x border-black px-1.5 py-0.5 font-bold">
                AREA
              </td>
              <td className="border-r border-black px-1.5 py-0.5 font-bold">
                {data.surveyAgents[0]?.region || 'America'}
              </td>
              <td className="border-r border-black px-1.5 py-0.5 font-bold">
                {data.surveyAgents[1]?.region || 'Europe, Africa & Middle East'}
              </td>
              <td colSpan={2} className="border-r border-black px-1.5 py-0.5 font-bold">
                {data.surveyAgents[2]?.region || 'Asia - Far East'}
              </td>
            </tr>
            <tr>
              <td className="border-x border-black px-1.5 py-0.5">EMAIL :</td>
              <td className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[0]?.email}
              </td>
              <td className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[1]?.email}
              </td>
              <td colSpan={2} className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[2]?.email}
              </td>
            </tr>
            <tr>
              <td className="border-x border-black px-1.5 py-0.5">PH. NOS :</td>
              <td className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[0]?.phone}
              </td>
              <td className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[1]?.phone}
              </td>
              <td colSpan={2} className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[2]?.phone}
              </td>
            </tr>
            <tr>
              <td className="border-x border-black px-1.5 py-0.5">
                AFTER HOURS :
              </td>
              <td className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[0]?.afterHours}
              </td>
              <td className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[1]?.afterHours}
              </td>
              <td colSpan={2} className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[2]?.afterHours}
              </td>
            </tr>
            <tr>
              <td className="border-x border-black px-1.5 py-0.5">FAX NOS :</td>
              <td className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[0]?.fax}
              </td>
              <td className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[1]?.fax}
              </td>
              <td colSpan={2} className="border-r border-black px-1.5 py-0.5">
                {data.surveyAgents[2]?.fax}
              </td>
            </tr>
            <tr>
              <td className="border-x border-b border-black px-1.5 py-0.5 align-top">
                ADDRESS :
              </td>
              <td className="border-r border-b border-black px-1.5 py-0.5 align-top">
                <div>{data.surveyAgents[0]?.companyName}</div>
                {data.surveyAgents[0]?.addressLines.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </td>
              <td className="border-r border-b border-black px-1.5 py-0.5 align-top">
                <div>{data.surveyAgents[1]?.companyName}</div>
                {data.surveyAgents[1]?.addressLines.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </td>
              <td
                colSpan={2}
                className="border-r border-b border-black px-1.5 py-0.5 align-top"
              >
                <div>{data.surveyAgents[2]?.companyName}</div>
                {data.surveyAgents[2]?.addressLines.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </td>
            </tr>

            {/* Row 6: Local Claims Address */}
            <tr>
              <td colSpan={5} className="border border-black px-1.5 py-1">
                In the event of loss or damage which may involve this
                certificate, immediate notice of loss or damage should be given
                to the company at the following address:{' '}
                {data.localClaimsNoticeAddress}
              </td>
            </tr>

            {/* Row 7: Claims payable by */}
            <tr>
              <td colSpan={5} className="border border-black px-1.5 py-1">
                Claims payable by : {data.claimsPayableBy}
              </td>
            </tr>

            {/* Row 8: CTD/BL/AWB/GR/RR No & Date */}
            <tr>
              <td className="border border-black px-1.5 py-0.5 font-bold">
                CTD/BL/AWB/GR/RR No :
              </td>
              <td
                colSpan={2}
                className={`${blueCell} border border-black px-1.5 py-0.5 text-center`}
              >
                {valOrBlank(data.transportDocNo)}
              </td>
              <td className="border border-black px-1.5 py-0.5 text-center font-bold">
                Date :
              </td>
              <td
                className={`${blueCell} border border-black px-1.5 py-0.5 text-center`}
              >
                {data.transportDocDate
                  ? formatCertificateDate(data.transportDocDate)
                  : '\u00A0'}
              </td>
            </tr>

            {/* Row 9: Insured & Basis of Valuation */}
            <tr>
              <td className="border border-black px-1.5 py-1 align-middle font-bold">
                Insured
              </td>
              <td
                colSpan={2}
                className="border-y border-black px-1.5 py-1 align-top"
              >
                <div className="font-semibold">{valOrBlank(data.insuredName)}</div>
                {data.insuredSubline && (
                  <div className="text-[8.5px]">{data.insuredSubline}</div>
                )}
                {data.gstNumber && (
                  <div className="text-[8.5px]">GST Number: {data.gstNumber}</div>
                )}
              </td>
              <td
                colSpan={2}
                className="border-y border-r border-black px-1.5 py-1 align-top"
              >
                <span className="font-bold">Basis of Valuation :</span>{' '}
                <span>{valOrBlank(data.basisOfValuation)}</span>
              </td>
            </tr>

            {/* Row 10: Insured Address */}
            <tr>
              <td className="border border-black px-1.5 py-1 font-bold">
                Address:
              </td>
              <td colSpan={4} className="border border-black px-1.5 py-1">
                {valOrBlank(data.insuredAddress)}
              </td>
            </tr>

            {/* Row 11: Insured Value / Ports / Transit / Mode / Vessel */}
            <tr>
              <td className="border border-black px-1.5 py-0.5 font-bold">
                Insured Value ( INR )
              </td>
              <td className="border border-black px-1.5 py-0.5 font-bold">
                Port of Loading
              </td>
              <td className="border border-black px-1.5 py-0.5 font-bold">
                Port of Discharge
              </td>
              <td colSpan={2} className="border border-black px-1.5 py-0.5 font-bold">
                Transit Type
              </td>
            </tr>

            <tr>
              <td className="border border-black px-1.5 py-0.5 text-center font-semibold">
                {data.insuredValueInr
                  ? formatIndianNumber(data.insuredValueInr)
                  : '\u00A0'}
              </td>
              <td
                rowSpan={3}
                className={`${blueCell} border border-black px-1.5 py-1 text-center align-middle`}
              >
                {valOrBlank(data.portOfLoading)}
              </td>
              <td
                rowSpan={3}
                className={`${blueCell} border border-black px-1.5 py-1 text-center align-middle`}
              >
                {valOrBlank(data.portOfDischarge)}
              </td>
              <td
                colSpan={2}
                className={`${blueCell} border border-black px-1.5 py-0.5 text-center`}
              >
                {valOrBlank(data.transitType)}
              </td>
            </tr>

            <tr>
              <td className="border border-black px-1.5 py-0.5 font-bold">
                Insured Value ( 1)
              </td>
              <td colSpan={2} className="border border-black px-1.5 py-0.5 font-bold">
                Mode of Transport
              </td>
            </tr>

            <tr>
              <td className="border border-black px-1.5 py-0.5 text-center font-semibold">
                {data.secondaryInsuredValue || data.insuredValueInr
                  ? formatIndianNumber(
                      data.secondaryInsuredValue || data.insuredValueInr
                    )
                  : '\u00A0'}
              </td>
              <td
                colSpan={2}
                className={`${blueCell} border border-black px-1.5 py-0.5 text-center`}
              >
                {valOrBlank(data.modeOfTransport)}
              </td>
            </tr>

            {/* Row 12: Voyage From / To / Vessel/Conveyance */}
            <tr>
              <td
                rowSpan={2}
                className="border border-black px-1.5 py-1 align-middle font-bold"
              >
                Voyage From:
              </td>
              <td
                rowSpan={2}
                className={`${blueCell} border border-black px-1.5 py-1 text-center align-middle`}
              >
                {valOrBlank(data.voyageFrom)}
              </td>
              <td
                rowSpan={2}
                className="border border-black px-1.5 py-1 align-middle"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">To:</span>
                  <span
                    className={`${blueCell} flex-1 px-1.5 py-0.5 text-center`}
                  >
                    {valOrBlank(data.voyageTo)}
                  </span>
                </div>
              </td>
              <td
                colSpan={2}
                className="border border-black px-1.5 py-0.5 font-bold"
              >
                Vessel/Conveyance
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className={`${blueCell} border border-black px-1.5 py-0.5 text-center`}
              >
                {valOrBlank(data.vesselConveyance)}
              </td>
            </tr>

            {/* Row 13: Consignor / Consignee */}
            <tr>
              <td className="border border-black px-1.5 py-1 align-top font-bold">
                Consignor / Consignee Name:
              </td>
              <td
                className={`${blueCell} border border-black px-1.5 py-1 text-center align-middle`}
              >
                {valOrBlank(data.consignorConsigneeName)}
              </td>
              <td className="border border-black px-1.5 py-1 align-top font-bold">
                Consignor / Consignee Address
              </td>
              <td
                colSpan={2}
                className={`${blueCell} border border-black px-1.5 py-1 text-center align-middle`}
              >
                {valOrBlank(data.consignorConsigneeAddress)}
              </td>
            </tr>

            {/* Row 14: Cargo Schedule Header & Body */}
            <tr>
              <td className="border border-black px-1.5 py-1 align-top font-bold">
                Description of Goods
              </td>
              <td
                rowSpan={2}
                className={`${blueCell} border border-black px-1.5 py-2 align-middle`}
              >
                {valOrBlank(data.descriptionOfGoods)}
              </td>
              <td className="border border-black px-1.5 py-1 align-top font-bold">
                Marks &amp; Nos/
                <br />
                Container No
              </td>
              <td className="border border-black px-1.5 py-1 align-top font-bold">
                No &amp; Kind of Pkgs.
              </td>
              <td className="border border-black px-1.5 py-1 align-top font-bold">
                Commodity
              </td>
            </tr>

            <tr>
              <td className="border-x border-black px-1.5 py-1 align-bottom font-bold">
                Subject to Applicable Clauses mentioned below :
              </td>
              <td
                className={`${blueCell} border border-black px-1.5 py-4 text-center align-middle`}
              >
                {valOrBlank(data.marksAndNos)}
              </td>
              <td
                className={`${blueCell} border border-black px-1.5 py-4 text-center align-middle`}
              >
                {valOrBlank(data.noAndKindOfPkgs)}
              </td>
              <td className="border border-black px-1.5 py-2 align-top text-[8.5px]">
                {valOrBlank(data.commodity)}
              </td>
            </tr>

            {/* Row 15: Clauses Body */}
            <tr>
              <td
                colSpan={5}
                className="border border-black px-1.5 py-1.5 align-top text-[8px] leading-[1.3]"
              >
                {showFullClauses ? (
                  <div>
                    {activeClauses.map((c) => c.fullText).join(' · ')}
                  </div>
                ) : (
                  <div>
                    {activeClauses.map((c) => c.title).join(' · ')}
                  </div>
                )}
                {data.customEndorsements.trim() && (
                  <div className="mt-1 font-semibold">
                    Special Endorsements: {data.customEndorsements}
                  </div>
                )}
              </td>
            </tr>

            {/* Row 16: LC Condition */}
            <tr>
              <td className="border border-black px-1.5 py-1 font-bold">
                LC Condition :
              </td>
              <td
                colSpan={4}
                className={`${blueCell} border border-black px-1.5 py-1 text-center`}
              >
                {valOrBlank(data.lcCondition)}
              </td>
            </tr>

            {/* Row 17: Cheque realization */}
            <tr>
              <td
                colSpan={5}
                className="border border-black px-1.5 py-1 text-center font-bold"
              >
                {data.chequeRealizationNotice}
              </td>
            </tr>

            {/* Row 18: Certification declaration */}
            <tr>
              <td colSpan={5} className="border border-black px-1.5 py-1">
                {data.declarationText}
              </td>
            </tr>

            {/* Row 19: Dual Signatories */}
            <tr>
              <td
                colSpan={5}
                className="border border-black px-1.5 pt-1 pb-1.5"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="w-1/2">
                    <div className="font-bold">
                      {data.insuredSignatoryLabel.trim()
                        ? data.insuredSignatoryLabel
                        : data.insuredName.trim()
                        ? `For ${data.insuredName}`
                        : 'For Insured'}
                    </div>
                    <div className="mt-7 font-bold">Authorised Signatory</div>
                    <div className="mt-0.5 text-[9px]">
                      {data.insuredCounterSignDate
                        ? formatCertificateDate(data.insuredCounterSignDate)
                        : '\u00A0'}
                    </div>
                  </div>

                  <div className="w-1/2 text-right">
                    <div className="font-bold">
                      {data.insurerSignatoryLabel.trim()
                        ? data.insurerSignatoryLabel
                        : 'For Indusind General Insurance Co Ltd'}
                    </div>
                    <div className="relative mt-4 inline-block pr-2 text-center">
                      <img
                        src="/assets/indusind-signature.svg"
                        alt="Authorised Signatory Signature"
                        referrerPolicy="no-referrer"
                        className="pointer-events-none absolute -top-4 left-1/2 h-14 w-auto -translate-x-1/2 object-contain"
                      />
                      <div className="relative z-10 font-bold">
                        Authorised Signatory
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Bottom Footer Note outside black frame */}
        <div className="mt-1 text-[8.5px] font-bold text-black">
          Note : -Consolidated Stamp Duty is paid on the Open Policy
        </div>
      </div>
    </div>
  );
};
