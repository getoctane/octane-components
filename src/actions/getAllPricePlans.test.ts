import { enableFetchMocks } from 'jest-fetch-mock';
import getAllPricePlans from './getAllPricePlans';

enableFetchMocks();
fetchMock.enableMocks();

const mockPricePlans = [
  {
    displayName: 'Test Price Plan',
    name: 'test_price_plan',
    period: 'quarter',
    basePrice: 100,
  },
];

describe('getAllPricePlans', () => {
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
    fetchMock.once(JSON.stringify({ price_plans: mockPricePlans }));

    try {
      await getAllPricePlans('');
    } catch (err) {
      expect(err).toEqual(Error('Token must be provided.'));
    }
  });

  it('should return price plans correctly', async () => {
    fetchMock.once(JSON.stringify({ price_plans: mockPricePlans }));

    const result = await getAllPricePlans('mock token');
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(result).toEqual({ price_plans: mockPricePlans });
  });
});
