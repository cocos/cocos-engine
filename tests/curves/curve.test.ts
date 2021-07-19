import { toRadian } from '../../cocos/core';
import { RealCurve, RealInterpMode } from '../../cocos/core/curves';
import { EasingMethod, RealKeyframeValue } from '../../cocos/core/curves/curve';
import { ExtrapMode, TangentWeightMode } from '../../cocos/core/curves/real-curve-param';
import { serializeAndDeserialize } from './serialize-and-deserialize-curve';

describe('Curve', () => {
    test('assign sorted', () => {
        const curve = new RealCurve();
        curve.assignSorted([0.1, 0.2, 0.3], [
            realKeyframeWithoutTangent(0.4),
            realKeyframeWithoutTangent(0.5),
            realKeyframeWithoutTangent(0.6),
        ]);

        // Assign empty(keys, values)
        curve.assignSorted([], []);
        expect(curve.keyFramesCount).toBe(0);

        // Assign empty(frames)
        curve.assignSorted([]);
        expect(curve.keyFramesCount).toBe(0);

        // The count of keys and values should be same, if not, the behavior is undefined.
        // In test mode, assertion error would be thrown.
        expect(() => curve.assignSorted([0.1, 0.2], [])).toThrow();

        // Keys should be sorted, if not, the behavior is undefined.
        // In test mode, assertion error would be thrown.
        expect(() => curve.assignSorted(
            [0.2, 0.1],
            [realKeyframeWithoutTangent(0.4), realKeyframeWithoutTangent(0.5)],
        )).toThrow();
        expect(() => curve.assignSorted([
            [0.2, realKeyframeWithoutTangent(0.4)],
            [0.1, realKeyframeWithoutTangent(0.5)],
        ])).toThrow();
    });

    describe('serialization', () => {
        test('Normal', () => {
            const curve = new RealCurve();
            curve.assignSorted([0.1, 0.2, 0.3], [
                new RealKeyframeValue({ value: 0.4, rightTangent: 0.0, leftTangent: 0.0, interpMode: RealInterpMode.CONSTANT }),
                new RealKeyframeValue({ value: 0.5, rightTangent: 0.0, leftTangent: 0.0, interpMode: RealInterpMode.LINEAR }),
                new RealKeyframeValue({
                    value: 0.6,
                    rightTangent: 0.487,
                    rightTangentWeight: 0.2,
                    leftTangent: 0.4598,
                    leftTangentWeight: 0.32,
                    interpMode: RealInterpMode.CUBIC,
                    tangentWeightMode: TangentWeightMode.BOTH,
                    easingMethod: EasingMethod.QUAD_OUT,
                }),
            ]);
            compareCurves(serializeAndDeserialize(curve, RealCurve), curve);
        });

        test('Optimized for linear curve', () => {
            const curve = new RealCurve();
            curve.assignSorted([0.1, 0.2, 0.3], [
                realKeyframeWithoutTangent(0.4),
                realKeyframeWithoutTangent(0.5),
                realKeyframeWithoutTangent(0.6),
            ]);
            compareCurves(serializeAndDeserialize(curve, RealCurve), curve);
        });

        test('Optimized for constant curve', () => {
            const curve = new RealCurve();
            curve.assignSorted([0.1, 0.2, 0.3], [
                realKeyframeWithoutTangent(0.4, RealInterpMode.CONSTANT),
                realKeyframeWithoutTangent(0.5, RealInterpMode.CONSTANT),
                realKeyframeWithoutTangent(0.6, RealInterpMode.CONSTANT),
            ]);
            compareCurves(serializeAndDeserialize(curve, RealCurve), curve);
        });
    });

    test('Default keyframe value', () => {
        const keyframeValue = new RealKeyframeValue({});
        expect(keyframeValue.value).toBe(0.0);
        expect(keyframeValue.interpMode).toBe(RealInterpMode.LINEAR);
        expect(keyframeValue.rightTangent).toBe(0.0);
        expect(keyframeValue.rightTangentWeight).toBe(0.0);
        expect(keyframeValue.leftTangent).toBe(0.0);
        expect(keyframeValue.leftTangentWeight).toBe(0.0);
        expect(keyframeValue.easingMethod).toBe(EasingMethod.LINEAR);
    });

    describe('Evaluation', () => {
        test('Empty curve', () => {
            const curve = new RealCurve();
            expect(curve.evaluate(12.34)).toBe(0.0);
        });

        test('Interpolation mode: constant', () => {
            const curve = new RealCurve();
            curve.assignSorted([
                [0.2, new RealKeyframeValue({ value: 0.7, interpMode: RealInterpMode.CONSTANT, })],
                [0.4, new RealKeyframeValue({ value: 0.8, interpMode: RealInterpMode.LINEAR, })],
            ]);
            expect(curve.evaluate(0.28)).toBe(0.7);
        });

        test('Interpolation mode: linear', () => {
            const curve = new RealCurve();
            curve.assignSorted([
                [0.2, new RealKeyframeValue({ value: 0.7, interpMode: RealInterpMode.LINEAR, })],
                [0.4, new RealKeyframeValue({ value: 0.8, interpMode: RealInterpMode.CONSTANT, })],
            ]);
            expect(curve.evaluate(0.28)).toBeCloseTo(0.74);
        });

        test('Interpolation mode: cubic; Both weights are unused', () => {
            const curve = new RealCurve();
            curve.assignSorted([
                [0.2, new RealKeyframeValue({
                    interpMode: RealInterpMode.CUBIC,
                    tangentWeightMode: TangentWeightMode.NONE,
                    value: 0.7,
                    rightTangent: Math.tan(toRadian(30.0)),
                })],
                [0.4, new RealKeyframeValue({
                    interpMode: RealInterpMode.CUBIC,
                    tangentWeightMode: TangentWeightMode.NONE,
                    value: 0.8,
                    leftTangent: Math.tan(toRadian(30.0)),
                })],
            ]);
            expect(curve.evaluate(0.28)).toBeCloseTo(0.74074, 5);
        });

        test('Interpolation mode: cubic; Start weight is used', () => {
            const curve = new RealCurve();
            curve.assignSorted([
                [0.2, new RealKeyframeValue({
                    interpMode: RealInterpMode.CUBIC,
                    tangentWeightMode: TangentWeightMode.RIGHT,
                    value: 0.7,
                    rightTangent: Math.tan(toRadian(30.0)),
                })],
                [0.4, new RealKeyframeValue({
                    interpMode: RealInterpMode.CUBIC,
                    tangentWeightMode: TangentWeightMode.NONE,
                    value: 0.8,
                    leftTangent: Math.tan(toRadian(30.0)),
                })],
            ]);
            expect(curve.evaluate(0.28)).toBeCloseTo(0.73799, 5);
        });

        test('Interpolation mode: cubic; End weight is used', () => {
            const curve = new RealCurve();
            curve.assignSorted([
                [0.2, new RealKeyframeValue({
                    interpMode: RealInterpMode.CUBIC,
                    tangentWeightMode: TangentWeightMode.NONE,
                    value: 0.7,
                    rightTangent: Math.tan(toRadian(30.0)),
                })],
                [0.4, new RealKeyframeValue({
                    interpMode: RealInterpMode.CUBIC,
                    tangentWeightMode: TangentWeightMode.LEFT,
                    value: 0.8,
                    leftTangent: Math.tan(toRadian(30.0)),
                })],
            ]);
            expect(curve.evaluate(0.28)).toBeCloseTo(0.74229, 5);
        });

        test('Extrap mode: clamp', () => {
            const curve = new RealCurve();
            curve.preExtrap = ExtrapMode.CLAMP;
            curve.postExtrap = ExtrapMode.CLAMP;

            curve.assignSorted([
                [0.2, new RealKeyframeValue({ value: 5.0 })],
            ]);
            // Fall back to clamp
            expect(curve.evaluate(0.05)).toBeCloseTo(5.0);
            expect(curve.evaluate(0.46)).toBeCloseTo(5.0);
        });

        test('Extrap mode: linear', () => {
            const curve = new RealCurve();
            curve.preExtrap = ExtrapMode.LINEAR;
            curve.postExtrap = ExtrapMode.LINEAR;

            curve.assignSorted([
                [0.2, new RealKeyframeValue({ value: 5.0 })],
                [0.3, new RealKeyframeValue({ value: 3.14 })],
            ]);
            expect(curve.evaluate(0.05)).toBeCloseTo(7.79);
            expect(curve.evaluate(-102.4)).toBeCloseTo(1913.36);
            expect(curve.evaluate(0.46)).toBeCloseTo(0.164);

            curve.assignSorted([
                [0.2, new RealKeyframeValue({ value: 5.0 })],
            ]);
            // Fall back to clamp
            expect(curve.evaluate(0.05)).toBeCloseTo(5.0);
            expect(curve.evaluate(0.46)).toBeCloseTo(5.0);
        });

        test('Extrap mode: loop', () => {
            const curve = new RealCurve();
            curve.preExtrap = ExtrapMode.LOOP;
            curve.postExtrap = ExtrapMode.LOOP;

            curve.assignSorted([
                [0.2, new RealKeyframeValue({ value: 5.0 })],
                [0.36, new RealKeyframeValue({ value: 3.14 })],
            ]);
            expect(curve.evaluate(-2.7)).toBeCloseTo(curve.evaluate(0.34));
            expect(curve.evaluate(4.6)).toBeCloseTo(curve.evaluate(0.28));

            curve.assignSorted([
                [0.2, new RealKeyframeValue({ value: 5.0 })],
            ]);
            // Fall back to clamp
            expect(curve.evaluate(0.05)).toBeCloseTo(5.0);
            expect(curve.evaluate(0.46)).toBeCloseTo(5.0);
        });

        test('Extrap mode: ping-pong', () => {
            const curve = new RealCurve();
            curve.preExtrap = ExtrapMode.PING_PONG;
            curve.postExtrap = ExtrapMode.PING_PONG;

            curve.assignSorted([
                [0.2, new RealKeyframeValue({ value: 5.0 })],
                [0.36, new RealKeyframeValue({ value: 3.14 })],
            ]);
            expect(curve.evaluate(-2.7)).toBeCloseTo(curve.evaluate(0.22));
            expect(curve.evaluate(4.6)).toBeCloseTo(curve.evaluate(0.28));
            expect(curve.evaluate(4.77)).toBeCloseTo(curve.evaluate(0.29));

            curve.assignSorted([
                [0.2, new RealKeyframeValue({ value: 5.0 })],
            ]);
            // Fall back to clamp
            expect(curve.evaluate(0.05)).toBeCloseTo(5.0);
            expect(curve.evaluate(0.46)).toBeCloseTo(5.0);
        });
    });
});

