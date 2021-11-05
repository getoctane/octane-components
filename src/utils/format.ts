import numeral from 'numeral';

const CURRENCY_FORMAT_SM = '$0,0.(00)';

const CURRENCY_FORMAT_MD = '$0,0';

const CURRENCY_FORMAT_LG = '($0,0.(00)a)';

const CURRENCY_FORMAT_LG_FLOOR = 999999;
const CURRENCY_FORMAT_MD_FLOOR = 9999;

export const formatCurrency = (val: number, isCents = true): string => {
  const value = isCents ? val / 100 : val;
  const asNumeral = numeral(value);

  let format;
  if (value > CURRENCY_FORMAT_LG_FLOOR) {
    format = CURRENCY_FORMAT_LG;
  } else if (value > CURRENCY_FORMAT_MD_FLOOR) {
    format = CURRENCY_FORMAT_MD;
  } else {
    format = CURRENCY_FORMAT_SM;
  }

  return asNumeral.format(format);
};

export const formatPercentage = (
  value: number,
  isDecimalPercent = false
): string => {
  return numeral(isDecimalPercent ? value : value / 100).format('0%');
};

export const formatNumber = (value: number): string => {
  return numeral(value).format('0,0[.]00');
};

export const formatLargeNumber = (value: number): string => {
  return numeral(value).format('0,0a[.]00');
};
