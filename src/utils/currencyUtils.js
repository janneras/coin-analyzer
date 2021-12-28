const currency = 'EUR';
const style = 'currency';
const locale = 'fi-FI';
const numberFormat = new Intl.NumberFormat(locale, { style, currency });

/**
 * Formats price values to readable currency.
 * @param {Number} value Price to format
 * @returns Formatted price with currency symbol attached.
 */
export const formatCurrency = (value) => {
  return numberFormat.format(value);
};
