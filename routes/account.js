'use strict';

const { Router } = require('express');
const { accounts, ts } = require('../data/mockData');

const router = Router();

// ── Helpers ──────────────────────────────────────────────────
function resolveAccount(req, res) {
  const { accountId } = req.params;
  const id = accountId === '~' ? req.tokenInfo.accountId : accountId;
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
