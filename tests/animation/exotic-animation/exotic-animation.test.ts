import { lerp, Quat, Vec3 } from '../../../cocos/core';
import { ExoticAnimation } from '../../../cocos/animation/exotic-animation/exotic-animation';
import { Binder, RuntimeBinding, TrackBinding } from '../../../cocos/animation/tracks/track';
import { degreesToRadians } from '../../../cocos/core/utils/misc';
import '../../utils/matcher-deep-close-to';
import '../../utils/matchers/value-type-asymmetric-matchers';

describe(`Split`, () => {
    describe(`Vec3 split`, () => {
        const vec3SplitEmpty: Vec3SplitCases = {
            from: 0.0,
            to: 0.0,
            times: [],
            values: [],
            expected: {
                times: [],
                values: [],
            },
        };
        
        test.each([
            ['Empty', vec3SplitEmpty],
        ] as [string, Vec3SplitCases][])(`%s`, (_, splitCase) => {
            runVec3SplitCase(splitCase);
        });

        interface NonEmptySplitCase {
            from: number;
            to: number;
            expected: {
                times: number[];
                values: number[];
            };
        }

        const TIMES_4 = [0.1, 0.2, 0.3, 0.4];
        const VALUES_4 = [
            1, 2, 3,
            4, 5, 6,
            7, 8, 9,
            10, 11, 12,
        ];

        describe(`From and to is same`, () => {
            test.each([
                ['Just', { from: TIMES_4[1], to: TIMES_4[1], expected: {
                    times: [TIMES_4[1]],
                    values: [...VALUES_4.slice(1 * 3, (1 + 1) * 3)],
                }}],
                ['Interval', { from: 0.23, to: 0.23, expected: {
                    times: [0.23],
                    values: [
                        ...[4, 5, 6].map((x) => x + 3 * 0.3),
                    ],
                }}],
                ['Underflow', { from: TIMES_4[0] - 1.0, to: TIMES_4[0] - 1.0, expected: {
                    times: [TIMES_4[0]],
                    values: [...VALUES_4.slice(0 * 3, (0 + 1) * 3)],
                }}],
                ['Overflow', { from: TIMES_4[0] + 1.0, to: TIMES_4[0] + 1.0, expected: {
                    times: [TIMES_4[TIMES_4.length - 1]],
                    values: [...VALUES_4.slice(VALUES_4.length - 3)],
                }}],
            ] as [string, NonEmptySplitCase][])(`%s`, (_, splitCase) => {
                runVec3SplitCase({
                    times: TIMES_4,
                    values: VALUES_4,
                    ...splitCase,
                });
            });
        });

        describe(`From and to is not same`, () => {
            test.each([
                ['Both underflow', { from: TIMES_4[0] - 0.2, to: TIMES_4[0] - 0.1, expected: {
                    times: [TIMES_4[0]],
                    values: [...VALUES_4.slice(0, 3)],
                }}],

                ['Both overflow', { from: TIMES_4[TIMES_4.length - 1] + 0.1, to: TIMES_4[TIMES_4.length - 1] + 0.2, expected: {
                    times: [TIMES_4[TIMES_4.length - 1]],
                    values: [...VALUES_4.slice(VALUES_4.length - 3)],
                }}],

                ['From underflow/To overflow', { from: TIMES_4[0] - 0.1, to: TIMES_4[TIMES_4.length - 1] + 0.2, expected: {
                    times: TIMES_4,
                    values: VALUES_4,
                }}],
                
                ['BothEndFallInSameInterval', { from: 0.26, to: 0.27, expected: {
                    times: [0.26, 0.27],
                    values: [
                        ...[4, 5, 6].map((x) => x + 3 * 0.6),
                        ...[4, 5, 6].map((x) => x + 3 * 0.7),
                    ],
                }}],
            ] as [string, NonEmptySplitCase][])(`%s`, (_, splitCase) => {
                runVec3SplitCase({
                    times: TIMES_4,
                    values: VALUES_4,
                    ...splitCase,
                });
            });

            test.each([
                [true, false],
                [false, true],
                [true, true],
                [false, false],
            ])(`From sit just at key: (**%s**) | To sit just at key: (**%s**)`, (fromJust, toJust) => {
                const nKeyframes = 8;
                const TIMES = Array.from({ length: nKeyframes }).map((_, index) => index + 0.3);
                const VALUES = TIMES.flatMap((t, i) => [t + 0.1, t + 0.2, t + 0.3]);

                const fromTimeIndex = 1;
                for (const toTimeIndex of [
                    fromTimeIndex + 1,
                    fromTimeIndex + 2,
                    nKeyframes - 1,
                ]) {
                    if (toTimeIndex === nKeyframes - 1 && !toJust) {
                        // Skip this impossible case.
                        continue;
                    }
                    const fromTimeRatio = fromJust ? 0.0 : 0.6;
                    const toTimeRatio = toJust ? 0.0 : 0.3;
                    
                    const inputFromTime = fromJust
                        ? TIMES[fromTimeIndex]
                        : lerp(TIMES[fromTimeIndex], TIMES[fromTimeIndex + 1], fromTimeRatio);
                    const inputToTime = toJust
                        ? TIMES[toTimeIndex]
                        : lerp(TIMES[toTimeIndex], TIMES[toTimeIndex + 1], toTimeRatio);

                    const expectedHeadInterval = fromJust ? -1 : fromTimeIndex;
                    const expectedCompleteStart = fromJust ? fromTimeIndex : fromTimeIndex + 1;
                    const expectedCompleteEnd = toTimeIndex + 1;
                    const expectedTailInterval = toJust ? -1 : toTimeIndex;

                    const expectedTimes: number[] = [];
                    const expectedValues: number[] = [];

                    if (expectedHeadInterval >= 0) {
                        expectedTimes.push(lerp(TIMES[expectedHeadInterval], TIMES[expectedHeadInterval + 1], fromTimeRatio));
                        expectedValues.push(...Array.from({ length: 3 }, (_, i) => {
                            return lerp(
                                VALUES[expectedHeadInterval * 3 + i],
                                VALUES[(expectedHeadInterval + 1) * 3 + i],
                                fromTimeRatio,
                            );
                        }));
                    }

                    expectedTimes.push(...TIMES.slice(expectedCompleteStart, expectedCompleteEnd));
                    expectedValues.push(...VALUES.slice(expectedCompleteStart * 3, expectedCompleteEnd * 3));

                    if (expectedTailInterval >= 0) {
                        expectedTimes.push(lerp(TIMES[expectedTailInterval], TIMES[expectedTailInterval + 1], toTimeRatio));
                        expectedValues.push(...Array.from({ length: 3 }, (_, i) => {
                            return lerp(
                                VALUES[expectedTailInterval * 3 + i],
                                VALUES[(expectedTailInterval + 1) * 3 + i],
                                toTimeRatio,
                            );
                        }));
                    }

                    runVec3SplitCase({
                        times: TIMES,
                        values: VALUES,
                        from: inputFromTime,
                        to: inputToTime,
                        expected: {
                            times: expectedTimes,
                            values: expectedValues,
                        },
                    });
                }
            });
        });
    });

    test(`Bugfix cocos/3d-tasks#16074`, () => {
        const times = [0.9833333492279053, 1, 1.9833333492279053, 2, 2.9833333492279053, 3, 3.9833333492279053, 4];
        const values = [1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1];
        runVec3SplitCase({
            times,
            values,
            from: 0.0,
            to: times[times.length - 1],
            expected: {
                times,
                values,
            },
        });
    });
});

