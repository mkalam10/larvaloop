import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_BATCHES, INITIAL_CASH_MUTATIONS, IOT_HARDWARE_SPECS } from './src/data/initialData';
import { BSFBatch, CashMutation, FeedLog, IoTLog, ProcessingLog } from './src/types';

// In-memory data store for live fullstack mutations
let batchesStore: BSFBatch[] = JSON.parse(JSON.stringify(INITIAL_BATCHES));
let cashStore: CashMutation[] = JSON.parse(JSON.stringify(INITIAL_CASH_MUTATIONS));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'LarvaLoop Traceability Engine', timestamp: new Date().toISOString() });
  });

  // Get all batches
  app.get('/api/batches', (_req: Request, res: Response) => {
    res.json({ success: true, count: batchesStore.length, data: batchesStore });
  });

  // Get single batch by ID or Container QR Code
  app.get('/api/batches/:idOrQr', (req: Request, res: Response) => {
    const { idOrQr } = req.params;
    const batch = batchesStore.find(
      (b) => b.id.toLowerCase() === idOrQr.toLowerCase() || b.containerQrCode.toLowerCase() === idOrQr.toLowerCase()
    );
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found for specified ID or QR Code' });
    }
    return res.json({ success: true, data: batch });
  });

  // Create new BSF Batch
  app.post('/api/batches', (req: Request, res: Response) => {
    const { plasmaPartnerName, location, eggWeightGrams, exportDestination } = req.body;
    if (!plasmaPartnerName || !eggWeightGrams) {
      return res.status(400).json({ success: false, error: 'Missing required fields: plasmaPartnerName, eggWeightGrams' });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const newId = `BATCH-ID-${Date.now().toString().slice(-6)}`;
    const qrCode = `BOX-${dateStr.replace(/-/g, '').slice(2)}-${Math.floor(10 + Math.random() * 90)}`;
    const mockHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newBatch: BSFBatch = {
      id: newId,
      containerQrCode: qrCode,
      plasmaPartnerName,
      location: location || 'Palembang Hub, Sumatera Selatan',
      startDate: dateStr,
      targetHarvestDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      eggWeightGrams: Number(eggWeightGrams),
      status: 'INCUBATION',
      exportDestination: exportDestination || 'Rotterdam Port, Netherlands',
      blockchainTxHash: mockHash,
      feedLogs: [],
      iotLogs: [],
    };

    batchesStore.unshift(newBatch);
    return res.json({ success: true, message: 'Batch successfully created', data: newBatch });
  });

  // Add Feed Log to Batch
  app.post('/api/batches/:id/feed', (req: Request, res: Response) => {
    const { id } = req.params;
    const { supplierName, sourceType, quantityKg, heavyMetalsCheck, toxinPpm, labCertificateNo, notes } = req.body;

    const batch = batchesStore.find((b) => b.id === id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    const newFeed: FeedLog = {
      id: `FEED-${Date.now().toString().slice(-5)}`,
      batchId: id,
      supplierName: supplierName || 'Koperasi Pakan Organik',
      sourceType: sourceType || 'TOFU_DREGS',
      quantityKg: Number(quantityKg) || 100,
      dateGiven: new Date().toISOString().split('T')[0],
      heavyMetalsCheck: heavyMetalsCheck || 'PASS',
      toxinPpm: Number(toxinPpm) || 0.0,
      labCertificateNo: labCertificateNo || `LAB-SUCOFINDO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      notes,
    };

    batch.feedLogs.unshift(newFeed);
    if (batch.status === 'INCUBATION') {
      batch.status = 'LARVAL_FEEDING';
    }

    return res.json({ success: true, message: 'Feed log added successfully', data: newFeed, batch });
  });

  // Post IoT Log or Simulate Sensor Data
  app.post('/api/batches/:id/iot', (req: Request, res: Response) => {
    const { id } = req.params;
    const { temperatureC, humidityPct, waterPh, waterTdsPpm, ammoniaPpm, sensorNodeId } = req.body;

    const batch = batchesStore.find((b) => b.id === id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    const temp = Number(temperatureC) || 29.5;
    const fanActive = temp > 31.5;

    const newIoT: IoTLog = {
      id: `IOT-${Date.now().toString().slice(-5)}`,
      batchId: id,
      timestamp: new Date().toISOString(),
      temperatureC: temp,
      humidityPct: Number(humidityPct) || 72,
      waterPh: waterPh ? Number(waterPh) : 7.0,
      waterTdsPpm: waterTdsPpm ? Number(waterTdsPpm) : 420,
      ammoniaPpm: Number(ammoniaPpm) || 1.5,
      fanRelayStatus: fanActive,
      heaterRelayStatus: temp < 26.0,
      sensorNodeId: sensorNodeId || 'NODE-ESP32-ALPHA-01',
    };

    batch.iotLogs.unshift(newIoT);
    return res.json({ success: true, message: 'IoT telemetry recorded', data: newIoT, alertFanTriggered: fanActive });
  });

  // Record Processing & Microwave Drying Log
  app.post('/api/batches/:id/processing', (req: Request, res: Response) => {
    const { id } = req.params;
    const { freshYieldKg, dryYieldKg, dryingMethod, dryingTempC, dryingDurationMin, moistureContentPct, crudeProteinPct, crudeFatPct, labInspector } = req.body;

    const batch = batchesStore.find((b) => b.id === id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    const processing: ProcessingLog = {
      id: `PROC-${Date.now().toString().slice(-5)}`,
      batchId: id,
      harvestDate: new Date().toISOString().split('T')[0],
      freshYieldKg: Number(freshYieldKg) || 1000,
      dryYieldKg: Number(dryYieldKg) || 330,
      dryingMethod: dryingMethod || 'MICROWAVE_DRYING_120C',
      dryingTempC: Number(dryingTempC) || 120,
      dryingDurationMin: Number(dryingDurationMin) || 18,
      moistureContentPct: Number(moistureContentPct) || 5.0,
      crudeProteinPct: Number(crudeProteinPct) || 45.2,
      crudeFatPct: Number(crudeFatPct) || 31.0,
      salmonellaTest: 'NEGATIVE_0_CFU',
      eColiTest: 'NEGATIVE_0_CFU',
      labInspector: labInspector || 'Dr. Ir. Hendra Prasetyo (Balai Karantina Pertanian)',
      sanitationCertNo: `CERT-SPS-ID-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    batch.processingLog = processing;
    batch.status = 'PACKAGED';

    return res.json({ success: true, message: 'Processing & Microwave sterilization log recorded', data: processing, batch });
  });

  // Get Cash Mutations
  app.get('/api/cashflow', (_req: Request, res: Response) => {
    const totalInflow = cashStore.filter((c) => c.type === 'INFLOW').reduce((sum, c) => sum + c.amountIdr, 0);
    const totalOutflow = cashStore.filter((c) => c.type === 'OUTFLOW').reduce((sum, c) => sum + c.amountIdr, 0);
    const netBalance = totalInflow - totalOutflow;

    res.json({
      success: true,
      summary: { totalInflow, totalOutflow, netBalance },
      data: cashStore,
    });
  });

  // Add Cash Mutation
  app.post('/api/cashflow', (req: Request, res: Response) => {
    const { partnerName, partnerType, category, amountIdr, type, batchRef, description, proofDocumentNo } = req.body;
    if (!partnerName || !amountIdr || !type) {
      return res.status(400).json({ success: false, error: 'Missing required cash mutation fields' });
    }

    const newMutation: CashMutation = {
      id: `MUT-2026-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      partnerName,
      partnerType: partnerType || 'MITRA_PLASMA',
      category: category || 'HARVEST_OFFTAKE',
      amountIdr: Number(amountIdr),
      type,
      batchRef,
      description: description || 'Transaksi Arus Kas Mitra LarvaLoop',
      proofDocumentNo: proofDocumentNo || `KW-LARVA-${Math.floor(100 + Math.random() * 900)}`,
    };

    cashStore.unshift(newMutation);
    res.json({ success: true, message: 'Cash mutation recorded successfully', data: newMutation });
  });

  // Get CTO IoT Hardware Circuit & Firmware Blueprint
  app.get('/api/iot/hardware-blueprint', (_req: Request, res: Response) => {
    res.json({
      success: true,
      title: 'Rangkaian IoT & Hardware Telemetry LarvaLoop (CTO Pitch Specification)',
      microcontroller: 'ESP32 DevKit V1 30-Pin Dual Core (Wi-Fi + BLE)',
      mqttBrokerTopic: 'larvaloop/kandang/{node_id}/telemetry',
      components: IOT_HARDWARE_SPECS,
      cppFirmwareSnippet: `
/*
 * LarvaLoop ESP32 IoT Node Firmware v2.4
 * Hardware: ESP32 + DHT22 + DS18B20 + pH Probe + TDS Sensor + 4-Ch Relay
 * Protocols: MQTT over TLS + HTTP REST Fallback
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

#define DHTPIN 4
#define DHTTYPE DHT22
#define ONE_WIRE_BUS 13
#define RELAY_FAN 16
#define RELAY_HEATER 17
#define PH_ANALOG_PIN 34
#define TDS_ANALOG_PIN 35

DHT dht(DHTPIN, DHTTYPE);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

const char* ssid = "LARVALOOP_FARM_WIFI";
const char* password = "EsgTraceability2026";
const char* mqtt_server = "broker.larvaloop.id";

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(RELAY_HEATER, OUTPUT);
  digitalWrite(RELAY_FAN, HIGH); // Off Active Low
  
  dht.begin();
  sensors.begin();
  WiFi.begin(ssid, password);
}

void loop() {
  float tempC = dht.readTemperature();
  float humidity = dht.readHumidity();
  sensors.requestTemperatures();
  float waterTempC = sensors.getTempCByIndex(0);
  
  // Read Analog Sensors
  int rawPH = analogRead(PH_ANALOG_PIN);
  float phVal = 3.3 * (rawPH / 4095.0) * 3.5; // Calibrated formula
  
  // Auto Actuator Logic (CTO Edge Intelligence)
  if (tempC > 31.5) {
    digitalWrite(RELAY_FAN, LOW); // Turn Fan ON
  } else {
    digitalWrite(RELAY_FAN, HIGH); // Turn Fan OFF
  }

  // Publish JSON Payload to Cloud
  StaticJsonDocument<256> doc;
  doc["node_id"] = "NODE-ESP32-ALPHA-01";
  doc["temperatureC"] = tempC;
  doc["humidityPct"] = humidity;
  doc["waterTempC"] = waterTempC;
  doc["waterPh"] = phVal;
  
  char buffer[256];
  serializeJson(doc, buffer);
  // mqttClient.publish("larvaloop/telemetry", buffer);
  
  delay(10000); // 10s sampling rate
}
      `.trim(),
    });
  });

  // AI Summary generation using Gemini server-side SDK (if process.env.GEMINI_API_KEY is configured)
  app.post('/api/ai/analyze-provenance', async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          success: true,
          aiAnalysis: 'Pemeriksaan kepatuhan standar ekspor Uni Eropa & Jepang: Pakan organik 100% bebas logam berat. Pengeringan microwave 120°C terverifikasi mematikan Salmonella dan E.Coli. Produk siap dikirim dengan jaminan ESG & Phytosanitary Certificate.',
          isSimulated: true,
        });
      }

      const { batchData } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
Anda adalah Auditor Karantina Pertanian & ESG Inspector LarvaLoop.
Analisis data batch BSF / Maggot berikut dan berikan ringkasan eksekutif kepatuhan ekspor (3 kalimat dalam Bahasa Indonesia):
Data Batch: ${JSON.stringify(batchData)}
Pastikan menyinggung: Keamanan pakan organik, Pembasmian patogen Salmonella/E.Coli via Microwave drying, dan Status kesiapan ekspor.
      `.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        aiAnalysis: response.text || 'Laporan audit kepatuhan ekspor terverifikasi.',
        isSimulated: false,
      });
    } catch (err: any) {
      console.error('Gemini API error:', err);
      return res.status(200).json({
        success: true,
        aiAnalysis: 'Laporan Audit Kepatuhan Ekspor: Pakan terverifikasi bebas bahan beracun, proses pengeringan microwave 120°C menjamin Salmonella 0 CFU. Memenuhi kriteria sanitary/phytosanitary Uni Eropa.',
        isSimulated: true,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LarvaLoop Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
