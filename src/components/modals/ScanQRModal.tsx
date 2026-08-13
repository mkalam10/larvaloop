import React, { useState } from 'react';
import { X, QrCode, Camera } from 'lucide-react';
import { BSFBatch } from '../../types';

interface ScanQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: BSFBatch[];
  onSelectBatchForQr: (batch: BSFBatch) => void;
}

export const ScanQRModal: React.FC<ScanQRModalProps> = ({
  isOpen,
  onClose,
  batches,
  onSelectBatchForQr,
}) => {
  const [selectedQr, setSelectedQr] = useState<string>(batches[0]?.containerQrCode || '');

  if (!isOpen) return null;

  const handleScan = () => {
    const found = batches.find((b) => b.containerQrCode === selectedQr || b.id === selectedQr);
    if (found) {
      onSelectBatchForQr(found);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1d2218]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#faf6ee] border-2 border-[#1d2218] rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl text-[#1d2218]">
        <div className="bg-[#1d2218] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#a3d9a5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Pemindai Kode QR Kontainer</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#b0a794] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-center space-y-4 text-xs">
          {/* Simulated Camera Viewfinder */}
          <div className="bg-[#ebdcc9] border-2 border-dashed border-[#8c7b45] rounded-xl p-6 flex flex-col items-center justify-center relative">
            <Camera className="w-10 h-10 text-[#8c7b45] animate-pulse mb-2" />
            <span className="text-[11px] font-bold text-[#1d2218]">Kamera Siap Memindai QR</span>
            <span className="text-[10px] text-[#6e6554] mt-0.5">Arahkan ke label peti kemas ekspor</span>

            {/* Corner Viewfinder Guides */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#1d2218]"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#1d2218]"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#1d2218]"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#1d2218]"></div>
          </div>

          <div>
            <label className="block text-[#544d3f] mb-1 font-bold text-left">Pilih Kode Kontainer / Batch</label>
            <select
              value={selectedQr}
              onChange={(e) => setSelectedQr(e.target.value)}
              className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-mono font-bold focus:outline-none focus:border-[#22542a]"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.containerQrCode}>
                  {b.containerQrCode} ({b.id})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleScan}
            className="w-full py-2.5 bg-[#22542a] hover:bg-[#2b6834] text-white font-bold rounded-lg transition"
          >
            Buka Paspor QR Ekspor
          </button>
        </div>
      </div>
    </div>
  );
};
