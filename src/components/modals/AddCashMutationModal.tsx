import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { addCashMutationApi } from '../../services/api';

interface AddCashMutationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMutationAdded: () => void;
}

export const AddCashMutationModal: React.FC<AddCashMutationModalProps> = ({
  isOpen,
  onClose,
  onMutationAdded,
}) => {
  const [partnerName, setPartnerName] = useState('Peternak Plasma Sub-Unit B (Bapak M. Syarif)');
  const [type, setType] = useState<'INFLOW' | 'OUTFLOW'>('INFLOW');
  const [amountIdr, setAmountIdr] = useState<number>(15000000);
  const [description, setDescription] = useState('Pembayaran hasil panen maggot kering harga floor price');
  const [proofNo, setProofNo] = useState(`KWITANSI-MITRA-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await addCashMutationApi({
      partnerName,
      partnerType: 'MITRA_PLASMA',
      category: type === 'INFLOW' ? 'EXPORT_REVENUE' : 'HARVEST_OFFTAKE',
      type,
      amountIdr: Number(amountIdr),
      description,
      proofDocumentNo: proofNo,
    });

    setLoading(false);
    onMutationAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1d2218]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#faf6ee] border-2 border-[#1d2218] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-[#1d2218]">
        <div className="bg-[#1d2218] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#a3d9a5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Catat Mutasi Kas Mitra</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#b0a794] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[#544d3f] mb-1 font-bold">Nama Unit / Partner Mitra</label>
            <input
              type="text"
              required
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-bold focus:outline-none focus:border-[#22542a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Jenis Mutasi</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'INFLOW' | 'OUTFLOW')}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-bold focus:outline-none focus:border-[#22542a]"
              >
                <option value="INFLOW">KAS MASUK (Inflow)</option>
                <option value="OUTFLOW">KAS KELUAR (Outflow)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#544d3f] mb-1 font-bold">Jumlah (IDR)</label>
              <input
                type="number"
                required
                min={1000}
                value={amountIdr}
                onChange={(e) => setAmountIdr(Number(e.target.value))}
                className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#22542a] font-mono font-bold focus:outline-none focus:border-[#22542a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#544d3f] mb-1 font-bold">Keterangan Transaksi</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#ebdcc9] border border-[#c5b89f] rounded-lg px-3 py-2 text-[#1d2218] font-medium focus:outline-none focus:border-[#22542a]"
            />
          </div>

          <div>
            <label className="block text-[#544d3f] mb-1 font-bold">Nomor Bukti Transaksi</label>
            <input
              type="text"
              required
              value={proofNo}
              onChange={(e) => setProofNo(e.target.value)}
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
              {loading ? 'Menyimpan...' : 'Simpan Mutasi Kas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
