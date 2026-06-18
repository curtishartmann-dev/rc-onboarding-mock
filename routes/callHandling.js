'use strict';

const { Router } = require('express');
const {
  answeringRules, ivrMenus, callQueues,
  businessHours, forwardingNumbers,
  callRecording, greetings, uuidv4, ts,
} = require('../data/mockData');

const router = Router();

// ═══════════════════════════════════════════════════════════════
//  BUSINESS HOURS
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/business-hours', (req, res) => {
  const { accountId, extensionId } = req.params;
  const bh = (businessHours[accountId] || {})[extensionId]
    || { schedule: { weeklyRanges: { monday: [{ from: '09:00', to: '17:00' }], tuesday: [{ from: '09:00', to: '17:00' }], wednesday: [{ from: '09:00', to: '17:00' }], thursday: [{ from: '09:00', to: '17:00' }], friday: [{ from: '09:00', to: '17:00' }] } } };
  res.json({ uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/business-hours`, ...bh });
});

router.put('/restapi/v1.0/account/:accountId/extension/:extensionId/business-hours', (req, res) => {
  const { accountId, extensionId } = req.params;
  if (!businessHours[accountId]) businessHours[accountId] = {};
  businessHours[accountId][extensionId] = req.body;
  res.json({ uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/business-hours`, ...req.body });
});

router.get('/restapi/v1.0/account/:accountId/business-hours', (req, res) => {
  const { accountId } = req.params;
  const bh = (businessHours[accountId] || {})['account']
    || { schedule: { weeklyRanges: { monday: [{ from: '08:00', to: '18:00' }], tuesday: [{ from: '08:00', to: '18:00' }], wednesday: [{ from: '08:00', to: '18:00' }], thursday: [{ from: '08:00', to: '18:00' }], friday: [{ from: '08:00', to: '17:00' }] } } };
  res.json({ uri: `/restapi/v1.0/account/${accountId}/business-hours`, ...bh });
});

router.put('/restapi/v1.0/account/:accountId/business-hours', (req, res) => {
  const { accountId } = req.params;
  if (!businessHours[accountId]) businessHours[accountId] = {};
  businessHours[accountId]['account'] = req.body;
  res.json({ uri: `/restapi/v1.0/account/${accountId}/business-hours`, ...req.body });
});

