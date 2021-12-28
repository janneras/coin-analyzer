const DEFAULT_CURRENCY = 'eur';
const DEFAULT_STYLE = 'currency';
const DEFAULT_LOCALE = 'fi-FI';

/**
 * Formats price values to readable currency.
 * @param {Number} value Price to format
 * @returns Formatted price with currency symbol attached.
 */
export const formatCurrency = (value, currency = DEFAULT_CURRENCY) => {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: DEFAULT_STYLE,
    currency,
  }).format(value);
};
