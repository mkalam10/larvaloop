import React, { useState } from 'react';
import { X, Flame } from 'lucide-react';
import { BSFBatch } from '../../types';
import { recordProcessingLogApi } from '../../services/api';

interface AddProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: BSFBatch[];
  preSelectedBatch?: BSFBatch;
  onProcessingAdded: () => void;
}

export const AddProcessingModal: React.FC<AddProcessingModalProps> = ({
  isOpen,
  onClose,
  batches,
  preSelectedBatch,
  onProcessingAdded,
}) => {
  const [batchId, setBatchId] = useState<string>(preSelectedBatch?.id || batches[0]?.id || '');
  const [freshYield, setFreshYield] = useState<number>(1200);
  const [dryYield, setDryYield] = useState<number>(380);
  const [tempC, setTempC] = useState<number>(120);
  const [durationMin, setDurationMin] = useState<number>(20);
  const [moisturePct, setMoisturePct] = useState<number>(5.2);
  const [proteinPct, setProteinPct] = useState<number>(45.5);
  const [fatPct, setFatPct] = useState<number>(28.0);
  const [inspector, setInspector] = useState('Dr. H. Ahmad Rizal (Sertifikasi Balai Karantina Pertanian Class I)');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) return;
    setLoading(true);

    await recordProcessingLogApi(batchId, {
      freshYieldKg: Number(freshYield),
      dryYieldKg: Number(dryYield),
      dryingMethod: 'MICROWAVE_DRYING_120C',
      dryingTempC: Number(tempC),
      dryingDurationMin: Number(durationMin),
      moistureContentPct: Number(moisturePct),
      crudeProteinPct: Number(proteinPct),
      crudeFatPct: Number(fatPct),
      sanitationCertNo: `SAN-EU-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      labInspector: inspector,
      salmonellaTest: 'NEGATIVE_0_CFU',
      eColiTest: 'NEGATIVE_0_CFU',
    });

    setLoading(false);
    onProcessingAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1d2218]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#faf6ee] border-2 border-[#1d2218] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-[#1d2218]">
        <div className="bg-[#1d2218] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#8c7b45]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Catat Panen & Dehidrasi Microwave</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#b0a794] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[#544d3f] mb-1 font-bold">Pilih Batch Panen</label>
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-mono font-bold focus:outline-none focus:border-[#22542a]"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} ({b.plasmaPartnerName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Panen Basah (Kg)</label>
              <input
                type="number"
                required
                value={freshYield}
                onChange={(e) => setFreshYield(Number(e.target.value))}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-mono font-bold focus:outline-none focus:border-[#22542a]"
              />
            </div>

            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Maggot Kering (Kg)</label>
              <input
                type="number"
                required
                value={dryYield}
                onChange={(e) => setDryYield(Number(e.target.value))}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#22542a] font-mono font-bold focus:outline-none focus:border-[#22542a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Suhu (°C)</label>
              <input
                type="number"
                required
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-mono focus:outline-none focus:border-[#22542a]"
              />
            </div>

            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Moisture (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={moisturePct}
                onChange={(e) => setMoisturePct(Number(e.target.value))}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1f6475] font-mono font-bold focus:outline-none focus:border-[#22542a]"
              />
            </div>

            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Protein (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={proteinPct}
                onChange={(e) => setProteinPct(Number(e.target.value))}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#22542a] font-mono font-bold focus:outline-none focus:border-[#22542a]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#e8ddc8] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ebdcc9] hover:bg-[#d6c7b0] text-[#544d3f] rounded-lg font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#8c7b45] hover:bg-[#a38f54] text-[#1d2218] font-bold rounded-lg transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Panen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