// ═══════════════════════════════════════════════════════════════
//  ANSWERING RULES (extension-level)
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/answering-rule', (req, res) => {
  const { accountId, extensionId } = req.params;
  const rules = ((answeringRules[accountId] || {})[extensionId]) || [];
  res.json({
    uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/answering-rule`,
    records: rules,
    paging: { totalElements: rules.length },
  });
});

router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/answering-rule/:ruleId', (req, res) => {
  const { accountId, extensionId, ruleId } = req.params;
  const rules = ((answeringRules[accountId] || {})[extensionId]) || [];
  const rule = rules.find(r => r.id === ruleId);
  if (!rule) return res.status(404).json({ errorCode: 'CMN-120', message: 'Answering rule not found.' });
  res.json(rule);
});

router.post('/restapi/v1.0/account/:accountId/extension/:extensionId/answering-rule', (req, res) => {
  const { accountId, extensionId } = req.params;
  if (!answeringRules[accountId]) answeringRules[accountId] = {};
  if (!answeringRules[accountId][extensionId]) answeringRules[accountId][extensionId] = [];

  const rule = { id: `rule-${uuidv4().slice(0, 8)}`, ...req.body, createdAt: ts() };
  answeringRules[accountId][extensionId].push(rule);
  res.status(200).json(rule);
});

router.put('/restapi/v1.0/account/:accountId/extension/:extensionId/answering-rule/:ruleId', (req, res) => {
  const { accountId, extensionId, ruleId } = req.params;
  const rules = ((answeringRules[accountId] || {})[extensionId]) || [];
  const idx = rules.findIndex(r => r.id === ruleId);
  if (idx === -1) return res.status(404).json({ errorCode: 'CMN-120', message: 'Answering rule not found.' });
  Object.assign(rules[idx], req.body, { id: ruleId });
  res.json(rules[idx]);
});

router.delete('/restapi/v1.0/account/:accountId/extension/:extensionId/answering-rule/:ruleId', (req, res) => {
  const { accountId, extensionId, ruleId } = req.params;
  const rules = ((answeringRules[accountId] || {})[extensionId]) || [];
  const idx = rules.findIndex(r => r.id === ruleId);
  if (idx !== -1) rules.splice(idx, 1);
  res.status(204).send('');
});

// ═══════════════════════════════════════════════════════════════
//  ANSWERING RULES (account-level)
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/answering-rule', (req, res) => {
  const { accountId } = req.params;
  const rules = ((answeringRules[accountId] || {})['account']) || [];
  res.json({ uri: `/restapi/v1.0/account/${accountId}/answering-rule`, records: rules, paging: { totalElements: rules.length } });
});

router.get('/restapi/v1.0/account/:accountId/answering-rule/:ruleId', (req, res) => {
  const { accountId, ruleId } = req.params;
  const rules = ((answeringRules[accountId] || {})['account']) || [];
  const rule = rules.find(r => r.id === ruleId);
  if (!rule) return res.status(404).json({ errorCode: 'CMN-120', message: 'Answering rule not found.' });
  res.json(rule);
});

router.put('/restapi/v1.0/account/:accountId/answering-rule/:ruleId', (req, res) => {
  const { accountId, ruleId } = req.params;
  if (!answeringRules[accountId]) answeringRules[accountId] = {};
  if (!answeringRules[accountId]['account']) answeringRules[accountId]['account'] = [];
  const rules = answeringRules[accountId]['account'];
  const idx = rules.findIndex(r => r.id === ruleId);
  if (idx === -1) {
    const rule = { id: ruleId, ...req.body };
    rules.push(rule);
    return res.json(rule);
  }
  Object.assign(rules[idx], req.body, { id: ruleId });
  res.json(rules[idx]);
});

// ═══════════════════════════════════════════════════════════════
//  FORWARDING NUMBERS
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/forwarding-number', (req, res) => {
  const { accountId, extensionId } = req.params;
  const fwds = ((forwardingNumbers[accountId] || {})[extensionId]) || [];
  res.json({ uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/forwarding-number`, records: fwds, paging: { totalElements: fwds.length } });
});

router.post('/restapi/v1.0/account/:accountId/extension/:extensionId/forwarding-number', (req, res) => {
  const { accountId, extensionId } = req.params;
  if (!forwardingNumbers[accountId]) forwardingNumbers[accountId] = {};
  if (!forwardingNumbers[accountId][extensionId]) forwardingNumbers[accountId][extensionId] = [];
  const fwd = { id: `fwd-${uuidv4().slice(0, 8)}`, ...req.body };
  forwardingNumbers[accountId][extensionId].push(fwd);
  res.json(fwd);
});

router.put('/restapi/v1.0/account/:accountId/extension/:extensionId/forwarding-number/:forwardingNumberId', (req, res) => {
  const { accountId, extensionId, forwardingNumberId } = req.params;
  const fwds = ((forwardingNumbers[accountId] || {})[extensionId]) || [];
  const idx = fwds.findIndex(f => f.id === forwardingNumberId);
  if (idx === -1) return res.status(404).json({ errorCode: 'CMN-120', message: 'Forwarding number not found.' });
  Object.assign(fwds[idx], req.body, { id: forwardingNumberId });
  res.json(fwds[idx]);
});

router.delete('/restapi/v1.0/account/:accountId/extension/:extensionId/forwarding-number/:forwardingNumberId', (req, res) => {
  const { accountId, extensionId, forwardingNumberId } = req.params;
  const fwds = ((forwardingNumbers[accountId] || {})[extensionId]) || [];
  const idx = fwds.findIndex(f => f.id === forwardingNumberId);
  if (idx !== -1) fwds.splice(idx, 1);
  res.status(204).send('');
});

// ═══════════════════════════════════════════════════════════════
//  IVR MENUS
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/ivr-menus', (req, res) => {
  const { accountId } = req.params;
  const records = Object.values(ivrMenus[accountId] || {});
  res.json({ uri: `/restapi/v1.0/account/${accountId}/ivr-menus`, records, paging: { totalElements: records.length } });
});

