import {
  ClauseItem,
  MarineCertificateData,
  SurveyAgentContact,
} from '../types/certificate';

export const TRANSIT_TYPES = [
  'Domestic Purchases',
  'Import Details',
  'Export Details',
  'Domestic Sales',
] as const;

export const TRANSPORT_MODES = [
  'Air',
  'Road',
  'Rail',
  'Sea',
  'Courier',
] as const;

export const VALUATION_BASES = [
  'Invoice+10%+duty',
  'Invoice + 10%',
  'New Capital Goods - Invoice + 10% + Duty',
] as const;

export const OPEN_POLICY_MASTER = {
  insurerName: 'IndusInd General Insurance Company Limited',
  issuingOfficeAddress:
    '6th Floor, Oberoi Commerz, International Business Park, Oberoi Garden City, Off Western Express Highway, Goregaon (East), Mumbai - 400 063.',
  policyNo: '11012262429M003046',
  policyStartDate: '2026-04-01',
  policyEndDate: '2027-03-31',
  policyRate: 'As per Policy (0.05%)',
  claimsPayableBy: 'Claims payable by : Indusind General Insurance Company Limited, Punjab',
  termsAndConditionsAddress:
    'In the event of loss or damage which may involve this certificate, immediate notice of loss or damage should be given to the company at the following address:Indusind General Insurance Company Limited, 1st Floor, Sco 2, PUDA Complex, Ladowali Road,, JALANDHAR, PUNJAB, INDIA,PinCode-144007',
};

export const DEFAULT_SURVEY_AGENTS: SurveyAgentContact[] = [
  {
    id: 'america',
    region: 'America',
    email: 'info@wkwebsteroverseas.com',
    phone: '(+1) 212 269 8220',
    afterHours: '(+1) 212 398 8118',
    fax: '(+1) 212 363 9726',
    companyName: 'W. K. Webster (Overseas) Ltd.',
    addressLines: ['80, Maiden Lane, New York,', 'NY10038, USA'],
  },
  {
    id: 'emea',
    region: 'Europe, Africa & Middle East',
    email: 'info@wkwebster.com',
    phone: '+44 (0) 20 - 8300 7744',
    afterHours: '+44 (0) 20 - 8300 7744',
    fax: '+44 (0) 20 - 8309 1266',
    companyName: 'W. K. Webster & Co. Ltd.',
    addressLines: ['Christopher House, Station Rd,', 'Sidcup / Kent, DA15 7BS, U.K.'],
  },
  {
    id: 'apac',
    region: 'Asia - Far East',
    email: 'info@wkwebster.com.sg',
    phone: '(+65) 6222 6022',
    afterHours: '(+65) 9732 1958',
    fax: '(+65) 6225 0428',
    companyName: 'W. K. Webster (International) Pte. Ltd.',
    addressLines: ['139 Cecil Street, #10-00 Cecil House,', 'Singapore, 069539'],
  },
];

