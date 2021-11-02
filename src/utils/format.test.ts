import { formatCurrency } from 'utils/format';

describe('formatCurrency', () => {
  it('should format a number as cents', () => {
    expect(formatCurrency(1002)).toEqual('$10.02');
    expect(formatCurrency(12002)).toEqual('$120.02');
    expect(formatCurrency(123002)).toEqual('$1,230.02');

    // Round the cents for medium-sized quantities
    expect(formatCurrency(1234002)).toEqual('$12,340');
    expect(formatCurrency(12345092)).toEqual('$123,451');

    // Use abbreviations for large-sized quantities
    expect(formatCurrency(123456002)).toEqual('$1.23m');
    expect(formatCurrency(1234567002)).toEqual('$12.35m');
  });
});
