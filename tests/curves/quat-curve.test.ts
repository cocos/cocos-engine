
import { Quat, QuatCurve, QuatInterpolationMode } from '../../cocos/core';
import { serializeAndDeserialize } from './serialize-and-deserialize-curve';

describe('Curve', () => {
    test('Evaluate an empty curve', () => {
        const curve = new QuatCurve();
        expect(curve.evaluate(12.34)).toStrictEqual(Quat.IDENTITY);
    });

    describe('serialization', () => {
        test('Normal', () => {
            const curve = new QuatCurve();
            curve.assignSorted([0.1, 0.2, 0.3], [
                { value: { x: 0.1, y: 0.2, z: 0.3, w: 0.4 }, interpolationMode: QuatInterpolationMode.CONSTANT },
                { value: { x: 0.5, y: -0.6, z: 0.7, w: 0.8 }, interpolationMode: QuatInterpolationMode.SLERP },
                { value: { x: 0.9, y: 0.1, z: 0.11, w: 0.12 }, interpolationMode: QuatInterpolationMode.CONSTANT },
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
    }
}