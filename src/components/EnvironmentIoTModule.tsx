import React, { useState } from 'react';
import { BSFBatch } from '../types';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  Wifi, 
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface EnvironmentIoTModuleProps {
  batches: BSFBatch[];
}

export const EnvironmentIoTModule: React.FC<EnvironmentIoTModuleProps> = ({
  batches,
}) => {
  const [showChart, setShowChart] = useState(true);

  // Combine or grab iotLogs from active batches for global IoT dashboard view
  const allLogs = batches.flatMap((b) => b.iotLogs);
  const iotLogs = allLogs.length > 0 ? allLogs : [
    {
      id: 'iot-default-01',
      batchId: 'BAT-2026-001',
      timestamp: new Date().toISOString(),
      temperatureC: 28.5,
      humidityPct: 72,
      waterPh: 7.0,
      fanRelayStatus: true,
      heaterRelayStatus: false,
      sensorNodeId: 'NODE-SENSOR-01',
    }
  ];

  // Prepare Chart Data
  const chartData = [...iotLogs].slice(0, 10).reverse().map((log) => ({
    time: new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    Suhu: log.temperatureC,
    Kelembapan: log.humidityPct,
    WaterpH: log.waterPh || 7.0,
  }));

  const latestLog = iotLogs[0] || {
    temperatureC: 28.5,
    humidityPct: 72,
    waterPh: 7.0,
    fanRelayStatus: true,
    sensorNodeId: 'NODE-SENSOR-01',
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="space-y-4 text-[#1d2218]">
      {/* Eyebrow & Section Header */}
      <div className="text-center pt-2 pb-1">
        <span className="font-mono text-xs font-bold text-[#8c7b45] block mb-0.5">
          02
        </span>
        <h2 className="text-xl font-black text-[#1d2218] tracking-tight">
          Dashboard IoT Kandang
        </h2>
        <p className="text-xs text-[#635d4f] font-medium mt-0.5">
          Monitoring suhu, kelembapan & pH biopond real-time
        </p>
      </div>

      {/* Real-time Sensor Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-3 shadow-sm relative">
          <div className="flex justify-between items-center text-[#6e6554] text-[11px] font-bold">
            <span>Suhu Udara</span>
            <Thermometer className="w-3.5 h-3.5 text-[#a13228]" />
          </div>
          <div className="text-xl font-extrabold text-[#1d2218] font-mono mt-0.5">
            {latestLog.temperatureC}°C
          </div>
          <span className="text-[10px] text-[#6e6554] block mt-0.5 font-medium">Suhu Normal (27 - 31°C)</span>
        </div>

        <div className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-3 shadow-sm">
          <div className="flex justify-between items-center text-[#6e6554] text-[11px] font-bold">
            <span>Kelembapan Udara</span>
            <Droplets className="w-3.5 h-3.5 text-[#1f6475]" />
          </div>
          <div className="text-xl font-extrabold text-[#1d2218] font-mono mt-0.5">
            {latestLog.humidityPct}%
          </div>
          <span className="text-[10px] text-[#6e6554] block mt-0.5 font-medium">Ideal (60 - 80%)</span>
        </div>

        <div className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-3 shadow-sm">
          <div className="flex justify-between items-center text-[#6e6554] text-[11px] font-bold">
            <span>pH Biopond</span>
            <Droplets className="w-3.5 h-3.5 text-[#22542a]" />
          </div>
          <div className="text-xl font-extrabold text-[#1d2218] font-mono mt-0.5">
            {latestLog.waterPh || 7.0}
          </div>
          <span className="text-[10px] text-[#6e6554] block mt-0.5 font-medium">Netral (6.8 - 7.2)</span>
        </div>

        <div className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-3 shadow-sm">
          <div className="flex justify-between items-center text-[#6e6554] text-[11px] font-bold">
            <span>Kipas Otomatis</span>
            <Wind className="w-3.5 h-3.5 text-[#22542a]" />
          </div>
          <div className="text-sm font-extrabold font-mono mt-1">
            {latestLog.fanRelayStatus ? (
              <span className="text-[#22542a] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#22542a] animate-ping"></span> AKTIF
              </span>
            ) : (
              <span className="text-[#807663]">NONAKTIF</span>
            )}
          </div>
          <span className="text-[10px] text-[#6e6554] block mt-0.5 font-medium">Kontrol Suhu Kandang</span>
        </div>
      </div>

      {/* Telemetry Line Chart */}
      <div className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-3.5 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-bold text-[#1d2218] uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-[#1f6475]" />
            Grafik Telemetri Kandang
          </h3>
          <button
            onClick={() => setShowChart(!showChart)}
            className="text-[10px] text-[#22542a] underline font-bold"
          >
            {showChart ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>

        {showChart && (
          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e4d8" opacity={0.8} />
                <XAxis dataKey="time" stroke="#6e6554" fontSize={10} />
                <YAxis stroke="#6e6554" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1d2218', borderColor: '#22542a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="Suhu" stroke="#a13228" strokeWidth={2} dot={{ r: 2 }} name="Suhu (°C)" />
                <Line type="monotone" dataKey="Kelembapan" stroke="#1f6475" strokeWidth={2} dot={{ r: 2 }} name="Kelembapan (%)" />
                <Line type="monotone" dataKey="WaterpH" stroke="#22542a" strokeWidth={2} dot={{ r: 2 }} name="pH Air" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Timeline Sensor Logs Cards */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-bold text-[#6b6250] block uppercase tracking-wider">
          Log Sensor Terbaru ({iotLogs.length} Data)
        </span>

        {iotLogs.slice(0, 5).map((log) => (
          <div
            key={log.id}
            className="bg-[#ffffff] border border-[#e8e4d8] rounded-xl p-3 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#22542a]"></div>
              <div>
                <span className="font-mono font-bold text-xs text-[#1d2218] block">
                  {log.temperatureC}°C • {log.humidityPct}% RH
                </span>
                <span className="text-[10px] text-[#6e6554] font-mono">
                  {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                </span>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-[#22542a] font-bold block">pH {log.waterPh || 7.0}</span>
              <span className="text-[10px] text-[#6e6554]">
                {log.fanRelayStatus ? 'Fan ON' : 'Fan OFF'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
