import config from "../config/env.js";
import logger from "../config/logger.js";
import redis from "../config/redis.js";

const FETCH_INTERVAL_MS = 60 * 60 * 1000;
const REDIS_KEY = "currency:rates"
const EXTERNAL_API_URL = `https://v6.exchangerate-api.com/v6/${config.currency_api_key}/latest/USD`

const fetchExchangeRates = async () => {
    try {
        logger.info('Fetching latest exchange rates from external API...');
        const response = await fetch(EXTERNAL_API_URL);

        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data", data)
        const cacheData = {
            base: data.base,
            updatedAt: new Date().toISOString(),
            rates: {
                ...data.conversion_rates,
                USD: 1, // Ensure base currency is always 1
            },
        };
        await redis.set(REDIS_KEY, JSON.stringify(cacheData));
        logger.info('Successfully updated exchange rates in Redis.');

    } catch (error) {
        logger.error(`Failed to fetch exchange rates: ${error.message}`);
    }
};
export const startCurrencyCron = () => {
    fetchExchangeRates();
    setInterval(fetchExchangeRates, FETCH_INTERVAL_MS);
    logger.info('Currency fetch cron job started.');
};
