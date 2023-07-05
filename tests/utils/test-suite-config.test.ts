import { getCurrentTestSuiteConfig, TestSuiteConfig } from "./test-suite-config";

test(`Test suite config`, () => {
    expect(getCurrentTestSuiteConfig()).toEqual<TestSuiteConfig>({
        constantOverrides: {
            SUPPORT_JIT: true,
            BUILD: true,
        },
    });
});