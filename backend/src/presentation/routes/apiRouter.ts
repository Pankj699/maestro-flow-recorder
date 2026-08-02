import { Router } from 'express';
import { DeviceController } from '../controllers/DeviceController';
import { FlowController } from '../controllers/FlowController';
import { ReportController } from '../controllers/ReportController';

const router = Router();

const deviceCtrl = new DeviceController();
const flowCtrl = new FlowController();
const reportCtrl = new ReportController();

// Device endpoints
router.get('/devices', deviceCtrl.getDevices);

// Flow endpoints
router.get('/flows', flowCtrl.getAll);
router.get('/flows/:id', flowCtrl.getById);
router.post('/flows', flowCtrl.create);
router.put('/flows/:id', flowCtrl.update);
router.delete('/flows/:id', flowCtrl.delete);
router.post('/flows/optimize', flowCtrl.optimize);

// Report endpoints
router.post('/reports/html', reportCtrl.generateHtml);
router.post('/reports/junit', reportCtrl.generateJUnitXml);

// Settings endpoint
router.post('/settings', (req, res) => {
  const { adbPath } = req.body;
  if (adbPath) {
    process.env.ADB_PATH = adbPath;
  }
  res.json({ success: true, message: 'Backend settings updated dynamically' });
});

export default router;
