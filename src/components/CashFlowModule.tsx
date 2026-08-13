import React, { useState } from 'react';
import { CashMutation } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  FileText,
  Search
} from 'lucide-react';

interface CashFlowModuleProps {
  cashMutations: CashMutation[];
  summary: { totalInflow: number; totalOutflow: number; netBalance: number };
  onAddMutationClick: () => void;
}

export const CashFlowModule: React.FC<CashFlowModuleProps> = ({
  cashMutations,
  summary,
  onAddMutationClick,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'INFLOW' | 'OUTFLOW'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMutations = cashMutations.filter((m) => {
    const matchType = filterType === 'ALL' || m.type === filterType;
    const matchSearch =
      m.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.proofDocumentNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-4 text-[#1d2218]">
      {/* Eyebrow & Section Header */}
      <div className="text-center pt-2 pb-1">
        <span className="font-mono text-xs font-bold text-[#8c7b45] block mb-0.5">
          04
        </span>
        <h2 className="text-xl font-black text-[#1d2218] tracking-tight">
          Cash flow mitra
        </h2>
        <p className="text-xs text-[#635d4f] font-medium mt-0.5">
          Mutasi keuangan & jaminan harga dasar off-take
        </p>
      </div>

      {/* Financial Summary Highlight Banner */}
      <div className="bg-[#ffffff] border border-[#e8e4d8] py-3.5 px-3.5 shadow-sm rounded-xl">
        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#6b6250] uppercase">
          <span>SALDO KAS BERSIH MITRA</span>
          <span className="text-[#22542a]">Floor Price Rp 20rb/Kg</span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div className="text-xl font-extrabold text-[#22542a] font-mono">
            Rp {summary.netBalance.toLocaleString('id-ID')}
          </div>
          <button
            onClick={() => onAddMutationClick()}
            className="bg-[#22542a] hover:bg-[#2b6834] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Mutasi Kas</span>
          </button>
        </div>

        {/* Inflow / Outflow Row */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#f0ede6] text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#22542a]">
            <ArrowDownLeft className="w-3.5 h-3.5 shrink-0" />
            <div>
              <span className="text-[10px] text-[#6e6554] block">Masuk (Ekspor B2B)</span>
              <strong className="font-bold">Rp {summary.totalInflow.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#a13228]">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <div>
              <span className="text-[10px] text-[#6e6554] block">Keluar (Offtake & Pakan)</span>
              <strong className="font-bold">Rp {summary.totalOutflow.toLocaleString('id-ID')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#807663]" />
          <input
            type="text"
            placeholder="Cari partner, kwitansi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#ffffff] border border-[#e8e4d8] text-[#1d2218] text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#22542a] font-medium"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-[#ffffff] border border-[#e8e4d8] text-xs text-[#1d2218] font-bold rounded-lg px-2.5 py-1.5 focus:outline-none shrink-0"
        >
          <option value="ALL">Semua Mutasi</option>
          <option value="INFLOW">Kas Masuk</option>
          <option value="OUTFLOW">Kas Keluar</option>
        </select>
      </div>

      {/* Timeline Mutation Cards */}
      <div className="space-y-2.5">
        {filteredMutations.map((m) => {
          const isInflow = m.type === 'INFLOW';
          return (
            <div
              key={m.id}
              className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-3.5 shadow-sm relative space-y-2 hover:border-[#1d2218] transition"
            >
              {/* Header row: Partner & Date */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-xs text-[#1d2218] block leading-tight">
                    {m.partnerName}
                  </span>
                  <span className="text-[10px] text-[#6e6554] font-medium">
                    {m.description}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-mono text-sm font-extrabold ${isInflow ? 'text-[#22542a]' : 'text-[#a13228]'}`}>
                    {isInflow ? '+' : '-'} Rp {m.amountIdr.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-[#6e6554] font-mono block">
                    {m.timestamp}
                  </span>
                </div>
              </div>

              {/* Document Proof & Ref */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6e6554] pt-2 border-t border-[#f0ede6]">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#8c7b45]" />
                  No. Bukti: {m.proofDocumentNo}
                </span>

                {m.batchRef && (
                  <span className="bg-[#f0f7ec] text-[#22542a] px-1.5 py-0.5 rounded font-bold border border-[#c8e2bd]">
                    Batch: {m.batchRef}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
