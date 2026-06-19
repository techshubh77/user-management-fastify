import fp from 'fastify-plugin';

const SUPPORTED_LANGUAGES = ['en', 'hi'];

const DEFAULT_LANGUAGE = 'en';

async function languageDetectorPlugin(fastify, _options) {

  // 'preHandler' = runs AFTER parsing body/params but BEFORE the route handler.
  //   - onRequest runs even earlier (before body is parsed).
  //   - preHandler is the right time: request is fully ready, controller hasn't run yet.
  //   - This matches exactly what the reference project's localeMiddleware does.
  fastify.addHook('preHandler', async (request, _reply) => {
    //
    // We check THREE places in order of priority:
    //
    // 1. URL query param: ?locale=hi
    //    Example: POST /api/v1/auth/login?locale=hi
    //    WHY check this first? Easy to test. A developer can test in browser/Postman
    //    just by adding ?locale=hi to any URL. No special headers needed.
    //
    // 2. HTTP header: Accept-Language: hi
    //    This is the INDUSTRY STANDARD way browsers tell servers the user's language.
    //    Example: Accept-Language: hi-IN (we'll handle the '-IN' part below)
    //    WHY check this second? It's the proper, automatic way. A browser sets this
    //    automatically based on the user's OS language settings.
    //
    // 3. Default: 'en'
    //    If neither of the above provided a language, use English.

    const rawLocale =
      request.query.locale || // Check ?locale= query param first
      request.headers['accept-language'] || // Then check the Accept-Language header
      DEFAULT_LANGUAGE; // If neither, use 'en'

    // ── CLEAN AND VALIDATE THE LOCALE ────────────────────────────────────────
    //
    // Problem: Browsers send 'Accept-Language' like "hi-IN,hi;q=0.9,en;q=0.8"
    // We only want the first part: "hi"
    //
    // .split(',')[0]  → takes only the first language (ignores the priority list)
    // .split('-')[0]  → takes only the base code: "hi-IN" → "hi"
    // .toLowerCase()  → normalizes to lowercase: "EN" or "En" → "en"
    // .trim()         → removes accidental spaces
    //
    // WHY all these steps? Because real-world HTTP headers are messy.
    // We need a clean, consistent value to look up in SUPPORTED_LANGUAGES.
    // ─────────────────────────────────────────────────────────────────────────
    const cleanedLocale = rawLocale.split(',')[0].split('-')[0].toLowerCase().trim();

    //
    // Only allow languages we actually have translations for.
    // If someone sends ?locale=fr or Accept-Language: de, we fall back to English.
    //
    // WHY whitelist? Security + correctness.
    //   - Without this, your translator.js would get an unknown locale,
    //     fall back to English anyway, but it's messy.
    //   - With this, we handle it cleanly right here at the entry point.
    //
    // SUPPORTED_LANGUAGES.includes(cleanedLocale)
    //   → true if cleanedLocale is 'en' or 'hi'
    //   → false for anything else
    request.locale = SUPPORTED_LANGUAGES.includes(cleanedLocale)
      ? cleanedLocale // ✅ Supported language → use it
      : DEFAULT_LANGUAGE; // ❌ Unknown language → fall back to English
  });
}

// Export the plugin WRAPPED in fp (fastify-plugin).
//
// WHY wrap with fp?
// Without fp:  request.locale is only available inside this plugin's scope.
// With fp:     request.locale is available EVERYWHERE in the app.
//              (controllers, services, error handlers — all of them)
//
// This is the single most important thing about this file.
// Forget fp → nothing works. Add fp → everything works.
export default fp(languageDetectorPlugin);
