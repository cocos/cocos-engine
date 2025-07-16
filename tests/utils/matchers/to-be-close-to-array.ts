declare global {
    namespace jest {
        interface Matchers<R> {
            toBeCloseToArray<T extends number>(expected: T[]): CustomMatcherResult;
        }
    }
}

expect.extend({
    toBeCloseToArray<T extends number>(received: T, expected: T[], epsilon = 1e-5) {
        if (!Array.isArray(received)) {
            return {
                pass: false,
                message: () => `Expected ${received} to be Array`,
            };
        }
        if (received.length !== expected.length) {
            return {
                pass: false,
                message: () => `Expected ${received} to have length ${expected.length}`,
            };
        }
        return received.every((v: number, i: number) => Math.abs(v - expected[i]) < epsilon) ? ({
            pass: true,
            message: () => `Expected ${received} not to be ${expected}`,
        }) : ({
            pass: false,
            message: () => `Expected ${received} to be ${expected}`,
        });
    },
});

export {};
