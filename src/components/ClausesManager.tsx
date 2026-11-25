import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, RotateCcw, Search } from 'lucide-react';
import { CERTIFICATE_CLAUSES } from '../data/certificateDefaults';
import { ClauseCategory } from '../types/certificate';

interface ClausesManagerProps {
  includedClauseIds: string[];
  customEndorsements: string;
  onChangeIncludedIds: (ids: string[]) => void;
  onChangeCustomEndorsements: (value: string) => void;
}

const CATEGORIES: ('All' | ClauseCategory)[] = [
  'All',
  'Institute & Inland Clauses',
  'Special Conditions & Extensions',
  'Warranties & Declaration Terms',
  'Exclusions & Sanctions',
];

export const ClausesManager: React.FC<ClausesManagerProps> = ({
  includedClauseIds,
  customEndorsements,
  onChangeIncludedIds,
  onChangeCustomEndorsements,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | ClauseCategory>(
    'All'
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredClauses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CERTIFICATE_CLAUSES.filter((clause) => {
      const matchesCat =
        categoryFilter === 'All' || clause.category === categoryFilter;
      const matchesQuery =
        !q ||
        clause.title.toLowerCase().includes(q) ||
        clause.summary.toLowerCase().includes(q) ||
        clause.fullText.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, categoryFilter]);

  const toggleClause = (id: string) => {
    if (includedClauseIds.includes(id)) {
      onChangeIncludedIds(includedClauseIds.filter((x) => x !== id));
    } else {
      onChangeIncludedIds([...includedClauseIds, id]);
    }
  };

  const selectAllDefaults = () => {
    onChangeIncludedIds(
      CERTIFICATE_CLAUSES.filter((c) => c.defaultIncluded).map((c) => c.id)
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded border border-[#dddbda] bg-[#fafaf9] px-5 py-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
        <div>
          <h1 className="text-lg font-bold text-[#032d60]">
            Open Policy Clauses & Special Conditions
          </h1>
          <p className="mt-0.5 text-xs text-[#514f4d]">
            Manage applicable Institute clauses, warranties, sub-limits, and
            exclusions printed on the Marine Insurance Certificate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-tabular text-[#514f4d]">
            {includedClauseIds.length} of {CERTIFICATE_CLAUSES.length} active
          </span>
          <button
            type="button"
            onClick={selectAllDefaults}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded border border-[#c9c7c5] bg-white px-3.5 py-1.5 text-xs font-medium text-[#0176d3] hover:bg-[#f3f3f3] whitespace-nowrap shrink-0 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restore Policy Defaults
          </button>
        </div>
      </div>

      {/* Search & Category Tabs */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#747474]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clauses, limits, LMA codes..."
            className="min-h-[38px] w-full rounded border border-[#c9c7c5] bg-white py-1.5 pr-3 pl-9 text-sm text-[#181818] placeholder:text-[#747474] focus:border-[#0176d3] focus:outline-none focus:ring-2 focus:ring-[#0176d3]/20"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto rounded border border-[#dddbda] bg-white p-1">
          {CATEGORIES.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`min-h-[32px] rounded px-3 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#0176d3] text-white font-semibold'
                    : 'text-[#514f4d] hover:bg-[#f3f3f3] hover:text-[#181818]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clauses List */}
      <div className="divide-y divide-[#e5e5e5] rounded border border-[#dddbda] bg-white shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
        {filteredClauses.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#514f4d]">
            No policy clauses match &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredClauses.map((clause) => {
            const isIncluded = includedClauseIds.includes(clause.id);
            const isExpanded = expandedId === clause.id;

            return (
              <div
                key={clause.id}
                className="p-4 transition-colors hover:bg-[#fafaf9]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isIncluded}
                      aria-label={`Include ${clause.title}`}
                      onClick={() => toggleClause(clause.id)}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                        isIncluded
                          ? 'border-[#0176d3] bg-[#0176d3] text-white'
                          : 'border-[#c9c7c5] bg-white text-transparent hover:border-[#0176d3]'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#514f4d]">
                        <span>{clause.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{isIncluded ? 'Included' : 'Excluded'}</span>
                      </div>
                      <h3 className="mt-0.5 text-sm font-semibold text-[#181818]">
                        {clause.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#514f4d]">
                        {clause.summary}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : clause.id)
                    }
                    className="inline-flex min-h-[34px] items-center gap-1 rounded border border-[#c9c7c5] bg-white px-2.5 py-1 text-xs font-medium text-[#0176d3] hover:bg-[#f3f3f3] whitespace-nowrap shrink-0"
                  >
                    {isExpanded ? (
                      <>
                        Hide Wording <ChevronUp className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        Full Wording <ChevronDown className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 ml-8 rounded border border-[#dddbda] bg-[#fafaf9] p-3 text-xs leading-relaxed text-[#3e3e3c]">
                    {clause.fullText}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Custom Endorsements Box */}
      <div className="rounded border border-[#dddbda] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.03)]">
        <label
          htmlFor="clausesCustomEndorsements"
          className="block text-sm font-bold text-[#032d60]"
        >
          Custom Endorsements & Shipment-Specific Warranties
        </label>
        <p className="mt-1 mb-3 text-xs text-[#514f4d]">
          Appended directly beneath the selected Open Policy clauses on the
          printed certificate.
        </p>
        <textarea
          id="clausesCustomEndorsements"
          rows={3}
          value={customEndorsements}
          onChange={(e) => onChangeCustomEndorsements(e.target.value)}
          placeholder="e.g. Warranted cargo stuffed in FCL container with pre-dispatch inspection certificate..."
          className="w-full rounded border border-[#c9c7c5] bg-white px-3 py-2 text-sm text-[#181818] placeholder:text-[#747474] focus:border-[#0176d3] focus:outline-none focus:ring-2 focus:ring-[#0176d3]/20"
        />
      </div>
    </div>
  );
};
