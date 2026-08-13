import React, { useEffect, useState } from 'react';
import { BSFBatch, CashMutation } from './types';
import {
  INITIAL_BATCHES,
  INITIAL_CASH_MUTATIONS,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { FeedModule } from './components/FeedModule';
import { EnvironmentIoTModule } from './components/EnvironmentIoTModule';
import { ProcessingModule } from './components/ProcessingModule';
import { CashFlowModule } from './components/CashFlowModule';
import { PublicQRPortal } from './components/PublicQRPortal';
import { AccountModule } from './components/AccountModule';

// Modals
import { NewBatchModal } from './components/modals/NewBatchModal';
import { AddFeedModal } from './components/modals/AddFeedModal';
import { AddProcessingModal } from './components/modals/AddProcessingModal';
import { AddCashMutationModal } from './components/modals/AddCashMutationModal';
import { ScanQRModal } from './components/modals/ScanQRModal';

export default function App() {
const [batches, setBatches] = useState<BSFBatch[]>(INITIAL_BATCHES);

const [cashMutations, setCashMutations] = useState<CashMutation[]>(
  INITIAL_CASH_MUTATIONS
);
  const [cashSummary, setCashSummary] = useState({ totalInflow: 0, totalOutflow: 0, netBalance: 0 });
  const [activeTab, setActiveTab] = useState<string>('feed'); // Default to Pakan (Feed)
  const [loading, setLoading] = useState<boolean>(false);

  // Modals state
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState(false);
  const [isAddProcessingModalOpen, setIsAddProcessingModalOpen] = useState(false);
  const [isAddCashMutationModalOpen, setIsAddCashMutationModalOpen] = useState(false);
  const [isScanQrModalOpen, setIsScanQrModalOpen] = useState(false);

  // Contextual selected batch for modals & buyer portal
  const [selectedBatchForAction, setSelectedBatchForAction] = useState<BSFBatch | undefined>(undefined);
  const [selectedBatchForPortal, setSelectedBatchForPortal] = useState<BSFBatch | undefined>(undefined);

const loadData = () => {
  setBatches(INITIAL_BATCHES);
  setCashMutations(INITIAL_CASH_MUTATIONS);

  const totalInflow = INITIAL_CASH_MUTATIONS
    .filter((item) => item.type === 'INFLOW')
    .reduce((sum, item) => sum + item.amountIdr, 0);

  const totalOutflow = INITIAL_CASH_MUTATIONS
    .filter((item) => item.type === 'OUTFLOW')
    .reduce((sum, item) => sum + item.amountIdr, 0);

  setCashSummary({
    totalInflow,
    totalOutflow,
    netBalance: totalInflow - totalOutflow,
  });

  setLoading(false);
};
  useEffect(() => {
    loadData();

    // Check URL parameters for direct scan link
    const searchParams = new URLSearchParams(window.location.search);
    const scanCode = searchParams.get('scan');
    if (scanCode) {
      setActiveTab('buyer-portal');
    }
  }, []);

  const handleBatchCreated = (newBatch: BSFBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
    setSelectedBatchForPortal(newBatch);
    setActiveTab('buyer-portal');
  };

  const handleSelectBatchForQr = (batch: BSFBatch) => {
    setSelectedBatchForPortal(batch);
    setActiveTab('buyer-portal');
  };

  const handleOpenAddFeed = (batch?: BSFBatch) => {
    setSelectedBatchForAction(batch);
    setIsAddFeedModalOpen(true);
  };

  const handleOpenAddProcessing = (batch?: BSFBatch) => {
    setSelectedBatchForAction(batch);
    setIsAddProcessingModalOpen(true);
  };

  return (
    /* 
      1. WEBSITE BROWSER VIEWPORT CONTAINER
      - h-screen w-screen max-h-screen overflow-hidden
      - Prevents any browser-level scrollbars completely
    */
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-white text-[#0f381e] font-sans antialiased selection:bg-[#16a34a] selection:text-white flex items-center justify-center p-0 sm:p-4">
      
      {/* 
        2. SMARTPHONE MOCKUP FRAME CONTAINER
        - Constrained to 100% of browser viewport height (sm:h-[calc(100vh-2rem)] max-h-[820px])
        - Has relative positioning so floating nav docks inside it
        - Has overflow-hidden so children never spill out
      */}
      <div className="w-full max-w-[400px] h-full sm:h-[calc(100vh-2rem)] sm:max-h-[820px] sm:rounded-[44px] sm:border-[10px] sm:border-black sm:shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden bg-[#faf8f5] relative flex flex-col shrink-0">
        
        {/* 3. Header Bar - Fixed at top of phone frame */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewBatchModal={() => setIsNewBatchModalOpen(true)}
          onOpenScanModal={() => setIsScanQrModalOpen(true)}
        />

        {/* 
          4. SCROLLABLE CONTENT BODY
          - This is the ONLY element that scrolls vertically
          - flex-1 fills all remaining vertical space in the phone frame
          - overflow-y-auto handles scrolling inside the phone screen
        */}
        <main className="px-3.5 py-4 pb-24 bg-[#faf8f5] flex-1 overflow-y-auto relative scroll-smooth">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#64748b] space-y-3">
              <div className="w-8 h-8 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono font-bold text-[#15803d]">Memuat LarvaLoop...</p>
            </div>
          ) : (
            <>
              {activeTab === 'feed' && (
                <FeedModule
                  batches={batches}
                  onAddFeedClick={handleOpenAddFeed}
                />
              )}

              {activeTab === 'iot' && (
                <EnvironmentIoTModule
                  batches={batches}
                />
              )}

              {activeTab === 'processing' && (
                <ProcessingModule
                  batches={batches}
                  onAddProcessingClick={handleOpenAddProcessing}
                />
              )}

              {activeTab === 'cashflow' && (
                <CashFlowModule
                  cashMutations={cashMutations}
                  summary={cashSummary}
                  onAddMutationClick={() => setIsAddCashMutationModalOpen(true)}
                />
              )}

              {activeTab === 'buyer-portal' && (
                <PublicQRPortal
                  batches={batches}
                  initialBatch={selectedBatchForPortal || batches[0]}
                />
              )}

              {activeTab === 'account' && (
                <AccountModule />
              )}
            </>
          )}
        </main>

        {/* 5. Mobile Home Bar Pill - Fixed at bottom edge of phone frame */}
        <div className="hidden sm:flex justify-center bg-[#faf8f5] pb-2 pt-1 shrink-0 z-20 border-t border-[#f0ede6]">
          <div className="w-28 h-1 bg-black rounded-full opacity-30"></div>
        </div>
      </div>

      {/* MODALS */}
      <NewBatchModal
        isOpen={isNewBatchModalOpen}
        onClose={() => setIsNewBatchModalOpen(false)}
        onBatchCreated={handleBatchCreated}
      />

      <AddFeedModal
        isOpen={isAddFeedModalOpen}
        onClose={() => setIsAddFeedModalOpen(false)}
        batches={batches}
        preSelectedBatch={selectedBatchForAction}
        onFeedAdded={loadData}
      />

      <AddProcessingModal
        isOpen={isAddProcessingModalOpen}
        onClose={() => setIsAddProcessingModalOpen(false)}
        batches={batches}
        preSelectedBatch={selectedBatchForAction}
        onProcessingAdded={loadData}
      />

      <AddCashMutationModal
        isOpen={isAddCashMutationModalOpen}
        onClose={() => setIsAddCashMutationModalOpen(false)}
        onMutationAdded={loadData}
      />

      <ScanQRModal
        isOpen={isScanQrModalOpen}
        onClose={() => setIsScanQrModalOpen(false)}
        batches={batches}
        onSelectBatchForQr={handleSelectBatchForQr}
      />
    </div>
  );
}
