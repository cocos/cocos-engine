import { Vec2 } from "../../../../cocos/core";
import { sampleFreeformDirectional, blendSimpleDirectional } from "../../../../cocos/core/animation/marionette/blend-2d";
import '../../../utils/matcher-deep-close-to';

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