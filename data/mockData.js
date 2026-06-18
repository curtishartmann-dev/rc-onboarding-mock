'use strict';

// ─────────────────────────────────────────────────────────────
//  RingCentral GSP Technical Onboarding — Mock Data Store
//  Mirrors real RC API shapes so routes can return realistic
//  payloads for both Regular and Pre-config (SMB) scenarios.
// ─────────────────────────────────────────────────────────────

const { v4: uuidv4 } = require('uuid');

// ── Helpers ──────────────────────────────────────────────────
const ts = () => new Date().toISOString();

// ── Partners (GSPs / Resellers) ──────────────────────────────
const partners = {
  'partner-att': {
    id: 'partner-att',
    name: 'AT&T',
    type: 'GSP',
    tier: 'Platinum',
    contactEmail: 'partner@att.com',
    supportPhone: '+18005551001',
    defaultOnboardingType: 'preconfig',
    createdAt: '2023-01-15T00:00:00.000Z',
  },
  'partner-frontier': {
    id: 'partner-frontier',
    name: 'Frontier Communications',
    type: 'GSP',
    tier: 'Gold',
    contactEmail: 'partner@frontier.com',
    supportPhone: '+18005551002',
    defaultOnboardingType: 'preconfig',
    createdAt: '2023-03-20T00:00:00.000Z',
  },
  'partner-cox': {
    id: 'partner-cox',
    name: 'Cox Business',
    type: 'GSP',
    tier: 'Gold',
    contactEmail: 'partner@cox.com',
    supportPhone: '+18005551003',
    defaultOnboardingType: 'preconfig',
    createdAt: '2023-05-10T00:00:00.000Z',
  },
  'partner-brightspeed': {
    id: 'partner-brightspeed',
    name: 'Brightspeed',
    type: 'GSP',
    tier: 'Silver',
    contactEmail: 'partner@brightspeed.com',
    supportPhone: '+18005551004',
    defaultOnboardingType: 'regular',
    createdAt: '2024-01-08T00:00:00.000Z',
  },
  'partner-direct': {
    id: 'partner-direct',
    name: 'RingCentral Direct',
    type: 'Direct',
    tier: 'Internal',
    contactEmail: 'direct@ringcentral.com',
    supportPhone: '+18005551000',
    defaultOnboardingType: 'regular',
    createdAt: '2020-01-01T00:00:00.000Z',
  },
};

// ── Accounts (Customer Companies) ────────────────────────────
const accounts = {
  'acc-001': {
    id: 'acc-001',
    uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-001',
    serviceInfo: {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-001/service-info',
      brand: { id: 'partner-att', name: 'AT&T Office@Hand' },
      servicePlan: { id: 'sp-premium', name: 'RingEX Premium' },
    },
    operator: { id: 'acc-001', extensionNumber: '0' },
    mainNumber: '+14085550101',
    name: 'Acme Corp',
    status: 'Confirmed',
    setupWizardState: 'NotStarted',
    signupInfo: {
      email: 'admin@acme.com',
      firstName: 'James',
      lastName: 'Wilson',
      country: { id: '1', isoCode: 'US', name: 'United States' },
    },
    partnerId: 'partner-att',
    onboardingType: 'preconfig',
    onboardingStatus: 'pending',
    seats: 25,
    createdAt: '2024-11-01T00:00:00.000Z',
    regionalSettings: {
      timezone: { id: '58', name: 'US/Pacific' },
      homeCountry: { id: '1', isoCode: 'US', name: 'United States' },
      language: { id: 'en-US', name: 'English (United States)' },
      formattingLocale: { id: 'en-US', name: 'English (United States)' },
    },
    serviceFeatures: [
      { featureName: 'SMS', enabled: true },
      { featureName: 'Voicemail', enabled: true },
      { featureName: 'CallRecording', enabled: true },
      { featureName: 'AutomaticCallRecording', enabled: false },
    ],
  },
  'acc-002': {
    id: 'acc-002',
    uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-002',
    serviceInfo: {
      brand: { id: 'partner-frontier', name: 'Frontier RingEX' },
      servicePlan: { id: 'sp-standard', name: 'RingEX Standard' },
    },
    operator: { id: 'acc-002', extensionNumber: '0' },
    mainNumber: '+14085550201',
    name: 'Blue Sky Technologies',
    status: 'Confirmed',
    setupWizardState: 'Completed',
    signupInfo: {
      email: 'admin@bluesky.tech',
      firstName: 'Maria',
      lastName: 'Chen',
      country: { id: '1', isoCode: 'US', name: 'United States' },
    },
    partnerId: 'partner-frontier',
    onboardingType: 'preconfig',
    onboardingStatus: 'pending',
    seats: 10,
    createdAt: '2024-12-15T00:00:00.000Z',
    regionalSettings: {
      timezone: { id: '11', name: 'US/Eastern' },
      homeCountry: { id: '1', isoCode: 'US', name: 'United States' },
      language: { id: 'en-US', name: 'English (United States)' },
      formattingLocale: { id: 'en-US', name: 'English (United States)' },
    },
    serviceFeatures: [
      { featureName: 'SMS', enabled: true },
      { featureName: 'Voicemail', enabled: true },
      { featureName: 'CallRecording', enabled: false },
    ],
  },
  'acc-003': {
    id: 'acc-003',
    uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-003',
    serviceInfo: {
      brand: { id: 'partner-cox', name: 'Cox Business Voice' },
      servicePlan: { id: 'sp-premium', name: 'RingEX Premium' },
    },
    operator: { id: 'acc-003', extensionNumber: '0' },
    mainNumber: '+17025550301',
    name: 'Desert Sun Realty',
    status: 'Confirmed',
    setupWizardState: 'NotStarted',
    signupInfo: {
      email: 'admin@desertsun.com',
      firstName: 'Carlos',
      lastName: 'Rivera',
      country: { id: '1', isoCode: 'US', name: 'United States' },
    },
    partnerId: 'partner-cox',
    onboardingType: 'preconfig',
    onboardingStatus: 'pending',
    seats: 15,
    createdAt: '2025-01-20T00:00:00.000Z',
    regionalSettings: {
      timezone: { id: '45', name: 'US/Mountain' },
      homeCountry: { id: '1', isoCode: 'US', name: 'United States' },
      language: { id: 'en-US', name: 'English (United States)' },
      formattingLocale: { id: 'en-US', name: 'English (United States)' },
    },
    serviceFeatures: [
      { featureName: 'SMS', enabled: true },
      { featureName: 'Voicemail', enabled: true },
    ],
  },
  'acc-004': {
    id: 'acc-004',
    uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-004',
    serviceInfo: {
      brand: { id: 'partner-direct', name: 'RingCentral' },
      servicePlan: { id: 'sp-ultimate', name: 'RingEX Ultimate' },
    },
    operator: { id: 'acc-004', extensionNumber: '0' },
    mainNumber: '+13125550401',
    name: 'Lakeside Law Group',
    status: 'Confirmed',
    setupWizardState: 'NotStarted',
    signupInfo: {
      email: 'admin@lakesidelaw.com',
      firstName: 'Patricia',
      lastName: 'Thompson',
      country: { id: '1', isoCode: 'US', name: 'United States' },
    },
    partnerId: 'partner-direct',
    onboardingType: 'regular',
    onboardingStatus: 'pending',
    seats: 40,
    createdAt: '2025-02-10T00:00:00.000Z',
    regionalSettings: {
      timezone: { id: '24', name: 'US/Central' },
      homeCountry: { id: '1', isoCode: 'US', name: 'United States' },
      language: { id: 'en-US', name: 'English (United States)' },
      formattingLocale: { id: 'en-US', name: 'English (United States)' },
    },
    serviceFeatures: [
      { featureName: 'SMS', enabled: true },
      { featureName: 'Voicemail', enabled: true },
      { featureName: 'CallRecording', enabled: true },
      { featureName: 'AutomaticCallRecording', enabled: true },
    ],
  },
  'acc-005': {
    id: 'acc-005',
    uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-005',
    serviceInfo: {
      brand: { id: 'partner-brightspeed', name: 'Brightspeed UCaaS' },
      servicePlan: { id: 'sp-standard', name: 'RingEX Standard' },
    },
    operator: { id: 'acc-005', extensionNumber: '0' },
    mainNumber: '+19805550501',
    name: 'Mountain View Dental',
    status: 'Confirmed',
    setupWizardState: 'NotStarted',
    signupInfo: {
      email: 'admin@mvdental.com',
      firstName: 'Kevin',
      lastName: 'Park',
      country: { id: '1', isoCode: 'US', name: 'United States' },
    },
    partnerId: 'partner-brightspeed',
    onboardingType: 'regular',
    onboardingStatus: 'pending',
    seats: 8,
    createdAt: '2025-03-05T00:00:00.000Z',
    regionalSettings: {
      timezone: { id: '45', name: 'US/Mountain' },
      homeCountry: { id: '1', isoCode: 'US', name: 'United States' },
      language: { id: 'en-US', name: 'English (United States)' },
      formattingLocale: { id: 'en-US', name: 'English (United States)' },
    },
    serviceFeatures: [
      { featureName: 'SMS', enabled: true },
      { featureName: 'Voicemail', enabled: true },
    ],
  },
};

