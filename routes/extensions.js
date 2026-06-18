'use strict';

const { Router } = require('express');
const { extensions, accounts, uuidv4, ts } = require('../data/mockData');

const router = Router();

function getExtMap(accountId) {
  return extensions[accountId] || {};
}

// ── LIST extensions ───────────────────────────────────────────
// GET /restapi/v1.0/account/:accountId/extension
router.get('/restapi/v1.0/account/:accountId/extension', (req, res) => {
  const { accountId } = req.params;
  const map = getExtMap(accountId);

  let records = Object.values(map);

  // optional filters
  const { type, status, extensionNumber } = req.query;
  if (type) records = records.filter(e => e.type === type);
  if (status) records = records.filter(e => e.status === status);
  if (extensionNumber) records = records.filter(e => e.extensionNumber === extensionNumber);

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 100;
  const start = (page - 1) * perPage;

  res.json({
    uri: `/restapi/v1.0/account/${accountId}/extension`,
    records: records.slice(start, start + perPage),
    paging: { page, perPage, pageStart: start, pageEnd: start + records.length, totalPages: Math.ceil(records.length / perPage), totalElements: records.length },
    navigation: { firstPage: { uri: '' }, lastPage: { uri: '' } },
  });
});

// ── GET single extension ──────────────────────────────────────
router.get('/restapi/v1.0/account/:accountId/extension/:extensionId', (req, res) => {
  const { accountId, extensionId } = req.params;
  const map = getExtMap(accountId);
  const ext = map[extensionId];
  if (!ext) return res.status(404).json({ errorCode: 'CMN-120', message: `Extension '${extensionId}' not found.` });
  res.json(ext);
});

// ── CREATE extension ──────────────────────────────────────────
router.post('/restapi/v1.0/account/:accountId/extension', (req, res) => {
  const { accountId } = req.params;
  if (!extensions[accountId]) extensions[accountId] = {};

  const body = req.body || {};
  const newId = `ext-${accountId.replace('acc-', '')}-${uuidv4().slice(0, 6)}`;

  const ext = {
    id: newId,
    uri: `/restapi/v1.0/account/${accountId}/extension/${newId}`,
    extensionNumber: body.extensionNumber || String(Object.keys(extensions[accountId]).length + 200),
    contact: body.contact || {},
    name: body.contact ? `${body.contact.firstName || ''} ${body.contact.lastName || ''}`.trim() : 'New User',
    type: body.type || 'User',
    status: 'NotActivated',
    departments: body.departments || [],
    permissions: body.permissions || { admin: { enabled: false }, internationalCalling: { enabled: false } },
    setupWizardState: 'NotStarted',
    hidden: false,
    assignedRole: body.assignedRole || { id: 'role-user', displayName: 'Standard User' },
    createdAt: ts(),
  };

  extensions[accountId][newId] = ext;
  res.status(200).json(ext);
});

// ── UPDATE extension ──────────────────────────────────────────
router.put('/restapi/v1.0/account/:accountId/extension/:extensionId', (req, res) => {
  const { accountId, extensionId } = req.params;
  const map = getExtMap(accountId);
  if (!map[extensionId]) return res.status(404).json({ errorCode: 'CMN-120', message: `Extension '${extensionId}' not found.` });

  const body = req.body || {};
  Object.assign(map[extensionId], body, { id: extensionId }); // preserve id
  res.json(map[extensionId]);
});

// ── PATCH extension (partial update) ─────────────────────────
router.patch('/restapi/v1.0/account/:accountId/extension/:extensionId', (req, res) => {
  const { accountId, extensionId } = req.params;
  const map = getExtMap(accountId);
  if (!map[extensionId]) return res.status(404).json({ errorCode: 'CMN-120', message: `Extension '${extensionId}' not found.` });

  const body = req.body || {};
  Object.assign(map[extensionId], body, { id: extensionId });
  res.json(map[extensionId]);
});

// ── GET extension phone numbers ───────────────────────────────
router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/phone-number', (req, res) => {
  const { accountId, extensionId } = req.params;
  const { phoneNumbers } = require('../data/mockData');
  const nums = (phoneNumbers[accountId] || []).filter(p => p.extension && p.extension.id === extensionId);
  res.json({
    uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/phone-number`,
    records: nums,
    paging: { page: 1, perPage: 100, pageStart: 0, pageEnd: nums.length, totalPages: 1, totalElements: nums.length },
  });
});

// ── GET extension caller ID ───────────────────────────────────
router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/caller-id', (req, res) => {
  const { accountId, extensionId } = req.params;
  const { phoneNumbers } = require('../data/mockData');
  const direct = (phoneNumbers[accountId] || []).find(p => p.extension && p.extension.id === extensionId);

  res.json({
    uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/caller-id`,
    byDevice: [],
    byFeature: [
      { feature: 'RingOut', callerId: { type: 'PhoneNumber', phoneInfo: direct || null } },
      { feature: 'RingMe', callerId: { type: 'PhoneNumber', phoneInfo: direct || null } },
      { feature: 'CallFlip', callerId: { type: 'PhoneNumber', phoneInfo: direct || null } },
    ],
  });
});

// ── PUT/PATCH caller ID ───────────────────────────────────────
router.put('/restapi/v1.0/account/:accountId/extension/:extensionId/caller-id', (req, res) => {
  res.json({ ...req.body, uri: `/restapi/v1.0/account/${req.params.accountId}/extension/${req.params.extensionId}/caller-id` });
});

// ── Roles ─────────────────────────────────────────────────────
router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/assigned-role', (req, res) => {
  const { accountId, extensionId } = req.params;
  const ext = getExtMap(accountId)[extensionId];
  if (!ext) return res.status(404).json({ errorCode: 'CMN-120', message: 'Extension not found.' });
  res.json({ uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/assigned-role`, records: ext.assignedRole ? [ext.assignedRole] : [] });
});

router.put('/restapi/v1.0/account/:accountId/extension/:extensionId/assigned-role', (req, res) => {
  const { accountId, extensionId } = req.params;
  const ext = getExtMap(accountId)[extensionId];
  if (!ext) return res.status(404).json({ errorCode: 'CMN-120', message: 'Extension not found.' });
  ext.assignedRole = req.body;
  res.json({ uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/assigned-role`, records: [req.body] });
});

// ── v2 extensions endpoint ────────────────────────────────────
router.get('/restapi/v2/accounts/:accountId/extensions', (req, res) => {
  const { accountId } = req.params;
  const map = getExtMap(accountId);
  const records = Object.values(map);
  res.json({ records, paging: { totalElements: records.length } });
});

module.exports = router;
