import { Quat, Vec3 } from "../../../exports/base";
import matchers from 'expect/build/matchers';

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

expect.extend({
    toBeCloseToVec3(actual: unknown, expected: Readonly<Vec3>, numDigits = 5) {
        return matchers.toStrictEqual.call(
            this,
            actual,
            expect.objectContaining({
                x: expect.toBeAround(expected.x, numDigits),
                y: expect.toBeAround(expected.y, numDigits),
                z: expect.toBeAround(expected.z, numDigits),
            }),
        );
    },
    toBeCloseToQuat(actual: unknown, expected: Readonly<Quat>, numDigits = 5) {
        return matchers.toStrictEqual.call(
            this,
            actual,
            expect.objectContaining({
                x: expect.toBeAround(expected.x, numDigits),
                y: expect.toBeAround(expected.y, numDigits),
                z: expect.toBeAround(expected.z, numDigits),
                w: expect.toBeAround(expected.w, numDigits),
            }),
        );
    },
});

declare global {
    namespace jest {
        interface Expect {
            toBeAround(expected: number, numDigits?: number): any;
            toBeCloseToVec3(expected: Readonly<Vec3>, numDigits?: number): any;
            toBeCloseToQuat(expected: Readonly<Quat>, numDigits?: number): any;
        }

        interface Matchers<R> {
            toBeCloseToVec3: (expected: Readonly<Vec3>, numDigits?: number) => CustomMatcherResult;
            toBeCloseToQuat: (expected: Readonly<Quat>, numDigits?: number) => CustomMatcherResult;
        }
    }
}