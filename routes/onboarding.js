'use strict';

const { Router } = require('express');
const {
  partners, accounts, extensions, phoneNumbers, devices,
  businessHours, answeringRules, ivrMenus, callQueues,
  onboardingSessions, checklistDefinitions, uuidv4, ts,
} = require('../data/mockData');

const router = Router();

// ═══════════════════════════════════════════════════════════════
//  PARTNERS
// ═══════════════════════════════════════════════════════════════

// GET /api/partners  — no auth required (partner lookup before login)
router.get('/api/partners', (req, res) => {
  res.json({ records: Object.values(partners), totalElements: Object.keys(partners).length });
});

router.get('/api/partners/:partnerId', (req, res) => {
  const p = partners[req.params.partnerId];
  if (!p) return res.status(404).json({ message: 'Partner not found.' });
  res.json(p);
});

// GET /api/partners/:partnerId/accounts
router.get('/api/partners/:partnerId/accounts', (req, res) => {
  const partnerAccounts = Object.values(accounts).filter(a => a.partnerId === req.params.partnerId);
  res.json({ records: partnerAccounts, totalElements: partnerAccounts.length });
});

// ═══════════════════════════════════════════════════════════════
//  ACCOUNTS (convenience listing)
// ═══════════════════════════════════════════════════════════════

router.get('/api/accounts', (req, res) => {
  const { partnerId, onboardingType, status } = req.query;
  let records = Object.values(accounts);
  if (partnerId) records = records.filter(a => a.partnerId === partnerId);
  if (onboardingType) records = records.filter(a => a.onboardingType === onboardingType);
  if (status) records = records.filter(a => a.onboardingStatus === status);
  res.json({ records, totalElements: records.length });
});

// ═══════════════════════════════════════════════════════════════
//  ONBOARDING SESSIONS
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/onboarding/sessions
 * Start a new onboarding session for an account.
 * Body: { accountId, onboardingType? ('regular'|'preconfig'), advisorName?, notes? }
 *
 * onboardingType defaults to the account's configured type.
 */
router.post('/api/onboarding/sessions', (req, res) => {
  const body = req.body || {};
  const { accountId, advisorName, notes } = body;

  if (!accountId) return res.status(400).json({ message: 'accountId is required.' });
  const account = accounts[accountId];
  if (!account) return res.status(404).json({ message: `Account '${accountId}' not found.` });

  const onboardingType = body.onboardingType || account.onboardingType || 'regular';
  const checklist = checklistDefinitions[onboardingType];
  if (!checklist) return res.status(400).json({ message: `Unknown onboardingType '${onboardingType}'.` });

  const sessionId = `session-${uuidv4().slice(0, 8)}`;

  const session = {
    id: sessionId,
    accountId,
    accountName: account.name,
    partnerId: account.partnerId,
    onboardingType,
    advisorName: advisorName || 'Unknown Advisor',
    notes: notes || '',
    status: 'InProgress',
    startedAt: ts(),
    completedAt: null,
    duration45Min: onboardingType === 'preconfig',
    // Build steps from checklist
    steps: checklist.map(def => ({
      ...def,
      status: 'Pending',    // Pending | InProgress | Completed | Skipped | NA
      completedAt: null,
      notes: '',
      findings: '',         // what was found during this step
    })),
    completionPercent: 0,
    warrantyStartDate: null,
    sfdcCaseId: `SFDC-${Math.floor(100000 + Math.random() * 900000)}`,
  };

  onboardingSessions[sessionId] = session;
  account.onboardingStatus = 'InProgress';
  account.activeSessionId = sessionId;

  res.status(201).json(session);
});

/**
 * GET /api/onboarding/sessions
 * List all sessions, optional ?accountId=&status= filters
 */
router.get('/api/onboarding/sessions', (req, res) => {
  let sessions = Object.values(onboardingSessions);
  const { accountId, status, onboardingType } = req.query;
  if (accountId) sessions = sessions.filter(s => s.accountId === accountId);
  if (status) sessions = sessions.filter(s => s.status === status);
  if (onboardingType) sessions = sessions.filter(s => s.onboardingType === onboardingType);
  res.json({ records: sessions, totalElements: sessions.length });
});

/**
 * GET /api/onboarding/sessions/:sessionId
 */
router.get('/api/onboarding/sessions/:sessionId', (req, res) => {
  const session = onboardingSessions[req.params.sessionId];
  if (!session) return res.status(404).json({ message: 'Session not found.' });
  res.json(session);
});

