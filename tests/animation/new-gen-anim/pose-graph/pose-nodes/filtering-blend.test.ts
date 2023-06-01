import { Transform } from "../../../../../cocos/animation/core/transform";
import { PoseNodeFilteringBlend } from "../../../../../cocos/animation/marionette/pose-graph/pose-nodes/filtering-blend";
import { lerp } from "../../../../../exports/base";
import { BlendTwoOperator } from "../../utils/abstract-operators";
import { includeTestsFor_BlendTwoPoseLike_PoseNode } from "./blend-two-pose-shared";

const BlendTwoPose_ExpectedOperator: BlendTwoOperator = {
    blendTransform (transform1: Transform, transform2: Transform, ratio: number): Transform {
        return Transform.lerp(new Transform(), transform1, transform2, ratio);
    },

    blendAuxiliaryCurve (value1: number, value2: number, ratio: number): number {
        return lerp(value1, value2, ratio);
    },
};

includeTestsFor_BlendTwoPoseLike_PoseNode(
    PoseNodeFilteringBlend,
    'pose0',
    'pose1',
    'ratio',
    BlendTwoPose_ExpectedOperator,
);

