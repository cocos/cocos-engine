export { };

// https://stackoverflow.com/a/53464807
expect.extend({
    toBeAround(actual: number, expected: number, numDigits = 5) {
        const pass = Math.abs(expected - actual) < Math.pow(10, -numDigits) / 2;
        if (pass) {
            return {
                message: () => `expected ${actual} not to be around ${expected}`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${actual} to be around ${expected}`,
                pass: false,
            }
        }
    },
});

declare global {
    namespace jest {
        interface Expect {
            toBeAround(expected: number, numDigits?: number): any;
        }
    }
}