/**
 * GET /api/onboarding/sessions/:sessionId/checklist
 * Returns just the checklist/steps portion with summary stats.
 */
router.get('/api/onboarding/sessions/:sessionId/checklist', (req, res) => {
  const session = onboardingSessions[req.params.sessionId];
  if (!session) return res.status(404).json({ message: 'Session not found.' });

  const total = session.steps.length;
  const completed = session.steps.filter(s => s.status === 'Completed').length;
  const skipped = session.steps.filter(s => s.status === 'Skipped' || s.status === 'NA').length;
  const inProgress = session.steps.filter(s => s.status === 'InProgress').length;
  const pending = session.steps.filter(s => s.status === 'Pending').length;
  const requiredTotal = session.steps.filter(s => s.required).length;
  const requiredDone = session.steps.filter(s => s.required && (s.status === 'Completed' || s.status === 'Skipped')).length;

  // Group by category
  const categories = {};
  session.steps.forEach(step => {
    if (!categories[step.category]) categories[step.category] = [];
    categories[step.category].push(step);
  });

  res.json({
    sessionId: session.id,
    onboardingType: session.onboardingType,
    summary: {
      total, completed, skipped, inProgress, pending,
      requiredTotal, requiredDone,
      completionPercent: Math.round((completed / total) * 100),
      requiredCompletionPercent: Math.round((requiredDone / requiredTotal) * 100),
      readyForWarranty: requiredDone === requiredTotal,
    },
    categories,
    steps: session.steps,
  });
});

/**
 * PUT /api/onboarding/sessions/:sessionId/steps/:stepId
 * Update a single step.
 * Body: { status: 'Completed'|'InProgress'|'Skipped'|'NA'|'Pending', notes?, findings? }
 */
router.put('/api/onboarding/sessions/:sessionId/steps/:stepId', (req, res) => {
  const session = onboardingSessions[req.params.sessionId];
  if (!session) return res.status(404).json({ message: 'Session not found.' });

  const step = session.steps.find(s => s.stepId === req.params.stepId);
  if (!step) return res.status(404).json({ message: `Step '${req.params.stepId}' not found.` });

  const body = req.body || {};
  if (body.status) step.status = body.status;
  if (body.notes !== undefined) step.notes = body.notes;
  if (body.findings !== undefined) step.findings = body.findings;
  if (body.status === 'Completed' || body.status === 'Skipped') {
    step.completedAt = ts();
  }

  // Recalculate session completion
  const total = session.steps.length;
  const done = session.steps.filter(s => ['Completed', 'Skipped', 'NA'].includes(s.status)).length;
  session.completionPercent = Math.round((done / total) * 100);

  // Auto-complete session when all required steps done
  const requiredDone = session.steps
    .filter(s => s.required)
    .every(s => ['Completed', 'Skipped'].includes(s.status));

  if (requiredDone && session.status === 'InProgress') {
    session.status = 'RequiredStepsComplete';
  }

  res.json({ session: { id: session.id, status: session.status, completionPercent: session.completionPercent }, step });
});

/**
 * POST /api/onboarding/sessions/:sessionId/complete
 * Finalize the session. Triggers warranty period start.
 * Body: { warrantyStartDate?, finalNotes? }
 */
router.post('/api/onboarding/sessions/:sessionId/complete', (req, res) => {
  const session = onboardingSessions[req.params.sessionId];
  if (!session) return res.status(404).json({ message: 'Session not found.' });

  const body = req.body || {};
  session.status = 'Completed';
  session.completedAt = ts();
  session.finalNotes = body.finalNotes || '';
  session.warrantyStartDate = body.warrantyStartDate || new Date().toISOString().split('T')[0];

  const warrantyEnd = new Date(session.warrantyStartDate);
  warrantyEnd.setDate(warrantyEnd.getDate() + 30);
  session.warrantyEndDate = warrantyEnd.toISOString().split('T')[0];

  if (accounts[session.accountId]) {
    accounts[session.accountId].onboardingStatus = 'Completed';
    accounts[session.accountId].activeSessionId = null;
  }

  res.json(session);
});

/**
 * POST /api/onboarding/sessions/:sessionId/abandon
 * Abandon / escalate session (e.g. escalate to Tier 2 support)
 */
