
export interface TestSuiteConfig {
    constantOverrides?: Record<string, boolean>;
}

declare global {
    namespace __cc_test__ {
        let currentTestSuiteConfig: TestSuiteConfig;
    }
}

export function getCurrentTestSuiteConfig() {
    return __cc_test__.currentTestSuiteConfig;
}
