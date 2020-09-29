module.exports = {
  testEnvironment: 'jsdom',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  setupFiles: [
    './tests/init.ts'
  ],
  coverageDirectory: './test/report/',
  globals: {
    CC_DEV: true,
    CC_TEST: true,
    CC_PHYSICS_BUILTIN: true,
  }
};