router.post('/api/onboarding/sessions/:sessionId/abandon', (req, res) => {
  const session = onboardingSessions[req.params.sessionId];
  if (!session) return res.status(404).json({ message: 'Session not found.' });
  const body = req.body || {};
  session.status = 'Abandoned';
  session.abandonReason = body.reason || 'Unspecified';
  session.abandonedAt = ts();
  if (accounts[session.accountId]) {
    accounts[session.accountId].onboardingStatus = 'NeedsFollowUp';
  }
  res.json(session);
});

// ═══════════════════════════════════════════════════════════════
//  SCENARIO HELPERS — preflight data for each scenario type
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/onboarding/preflight/:accountId
 * Returns a summary of what's pre-configured vs. needs attention,
 * so the advisor knows what to expect before the call.
 */
router.get('/api/onboarding/preflight/:accountId', (req, res) => {
  const { accountId } = req.params;
  const account = accounts[accountId];
  if (!account) return res.status(404).json({ message: 'Account not found.' });

  const extList = Object.values(extensions[accountId] || {});
  const numList = phoneNumbers[accountId] || [];
  const devList = devices[accountId] || [];
  const ivrs = Object.values(ivrMenus[accountId] || {});
  const queues = callQueues[accountId] || [];

  const userExts = extList.filter(e => e.type === 'User');
  const ivrExts = extList.filter(e => e.type === 'IvrMenu');

  const devicesByStatus = {
    online: devList.filter(d => d.status === 'Online').length,
    offline: devList.filter(d => d.status === 'Offline').length,
    notActivated: devList.filter(d => d.status === 'NotActivated').length,
  };

  const usersWithSetup = userExts.filter(e => e.setupWizardState === 'Completed').length;
  const usersWithoutSetup = userExts.filter(e => e.setupWizardState !== 'Completed').length;

  const accountBH = (businessHours[accountId] || {})['account'];
  const accountRules = ((answeringRules[accountId] || {})['account']) || [];

  res.json({
    account: {
      id: accountId,
      name: account.name,
      partnerId: account.partnerId,
      onboardingType: account.onboardingType,
      mainNumber: account.mainNumber,
      seats: account.seats,
    },
    summary: {
      users: {
        total: userExts.length,
        setupComplete: usersWithSetup,
        needsSetup: usersWithoutSetup,
      },
      phoneNumbers: {
        total: numList.length,
        assigned: numList.filter(n => n.extension).length,
        unassigned: numList.filter(n => !n.extension).length,
      },
      devices: devicesByStatus,
      ivr: {
        configured: ivrs.length > 0,
        count: ivrs.length,
      },
      callQueues: {
        count: queues.length,
      },
      businessHours: {
        configured: !!accountBH,
      },
      answeringRules: {
        accountLevelCount: accountRules.length,
      },
    },
    attention: buildAttentionItems(account, userExts, numList, devList, ivrs, accountBH, accountRules),
    preConfiguredItems: buildPreConfigItems(account, userExts, numList, devList, ivrs, accountBH),
  });
});

function buildAttentionItems(account, userExts, numList, devList, ivrs, accountBH, accountRules) {
  const items = [];

  if (userExts.some(e => e.setupWizardState !== 'Completed')) {
    items.push({ severity: 'High', area: 'Users', message: `${userExts.filter(e => e.setupWizardState !== 'Completed').length} user(s) have not completed setup wizard.` });
  }
  if (devList.some(d => d.status === 'NotActivated')) {
    items.push({ severity: 'High', area: 'Devices', message: `${devList.filter(d => d.status === 'NotActivated').length} device(s) are not activated.` });
  }
  if (devList.some(d => d.status === 'Offline')) {
    items.push({ severity: 'Medium', area: 'Devices', message: `${devList.filter(d => d.status === 'Offline').length} device(s) are offline.` });
  }
  if (numList.some(n => !n.extension && n.usageType === 'DirectNumber')) {
    items.push({ severity: 'Medium', area: 'Phone Numbers', message: 'Some direct numbers are unassigned.' });
  }
  if (!accountBH) {
    items.push({ severity: 'Medium', area: 'Business Hours', message: 'Account-level business hours are not configured.' });
  }
  if (ivrs.length === 0) {
    items.push({ severity: account.onboardingType === 'preconfig' ? 'High' : 'Low', area: 'IVR / Auto-Receptionist', message: 'No IVR menus configured.' });
  }
  if (accountRules.length === 0) {
    items.push({ severity: 'High', area: 'Call Handling', message: 'No account-level answering rules configured.' });
  }
  return items;
}