export const CERTIFICATE_CLAUSES: ClauseItem[] = [
  {
    id: 'icc-a-382',
    title: 'Institute Cargo Clauses (A) Cl 382 (01/01/2009)',
    category: 'Institute & Inland Clauses',
    summary: 'All-risks marine cargo cover subject to specified exclusions.',
    fullText: 'Institute Cargo Clauses (A) Cl 382 dated 1/1/2009',
    defaultIncluded: true,
  },
  {
    id: 'icc-b-383',
    title: 'Institute Cargo Clauses (B) Cl 383 (01/01/2009)',
    category: 'Institute & Inland Clauses',
    summary: 'Named perils marine cargo cover for applicable shipments.',
    fullText: 'Institute Cargo Clauses (B) Cl 383 dated 1/1/2009',
    defaultIncluded: true,
  },
  {
    id: 'icc-air-387',
    title: 'Institute Cargo Clauses (Air) Cl 387 (01/01/2009)',
    category: 'Institute & Inland Clauses',
    summary: 'Air freight cargo cover excluding sendings by Post.',
    fullText: 'Institute Cargo Clauses (Air) Cl 387 dated 1/1/2009 (excluding sendings by Post)',
    defaultIncluded: true,
  },
  {
    id: 'itc-a-2010',
    title: 'Inland Transit (Rail/Road/Air) Clause - "A" 2010',
    category: 'Institute & Inland Clauses',
    summary: 'All-risks domestic rail, road, and air transit coverage.',
    fullText: 'Inland Transit (Rail/Road/Air) Clause - "A" 2010',
    defaultIncluded: true,
  },
  {
    id: 'itc-b-2010',
    title: 'Inland Transit (Rail/Road) Clause - "B" 2010',
    category: 'Institute & Inland Clauses',
    summary: 'Basic named perils domestic rail/road transit coverage.',
    fullText: 'Inland Transit (Rail/Road) Clause - "B" 2010',
    defaultIncluded: true,
  },
  {
    id: 'war-srcc',
    title: 'Institute War & Strikes Clauses (Cargo & Air Cargo)',
    category: 'Institute & Inland Clauses',
    summary: 'Strike, Riot & Civil Commotion, Cl 385/386 (Cargo), Cl 388/389 (Air) & Cancellation Clauses.',
    fullText:
      'Strike, Riot & Civil Commotion Clause; Institute War Clauses (Cargo) Cl 385 dated 1/1/2009; Institute Strikes Clauses (Cargo) Cl 386 dated 1/1/2009; Institute War Clauses (Air Cargo) Cl 388 01/01/2009; Institute Strike Clauses (Air Cargo) Cl 389 01/01/2009; Institute Strike Cancellation Clause (Air Cargo) 01/01/2009; Institute War Cancellation Clause (Air Cargo) 01/01/2009; Institute Strike Cancellation Clause (Cargo) 01/01/2009; Institute War Cancellation Clause (Cargo) 01/01/2009.',
    defaultIncluded: true,
  },
  {
    id: 'radioactive-370-356a',
    title: 'Radioactive Contamination & Chemical/Biological Exclusion (Cl 370 & Cl 356A)',
    category: 'Institute & Inland Clauses',
    summary: 'CL 370 (10/11/2003) & Extended CL 356A (01/11/2002) exclusions.',
    fullText:
      'Institute Radioactive Contamination, Chemical, Biological, Bio-Chemical And Electromagnetic Weapons Exclusion Clause Cl 370 dated 10/11/2003; Institute Extended Radioactive Contamination Exclusion Clause Cl 356 A dated 1/11/2002.',
    defaultIncluded: true,
  },
  {
    id: 'ism-classification',
    title: 'Cargo ISM Endorsement (JC 98/019) & Institute Classification Clause (CL 354)',
    category: 'Institute & Inland Clauses',
    summary: 'Vessel classification and ISM safety management compliance.',
    fullText:
      'Cargo ISM Endorsement (1 May 1998) JC 98/019; Institute Classification Clause CL 354 1/1/2001.',
    defaultIncluded: true,
  },
  {
    id: 'post-courier',
    title: 'Important Notice & Registered Post Parcel / Courier Clauses',
    category: 'Institute & Inland Clauses',
    summary: 'Registered Post Parcel Clause and amended courier transit terms.',
    fullText:
      'Important Notice Clause; Registered Post Parcel Clause; Registered Post Parcel Clause (amended for courier).',
    defaultIncluded: true,
  },
  {
    id: 'cyber-jx2020-lma5403',
    title: 'Cyber Losses Clauses (JX2020-007 & LMA 5403)',
    category: 'Institute & Inland Clauses',
    summary: 'Joint Excess of Loss Cyber Losses Clause & Marine Cyber Endorsement LMA5403.',
    fullText:
      'Joint Excess of Loss Cyber Losses Clause JX2020-007; Marine Cyber Endorsement Clause LMA5403.',
    defaultIncluded: true,
  },
  {
    id: 'termination-storage-2020',
    title: 'Cargo Termination of Storage in Transit & Terrorism Clauses (Amended 2020)',
    category: 'Institute & Inland Clauses',
    summary: '2020 amended storage in transit and terrorism termination clauses.',
    fullText:
      'Cargo Termination of Storage in Transit Clause Amended Version (2020); Cargo Termination of Transit Clause (Terrorism) - Clause Amended Version (2020).',
    defaultIncluded: true,
  },
  {
    id: 'high-sea-sales',
    title: 'High Sea Sales & Purchases Condition',
    category: 'Special Conditions & Extensions',
    summary: 'Covered under ITC(B)/ICC(B) + W + SRCC + Non-delivery subject to Incoterms & agreement.',
    fullText:
      'High Sea Sales & Purchases to be covered under the Policy subject to (1) coverage as per clause ITC(B)/ICC(B) + W + SRCC + Non delivery of entire cargo. (2) Cover Subject to Incoterms (3) Cover Subject to Insurable Interest (4) Cover subject to High Sea Sales/Purchases Agreement.',
    defaultIncluded: true,
  },
  {
    id: 'on-account-payment',
    title: 'On Account Payment Condition (> INR 15,00,000)',
    category: 'Special Conditions & Extensions',
    summary: 'Up to 50% interim payment for claims above INR 15 Lakhs upon surveyor interim report.',
    fullText:
      'On account payment - PAYMENT ON ACCOUNT CONDITION (applicable where claims amount above INR 15,00,000): It is condition of this policy that on account payment shall be payable upto 50% subject to Surveyors Interim Report and Insurers Claims team approval subject to recommendation from surveyor.',
    defaultIncluded: true,
  },
  {
    id: 'process-clause',
    title: 'Process Clause',
    category: 'Special Conditions & Extensions',
    summary: 'Excludes loss/damage directly caused by trade, manufacturing process, or usage.',
    fullText:
      'Process Clause - It is hereby noted and agreed that the loss, damage or destruction directly caused by any risk of trade, manufacturing process and/or treatment and/or usage or demonstration is specifically excluded.',
    defaultIncluded: true,
  },
  {
    id: 'expense-sublimits',
    title: 'Loss Minimization, Salvage, Freight, Port & Claim Prep Sub-Limits',
    category: 'Special Conditions & Extensions',
    summary: 'Actuals for loss minimization; INR 25L salvage/freight/port; INR 2.5L/10L expediting; INR 10k/50k claim prep.',
    fullText:
      'Loss Minimization expenses Covered AT ACTUALS subject to the expenses being reasonable and recommended by surveyor; Salvage Incineration Cost for INR 25 lacs on AOA/AOY basis; Express Freight Costs for INR 25 Lacs on AOA/AOY basis; Expediting Expenses Covered AOA 2.50 lacs & INR 10 lacs AOY; Port Cleaning Charges: AOA INR 25 lakhs, AOY 50 lakhs; Claim Preparation Cost: AOA INR 10,000 and AOY INR 50,000.',
    defaultIncluded: true,
  },
  {
    id: 'tail-end-transit',
    title: 'Tail End Transit Coverage (CIF Imports from Indian Port)',
    category: 'Special Conditions & Extensions',
    summary: 'ITC B + SRCC + Non-delivery without pre-dispatch survey; ITC A + SRCC with pre-dispatch survey.',
    fullText:
      'For imported shipments purchased on CIF basis where the risk is originating from any Indian port Tail End Transit coverage will be as follows. Without Pre Dispatch Survey Coverage will be ITC B + SRCC + Non delivery of whole consignment. With Pre Dispatch Survey Subject to all the recommendation of the surveyor is complied then coverage will be extended to ITC A + SRCC.',
    defaultIncluded: true,
  },
  {
    id: 'mercantile-trade',
    title: 'Third Country Sales / Mercantile Trade Movements',
    category: 'Special Conditions & Extensions',
    summary: 'Requires invoice from India, FX repatriation, and insurable interest per contract.',
    fullText:
      'Third Country sales/Mercantile Trade movements - For Merchant Trade Invoice to be Raised from India and Remittance come to India Through Proper channel, Warranted that the sales proceeds will be repatriated to India in foreign exchange. Also warranted that as per contract of sale / purchase, the insured is responsible for arranging transit insurance for the items covered under this policy (applicable for transactions between two countries outside India). Mercantile export subject to insurable interest, INCO terms and compliance of GIM guidelines.',
    defaultIncluded: true,
  },
  {
    id: 'self-survey-waiver',
    title: 'Self Survey, Waiver of Subrogation & Waiver of FIR (Up to INR 50,000)',
    category: 'Special Conditions & Extensions',
    summary: 'Claims up to INR 50,000 eligible for self-survey, subrogation waiver, and FIR waiver (exclusions apply).',
    fullText:
      'Self Survey for claims up to INR 50,000; Waiver of Subrogation letter - for claims upto INR 50,000; Waiver of FIR up to INR 50,000 (excluding accidental claims, theft, hijacking & pilferage) subject to LR being endorsed and police complaint being lodged.',
    defaultIncluded: true,
  },
  {
    id: 'multi-transit-demurrage',
    title: 'Multi Transit Cover, Container Demurrage & Cleaning Cost',
    category: 'Special Conditions & Extensions',
    summary: 'Covers multimodal transshipment during ordinary transit, demurrage on insurer hold, and INR 25L container cleaning.',
    fullText:
      'MULTI TRANSIT COVER CONDITION - Coverage includes transit by various mode of conveyance including transshipment during the ordinary course of transit. Where the goods are put in storage other than in ordinary course of transit and/or for allocation and distribution, the transit cover shall cease. CONTAINER, TRAILER / RAILCAR DEMURRAGE CHARGES - Underwriters will pay demurrage charges assessed while holding container/trailer/railcar per Underwriters instruction. Container Cleaning Cost for INR 25 Lacs on AOA/AOY; Multi Modal Cover / Multi Voyage cover.',
    defaultIncluded: true,
  },
  {
    id: 'machinery-pair-brand-label',
    title: 'Machinery Replacement, Pair & Set, Brand Protection & Label Clauses',
    category: 'Special Conditions & Extensions',
    summary: 'Institute Replacement, Second Hand Machinery proportional settlement, Pair & Set, Brand Protection, and Label reconditioning.',
    fullText:
      'Institute Replacement clause; Second Hand Machinery Replacement Clause (proportionate settlement, Used Machinery valued at depreciated market value as on date of loss); Pair and set clause; BRAND PROTECTION CLAUSE (salvage determined after removal of brand/trademarks); Label Clause (cost of reconditioning, new labels and relabeling).',
    defaultIncluded: true,
  },
  {
    id: 'error-omission-contingency',
    title: 'Error & Omission, Sellers Contingency & Buyers Interest Contingency',
    category: 'Special Conditions & Extensions',
    summary: 'Protects bonafide declaration errors and FOB/C&F seller or CIF buyer contingent interests.',
    fullText:
      'ERROR & OMMISSION CLAUSE - Any bonafide errors and/or omissions in declarations shall not invalidate contract provided rectified promptly. SELLERS CONTINGENCY INSURANCE CLAUSE (FOB/C&F sales where buyer fails to insure/pay/accept). BUYERS INTEREST CONTINGENCY RISK CLAUSE (CIF purchases where seller fails to insure or insurer fails to pay).',
    defaultIncluded: true,
  },
  {
    id: 'container-fob-seals',
    title: 'Container Conditions, FOB Clause & Seals Intact Clause',
    category: 'Special Conditions & Extensions',
    summary: 'Container cover on ITC B + SRCC + Non-delivery (depreciated value); FOB sling loss / 2 weeks port storage; Seals intact theft/shortage protection.',
    fullText:
      'CONDITIONS APPLICABLE FOR CONTAINER (Subject matter Container, max liability assessed workshop repair cost in India, ITC B + SRCC + Non delivery, Depreciated Market Value). FOB CLAUSE (until placed on board vessel incl. sling loss or 2 weeks post arrival at port/docks). SEALS INTACT CLAUSE (intact seal at unloading shall not invalidate theft, pilferage, shortage and non-delivery claims with loading proof).',
    defaultIncluded: true,
  },
  {
    id: 'infestation-concealed-missing',
    title: 'Infestation/Contamination (INR 25L), Concealed Damage (30d) & Missing Goods (90d)',
    category: 'Special Conditions & Extensions',
    summary: 'INR 25L AOA/AOY limit for taint/moisture/infestation; 30-day concealed damage window; 90-day presumed total loss.',
    fullText:
      'Cover for Infestation, Mould, Mildew, Fungus, Vermin, Pest, Taint Damage, Contamination & Adulteration, Discoloration, Heating, sweating, condensation and fermentation losses for AOA and AOY of INR 25 Lacs. CONCEALED DAMAGE CLAUSE (packages opened within 30 days of arrival). MISSING GOODS CLAUSE (presumed actual total loss after 90 days from expected delivery).',
    defaultIncluded: true,
  },
  {
    id: 'shutout-fumigation-forwarding',
    title: 'Shut Out Cargo (14d), Fumigation, Forwarding, Sorting & Debris Removal',
    category: 'Special Conditions & Extensions',
    summary: '14-day shutout extension; fumigation damage; 10% sub-limits for forwarding charges, sorting charges, and debris removal.',
    fullText:
      'Shut Out Cargo Clause (extended up to 14 days waiting for alternative conveyance); Fumigation Clause; FORWARDING CHARGES CLAUSE (sub-limit 10% of claim amount); Sorting Charges (up to 10% of claim value); DEBRIS REMOVAL CLAUSE (up to 10% of value of damaged subject matter removed, excluding pollution/vessel removal).',
    defaultIncluded: true,
  },
  {
    id: 'duty-civil-ga-airfreight',
    title: 'Notional Duty, Duty Clause, Civil Authority, General Average & Airfreight Replacement',
    category: 'Special Conditions & Extensions',
    summary: 'Covers duty-free import contingencies, civil authority conflagration, York-Antwerp GA/salvage, and up to 10% airfreight replacement.',
    fullText:
      'NOTIONAL DUTY CLAUSE; DUTY CLAUSE; Civil Authority Clause; General Average, Salvage & Special Charges Clause (York Antwerp Rules); AIRFREIGHT REPLACEMENT / CHARGES CLAUSE (max 10% of value of item lifted by Air).',
    defaultIncluded: true,
  },
  {
    id: 'innocent-sue-loc-dic-knowledge',
    title: 'Innocent Assured, Sue & Labour, Letter of Credit, DIC & Knowledge of Occurrence',
    category: 'Special Conditions & Extensions',
    summary: 'Protects against carrier dishonesty, covers mitigation costs, enables LC compliance, and defines corporate knowledge.',
    fullText:
      'INNOCENT ASSURED CLAUSE; SUE AND LABOUR CLAUSE; Letter of Credit Clause; Difference in Conditions Clause (DIC); KNOWLEDGE OF OCCURRENCE CLAUSE.',
    defaultIncluded: true,
  },
  {
    id: 'barge-returns-delay-ga',
    title: 'Barge Approval, Returns Coverage (ICC/ITC B) & Delay Caused by GA',
    category: 'Special Conditions & Extensions',
    summary: 'Barge movements require prior underwriting approval; purchase/sales returns restricted to ICC/ITC(B)+W/SRCC+Non-delivery.',
    fullText:
      'Barge Movements can be covered subject to prior u/w approval and terms; In case of Purchases Returns / Sales returns: Coverage restricted to ICC/ITC (B) + W/SRCC + Non Delivery of the entire consignment; Delay in claim intimation - as per standard process; DELAY CAUSED BY GA; Used/rejected/refurbished/sent for repairs/returned cargo covered on ITC B/ ICC B basis and on Depreciated Value.',
    defaultIncluded: true,
  },
  {
    id: 'limitation-private-carriers',
    title: 'Limitation of Liability & Private Carriers Warranty (90% / 200 Km Waiver)',
    category: 'Warranties & Declaration Terms',
    summary: '90% liability cap for private carriers / special contracts / own vehicle; waived for movements within 200 Kms.',
    fullText:
      'Limitation of Liability Clause & PRIVATE CARRIERS WARRANTY: Insurers liability limited up to 90% of assessed loss where consignment note limits carrier liability, is issued by private carrier/freight broker, transported in insureds own vehicle, or recovery rights not protected. Limitation of Liability Clause stands waived in respect of movements within 200 Kms.',
    defaultIncluded: true,
  },
  {
    id: 'capital-goods-indigenous',
    title: 'Capital Goods Declaration & Indigenous Sales / Interunit Exclusion',
    category: 'Warranties & Declaration Terms',
    summary: 'Capital goods require separate SI declaration; indigenous sales & interunit transfers not covered.',
    fullText:
      'Coverage for Capital goods shall be subject to separate declaration of SI and prior payment of additional premium as per policy rate. Indigenous sales and Interunit Transfers - NOT Covered under the policy.',
    defaultIncluded: true,
  },
  {
    id: 'declarations-premium-adjustment',
    title: 'Quarterly Declarations, Books Inspection & Premium Adjustment Condition',
    category: 'Warranties & Declaration Terms',
    summary: 'Submit before 7th of subsequent quarter (gross sales + 10%); 60% minimum retention, max 40% refund/rollover, INR 1L non-refundable deposit.',
    fullText:
      'Declarations as per agreed format to be submitted before 7th of subsequent quarter. Insured to declare total gross sales (including ex-works sales) + 10% mark up without any exception. Insurer reserves right to inspect books of accounts. PREMIUM ADJUSTMENT CONDITION: Minimum retention 60%; option for 40% refund/rollover if requested within 2 months of expiry; INR 1 lac plus GST treated as Non Refundable Deposit.',
    defaultIncluded: true,
  },
  {
    id: 'claused-bol',
    title: 'Claused Bills of Lading Clause',
    category: 'Warranties & Declaration Terms',
    summary: 'Cover not prejudiced solely by claused B/L markings on packing or carrier liability.',
    fullText:
      'CLAUSED BILLS OF LADING CLAUSE - This insurance is not to be prejudiced solely by the reason of the marking of the Bill of Lading (or like document) with a clause indicating items insufficiently packed and/or by Ship owners limiting or nullifying their liability.',
    defaultIncluded: true,
  },
  {
    id: 'cargo-type-exclusions',
    title: 'Bulk, Open Trailer, Road Tanker & Reefer Exclusions',
    category: 'Exclusions & Sanctions',
    summary: 'Excludes bulk cargo, open trailer, road tanker movements, reefer cargo, and intentional insured-controlled storage.',
    fullText:
      'Excluding coverage for movement of Bulk Cargo and Cargo in open Trailer, Road Tanker Movement from the scope of this policy; Reefer cargoes are not covered under the scope of the policy; Excluding any Intentional storage/storage where cargo is in control of the insured.',
    defaultIncluded: true,
  },
  {
    id: 'physical-damage-exclusions',
    title: 'Chipping/Dent/Scratch, Electrical/Mechanical, Rusting & Fragile Exclusions',
    category: 'Exclusions & Sanctions',
    summary: 'Excludes cosmetic, electrical/mechanical derangement, rust/oxidation, and ceramic/glass unless caused by accidental visible physical means or ICC(B)/ITC(B) perils.',
    fullText:
      'Excluding the risks of loss or damage due to chipping, denting, scratching, breaking, bending, cracking, paint / polish damage unless caused by accidental, visible & Physical means; Excluding all electrical, mechanical, electronic, electromechanical and internal derangement losses unless caused by accidental, visible & Physical means; Excluding rusting, oxidation and pitting losses unless caused by accidental, visible & Physical means; Excluding loss or damage to Ceramic/glass/fragile items unless caused by perils insured under ICC(B)/ITC(B)/Air Shipment on Basic Terms Endorsement.',
    defaultIncluded: true,
  },
  {
    id: 'odc-owc-exclusion',
    title: 'Over Dimensional Cargo (ODC) & Over Weight Cargo (OWC) Exclusion',
    category: 'Exclusions & Sanctions',
    summary: 'Excludes items > 12m L / 2.5m W / 2.5m H or weight > 55 MT.',
    fullText:
      'It is condition of the policy that any cargo defined as OVERDIMENSIONAL CARGO/OVERWEIGHT CARGO/CRITICAL CARGO will not be covered under the policy. ODC: Any items (including packaging) > 12m length and/or 2.5m wide and/or 2.5m high. OWC (Heavy Lift): Any item including packing > 55 MT.',
    defaultIncluded: true,
  },
  {
    id: 'sanctions-lma3100-iran-rub',
    title: 'Sanction Limitation (LMA 3100), RUB Exclusion & Iran Exclusion',
    category: 'Exclusions & Sanctions',
    summary: 'UN/EU/UK/US/Swiss sanctions compliance, Russia/Ukraine/Belarus/Moldova conflict exclusion, and Iran origin/interest exclusion.',
    fullText:
      'SANCTION LIMITATION AND EXCLUSION CLAUSE LMA 3100 (Amended); RUB Exclusion (conflicts involving Russian armed forces in Ukraine, Belarus, Moldova, Russian Federation including Donetsk, Luhansk, Crimea); IRAN EXCLUSION CLAUSE.',
    defaultIncluded: true,
  },
  {
    id: 'five-powers-war-hra',
    title: 'Five Powers War (JC2023-024), 72h War/Strike Termination & Listed HRA Exclusion',
    category: 'Exclusions & Sanctions',
    summary: 'Excludes war among 5 powers (UK, US, France, Russia, China), 72h cancellation notice, and Red Sea/Gulf of Aden/Persian Gulf HRA War & SRCC unless prior written agreement.',
    fullText:
      'Five Powers War Clause JC2023-024 6th Jan 2023; War and Strike Risk Termination Clause (72 hours notice of cancellation); Excluding War and Strikes, Riots & Civil Commotion (SRCC) risks in respect of any transit to, from or through Listed High Risk Areas (Red Sea, Gulf of Aden, Bab-el-Mandeb Strait, Persian Gulf, Gulf of Oman & adjacent waters) unless specifically agreed in writing prior to attachment of risk.',
    defaultIncluded: true,
  },
  {
    id: 'communicable-disease-lma5394',
    title: 'Communicable Disease Exclusion LMA 5394 (Amended)',
    category: 'Exclusions & Sanctions',
    summary: 'Excludes losses directly or indirectly arising out of communicable diseases.',
    fullText:
      'COMMUNICABLE DISEASE EXCLUSION LMA 5394 (amended) excluding any loss, damage, liability, claim, cost or expense directly or indirectly caused by or in connection with a Communicable Disease.',
    defaultIncluded: true,
  },
];

