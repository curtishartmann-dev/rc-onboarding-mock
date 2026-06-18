'use strict';

const { Router } = require('express');
const { phoneNumbers, uuidv4 } = require('../data/mockData');

const router = Router();

// ── v1 phone numbers ──────────────────────────────────────────
router.get('/restapi/v1.0/account/:accountId/phone-number', (req, res) => {
  const { accountId } = req.params;
  const nums = phoneNumbers[accountId] || [];
  const { usageType, status } = req.query;
  let records = nums;
  if (usageType) records = records.filter(n => n.usageType === usageType);
  if (status) records = records.filter(n => n.status === status);
  res.json({
    uri: `/restapi/v1.0/account/${accountId}/phone-number`,
    records,
    paging: { page: 1, perPage: 100, pageStart: 0, pageEnd: records.length, totalPages: 1, totalElements: records.length },
    navigation: { firstPage: { uri: `/restapi/v1.0/account/${accountId}/phone-number?page=1` }, lastPage: { uri: `/restapi/v1.0/account/${accountId}/phone-number?page=1` } },
  });
});

router.get('/restapi/v1.0/account/:accountId/phone-number/:phoneNumberId', (req, res) => {
  const { accountId, phoneNumberId } = req.params;
  const num = (phoneNumbers[accountId] || []).find(n => n.id === phoneNumberId);
  if (!num) return res.status(404).json({ errorCode: 'CMN-120', message: 'Phone number not found.' });
  res.json(num);
});

// ── v2 phone numbers ──────────────────────────────────────────
router.get('/restapi/v2/accounts/:accountId/phone-numbers', (req, res) => {
  const { accountId } = req.params;
  const nums = phoneNumbers[accountId] || [];
  const { usageType, status } = req.query;
  let records = nums;
  if (usageType) records = records.filter(n => n.usageType === usageType);
  if (status) records = records.filter(n => n.status === status);
  res.json({
    records,
    paging: { page: 1, perPage: 100, pageStart: 0, pageEnd: records.length, totalPages: 1, totalElements: records.length },
    navigation: { firstPage: { uri: `/restapi/v2/accounts/${accountId}/phone-numbers?page=1` }, lastPage: { uri: `/restapi/v2/accounts/${accountId}/phone-numbers?page=1` } },
  });
});

// ── Assign / update phone number ──────────────────────────────
router.patch('/restapi/v2/accounts/:accountId/phone-numbers/:phoneNumberId', (req, res) => {
  const { accountId, phoneNumberId } = req.params;
  const nums = phoneNumbers[accountId] || [];
  const idx = nums.findIndex(n => n.id === phoneNumberId);
  if (idx === -1) return res.status(404).json({ errorCode: 'CMN-120', message: 'Phone number not found.' });
  Object.assign(nums[idx], req.body, { id: phoneNumberId });
  res.json(nums[idx]);
});

// ── Bulk add (returns task) ───────────────────────────────────
router.post('/restapi/v2/accounts/:accountId/phone-numbers/bulk-add', (req, res) => {
  const { accountId } = req.params;
  const body = req.body || {};
  const newNums = (body.phoneNumbers || []).map(n => ({
    id: `pn-${uuidv4().slice(0, 8)}`,
    phoneNumber: n.phoneNumber,
    usageType: n.usageType || 'AdditionalCompanyNumber',
    type: 'VoiceFax',
    status: 'Normal',
    extension: null,
    country: { isoCode: 'US' },
  }));

  if (!phoneNumbers[accountId]) phoneNumbers[accountId] = [];
  phoneNumbers[accountId].push(...newNums);

  res.json({
    id: `task-${uuidv4().slice(0, 8)}`,
    status: 'Completed',
    result: newNums,
  });
});

module.exports = router;
