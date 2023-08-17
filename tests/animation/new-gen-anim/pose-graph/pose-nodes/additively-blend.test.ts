import { Transform, __applyDeltaTransform } from "../../../../../cocos/animation/core/transform";
import { PoseNodeAdditivelyBlend } from "../../../../../cocos/animation/marionette/pose-graph/pose-nodes/additively-blend";
import { BlendTwoOperator } from "../../utils/abstract-operators";
import { includeTestsFor_BlendTwoPoseLike_PoseNode } from "./blend-two-pose-shared";
import { createAdditivityCheckMock, createPoseNodeBindContextMock_WithAdditive, invokePoseNodeBindMethod as invokePoseNodeBindMethod } from "./utils/additive";

test(`Additivity inheritance`, () => {
    /// - The additivity of base pose's binding context is inherited.
    /// - The additivity of addition pose's binding context is set to true.

    t(false);
    t(true);

    function t(initialAdditive: boolean) {
        const base_AdditivityCheckMock = createAdditivityCheckMock();
        const addition_AdditivityCheckMock = createAdditivityCheckMock();
    
        const addPose = new PoseNodeAdditivelyBlend();
        addPose.basePose = new base_AdditivityCheckMock.PoseNodeMock();
        addPose.additivePose = new addition_AdditivityCheckMock.PoseNodeMock();
    
        const context = createPoseNodeBindContextMock_WithAdditive(initialAdditive);
    
        invokePoseNodeBindMethod(addPose, context);
    
        // Inherited.
        expect(base_AdditivityCheckMock.bindMock).toBeCalledTimes(1);
        expect(base_AdditivityCheckMock.bindMock.mock.calls[0][0]).toBe(initialAdditive);
    
        // Force to true.
        expect(addition_AdditivityCheckMock.bindMock).toBeCalledTimes(1);
        expect(addition_AdditivityCheckMock.bindMock.mock.calls[0][0]).toBe(true);
    }
});

const AdditivelyBlend_ExpectedOperator: BlendTwoOperator = {
    blendTransform (transform1: Transform, transform2: Transform, ratio: number): Transform {
        return __applyDeltaTransform(new Transform(), transform1, transform2, ratio);
    },

    blendAuxiliaryCurve (value1: number, value2: number, ratio: number): number {
        return value1 + value2 * ratio;
    },
};

includeTestsFor_BlendTwoPoseLike_PoseNode(
    PoseNodeAdditivelyBlend,
    'basePose',
    'additivePose',
    'ratio',
    AdditivelyBlend_ExpectedOperator,
);
