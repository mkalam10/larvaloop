import React, { useState } from 'react';
import { BSFBatch, FeedLog, FeedType } from '../types';
import { 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  FileText, 
  Search,
  Filter,
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface FeedModuleProps {
  batches: BSFBatch[];
  onAddFeedClick: (batch?: BSFBatch) => void;
}

export const FeedModule: React.FC<FeedModuleProps> = ({ batches, onAddFeedClick }) => {
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPieChart, setShowPieChart] = useState(false);

  // Collect all feed logs across batches
  const allFeedLogs: (FeedLog & { batchQr: string; partnerName: string })[] = [];
  batches.forEach((b) => {
    b.feedLogs.forEach((f) => {
      allFeedLogs.push({
        ...f,
        batchQr: b.containerQrCode,
        partnerName: b.plasmaPartnerName,
      });
    });
  });

  // Calculate Feed Source Distribution for Recharts
  const feedTypeCounts: Record<string, number> = {};
  allFeedLogs.forEach((f) => {
    const label = getFeedTypeLabel(f.sourceType);
    feedTypeCounts[label] = (feedTypeCounts[label] || 0) + f.quantityKg;
  });

  const pieData = Object.keys(feedTypeCounts).map((key) => ({
    name: key,
    value: feedTypeCounts[key],
  }));

  const COLORS = ['#22542a', '#8c7b45', '#1f6475', '#a13228', '#544d3f'];

  const filteredLogs = allFeedLogs.filter((log) => {
    const matchSupplier =
      selectedSupplierFilter === 'ALL' || log.sourceType === selectedSupplierFilter;
    const matchSearch =
      log.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.labCertificateNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSupplier && matchSearch;
  });

  function getFeedTypeLabel(type: FeedType) {
    switch (type) {
      case 'HOTEL_FOOD_WASTE':
        return 'Sisa Makanan Hotel (Food Waste)';
      case 'TOFU_DREGS':
        return 'Ampas Tahu Organik';
      case 'PALM_OIL_WASTE':
        return 'Limbah Sawit (PKS)';
      case 'MARKET_ORGANIC_WASTE':
        return 'Organik Sayur Pasar';
      case 'FRUIT_PULP':
        return 'Ampas Industri Buah';
      default:
        return type;
    }
  }

  const totalFeedKg = allFeedLogs.reduce((sum, f) => sum + f.quantityKg, 0);

  return (
    <div className="space-y-4 text-[#1d2218]">
      {/* Top Header Eyebrow & Title */}
      <div className="text-center pt-2 pb-1">
        <span className="font-mono text-xs font-bold text-[#8c7b45] block mb-0.5">
          01
        </span>
        <h2 className="text-xl font-black text-[#1d2218] tracking-tight">
          Feed tracking
        </h2>
        <p className="text-xs text-[#635d4f] font-medium mt-0.5">

        </p>
      </div>

      {/* Main Highlight Metric Banner */}
      <div className="bg-[#ffffff] border border-[#e8e4d8] py-3.5 px-3.5 shadow-sm rounded-xl">
        <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold text-[#6b6250]">
          <span>TOTAL HARI INI</span>
          <span>{allFeedLogs.length} sumber terpindai</span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl font-extrabold text-[#1d2218] font-mono tracking-tight">
            {totalFeedKg.toFixed(1)} <span className="text-sm font-bold text-[#6b6250]">kg</span>
          </div>
          <button
            onClick={() => onAddFeedClick()}
            className="bg-[#22542a] hover:bg-[#2b6834] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Catat</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#807663]" />
          <input
            type="text"
            placeholder="Cari pemasok, sertifikat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#ffffff] border border-[#e8e4d8] text-[#1d2218] text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#22542a] font-medium placeholder-[#a09783]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-1 bg-[#ffffff] border border-[#e8e4d8] rounded-lg px-2 py-1">
            <Filter className="w-3 h-3 text-[#6b6250]" />
            <select
              value={selectedSupplierFilter}
              onChange={(e) => setSelectedSupplierFilter(e.target.value)}
              className="bg-transparent text-xs text-[#1d2218] font-semibold focus:outline-none"
            >
              <option value="ALL">Semua Pakan</option>
              <option value="HOTEL_FOOD_WASTE">Makanan Hotel</option>
              <option value="TOFU_DREGS">Ampas Tahu</option>
              <option value="PALM_OIL_WASTE">Limbah Sawit</option>
              <option value="MARKET_ORGANIC_WASTE">Limbah Pasar</option>
            </select>
          </div>

          <button
            onClick={() => setShowPieChart(!showPieChart)}
            className="bg-[#ffffff] hover:bg-[#f5f2e9] text-[#1d2218] text-xs font-bold px-2.5 py-1.5 rounded-lg border border-[#e8e4d8] flex items-center gap-1 transition shrink-0 shadow-sm"
          >
            <PieIcon className="w-3.5 h-3.5 text-[#22542a]" />
            <span>{showPieChart ? 'Sembunyikan' : 'Grafik'}</span>
          </button>
        </div>
      </div>

      {/* Recharts Pie Distribution */}
      {showPieChart && (
        <div className="bg-[#ffffff] border border-[#e8e4d8] rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-[#1d2218] uppercase tracking-wider text-center pb-1 border-b border-[#f0ede6]">
            Komposisi Sumber Nutrisi Organik (Kg)
          </h4>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 15, left: 10 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="42%"
                  innerRadius={38}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1d2218', borderColor: '#22542a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#544d3f', paddingTop: '16px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Timeline Feed Log Cards */}
      <div className="space-y-2.5">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-3.5 shadow-sm relative hover:border-[#1d2218] transition"
          >
            {/* Top row ID & Date */}
            <div className="flex justify-between items-center text-[11px] font-mono text-[#7a705e] mb-1 font-semibold">
              <span>{log.id || `FD-${log.batchId.slice(-4)}`}</span>
              <span>{log.dateGiven}</span>
            </div>

            {/* Main content with left dotted connector */}
            <div className="flex items-start gap-3">
              {/* Left Dotted Vertical Connector with Circle Dot */}
              <div className="flex flex-col items-center self-stretch shrink-0 pt-1">
                <div className="w-3 h-3 rounded-full border-2 border-[#22542a] bg-[#ffffff] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22542a]"></div>
                </div>
                <div className="w-0.5 flex-1 border-l-2 border-dashed border-[#d8cca6] my-1"></div>
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1">
                <h3 className="font-bold text-sm text-[#1d2218] leading-tight">
                  {log.supplierName}
                </h3>
                <p className="text-xs text-[#6e6554] mt-0.5 font-medium">
                  {getFeedTypeLabel(log.sourceType)}
                </p>

                {/* Additional Lab Info Badge */}
                <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-[#f0ede6] text-[10px] font-mono">
                  {log.heavyMetalsCheck === 'PASS' ? (
                    <span className="text-[#22542a] bg-[#f0f7ec] px-1.5 py-0.5 rounded border border-[#c8e2bd] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Terverifikasi Aman
                    </span>
                  ) : (
                    <span className="text-[#a13228] bg-[#f7e0de] px-1.5 py-0.5 rounded border border-[#e8a39e] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Rejection
                    </span>
                  )}

                  <span className="text-[#6e6554] flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#8c7b45]" />
                    {log.labCertificateNo}
                  </span>
                </div>
              </div>

              {/* Right Big Metric Value */}
              <div className="text-right shrink-0">
                <div className="text-base font-extrabold text-[#22542a] font-mono">
                  {log.quantityKg} kg
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
