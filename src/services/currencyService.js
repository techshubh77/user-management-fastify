import config from '../config/env.js';
import logger from '../config/logger.js';
import redis from '../config/redis.js';
import AppError from '../utils/appError.js';
import STATUS_CODES from '../config/constants.js';
import { t } from '../utils/translator.js';
const REDIS_KEY = 'currency:rates';
const EXTERNAL_API_URL = `https://v6.exchangerate-api.com/v6/${config.currency_api_key}/latest/USD`;

class CurrencyService {
  /**
   * Fetch exchange rates from the external API directly (Fallback strategy)
   */
  static async fetchAndCacheRates(locale = 'en') {
    logger.info('CurrencyService: Fetching rates from external API due to Redis miss/failure.');
    try {
      const response = await fetch(EXTERNAL_API_URL);
      if (!response.ok) {
        throw new AppError(t(locale, 'currency.external_api_failed'), STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
      const data = await response.json();
      console.log("data", JSON.stringify(data))
      const cacheData = {
        base: data.base_code || data.base || 'USD',
        updatedAt: new Date().toISOString(),
        rates: {
          ...data.conversion_rates, // ExchangeRate-API uses 'conversion_rates'
          ...data.rates,            // Just in case it uses 'rates'
          USD: 1,
        },
      };

      await redis.set(REDIS_KEY, JSON.stringify(cacheData));
      return cacheData.rates;
    } catch (error) {
      logger.error(`CurrencyService fallback fetch failed: ${error.message}`);
      if (error instanceof AppError) throw error;
      throw new AppError(t(locale, 'currency.fetch_failed'), STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get rates from Redis or fallback to external API
   */
  static async getRates(locale = 'en') {
    try {
      const cached = await redis.get(REDIS_KEY);
      console.log("cahched: ",JSON.stringify(cached))
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.rates) {
          return parsed.rates;
        }
      }
    } catch (error) {
      logger.error(`Redis read failed for exchange rates: ${error.message}`);
      // Continue to fallback
    }

    // Fallback: Redis is empty or threw an error
    return await this.fetchAndCacheRates(locale);
  }

  /**
   * Convert amount from one currency to another
   */
  static async convert(amount, fromCurrency, toCurrency, locale = 'en') {
    if (fromCurrency === toCurrency) {
      return Number(amount);
    }

    const rates = await this.getRates(locale);

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (!fromRate || !toRate) {
      const missingCurrency = !fromRate ? fromCurrency : toCurrency;
      throw new AppError(
        t(locale, 'currency.rate_not_found', { currency: missingCurrency }),
        STATUS_CODES.BAD_REQUEST
      );
    }   

    // Convert from 'fromCurrency' to 'USD' (base), then from 'USD' to 'toCurrency'
    const amountInBase = amount / fromRate;
    const convertedAmount = amountInBase * toRate;

    // Round to 2 decimal places for standard currency representation
    return Math.round(convertedAmount * 100) / 100;
  }
}

export default CurrencyService;
