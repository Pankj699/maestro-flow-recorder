import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './presentation/routes/apiRouter';
import { RecordingService } from './application/services/RecordingService';
import { FlowRunnerService } from './application/services/FlowRunnerService';
import { SocketHandler } from './infrastructure/websocket/SocketHandler';
import { VirtualDeviceBridge } from './infrastructure/bridge/VirtualDeviceBridge';
import { ADBBridge } from './infrastructure/bridge/ADBBridge';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Maestro Flow Recorder Engine' });
});

// Initialize services & WebSockets
const recordingService = new RecordingService();
const virtualBridge = new VirtualDeviceBridge();
const adbBridge = new ADBBridge();
new SocketHandler(io, recordingService, virtualBridge, adbBridge);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` 🚀 Maestro Flow Recorder Backend listening on port ${PORT}`);
  console.log(` 📱 WebSocket server initialized & ready for device sessions`);
  console.log(`===================================================`);
});
