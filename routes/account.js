'use strict';

const { Router } = require('express');
const { accounts, businessAddresses, ts } = require('../data/mockData');

const router = Router();

// ── Helpers ──────────────────────────────────────────────────
function resolveAccount(req, res) {
  const { accountId } = req.params;
  const id = accountId === '~' ? Object.keys(accounts)[0] : accountId;
  const acc = accounts[id];
  if (!acc) {
    res.status(404).json({ errorCode: 'CMN-120', message: `Account '${id}' not found.` });
    return null;
  }
  return acc;
}

// ── GET /restapi/v1.0/account/:accountId ──────────────────────
router.get('/restapi/v1.0/account/:accountId', (req, res) => {
  const acc = resolveAccount(req, res);
  if (!acc) return;
  res.json(acc);
});

// ── PUT /restapi/v1.0/account/:accountId ─────────────────────
// Supports updating company name, regional settings, etc.
router.put('/restapi/v1.0/account/:accountId', (req, res) => {
  const acc = resolveAccount(req, res);
  if (!acc) return;
  Object.assign(acc, req.body, { id: acc.id }); // prevent id override
  res.json(acc);
});

// ── GET /restapi/v1.0/account/:accountId/service-info ────────
router.get('/restapi/v1.0/account/:accountId/service-info', (req, res) => {
  const acc = resolveAccount(req, res);
  if (!acc) return;
  res.json(acc.serviceInfo);
});

// ── GET /restapi/v1.0/account/:accountId/business-address ────
router.get('/restapi/v1.0/account/:accountId/business-address', (req, res) => {
  const { accountId } = req.params;
  const addr = businessAddresses[accountId];
  if (!addr) return res.status(404).json({ errorCode: 'CMN-120', message: `Business address for account '${accountId}' not found.` });
  res.json({ uri: `/restapi/v1.0/account/${accountId}/business-address`, ...addr });
});

// ── PUT /restapi/v1.0/account/:accountId/business-address ────
router.put('/restapi/v1.0/account/:accountId/business-address', (req, res) => {
  const { accountId } = req.params;
  if (!businessAddresses[accountId]) businessAddresses[accountId] = {};
  Object.assign(businessAddresses[accountId], req.body);
  res.json({ uri: `/restapi/v1.0/account/${accountId}/business-address`, ...businessAddresses[accountId] });
});

// ── GET /restapi/v2/accounts/:accountId/regional-settings ────
router.get('/restapi/v2/accounts/:accountId/regional-settings', (req, res) => {
  const { accountId } = req.params;
  const acc = accounts[accountId];
  if (!acc) return res.status(404).json({ errorCode: 'CMN-120', message: `Account '${accountId}' not found.` });
  res.json({ uri: `/restapi/v2/accounts/${accountId}/regional-settings`, ...acc.regionalSettings });
});

// ── PATCH /restapi/v2/accounts/:accountId/regional-settings ──
router.patch('/restapi/v2/accounts/:accountId/regional-settings', (req, res) => {
  const { accountId } = req.params;
  const acc = accounts[accountId];
  if (!acc) return res.status(404).json({ errorCode: 'CMN-120', message: `Account '${accountId}' not found.` });
  acc.regionalSettings = Object.assign(acc.regionalSettings || {}, req.body);
  res.json({ uri: `/restapi/v2/accounts/${accountId}/regional-settings`, ...acc.regionalSettings });
});

// ── GET /restapi — API root ───────────────────────────────────
router.get('/restapi', (req, res) => {
  res.json({
    uri: 'https://platform.ringcentral.com/restapi',
    apiVersions: [
      { uri: 'https://platform.ringcentral.com/restapi/v1.0', versionString: '1.0.60', releaseDate: '2026-01-01', uriString: 'v1.0' },
    ],
    serverVersion: 'mock-1.0.0',
    serverRevision: 'mock',
  });
});

module.exports = router;
