import { AnimationController } from "../../../../../cocos/animation/animation";
import { AnimationGraphBindingContext, AnimationGraphPoseLayoutMaintainer, AnimationGraphSettleContext, AnimationGraphUpdateContext, AuxiliaryCurveRegistry } from "../../../../../cocos/animation/marionette/animation-graph-context";
import { PoseNode } from "../../../../../cocos/animation/marionette/pose-graph/pose-node";
import { Node } from "../../../../../cocos/scene-graph";

export function createAdditivityCheckMock() {
    const bindMock = jest.fn<void, [additive: boolean]>();

    const bindMock2 = jest.fn(function(...args: Parameters<PoseNode['bind']>) {
        const [context] = args;
        bindMock(context.additive);
    });

    class PoseNodeMock extends PoseNode {
        public settle(context: AnimationGraphSettleContext): void { }
        public reenter(): void { }
        protected doUpdate(context: AnimationGraphUpdateContext): void { }
        bind = bindMock2;
        doEvaluate = jest.fn();
    }

    return {
        bindMock,
        PoseNodeMock: PoseNodeMock,
    };
}

export function createPoseNodeBindContextMock_WithAdditive(additive: boolean): AnimationGraphBindingContext {
    const node = new Node();
    const controller = node.addComponent(AnimationController) as AnimationController;
    const auxiliaryCurveRegistry = new AuxiliaryCurveRegistry();
    const varRegistry = {};
    const poseLayoutMaintainer = new AnimationGraphPoseLayoutMaintainer(node, auxiliaryCurveRegistry);
    const result = new AnimationGraphBindingContext(
        node,
        poseLayoutMaintainer,
        varRegistry,
        controller,
    );
    result._pushAdditiveFlag(additive);
    return result;
}

export function invokePoseNodeBindMethod(poseNode: PoseNode, context: AnimationGraphBindingContext) {
    poseNode.bind(context);
}