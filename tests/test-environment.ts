import JSDOMEnvironment from 'jest-environment-jsdom';
import fs from 'fs-extra';
import type { TestSuiteConfig } from './utils/test-suite-config';

class Environment extends JSDOMEnvironment {
    constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
        super(...args);

        const [_, context] = args;
        this._testPath = context.testPath;

        this.global.__cc_test__ = {
            currentTestSuiteConfig: {},
        };
        this._readTestSuiteConfig();
    }

    async setup(...args: Parameters<JSDOMEnvironment['setup']>) {
        await super.setup(...args);
    }

    private _testPath: string;

    private _readTestSuiteConfig() {
        const configPath = `${this._testPath}.config.json`;
        if (!fs.pathExistsSync(configPath)) {
            return;
        }
        const config = fs.readJsonSync(configPath) as TestSuiteConfig;
        this.global.__cc_test__ = {
            currentTestSuiteConfig: config,
        };
    }
}

export default Environment;