import React, { useState } from 'react';
import { X, Sprout } from 'lucide-react';
import { BSFBatch, FeedType } from '../../types';
import { addFeedLogApi } from '../../services/api';

interface AddFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: BSFBatch[];
  preSelectedBatch?: BSFBatch;
  onFeedAdded: () => void;
}

export const AddFeedModal: React.FC<AddFeedModalProps> = ({
  isOpen,
  onClose,
  batches,
  preSelectedBatch,
  onFeedAdded,
}) => {
  const [batchId, setBatchId] = useState<string>(preSelectedBatch?.id || batches[0]?.id || '');
  const [supplierName, setSupplierName] = useState('Grand Zuri Hotel Palembang');
  const [sourceType, setSourceType] = useState<FeedType>('HOTEL_FOOD_WASTE');
  const [quantityKg, setQuantityKg] = useState<number>(350);
  const [heavyMetals, setHeavyMetals] = useState<'PASS' | 'FAIL'>('PASS');
  const [toxinPpm, setToxinPpm] = useState<number>(0.0);
  const [certNo, setCertNo] = useState(`LAB-SUCOFINDO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [notes, setNotes] = useState('Sisa katering hotel steril non-plastik');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) return;
    setLoading(true);

    await addFeedLogApi(batchId, {
      supplierName,
      sourceType,
      quantityKg: Number(quantityKg),
      dateGiven: new Date().toISOString().split('T')[0],
      heavyMetalsCheck: heavyMetals,
      toxinPpm: Number(toxinPpm),
      labCertificateNo: certNo,
      notes,
    });

    setLoading(false);
    onFeedAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1d2218]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#faf6ee] border-2 border-[#1d2218] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-[#1d2218]">
        <div className="bg-[#1d2218] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-[#a3d9a5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Catat Pakan Organik Masuk</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#b0a794] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[#544d3f] mb-1 font-bold">Pilih Batch BSF Target</label>
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
              <label className="block text-[#544d3f] mb-1 font-bold">Pemasok Pakan</label>
              <input
                type="text"
                required
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-bold focus:outline-none focus:border-[#22542a]"
              />
            </div>

            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Jenis Pakan</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as FeedType)}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-bold focus:outline-none focus:border-[#22542a]"
              >
                <option value="HOTEL_FOOD_WASTE">Makanan Hotel</option>
                <option value="TOFU_DREGS">Ampas Tahu Organik</option>
                <option value="PALM_OIL_WASTE">Bungkil Sawit (PKS)</option>
                <option value="MARKET_ORGANIC_WASTE">Limbah Pasar Sayur</option>
                <option value="FRUIT_PULP">Ampas Industri Buah</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Jumlah (Kg)</label>
              <input
                type="number"
                required
                min={1}
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-mono font-bold focus:outline-none focus:border-[#22542a]"
              />
            </div>

            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Uji Logam Berat</label>
              <select
                value={heavyMetals}
                onChange={(e) => setHeavyMetals(e.target.value as 'PASS' | 'FAIL')}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#22542a] font-bold focus:outline-none focus:border-[#22542a]"
              >
                <option value="PASS">PASS (Bebas Logam)</option>
                <option value="FAIL">REJECTED (Kontaminasi)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#544d3f] mb-1 font-bold">Cert Lab Sucofindo</label>
            <input
              type="text"
              required
              value={certNo}
              onChange={(e) => setCertNo(e.target.value)}
              className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-mono focus:outline-none focus:border-[#22542a]"
            />
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
              className="px-5 py-2 bg-[#22542a] hover:bg-[#2b6834] text-white font-bold rounded-lg transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Pakan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
