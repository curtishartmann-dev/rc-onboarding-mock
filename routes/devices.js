'use strict';

const { Router } = require('express');
const { devices, uuidv4 } = require('../data/mockData');

const router = Router();

// ── List all account devices ──────────────────────────────────
router.get('/restapi/v1.0/account/:accountId/device', (req, res) => {
  const { accountId } = req.params;
  const records = devices[accountId] || [];
  res.json({ uri: `/restapi/v1.0/account/${accountId}/device`, records, paging: { totalElements: records.length } });
});

// ── Get single device ─────────────────────────────────────────
router.get('/restapi/v1.0/account/:accountId/device/:deviceId', (req, res) => {
  const { accountId, deviceId } = req.params;
  const dev = (devices[accountId] || []).find(d => d.id === deviceId);
  if (!dev) return res.status(404).json({ errorCode: 'CMN-120', message: 'Device not found.' });
  res.json(dev);
});

// ── Update device ─────────────────────────────────────────────
router.put('/restapi/v1.0/account/:accountId/device/:deviceId', (req, res) => {
  const { accountId, deviceId } = req.params;
  const devList = devices[accountId] || [];
  const idx = devList.findIndex(d => d.id === deviceId);
  if (idx === -1) return res.status(404).json({ errorCode: 'CMN-120', message: 'Device not found.' });
  Object.assign(devList[idx], req.body, { id: deviceId });
  res.json(devList[idx]);
});

// ── List devices for extension ────────────────────────────────
router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/device', (req, res) => {
  const { accountId, extensionId } = req.params;
  const records = (devices[accountId] || []).filter(d => d.extension && d.extension.id === extensionId);
  res.json({ uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/device`, records, paging: { totalElements: records.length } });
});

// ── Bulk add devices (v2) ─────────────────────────────────────
router.post('/restapi/v2/accounts/:accountId/devices/bulk-add', (req, res) => {
  const { accountId } = req.params;
  const body = req.body || {};
  const added = (body.devices || []).map(d => ({
    id: `dev-${uuidv4().slice(0, 8)}`,
    sku: d.sku || 'SOFTPHONE',
    type: d.type || 'SoftPhone',
    name: d.name || 'New Device',
    status: 'NotActivated',
    serial: d.serial || null,
    model: d.model || null,
    extension: d.extension || null,
    phoneLines: [],
    site: d.site || { id: 'main', name: 'Main Site' },
  }));

  if (!devices[accountId]) devices[accountId] = [];
  devices[accountId].push(...added);

  res.json({ status: 'Completed', affectedItems: added.length, items: added });
});

// ── Device inventory (v2) ─────────────────────────────────────
router.get('/restapi/v2/accounts/:accountId/device-inventory', (req, res) => {
  const { accountId } = req.params;
  const records = devices[accountId] || [];
  res.json({ records, paging: { totalElements: records.length } });
});

module.exports = router;
