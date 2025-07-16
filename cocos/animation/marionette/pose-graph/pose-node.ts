import { TEST } from 'internal:constants';
import { assertIsTrue, ccenum } from '../../../core';
import { ccclass } from '../../../core/data/decorators';
import { Pose, PoseTransformSpace } from '../../core/pose';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import {
    AnimationGraphBindingContext,
    AnimationGraphEvaluationContext,
    AnimationGraphSettleContext,
    AnimationGraphUpdateContext,
} from '../animation-graph-context';
import { PoseGraphNode } from './foundation/pose-graph-node';
import type { PoseNodeDependencyEvaluation } from './instantiation';

export enum PoseTransformSpaceRequirement {
    NO,

    LOCAL,

    COMPONENT,
}
ccenum(PoseTransformSpaceRequirement);

const POSE_NODE_EVALUATION_STACK_ORDER_DEBUG_ENABLED = !!TEST;

/**
 * Base class of all pose nodes.
 *
 * Pose nodes are nodes in pose graph that yields pose objects.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNode`)
export abstract class PoseNode extends PoseGraphNode {
    /**
     * Starts the bind stage on this pose node.
     *
     * @param context The bind context.
     *
     * @note Subclasses shall implement this method to perform some preparing works
     * and invoke this method on dependant pose nodes.
     */
    public abstract bind(context: AnimationGraphBindingContext): void;

    /**
     * Starts the settle stage on this pose node.
     *
     * @param context The settle context.
     *
     * @note Subclasses shall implement this method to perform some post-binding works
     * and invoke this method on dependant pose nodes.
     *
     */
    public abstract settle (context: AnimationGraphSettleContext): void;

    /**
     * Reenter this pose nodes.
     *
     * @note Subclasses shall implement this method to perform some state resetting works.
     * and invoke this method on dependant pose nodes.
     *
     * This method would be fired if other pose nodes that depends on this pose node requests a "reset".
     * For example, if this pose node is as a node of a pose state.
     * When this state is activated, this method is invoked.
     */
    public abstract reenter (): void;

    /**
     * Perform the update stage on this pose node.
     * This method will directly forward to call `this.doUpdate`.
     *
     * @param context The update context.
     *
     * @note Subclasses shall not override this method and should override `doUpdate` instead.
     */
    public update (context: AnimationGraphUpdateContext): void {
        this._dependencyEvaluation?.evaluate();
        this.doUpdate(context);
    }

    /**
     * Evaluates this pose node.
     * This method will directly forward to call `this.doEvaluate`.
     *
     * @param context The evaluation context.
     *
     * @note Subclasses shall not override this method and should override `doEvaluate` instead.
     */
    public evaluate (context: AnimationGraphEvaluationContext, poseTransformSpaceRequirement: PoseTransformSpaceRequirement): Pose {
        let stackSizeBefore!: number;
        if (POSE_NODE_EVALUATION_STACK_ORDER_DEBUG_ENABLED) {
            stackSizeBefore = context._stackSize_debugging;
        }

        const pose = this.doEvaluate(context);

        if (POSE_NODE_EVALUATION_STACK_ORDER_DEBUG_ENABLED) {
            // The stack should certainly increase 1.
            assertIsTrue(context._stackSize_debugging === stackSizeBefore + 1,
                `PoseNode.doEvaluate() should certainly push a pose node onto the stack and return it.`);
            // The returned pose should be the increased pose, that's,
            // can not return a already-popped pose.
            assertIsTrue(context._isStackTopPose_debugging(pose),
                `PoseNode.doEvaluate() should certainly push a pose node onto the stack and return it.`);
        }

        const currentSpace = pose._poseTransformSpace;
        switch (poseTransformSpaceRequirement) {
        default:
            assertIsTrue(false);
            // fallthrough
        case PoseTransformSpaceRequirement.NO:
            break;
        case PoseTransformSpaceRequirement.LOCAL: {
            if (currentSpace === PoseTransformSpace.COMPONENT) {
                context._poseTransformsSpaceComponentToLocal(pose);
            }
            assertIsTrue(pose._poseTransformSpace === PoseTransformSpace.LOCAL);
            break;
        }
        case PoseTransformSpaceRequirement.COMPONENT: {
            if (currentSpace === PoseTransformSpace.LOCAL) {
                context._poseTransformsSpaceLocalToComponent(pose);
            }
            assertIsTrue(pose._poseTransformSpace === PoseTransformSpace.COMPONENT);
            break;
        }
        }

        return pose;
    }

    public static evaluateDefaultPose (context: AnimationGraphEvaluationContext, poseTransformSpaceRequirement: PoseTransformSpaceRequirement): Pose {
        switch (poseTransformSpaceRequirement) {
        default:
            assertIsTrue(false);
            // fallthrough
        case PoseTransformSpaceRequirement.NO:
        case PoseTransformSpaceRequirement.LOCAL:
            return context.pushDefaultedPose();
        case PoseTransformSpaceRequirement.COMPONENT:
            return context.pushDefaultedPoseInComponentSpace();
        }
    }

    /** @internal */
    public _setDependencyEvaluation (dependency: PoseNodeDependencyEvaluation): void {
        this._dependencyEvaluation = dependency;
    }

    /**
     * Implement this method to performs the update stage on this pose node.
     *
     * @param context The update context.
     *
     * @note Subclasses shall implement this method to perform some updating works.
     * and invoke `this.update` on dependant pose nodes.
     */
    protected abstract doUpdate (context: AnimationGraphUpdateContext): void;

    /**
     * Implement this method to evaluate this pose node.
     *
     * @param context The evaluation context.
     *
     * @returns The result pose.
     */
    protected abstract doEvaluate(context: AnimationGraphEvaluationContext): Pose;

    /**
     * TODO: some nodes access dependencies in reenter(). See: cocos/cocos-engine#15305
     */
    protected _forceEvaluateEvaluation (): void {
        this._dependencyEvaluation?.evaluate();
    }

    private _dependencyEvaluation: PoseNodeDependencyEvaluation | undefined = undefined;
}
