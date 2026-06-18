'use strict';

// Authentication disabled — all endpoints are open.
function authMiddleware(req, res, next) {
  next();
}

module.exports = authMiddleware;
