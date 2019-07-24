module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  setupFiles: [],
  coverageDirectory: './test/report/',
  globals: {
    CC_DEV: true,
    CC_TEST: true
  }
};