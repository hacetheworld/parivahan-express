/**
 * Codex Error Explainer — pluggable integration point for the Parivahan Sewa
 * logistics/submission server's raw error codes (e.g. HTTP 500/502/409).
 *
 * Today this resolves codes against the local ERROR_DICTIONARY as demo/dummy
 * data. Once a Codex API key is available, call configureCodex() and fill in
 * callCodexApi() below — explainErrorCode() is the single seam every caller
 * (StepPreFlight submission flow, etc.) already goes through.
 */

import { ERROR_DICTIONARY } from './errorDictionary.js';

const codexConfig = {
  apiKey: null,
  endpoint: null
};

/**
 * Plug in real Codex API credentials. Until this is called, explainErrorCode()
 * stays on the local dictionary fallback.
 */
export function configureCodex({ apiKey, endpoint } = {}) {
  codexConfig.apiKey = apiKey || null;
  codexConfig.endpoint = endpoint || null;
}

async function callCodexApi(rawCode, context) {
  const response = await fetch(codexConfig.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${codexConfig.apiKey}`
    },
    body: JSON.stringify({ errorCode: rawCode, context })
  });
  if (!response.ok) throw new Error(`Codex API request failed: ${response.status}`);
  return response.json();
}

/**
 * Resolve a raw server error code to a human-friendly { code, title, message, action }.
 * Uses the real Codex API when configured, otherwise falls back to the local dictionary.
 */
export async function explainErrorCode(rawCode, context = {}) {
  if (codexConfig.apiKey && codexConfig.endpoint) {
    try {
      return await callCodexApi(rawCode, context);
    } catch (err) {
      console.warn('Codex API call failed, falling back to local dictionary:', err);
    }
  }

  return ERROR_DICTIONARY[rawCode] || {
    code: rawCode,
    title: 'Unrecognized Server Error',
    message: `The server returned an error code (${rawCode}) that isn't mapped yet.`,
    action: 'Please retry submission, or note this code down and contact RTO support if it persists.'
  };
}

/**
 * Demo/testing helper: randomly returns a simulated server error code (or null for success),
 * so the codex pipeline can be exercised end-to-end without a real backend.
 */
export function simulateServerError() {
  const pool = [null, null, null, null, 'ERR_SERVER_TIMEOUT_500', 'ERR_GATEWAY_502', 'ERR_VALIDATION_409'];
  return pool[Math.floor(Math.random() * pool.length)];
}
