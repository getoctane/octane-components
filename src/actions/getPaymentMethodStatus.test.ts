import { enableFetchMocks } from 'jest-fetch-mock';
import getPaymentMethodStatus from './getPaymentMethodStatus';

enableFetchMocks();
fetchMock.enableMocks();

const paymentStatus = {
  status: 'mock status',
};

describe('getPaymentMethodStatus', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error');
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error if token is not provided', async () => {
    fetchMock.once(JSON.stringify({ status: paymentStatus }));

    try {
      await getPaymentMethodStatus('');
    } catch (err) {
      expect(err).toEqual(Error('Token must be provided.'));
    }
  });

  it('should return payment status correctly', async () => {
    fetchMock.once(JSON.stringify(paymentStatus));

    const result = await getPaymentMethodStatus('mock token');
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(result).toEqual(paymentStatus);
  });
});
