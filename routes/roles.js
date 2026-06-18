'use strict';

const { Router } = require('express');
const { userRoles } = require('../data/mockData');

const router = Router();

// ── Dictionary roles ──────────────────────────────────────────
router.get('/restapi/v1.0/dictionary/user-role', (req, res) => {
  res.json({
    uri: '/restapi/v1.0/dictionary/user-role',
    records: userRoles,
    paging: { page: 1, perPage: 100, totalElements: userRoles.length },
  });
});

router.get('/restapi/v1.0/dictionary/user-role/:roleId', (req, res) => {
  const role = userRoles.find(r => r.id === req.params.roleId);
  if (!role) return res.status(404).json({ errorCode: 'CMN-120', message: 'Role not found.' });
  res.json(role);
});

// ── Account user roles ────────────────────────────────────────
router.get('/restapi/v1.0/account/:accountId/user-role', (req, res) => {
  res.json({
    uri: `/restapi/v1.0/account/${req.params.accountId}/user-role`,
    records: userRoles,
    paging: { totalElements: userRoles.length },
  });
});

router.get('/restapi/v1.0/account/:accountId/user-role/default', (req, res) => {
  const def = userRoles.find(r => r.id === 'role-user');
  res.json(def);
});

// ── Assigned roles (account-level) ───────────────────────────
router.get('/restapi/v1.0/account/:accountId/assigned-role', (req, res) => {
  res.json({ uri: `/restapi/v1.0/account/${req.params.accountId}/assigned-role`, records: userRoles });
});

// ── Role bulk assign ──────────────────────────────────────────
router.post('/restapi/v1.0/account/:accountId/user-role/:roleId/bulk-assign', (req, res) => {
  // In mock: we accept but don't deeply process
  res.status(204).send('');
});

// ── Extension assigned role (also in extensions.js but kept here for completeness) ──
router.get('/restapi/v1.0/account/:accountId/extension/:extensionId/assigned-role/default', (req, res) => {
  const def = userRoles.find(r => r.id === 'role-user');
  res.json(def);
});

router.delete('/restapi/v1.0/account/:accountId/extension/:extensionId/assigned-role/default', (req, res) => {
  res.status(204).send('');
});

module.exports = router;
