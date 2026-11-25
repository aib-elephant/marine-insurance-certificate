import React from 'react';
import {
  Lock,
  Printer,
  SlidersHorizontal,
  Unlock,
} from 'lucide-react';
import {
  CERTIFICATE_CLAUSES,
  TRANSIT_TYPES,
  TRANSPORT_MODES,
  VALUATION_BASES,
} from '../data/certificateDefaults';
import { MarineCertificateData } from '../types/certificate';
import {
  formatCertificateDate,
  formatIndianNumber,
  numberToIndianWords,
} from '../utils/csvHelpers';

interface CertificateFormProps {
  data: MarineCertificateData;
  onChange: (updated: MarineCertificateData) => void;
  onSubmitAndPrint: () => void;
  onSaveDraft: () => void;
  onOpenClauses: () => void;
}

export const CertificateForm: React.FC<CertificateFormProps> = ({
  data,
  onChange,
  onSubmitAndPrint,
  onSaveDraft,
  onOpenClauses,
}) => {

  const updateField = <K extends keyof MarineCertificateData>(
    key: K,
    value: MarineCertificateData[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  const handleInsuredValueChange = (val: string) => {
    const numeric = val.replace(/[^0-9.]/g, '');
    const syncSecondary =
      data.secondaryInsuredValue === data.insuredValueInr ||
      !data.secondaryInsuredValue;
    onChange({
      ...data,
      insuredValueInr: numeric,
      secondaryInsuredValue: syncSecondary
        ? numeric
        : data.secondaryInsuredValue,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAndPrint();
  };

  const inputCls =
    'w-full min-h-[40px] rounded border border-[#c9c7c5] bg-white px-3 py-2 text-sm text-[#181818] placeholder:text-[#747474] focus:border-[#0176d3] focus:outline-none focus:ring-2 focus:ring-[#0176d3]/20 transition-colors';
  const readOnlyCls =
    'w-full min-h-[40px] rounded border border-[#dddbda] bg-[#f3f3f3] px-3 py-2 text-sm text-[#3e3e3c] font-mono-tabular cursor-not-allowed';
  const labelCls = 'block text-xs font-semibold text-[#3e3e3c] mb-1.5';
  const monoInputCls = `${inputCls} font-mono-tabular`;
  const secondaryBtnCls =
    'inline-flex min-h-[36px] items-center gap-1.5 rounded border border-[#c9c7c5] bg-white px-3.5 py-1.5 text-xs font-medium text-[#0176d3] hover:bg-[#f3f3f3] whitespace-nowrap shrink-0 transition-colors';

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      {/* SECTION 1: Policy & Invoice Details */}
      <section className="rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
          <div className="mb-4 border-b border-[#e5e5e5] pb-3">
            <h2 className="text-[15px] font-bold text-[#032d60]">
              01. Policy Reference, Rate & Invoice Details
            </h2>
            <p className="text-xs text-[#514f4d]">
              System-generated Certificate Number, auto-populated Open Policy
              parameters, and shipment invoice / transport document inputs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="certificateNo" className={labelCls}>
                Certificate Number
              </label>
              <input
                id="certificateNo"
                type="text"
                readOnly
                value={data.certificateNo}
                className={readOnlyCls}
              />
              <span className="mt-1 block text-[11px] text-[#747474]">
                System Generated Number
              </span>
            </div>

            <div>
              <label htmlFor="policyNo" className={labelCls}>
                Policy Number
              </label>
              <input
                id="policyNo"
                type="text"
                readOnly
                value={data.policyNo}
                className={readOnlyCls}
              />
              <span className="mt-1 block text-[11px] text-[#747474]">
                Auto from Policy / Non-editable
              </span>
            </div>

            <div>
              <label htmlFor="policyStartDate" className={labelCls}>
                Policy Start Date
              </label>
              <input
                id="policyStartDate"
                type="text"
                readOnly
                value={formatCertificateDate(data.policyStartDate)}
                className={readOnlyCls}
              />
              <span className="mt-1 block text-[11px] text-[#747474]">
                Auto from Policy / Non-editable
              </span>
            </div>

            <div>
              <label htmlFor="policyEndDate" className={labelCls}>
                Policy End Date
              </label>
              <input
                id="policyEndDate"
                type="text"
                readOnly
                value={formatCertificateDate(data.policyEndDate)}
                className={readOnlyCls}
              />
              <span className="mt-1 block text-[11px] text-[#747474]">
                Auto from Policy / Non-editable
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="policyRate"
                  className="text-xs font-semibold text-[#3e3e3c]"
                >
                  Policy rate:
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateField('policyRateRmOverride', !data.policyRateRmOverride)
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0176d3] hover:underline whitespace-nowrap shrink-0"
                >
                  {data.policyRateRmOverride ? (
                    <>
                      <Unlock className="h-3 w-3" /> Lock Policy Rate
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" /> RM Edit (High Risk Location)
                    </>
                  )}
                </button>
              </div>
              <input
                id="policyRate"
                type="text"
                readOnly={!data.policyRateRmOverride}
                value={data.policyRate}
                onChange={(e) => updateField('policyRate', e.target.value)}
                className={data.policyRateRmOverride ? monoInputCls : readOnlyCls}
              />
              <span className="mt-1 block text-[11px] text-[#747474]">
                Fixed from Policy (editable only with RM for High Risk Locations)
              </span>
            </div>

            <div>
              <label htmlFor="dateOfIssuance" className={labelCls}>
                Date of Issuance *
              </label>
              <input
                id="dateOfIssuance"
                type="date"
                required
                value={data.dateOfIssuance}
                onChange={(e) => updateField('dateOfIssuance', e.target.value)}
                className={monoInputCls}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="invoiceNo" className={labelCls}>
                Invoice No:
              </label>
              <input
                id="invoiceNo"
                type="text"
                value={data.invoiceNo}
                onChange={(e) => updateField('invoiceNo', e.target.value)}
                placeholder="Alpha Numeric"
                className={monoInputCls}
              />
            </div>

            <div>
              <label htmlFor="invoiceDate" className={labelCls}>
                Invoice Date:
              </label>
              <input
                id="invoiceDate"
                type="date"
                value={data.invoiceDate}
                onChange={(e) => updateField('invoiceDate', e.target.value)}
                className={monoInputCls}
              />
            </div>

            <div>
              <label htmlFor="transportDocNo" className={labelCls}>
                CTD/BL/AWB/GR/RR No :
              </label>
              <input
                id="transportDocNo"
                type="text"
                value={data.transportDocNo}
                onChange={(e) => updateField('transportDocNo', e.target.value)}
                placeholder="Alpha Numeric"
                className={monoInputCls}
              />
            </div>

            <div>
              <label htmlFor="transportDocDate" className={labelCls}>
                CTD/BL/AWB/GR/RR Date :
              </label>
              <input
                id="transportDocDate"
                type="date"
                value={data.transportDocDate}
                onChange={(e) =>
                  updateField('transportDocDate', e.target.value)
                }
                className={monoInputCls}
              />
            </div>
          </div>
      </section>

      {/* SECTION 2: Insured & Valuation */}
      <section className="rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
          <div className="mb-4 border-b border-[#e5e5e5] pb-3">
            <h2 className="text-[15px] font-bold text-[#032d60]">
              02. Insured, GST & Sum Insured Valuation
            </h2>
            <p className="text-xs text-[#514f4d]">
              Insured party details, GST registration, valuation basis picklist,
              and sum insured values.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="insuredName" className={labelCls}>
                Insured: *
              </label>
              <input
                id="insuredName"
                type="text"
                required
                value={data.insuredName}
                onChange={(e) => updateField('insuredName', e.target.value)}
                placeholder="Auto from Policy / Editable"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="gstNumber" className={labelCls}>
                GST Number
              </label>
              <input
                id="gstNumber"
                type="text"
                value={data.gstNumber}
                onChange={(e) =>
                  updateField('gstNumber', e.target.value.toUpperCase())
                }
                placeholder="Alpha Numeric GSTIN"
                className={monoInputCls}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="insuredAddress" className={labelCls}>
                Insured Address
              </label>
              <textarea
                id="insuredAddress"
                rows={2}
                value={data.insuredAddress}
                onChange={(e) => updateField('insuredAddress', e.target.value)}
                placeholder="Enter insured registered address"
                className={`${inputCls} min-h-[64px]`}
              />
            </div>

            <div>
              <label htmlFor="basisOfValuation" className={labelCls}>
                Basis of Valuation : *
              </label>
              <select
                id="basisOfValuation"
                required
                value={data.basisOfValuation}
                onChange={(e) =>
                  updateField('basisOfValuation', e.target.value)
                }
                className={inputCls}
              >
                <option value="">Select Basis of Valuation...</option>
                {VALUATION_BASES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                {data.basisOfValuation &&
                  !VALUATION_BASES.includes(
                    data.basisOfValuation as (typeof VALUATION_BASES)[number]
                  ) && (
                    <option value={data.basisOfValuation}>
                      {data.basisOfValuation}
                    </option>
                  )}
              </select>
            </div>

            <div>
              <label htmlFor="insuredValueInr" className={labelCls}>
                Insured Value ( INR ) *
              </label>
              <input
                id="insuredValueInr"
                type="text"
                required
                inputMode="decimal"
                value={data.insuredValueInr}
                onChange={(e) => handleInsuredValueChange(e.target.value)}
                placeholder="Numeric - Suminsured"
                className={monoInputCls}
              />
              {data.insuredValueInr && (
                <div className="mt-1.5 flex items-center justify-between text-xs text-[#514f4d]">
                  <span className="font-mono-tabular font-medium text-[#181818]">
                    ₹ {formatIndianNumber(data.insuredValueInr)}
                  </span>
                  <span className="max-w-[240px] truncate">
                    {numberToIndianWords(data.insuredValueInr)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="secondaryInsuredValue" className={labelCls}>
                Insured Value ( 1)
              </label>
              <input
                id="secondaryInsuredValue"
                type="text"
                inputMode="decimal"
                value={data.secondaryInsuredValue}
                onChange={(e) =>
                  updateField(
                    'secondaryInsuredValue',
                    e.target.value.replace(/[^0-9.]/g, '')
                  )
                }
                placeholder="Numeric - Suminsured"
                className={monoInputCls}
              />
            </div>

            <div>
              <label htmlFor="insuredSubline" className={labelCls}>
                Associated / Subsidiary Extension
              </label>
              <input
                id="insuredSubline"
                type="text"
                value={data.insuredSubline}
                onChange={(e) => updateField('insuredSubline', e.target.value)}
                placeholder="Optional associated / subsidiary companies clause"
                className={inputCls}
              />
            </div>
          </div>
      </section>

      {/* SECTION 3: Transit, Ports & Voyage */}
      <section className="rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
          <div className="mb-4 border-b border-[#e5e5e5] pb-3">
            <h2 className="text-[15px] font-bold text-[#032d60]">
              03. Transit Type, Mode of Transport & Voyage
            </h2>
            <p className="text-xs text-[#514f4d]">
              Transit type picklist, transport mode, ports, conveyance, and
              consignor/consignee details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="transitType" className={labelCls}>
                Transit Type *
              </label>
              <select
                id="transitType"
                required
                value={data.transitType}
                onChange={(e) => updateField('transitType', e.target.value)}
                className={inputCls}
              >
                <option value="">Select Transit Type...</option>
                {TRANSIT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                {data.transitType &&
                  !TRANSIT_TYPES.includes(
                    data.transitType as (typeof TRANSIT_TYPES)[number]
                  ) && (
                    <option value={data.transitType}>{data.transitType}</option>
                  )}
              </select>
            </div>

            <div>
              <label htmlFor="modeOfTransport" className={labelCls}>
                Mode of Transport *
              </label>
              <select
                id="modeOfTransport"
                required
                value={data.modeOfTransport}
                onChange={(e) => updateField('modeOfTransport', e.target.value)}
                className={inputCls}
              >
                <option value="">Select Mode of Transport...</option>
                {TRANSPORT_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                {data.modeOfTransport &&
                  !TRANSPORT_MODES.includes(
                    data.modeOfTransport as (typeof TRANSPORT_MODES)[number]
                  ) && (
                    <option value={data.modeOfTransport}>
                      {data.modeOfTransport}
                    </option>
                  )}
              </select>
            </div>

            <div>
              <label htmlFor="portOfLoading" className={labelCls}>
                Port of Loading
              </label>
              <input
                id="portOfLoading"
                type="text"
                value={data.portOfLoading}
                onChange={(e) => updateField('portOfLoading', e.target.value)}
                placeholder="Alpha Numeric"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="portOfDischarge" className={labelCls}>
                Port of Discharge
              </label>
              <input
                id="portOfDischarge"
                type="text"
                value={data.portOfDischarge}
                onChange={(e) => updateField('portOfDischarge', e.target.value)}
                placeholder="Alpha Numeric"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="voyageFrom" className={labelCls}>
                Voyage From: *
              </label>
              <input
                id="voyageFrom"
                type="text"
                required
                value={data.voyageFrom}
                onChange={(e) => updateField('voyageFrom', e.target.value)}
                placeholder="Alpha Numeric"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="voyageTo" className={labelCls}>
                To: *
              </label>
              <input
                id="voyageTo"
                type="text"
                required
                value={data.voyageTo}
                onChange={(e) => updateField('voyageTo', e.target.value)}
                placeholder="Alpha Numeric"
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="vesselConveyance" className={labelCls}>
                Vessel/Conveyance
              </label>
              <input
                id="vesselConveyance"
                type="text"
                value={data.vesselConveyance}
                onChange={(e) =>
                  updateField('vesselConveyance', e.target.value)
                }
                placeholder="Alpha Numeric"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="consignorConsigneeName" className={labelCls}>
                Consignor / Consignee Name:
              </label>
              <input
                id="consignorConsigneeName"
                type="text"
                value={data.consignorConsigneeName}
                onChange={(e) =>
                  updateField('consignorConsigneeName', e.target.value)
                }
                placeholder="Alpha Numeric"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="consignorConsigneeAddress" className={labelCls}>
                Consignor / Consignee Address
              </label>
              <input
                id="consignorConsigneeAddress"
                type="text"
                value={data.consignorConsigneeAddress}
                onChange={(e) =>
                  updateField('consignorConsigneeAddress', e.target.value)
                }
                placeholder="Alpha Numeric"
                className={inputCls}
              />
            </div>
          </div>
      </section>

      {/* SECTION 4: Cargo & LC Condition */}
      <section className="rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
          <div className="mb-4 border-b border-[#e5e5e5] pb-3">
            <h2 className="text-[15px] font-bold text-[#032d60]">
              04. Goods Schedule, Commodity & LC Condition
            </h2>
            <p className="text-xs text-[#514f4d]">
              Cargo description, container/package markings, commodity, and
              letter of credit terms.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="descriptionOfGoods" className={labelCls}>
                Description of Goods *
              </label>
              <textarea
                id="descriptionOfGoods"
                rows={2}
                required
                value={data.descriptionOfGoods}
                onChange={(e) =>
                  updateField('descriptionOfGoods', e.target.value)
                }
                placeholder="Alpha Numeric"
                className={`${inputCls} min-h-[64px]`}
              />
            </div>

            <div>
              <label htmlFor="marksAndNos" className={labelCls}>
                Marks & Nos/ Container No
              </label>
              <input
                id="marksAndNos"
                type="text"
                value={data.marksAndNos}
                onChange={(e) => updateField('marksAndNos', e.target.value)}
                placeholder="Alpha Numeric"
                className={monoInputCls}
              />
            </div>

            <div>
              <label htmlFor="noAndKindOfPkgs" className={labelCls}>
                No & Kind of Pkgs.
              </label>
              <input
                id="noAndKindOfPkgs"
                type="text"
                value={data.noAndKindOfPkgs}
                onChange={(e) => updateField('noAndKindOfPkgs', e.target.value)}
                placeholder="Alpha Numeric"
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="commodity" className={labelCls}>
                Commodity
              </label>
              <textarea
                id="commodity"
                rows={2}
                value={data.commodity}
                onChange={(e) => updateField('commodity', e.target.value)}
                placeholder="Alpha Numeric"
                className={`${inputCls} min-h-[64px]`}
              />
            </div>

            <div>
              <label htmlFor="lcCondition" className={labelCls}>
                LC Condition :
              </label>
              <input
                id="lcCondition"
                type="text"
                value={data.lcCondition}
                onChange={(e) => updateField('lcCondition', e.target.value)}
                placeholder="Alpha Numeric"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="insuredCounterSignDate" className={labelCls}>
                Insured Countersignature Date
              </label>
              <input
                id="insuredCounterSignDate"
                type="date"
                value={data.insuredCounterSignDate}
                onChange={(e) =>
                  updateField('insuredCounterSignDate', e.target.value)
                }
                className={monoInputCls}
              />
            </div>
          </div>
      </section>

      {/* SECTION 5: Autopopulated / Static Clauses, Terms & Insurer Name */}
      <section className="rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
          <div className="mb-4 flex items-center justify-between border-b border-[#e5e5e5] pb-3">
            <div>
              <h2 className="text-[15px] font-bold text-[#032d60]">
                05. Autopopulated Clauses, Terms & Conditions
              </h2>
              <p className="text-xs text-[#514f4d]">
                Static policy clauses, claims notice address, and insurer
                undertaking printed on the certificate.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenClauses}
              className={secondaryBtnCls}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Manage Clauses ({data.includedClauseIds.length}/
              {CERTIFICATE_CLAUSES.length})
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded border border-[#dddbda] bg-[#fafaf9] p-3.5">
              <div className="font-semibold text-[#181818]">
                Subject to Applicable Clauses mentioned below :
              </div>
              <p className="mt-1 text-[#514f4d]">
                Autopopulate / Static ({data.includedClauseIds.length} Open
                Policy clauses included — Institute Cargo Clauses A/B/Air,
                Inland Transit A/B 2010, War & SRCC, Cyber, Sanctions, and
                Special Conditions).
              </p>
            </div>

            <div className="rounded border border-[#dddbda] bg-[#fafaf9] p-3.5">
              <div className="font-semibold text-[#181818]">
                Terms & Conditions
              </div>
              <p className="mt-1 leading-relaxed text-[#514f4d]">
                In the event of loss or damage which may involve this
                certificate, immediate notice of loss or damage should be given
                to the company at the following address:{' '}
                {data.localClaimsNoticeAddress}
              </p>
            </div>

            <div className="space-y-1.5 rounded border border-[#dddbda] bg-[#fafaf9] p-3.5">
              <div className="font-semibold text-[#181818]">Insurer Name</div>
              <p className="text-[#3e3e3c]">
                Claims payable by : {data.claimsPayableBy}
              </p>
              <p className="text-[#514f4d]">{data.chequeRealizationNotice}</p>
              <p className="text-[#514f4d]">{data.declarationText}</p>
            </div>
          </div>
      </section>

      {/* Submit Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-[#dddbda] bg-white p-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
        <p className="text-xs text-[#514f4d]">
          Submitting records Certificate #{data.certificateNo} in Submitted
          Forms and prints the updated PDF certificate.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex min-h-[40px] items-center gap-2 rounded border border-[#c9c7c5] bg-white px-4 py-2 text-xs font-semibold text-[#0176d3] hover:bg-[#f3f3f3] whitespace-nowrap shrink-0 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="inline-flex min-h-[40px] items-center gap-2 rounded border border-[#0176d3] bg-[#0176d3] px-5 py-2 text-xs font-semibold text-white hover:bg-[#014486] hover:border-[#014486] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0176d3] whitespace-nowrap shrink-0 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Submit & Print PDF
          </button>
        </div>
      </div>
    </form>
  );
};