export function generateSystemCertificateNumber(existingCount = 0): string {
  const base = 2294101 + existingCount;
  return String(base);
}

export function createBlankCertificateData(
  certificateNo = generateSystemCertificateNumber(0)
): MarineCertificateData {
  const todayIso = new Date().toISOString().slice(0, 10);
  return {
    certificateNo,
    policyNo: OPEN_POLICY_MASTER.policyNo,
    policyStartDate: OPEN_POLICY_MASTER.policyStartDate,
    policyEndDate: OPEN_POLICY_MASTER.policyEndDate,
    policyRate: OPEN_POLICY_MASTER.policyRate,
    policyRateRmOverride: false,
    dateOfIssuance: todayIso,
    runNo: '',
    referenceCode: '',

    invoiceNo: '',
    invoiceDate: '',
    transportDocNo: '',
    transportDocDate: '',

    insurerName: OPEN_POLICY_MASTER.insurerName,
    issuingOfficeAddress: OPEN_POLICY_MASTER.issuingOfficeAddress,
    insuredName: '',
    insuredSubline: '',
    insuredAddress: '',
    gstNumber: '',
    basisOfValuation: '',
    insuredValueInr: '',
    secondaryCurrencyLabel: 'Insured Value ( 1)',
    secondaryInsuredValue: '',

    transitType: '',
    modeOfTransport: '',
    portOfLoading: '',
    portOfDischarge: '',
    voyageFrom: '',
    voyageTo: '',
    vesselConveyance: '',

    consignorConsigneeName: '',
    consignorConsigneeAddress: '',
    descriptionOfGoods: '',
    marksAndNos: '',
    noAndKindOfPkgs: '',
    commodity: '',

    premiumMarine: 'As per Policy',
    premiumOtherExtras: 'As per Policy',
    premiumWarSrcc: 'As per Policy',
    premiumGst: 'As per Policy',
    premiumTotal: 'As per Policy',
    lcCondition: '',

    includedClauseIds: CERTIFICATE_CLAUSES.filter((c) => c.defaultIncluded).map(
      (c) => c.id
    ),
    customEndorsements: '',
    chequeRealizationNotice:
      'This certificate is issued subject to realization of cheque',
    declarationText:
      'This is to certify that insurance of the above mentioned goods has been effected with this Company as per details specified in the Schedule herein above subject to the terms and conditions of the relative Open Policy and special conditions mentioned above.',

    localClaimsNoticeAddress:
      'Indusind General Insurance Company Limited, 1st Floor, Sco 2, PUDA Complex, Ladowali Road,, JALANDHAR, PUNJAB, INDIA,PinCode-144007',
    claimsPayableBy: 'Indusind General Insurance Company Limited, Punjab',
    surveyAgents: DEFAULT_SURVEY_AGENTS,

    insuredSignatoryLabel: '',
    insuredCounterSignDate: '',
    insurerSignatoryLabel: 'For Indusind General Insurance Co Ltd',
  };
}

export const BLANK_CERTIFICATE_DATA: MarineCertificateData =
  createBlankCertificateData();
