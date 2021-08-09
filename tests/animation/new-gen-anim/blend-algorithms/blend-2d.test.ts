import { Vec2 } from "../../../../cocos/core";
import { sampleFreeformDirectional, sampleSimpleDirectional } from "../../../../cocos/core/animation/newgen-anim/blend-2d";
import '../../../utils/matchers/to-be-close-to-array';

describe('Simple directional 2D', () => {
    function calcSimpleDirectional (samples: readonly Vec2[], input: Vec2) {
        const weights = new Array(samples.length).fill(0);
        sampleSimpleDirectional(weights, samples, input);
        return weights;
    }

    test('Zero or one sample', () => {
        expect(() => calcSimpleDirectional([], new Vec2(3.14, 6.18))).not.toThrow();
        
        expect(calcSimpleDirectional([new Vec2(-12.3, 45.6)], new Vec2(78.9, 3.14))).toBeCloseToArray([1.0]);
    });
    
    test('Input at zero point', () => {
        expect(calcSimpleDirectional([
            new Vec2(-1.0, 0.0),
            new Vec2(+1.0, 0.0),
            new Vec2(0.0, -1.0),
            new Vec2(0.0, +1.0),
        ], new Vec2())).toBeCloseToArray([
            0.25,
            0.25,
            0.25,
            0.25,
        ]);

        expect(calcSimpleDirectional([
            new Vec2(-1.0, 0.0),
            new Vec2(+1.0, 0.0),
            new Vec2(0.0, -1.0),
            new Vec2(0.0, +1.0),
        ], new Vec2(0.5, 0.0))).toBeCloseToArray([
            0.125,
            0.625,
            0.125,
            0.125,
        ]);
    });

    test('Input at same direction', () => {
        expect(calcSimpleDirectional([
            new Vec2(1.0, 0.0),
            new Vec2(0.7, 0.7),
            new Vec2(0.0, 1.0),
        ], new Vec2(0.3, 0.3))).toBeCloseToArray([
            0.0,
            1.0,
            0.0,
        ]);
    });

    test('Same direction should occupy the same weight', () => {
        const weights = new Array(2).fill(0);
        sampleSimpleDirectional(weights, [
            new Vec2(0.3, 0.3),
            new Vec2(0.7, 0.7),
        ], new Vec2());
        expect(weights).toBeCloseToArray([
            0.5,
            0.5,
        ]);
    });
});