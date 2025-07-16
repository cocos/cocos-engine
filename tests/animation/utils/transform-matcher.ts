import matchers from 'expect/build/matchers';
import '../../utils/matchers/value-type-asymmetric-matchers';
import { Transform } from '../../../cocos/animation/core/transform';

expect.extend({
    toEqualTransform(actual: unknown, expected: Readonly<Transform>, numDigits = 5) {
        return matchers.toStrictEqual.call(
            this,
            actual,
            expect.objectContaining({
                position: expect.toBeCloseToVec3(expected.position, numDigits),
                rotation: expect.toBeCloseToQuat(expected.rotation, numDigits),
                scale: expect.toBeCloseToVec3(expected.scale, numDigits),
            }),
        );
    },
});

export { };

declare global {
    namespace jest {
        interface Matchers<R> {
            toEqualTransform: (expected: Readonly<Transform>, numDigits?: number) => CustomMatcherResult;
        }
    }
}