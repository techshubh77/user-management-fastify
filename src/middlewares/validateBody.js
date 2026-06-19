import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';

import STATUS_CODES from '../config/constants.js';
import AppError from '../utils/appError.js';
import { t } from '../utils/translator.js';

const ajv = new Ajv({ allErrors: true, coerceTypes: false });
ajvErrors(ajv);
ajvFormats(ajv);

// HELPER: Translate a single AJV error into a human-readable string
// @param {object} ajvError  - one error object from validate.errors array
// @param {string} locale    - 'en' or 'hi'
// @returns {string}         - translated message
function translateAjvError(originalError, locale) {
  // ajv-errors wraps the real error. We need to unwrap it to see the actual keyword.
  const ajvError =
    originalError.keyword === 'errorMessage' && originalError.params?.errors?.length > 0
      ? originalError.params.errors[0]
      : originalError;

  // Get the field name from the error.
  // instancePath looks like '/email' or '/password' — we strip the leading '/'
  // missingProperty is used for 'required' errors (field is completely absent from body)
  // WHY || here? For 'required' errors, instancePath is '' (empty), so we fall back to missingProperty
  const rawField = ajvError.instancePath.replace('/', '') || ajvError.params?.missingProperty || '';

  // Translate the field name itself.
  // Our validation.json has a "fields" section: { "email": "Email", "password": "Password" }
  // In Hindi: { "email": "ईमेल", "password": "पासवर्ड" }
  // t() returns the Hindi/English field name, or the raw key if not found (safe fallback)
  const fieldName =
    t(locale, `validation.fields.${rawField}`) !== `validation.fields.${rawField}`
      ? t(locale, `validation.fields.${rawField}`) // ✅ Found in our JSON → use translated name
      : rawField; // ❌ Not in JSON → use raw name as-is

  // ── MAP AJV KEYWORD TO OUR TRANSLATION KEY ──────────────────────────────
  // Each AJV error has a 'keyword' that tells us which validation rule failed.
  // We match that to a key in our validation.json.
  // ─────────────────────────────────────────────────────────────────────────
  switch (ajvError.keyword) {
    case 'required':
      // "required" = field is completely missing from the request body
      // replacements: { field: 'Email' } → "The Email field is required."
      return t(locale, 'validation.any_required', { field: fieldName });

    case 'minLength':
      // "minLength" = value is too short
      // ajvError.params.limit = the minimum number (e.g. 8 for password)
      // replacements: { field: 'Password', min: 8 } → "Password must be at least 8 characters."
      return t(locale, 'validation.string_min', { field: fieldName, min: ajvError.params.limit });

    case 'maxLength':
      // "maxLength" = value is too long
      return t(locale, 'validation.string_max', { field: fieldName, max: ajvError.params.limit });

    case 'format':
      // "format" = value doesn't match a format (like 'email', 'date', etc.)
      // We only handle 'email' format specially — others fall through to default
      if (ajvError.params.format === 'email') {
        return t(locale, 'validation.string_email'); // No field name needed — email error is self-explanatory
      }
      // For other format errors, fall through to default
      return ajvError.message;

    case 'pattern':
      // "pattern" = value doesn't match a regex pattern
      return t(locale, 'validation.string_pattern_base', { field: fieldName });

    case 'type':
      // "type" = wrong data type sent (e.g. number instead of string)
      // We don't have a specific key for this — use AJV's own message as fallback
      // This is fine: type errors are rare and usually developer mistakes, not user mistakes
      return originalError.message;

    case 'additionalProperties':
      return t(locale, 'validation.object_unknown');

    default:
      // For any other AJV error we haven't mapped, use AJV's own English message.
      // WHY? Better to show something than crash. We can always add more cases later.
      return originalError.message;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// validateBody — Validates request.body against a JSON Schema
// ─────────────────────────────────────────────────────────────────────────────
export const validateBody = (schema) => {
  // ajv.compile() happens ONCE per schema at startup (not per request).
  // Returns a validate function we reuse for every request.
  const validate = ajv.compile(schema);

  return async (request, _reply) => {
    const valid = validate(request.body);

    if (!valid) {
      // request.locale was set by languageDetectorPlugin (Phase 2)
      // By the time we reach preHandler, locale is always available.
      const locale = request.locale;

      // Map each AJV error to a translated message using our helper above
      const errors = validate.errors.map((e) => ({
        // Field name: strip leading '/' from instancePath OR use missingProperty for 'required' errors
        field: e.instancePath.replace('/', '') || e.params?.missingProperty,
        // Translated message — replaces AJV's raw English output
        message: translateAjvError(e, locale),
      }));

      // "Validation failed" heading — also translated now
      // t(locale, 'validation.failed') → "Validation failed." (en) or "सत्यापन विफल।" (hi)
      throw new AppError(t(locale, 'validation.failed'), STATUS_CODES.UNPROCESSABLE_ENTITY, {
        errors,
      });
    }
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// validateParams — same pattern as validateBody but reads from request.params
// (used for URL parameters like /verify-email/:token)
// ─────────────────────────────────────────────────────────────────────────────
export const validateParams = (schema) => {
  const validate = ajv.compile(schema);

  return async (request, _reply) => {
    const valid = validate(request.params);
    
    if (!valid) {
      const locale = request.locale;

      const errors = validate.errors.map((e) => ({
        field: e.instancePath.replace('/', '') || e.params?.missingProperty,
        message: translateAjvError(e, locale),
      }));

      throw new AppError(t(locale, 'validation.failed'), STATUS_CODES.UNPROCESSABLE_ENTITY, {
        errors,
      });
    }
  };
};
