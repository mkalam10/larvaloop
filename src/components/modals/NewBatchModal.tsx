import React, { useState } from 'react';
import { X, Sprout } from 'lucide-react';
import { createNewBatchApi } from '../../services/api';
import { BSFBatch } from '../../types';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchCreated: (batch: BSFBatch) => void;
}

export const NewBatchModal: React.FC<NewBatchModalProps> = ({ isOpen, onClose, onBatchCreated }) => {
  const [partnerName, setPartnerName] = useState('');
  const [location, setLocation] = useState('Indralaya, Ogan Ilir, Sumatera Selatan');
  const [eggGrams, setEggGrams] = useState<number>(250);
  const [destination, setDestination] = useState('Rotterdam Port, Netherlands (AquaFeed Ltd)');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName) return;
    setLoading(true);

    const newBatch = await createNewBatchApi({
      plasmaPartnerName: partnerName,
      location,
      eggWeightGrams: Number(eggGrams),
      exportDestination: destination,
    });

    setLoading(false);
    if (newBatch) {
      onBatchCreated(newBatch);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1d2218]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#faf6ee] border-2 border-[#1d2218] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-[#1d2218]">
        <div className="bg-[#1d2218] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-[#a3d9a5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Inisiasi Batch & QR Baru</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#b0a794] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[#544d3f] mb-1 font-bold">Nama Peternak Plasma / Unit Sub-Mitra</label>
            <input
              type="text"
              required
              placeholder="Misal: Kelompok Tani Plasma Jaya (Mitra C)"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-bold focus:outline-none focus:border-[#22542a]"
            />
          </div>

          <div>
            <label className="block text-[#544d3f] mb-1 font-bold">Lokasi Kandang</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-medium focus:outline-none focus:border-[#22542a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Telur Awal (Gram)</label>
              <input
                type="number"
                required
                min={10}
                value={eggGrams}
                onChange={(e) => setEggGrams(Number(e.target.value))}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-mono font-bold focus:outline-none focus:border-[#22542a]"
              />
            </div>

            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Buyer Ekspor</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-medium focus:outline-none focus:border-[#22542a]"
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
              className="px-5 py-2 bg-[#22542a] hover:bg-[#2b6834] text-white font-bold rounded-lg transition"
            >
              {loading ? 'Membuat...' : 'Buat Batch Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
