module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(test).ts?(x)'],
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/example/'],
};