describe(`Evaluation`, () => {
    test(`Empty`, () => {
        const node = runEvaluationTest({
            evaluationTime: 0.1,
            position: {
                times: [],
                values: [],
                initial: new Vec3(0.3, 0.4, 0.5),
            },
            rotation: {
                times: [],
                values: [],
                initial: new Quat(0.3, 0.4, 0.5, 0.6),
            },
            scale: {
                times: [],
                values: [],
                initial: new Vec3(0.3, 0.4, 0.5),
            },
        });

        expectVec3CloseTo(node.position, Vec3.ZERO);
        expectQuatCloseTo(node.rotation, Quat.IDENTITY);
        expectVec3CloseTo(node.scale, Vec3.ZERO);
    });

    const quatX30 = Quat.rotateX(new Quat(), Quat.IDENTITY, degreesToRadians(30.0));
    const quatX60 = Quat.rotateX(new Quat(), Quat.IDENTITY, degreesToRadians(60.0));
    const quatX153 = Quat.rotateX(new Quat(), Quat.IDENTITY, degreesToRadians(153.0));

    const TIME_LIST_3 = [0.2, 0.3, 0.6];
    const VEC3_LIST_3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
    ];
    const QUAT_LIST_3 = [
        quatX30.x, quatX30.y, quatX30.z, quatX30.w,
        quatX60.x, quatX60.y, quatX60.z, quatX60.w,
        quatX153.x, quatX153.y, quatX153.z, quatX153.w,
    ];

    test(`Just`, () => {
        const node = runEvaluationTest({
            evaluationTime: 0.3,
            position: {
                times: TIME_LIST_3,
                values: VEC3_LIST_3,
            },
            rotation: {
                times: TIME_LIST_3,
                values: QUAT_LIST_3,
            },
            scale: {
                times: TIME_LIST_3,
                values: VEC3_LIST_3,
            },
        });
        expectVec3CloseTo(node.position, new Vec3(4, 5, 6));
        expectQuatCloseTo(node.rotation, quatX60);
        expectVec3CloseTo(node.scale, new Vec3(4, 5, 6));
    });

    test(`Interpolation`, () => {
        const node = runEvaluationTest({
            evaluationTime: 0.5,
            position: {
                times: TIME_LIST_3,
                values: VEC3_LIST_3,
            },
            rotation: {
                times: TIME_LIST_3,
                values: QUAT_LIST_3,
            },
            scale: {
                times: TIME_LIST_3,
                values: VEC3_LIST_3,
            },
        });
        const ratio = (0.5 - 0.3) / (0.6 - 0.3);
        expectVec3CloseTo(node.position, new Vec3(
            ...([[4, 7], [5, 8], [6, 9]] as const).map(([prev, next]) => lerp(prev, next, ratio)),
        ));
        const rotationResult = Quat.slerp(new Quat(), quatX60, quatX153, ratio);
        expectQuatCloseTo(node.rotation, rotationResult);
        expectVec3CloseTo(node.scale, new Vec3(
            ...([[4, 7], [5, 8], [6, 9]] as const).map(([prev, next]) => lerp(prev, next, ratio)),
        ));
    })
});

