import { lerp, Quat, Vec3 } from '../../../cocos/core';
import { ExoticAnimation } from '../../../cocos/core/animation/exotic-animation/exotic-animation';
import { Binder, RuntimeBinding, TrackBinding } from '../../../cocos/core/animation/tracks/track';
import { degreesToRadians } from '../../../cocos/core/utils/misc';
import '../../utils/matcher-deep-close-to';

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

        test.each([
            ['FromToSame/Just', { from: 0.2, to: 0.2, expected: {
                times: [0.0],
                values: [
                    4, 5, 6,
                ],
            }}],
            ['FromToSame/Interval', { from: 0.23, to: 0.23, expected: {
                times: [0.0],
                values: [
                    ...[4, 5, 6].map((x) => x + 3 * 0.3),
                ],
            }}],
            ['FromToSame/Underflow', { from: 0.05, to: 0.05, expected: {
                times: [0.0],
                values: [
                    1, 2, 3,
                ],
            }}],
            ['FromToSame/Overflow', { from: 0.5, to: 0.5, expected: {
                times: [0.0],
                values: [
                    10, 11, 12,
                ],
            }}],
            ['BothEndFallOntoKeyframe', { from: 0.2, to: 0.3, expected: {
                times: [0.0, 0.1],
                values: [
                    4, 5, 6,
                    7, 8, 9,
                ],
            }}],
            ['BothEndFallInSameInterval', { from: 0.26, to: 0.27, expected: {
                times: [0.0, 0.01],
                values: [
                    ...[4, 5, 6].map((x) => x + 3 * 0.6),
                    ...[4, 5, 6].map((x) => x + 3 * 0.7),
                ],
            }}],
            ['FromInterval/ToJust', { from: 0.26, to: 0.3, expected: {
                times: [0.0, 0.04],
                values: [
                    ...[4, 5, 6].map((x) => x + 3 * 0.6),
                    ...[7, 8, 9],
                ],
            }}],
        ] as [string, NonEmptySplitCase][])(`%s`, (_, splitCase) => {
            runVec3SplitCase({
                times: TIMES_4,
                values: VALUES_4,
                ...splitCase,
            });
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
    expect(resultTimes).toBeDeepCloseTo(Array.from(new Float32Array(expected.times)), 5);
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
