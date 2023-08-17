import { approx, clamp01, lerp, toRadian, v2, Vec2 } from "../../../../cocos/core";
import { blendSimpleDirectional, PolarSpaceGradientBandInterpolator2D } from "../../../../cocos/animation/marionette/motion/blend-2d";
import '../../../utils/matcher-deep-close-to';
import '../../../utils/matchers/value-type-asymmetric-matchers';

const EXPECT_NUM_DIGITS = 5;

describe('Simple directional 2D', () => {
    function calcSimpleDirectional (samples: readonly Vec2[], input: Vec2) {
        const weights = new Array(samples.length).fill(0);
        blendSimpleDirectional(weights, samples, input);
        return weights;
    }

    test('Zero or one sample', () => {
        expect(() => calcSimpleDirectional([], new Vec2(3.14, 6.18))).not.toThrow();
        
        expect(calcSimpleDirectional([new Vec2(-12.3, 45.6)], new Vec2(78.9, 3.14))).toBeDeepCloseTo([1.0], EXPECT_NUM_DIGITS);
    });
    
    test('Input direction is zero', () => {
        // If there is also zero sample, that sample owns all weights.
        expect(calcSimpleDirectional([
            new Vec2(-0.3, 0.4),
            new Vec2(+1.0, 0.2),
            new Vec2(0.0, 0.0),
            new Vec2(0.0, -1.0),
            new Vec2(0.0, +1.0),
        ], Vec2.ZERO)).toBeDeepCloseTo([
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
        ], EXPECT_NUM_DIGITS);

        // Otherwise, weights are averaged for all samples.
        expect(calcSimpleDirectional([
            new Vec2(-0.3, 0.4),
            new Vec2(+1.0, 0.2),
            new Vec2(0.0, -1.0),
            new Vec2(0.0, +1.0),
        ], Vec2.ZERO)).toBeDeepCloseTo([
            0.25,
            0.25,
            0.25,
            0.25,
        ], EXPECT_NUM_DIGITS);
    });

    test('Input within a sector', () => {
        // Points can be visualized at: https://www.desmos.com/calculator/rapuusa3g1

        const calcEdgeLinePoint = (from: Vec2, to: Vec2, ratio: number) => {
            return Vec2.scaleAndAdd(
                new Vec2(),
                from,
                Vec2.subtract(new Vec2(), to, from),
                ratio,
            );
        };

        const sampleTriangleVertexA = new Vec2(0.2, 0.7);
        const sampleTriangleVertexB = new Vec2(0.3, 0.4);
        const sampleOutOfSector1 = new Vec2(0.0576,0.583);
        const sampleOutOfSector2 = new Vec2(0.243,-0.22);
        const inputInsideTriangle = new Vec2(0.15, 0.4);
        const inputOnEdgeABRatio = 0.34;
        const inputOnEdgeAB = calcEdgeLinePoint(sampleTriangleVertexA, sampleTriangleVertexB, inputOnEdgeABRatio);
        const inputOnEdgeCARatio = 0.711;
        const inputOnEdgeCA = calcEdgeLinePoint(Vec2.ZERO, sampleTriangleVertexA, inputOnEdgeCARatio);
        const inputOnEdgeCAExtended = calcEdgeLinePoint(Vec2.ZERO, sampleTriangleVertexA, 1.3);
        const inputOnEdgeCBExtended = calcEdgeLinePoint(Vec2.ZERO, sampleTriangleVertexB, -0.4);
        const inputInsideSectorOutSideTriangle = new Vec2(0.2765,0.682);

        const samples = [
            sampleTriangleVertexA,
            sampleTriangleVertexB,
            sampleOutOfSector1,
            sampleOutOfSector2,
        ];

        const samplesWithCentralSample = [
            ...samples,
            Vec2.ZERO,
        ];

        const weightsOfSample = ({
            sampleTriangleVertexA = 0.0,
            sampleTriangleVertexB = 0.0,
            sampleOutOfSector1 = 0.0,
            sampleOutOfSector2 = 0.0,
        }: Partial<Record<
            | 'sampleTriangleVertexA'
            | 'sampleTriangleVertexB'
            | 'sampleOutOfSector1'
            | 'sampleOutOfSector2'
        , number>>) => {
            return [
                sampleTriangleVertexA,
                sampleTriangleVertexB,
                sampleOutOfSector1,
                sampleOutOfSector2,
            ];
        };

        const weightsOfSampleWithCentralSample = ({ sampleCentral = 0.0, ...other }: Parameters<typeof weightsOfSample>[0] & {
            sampleCentral?: number;
        }) => {
            return [
                ...weightsOfSample(other),
                sampleCentral,
            ];
        };

        // Outside any sector.
        expect(calcSimpleDirectional([
            sampleTriangleVertexA,
            sampleTriangleVertexB,
        ], new Vec2(0.4, 0.4))).toBeDeepCloseTo([
            0.5,
            0.5,
        ], EXPECT_NUM_DIGITS);

        // Inside triangle, without central sample
        // central weight are averaged to all
        expect(calcSimpleDirectional(samples, inputInsideTriangle)).toBeDeepCloseTo(weightsOfSample({
            sampleTriangleVertexA: 0.46154 + 0.34615 / samples.length,
            sampleTriangleVertexB: 0.19231 + 0.34615 / samples.length,
            sampleOutOfSector1: 0.34615 / samples.length,
            sampleOutOfSector2: 0.34615 / samples.length,
        }), EXPECT_NUM_DIGITS);

        // Inside triangle, with central sample
        expect(calcSimpleDirectional(samplesWithCentralSample, inputInsideTriangle)).toBeDeepCloseTo(weightsOfSampleWithCentralSample({
            sampleTriangleVertexA: 0.46154,
            sampleTriangleVertexB: 0.19231,
            sampleCentral: 0.34615,
        }), EXPECT_NUM_DIGITS);

        // Fall at vertex
        expect(calcSimpleDirectional(samples, sampleTriangleVertexA)).toBeDeepCloseTo(weightsOfSample({
            sampleTriangleVertexA: 1.0,
        }), EXPECT_NUM_DIGITS);

        // Fall at edge(between center vertex and vertex A), without central sample
        expect(calcSimpleDirectional(samples, inputOnEdgeCA)).toBeDeepCloseTo(weightsOfSample({
            sampleTriangleVertexA: inputOnEdgeCARatio + (1.0 - inputOnEdgeCARatio) / samples.length,
            sampleTriangleVertexB: (1.0 - inputOnEdgeCARatio) / samples.length,
            sampleOutOfSector1: (1.0 - inputOnEdgeCARatio) / samples.length,
            sampleOutOfSector2: (1.0 - inputOnEdgeCARatio) / samples.length,
        }), EXPECT_NUM_DIGITS);

        // Fall at edge(between center vertex and vertex A), with central sample
        expect(calcSimpleDirectional(samplesWithCentralSample, inputOnEdgeCA)).toBeDeepCloseTo(weightsOfSampleWithCentralSample({
            sampleCentral: 1.0 - inputOnEdgeCARatio,
            sampleTriangleVertexA: inputOnEdgeCARatio,
        }), EXPECT_NUM_DIGITS);

        // Fall on edge(between vertex A, B)
        expect(calcSimpleDirectional(samples, inputOnEdgeAB)).toBeDeepCloseTo(weightsOfSample({
            sampleTriangleVertexA: (1.0 - inputOnEdgeABRatio),
            sampleTriangleVertexB: inputOnEdgeABRatio,
        }), EXPECT_NUM_DIGITS);

        // Fall on line(C -> A) but not edge(C -> A), beyond A.
        // CentBarycentric coordinates are normalized.
        expect(calcSimpleDirectional(samples, inputOnEdgeCAExtended)).toBeDeepCloseTo(weightsOfSample({
            sampleTriangleVertexA: 1.0,
        }), EXPECT_NUM_DIGITS);

        // Fall on line(C -> B) but not edge(C -> B), not beyond C, without central sample.
        // Only central point got weight, but there is no central sample. So averaged to every sample.
        expect(calcSimpleDirectional(samples, inputOnEdgeCBExtended)).toBeDeepCloseTo(weightsOfSample({
            sampleTriangleVertexA: 1.0 / samples.length,
            sampleTriangleVertexB: 1.0 / samples.length,
            sampleOutOfSector1: 1.0 / samples.length,
            sampleOutOfSector2: 1.0 / samples.length,
        }), EXPECT_NUM_DIGITS);

        // Fall on line(C -> B) but not edge(C -> B), not beyond C, with central sample.
        // Only central point got weight, 
        expect(calcSimpleDirectional(samplesWithCentralSample, inputOnEdgeCBExtended)).toBeDeepCloseTo(weightsOfSampleWithCentralSample({
            sampleCentral: 1.0,
        }), EXPECT_NUM_DIGITS);

        // Inside sector, but outside triangle.
        // Similar with "fall on line" case: centBarycentric coordinates are normalized.
        expect(calcSimpleDirectional(samples, inputInsideSectorOutSideTriangle)).toBeDeepCloseTo(weightsOfSample({
            sampleTriangleVertexA: 0.6219,
            sampleTriangleVertexB: 0.3781,
        }), EXPECT_NUM_DIGITS);
    });
});

