export type BatchStatus = 'INCUBATION' | 'LARVAL_FEEDING' | 'HARVEST_DRYING' | 'PACKAGED' | 'IN_TRANSIT' | 'DELIVERED';

export type FeedType = 'HOTEL_FOOD_WASTE' | 'TOFU_DREGS' | 'PALM_OIL_WASTE' | 'MARKET_ORGANIC_WASTE' | 'FRUIT_PULP';

export interface FeedLog {
  id: string;
  batchId: string;
  supplierName: string;
  sourceType: FeedType;
  quantityKg: number;
  dateGiven: string;
  heavyMetalsCheck: 'PASS' | 'FAIL';
  toxinPpm: number;
  labCertificateNo: string;
  notes?: string;
}

export interface IoTLog {
  id: string;
  batchId: string;
  timestamp: string;
  temperatureC: number;
  humidityPct: number;
  waterPh?: number;
  waterTdsPpm?: number;
  ammoniaPpm: number;
  fanRelayStatus: boolean;
  heaterRelayStatus: boolean;
  sensorNodeId: string; // e.g. "NODE-ESP32-ALPHA"
}

export interface ProcessingLog {
  id: string;
  batchId: string;
  harvestDate: string;
  freshYieldKg: number;
  dryYieldKg: number;
  dryingMethod: 'MICROWAVE_DRYING_120C' | 'ROTARY_DRYER_150C' | 'SOLAR_HYBRID';
  dryingTempC: number;
  dryingDurationMin: number;
  moistureContentPct: number;
  crudeProteinPct: number;
  crudeFatPct: number;
  salmonellaTest: 'NEGATIVE_0_CFU' | 'POSITIVE';
  eColiTest: 'NEGATIVE_0_CFU' | 'POSITIVE';
  labInspector: string;
  sanitationCertNo: string;
}

export interface CashMutation {
  id: string;
  date: string;
  partnerName: string;
  partnerType: 'MITRA_PLASMA' | 'PEMASOK_PAKAN' | 'MAIN_FACILITY' | 'B2B_BUYER';
  category: 'OPERATIONAL_EXPENSE' | 'HARVEST_OFFTAKE' | 'FEED_PURCHASE' | 'EXPORT_REVENUE' | 'EQUIPMENT_MAINTENANCE';
  amountIdr: number;
  type: 'INFLOW' | 'OUTFLOW';
  batchRef?: string;
  description: string;
  proofDocumentNo: string;
}

export interface BSFBatch {
  id: string; // e.g. "BATCH-EU-240510"
  containerQrCode: string; // e.g. "BOX-240510-07"
  plasmaPartnerName: string;
  location: string;
  startDate: string;
  targetHarvestDate: string;
  eggWeightGrams: number;
  status: BatchStatus;
  exportDestination: string; // e.g. "Rotterdam, Netherlands (Pet-Food Industry)"
  blockchainTxHash: string; // Simulated Immutable Ledger Tx
  feedLogs: FeedLog[];
  iotLogs: IoTLog[];
  processingLog?: ProcessingLog;
}

export interface IoTComponentSpec {
  component: string;
  model: string;
  pinConnection: string;
  function: string;
  unitPriceIdr: number;
}