interface Vec3SplitCases {
    times: number[];
    values: number[];
    from: number;
    to: number;
    expected: {
        times: number[];
        values: number[];
    };
}

function runVec3SplitCase ({ times, values, from, to, expected }: Vec3SplitCases) {
    const animation = new ExoticAnimation();
    const nodeAnimation = animation.addNodeAnimation('foo');
    nodeAnimation.createPosition(
        new Float32Array(times),
        new Float32Array(values),
    );
    const resultAnimation = animation.split(from, to);
    // @ts-expect-error
    const resultNodeAnimation = resultAnimation._nodeAnimations[0];
    // @ts-expect-error
    const resultPosition = resultNodeAnimation._position;
    const resultTimes = Array.from(resultPosition.times);
    // @ts-expect-error
    const resultValuesInternal = resultPosition.values._values;
    const resultValues = Array.from(resultValuesInternal as Float32Array);
    expect(resultTimes.map((t) => t + from)).toBeDeepCloseTo(Array.from(new Float32Array(expected.times)), 5);
    expect(resultValues).toBeDeepCloseTo(Array.from(new Float32Array(expected.values)), 5);
}

class DummyNode {
    constructor (public path = '') {

    }

    public position = new Vec3();
    public rotation = new Quat();
    public scale = new Vec3();

    public createBinder (): Binder {
        return (binding: TrackBinding): RuntimeBinding => {
            expect(binding.path.length).toBe(2);
            expect(binding.path.isHierarchyAt(0));
            expect(binding.path.parseHierarchyAt(0)).toBe(this.path);
            expect(binding.path.isPropertyAt(1));
            const property = binding.path.parsePropertyAt(1);
            expect(['position', 'rotation', 'scale']).toContain(property);
            expect(binding.proxy).toBeUndefined();
            return {
                getValue: () => this[property],
                setValue: (value) => {
                    const p = this[property];
                    switch (property) {
                        case 'position':
                        case 'scale':
                            Vec3.copy(p as Vec3, value as Vec3);
                            break;
                        case 'rotation':
                        default:
                            Quat.copy(p as Quat, value as Quat);
                            break;
                    }
                },
            };
        };
    }
}

function runEvaluationTest ({
    evaluationTime,
    position,
    rotation,
    scale,
}: {
    evaluationTime: number;
    position?: {
        times: number[];
        values: number[];
        initial?: Vec3;
    };
    rotation?: {
        times: number[];
        values: number[];
        initial?: Quat;
    };
    scale?: {
        times: number[];
        values: number[];
        initial?: Vec3;
    };
}) {
    const node = new DummyNode();
    const animation = new ExoticAnimation();
    const nodeAnimation = animation.addNodeAnimation(node.path);
    if (position) {
        if (position.initial) {
            Vec3.copy(node.position, position.initial);
        }
        nodeAnimation.createPosition(
            new Float32Array(position.times),
            new Float32Array(position.values),
        );
    }
    if (rotation) {
        if (rotation.initial) {
            Vec3.copy(node.rotation, rotation.initial);
        }
        nodeAnimation.createRotation(
            new Float32Array(rotation.times),
            new Float32Array(rotation.values),
        );
    }
    if (scale) {
        if (scale.initial) {
            Vec3.copy(node.scale, scale.initial);
        }
        nodeAnimation.createScale(
            new Float32Array(scale.times),
            new Float32Array(scale.values),
        );
    }
    const evaluator = animation.createEvaluator(node.createBinder());
    evaluator.evaluate(evaluationTime);
    return node;
}

function expectVec3CloseTo (input: Readonly<Vec3>, expected: Readonly<Vec3>) {
    expect(input.x).toBeCloseTo(expected.x);
    expect(input.y).toBeCloseTo(expected.y);
    expect(input.z).toBeCloseTo(expected.z);
}

function expectQuatCloseTo (input: Readonly<Quat>, expected: Readonly<Quat>) {
    expect(input.x).toBeCloseTo(expected.x);
    expect(input.y).toBeCloseTo(expected.y);
    expect(input.z).toBeCloseTo(expected.z);
    expect(input.w).toBeCloseTo(expected.w);
}