describe(`Polar space gradient brand interpolation`, () => {
    test(`No example`, () => {
        runInPlace(Vec2.ZERO, []);
        runInPlace(v2(1., 2.), []);
    });

    test(`Single example`, () => {
        /**
         * ### Spec
         * 
         * If there is only one example, that example is used with full weight regardless of the input.
         */
        const _SPEC = undefined;

        runInPlace(Vec2.ZERO, [[Vec2.ZERO, 1.0]]);
        runInPlace(Vec2.ZERO, [[v2(1., 2.), 1.0]]);
        runInPlace(v2(1., -2.), [[Vec2.ZERO, 1.0]]);
        runInPlace(v2(1., -2.), [[v2(3., 4.), 1.0]]);
    });

    test.todo(`Two examples`);

    describe(`Zero vector input`, () => {
        /**
         * ### Spec
         * 
         * If the input is zero vector, then:
         * - if there is an example at origin, that motion has full weight.
         * - otherwise, all motion has even weight.
         */
        const _SPEC = undefined;

        test(`Having example at origin`, () => {
            runInPlace(Vec2.ZERO, [
                [v2(1.0, 0.0), 0.0],
                [v2(0.0, 0.0), 1.0],
                [v2(-1.0, 0.0), 0.0],
                [v2(0.0, 1.0), 0.0],
                [v2(0.0, -1.0), 0.0],
            ]);
        });

        test(`No example at origin`, () => {
            runInPlace(Vec2.ZERO, [
                [v2(1.0, 0.0), 0.25],
                [v2(-1.0, 0.0), 0.25],
                [v2(0.0, 1.0), 0.25],
                [v2(0.0, -1.0), 0.25],
            ]);
        });
    });

    describe(`Algorithm`, () => {
        describe(`There is and is only one example along the input's direction`, () => {
            test(`The adjacent examples have different mag`, () => {
                const fixture = {
                    input_dir: 30.,
                    example_magnitude: 0.8,
                    ccw: { mag: 0.8, dir: 30. + 160. },
                    cw: { mag: 0.8 * 0.8, dir: 30. + 200. },
                };
    
                const examples = {
                    origin: polar(0.0, 0.0),
                    the_dir: polar(fixture.example_magnitude, fixture.input_dir),
                    cw: polar(fixture.cw.mag, fixture.cw.dir),
                    ccw: polar(fixture.ccw.mag, fixture.ccw.dir),
                } as const;

                expect(groupByMagnitude(
                    (mag) => sampleNamed(examples, polar(mag, fixture.input_dir)),
                    [fixture.example_magnitude / 3., 'Input at 1/3 mag'],
                    [fixture.example_magnitude, 'Input at the example'],
                    [fixture.example_magnitude * 1.1, 'Input beyond the example'],
                )).toMatchSnapshot();
            });
    
            test(`The adjacent examples have same mag`, () => {
                const fixture = {
                    input_dir: 30.,
                    example_magnitude: 0.8,
                };
    
                const examples = {
                    origin: polar(0.0, 0.0),
                    the_dir: polar(fixture.example_magnitude, fixture.input_dir),
                    _1: polar(fixture.example_magnitude, fixture.input_dir + 160.),
                    _2: polar(fixture.example_magnitude, fixture.input_dir + 200.),
                } as const;

                expect(groupByMagnitude(
                    (mag) => sampleNamed(examples, polar(mag, fixture.input_dir)),
                    [fixture.example_magnitude / 3., 'Input at 1/3 mag'],
                    [fixture.example_magnitude, 'Input at the example'],
                    [fixture.example_magnitude * 5., 'Input beyond the example'],
                )).toMatchSnapshot();
            });
    
            test(`the adjacent examples have different mag, the direction is on axis`, () => {
                const fixture = {
                    input_dir: 0.0,
                    example_magnitude: 0.8,
                    ccw_adjacent_magnitude: 0.8,
                    cw_adjacent_magnitude: 1.0,
                };
    
                const examples = {
                    origin: polar(0.0, 0.0),
                    the_dir: polar(fixture.example_magnitude, fixture.input_dir),
                    ccw_adjacent: polar(fixture.ccw_adjacent_magnitude, fixture.input_dir + 90.),
                    _2: polar(fixture.example_magnitude, fixture.input_dir + 180.),
                    cw_adjacent: polar(fixture.cw_adjacent_magnitude, fixture.input_dir + 270.),
                } as const;

                expect(groupByMagnitude(
                    (mag) => sampleNamed(examples, polar(mag, fixture.input_dir)),
                    [fixture.example_magnitude / 3., 'Input at 1/3 mag'],
                    [fixture.example_magnitude, 'Input at the example'],
                    [fixture.example_magnitude * 5., 'Input beyond the example'],
                )).toMatchSnapshot();
            });
        });

        test(`There are multiple examples along the input's direction`, () => {
            const fixture = {
                input_dir: 30.,
                mag_1: 0.7,
                mag_2: 1.2,
                ccw: { mag: 0.5, dir: 120.0 },
                cw: { mag: 0.5, dir: -80.0 },
            };

            const examples = {
                origin: polar(0.0, 0.0),
                same_dir_example_1: polar(fixture.mag_1, fixture.input_dir),
                same_dir_example_2: polar(fixture.mag_2, fixture.input_dir),
                ccw: polar(fixture.ccw.mag, fixture.ccw.dir),
                cw: polar(fixture.cw.mag, fixture.cw.dir),
            } as const;

            expect(groupByMagnitude(
                (mag) => sampleNamed(examples, polar(mag, fixture.input_dir)),
                [fixture.mag_1 / 3., 'Input at 1/3 minor mag'],
                [fixture.mag_1, 'Input at minor mag example'],
                [fixture.mag_1 + (fixture.mag_2 - fixture.mag_1) / 3, 'Input between the examples'],
                [fixture.mag_2, 'Input at bigger mag example'],
                [fixture.mag_2 * 1.2, 'Input beyond bigger mag example'],
            )).toMatchSnapshot();
        });

        describe(`The input's direction is between two different direction examples`, () => {
            test(`The examples have same magnitude`, () => {
                const fixture = {
                    cw_ccw_mag: 0.8,
                    ccw_dir: 90.0,
                    ccw_adjacent: { dir: 95.0, mag: 1.0  },
                    cw_dir: 0.0,
                    cw_adjacent: { dir: -20.0, mag: 0.7 },
                    input_dir_1_ratio: clamp01(1. / 3.),
                    input_dir_2_ratio: clamp01(2. / 3.),
                };

                const inputDir1 = (fixture.ccw_dir - fixture.cw_dir) * fixture.input_dir_1_ratio;
                const inputDir2 = (fixture.ccw_dir - fixture.cw_dir) * fixture.input_dir_2_ratio;
    
                const examples = {
                    origin: polar(0.0, 0.0),
                    ccw: polar(fixture.cw_ccw_mag, fixture.ccw_dir),
                    ccw_adjacent: polar(fixture.ccw_adjacent.mag, fixture.ccw_adjacent.dir),
                    cw: polar(fixture.cw_ccw_mag, fixture.cw_dir),
                    cw_adjacent: polar(fixture.cw_adjacent.mag, fixture.cw_adjacent.dir),
                    _1: polar(0.65, 180.0),
                    _2: polar(1.0, 270.0),
                } as const;

                expect(groupByMagnitude(
                    (mag) => sampleNamed(examples, polar(mag, inputDir1)),
                    [fixture.cw_ccw_mag / 4., 'Less then the mag.'],
                    [fixture.cw_ccw_mag, 'Input at just the mag'],
                    [fixture.cw_ccw_mag * 1.1, `Greater than the mag`],
                    // This also suggests when the input has magnitude greater than examples', only direction takes effect.
                    [fixture.cw_ccw_mag * 1.25, `Greater than the mag again`],
                )).toMatchSnapshot();

                // Input at just the mag, at dir 2.
                expect(sampleNamed(examples, polar(fixture.cw_ccw_mag, inputDir2))).toMatchInlineSnapshot(`
Object {
  "ccw": 0.6264824128043105,
  "cw": 0.31324120640215525,
  "origin": 0.060276380793534215,
}
`);
            });

            test(`The examples have different magnitude`, () => {
                const fixture = {
                    cw: { mag: 0.8, dir: 90.0 },
                    ccw: { mag: 0.65, dir: 180.0 },
                    input_dir: 120.0,
                };
    
                const examples = {
                    origin: polar(0.0, 0.0),
                    ccw: polar(fixture.ccw.mag, fixture.ccw.dir),
                    cw: polar(fixture.cw.mag, fixture.cw.dir),
                    _1: polar(0.8, 0.0),
                    _2: polar(1.0, 270.0),
                } as const;

                expect(fixture.ccw.mag).toBeLessThan(fixture.cw.mag);

                expect(groupByMagnitude(
                    (mag) => sampleNamed(examples, polar(mag, fixture.input_dir)),
                    [fixture.ccw.mag / 4, 'Less than both magnitudes'],
                    [fixture.ccw.mag, 'Equal to the minor magnitude'],
                    [fixture.ccw.mag + (fixture.cw.mag - fixture.ccw.mag) / 2, 'Equal to the middle magnitude'],
                    [fixture.cw.mag, 'Equal to the bigger magnitude'],
                    [fixture.cw.mag * 1.25, 'Greater than the bigger magnitude'],
                )).toMatchSnapshot();
            });
        });
    });

    test(`There is more than 180° between two adjacent examples points`, () => {
        const fixture = {
            example_1: { mag: 0.5, dir: 40.0 },
            example_2: { mag: 0.5, dir: 90.0 },
            example_3: { mag: 0.5, dir: 130.0 },
        } as const;

        const examples = {
            origin: polar(0., 0.),
            example_1: polar(fixture.example_1.mag, fixture.example_1.dir),
            example_2: polar(fixture.example_2.mag, fixture.example_2.dir),
            example_3: polar(fixture.example_3.mag, fixture.example_3.dir),
        } as const;

        const sampleAtEachMag = (direction: number) => {
            return groupByMagnitude(
                (mag) => sampleNamed(examples, polar(mag, direction)),
                [fixture.example_2.mag * 0.8, 'Shorter magnitude'],
                [fixture.example_2.mag, 'Equal magnitude'],
                [fixture.example_2.mag * 1.2, `Longer magnitude`],
            );
        };

        expect(sampleAtEachMag(50.0)).toMatchSnapshot(`Between 1, 2`);

        expect(sampleAtEachMag(100.0)).toMatchSnapshot(`Between 2, 3`);

        expect(sampleAtEachMag(180.0)).toMatchSnapshot(`In the more-than-180 range, tending to 3`);

        expect(sampleAtEachMag(lerp(fixture.example_3.dir, fixture.example_1.dir, 0.5))).toMatchSnapshot(
            `In the more-than-180 range, in the middle`,
        );

        expect(sampleAtEachMag(180.0)).toMatchSnapshot(`In the more-than-180 range, tending to 1`);
    });

    function runInPlace(input: Readonly<Vec2>, examplePositionAndExpectedWeights: readonly [position: Readonly<Vec2>, expectedWeight: number][]) {
        const examplePositions = examplePositionAndExpectedWeights.map(([position]) => position);
        const expectedWeights = examplePositionAndExpectedWeights.map(([_, weight]) => weight);
        const interpolation = new PolarSpaceGradientBandInterpolator2D(examplePositions);
        const actualWeights = new Array<number>(examplePositions.length);
        interpolation.interpolate(actualWeights, input);
        expect(actualWeights).toMatchObject(expectedWeights.map((w) => expect.toBeAround(w, EXPECT_NUM_DIGITS)));
    }

    function sampleNamed<TExampleName extends string>(
        examples: Readonly<Record<TExampleName, Readonly<Vec2>>>,
        input: Readonly<Vec2>,
    ) {
        return sample2DNamed(
            (weights, examplePositions, input) => {
                const interpolation = new PolarSpaceGradientBandInterpolator2D(examplePositions);
                interpolation.interpolate(weights, input);
            },
            examples,
            input,
        );
    }

    function polar(magnitude: number, thetaDeg: number) {
        const theta = toRadian(thetaDeg);
        return v2(magnitude * Math.cos(theta), magnitude * Math.sin(theta));
    }

    function groupByMagnitude<T>(mapper: (mag: number) => T, ...magnitudes: (number | readonly [mag: number, title: string])[]) {
        return magnitudes.reduce((result, mag) => {
            const k = Array.isArray(mag) ? mag[1] : `Magnitude ${mag}`;
            result[k] = mapper(Array.isArray(mag) ? mag[0] : mag);
            return result;
        }, {} as Record<string, T>);
    }
});

function sample2DNamed<TExampleName extends string>(
    fn: (weights: number[], examplePositions: readonly Readonly<Vec2>[], input: Readonly<Vec2>) => void,
    examples: Readonly<Record<TExampleName, Readonly<Vec2>>>,
    input: Readonly<Vec2>,
) {
    const exampleEntries = Object.entries(examples) as [TExampleName, Readonly<Vec2>][];

    const examplePositions = exampleEntries.map(([_, position]) => position);

    const actualWeights = new Array<number>(examplePositions.length);
    actualWeights.fill(0.0);
    fn(actualWeights, examplePositions, input);

    const actualWeightsNamed = exampleEntries.reduce((result, [name], index) => {
        const actualWeight = actualWeights[index];
        if (approx(actualWeight, 0.0, 1e-5)) {
            return result;
        }
        result[name] = actualWeight;
        return result;
    }, {} as Record<string, number>);

    return actualWeightsNamed;
}