router.get('/restapi/v1.0/account/:accountId/ivr-menus/:ivrMenuId', (req, res) => {
  const { accountId, ivrMenuId } = req.params;
  const menu = (ivrMenus[accountId] || {})[ivrMenuId];
  if (!menu) return res.status(404).json({ errorCode: 'CMN-120', message: 'IVR menu not found.' });
  res.json(menu);
});

router.post('/restapi/v1.0/account/:accountId/ivr-menus', (req, res) => {
  const { accountId } = req.params;
  if (!ivrMenus[accountId]) ivrMenus[accountId] = {};
  const id = `ivr-${uuidv4().slice(0, 8)}`;
  const menu = { id, uri: `/restapi/v1.0/account/${accountId}/ivr-menus/${id}`, ...req.body };
  ivrMenus[accountId][id] = menu;
  res.status(200).json(menu);
});

router.put('/restapi/v1.0/account/:accountId/ivr-menus/:ivrMenuId', (req, res) => {
  const { accountId, ivrMenuId } = req.params;
  if (!ivrMenus[accountId]) ivrMenus[accountId] = {};
  const existing = ivrMenus[accountId][ivrMenuId] || {};
  const updated = { ...existing, ...req.body, id: ivrMenuId };
  ivrMenus[accountId][ivrMenuId] = updated;
  res.json(updated);
});

// ═══════════════════════════════════════════════════════════════
//  CALL QUEUES
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/call-queues', (req, res) => {
  const { accountId } = req.params;
  const records = callQueues[accountId] || [];
  res.json({ uri: `/restapi/v1.0/account/${accountId}/call-queues`, records, paging: { page: 1, perPage: 100, pageStart: 0, pageEnd: records.length, totalPages: 1, totalElements: records.length }, navigation: { firstPage: { uri: `/restapi/v1.0/account/${accountId}/call-queues?page=1` }, lastPage: { uri: `/restapi/v1.0/account/${accountId}/call-queues?page=1` } } });
});

router.get('/restapi/v1.0/account/:accountId/call-queues/:groupId', (req, res) => {
  const { accountId, groupId } = req.params;
  const q = (callQueues[accountId] || []).find(q => q.id === groupId);
  if (!q) return res.status(404).json({ errorCode: 'CMN-120', message: 'Call queue not found.' });
  res.json(q);
});

router.get('/restapi/v1.0/account/:accountId/call-queues/:groupId/members', (req, res) => {
  const { accountId, groupId } = req.params;
  const q = (callQueues[accountId] || []).find(q => q.id === groupId);
  if (!q) return res.status(404).json({ errorCode: 'CMN-120', message: 'Call queue not found.' });
  const members = q.members || [];
  res.json({ uri: `/restapi/v1.0/account/${accountId}/call-queues/${groupId}/members`, records: members, paging: { page: 1, perPage: 100, pageStart: 0, pageEnd: members.length, totalPages: 1, totalElements: members.length }, navigation: { firstPage: { uri: '' }, lastPage: { uri: '' } } });
});

router.post('/restapi/v1.0/account/:accountId/call-queues/:groupId/bulk-assign', (req, res) => {
  const { accountId, groupId } = req.params;
  const q = (callQueues[accountId] || []).find(q => q.id === groupId);
  if (!q) return res.status(404).json({ errorCode: 'CMN-120', message: 'Call queue not found.' });
  const body = req.body || {};
  if (body.addedExtensionIds) {
    const { extensions } = require('../data/mockData');
    const extMap = extensions[accountId] || {};
    body.addedExtensionIds.forEach(id => {
      if (extMap[id] && !q.members.find(m => m.id === id)) {
        q.members.push({ id, name: extMap[id].name, extensionNumber: extMap[id].extensionNumber });
      }
    });
  }
  if (body.removedExtensionIds) {
    q.members = q.members.filter(m => !body.removedExtensionIds.includes(m.id));
  }
  res.status(204).send('');
});