function buildPreConfigItems(account, userExts, numList, devList, ivrs, accountBH) {
  const items = [];
  if (userExts.some(e => e.assignedRole)) {
    items.push({ area: 'Roles', message: 'Roles are pre-assigned — verify with customer.' });
  }
  if (numList.length > 0) {
    items.push({ area: 'Phone Numbers', message: `${numList.length} phone number(s) pre-provisioned.` });
  }
  if (devList.filter(d => d.type === 'HardPhone').length > 0) {
    items.push({ area: 'Devices', message: `${devList.filter(d => d.type === 'HardPhone').length} hardphone(s) pre-configured.` });
  }
  if (accountBH) {
    items.push({ area: 'Business Hours', message: 'Business hours schedule pre-set.' });
  }
  if (ivrs.length > 0) {
    items.push({ area: 'IVR', message: `${ivrs.length} IVR menu(s) pre-configured — validate routing logic.` });
  }
  return items;
}

// ═══════════════════════════════════════════════════════════════
//  ONBOARDING CHECKLIST DEFINITIONS (read-only reference)
// ═══════════════════════════════════════════════════════════════

router.get('/api/onboarding/checklists/:type', (req, res) => {
  const { type } = req.params;
  const checklist = checklistDefinitions[type];
  if (!checklist) return res.status(404).json({ message: `No checklist for type '${type}'. Valid: regular, preconfig` });
  res.json({ type, steps: checklist, totalSteps: checklist.length, requiredSteps: checklist.filter(s => s.required).length });
});

// ═══════════════════════════════════════════════════════════════
//  SCENARIO SIMULATION ENDPOINT
//  Simulates running a specific scenario step against the RC API
//  and records the result in the session.
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/onboarding/sessions/:sessionId/simulate/:stepId
 * Auto-simulates what happens during a given step by fetching
 * or updating the relevant RC API entities and returning a summary.
 */
router.post('/api/onboarding/sessions/:sessionId/simulate/:stepId', (req, res) => {
  const session = onboardingSessions[req.params.sessionId];
  if (!session) return res.status(404).json({ message: 'Session not found.' });

  const step = session.steps.find(s => s.stepId === req.params.stepId);
  if (!step) return res.status(404).json({ message: `Step '${req.params.stepId}' not found.` });

  const { accountId, onboardingType } = session;
  const result = simulateStep(req.params.stepId, accountId, onboardingType, req.body);

  step.status = result.autoComplete ? 'Completed' : 'InProgress';
  step.findings = result.findings;
  if (result.autoComplete) step.completedAt = ts();

  // Recalculate percent
  const total = session.steps.length;
  const done = session.steps.filter(s => ['Completed', 'Skipped', 'NA'].includes(s.status)).length;
  session.completionPercent = Math.round((done / total) * 100);

  res.json({ step, simulationResult: result });
});