// ── Extensions (Users) ────────────────────────────────────────
// Keyed as extensions[accountId][extensionId]
const extensions = {
  'acc-001': {
    'ext-001-100': {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-001/extension/ext-001-100',
      id: 'ext-001-100',
      extensionNumber: '100',
      contact: {
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.wilson@acme.com',
        businessPhone: '+14085550102',
      },
      name: 'James Wilson',
      type: 'User',
      status: 'Enabled',
      departments: [],
      permissions: { admin: { enabled: true }, internationalCalling: { enabled: true } },
      profileImage: { uri: null },
      regionalSettings: {
        timezone: { id: '58', name: 'US/Pacific' },
        language: { id: 'en-US', name: 'English (United States)' },
      },
      setupWizardState: 'Completed',
      hidden: false,
      assignedRole: { id: 'role-admin', displayName: 'Super Admin' },
    },
    'ext-001-101': {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-001/extension/ext-001-101',
      id: 'ext-001-101',
      extensionNumber: '101',
      contact: {
        firstName: 'Sarah',
        lastName: 'Mitchell',
        email: 'sarah.mitchell@acme.com',
        businessPhone: '+14085550103',
      },
      name: 'Sarah Mitchell',
      type: 'User',
      status: 'Enabled',
      departments: [{ id: 'dept-sales', displayName: 'Sales' }],
      permissions: { admin: { enabled: false }, internationalCalling: { enabled: true } },
      profileImage: { uri: null },
      regionalSettings: {
        timezone: { id: '58', name: 'US/Pacific' },
        language: { id: 'en-US', name: 'English (United States)' },
      },
      setupWizardState: 'NotStarted',
      hidden: false,
      assignedRole: { id: 'role-user', displayName: 'Standard User' },
    },
    'ext-001-102': {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-001/extension/ext-001-102',
      id: 'ext-001-102',
      extensionNumber: '102',
      contact: {
        firstName: 'David',
        lastName: 'Nguyen',
        email: 'david.nguyen@acme.com',
        businessPhone: '+14085550104',
      },
      name: 'David Nguyen',
      type: 'User',
      status: 'Enabled',
      departments: [{ id: 'dept-support', displayName: 'Support' }],
      permissions: { admin: { enabled: false }, internationalCalling: { enabled: false } },
      profileImage: { uri: null },
      regionalSettings: {
        timezone: { id: '58', name: 'US/Pacific' },
        language: { id: 'en-US', name: 'English (United States)' },
      },
      setupWizardState: 'NotStarted',
      hidden: false,
      assignedRole: { id: 'role-user', displayName: 'Standard User' },
    },
    'ext-001-200': {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-001/extension/ext-001-200',
      id: 'ext-001-200',
      extensionNumber: '200',
      name: 'Main Reception',
      type: 'IvrMenu',
      status: 'Enabled',
      departments: [],
      setupWizardState: 'Completed',
      hidden: false,
    },
    'ext-001-300': {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-001/extension/ext-001-300',
      id: 'ext-001-300',
      extensionNumber: '300',
      name: 'Sales Queue',
      type: 'Department',
      status: 'Enabled',
      departments: [],
      setupWizardState: 'Completed',
      hidden: false,
    },
  },
  'acc-002': {
    'ext-002-100': {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-002/extension/ext-002-100',
      id: 'ext-002-100',
      extensionNumber: '100',
      contact: {
        firstName: 'Maria',
        lastName: 'Chen',
        email: 'maria.chen@bluesky.tech',
        businessPhone: '+14085550202',
      },
      name: 'Maria Chen',
      type: 'User',
      status: 'Enabled',
      departments: [],
      permissions: { admin: { enabled: true }, internationalCalling: { enabled: true } },
      setupWizardState: 'Completed',
      hidden: false,
      assignedRole: { id: 'role-admin', displayName: 'Super Admin' },
    },
    'ext-002-101': {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-002/extension/ext-002-101',
      id: 'ext-002-101',
      extensionNumber: '101',
      contact: {
        firstName: 'Tom',
        lastName: 'Baker',
        email: 'tom.baker@bluesky.tech',
        businessPhone: '+14085550203',
      },
      name: 'Tom Baker',
      type: 'User',
      status: 'Enabled',
      departments: [],
      permissions: { admin: { enabled: false }, internationalCalling: { enabled: false } },
      setupWizardState: 'NotStarted',
      hidden: false,
      assignedRole: { id: 'role-user', displayName: 'Standard User' },
    },
    'ext-002-102': {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-002/extension/ext-002-102',
      id: 'ext-002-102',
      extensionNumber: '102',
      contact: {
        firstName: 'Lisa',
        lastName: 'Park',
        email: 'lisa.park@bluesky.tech',
        businessPhone: '+14085550204',
      },
      name: 'Lisa Park',
      type: 'User',
      status: 'Enabled',
      departments: [],
      permissions: { admin: { enabled: false }, internationalCalling: { enabled: false } },
      setupWizardState: 'NotStarted',
      hidden: false,
      assignedRole: { id: 'role-user', displayName: 'Standard User' },
    },
    'ext-002-200': {
      uri: 'https://platform.ringcentral.com/restapi/v1.0/account/acc-002/extension/ext-002-200',
      id: 'ext-002-200',
      extensionNumber: '200',
      name: 'Auto-Receptionist',
      type: 'IvrMenu',
      status: 'Enabled',
      departments: [],
      setupWizardState: 'Completed',
      hidden: false,
    },
  },
  'acc-003': {
    'ext-003-100': {
      id: 'ext-003-100', extensionNumber: '100',
      contact: { firstName: 'Carlos', lastName: 'Rivera', email: 'carlos.rivera@desertsun.com', businessPhone: '+17025550302' },
      name: 'Carlos Rivera', type: 'User', status: 'Enabled',
      permissions: { admin: { enabled: true }, internationalCalling: { enabled: false } },
      setupWizardState: 'Completed', hidden: false,
      assignedRole: { id: 'role-admin', displayName: 'Super Admin' },
    },
    'ext-003-101': {
      id: 'ext-003-101', extensionNumber: '101',
      contact: { firstName: 'Anna', lastName: 'Perez', email: 'anna.perez@desertsun.com', businessPhone: '+17025550303' },
      name: 'Anna Perez', type: 'User', status: 'Enabled',
      permissions: { admin: { enabled: false }, internationalCalling: { enabled: false } },
      setupWizardState: 'NotStarted', hidden: false,
      assignedRole: { id: 'role-user', displayName: 'Standard User' },
    },
    'ext-003-200': {
      id: 'ext-003-200', extensionNumber: '200',
      name: 'Reception IVR', type: 'IvrMenu', status: 'Enabled',
      setupWizardState: 'NotStarted', hidden: false,
    },
  },
  'acc-004': {
    'ext-004-100': {
      id: 'ext-004-100', extensionNumber: '100',
      contact: { firstName: 'Patricia', lastName: 'Thompson', email: 'patricia.thompson@lakesidelaw.com', businessPhone: '+13125550402' },
      name: 'Patricia Thompson', type: 'User', status: 'Enabled',
      permissions: { admin: { enabled: true }, internationalCalling: { enabled: true } },
      setupWizardState: 'NotStarted', hidden: false,
      assignedRole: { id: 'role-admin', displayName: 'Super Admin' },
    },
    'ext-004-101': {
      id: 'ext-004-101', extensionNumber: '101',
      contact: { firstName: 'Robert', lastName: 'Johnson', email: 'robert.johnson@lakesidelaw.com', businessPhone: '+13125550403' },
      name: 'Robert Johnson', type: 'User', status: 'Enabled',
      permissions: { admin: { enabled: false }, internationalCalling: { enabled: true } },
      setupWizardState: 'NotStarted', hidden: false,
      assignedRole: { id: 'role-user', displayName: 'Standard User' },
    },
    'ext-004-102': {
      id: 'ext-004-102', extensionNumber: '102',
      contact: { firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@lakesidelaw.com', businessPhone: '+13125550404' },
      name: 'Emily Davis', type: 'User', status: 'Enabled',
      permissions: { admin: { enabled: false }, internationalCalling: { enabled: false } },
      setupWizardState: 'NotStarted', hidden: false,
      assignedRole: { id: 'role-user', displayName: 'Standard User' },
    },
  },
  'acc-005': {
    'ext-005-100': {
      id: 'ext-005-100', extensionNumber: '100',
      contact: { firstName: 'Kevin', lastName: 'Park', email: 'kevin.park@mvdental.com', businessPhone: '+19805550502' },
      name: 'Kevin Park', type: 'User', status: 'Enabled',
      permissions: { admin: { enabled: true }, internationalCalling: { enabled: false } },
      setupWizardState: 'NotStarted', hidden: false,
      assignedRole: { id: 'role-admin', displayName: 'Super Admin' },
    },
    'ext-005-101': {
      id: 'ext-005-101', extensionNumber: '101',
      contact: { firstName: 'Jennifer', lastName: 'Lee', email: 'jennifer.lee@mvdental.com', businessPhone: '+19805550503' },
      name: 'Jennifer Lee', type: 'User', status: 'Enabled',
      permissions: { admin: { enabled: false }, internationalCalling: { enabled: false } },
      setupWizardState: 'NotStarted', hidden: false,
      assignedRole: { id: 'role-user', displayName: 'Standard User' },
    },
  },
};

// ── Phone Numbers ─────────────────────────────────────────────
// phoneNumbers[accountId] = array
const phoneNumbers = {
  'acc-001': [
    { id: 'pn-001-1', phoneNumber: '+14085550101', usageType: 'MainCompanyNumber', type: 'VoiceFax', status: 'Normal', extension: null, country: { isoCode: 'US' } },
    { id: 'pn-001-2', phoneNumber: '+14085550102', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-001-100', extensionNumber: '100', name: 'James Wilson' }, country: { isoCode: 'US' } },
    { id: 'pn-001-3', phoneNumber: '+14085550103', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-001-101', extensionNumber: '101', name: 'Sarah Mitchell' }, country: { isoCode: 'US' } },
    { id: 'pn-001-4', phoneNumber: '+14085550104', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-001-102', extensionNumber: '102', name: 'David Nguyen' }, country: { isoCode: 'US' } },
    { id: 'pn-001-5', phoneNumber: '+14085550105', usageType: 'AdditionalCompanyNumber', type: 'VoiceFax', status: 'Normal', extension: null, country: { isoCode: 'US' } },
  ],
  'acc-002': [
    { id: 'pn-002-1', phoneNumber: '+14085550201', usageType: 'MainCompanyNumber', type: 'VoiceFax', status: 'Normal', extension: null, country: { isoCode: 'US' } },
    { id: 'pn-002-2', phoneNumber: '+14085550202', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-002-100', extensionNumber: '100', name: 'Maria Chen' }, country: { isoCode: 'US' } },
    { id: 'pn-002-3', phoneNumber: '+14085550203', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-002-101', extensionNumber: '101', name: 'Tom Baker' }, country: { isoCode: 'US' } },
  ],
  'acc-003': [
    { id: 'pn-003-1', phoneNumber: '+17025550301', usageType: 'MainCompanyNumber', type: 'VoiceFax', status: 'Normal', extension: null, country: { isoCode: 'US' } },
    { id: 'pn-003-2', phoneNumber: '+17025550302', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-003-100', extensionNumber: '100', name: 'Carlos Rivera' }, country: { isoCode: 'US' } },
  ],
  'acc-004': [
    { id: 'pn-004-1', phoneNumber: '+13125550401', usageType: 'MainCompanyNumber', type: 'VoiceFax', status: 'Normal', extension: null, country: { isoCode: 'US' } },
    { id: 'pn-004-2', phoneNumber: '+13125550402', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-004-100', extensionNumber: '100', name: 'Patricia Thompson' }, country: { isoCode: 'US' } },
    { id: 'pn-004-3', phoneNumber: '+13125550403', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-004-101', extensionNumber: '101', name: 'Robert Johnson' }, country: { isoCode: 'US' } },
    { id: 'pn-004-4', phoneNumber: '+13125550404', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-004-102', extensionNumber: '102', name: 'Emily Davis' }, country: { isoCode: 'US' } },
  ],
  'acc-005': [
    { id: 'pn-005-1', phoneNumber: '+19805550501', usageType: 'MainCompanyNumber', type: 'VoiceFax', status: 'Normal', extension: null, country: { isoCode: 'US' } },
    { id: 'pn-005-2', phoneNumber: '+19805550502', usageType: 'DirectNumber', type: 'VoiceFax', status: 'Normal', extension: { id: 'ext-005-100', extensionNumber: '100', name: 'Kevin Park' }, country: { isoCode: 'US' } },
  ],
};

// ── Devices ───────────────────────────────────────────────────
const devices = {
  'acc-001': [
    { id: 'dev-001-1', uri: '/restapi/v1.0/account/acc-001/device/dev-001-1', sku: 'POLYCOM-VVX-450', type: 'HardPhone', name: 'Polycom VVX 450', status: 'Online', serial: 'SN001-001', model: { id: 'm-01', name: 'VVX 450', addons: [] }, extension: { id: 'ext-001-100', extensionNumber: '100', name: 'James Wilson' }, phoneLines: [{ lineType: 'StandaloneFree', phoneInfo: { id: 'pn-001-2', phoneNumber: '+14085550102' } }], site: { id: 'main', name: 'Main Site' } },
    { id: 'dev-001-2', uri: '/restapi/v1.0/account/acc-001/device/dev-001-2', sku: 'POLYCOM-VVX-450', type: 'HardPhone', name: 'Polycom VVX 450', status: 'Online', serial: 'SN001-002', model: { id: 'm-01', name: 'VVX 450', addons: [] }, extension: { id: 'ext-001-101', extensionNumber: '101', name: 'Sarah Mitchell' }, phoneLines: [{ lineType: 'StandaloneFree', phoneInfo: { id: 'pn-001-3', phoneNumber: '+14085550103' } }], site: { id: 'main', name: 'Main Site' } },
    { id: 'dev-001-3', uri: '/restapi/v1.0/account/acc-001/device/dev-001-3', sku: 'SOFTPHONE', type: 'SoftPhone', name: 'RingCentral App', status: 'Online', serial: null, model: null, extension: { id: 'ext-001-102', extensionNumber: '102', name: 'David Nguyen' }, phoneLines: [], site: { id: 'main', name: 'Main Site' } },
  ],
  'acc-002': [
    { id: 'dev-002-1', sku: 'CISCO-8865', type: 'HardPhone', name: 'Cisco 8865', status: 'Online', serial: 'SN002-001', model: { id: 'm-02', name: 'Cisco 8865', addons: [] }, extension: { id: 'ext-002-100', extensionNumber: '100', name: 'Maria Chen' }, phoneLines: [{ lineType: 'StandaloneFree', phoneInfo: { id: 'pn-002-2', phoneNumber: '+14085550202' } }], site: { id: 'main', name: 'Main Site' } },
    { id: 'dev-002-2', sku: 'SOFTPHONE', type: 'SoftPhone', name: 'RingCentral App', status: 'Offline', serial: null, model: null, extension: { id: 'ext-002-101', extensionNumber: '101', name: 'Tom Baker' }, phoneLines: [], site: { id: 'main', name: 'Main Site' } },
    { id: 'dev-002-3', sku: 'SOFTPHONE', type: 'SoftPhone', name: 'RingCentral App', status: 'Online', serial: null, model: null, extension: { id: 'ext-002-102', extensionNumber: '102', name: 'Lisa Park' }, phoneLines: [], site: { id: 'main', name: 'Main Site' } },
  ],
  'acc-003': [
    { id: 'dev-003-1', sku: 'POLYCOM-VVX-350', type: 'HardPhone', name: 'Polycom VVX 350', status: 'Online', serial: 'SN003-001', model: { id: 'm-03', name: 'VVX 350' }, extension: { id: 'ext-003-100', extensionNumber: '100', name: 'Carlos Rivera' }, phoneLines: [{ lineType: 'StandaloneFree', phoneInfo: { id: 'pn-003-2', phoneNumber: '+17025550302' } }], site: { id: 'main', name: 'Main Site' } },
  ],
  'acc-004': [
    { id: 'dev-004-1', sku: 'SOFTPHONE', type: 'SoftPhone', name: 'RingCentral App', status: 'NotActivated', serial: null, model: null, extension: { id: 'ext-004-100', extensionNumber: '100', name: 'Patricia Thompson' }, phoneLines: [], site: { id: 'main', name: 'Main Site' } },
    { id: 'dev-004-2', sku: 'SOFTPHONE', type: 'SoftPhone', name: 'RingCentral App', status: 'NotActivated', serial: null, model: null, extension: { id: 'ext-004-101', extensionNumber: '101', name: 'Robert Johnson' }, phoneLines: [], site: { id: 'main', name: 'Main Site' } },
    { id: 'dev-004-3', sku: 'SOFTPHONE', type: 'SoftPhone', name: 'RingCentral App', status: 'NotActivated', serial: null, model: null, extension: { id: 'ext-004-102', extensionNumber: '102', name: 'Emily Davis' }, phoneLines: [], site: { id: 'main', name: 'Main Site' } },
  ],
  'acc-005': [
    { id: 'dev-005-1', sku: 'SOFTPHONE', type: 'SoftPhone', name: 'RingCentral App', status: 'NotActivated', serial: null, model: null, extension: { id: 'ext-005-100', extensionNumber: '100', name: 'Kevin Park' }, phoneLines: [], site: { id: 'main', name: 'Main Site' } },
    { id: 'dev-005-2', sku: 'SOFTPHONE', type: 'SoftPhone', name: 'RingCentral App', status: 'NotActivated', serial: null, model: null, extension: { id: 'ext-005-101', extensionNumber: '101', name: 'Jennifer Lee' }, phoneLines: [], site: { id: 'main', name: 'Main Site' } },
  ],
};

// ── Business Hours ────────────────────────────────────────────
const businessHours = {
  'acc-001': {
    'ext-001-100': {
      schedule: {
        weeklyRanges: {
          monday: [{ from: '09:00', to: '17:00' }],
          tuesday: [{ from: '09:00', to: '17:00' }],
          wednesday: [{ from: '09:00', to: '17:00' }],
          thursday: [{ from: '09:00', to: '17:00' }],
          friday: [{ from: '09:00', to: '17:00' }],
        },
      },
    },
    'account': {
      schedule: {
        weeklyRanges: {
          monday: [{ from: '08:00', to: '18:00' }],
          tuesday: [{ from: '08:00', to: '18:00' }],
          wednesday: [{ from: '08:00', to: '18:00' }],
          thursday: [{ from: '08:00', to: '18:00' }],
          friday: [{ from: '08:00', to: '17:00' }],
        },
      },
    },
  },
  'acc-002': {
    'account': {
      schedule: {
        weeklyRanges: {
          monday: [{ from: '09:00', to: '17:00' }],
          tuesday: [{ from: '09:00', to: '17:00' }],
          wednesday: [{ from: '09:00', to: '17:00' }],
          thursday: [{ from: '09:00', to: '17:00' }],
          friday: [{ from: '09:00', to: '17:00' }],
        },
      },
    },
  },
};

// ── Answering Rules ───────────────────────────────────────────
const answeringRules = {
  'acc-001': {
    'ext-001-100': [
      {
        id: 'rule-001-100-1',
        uri: '/restapi/v1.0/account/acc-001/extension/ext-001-100/answering-rule/rule-001-100-1',
        enabled: true,
        type: 'BusinessHours',
        name: 'Business Hours Rule',
        callHandlingAction: 'ForwardCalls',
        forwarding: {
          notifyMySoftPhones: true,
          notifyAdminSoftPhones: false,
          softPhonesRingCount: 5,
          ringingMode: 'Sequentially',
          rules: [
            { index: 1, ringCount: 4, enabled: true, forwardingNumbers: [{ id: 'pn-001-2', phoneNumber: '+14085550102', type: 'PhoneNumber', label: 'Business Phone' }] },
          ],
        },
        voicemail: { enabled: true, recipient: { uri: '/restapi/v1.0/account/acc-001/extension/ext-001-100', id: 'ext-001-100', name: 'James Wilson', extensionNumber: '100' } },
        missedCall: { actionType: 'ConnectToVoicemail', extension: null },
      },
      {
        id: 'rule-001-100-2',
        uri: '/restapi/v1.0/account/acc-001/extension/ext-001-100/answering-rule/rule-001-100-2',
        enabled: true,
        type: 'AfterHours',
        name: 'After Hours Rule',
        callHandlingAction: 'TakeMessagesOnly',
        voicemail: { enabled: true, recipient: { id: 'ext-001-100', name: 'James Wilson', extensionNumber: '100' } },
      },
    ],
    'account': [
      {
        id: 'acct-rule-001-1',
        enabled: true,
        type: 'BusinessHours',
        name: 'Company Business Hours',
        callHandlingAction: 'TransferToExtension',
        transfer: { extension: { id: 'ext-001-200', name: 'Main Reception', extensionNumber: '200' } },
      },
      {
        id: 'acct-rule-001-2',
        enabled: true,
        type: 'AfterHours',
        name: 'Company After Hours',
        callHandlingAction: 'PlayAnnouncementOnly',
        greetings: [{ type: 'Voicemail', preset: { id: 'pg-vmgreet', name: 'Default' } }],
      },
    ],
  },
  'acc-002': {
    'ext-002-100': [
      {
        id: 'rule-002-100-1',
        enabled: true,
        type: 'BusinessHours',
        name: 'Business Hours',
        callHandlingAction: 'ForwardCalls',
        forwarding: { notifyMySoftPhones: true, softPhonesRingCount: 4, ringingMode: 'Simultaneously', rules: [] },
        voicemail: { enabled: true, recipient: { id: 'ext-002-100', name: 'Maria Chen', extensionNumber: '100' } },
      },
    ],
    'account': [
      {
        id: 'acct-rule-002-1',
        enabled: true,
        type: 'BusinessHours',
        name: 'Company Business Hours',
        callHandlingAction: 'TransferToExtension',
        transfer: { extension: { id: 'ext-002-200', name: 'Auto-Receptionist', extensionNumber: '200' } },
      },
    ],
  },
};

// ── IVR Menus ─────────────────────────────────────────────────
const ivrMenus = {
  'acc-001': {
    'ivr-001-1': {
      id: 'ivr-001-1',
      uri: '/restapi/v1.0/account/acc-001/ivr-menus/ivr-001-1',
      name: 'Main Reception IVR',
      extensionNumber: '200',
      prompt: {
        mode: 'TextToSpeech',
        text: 'Thank you for calling Acme Corp. Press 1 for Sales. Press 2 for Support. Press 0 for the operator.',
      },
      actions: [
        { input: '1', action: 'TransferToExtension', extension: { id: 'ext-001-300', name: 'Sales Queue', extensionNumber: '300' } },
        { input: '2', action: 'TransferToExtension', extension: { id: 'ext-001-102', name: 'David Nguyen', extensionNumber: '102' } },
        { input: '0', action: 'TransferToExtension', extension: { id: 'ext-001-100', name: 'James Wilson', extensionNumber: '100' } },
      ],
    },
  },
  'acc-002': {
    'ivr-002-1': {
      id: 'ivr-002-1',
      name: 'Auto-Receptionist',
      extensionNumber: '200',
      prompt: {
        mode: 'TextToSpeech',
        text: 'Thank you for calling Blue Sky Technologies. Press 1 for Sales. Press 2 for Support.',
      },
      actions: [
        { input: '1', action: 'TransferToExtension', extension: { id: 'ext-002-101', name: 'Tom Baker', extensionNumber: '101' } },
        { input: '2', action: 'TransferToExtension', extension: { id: 'ext-002-102', name: 'Lisa Park', extensionNumber: '102' } },
      ],
    },
  },
  'acc-003': {
    'ivr-003-1': {
      id: 'ivr-003-1',
      name: 'Reception IVR',
      extensionNumber: '200',
      prompt: { mode: 'TextToSpeech', text: 'Thank you for calling Desert Sun Realty. Please hold while we connect you.' },
      actions: [
        { input: '0', action: 'TransferToExtension', extension: { id: 'ext-003-100', name: 'Carlos Rivera', extensionNumber: '100' } },
      ],
    },
  },
};

// ── Call Queues ───────────────────────────────────────────────
const callQueues = {
  'acc-001': [
    {
      id: 'cq-001-1',
      uri: '/restapi/v1.0/account/acc-001/call-queues/cq-001-1',
      extensionNumber: '300',
      name: 'Sales Queue',
      status: 'Enabled',
      members: [
        { uri: '/restapi/v1.0/account/acc-001/extension/ext-001-101', id: 'ext-001-101', extensionNumber: '101', name: 'Sarah Mitchell' },
      ],
    },
  ],
  'acc-002': [],
  'acc-003': [],
  'acc-004': [],
  'acc-005': [],
};

// ── Roles ─────────────────────────────────────────────────────
const userRoles = [
  { id: 'role-admin', displayName: 'Super Admin', description: 'Full access to all account settings', custom: false, scope: 'Account', hidden: false },
  { id: 'role-user', displayName: 'Standard User', description: 'Standard user permissions', custom: false, scope: 'Account', hidden: false },
  { id: 'role-manager', displayName: 'Manager', description: 'Team management permissions', custom: false, scope: 'Account', hidden: false },
  { id: 'role-readonly', displayName: 'Read Only', description: 'View-only access', custom: false, scope: 'Account', hidden: false },
];

// ── Greetings ─────────────────────────────────────────────────
const greetings = {
  'acc-001': {
    'ext-001-100': [
      { id: 'gr-001-100-1', type: 'Voicemail', preset: { id: 'pg-vm-1', name: 'Default Voicemail' }, custom: false },
      { id: 'gr-001-100-2', type: 'Introductory', preset: { id: 'pg-intro-1', name: 'Default Introductory' }, custom: false },
    ],
    'ext-001-101': [
      { id: 'gr-001-101-1', type: 'Voicemail', preset: { id: 'pg-vm-1', name: 'Default Voicemail' }, custom: false },
    ],
  },
  'acc-002': {
    'ext-002-100': [
      { id: 'gr-002-100-1', type: 'Voicemail', preset: { id: 'pg-vm-1', name: 'Default Voicemail' }, custom: false },
    ],
  },
};

// ── Call Recording ────────────────────────────────────────────
const callRecording = {
  'acc-001': {
    onDemand: { enabled: true },
    automatic: { enabled: false, outboundCallTones: false, outboundCallAnnouncement: false, allowMute: true, extensionCount: 0 },
    extensions: [],
  },
  'acc-004': {
    onDemand: { enabled: true },
    automatic: { enabled: true, outboundCallTones: true, outboundCallAnnouncement: true, allowMute: false, extensionCount: 2 },
    extensions: [
      { id: 'ext-004-100', extensionNumber: '100', name: 'Patricia Thompson' },
      { id: 'ext-004-101', extensionNumber: '101', name: 'Robert Johnson' },
    ],
  },
};

// ── Forwarding Numbers ────────────────────────────────────────
const forwardingNumbers = {
  'acc-001': {
    'ext-001-100': [
      { id: 'fwd-001-100-1', uri: '/restapi/v1.0/account/acc-001/extension/ext-001-100/forwarding-number/fwd-001-100-1', phoneNumber: '+14085559001', label: 'Mobile', features: ['CallForwarding'], type: 'Mobile' },
    ],
    'ext-001-101': [
      { id: 'fwd-001-101-1', phoneNumber: '+14085559002', label: 'Mobile', features: ['CallForwarding'], type: 'Mobile' },
    ],
  },
};

// ── Onboarding Sessions ───────────────────────────────────────
// Active onboarding sessions; created dynamically
const onboardingSessions = {};

// ── Checklist definitions ─────────────────────────────────────
// Per the slide: foundational topics comparison for Regular vs Pre-config
const checklistDefinitions = {
  regular: [
    { stepId: 'user-details',          category: 'Users & Permissions', name: 'User Details',                   description: 'Create and configure users',                       required: true  },
    { stepId: 'settings-permissions',  category: 'Users & Permissions', name: 'Settings & Permissions',          description: 'Configure roles, permissions in detail',           required: true  },
    { stepId: 'regional-settings',     category: 'Users & Permissions', name: 'Regional Settings',               description: 'Configure number format, localization',            required: true  },
    { stepId: 'schedule',              category: 'Users & Permissions', name: 'Schedule',                        description: 'Create business hours & schedules',                required: true  },
    { stepId: 'roles',                 category: 'Users & Permissions', name: 'Roles',                           description: 'Assign admin/user roles',                          required: true  },
    { stepId: 'security',              category: 'Users & Permissions', name: 'Security',                        description: 'Explain security settings',                        required: true  },
    { stepId: 'devices-numbers',       category: 'Users & Permissions', name: 'Devices & Numbers',               description: 'Configure and assign devices/numbers',             required: true  },
    { stepId: 'screening-greeting',    category: 'Call Handling',       name: 'Screening, Greeting, Hold Music', description: 'Configure greetings and audio from scratch',       required: true  },
    { stepId: 'call-handling-core',    category: 'Call Handling',       name: 'Call Handling (Core)',            description: 'Build call flow from scratch',                     required: true  },
    { stepId: 'incoming-calls',        category: 'Call Handling',       name: 'Incoming Calls',                  description: 'Configure routing rules',                          required: true  },
    { stepId: 'missed-calls',          category: 'Call Handling',       name: 'Missed Calls',                    description: 'Configure rules',                                  required: true  },
    { stepId: 'message-rules',         category: 'Call Handling',       name: 'Message Rules',                   description: 'Configure rules based on needs',                   required: false },
    { stepId: 'voicemail',             category: 'Call Handling',       name: 'Voicemail',                       description: 'Set voicemail options & greetings',                required: true  },
    { stepId: 'outbound-calls-fax',    category: 'Call Handling',       name: 'Outbound Calls / Faxes',          description: 'Configure outbound settings',                      required: true  },
    { stepId: 'caller-id',             category: 'Call Handling',       name: 'Caller ID',                       description: 'Configure caller ID',                              required: true  },
    { stepId: 'fax-settings',          category: 'Call Handling',       name: 'Fax Settings',                    description: 'Configure if needed',                              required: false },
    { stepId: 'phone-system-general',  category: 'Phone System',        name: 'Phone System (General)',          description: 'Full walkthrough of system config',                required: true  },
    { stepId: 'company-info',          category: 'Phone System',        name: 'Company Info',                    description: 'Set company details',                              required: true  },
    { stepId: 'company-address',       category: 'Phone System',        name: 'Company Address',                 description: 'Configure address',                                required: true  },
    { stepId: 'cnam',                  category: 'Phone System',        name: 'CNaM',                            description: 'Configure caller ID name',                         required: true  },
    { stepId: 'phone-numbers-all',     category: 'Phone System',        name: 'Phone Numbers / All Numbers',     description: 'Full walkthrough + submission',                    required: true  },
    { stepId: 'auto-receptionist',     category: 'Phone System',        name: 'Auto-Receptionist',               description: 'Configure IVR from scratch',                       required: true  },
    { stepId: 'auto-rec-schedule',     category: 'Phone System',        name: 'Auto-Rec Schedule',               description: 'Configure timing',                                 required: true  },
    { stepId: 'auto-rec-call-handling',category: 'Phone System',        name: 'Auto-Rec Call Handling',          description: 'Configure settings',                               required: true  },
    { stepId: 'call-recording',        category: 'Phone System',        name: 'Call Recording',                  description: 'Configure settings',                               required: true  },
    { stepId: 'block-robocalls',       category: 'Phone System',        name: 'Block Robocalls',                 description: 'Configure protection',                             required: true  },
    { stepId: 'phones-devices',        category: 'Devices & Apps',      name: 'Phones & Devices',                description: 'Provision/setup devices',                          required: true  },
    { stepId: 'app-download',          category: 'Devices & Apps',      name: 'App Download & Walkthrough',      description: 'Full demo (implementation)',                       required: true  },
    { stepId: 'sms-registration',      category: 'Devices & Apps',      name: 'SMS Registration',                description: 'Full guidance/setup',                              required: true  },
  ],
  preconfig: [
    { stepId: 'user-details',          category: 'Users & Permissions', name: 'User Details',                   description: 'Validate existing users only',                      required: true  },
    { stepId: 'settings-permissions',  category: 'Users & Permissions', name: 'Settings & Permissions',          description: 'Quick validation of roles/permissions',             required: true  },
    { stepId: 'regional-settings',     category: 'Users & Permissions', name: 'Regional Settings',               description: 'Quick validation',                                  required: true  },
    { stepId: 'schedule',              category: 'Users & Permissions', name: 'Schedule',                        description: 'Validate pre-set schedules',                        required: true  },
    { stepId: 'roles',                 category: 'Users & Permissions', name: 'Roles',                           description: 'Confirm roles are correct',                         required: true  },
    { stepId: 'security',              category: 'Users & Permissions', name: 'Security',                        description: 'Brief mention only (unless needed)',                required: false },
    { stepId: 'devices-numbers',       category: 'Users & Permissions', name: 'Devices & Numbers',               description: 'Validate assignments are correct',                  required: true  },
    { stepId: 'screening-greeting',    category: 'Call Handling',       name: 'Screening, Greeting, Hold Music', description: 'Review playbooks / confirm experience',             required: true  },
    { stepId: 'call-handling-core',    category: 'Call Handling',       name: 'Call Handling (Core)',            description: 'CRITICAL — Validate routing logic',                 required: true  },
    { stepId: 'incoming-calls',        category: 'Call Handling',       name: 'Incoming Calls',                  description: 'Confirm routing rules',                             required: true  },
    { stepId: 'missed-calls',          category: 'Call Handling',       name: 'Missed Calls',                    description: 'Validate failsafe handling',                        required: true  },
    { stepId: 'message-rules',         category: 'Call Handling',       name: 'Message Rules',                   description: 'Mention only',                                      required: false },
    { stepId: 'voicemail',             category: 'Call Handling',       name: 'Voicemail',                       description: 'Validate setup',                                    required: true  },
    { stepId: 'outbound-calls-fax',    category: 'Call Handling',       name: 'Outbound Calls / Faxes',          description: 'Brief overview only',                               required: false },
    { stepId: 'caller-id',             category: 'Call Handling',       name: 'Caller ID',                       description: 'Confirm caller ID display',                         required: true  },
    { stepId: 'fax-settings',          category: 'Call Handling',       name: 'Fax Settings',                    description: 'Only discuss if customer requests',                 required: false },
    { stepId: 'phone-system-general',  category: 'Phone System',        name: 'Phone System (General)',          description: 'High-level overview only',                          required: true  },
    { stepId: 'company-info',          category: 'Phone System',        name: 'Company Info',                    description: 'Confirm correctness',                               required: true  },
    { stepId: 'company-address',       category: 'Phone System',        name: 'Company Address',                 description: 'Validate',                                          required: true  },
    { stepId: 'cnam',                  category: 'Phone System',        name: 'CNaM',                            description: 'Confirm setup',                                     required: true  },
    { stepId: 'phone-numbers-all',     category: 'Phone System',        name: 'Phone Numbers / All Numbers',     description: 'Full walkthrough + submission',                     required: true  },
    { stepId: 'auto-receptionist',     category: 'Phone System',        name: 'Auto-Receptionist',               description: 'Review menu and routing',                           required: true  },
    { stepId: 'auto-rec-schedule',     category: 'Phone System',        name: 'Auto-Rec Schedule',               description: 'Validate',                                          required: true  },
    { stepId: 'auto-rec-call-handling',category: 'Phone System',        name: 'Auto-Rec Call Handling',          description: 'Confirm behavior',                                  required: true  },
    { stepId: 'call-recording',        category: 'Phone System',        name: 'Call Recording',                  description: 'Mention only if needed',                            required: false },
    { stepId: 'block-robocalls',       category: 'Phone System',        name: 'Block Robocalls',                 description: 'Mention only if needed',                            required: false },
    { stepId: 'phones-devices',        category: 'Devices & Apps',      name: 'Phones & Devices',                description: 'Confirm working status',                            required: true  },
    { stepId: 'app-download',          category: 'Devices & Apps',      name: 'App Download & Walkthrough',      description: 'Full demo (mandatory)',                             required: true  },
    { stepId: 'sms-registration',      category: 'Devices & Apps',      name: 'SMS Registration',                description: 'Same expectation if applicable',                    required: false },
  ],
};

// ── Auth tokens (mock) ────────────────────────────────────────
const issuedTokens = {};

function issueToken(accountId) {
  const token = 'mock_' + Buffer.from(`${accountId}:${Date.now()}`).toString('base64');
  issuedTokens[token] = { accountId, issuedAt: Date.now(), expiresIn: 3600 };
  return token;
}

function validateToken(token) {
  if (!token) return null;
  const t = token.replace(/^Bearer\s+/i, '');
  return issuedTokens[t] || null;
}

module.exports = {
  partners,
  accounts,
  extensions,
  phoneNumbers,
  devices,
  businessHours,
  answeringRules,
  ivrMenus,
  callQueues,
  userRoles,
  greetings,
  callRecording,
  forwardingNumbers,
  onboardingSessions,
  checklistDefinitions,
  issueToken,
  validateToken,
  uuidv4,
  ts,
};
