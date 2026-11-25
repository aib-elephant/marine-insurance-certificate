export interface SurveyAgentContact {
  id: string;
  region: string;
  email: string;
  phone: string;
  afterHours: string;
  fax: string;
  companyName: string;
  addressLines: string[];
}

export type ClauseCategory =
  | 'Institute & Inland Clauses'
  | 'Special Conditions & Extensions'
  | 'Warranties & Declaration Terms'
  | 'Exclusions & Sanctions';

export interface ClauseItem {
  id: string;
  title: string;
  category: ClauseCategory;
  summary: string;
  fullText: string;
  defaultIncluded: boolean;
}

export interface MarineCertificateData {
  // System & Policy Auto Fields
  certificateNo: string; // Certificate Number (System Generated)
  policyNo: string; // Policy Number (Auto from Policy / non editable)
  policyStartDate: string; // Policy Start Date (Auto from Policy / non editable)
  policyEndDate: string; // Policy End Date (Auto from Policy / non editable)
  policyRate: string; // Policy rate: (Fixed from Policy, RM editable for High Risk)
  policyRateRmOverride: boolean;
  dateOfIssuance: string; // YYYY-MM-DD
  runNo: string;
  referenceCode: string;

  // Invoice & Transport Document
  invoiceNo: string; // Invoice No:
  invoiceDate: string; // Invoice Date:
  transportDocNo: string; // CTD/BL/AWB/GR/RR No :
  transportDocDate: string; // CTD/BL/AWB/GR/RR Date :

  // Insured & Valuation
  insurerName: string;
  issuingOfficeAddress: string;
  insuredName: string; // Insured: (Auto from Policy / Editable)
  insuredSubline: string;
  insuredAddress: string;
  gstNumber: string; // GST Number
  basisOfValuation: string; // Basis of Valuation :
  insuredValueInr: string; // Insured Value ( INR )
  secondaryCurrencyLabel: string;
  secondaryInsuredValue: string; // Insured Value ( 1)

  // Transit & Voyage
  transitType: string; // Transit Type
  modeOfTransport: string; // Mode of Transport
  portOfLoading: string; // Port of Loading
  portOfDischarge: string; // Port of Discharge
  voyageFrom: string; // Voyage From:
  voyageTo: string; // To:
  vesselConveyance: string; // Vessel/Conveyance

  // Consignor / Consignee & Cargo
  consignorConsigneeName: string; // Consignor / Consignee Name:
  consignorConsigneeAddress: string; // Consignor / Consignee Address
  descriptionOfGoods: string; // Description of Goods
  marksAndNos: string; // Marks & Nos/ Container No
  noAndKindOfPkgs: string; // No & Kind of Pkgs.
  commodity: string; // Commodity

  // Premium & LC
  premiumMarine: string;
  premiumOtherExtras: string;
  premiumWarSrcc: string;
  premiumGst: string;
  premiumTotal: string;
  lcCondition: string; // LC Condition :

  // Static / Autopopulated Clauses & Terms
  includedClauseIds: string[];
  customEndorsements: string;
  chequeRealizationNotice: string;
  declarationText: string;

  // Terms & Conditions / Insurer Claims Contacts
  localClaimsNoticeAddress: string;
  claimsPayableBy: string;
  surveyAgents: SurveyAgentContact[];

  // Signatories
  insuredSignatoryLabel: string;
  insuredCounterSignDate: string;
  insurerSignatoryLabel: string;
}

export interface SavedCertificateRecord {
  id: string;
  savedAt: string;
  status: 'Draft' | 'Issued';
  data: MarineCertificateData;
}