function simulateStep(stepId, accountId, onboardingType, body) {
  const extList = Object.values(extensions[accountId] || {});
  const numList = phoneNumbers[accountId] || [];
  const devList = devices[accountId] || [];
  const ivrs = Object.values(ivrMenus[accountId] || {});
  const queues = callQueues[accountId] || [];
  const account = accounts[accountId];
  const isPreconfig = onboardingType === 'preconfig';

  const map = {
    'user-details': () => ({
      findings: isPreconfig
        ? `Found ${extList.filter(e => e.type === 'User').length} pre-configured users. Validated names, emails, and extension numbers.`
        : `Created/reviewed ${extList.filter(e => e.type === 'User').length} user extensions. Configured names, emails, passwords.`,
      autoComplete: false,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension`],
    }),
    'settings-permissions': () => ({
      findings: isPreconfig
        ? `Permissions pre-set. Quick validation: all users have appropriate roles.`
        : `Configured roles and permissions for ${extList.filter(e => e.type === 'User').length} users. Set international calling for 2 users.`,
      autoComplete: false,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/assigned-role`],
    }),
    'regional-settings': () => ({
      findings: `Regional settings: Timezone=${account.regionalSettings.timezone.name}, Language=${account.regionalSettings.language.name}. ${isPreconfig ? 'Validated — correct.' : 'Configured.'}`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}`, `PUT /restapi/v1.0/account/${accountId}`],
    }),
    'schedule': () => {
      const bh = (businessHours[accountId] || {})['account'];
      return {
        findings: bh
          ? `Business hours pre-configured: Mon-Fri. ${isPreconfig ? 'Validated with customer — confirmed correct.' : 'Reviewed and adjusted Friday end time.'}`
          : `No business hours set. Configured Mon-Fri 8am-6pm.`,
        autoComplete: false,
        apiCalls: [`GET /restapi/v1.0/account/${accountId}/business-hours`, `PUT /restapi/v1.0/account/${accountId}/business-hours`],
      };
    },
    'roles': () => ({
      findings: `Reviewed roles: ${extList.filter(e => e.assignedRole && e.assignedRole.id === 'role-admin').length} admin(s), ${extList.filter(e => e.assignedRole && e.assignedRole.id === 'role-user').length} standard user(s). ${isPreconfig ? 'Confirmed correct.' : 'Assigned roles per customer request.'}`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/assigned-role`],
    }),
    'security': () => ({
      findings: isPreconfig
        ? 'Briefly mentioned security settings — no changes needed.'
        : 'Explained 2FA options, password policies, and IP allowlisting. Customer opted for 2FA.',
      autoComplete: true,
      apiCalls: [],
    }),
    'devices-numbers': () => ({
      findings: `Devices: ${devList.length} total (${devList.filter(d => d.status === 'Online').length} online, ${devList.filter(d => d.status === 'NotActivated').length} not activated). Numbers: ${numList.length} total. ${isPreconfig ? 'Validated assignments.' : 'Assigned numbers to extensions and configured devices.'}`,
      autoComplete: false,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/device`, `GET /restapi/v2/accounts/${accountId}/phone-numbers`],
    }),
    'screening-greeting': () => ({
      findings: isPreconfig
        ? 'Reviewed pre-configured greetings. Played back auto-receptionist greeting — customer approved.'
        : 'Configured voicemail greeting (Text-to-Speech), hold music (default), and introductory message.',
      autoComplete: false,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/greeting`, `POST /restapi/v1.0/account/${accountId}/extension/{extensionId}/greeting`],
    }),
    'call-handling-core': () => {
      const rules = ((answeringRules[accountId] || {})['account']) || [];
      return {
        findings: rules.length > 0
          ? `${isPreconfig ? 'CRITICAL VALIDATION: ' : ''}Found ${rules.length} account-level answering rule(s). Business hours rule routes to ${rules[0].transfer ? rules[0].transfer.extension.name : 'N/A'}. ${isPreconfig ? 'Validated routing logic — correct.' : 'Configured routing from scratch.'}`
          : `No account-level answering rules found. ${isPreconfig ? 'ACTION NEEDED: Pre-config appears incomplete.' : 'Created business hours and after-hours rules.'}`,
        autoComplete: false,
        apiCalls: [`GET /restapi/v1.0/account/${accountId}/answering-rule`, `PUT /restapi/v1.0/account/${accountId}/answering-rule/{ruleId}`],
      };
    },
    'incoming-calls': () => ({
      findings: `${isPreconfig ? 'Confirmed' : 'Configured'} incoming call routing: main number → ${ivrs.length > 0 ? `IVR menu "${ivrs[0].name}"` : 'direct extension'}. ${isPreconfig ? 'Validated — correct.' : 'Set up forwarding and ring sequences.'}`,
      autoComplete: false,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/answering-rule`],
    }),
    'missed-calls': () => ({
      findings: `${isPreconfig ? 'Validated' : 'Configured'} missed call handling: send to voicemail after 4 rings. ${isPreconfig ? 'Verified failsafe — voicemail active.' : 'Set up voicemail notification emails.'}`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/answering-rule`],
    }),
    'message-rules': () => ({
      findings: isPreconfig ? 'Mentioned message rules — no changes requested.' : 'Configured message-only hours rule per customer request.',
      autoComplete: true,
      apiCalls: [],
    }),
    'voicemail': () => ({
      findings: `${isPreconfig ? 'Validated' : 'Configured'} voicemail for ${extList.filter(e => e.type === 'User').length} users. Voicemail-to-email ${isPreconfig ? 'pre-enabled — confirmed active.' : 'enabled.'}`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/answering-rule`],
    }),
    'outbound-calls-fax': () => ({
      findings: isPreconfig
        ? 'Brief overview of outbound settings — customer confirmed understanding.'
        : 'Configured outbound caller ID, international calling permissions, and fax settings.',
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/caller-id`],
    }),
    'caller-id': () => ({
      findings: `${isPreconfig ? 'Confirmed' : 'Set'} caller ID: company name "${account.name}", main number ${account.mainNumber}.`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/caller-id`, `PUT /restapi/v1.0/account/${accountId}/extension/{extensionId}/caller-id`],
    }),
    'fax-settings': () => ({
      findings: isPreconfig ? 'Customer did not request fax discussion.' : 'Configured fax-to-email forwarding.',
      autoComplete: true,
      apiCalls: [],
    }),
    'phone-system-general': () => ({
      findings: isPreconfig
        ? 'High-level walkthrough of Admin Portal completed. Customer oriented.'
        : 'Full Admin Portal walkthrough completed: Users, Phone System, Reports sections covered.',
      autoComplete: true,
      apiCalls: [],
    }),
    'company-info': () => ({
      findings: `${isPreconfig ? 'Confirmed' : 'Set'} company info: name="${account.name}", main number=${account.mainNumber}.`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}`],
    }),
    'company-address': () => ({
      findings: `${isPreconfig ? 'Validated' : 'Configured'} company address for E911 compliance.`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}`],
    }),
    'cnam': () => ({
      findings: `${isPreconfig ? 'Confirmed' : 'Submitted'} CNAM registration for "${account.name}". Processing time: 1-3 business days.`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v2/accounts/${accountId}/phone-numbers`],
    }),
    'phone-numbers-all': () => ({
      findings: `Full number walkthrough: ${numList.length} number(s) on account. Main: ${account.mainNumber}. All numbers verified and port status checked.`,
      autoComplete: false,
      apiCalls: [`GET /restapi/v2/accounts/${accountId}/phone-numbers`],
    }),
    'auto-receptionist': () => ({
      findings: ivrs.length > 0
        ? `${isPreconfig ? 'Reviewed' : 'Configured'} IVR: "${ivrs[0].name}" with ${ivrs[0].actions ? ivrs[0].actions.length : 0} menu option(s). ${isPreconfig ? 'Validated routing — CRITICAL item confirmed.' : 'Built from scratch with customer.'}`
        : `No IVR configured. ${isPreconfig ? 'ACTION: Pre-config appears incomplete — escalate.' : 'Built new IVR menu with customer.'}`,
      autoComplete: false,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/ivr-menus`, `PUT /restapi/v1.0/account/${accountId}/ivr-menus/{ivrMenuId}`],
    }),
    'auto-rec-schedule': () => ({
      findings: `${isPreconfig ? 'Validated' : 'Configured'} auto-receptionist schedule tied to business hours.`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/business-hours`],
    }),
    'auto-rec-call-handling': () => ({
      findings: `${isPreconfig ? 'Confirmed' : 'Configured'} after-hours IVR behavior: plays announcement and routes to voicemail.`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/answering-rule`],
    }),
    'call-recording': () => ({
      findings: isPreconfig
        ? 'Mentioned call recording — customer did not request changes.'
        : `Configured call recording: on-demand enabled, automatic recording ${accounts[accountId]?.serviceFeatures?.find(f => f.featureName === 'AutomaticCallRecording')?.enabled ? 'enabled' : 'disabled'}.`,
      autoComplete: true,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/call-recording`],
    }),
    'block-robocalls': () => ({
      findings: isPreconfig
        ? 'Mentioned robocall blocking — no action needed.'
        : 'Enabled robocall blocking (Hiya integration) at account level.',
      autoComplete: true,
      apiCalls: [],
    }),
    'phones-devices': () => ({
      findings: `${isPreconfig ? 'Confirmed' : 'Provisioned'} ${devList.length} device(s). ${devList.filter(d => d.type === 'SoftPhone').length} softphone(s), ${devList.filter(d => d.type === 'HardPhone').length} hardphone(s). ${isPreconfig ? 'All working — verified.' : 'SIP credentials sent, hardphones registered.'}`,
      autoComplete: false,
      apiCalls: [`GET /restapi/v1.0/account/${accountId}/extension/{extensionId}/device`],
    }),
    'app-download': () => ({
      findings: 'RingCentral app demo completed. Customer walked through: calls, messages, video, admin portal. App downloaded on test device.',
      autoComplete: false,
      apiCalls: [],
    }),
    'sms-registration': () => ({
      findings: isPreconfig
        ? 'SMS registration applicable — same process as regular onboarding. Customer briefed on A2P 10DLC requirements.'
        : 'SMS brand registration initiated. TCR brand form submitted. Expected approval: 3-5 business days.',
      autoComplete: true,
      apiCalls: [],
    }),
  };

  const handler = map[stepId];
  if (!handler) return { findings: 'Step simulated (no specific automation defined).', autoComplete: false, apiCalls: [] };
  return handler();
}

module.exports = router;