function realKeyframeWithoutTangent (value: number, interpMode: RealInterpMode = RealInterpMode.LINEAR): RealKeyframeValue {
    return new RealKeyframeValue({
        value,
        interpMode,
    });
}

function compareCurves (left: RealCurve, right: RealCurve, numDigits = 2) {
    expect(left.keyFramesCount).toBe(right.keyFramesCount);
    for (let iKeyframe = 0; iKeyframe < left.keyFramesCount; ++iKeyframe) {
        expect(left.getKeyframeTime(iKeyframe)).toBeCloseTo(right.getKeyframeTime(iKeyframe), numDigits);
        const leftKeyframeValue = left.getKeyframeValue(iKeyframe);
        const rightKeyframeValue = right.getKeyframeValue(iKeyframe);
        expect(leftKeyframeValue.value).toBeCloseTo(rightKeyframeValue.value, numDigits);
        expect(leftKeyframeValue.rightTangent).toBeCloseTo(rightKeyframeValue.rightTangent, numDigits);
        expect(leftKeyframeValue.rightTangentWeight).toBeCloseTo(rightKeyframeValue.rightTangentWeight, numDigits);
        expect(leftKeyframeValue.leftTangent).toBeCloseTo(rightKeyframeValue.leftTangent, numDigits);
        expect(leftKeyframeValue.leftTangentWeight).toBeCloseTo(rightKeyframeValue.leftTangentWeight, numDigits);
        expect(leftKeyframeValue.interpMode).toStrictEqual(rightKeyframeValue.interpMode);
        expect(leftKeyframeValue.easingMethod).toStrictEqual(rightKeyframeValue.easingMethod);
    }
}