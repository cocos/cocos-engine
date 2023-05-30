import { Pose } from "../../../../cocos/animation/core/pose";
import { AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphEvaluationContext } from "../../../../cocos/animation/marionette/animation-graph-context";
import { PoseNode } from '../../../../cocos/animation/marionette/pose-graph/pose-node';
import { Node } from "../../../../cocos/scene-graph";
import { AnimationGraphEvalMock } from "../utils/eval-mock";
import { createAnimationGraph } from "../utils/factory";

test(`Validation on PoseNode.doEvaluate()`, () => {
    abstract class PoseNode1 extends PoseNode {
        public bind(context: AnimationGraphBindingContext): void {}
        public settle(context: AnimationGraphSettleContext): void  {}
        public reenter(): void  {}
        protected doUpdate(context: AnimationGraphUpdateContext): void  {}
    }

    // The result stack size grew 0.
    expect(() => evalPoseNode(new (class extends PoseNode1 {
        protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
            const pose = context.pushDefaultedPose();
            context.popPose();
            return pose;
        }
    })())).toThrowError(`PoseNode.doEvaluate() should certainly push a pose node onto the stack and return it.`);

    // The result stack size grows 2 or more.
    expect(() => evalPoseNode(new (class extends PoseNode1 {
        protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
            const pose = context.pushDefaultedPose();
            context.pushDefaultedPose();
            return pose;
        }
    })())).toThrowError(`PoseNode.doEvaluate() should certainly push a pose node onto the stack and return it.`);

    // Returns an already popped pose.
    expect(() => evalPoseNode(new (class extends PoseNode1 {
        protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
            const pose1 = context.pushDefaultedPose();
            const pose2= context.pushDefaultedPose();
            context.popPose();
            return pose2;
        }
    })())).toThrowError(`PoseNode.doEvaluate() should certainly push a pose node onto the stack and return it.`);

    // The right manner.
    expect(() => evalPoseNode(new (class extends PoseNode1 {
        protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
            const pose1 = context.pushDefaultedPose();
            const pose2 = context.pushDefaultedPose();
            context.popPose();
            return pose1;
        }
    })())).not.toThrowError();

    function evalPoseNode(poseNode: PoseNode) {
        const animationGraph = createAnimationGraph({
            layers: [{
                stateMachine: {
                    states: { 'P': { type: 'procedural', graph: { rootNode: poseNode } } },
                    entryTransitions: [{ to: 'P' }],
                },
            }],
        });

        const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);
        evalMock.step(0.16666);
        evalMock.destroy();
    }
});
