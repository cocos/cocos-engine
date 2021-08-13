
import { Quat, QuatCurve, QuatInterpolationMode } from '../../cocos/core';
import { EasingMethod } from '../../cocos/core/curves/curve';
import { serializeAndDeserialize } from './serialize-and-deserialize-curve';

describe('Curve', () => {
    test('Evaluate an empty curve', () => {
        const curve = new QuatCurve();
        expect(curve.evaluate(12.34)).toStrictEqual(Quat.IDENTITY);
    });

    describe('serialization', () => {
        test('Normal', () => {
            const curve = new QuatCurve();
            curve.assignSorted([0.1, 0.2, 0.3, 0.4, 0.5], [
                { value: { x: 0.1, y: 0.2, z: 0.3, w: 0.4 }, interpolationMode: QuatInterpolationMode.CONSTANT },
                { value: { x: 0.5, y: -0.6, z: 0.48, w: 0.8 }, interpolationMode: QuatInterpolationMode.SLERP, easingMethod: [0.299935, 0.555, -0.5, 0.997] },
                { value: { x: 0.5, y: -0.6, z: 0.7, w: 0.8 }, interpolationMode: QuatInterpolationMode.SLERP, easingMethod: EasingMethod.SINE_IN_OUT },
                { value: { x: 0.5, y: -0.6, z: 0.7, w: 0.8 }, interpolationMode: QuatInterpolationMode.SLERP, easingMethod: [0.1, 0.3, -0.5, 0.7] },
                { value: { x: 0.9, y: 0.1, z: 0.11, w: 0.12 }, interpolationMode: QuatInterpolationMode.CONSTANT, easingMethod: EasingMethod.QUINT_IN },
            ]);
            compareCurves(serializeAndDeserialize(curve, QuatCurve), curve);
        });

        test('Optimized for linear curve', () => {
            const curve = new QuatCurve();
            curve.assignSorted([0.1, 0.2], [
                { value: { x: 0.1, y: 0.2, z: 0.3, w: 0.4 }, interpolationMode: QuatInterpolationMode.SLERP },
                { value: { x: 0.5, y: -0.6, z: 0.7, w: 0.8 }, interpolationMode: QuatInterpolationMode.SLERP },
            ]);
            compareCurves(serializeAndDeserialize(curve, QuatCurve), curve);
        });

        test('Optimized for constant curve', () => {
            const curve = new QuatCurve();
            curve.assignSorted([0.1, 0.2], [
                { value: { x: 0.1, y: 0.2, z: 0.3, w: 0.4 }, interpolationMode: QuatInterpolationMode.CONSTANT },
                { value: { x: 0.5, y: -0.6, z: 0.7, w: 0.8 }, interpolationMode: QuatInterpolationMode.CONSTANT },
            ]);
            compareCurves(serializeAndDeserialize(curve, QuatCurve), curve);
        });
    });

    test('Default keyframe value', () => {
        const curve = new QuatCurve();
        const keyframeValue = curve.getKeyframeValue(curve.addKeyFrame(0.0, {}));
        expect(Quat.equals(keyframeValue.value, Quat.IDENTITY)).toBe(true);
        expect(keyframeValue.interpolationMode).toBe(QuatInterpolationMode.SLERP);
    });
});

function compareCurves (left: QuatCurve, right: QuatCurve, numDigits = 2) {
    expect(left.keyFramesCount).toBe(right.keyFramesCount);
    for (let iKeyframe = 0; iKeyframe < left.keyFramesCount; ++iKeyframe) {
        expect(left.getKeyframeTime(iKeyframe)).toBeCloseTo(right.getKeyframeTime(iKeyframe), numDigits);
        const leftKeyframeValue = left.getKeyframeValue(iKeyframe);
        const rightKeyframeValue = right.getKeyframeValue(iKeyframe);
        expect(leftKeyframeValue.value.x).toBeCloseTo(rightKeyframeValue.value.x, numDigits);
        expect(leftKeyframeValue.value.y).toBeCloseTo(rightKeyframeValue.value.y, numDigits);
        expect(leftKeyframeValue.value.z).toBeCloseTo(rightKeyframeValue.value.z, numDigits);
        expect(leftKeyframeValue.value.w).toBeCloseTo(rightKeyframeValue.value.w, numDigits);
        expect(leftKeyframeValue.interpolationMode).toStrictEqual(rightKeyframeValue.interpolationMode);
        if (!Array.isArray(leftKeyframeValue)) {
            expect(leftKeyframeValue.easingMethod).toStrictEqual(rightKeyframeValue.easingMethod);
        } else {
            expect(leftKeyframeValue.easingMethod[0]).toBeCloseTo((rightKeyframeValue.easingMethod as number[])[0], numDigits);
            expect(leftKeyframeValue.easingMethod[1]).toBeCloseTo((rightKeyframeValue.easingMethod as number[])[1], numDigits);
            expect(leftKeyframeValue.easingMethod[2]).toBeCloseTo((rightKeyframeValue.easingMethod as number[])[2], numDigits);
            expect(leftKeyframeValue.easingMethod[3]).toBeCloseTo((rightKeyframeValue.easingMethod as number[])[3], numDigits);
        }
    }
}