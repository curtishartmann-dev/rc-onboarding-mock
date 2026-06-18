'use strict';

const { Router } = require('express');
const { accounts, issueToken } = require('../data/mockData');

const router = Router();

/**
 * POST /restapi/oauth/token
 * Mocked OAuth2 password/client_credentials flow.
 * Accepts any account_id from our mock data, returns a bearer token.
 *
 * Body params (form-urlencoded or JSON):
 *   grant_type    - "password" | "client_credentials"
 *   account_id    - one of the mock account IDs (acc-001 … acc-005)
 *   username      - ignored (use account_id)
 *   password      - ignored
 *   client_id     - any string
 *   client_secret - any string
 */
router.post('/restapi/oauth/token', (req, res) => {
  const body = req.body || {};
  const accountId = body.account_id || body.accountId || Object.keys(accounts)[0];

  if (!accounts[accountId]) {
    return res.status(400).json({
      errorCode: 'OAU-102',
      message: `Account '${accountId}' not found. Valid IDs: ${Object.keys(accounts).join(', ')}`,
    });
  }

  const accessToken = issueToken(accountId);

  res.json({
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: 3600,
    scope: 'ReadAccounts EditExtensions ReadCallLog',
    owner_id: accountId,
    endpoint_id: accountId,
    account_id: accountId,
  });
});

/**
 * POST /restapi/oauth/revoke
 */
router.post('/restapi/oauth/revoke', (req, res) => {
  res.status(200).send('');
});

module.exports = router;
