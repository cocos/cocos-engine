import { EasingMethod, RealCurve, RealInterpolationMode, RealKeyframeValue, TangentWeightMode } from "../../cocos/core/curves/curve";

export function createRealKeyframeValueLike (value: Partial<RealKeyframeValue>): RealKeyframeValue {
    const curve = new RealCurve();
    // return {
    //     interpolationMode: RealInterpolationMode.LINEAR,
    //     tangentWeightMode: TangentWeightMode.NONE,
    //     value: 0.0,
    //     leftTangent: 0.0,
    //     leftTangentWeight: 0.0,
    //     rightTangent: 0.0,
    //     rightTangentWeight: 0.0,
    //     easingMethod: EasingMethod.LINEAR,
    //     ...value,
    // };
    return curve.getKeyframeValue(curve.addKeyFrame(0.0, value));
}

export function createMultipleRealKeyframesWithoutTangent (values: number[], interpolationMode: RealInterpolationMode): RealKeyframeValue[] {
    return values.map((value) => {
        return createRealKeyframeValueLike({
            value,
            interpolationMode,
        });
    });
}
