import React from 'react';
import { 
  User, 
  Award, 
  Building2, 
  FileText, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { LarvaLoopLogo } from './LarvaLoopLogo';

export const AccountModule: React.FC = () => {
  return (
    <div className="space-y-4 text-[#0f381e]">
      {/* Eyebrow & Section Header */}
      <div className="text-center pt-1 pb-1">
        <span className="font-mono text-xs font-bold text-[#16a34a] block mb-0.5 uppercase tracking-wider">
          06. Profil Peternak
        </span>
        <h2 className="text-xl font-black text-[#0f381e] tracking-tight">
          Profil Peternak Mitra
        </h2>
        <p className="text-xs text-[#4b5563] font-medium mt-0.5">
          Manajemen akun, sertifikasi & unit kemitraan plasma
        </p>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          {/* Avatar Picture / Icon */}
          <div className="w-14 h-14 rounded-full bg-[#f0fdf4] border-2 border-[#16a34a] flex items-center justify-center text-[#15803d] shrink-0 shadow-sm">
            <User className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-[#0f381e]">
                Tim Ratu Dewa
              </h3>
              <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
            </div>
            <p className="text-xs text-[#64748b] font-mono">
              ID: PLS-SRW-004 • Palembang Sub-Unit
            </p>
            <span className="bg-[#dcfce7] text-[#15803d] border border-[#86efac] text-[9.5px] font-bold px-2 py-0.5 rounded-full inline-block mt-1">
              Mitra Plasma Grade A (Ekspor)
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 bg-[#f8fafc] p-2.5 rounded-xl border border-[#e2e8f0] text-center text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#64748b] block font-medium">Sertifikat</span>
            <strong className="text-[#15803d]">VERIFIED</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] block font-medium">Total Batch</span>
            <strong className="text-[#0f381e]">12 Batch</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] block font-medium">Status Kas</span>
            <strong className="text-[#15803d]">Lancar</strong>
          </div>
        </div>
      </div>

      {/* Account Settings & Information Menu List */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-2 shadow-sm divide-y divide-[#f1f5f9]">
        <button className="w-full flex items-center justify-between p-3 hover:bg-[#f8fafc] rounded-xl transition text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] text-[#15803d] flex items-center justify-center border border-[#bbf7d0]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-[#0f381e] block">Informasi Unit Kemitraan</strong>
              <span className="text-[10px] text-[#64748b] block">Lokasi biopond & kapasitas pakan</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        </button>

        <button className="w-full flex items-center justify-between p-3 hover:bg-[#f8fafc] rounded-xl transition text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] text-[#15803d] flex items-center justify-center border border-[#bbf7d0]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-[#0f381e] block">Sertifikat Karantina & Bebas Patogen</strong>
              <span className="text-[10px] text-[#64748b] block">Uji E.Coli, Salmonella & Logam Berat</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        </button>

        <button className="w-full flex items-center justify-between p-3 hover:bg-[#f8fafc] rounded-xl transition text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fefce8] text-[#ca8a04] flex items-center justify-center border border-[#fef08a]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-[#0f381e] block">Kontrak Off-Take & Price Guarantee</strong>
              <span className="text-[10px] text-[#64748b] block">Harga dasar Rp 20.000 / Kg BSF kering</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        </button>

        <button className="w-full flex items-center justify-between p-3 hover:bg-[#f8fafc] rounded-xl transition text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center border border-[#bae6fd]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-[#0f381e] block">Notifikasi Sensor IoT</strong>
              <span className="text-[10px] text-[#64748b] block">Alert suhu & kelembapan ekstrim</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        </button>

        <button className="w-full flex items-center justify-between p-3 hover:bg-[#f8fafc] rounded-xl transition text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] text-[#15803d] flex items-center justify-center border border-[#bbf7d0]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-[#0f381e] block">Panduan SOP & Layanan Bantuan</strong>
              <span className="text-[10px] text-[#64748b] block">Hubungi agronomis LarvaLoop</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        </button>
      </div>

      {/* Brand Footer Info */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-3.5 text-center space-y-2">
        <div className="flex justify-center">
          <LarvaLoopLogo size="sm" showSubtitle={true} />
        </div>
        <p className="text-[10px] text-[#4b5563] font-mono leading-tight">
          LarvaLoop Traceability Platform v2.4 <br />
          Universitas Sriwijaya • Tim Anak Ratu Dewa
        </p>
      </div>

      {/* Logout Button */}
      <button className="w-full bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] border border-[#fecaca] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition">
        <LogOut className="w-4 h-4" />
        <span>Keluar dari Akun</span>
      </button>
    </div>
  );
};
