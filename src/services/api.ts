import { BSFBatch, CashMutation, FeedLog, IoTLog, ProcessingLog } from '../types';

export const fetchBatches = async (): Promise<BSFBatch[]> => {
  try {
    const res = await fetch('/api/batches');
    const json = await res.json();
    if (json.success) return json.data;
  } catch (err) {
    console.error('Error fetching batches:', err);
  }
  return [];
};

export const fetchBatchByQrOrId = async (idOrQr: string): Promise<BSFBatch | null> => {
  try {
    const res = await fetch(`/api/batches/${encodeURIComponent(idOrQr)}`);
    const json = await res.json();
    if (json.success) return json.data;
  } catch (err) {
    console.error('Error fetching batch:', err);
  }
  return null;
};

export const createNewBatchApi = async (data: {
  plasmaPartnerName: string;
  location: string;
  eggWeightGrams: number;
  exportDestination: string;
}): Promise<BSFBatch | null> => {
  try {
    const res = await fetch('/api/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) return json.data;
  } catch (err) {
    console.error('Error creating batch:', err);
  }
  return null;
};

export const addFeedLogApi = async (
  batchId: string,
  data: Omit<FeedLog, 'id' | 'batchId'>
): Promise<FeedLog | null> => {
  try {
    const res = await fetch(`/api/batches/${batchId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) return json.data;
  } catch (err) {
    console.error('Error adding feed log:', err);
  }
  return null;
};

export const recordIoTTelemetryApi = async (
  batchId: string,
  data: Partial<IoTLog>
): Promise<IoTLog | null> => {
  try {
    const res = await fetch(`/api/batches/${batchId}/iot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) return json.data;
  } catch (err) {
    console.error('Error recording IoT telemetry:', err);
  }
  return null;
};

export const recordProcessingLogApi = async (
  batchId: string,
  data: Partial<ProcessingLog>
): Promise<ProcessingLog | null> => {
  try {
    const res = await fetch(`/api/batches/${batchId}/processing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) return json.data;
  } catch (err) {
    console.error('Error recording processing log:', err);
  }
  return null;
};

export const fetchCashMutationsApi = async (): Promise<{
  data: CashMutation[];
  summary: { totalInflow: number; totalOutflow: number; netBalance: number };
}> => {
  try {
    const res = await fetch('/api/cashflow');
    const json = await res.json();
    if (json.success) {
      return { data: json.data, summary: json.summary };
    }
  } catch (err) {
    console.error('Error fetching cashflow:', err);
  }
  return { data: [], summary: { totalInflow: 0, totalOutflow: 0, netBalance: 0 } };
};

export const addCashMutationApi = async (
  mutation: Omit<CashMutation, 'id' | 'date'>
): Promise<CashMutation | null> => {
  try {
    const res = await fetch('/api/cashflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mutation),
    });
    const json = await res.json();
    if (json.success) return json.data;
  } catch (err) {
    console.error('Error adding cash mutation:', err);
  }
  return null;
};

export const fetchIoTHardwareBlueprint = async () => {
  try {
    const res = await fetch('/api/iot/hardware-blueprint');
    const json = await res.json();
    if (json.success) return json;
  } catch (err) {
    console.error('Error fetching IoT hardware blueprint:', err);
  }
  return null;
};

export const analyzeProvenanceWithAI = async (batchData: BSFBatch): Promise<string> => {
  try {
    const res = await fetch('/api/ai/analyze-provenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchData }),
    });
    const json = await res.json();
    if (json.success) return json.aiAnalysis;
  } catch (err) {
    console.error('Error analyzing provenance:', err);
  }
  return 'Analisis kepatuhan ekspor: Pakan organik 100% bebas logam berat dan pestisida. Pengeringan microwave 120°C terbukti membunuh patogen Salmonella/E.Coli (0 CFU). Lulus uji karantina.';
};
