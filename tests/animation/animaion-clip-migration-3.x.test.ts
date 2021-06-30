import { math, RealInterpMode } from "../../cocos/core";
import { AnimationClip, animation, BezierControlPoints, bezierByTime } from "../../cocos/core/animation";
import { timeBezierToTangents } from "../../cocos/core/animation/legacy-clip-data";
import { RealCurve, RealKeyframeValue, TangentWeightMode } from "../../cocos/core/curves/curve";


describe('Animation Clip Migration 3.x', () => {
    test('Numeric curves', () => {
        const clip = new AnimationClip();
        clip.keys = [
            [0.0, 0.2, 0.8],
        ];
        clip.curves = [
            {
                modifiers: ['p'],
                data: {
                    keys: 0,
                    values: [3.14, 6.18, 8.9],
                },
            },
        ]
        clip.syncLegacyData();
        expect(clip.tracksCount).toBe(1);
        const track = clip.getTrack(0) as animation.RealTrack;
        expect(track).toBeInstanceOf(animation.RealTrack);
        const curve = track.channel.curve;
        expect(Array.from(curve.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(curve.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([3.14, 6.18, 8.9], RealInterpMode.LINEAR),
        );
    });

    test('Vec2 curves', () => {
        const clip = new AnimationClip();
        clip.keys = [[0.0, 0.2, 0.8]];
        clip.curves = [{
            modifiers: ['p'],
            data: {
                keys: 0,
                values: [
                    new math.Vec2(1.0, 4.0),
                    new math.Vec2(2.0, 5.0),
                    new math.Vec2(3.0, 6.0),
                ],
            },
        }];
        clip.syncLegacyData();
        expect(clip.tracksCount).toBe(1);
        const track = clip.getTrack(0) as animation.VectorTrack;
        expect(track).toBeInstanceOf(animation.VectorTrack);
        expect(track.componentsCount).toBe(2);
        const [{ curve: x }, { curve: y }] = track.getChannels();
        expect(Array.from(x.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(x.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([1.0, 2.0, 3.0], RealInterpMode.LINEAR),
        );
        expect(Array.from(y.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(y.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([4.0, 5.0, 6.0], RealInterpMode.LINEAR),
        );
        
    });

    test('Vec3 curves', () => {
        const clip = new AnimationClip();
        clip.keys = [[0.0, 0.2, 0.8]];
        clip.curves = [{
            modifiers: ['p'],
            data: {
                keys: 0,
                values: [
                    new math.Vec3(1.0, 4.0, 7.0),
                    new math.Vec3(2.0, 5.0, 8.0),
                    new math.Vec3(3.0, 6.0, 9.0),
                ],
            },
        }];
        clip.syncLegacyData();
        expect(clip.tracksCount).toBe(1);
        const track = clip.getTrack(0) as animation.VectorTrack;
        expect(track).toBeInstanceOf(animation.VectorTrack);
        expect(track.componentsCount).toBe(3);
        const [{ curve: x }, { curve: y }, { curve: z }] = track.getChannels();
        expect(Array.from(x.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(x.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([1.0, 2.0, 3.0], RealInterpMode.LINEAR),
        );
        expect(Array.from(y.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(y.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([4.0, 5.0, 6.0], RealInterpMode.LINEAR),
        );
        expect(Array.from(z.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(z.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([7.0, 8.0, 9.0], RealInterpMode.LINEAR),
        );
    });

    test('Vec4 curves', () => {
        const clip = new AnimationClip();
        clip.keys = [[0.0, 0.2, 0.8]];
        clip.curves = [{
            modifiers: ['p'],
            data: {
                keys: 0,
                values: [
                    new math.Vec4(1.0, 4.0, 7.0, 10.0),
                    new math.Vec4(2.0, 5.0, 8.0, 11.0),
                    new math.Vec4(3.0, 6.0, 9.0, 12.0),
                ],
            },
        }];
        clip.syncLegacyData();
        expect(clip.tracksCount).toBe(1);
        const track = clip.getTrack(0) as animation.VectorTrack;
        expect(track).toBeInstanceOf(animation.VectorTrack);
        expect(track.componentsCount).toBe(4);
        const [{ curve: x }, { curve: y }, { curve: z }, { curve: w }] = track.getChannels();
        expect(Array.from(x.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(x.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([1.0, 2.0, 3.0], RealInterpMode.LINEAR),
        );
        expect(Array.from(y.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(y.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([4.0, 5.0, 6.0], RealInterpMode.LINEAR),
        );
        expect(Array.from(z.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(z.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([7.0, 8.0, 9.0], RealInterpMode.LINEAR),
        );
        expect(Array.from(w.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(w.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([10.0, 11.0, 12.0], RealInterpMode.LINEAR),
        );
    });

    test('Color curves', () => {
        const clip = new AnimationClip();
        clip.keys = [[0.0, 0.2, 0.8]];
        clip.curves = [{
            modifiers: ['p'],
            data: {
                keys: 0,
                values: [
                    new math.Color(10, 40, 70, 100),
                    new math.Color(20, 50, 80, 110),
                    new math.Color(30, 60, 90, 120),
                ],
            },
        }];
        clip.syncLegacyData();
        expect(clip.tracksCount).toBe(1);
        const track = clip.getTrack(0) as animation.ColorTrack;
        expect(track).toBeInstanceOf(animation.ColorTrack);
        const [{ curve: r }, { curve: g }, { curve: b }, { curve: a }] = track.getChannels();
        expect(Array.from(r.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(r.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([10, 20, 30], RealInterpMode.LINEAR),
        );
        expect(Array.from(g.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(g.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([40, 50, 60], RealInterpMode.LINEAR),
        );
        expect(Array.from(b.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(b.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([70, 80, 90], RealInterpMode.LINEAR),
        );
        expect(Array.from(a.times())).toStrictEqual([0.0, 0.2, 0.8]);
        expect(Array.from(a.values())).toStrictEqual(
            createRealKeyframesWithoutTangent([100, 110, 120], RealInterpMode.LINEAR),
        );
    });

    test('Common target: Color', () => {

    });

    test('Common target: Color with components as floats', () => {
        
    });

    test('Time bezier to tangent', () => {
        testTimeBezierCurveConversion({
            // t0: 0.0,
            // t1: 1.0,
            // v0: 0.0,
            // v1: 1.0,
            t0: 0.08333333333333333,
            v0: 3,
            t1: 0.18333333333333332,
            v1: 5,
            bezierPoints: [.04,.94,.53,.63],
        });

        type TimeBezierTestCase = {
            t0: number;
            t1: number;
            v0: number;
            v1: number;
            bezierPoints: BezierControlPoints;
        };

        function testTimeBezierCurveConversion (testCase: TimeBezierTestCase) {
            const [endTangent, endTangentWeight, startTangent, startTangentWeight] = timeBezierToTangents(
                testCase.bezierPoints,
                testCase.t0,
                testCase.v0,
                testCase.t1,
                testCase.v1,
            );
            const curve = new RealCurve();
            curve.assignSorted([
                [testCase.t0, new RealKeyframeValue({
                    value: testCase.v0,
                    endTangent,
                    endTangentWeight,
                    interpMode: RealInterpMode.CUBIC,
                    tangentWeightMode: TangentWeightMode.END,
                })],
                [testCase.t1, new RealKeyframeValue({
                    value: testCase.v1,
                    startTangent,
                    startTangentWeight,
                    interpMode: RealInterpMode.CUBIC,
                    tangentWeightMode: TangentWeightMode.START,
                })],
            ]);

            for (let inputRatio = 0.0; inputRatio <= 1.0; inputRatio += 0.01) {
                const ratio = bezierByTime(testCase.bezierPoints, inputRatio);
                const timeBezierResult = testCase.v0 + (testCase.v1 - testCase.v0) * ratio;
                const inputTime = testCase.t0 + inputRatio * (testCase.t1 - testCase.t0);
                const curveResult = curve.evaluate(inputTime);
                expect(timeBezierResult).toBeCloseTo(curveResult, 2);
            }
        }
    });
});

function createRealKeyframesWithoutTangent (values: number[], interpMode: RealInterpMode): RealKeyframeValue[] {
    return values.map((value) => {
        return new RealKeyframeValue({
            value,
            interpMode,
        });
    });
}