// ═══════════════════════════════════════════════════════════════
//  GREETINGS
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/dictionary/greeting', (req, res) => {
  res.json({
    uri: '/restapi/v1.0/dictionary/greeting',
    records: [
      { id: 'pg-vm-1', name: 'Default Voicemail', type: 'Voicemail', usageType: 'UserExtensionAnsweringRule', contentType: 'audio/mpeg' },
      { id: 'pg-intro-1', name: 'Default Introductory', type: 'Introductory', usageType: 'UserExtensionAnsweringRule', contentType: 'audio/mpeg' },
      { id: 'pg-hold-1', name: 'Default Hold Music', type: 'HoldMusic', usageType: 'UserExtensionAnsweringRule', contentType: 'audio/mpeg' },
      { id: 'pg-connect-1', name: 'Default Connect', type: 'ConnectingMessage', usageType: 'UserExtensionAnsweringRule', contentType: 'audio/mpeg' },
    ],
    paging: { totalElements: 4 },
  });
});

router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/greeting', (req, res) => {
  const { accountId, extensionId } = req.params;
  const records = ((greetings[accountId] || {})[extensionId]) || [];
  res.json({ uri: `/restapi/v1.0/account/${accountId}/extension/${extensionId}/greeting`, records, paging: { totalElements: records.length } });
});

router.post('/restapi/v1.0/account/:accountId/extension/:extensionId/greeting', (req, res) => {
  const { accountId, extensionId } = req.params;
  if (!greetings[accountId]) greetings[accountId] = {};
  if (!greetings[accountId][extensionId]) greetings[accountId][extensionId] = [];
  const g = { id: `gr-${uuidv4().slice(0, 8)}`, ...req.body };
  greetings[accountId][extensionId].push(g);
  res.json(g);
});

// ═══════════════════════════════════════════════════════════════
//  CALL RECORDING
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/call-recording', (req, res) => {
  const { accountId } = req.params;
  const cr = callRecording[accountId] || { onDemand: { enabled: false }, automatic: { enabled: false } };
  res.json({ uri: `/restapi/v1.0/account/${accountId}/call-recording`, ...cr });
});

router.put('/restapi/v1.0/account/:accountId/call-recording', (req, res) => {
  const { accountId } = req.params;
  callRecording[accountId] = { ...(callRecording[accountId] || {}), ...req.body };
  res.json({ uri: `/restapi/v1.0/account/${accountId}/call-recording`, ...callRecording[accountId] });
});

router.get('/restapi/v1.0/account/:accountId/call-recording/extensions', (req, res) => {
  const { accountId } = req.params;
  const cr = callRecording[accountId] || {};
  res.json({ uri: `/restapi/v1.0/account/${accountId}/call-recording/extensions`, records: cr.extensions || [], paging: { totalElements: (cr.extensions || []).length } });
});

// ═══════════════════════════════════════════════════════════════
//  CALLER BLOCKING
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/caller-blocking', (req, res) => {
  res.json({
    uri: `/restapi/v1.0/account/${req.params.accountId}/extension/${req.params.extensionId}/caller-blocking`,
    mode: 'Disabled',
    noCallerId: 'BlockCallsAndFaxes',
    payPhones: 'Allow',
    greetings: [],
  });
});

router.put('/restapi/v1.0/account/:accountId/extension/:extensionId/caller-blocking', (req, res) => {
  res.json({ uri: `/restapi/v1.0/account/${req.params.accountId}/extension/${req.params.extensionId}/caller-blocking`, ...req.body });
});

// ═══════════════════════════════════════════════════════════════
//  IVR PROMPTS
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/ivr-prompts', (req, res) => {
  res.json({ uri: `/restapi/v1.0/account/${req.params.accountId}/ivr-prompts`, records: [], paging: { totalElements: 0 } });
});

router.post('/restapi/v1.0/account/:accountId/ivr-prompts', (req, res) => {
  const id = `prompt-${uuidv4().slice(0, 8)}`;
  res.json({ id, uri: `/restapi/v1.0/account/${req.params.accountId}/ivr-prompts/${id}`, ...req.body });
});

// ═══════════════════════════════════════════════════════════════
//  SITES IVR
// ═══════════════════════════════════════════════════════════════

router.get('/restapi/v1.0/account/:accountId/sites/:siteId/ivr', (req, res) => {
  res.json({ uri: `/restapi/v1.0/account/${req.params.accountId}/sites/${req.params.siteId}/ivr`, rules: [] });
});

module.exports = router;
