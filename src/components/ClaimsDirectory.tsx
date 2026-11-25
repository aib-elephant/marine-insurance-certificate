import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { MarineCertificateData, SurveyAgentContact } from '../types/certificate';

interface ClaimsDirectoryProps {
  data: MarineCertificateData;
  onChange: (updated: MarineCertificateData) => void;
}

export const ClaimsDirectory: React.FC<ClaimsDirectoryProps> = ({
  data,
  onChange,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    });
  };

  const updateAgent = (
    idx: number,
    patch: Partial<SurveyAgentContact>
  ) => {
    const next = data.surveyAgents.map((agent, i) =>
      i === idx ? { ...agent, ...patch } : agent
    );
    onChange({ ...data, surveyAgents: next });
  };

  const inputCls =
    'w-full min-h-[38px] rounded border border-[#c9c7c5] bg-white px-3 py-1.5 text-xs text-[#181818] focus:border-[#0176d3] focus:outline-none focus:ring-2 focus:ring-[#0176d3]/20';

  return (
    <div className="space-y-5">
      <div className="rounded border border-[#dddbda] bg-[#fafaf9] px-5 py-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
        <h1 className="text-lg font-bold text-[#032d60]">
          Claims & Survey Agent Directory
        </h1>
        <p className="mt-0.5 text-xs text-[#514f4d]">
          W. K. Webster international survey offices and local insurer claims
          settlement address printed on the certificate.
        </p>
      </div>

      {/* Local Claims Settlement */}
      <section className="rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
        <h2 className="text-[15px] font-bold text-[#032d60]">
          Local Insurer Claims Notice & Payable Office
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="localClaimsNoticeAddress"
              className="mb-1.5 block text-xs font-semibold text-[#3e3e3c]"
            >
              Immediate Notice of Loss Address (Domestic)
            </label>
            <textarea
              id="localClaimsNoticeAddress"
              rows={3}
              value={data.localClaimsNoticeAddress}
              onChange={(e) =>
                onChange({ ...data, localClaimsNoticeAddress: e.target.value })
              }
              className="w-full rounded border border-[#c9c7c5] bg-white px-3 py-2 text-sm text-[#181818] focus:border-[#0176d3] focus:outline-none focus:ring-2 focus:ring-[#0176d3]/20"
            />
          </div>

          <div>
            <label
              htmlFor="claimsPayableBy"
              className="mb-1.5 block text-xs font-semibold text-[#3e3e3c]"
            >
              Claims Payable By
            </label>
            <input
              id="claimsPayableBy"
              type="text"
              value={data.claimsPayableBy}
              onChange={(e) =>
                onChange({ ...data, claimsPayableBy: e.target.value })
              }
              className="min-h-[40px] w-full rounded border border-[#c9c7c5] bg-white px-3 py-2 text-sm text-[#181818] focus:border-[#0176d3] focus:outline-none focus:ring-2 focus:ring-[#0176d3]/20"
            />
          </div>
        </div>
      </section>

      {/* W. K. Webster Survey Matrix */}
      <section className="rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
        <div className="mb-4">
          <h2 className="text-[15px] font-bold text-[#032d60]">
            W. K. Webster International Survey Agents
          </h2>
          <p className="text-xs text-[#514f4d]">
            Regional loss notification contacts embedded into every certificate.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {data.surveyAgents.map((agent, idx) => (
            <div
              key={agent.id}
              className="flex flex-col gap-3 rounded border border-[#dddbda] bg-[#fafaf9] p-4"
            >
              <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-2">
                <span className="text-sm font-bold text-[#032d60]">
                  {agent.region}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      agent.id,
                      `${agent.companyName}\n${agent.addressLines.join(' ')}\nEmail: ${agent.email}\nPhone: ${agent.phone}\nAfter Hours: ${agent.afterHours}`
                    )
                  }
                  className="inline-flex min-h-[32px] items-center gap-1 rounded border border-[#c9c7c5] bg-white px-2.5 py-1 text-xs font-medium text-[#0176d3] hover:bg-[#f3f3f3] whitespace-nowrap shrink-0"
                >
                  {copiedId === agent.id ? (
                    <>
                      <Check className="h-3 w-3 text-[#2e844a]" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#514f4d]">
                  Email
                </label>
                <input
                  type="email"
                  value={agent.email}
                  onChange={(e) => updateAgent(idx, { email: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#514f4d]">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={agent.phone}
                    onChange={(e) =>
                      updateAgent(idx, { phone: e.target.value })
                    }
                    className={`${inputCls} font-mono-tabular`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#514f4d]">
                    After Hours
                  </label>
                  <input
                    type="text"
                    value={agent.afterHours}
                    onChange={(e) =>
                      updateAgent(idx, { afterHours: e.target.value })
                    }
                    className={`${inputCls} font-mono-tabular`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#514f4d]">
                  Fax
                </label>
                <input
                  type="text"
                  value={agent.fax}
                  onChange={(e) => updateAgent(idx, { fax: e.target.value })}
                  className={`${inputCls} font-mono-tabular`}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#514f4d]">
                  Entity & Address
                </label>
                <input
                  type="text"
                  value={agent.companyName}
                  onChange={(e) =>
                    updateAgent(idx, { companyName: e.target.value })
                  }
                  className={`${inputCls} mb-2 font-medium`}
                />
                <input
                  type="text"
                  value={agent.addressLines.join(', ')}
                  onChange={(e) =>
                    updateAgent(idx, {
                      addressLines: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className={inputCls}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
