import React, { useState } from 'react';
import { BSFBatch } from '../types';
import { 
  QrCode, 
  CheckCircle2, 
  Printer, 
  Globe
} from 'lucide-react';

interface PublicQRPortalProps {
  batches: BSFBatch[];
  initialBatch?: BSFBatch;
}

export const PublicQRPortal: React.FC<PublicQRPortalProps> = ({ batches, initialBatch }) => {
  const [selectedBatch, setSelectedBatch] = useState<BSFBatch>(initialBatch || batches[0]);
  const [, setIsPrintingLabel] = useState(false);

  const totalFeedInBatch = selectedBatch.feedLogs.reduce((sum, f) => sum + f.quantityKg, 0);

  const handlePrintLabel = () => {
    setIsPrintingLabel(true);
    setTimeout(() => {
      window.print();
      setIsPrintingLabel(false);
    }, 500);
  };

  return (
    <div className="space-y-4 text-[#1d2218]">
      {/* Eyebrow & Section Header */}
      <div className="text-center pt-2 pb-1">
        <span className="font-mono text-xs font-bold text-[#8c7b45] block mb-0.5">
          05
        </span>
        <h2 className="text-xl font-black text-[#1d2218] tracking-tight">
          Paspor QR Kontainer
        </h2>
        <p className="text-xs text-[#635d4f] font-medium mt-0.5">
          Public immutable ledger & bukti rantai pasok buyer ekspor
        </p>
      </div>

      {/* Select Batch Dropdown for QR Verification */}
      <div className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-3 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-[#22542a]" />
          <span className="text-xs font-bold text-[#1d2218]">Peti Ekspor:</span>
        </div>

        <select
          value={selectedBatch.id}
          onChange={(e) => {
            const b = batches.find((x) => x.id === e.target.value);
            if (b) setSelectedBatch(b);
          }}
          className="bg-[#ffffff] text-[#1d2218] text-xs font-mono font-bold rounded-lg px-2.5 py-1 border border-[#e8e4d8] focus:outline-none"
        >
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.containerQrCode} ({b.id})
            </option>
          ))}
        </select>
      </div>

      {/* Container QR Passport Card */}
      <div className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-4 shadow-sm space-y-4">
        {/* Header QR Badge */}
        <div className="flex items-center justify-between border-b border-[#f0ede6] pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[#22542a]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-mono font-extrabold text-xs">VERIFIED EXPORT PASSPORT</span>
            </div>
            <h3 className="text-lg font-black font-mono text-[#1d2218] mt-0.5">
              {selectedBatch.containerQrCode}
            </h3>
          </div>

          <button
            onClick={handlePrintLabel}
            className="bg-[#22542a] hover:bg-[#2b6834] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Label</span>
          </button>
        </div>

        {/* Essential Export Details */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#f8f6f0] p-3 rounded-xl border border-[#e8e4d8]">
          <div>
            <span className="text-[10px] text-[#6e6554] block">Kode Batch BSF</span>
            <strong className="text-[#1d2218]">{selectedBatch.id}</strong>
          </div>

          <div>
            <span className="text-[10px] text-[#6e6554] block">Mitra Peternak</span>
            <strong className="text-[#1d2218] truncate block">{selectedBatch.plasmaPartnerName}</strong>
          </div>

          <div>
            <span className="text-[10px] text-[#6e6554] block">Lokasi Kandang</span>
            <span className="text-[#544d3f] truncate block">{selectedBatch.location}</span>
          </div>

          <div>
            <span className="text-[10px] text-[#6e6554] block">Tujuan Buyer</span>
            <strong className="text-[#22542a] truncate block">{selectedBatch.exportDestination}</strong>
          </div>
        </div>

        {/* Blockchain Ledger Hash */}
        <div className="bg-[#1d2218] text-[#f4efe6] p-3 rounded-xl font-mono text-[10px] space-y-1">
          <div className="flex items-center justify-between text-[#a3d9a5]">
            <span className="font-bold flex items-center gap-1">
              <Globe className="w-3 h-3" /> Solana Immutable Ledger
            </span>
            <span className="bg-[#2a3324] text-[#b0a794] px-1.5 py-0.5 rounded text-[9px]">SOL-RWA</span>
          </div>
          <p className="break-all text-[#d4c8b0] font-semibold">
            {selectedBatch.blockchainTxHash}
          </p>
        </div>

        {/* Journey Milestones Timeline */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold text-[#1d2218] uppercase tracking-wider">
            Rekam Jejak Rantai Pasok (Milestone)
          </h4>

          {/* 1. Hatching */}
          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8c7b45] mt-1 shrink-0"></div>
            <div>
              <strong className="text-[#1d2218] block">01. Penetasan Telur Awal</strong>
              <span className="text-[11px] text-[#6e6554]">
                Inisiasi telur BSF {selectedBatch.eggWeightGrams} gram di {selectedBatch.plasmaPartnerName}.
              </span>
            </div>
          </div>

          {/* 2. Feed Provenance */}
          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22542a] mt-1 shrink-0"></div>
            <div>
              <strong className="text-[#1d2218] block">02. Pakan Organik Terverifikasi ({totalFeedInBatch} Kg)</strong>
              <span className="text-[11px] text-[#6e6554]">
                {selectedBatch.feedLogs.length} catatan pakan terverifikasi.
              </span>
            </div>
          </div>

          {/* 3. IoT Telemetry */}
          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1f6475] mt-1 shrink-0"></div>
            <div>
              <strong className="text-[#1d2218] block">03. Telemetri Sensor IoT</strong>
              <span className="text-[11px] text-[#6e6554]">
                {selectedBatch.iotLogs.length} data sensor mikro-klimat biopond.
              </span>
            </div>
          </div>

          {/* 4. Processing */}
          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#a13228] mt-1 shrink-0"></div>
            <div>
              <strong className="text-[#1d2218] block">04. Microwave Drying 120°C & Dehidrasi</strong>
              <span className="text-[11px] text-[#6e6554]">
                {selectedBatch.processingLog ? (
                  <>Hasil: {selectedBatch.processingLog.dryYieldKg} Kg maggot kering</>
                ) : (
                  'Dalam proses panen...'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
