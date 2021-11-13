import { getPricePlansUrl, getPricePlans } from 'utils/api';
import fetchMock from 'fetch-mock-jest';
describe('utils/api', () => {
  afterEach(() => {
    fetchMock.resetHistory();
  });
  afterAll(() => {
    fetchMock.restore();
  });

  describe('getPricePlansUrl', () => {
    it('accepts a base URL', () => {
      expect(getPricePlansUrl()).toEqual(
        'https://api.cloud.getoctane.io/price_plans/'
      );
      expect(getPricePlansUrl('https://example.com')).toEqual(
        'https://example.com/price_plans/'
      );
    });
  });

  describe('getPricePlans', () => {
    it('calls the price plan URL with no params', async () => {
      fetchMock.mock('https://api.cloud.getoctane.io/price_plans/', 200);
      await getPricePlans({ token: 'some token' });
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock.lastUrl()).toEqual(
        'https://api.cloud.getoctane.io/price_plans/'
      );
    });

    it('calls the price plan URL with query params', async () => {
      fetchMock.mock(
        'https://api.cloud.getoctane.io/price_plans/?names=hey%2Cyou&tags=live',
        200
      );
      await getPricePlans({
        token: 'some token',
        params: {
          names: 'hey,you',
          tags: 'live',
        },
      });
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock.lastUrl()).toEqual(
        'https://api.cloud.getoctane.io/price_plans/?names=hey%2Cyou&tags=live'
      );
    });
  });
});