/**
 * Converts any Axios error into a short, user-friendly string.
 * Never leaks raw server/AI messages to the UI.
 *
 * Priority:
 *  1. Known HTTP status → predefined user-friendly copy
 *  2. Network offline (no response)
 *  3. Fallback string passed by the caller
 */
export function parseApiError(err, fallback = 'Something went wrong. Please try again.') {
  const status = err?.response?.status;

  // ── Map HTTP status codes to clean copy ──────────────────────────
  if (status === 400) return 'Invalid request. Please check your input and try again.';
  if (status === 401) return 'Your session has expired. Please log in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'The requested resource was not found.';
  if (status === 409) return 'A conflict occurred. The resource may already exist.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';

  // 500-range — never show raw server/AI error text
  if (status >= 500) {
    // Only surface the backend message for AppException (they are intentionally user-facing).
    // For generic 500s (e.g. Gemini quota dump), use a safe fallback.
    const serverMsg = err?.response?.data?.message ?? '';
    const isSafeMsg =
      serverMsg.length > 0 &&
      serverMsg.length < 120 &&                  // raw Gemini errors are 1000+ chars
      !serverMsg.includes('generativelanguage') && // reject Gemini endpoint leakage
      !serverMsg.includes('googleapis') &&
      !serverMsg.includes('quota') &&
      !serverMsg.includes('RESOURCE_EXHAUSTED') &&
      !serverMsg.includes('{');                   // reject JSON blobs

    if (isSafeMsg) return serverMsg;

    // Quota-specific hint
    if (serverMsg.includes('quota') || serverMsg.includes('RESOURCE_EXHAUSTED') || serverMsg.includes('429')) {
      return 'The AI service is temporarily unavailable (quota limit reached). Please try again later.';
    }

    return 'A server error occurred. Please try again in a moment.';
  }

  // Network error (no response from server at all)
  if (!err?.response) return 'Unable to reach the server. Check your connection and try again.';

  return fallback;
}
