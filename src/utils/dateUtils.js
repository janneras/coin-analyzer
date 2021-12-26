/**
 * Browser compatible way of getting date object from a string.
 * @param {String} inputString String formatted yyyy-mm-dd used by <input type="date" />.
 * @param {Number} offsetYear Must be integer. Default 0, Offset year by certain amount. Negative numbers decrease, positivite numbers increase.
 * @param {Number} offsetMonth Must be integer. Default 0, Offset mounth by certain amount. Negative numbers decrease, positivite numbers increase.
 * @param {Number} offsetDate Must be integer. Default 0, Offset date by certain amount. Negative numbers decrease, positivite numbers increase.
 * @returns {Object} Date-object with only year, month and day set rest of date values are 0.
 */
export const inputDateToDate = (
  inputString,
  offsetYear = 0,
  offsetMonth = 0,
  offsetDate = 0
) => {
  let date = new Date();
  date.setUTCHours(0, 0, 0, 0);

  if (!inputString) return date;
  const dateParts = inputString.split('-');
  if (dateParts.length < 2) return date;

  date.setUTCFullYear(
    Number(dateParts[0]) + offsetYear,
    Number(dateParts[1]) - 1 + offsetMonth,
    Number(dateParts[2]) + offsetDate
  );

  return date;
};
