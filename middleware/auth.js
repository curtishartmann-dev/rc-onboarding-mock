'use strict';

const { validateToken } = require('../data/mockData');

/**
 * Middleware: validates Bearer token from Authorization header.
 * Attaches ctx.accountId to req for downstream use.
 * Skips auth on /restapi/oauth/* and /api/partners and /health.
 */
function authMiddleware(req, res, next) {
  const open = [
    '/restapi/oauth/token',
    '/restapi/oauth/authorize',
    '/health',
  ];

  if (open.some(p => req.path.startsWith(p)) || req.path.startsWith('/api/partners')) {
    return next();
  }

  const authHeader = req.headers['authorization'] || '';
  const tokenInfo = validateToken(authHeader);

  if (!tokenInfo) {
    return res.status(401).json({
      errorCode: 'OAU-101',
      message: 'Authorization failed: Invalid access token.',
    });
  }

  req.tokenInfo = tokenInfo;
  next();
}

module.exports = authMiddleware;
