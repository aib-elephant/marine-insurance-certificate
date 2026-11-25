import React, { useMemo, useState } from 'react';
import { CopyPlus, Download, Printer, Search, Trash2 } from 'lucide-react';
import { SavedCertificateRecord } from '../types/certificate';
import { formatCertificateDate, formatIndianNumber } from '../utils/csvHelpers';

interface SavedRegisterProps {
  records: SavedCertificateRecord[];
  onLoadRecord: (record: SavedCertificateRecord) => void;
  onPrintRecord: (record: SavedCertificateRecord) => void;
  onDuplicateRecord: (record: SavedCertificateRecord) => void;
  onDeleteRecord: (id: string) => void;
  onDownloadCsv: (record: SavedCertificateRecord) => void;
  embedded?: boolean;
}

export const SavedRegister: React.FC<SavedRegisterProps> = ({
  records,
  onLoadRecord,
  onPrintRecord,
  onDuplicateRecord,
  onDeleteRecord,
  onDownloadCsv,
  embedded = false,
}) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Issued' | 'Draft'>(
    'All'
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((rec) => {
      const matchesStatus =
        statusFilter === 'All' || rec.status === statusFilter;
      const d = rec.data;
      const matchesQuery =
        !q ||
        d.certificateNo.toLowerCase().includes(q) ||
        d.policyNo.toLowerCase().includes(q) ||
        d.insuredName.toLowerCase().includes(q) ||
        d.descriptionOfGoods.toLowerCase().includes(q) ||
        d.voyageFrom.toLowerCase().includes(q) ||
        d.voyageTo.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [records, query, statusFilter]);

  return (
    <section
      className={
        embedded
          ? 'space-y-4 rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]'
          : 'space-y-5 rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]'
      }
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5e5] pb-3.5">
        <div>
          <h2 className="text-base font-bold text-[#032d60]">
            Submitted Forms ({records.length})
          </h2>
          <p className="mt-0.5 text-xs text-[#514f4d]">
            All submitted certificates and saved drafts. Print any entry to PDF
            or reload it into the form.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#747474]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search certificate #, insured, goods, voyage..."
            className="min-h-[38px] w-full rounded border border-[#c9c7c5] bg-white py-1.5 pr-3 pl-9 text-sm text-[#181818] placeholder:text-[#747474] focus:border-[#0176d3] focus:outline-none focus:ring-2 focus:ring-[#0176d3]/20"
          />
        </div>

        <div className="flex items-center gap-1 rounded border border-[#dddbda] bg-[#f3f3f3] p-1">
          {(['All', 'Issued', 'Draft'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`min-h-[32px] rounded px-3 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                statusFilter === status
                  ? 'bg-white text-[#0176d3] font-semibold shadow-xs'
                  : 'text-[#514f4d] hover:text-[#181818]'
              }`}
            >
              {status === 'Issued' ? 'Submitted' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded border border-[#dddbda] bg-[#fafaf9] p-10 text-center">
          <p className="text-sm font-semibold text-[#181818]">
            {records.length === 0
              ? 'No forms submitted yet'
              : 'No submitted forms match your filter'}
          </p>
          <p className="mt-1 text-xs text-[#514f4d]">
            {records.length === 0
              ? 'Fill in the certificate form above and click Submit & Print PDF to record your first submission.'
              : 'Try clearing your search or status filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-[#dddbda] bg-white">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#dddbda] bg-[#fafaf9] text-[11px] font-semibold uppercase tracking-wide text-[#514f4d]">
                <th className="px-4 py-3">Certificate / Policy</th>
                <th className="px-4 py-3">Insured</th>
                <th className="px-4 py-3">Issuance Date</th>
                <th className="px-4 py-3">Transit & Voyage</th>
                <th className="px-4 py-3 text-right">Insured Value (INR)</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filtered.map((rec) => {
                const d = rec.data;
                return (
                  <tr
                    key={rec.id}
                    className="transition-colors hover:bg-[#f3f3f3]/70"
                  >
                    <td className="px-4 py-3 font-mono-tabular">
                      <div className="font-semibold text-[#0176d3]">
                        #{d.certificateNo || '—'}
                      </div>
                      <div className="text-[11px] text-[#514f4d]">
                        {d.policyNo || 'No policy #'}
                      </div>
                    </td>
                    <td className="max-w-[200px] px-4 py-3">
                      <div className="truncate font-medium text-[#181818]">
                        {d.insuredName || '—'}
                      </div>
                      <div className="truncate text-[11px] text-[#514f4d]">
                        {d.descriptionOfGoods || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono-tabular text-[#3e3e3c] whitespace-nowrap">
                      {formatCertificateDate(d.dateOfIssuance)}
                    </td>
                    <td className="max-w-[240px] px-4 py-3 text-[#3e3e3c]">
                      <div className="truncate font-medium text-[#181818]">
                        {d.voyageFrom || '—'} → {d.voyageTo || '—'}
                      </div>
                      <div className="text-[11px] text-[#514f4d]">
                        {d.transitType || '—'} · {d.modeOfTransport || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono-tabular font-semibold text-[#181818] whitespace-nowrap">
                      {d.insuredValueInr
                        ? `₹ ${formatIndianNumber(d.insuredValueInr)}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          rec.status === 'Issued'
                            ? 'text-[#2e844a]'
                            : 'text-[#b45309]'
                        }`}
                      >
                        {rec.status === 'Issued' ? 'Submitted' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPrintRecord(rec)}
                          className="inline-flex min-h-[32px] items-center gap-1 rounded border border-[#0176d3] bg-[#0176d3] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#014486] hover:border-[#014486]"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          Print PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => onLoadRecord(rec)}
                          className="min-h-[32px] rounded border border-[#c9c7c5] bg-white px-2.5 py-1 text-xs font-medium text-[#0176d3] hover:bg-[#f3f3f3]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          title="Duplicate for next shipment"
                          onClick={() => onDuplicateRecord(rec)}
                          className="inline-flex min-h-[32px] items-center justify-center rounded border border-[#c9c7c5] bg-white p-1.5 text-[#514f4d] hover:bg-[#f3f3f3]"
                        >
                          <CopyPlus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Export CSV"
                          onClick={() => onDownloadCsv(rec)}
                          className="inline-flex min-h-[32px] items-center justify-center rounded border border-[#c9c7c5] bg-white p-1.5 text-[#514f4d] hover:bg-[#f3f3f3]"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete record"
                          onClick={() => onDeleteRecord(rec.id)}
                          className="inline-flex min-h-[32px] items-center justify-center rounded border border-[#c9c7c5] bg-white p-1.5 text-[#ba0517] hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
