import React from 'react';
import { 
  Sprout, 
  Activity, 
  Flame, 
  Wallet, 
  QrCode, 
  User,
  Plus
} from 'lucide-react';
import { LarvaLoopLogo } from './LarvaLoopLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewBatchModal: () => void;
  onOpenScanModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewBatchModal,
  onOpenScanModal,
}) => {
  // Navigation Items in Bottom Dock: Pakan, Iklim, Proses, Kas, Lacak
  const bottomNavItems = [
    { id: 'feed', label: 'Pakan', icon: Sprout },
    { id: 'iot', label: 'Iklim', icon: Activity },
    { id: 'processing', label: 'Proses', icon: Flame },
    { id: 'cashflow', label: 'Kas', icon: Wallet },
    { id: 'buyer-portal', label: 'Lacak', icon: QrCode },
  ];

  return (
    <>
      {/* Top Header - Locked at top of phone frame (shrink-0) */}
      <header className="shrink-0 bg-[#16a34a] text-white w-full px-3.5 py-2.5 border-b border-[#15803d] shadow-sm z-20">
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Left Brand Logo */}
          <div 
            onClick={() => setActiveTab('feed')}
            className="cursor-pointer flex items-center hover:opacity-95 transition"
            title="LarvaLoop - Ke Pakan"
          >
            <LarvaLoopLogo size="sm" showSubtitle={false} variant="header" />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenScanModal}
              title="Scan QR Code"
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl border border-white/30 text-[11px] flex items-center justify-center transition font-bold shadow-sm active:scale-95"
            >
              <QrCode className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNewBatchModal}
              title="Tambah Batch Baru"
              className="p-1.5 bg-[#fef08a] hover:bg-[#fde047] text-[#14532d] rounded-xl text-[11px] flex items-center justify-center transition font-black shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Account / User Icon Button - Far Right */}
            <button
              onClick={() => setActiveTab('account')}
              title="Profil Akun"
              className={`p-1.5 rounded-xl border text-[11px] flex items-center justify-center transition shadow-sm active:scale-95 ${
                activeTab === 'account'
                  ? 'bg-white text-[#15803d] border-white font-bold'
                  : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
              }`}
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating iOS Dock Navigation Bar - Absolutely positioned inside the relative phone frame */}
      <nav className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[360px] pointer-events-auto">
        <div className="bg-[#15803d]/95 backdrop-blur-xl border border-white/25 p-1 rounded-full shadow-[0_8px_24px_rgba(21,128,61,0.35)] flex items-center justify-around gap-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center transition-all duration-200 py-1.5 px-2 sm:px-2.5 rounded-full ${
                  isActive
                    ? 'bg-white text-[#15803d] shadow-md scale-105 font-extrabold'
                    : 'text-emerald-100 hover:text-white hover:bg-white/15'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[8.5px] sm:text-[9px] font-bold tracking-tight mt-0.5 leading-none">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#fef08a] border border-[#15803d]"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
