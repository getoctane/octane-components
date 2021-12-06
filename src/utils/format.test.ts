import { formatCurrency } from 'utils/format';

describe('formatCurrency', () => {
  it('should format a number as cents', () => {
    // Small currencies get displayed honestly
    expect(formatCurrency(1002)).toEqual('$10.02');
    expect(formatCurrency(12002)).toEqual('$120.02');
    expect(formatCurrency(123002)).toEqual('$1,230.02');

    // Decimal cents up to 10 digits (i.e. 12 digits in dollars) should work.
    expect(formatCurrency(1232.003)).toEqual('$12.32003');
    expect(formatCurrency(1232.0000000003)).toEqual('$12.320000000003');

    // Round the cents for medium-sized quantities
    expect(formatCurrency(1234002)).toEqual('$12,340');
    expect(formatCurrency(12345092)).toEqual('$123,451');

    // Use abbreviations for large-sized quantities
    expect(formatCurrency(123456002)).toEqual('$1.23m');
    expect(formatCurrency(1234567002)).toEqual('$12.35m');
  });
});
