import React from 'react';
import { BSFBatch } from '../types';
import { 
  Flame, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Thermometer, 
  Timer, 
  FileCheck
} from 'lucide-react';

interface ProcessingModuleProps {
  batches: BSFBatch[];
  onAddProcessingClick: (batch?: BSFBatch) => void;
}

export const ProcessingModule: React.FC<ProcessingModuleProps> = ({
  batches,
  onAddProcessingClick,
}) => {
  const batchesWithProc = batches.filter((b) => !!b.processingLog);

  // Default demo data if no processing logs exist
  const displayBatches = batchesWithProc.length > 0 ? batchesWithProc : batches.slice(0, 2);

  return (
    <div className="space-y-4 text-[#0f381e]">
      {/* Eyebrow & Section Header */}
      <div className="text-center pt-1 pb-1">
        <span className="font-mono text-xs font-bold text-[#16a34a] block mb-0.5 uppercase tracking-wider">
          03. Panen & Pengolahan
        </span>
        <h2 className="text-xl font-black text-[#0f381e] tracking-tight">
          Processing & Harvesting
        </h2>
        <p className="text-xs text-[#4b5563] font-medium mt-0.5">
          Pengeringan Microwave 120°C & Validasi Bebas Patogen Ekspor
        </p>
      </div>

      {/* Top Action & Summary Bar */}
      <div className="bg-white border border-[#bbf7d0] p-3.5 shadow-sm rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#15803d] uppercase block tracking-wide">
            STATUS OPERASIONAL PANEN
          </span>
          <div className="text-sm font-extrabold text-[#15803d] font-mono mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
            Microwave Drying Active
          </div>
        </div>

        <button
          onClick={() => onAddProcessingClick()}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Catat Panen</span>
        </button>
      </div>

      {/* List of Batch Processing Cards */}
      <div className="space-y-4 pt-1">
        {displayBatches.map((batch) => {
          const proc = batch.processingLog || {
            harvestDate: '10 Mei 2024',
            freshYieldKg: 50,
            dryYieldKg: 18,
            dryingMethod: 'Microwave Drying',
            dryingTempC: 120,
            dryingDurationMinutes: 30,
            pathogenTestingStatus: 'PASS',
            heavyMetalTestingStatus: 'PASS',
            crudeProteinPct: 48.5,
            crudeFatPct: 28.2,
            moistureContentPct: 5.5,
          };

          return (
            <div
              key={batch.id}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-sm space-y-3.5 hover:border-[#16a34a] transition"
            >
              {/* Batch Header & Status Badge */}
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2.5">
                <h3 className="font-mono font-black text-sm text-[#0f381e]">
                  Batch #{batch.id || 'BSF-240510-07'}
                </h3>
                <span className="bg-[#dcfce7] text-[#15803d] border border-[#86efac] text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full">
                  Selesai Panen
                </span>
              </div>

              {/* Grid Specification Details */}
              <div className="space-y-1.5 text-xs text-[#0f381e] font-medium">
                <div className="flex justify-between items-center py-0.5 border-b border-[#f8fafc]">
                  <span className="text-[#64748b]">Tanggal Panen</span>
                  <span className="font-semibold">{proc.harvestDate || '10 Mei 2024'}</span>
                </div>

                <div className="flex justify-between items-center py-0.5 border-b border-[#f8fafc]">
                  <span className="text-[#64748b]">Berat Basah</span>
                  <span className="font-bold font-mono text-[#0f381e]">{proc.freshYieldKg || 50} kg</span>
                </div>

                <div className="flex justify-between items-center py-0.5 border-b border-[#f8fafc]">
                  <span className="text-[#64748b]">Metode Pengeringan</span>
                  <span className="font-semibold text-[#0f381e] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#16a34a]" />
                    {proc.dryingMethod || 'Microwave Drying'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5 border-b border-[#f8fafc]">
                  <span className="text-[#64748b]">Suhu Pengeringan</span>
                  <span className="font-bold font-mono text-[#dc2626] flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    {proc.dryingTempC || 120} °C
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5 border-b border-[#f8fafc]">
                  <span className="text-[#64748b]">Durasi</span>
                  <span className="font-semibold font-mono flex items-center gap-1 text-[#0284c7]">
                    <Timer className="w-3.5 h-3.5" />
                    {proc.dryingDurationMinutes || 30} menit
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Hasil Akhir</span>
                  <span className="font-bold text-[#15803d] font-mono">
                    Maggot Kering ({proc.dryYieldKg || 18} kg)
                  </span>
                </div>
              </div>

              {/* Validasi Keamanan Box */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 space-y-2">
                <div className="text-xs font-bold text-[#0f381e] flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#16a34a]" />
                  <span>Validasi Keamanan Karantina</span>
                </div>

                <div className="text-[11px] text-[#374151] space-y-0.5 font-medium leading-tight pl-0.5">
                  <p>Suhu ≥ 120°C selama 30 menit</p>
                  <p className="font-bold text-[#15803d]">
                    Bakteri Patogen (E.Coli, Salmonella) TERINAKTIVASI
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 pt-1.5 border-t border-[#86efac]/50">
                  <div className="w-7 h-7 rounded-lg bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748b] block font-semibold uppercase leading-none">
                      Status Sertifikasi
                    </span>
                    <strong className="text-xs font-extrabold text-[#15803d]">
                      Aman untuk Ekspor
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
