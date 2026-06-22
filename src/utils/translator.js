import enMessages from '../locales/en/messages.json' with { type: 'json' };
import enValidation from '../locales/en/validation.json' with { type: 'json' };
import hiMessages from '../locales/hi/messages.json' with { type: 'json' };
import hiValidation from '../locales/hi/validation.json' with { type: 'json' };
import guMessages from '../locales/gu/messages.json' with { type: 'json' };
import guValidation from '../locales/gu/validation.json' with { type: 'json' };

// Build the master dictionary
//
// We merge messages + validation into ONE object per language.
// WHY? So the t() function only needs to look in ONE place.
//
// The spread "...enMessages" copies all keys from enMessages into this object.
// "validation: enValidation" puts the validation file under a "validation" key.
//
// RESULT for English:
// en = {
//   validation: { failed: "...", "any.required": "...", fields: {...} },
//   auth: { login_success: "...", ... },
//   general: { route_not_found: "...", ... }
// }
const en = { validation: enValidation, ...enMessages };
const hi = { validation: hiValidation, ...hiMessages };
const gu = { validation: guValidation, ...guMessages };

const messages = { en, hi, gu };

// THE MAIN FUNCTION: t(locale, path, replacements)
//
// @param locale       - 'en' or 'hi' — which language to use
// @param path         - dot-separated key like 'auth.login_success'
// @param replacements - object of placeholders like { url: '/dashboard' }
//
// WHY export? Because every other file (services, controllers, errorHandler)
// will import and use this function.
export function t(locale = 'en', path, replacements = {}) {
  // Pick the correct language dictionary.
  // If the locale is unknown (e.g. 'fr'), fall back to English.
  // WHY fallback to English? So the app never crashes — always returns SOMETHING.
  const dict = messages[locale] || messages.en;

  // Navigate the nested object using the dot-separated path.
  // Example: path = 'auth.login_success'
  // keys = ['auth', 'login_success']
  const keys = path.split('.');

  // Start at the root of the dictionary, then go deeper with each key
  let value = dict;

  for (const key of keys) {
    // At each step, check if the current level has this key
    if (value && typeof value === 'object' && key in value) {
      value = value[key]; // Go one level deeper
    } else {
      // Key not found — return the path itself as a fallback
      // WHY return the path? So you can see in the UI exactly which key is missing.
      // Much better than showing "undefined" or crashing.
      return path;
    }
  }

  // After navigating all keys, value should be a string
  // If it's not a string (e.g. we landed on an object), return the path as fallback
  if (typeof value !== 'string') return path;

  // Apply any replacements like :url → actual URL
  // WHY a helper function? To keep t() clean and readable.
  return applyReplacements(value, replacements);
}

// HELPER: Replace placeholders in a string
//
// Example:
//   str = "The route :url was not found."
//   replacements = { url: '/dashboard' }
//   result = "The route /dashboard was not found."
//
// WHY Object.entries? It gives us [key, value] pairs from the replacements object.
// WHY reduce? It applies all replacements one by one, starting from the original string.
// WHY replaceAll? Because the same placeholder might appear multiple times.
function applyReplacements(str, replacements) {
  return Object.entries(replacements).reduce(
    (msg, [key, value]) => msg.replaceAll(`:${key}`, value),
    str
  );
}
