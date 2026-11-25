import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileText,
  Printer,
  X,
} from 'lucide-react';
import { CertificateForm } from './components/CertificateForm';
import { CertificatePreview } from './components/CertificatePreview';
import { ClaimsDirectory } from './components/ClaimsDirectory';
import { ClausesManager } from './components/ClausesManager';
import { SavedRegister } from './components/SavedRegister';
import {
  CERTIFICATE_CLAUSES,
  createBlankCertificateData,
  generateSystemCertificateNumber,
} from './data/certificateDefaults';
import {
  MarineCertificateData,
  SavedCertificateRecord,
} from './types/certificate';
import { exportCertificateToCsv } from './utils/csvHelpers';
import { generateCertificatePdf } from './utils/pdfGenerator';

type AppTab = 'form' | 'clauses' | 'claims' | 'register';

const STORAGE_ACTIVE_KEY = 'marine_cert_active_v3';
const STORAGE_RECORDS_KEY = 'marine_cert_records_v3';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('form');

  const [records, setRecords] = useState<SavedCertificateRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RECORDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [certData, setCertData] = useState<MarineCertificateData>(() => {
    const initialBlank = createBlankCertificateData(
      generateSystemCertificateNumber(0)
    );
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_KEY);
      if (saved) {
        return { ...initialBlank, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore storage errors
    }
    return initialBlank;
  });

  const [previewModalData, setPreviewModalData] =
    useState<MarineCertificateData | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_KEY, JSON.stringify(certData));
    } catch {
      // Ignore quota errors
    }
  }, [certData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(records));
    } catch {
      // Ignore quota errors
    }
  }, [records]);

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    window.setTimeout(() => {
      setNoticeMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const buildClausesString = (data: MarineCertificateData) => {
    const selected = CERTIFICATE_CLAUSES.filter((c) =>
      data.includedClauseIds.includes(c.id)
    ).map((c) => c.fullText);
    if (data.customEndorsements.trim()) {
      selected.push(`Special Endorsements: ${data.customEndorsements.trim()}`);
    }
    return selected.join(' | ');
  };

  const handleDownloadPdf = async (target: MarineCertificateData) => {
    setIsDownloadingPdf(true);
    try {
      await generateCertificatePdf(target);
      showNotice(
        `Downloaded MARINE_CERTIFICATE_${target.certificateNo || 'DRAFT'}.pdf`
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const openCertificatePdfView = async (target: MarineCertificateData) => {
    const snapshot = { ...target };
    setPreviewModalData(snapshot);
    await handleDownloadPdf(snapshot);
  };

  const handleSubmitAndPrint = () => {
    const submittedSnapshot: MarineCertificateData = { ...certData };
    const id = `cert-${submittedSnapshot.certificateNo || Date.now()}-${Date.now()
      .toString()
      .slice(-4)}`;
    const newRecord: SavedCertificateRecord = {
      id,
      savedAt: new Date().toISOString(),
      status: 'Issued',
      data: submittedSnapshot,
    };
    const nextRecords = [newRecord, ...records];
    setRecords(nextRecords);
    setCertData(
      createBlankCertificateData(
        generateSystemCertificateNumber(nextRecords.length)
      )
    );
    void openCertificatePdfView(submittedSnapshot);
  };

  const handleSaveDraft = () => {
    const id = `draft-${certData.certificateNo || Date.now()}-${Date.now()
      .toString()
      .slice(-4)}`;
    const newRecord: SavedCertificateRecord = {
      id,
      savedAt: new Date().toISOString(),
      status: 'Draft',
      data: { ...certData },
    };
    setRecords((prev) => [newRecord, ...prev]);
    showNotice(
      `Draft saved for Certificate #${certData.certificateNo || 'New'}.`
    );
  };

  const handleExportCsv = (targetData: MarineCertificateData = certData) => {
    const csvContent = exportCertificateToCsv(
      targetData,
      buildClausesString(targetData)
    );
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MARINE_CERTIFICATE_${
      targetData.certificateNo || 'DRAFT'
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotice(
      `Exported MARINE_CERTIFICATE_${targetData.certificateNo || 'DRAFT'}.csv`
    );
  };

  const handleLoadRecord = (record: SavedCertificateRecord) => {
    setCertData({
      ...createBlankCertificateData(record.data.certificateNo),
      ...record.data,
    });
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotice(`Loaded Certificate #${record.data.certificateNo || 'Draft'}`);
  };

  const handlePrintRecord = (record: SavedCertificateRecord) => {
    void openCertificatePdfView(record.data);
  };

  const handleDuplicateRecord = (record: SavedCertificateRecord) => {
    const nextCert = generateSystemCertificateNumber(records.length);
    setCertData({
      ...createBlankCertificateData(nextCert),
      ...record.data,
      certificateNo: nextCert,
      invoiceNo: '',
      invoiceDate: '',
      transportDocNo: '',
      transportDocDate: '',
    });
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotice(`Duplicated as Certificate #${nextCert}`);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showNotice('Submitted form removed from list.');
  };

  const navItems: { id: AppTab; label: string }[] = [
    { id: 'form', label: 'Certificate Form' },
    { id: 'clauses', label: 'Clauses & Terms' },
    { id: 'claims', label: 'Claims Directory' },
    { id: 'register', label: `Submitted Forms (${records.length})` },
  ];

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#181818]">

      {/* AllianceForce Global Header (Strict 3-Zone Contract) */}
      <header className="no-print sticky top-0 z-30 border-b border-[#dddbda] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-4 py-2.5 sm:px-6">
          {/* Zone 1: Alliance CONNECT Brand Logo */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('form');
            }}
            className="inline-flex items-center shrink-0"
          >
            <img
              src="/assets/aistudio/Aliance_Connect1xpng_bbf2b9dc.png"
              alt="Alliance CONNECT"
              className="h-8 w-auto object-contain"
            />
          </a>

          {/* Zone 2: Concise Single-line Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-6 overflow-x-auto text-[13px] font-medium"
          >
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`border-b-[3px] py-2 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[#0176d3] font-semibold text-[#0176d3]'
                      : 'border-transparent text-[#444444] hover:border-[#c9c7c5] hover:text-[#0176d3]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => void openCertificatePdfView(certData)}
              className="inline-flex min-h-[36px] items-center gap-2 rounded border border-[#0176d3] bg-[#0176d3] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#014486] hover:border-[#014486] whitespace-nowrap shrink-0 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </header>

      {/* Transient Notification Banner */}
      {noticeMessage && (
        <div className="no-print mx-auto max-w-[1160px] px-4 pt-3 sm:px-6">
          <div
            role="status"
            className="flex items-center gap-2 rounded border border-[#2e844a]/30 bg-white px-4 py-2.5 text-xs font-medium text-[#181818] shadow-xs"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2e844a]" />
            <span>{noticeMessage}</span>
          </div>
        </div>
      )}

      {/* Main Screen Content (Hidden when printing PDF) */}
      <main className="no-print mx-auto max-w-[1160px] px-4 py-5 sm:px-6">
        {activeTab === 'form' && (
          <div className="space-y-6">
            {/* Lightning-style Object Header Card */}
            <div className="rounded border border-[#dddbda] bg-[#fafaf9] px-5 py-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#032d60] text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#514f4d]">
                      Marine Insurance Certificate
                    </div>
                    <h1 className="text-lg font-bold text-[#032d60]">
                      AllianceConnect Certificate Issuance
                    </h1>
                  </div>
                </div>

                <div className="text-right text-xs text-[#514f4d]">
                  <div className="font-mono-tabular font-medium text-[#181818]">
                    Open Policy {certData.policyNo}
                  </div>
                  <div>
                    System Certificate #{certData.certificateNo} ·{' '}
                    {records.length} Submitted
                  </div>
                </div>
              </div>
            </div>

            <CertificateForm
              data={certData}
              onChange={setCertData}
              onSubmitAndPrint={handleSubmitAndPrint}
              onSaveDraft={handleSaveDraft}
              onOpenClauses={() => setActiveTab('clauses')}
            />

            <SavedRegister
              embedded
              records={records}
              onLoadRecord={handleLoadRecord}
              onPrintRecord={handlePrintRecord}
              onDuplicateRecord={handleDuplicateRecord}
              onDeleteRecord={handleDeleteRecord}
              onDownloadCsv={(rec) => handleExportCsv(rec.data)}
            />
          </div>
        )}

        {activeTab === 'clauses' && (
          <ClausesManager
            includedClauseIds={certData.includedClauseIds}
            customEndorsements={certData.customEndorsements}
            onChangeIncludedIds={(ids) =>
              setCertData((prev) => ({ ...prev, includedClauseIds: ids }))
            }
            onChangeCustomEndorsements={(val) =>
              setCertData((prev) => ({ ...prev, customEndorsements: val }))
            }
          />
        )}

        {activeTab === 'claims' && (
          <ClaimsDirectory data={certData} onChange={setCertData} />
        )}

        {activeTab === 'register' && (
          <SavedRegister
            records={records}
            onLoadRecord={handleLoadRecord}
            onPrintRecord={handlePrintRecord}
            onDuplicateRecord={handleDuplicateRecord}
            onDeleteRecord={handleDeleteRecord}
            onDownloadCsv={(rec) => handleExportCsv(rec.data)}
          />
        )}
      </main>

      {/* PDF Certificate Preview & Print Modal */}
      {previewModalData && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Marine Insurance Certificate PDF"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 print:static print:block print:bg-white print:p-0"
        >
          <div className="w-full max-w-[920px] rounded border border-[#dddbda] bg-white shadow-xl print:max-w-full print:border-0 print:shadow-none">
            <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#dddbda] bg-[#fafaf9] px-5 py-3">
              <div>
                <h2 className="text-sm font-bold text-[#032d60]">
                  Marine Insurance Certificate #{previewModalData.certificateNo}
                </h2>
                <p className="text-xs text-[#514f4d]">
                  PDF file generated. You can also re-download or send directly
                  to a printer.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isDownloadingPdf}
                  onClick={() => void handleDownloadPdf(previewModalData)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded border border-[#0176d3] bg-[#0176d3] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#014486] disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  {isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded border border-[#c9c7c5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0176d3] hover:bg-[#f3f3f3] whitespace-nowrap shrink-0"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Browser Print
                </button>
                <button
                  type="button"
                  aria-label="Close certificate preview"
                  onClick={() => setPreviewModalData(null)}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded border border-[#c9c7c5] bg-white px-3 py-1.5 text-xs font-medium text-[#514f4d] hover:bg-[#f3f3f3] whitespace-nowrap shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 print:p-0">
              <CertificatePreview
                data={previewModalData}
                onPrint={() => window.print()}
                showToolbar={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Fallback print target when user triggers browser Ctrl+P directly without modal open */}
      {!previewModalData && (
        <div className="hidden print:block">
          <CertificatePreview
            data={certData}
            onPrint={() => window.print()}
            showToolbar={false}
          />
        </div>
      )}
    </div>
  );
}
