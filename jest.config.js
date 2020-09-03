const { pathsToModuleNameMapper } = require('ts-jest/utils');
const ts = require('typescript');
const ps = require('path');
const tsConfig = ts.readConfigFile(ps.join(__dirname, 'tsconfig.json'), ts.sys.readFile);
if (!tsConfig.config) {
    throw new Error(`Failed to read tsconfig`);
}
const { compilerOptions } = tsConfig.config;
module.exports = {
  testEnvironment: 'jsdom',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `${__dirname}/` } ),
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