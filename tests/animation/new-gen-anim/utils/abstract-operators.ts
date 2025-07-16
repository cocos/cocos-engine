import { Transform } from "../../../../cocos/animation/core/transform";

export interface BlendTwoOperator {
    blendTransform: (transform1: Transform, transform2: Transform, ratio: number) => Transform;
    blendAuxiliaryCurve: (value1: number, value2: number, ratio: number) => number;
}
