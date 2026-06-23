import db from '../models/index.js';
import CurrencyService from '../services/currencyService.js';
import { successResponse } from '../utils/response.js';
import STATUS_CODES from '../config/constants.js';
import { t } from '../utils/translator.js';

export const getProducts = async (request, reply) => {
    try {
        const locale = request.locale;

        // 1. Fetch all products from PostgreSQL (stored in original base currency, e.g., USD)
        const products = await db.Product.findAll({
            raw: true,
        });

        // 2. Read user's preferred currency from the authenticated request
        const preferredCurrency = request.user?.preferred_currency || 'USD';

        // 3. Convert prices dynamically using CurrencyService
        const convertedProducts = await Promise.all(
            products.map(async (product) => {
                const convertedPrice = await CurrencyService.convert(
                    product.price,
                    product.currency,
                    preferredCurrency,
                    locale
                );

                return {
                    ...product,
                    original_price: product.price,       // Keep original for reference
                    original_currency: product.currency, // Keep original for reference
                    price: convertedPrice,               // Override with converted amount
                    currency: preferredCurrency,         // Override with user's preferred currency
                };
            })
        );

        // 4. Return converted response
        return successResponse({
            reply,
            statusCode: STATUS_CODES.OK,
            message: t(locale, 'product.fetch_success'),
            data: convertedProducts,
        });
    } catch (error) {
        request.log.error(`getProducts error: ${error.message}`);
        throw error;
    }
};
