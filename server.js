'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes        = require('./routes/auth');
const accountRoutes     = require('./routes/account');
const extensionRoutes   = require('./routes/extensions');
const phoneNumberRoutes = require('./routes/phoneNumbers');
const deviceRoutes      = require('./routes/devices');
const callHandlingRoutes= require('./routes/callHandling');
const rolesRoutes       = require('./routes/roles');
const onboardingRoutes  = require('./routes/onboarding');

const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check (no auth) ───────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'rc-onboarding-mock', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ── Auth routes ───────────────────────────────────────────────
app.use(authRoutes);

// ── RC API-compatible routes ─────────────────────────────────
app.use(accountRoutes);
app.use(extensionRoutes);
app.use(phoneNumberRoutes);
app.use(deviceRoutes);
app.use(callHandlingRoutes);
app.use(rolesRoutes);

// ── Onboarding workflow routes ───────────────────────────────
app.use(onboardingRoutes);

// ── Root ─────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    service: 'RingCentral GSP Technical Onboarding Mock API',
    version: '1.0.0',
    description: 'Simulates RingCentral platform APIs + onboarding workflow for Regular and Pre-config (SMB) scenarios.',
    docs: '/api-reference',
    health: '/health',
    quickStart: {
      step1: 'GET /api/partners — list partners (no auth needed)',
      step2: 'GET /api/accounts — list mock accounts',
      step3: 'POST /restapi/oauth/token — get access token (body: { account_id: "acc-001" })',
      step4: 'GET /api/onboarding/preflight/acc-001 — see pre-flight check',
      step5: 'POST /api/onboarding/sessions — start onboarding session',
      step6: 'GET /api/onboarding/sessions/:id/checklist — view checklist',
      step7: 'POST /api/onboarding/sessions/:id/simulate/:stepId — simulate a step',
      step8: 'PUT /api/onboarding/sessions/:id/steps/:stepId — mark step complete',
      step9: 'POST /api/onboarding/sessions/:id/complete — finalize session',
    },
    mockAccounts: {
      'acc-001': 'Acme Corp (AT&T, Pre-config, 25 seats)',
      'acc-002': 'Blue Sky Technologies (Frontier, Pre-config, 10 seats)',
      'acc-003': 'Desert Sun Realty (Cox Business, Pre-config, 15 seats)',
      'acc-004': 'Lakeside Law Group (RC Direct, Regular, 40 seats)',
      'acc-005': 'Mountain View Dental (Brightspeed, Regular, 8 seats)',
    },
    onboardingTypes: {
      regular: 'Full onboarding — build everything from scratch (29 steps)',
      preconfig: 'Pre-configured SMB — validate & confirm (29 steps, lighter touch)',
    },
  });
});

