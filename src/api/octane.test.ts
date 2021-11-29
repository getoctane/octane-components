import { enableFetchMocks } from 'jest-fetch-mock';
import { getPricePlans, getPricePlansUrl } from 'api/octane';
enableFetchMocks();
fetchMock.enableMocks();

describe('utils/api', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('getPricePlansUrl', () => {
    it('accepts a base URL', () => {
      expect(getPricePlansUrl()).toEqual(
        'https://api.cloud.getoctane.io/ecp/price_plans/'
      );
      expect(getPricePlansUrl('https://example.com')).toEqual(
        'https://example.com/ecp/price_plans/'
      );
    });
  });

  describe('getPricePlans', () => {
    it('calls the price plan URL with no params', async () => {
      fetchMock.once(JSON.stringify({ price_plans: ['fake', 'response'] }));
      await getPricePlans({ token: 'some token' });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0]?.[0]).toEqual(
        'https://api.cloud.getoctane.io/ecp/price_plans/'
      );
    });

    it('calls the price plan URL with query params', async () => {
      fetchMock.once(JSON.stringify({ price_plans: ['fake', 'response'] }));
      await getPricePlans({
        token: 'some token',
        params: {
          names: 'hey,you',
          tags: 'live',
        },
      });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0]?.[0]).toEqual(
        'https://api.cloud.getoctane.io/ecp/price_plans/?names=hey%2Cyou&tags=live'
      );
    });
  });
});
