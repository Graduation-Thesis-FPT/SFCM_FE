export const regexPattern = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  PHONE: /^[0-9]{10,11}$/,
  ONLY_LATIN: /^[A-Za-z0-9]+$/,
  NO_SPACE: /^[^\s-]+$/,
  NO_SPECIAL_CHAR: /^[^`~!@#$%^&*()._{}<>?/;:'"[\]|\\,=+-]+$/,
  CNTRNO: /^[A-Za-z]{4}[0-9]{7}$/,
  TAX_CODE: /^(\d{10}|\d{10}-\d{3})$/
};