// ── API Reference ─────────────────────────────────────────────
app.get('/api-reference', (req, res) => {
  res.json({
    title: 'RC Onboarding Mock API Reference',
    sections: {
      'Authentication (no token required)': [
        'POST /restapi/oauth/token       — get bearer token (body: { account_id })',
        'POST /restapi/oauth/revoke       — revoke token',
      ],
      'Partners (no token required)': [
        'GET  /api/partners               — list all partners',
        'GET  /api/partners/:id           — get partner',
        'GET  /api/partners/:id/accounts  — accounts for partner',
      ],
      'Accounts': [
        'GET  /api/accounts               — list accounts (?partnerId= &onboardingType= &status=)',
        'GET  /restapi/v1.0/account/:id   — get account detail',
        'PUT  /restapi/v1.0/account/:id   — update account',
      ],
      'Extensions (Users)': [
        'GET  /restapi/v1.0/account/:aId/extension                       — list extensions',
        'GET  /restapi/v1.0/account/:aId/extension/:eId                  — get extension',
        'POST /restapi/v1.0/account/:aId/extension                       — create extension',
        'PUT  /restapi/v1.0/account/:aId/extension/:eId                  — update extension',
        'GET  /restapi/v1.0/account/:aId/extension/:eId/phone-number     — extension DID numbers',
        'GET  /restapi/v1.0/account/:aId/extension/:eId/assigned-role    — get role',
        'PUT  /restapi/v1.0/account/:aId/extension/:eId/assigned-role    — set role',
        'GET  /restapi/v1.0/account/:aId/extension/:eId/caller-id        — get caller ID',
        'PUT  /restapi/v1.0/account/:aId/extension/:eId/caller-id        — set caller ID',
      ],
      'Phone Numbers': [
        'GET  /restapi/v1.0/account/:aId/phone-number                    — list numbers (v1)',
        'GET  /restapi/v2/accounts/:aId/phone-numbers                    — list numbers (v2)',
        'PATCH /restapi/v2/accounts/:aId/phone-numbers/:pnId             — update number',
        'POST /restapi/v2/accounts/:aId/phone-numbers/bulk-add           — bulk add numbers',
      ],
      'Devices': [
        'GET  /restapi/v1.0/account/:aId/device                          — list account devices',
        'GET  /restapi/v1.0/account/:aId/device/:dId                     — get device',
        'PUT  /restapi/v1.0/account/:aId/device/:dId                     — update device',
        'GET  /restapi/v1.0/account/:aId/extension/:eId/device           — extension devices',
        'POST /restapi/v2/accounts/:aId/devices/bulk-add                 — bulk add devices',
      ],
      'Business Hours': [
        'GET  /restapi/v1.0/account/:aId/business-hours                  — account hours',
        'PUT  /restapi/v1.0/account/:aId/business-hours                  — set account hours',
        'GET  /restapi/v1.0/account/:aId/extension/:eId/business-hours   — user hours',
        'PUT  /restapi/v1.0/account/:aId/extension/:eId/business-hours   — set user hours',
      ],
      'Answering Rules & Call Handling': [
        'GET  /restapi/v1.0/account/:aId/answering-rule                  — account rules',
        'PUT  /restapi/v1.0/account/:aId/answering-rule/:rId             — update account rule',
        'GET  /restapi/v1.0/account/:aId/extension/:eId/answering-rule   — user rules',
        'POST /restapi/v1.0/account/:aId/extension/:eId/answering-rule   — create user rule',
        'PUT  /restapi/v1.0/account/:aId/extension/:eId/answering-rule/:rId — update user rule',
        'DEL  /restapi/v1.0/account/:aId/extension/:eId/answering-rule/:rId — delete user rule',
        'GET  /restapi/v1.0/account/:aId/extension/:eId/forwarding-number — forwarding numbers',
        'POST /restapi/v1.0/account/:aId/extension/:eId/forwarding-number — add forwarding number',
      ],
      'IVR / Auto-Receptionist': [
        'GET  /restapi/v1.0/account/:aId/ivr-menus                       — list IVR menus',
        'GET  /restapi/v1.0/account/:aId/ivr-menus/:iId                  — get IVR menu',
        'POST /restapi/v1.0/account/:aId/ivr-menus                       — create IVR menu',
        'PUT  /restapi/v1.0/account/:aId/ivr-menus/:iId                  — update IVR menu',
      ],
      'Call Queues': [
        'GET  /restapi/v1.0/account/:aId/call-queues                     — list queues',
        'GET  /restapi/v1.0/account/:aId/call-queues/:qId/members        — queue members',
        'POST /restapi/v1.0/account/:aId/call-queues/:qId/bulk-assign    — add/remove members',
      ],
      'Greetings & Voicemail': [
        'GET  /restapi/v1.0/dictionary/greeting                          — system greetings',
        'GET  /restapi/v1.0/account/:aId/extension/:eId/greeting         — user greetings',
        'POST /restapi/v1.0/account/:aId/extension/:eId/greeting         — upload greeting',
      ],
      'Call Recording': [
        'GET  /restapi/v1.0/account/:aId/call-recording                  — recording settings',
        'PUT  /restapi/v1.0/account/:aId/call-recording                  — update settings',
        'GET  /restapi/v1.0/account/:aId/call-recording/extensions       — recorded extensions',
      ],
      'Roles': [
        'GET  /restapi/v1.0/dictionary/user-role                         — system roles',
        'GET  /restapi/v1.0/account/:aId/user-role                       — account roles',
      ],
      'Onboarding Workflow': [
        'GET  /api/onboarding/checklists/regular                         — regular checklist definition',
        'GET  /api/onboarding/checklists/preconfig                       — pre-config checklist definition',
        'GET  /api/onboarding/preflight/:accountId                        — pre-flight readiness check',
        'POST /api/onboarding/sessions                                   — start session (body: { accountId, onboardingType?, advisorName? })',
        'GET  /api/onboarding/sessions                                   — list sessions',
        'GET  /api/onboarding/sessions/:sId                              — get session',
        'GET  /api/onboarding/sessions/:sId/checklist                    — checklist with progress',
        'PUT  /api/onboarding/sessions/:sId/steps/:stepId                — update step (body: { status, notes?, findings? })',
        'POST /api/onboarding/sessions/:sId/simulate/:stepId             — simulate/auto-run step',
        'POST /api/onboarding/sessions/:sId/complete                     — complete session',
        'POST /api/onboarding/sessions/:sId/abandon                      — abandon/escalate session',
      ],
    },
  });
});

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    errorCode: 'CMN-404',
    message: `Route not found: ${req.method} ${req.path}. See GET /api-reference for available endpoints.`,
  });
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ errorCode: 'CMN-500', message: err.message || 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 RC Onboarding Mock API running on port ${PORT}`);
  console.log(`   Health:     http://localhost:${PORT}/health`);
  console.log(`   Root:       http://localhost:${PORT}/`);
  console.log(`   API Ref:    http://localhost:${PORT}/api-reference`);
  console.log(`\n   Mock Accounts: acc-001 through acc-005`);
  console.log(`   Get token:  POST /restapi/oauth/token  { account_id: "acc-001" }\n`);
});

module.exports = app;
