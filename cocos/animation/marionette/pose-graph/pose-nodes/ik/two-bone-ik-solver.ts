import { EDITOR } from 'internal:constants';
import { ccclass, editable, serializable, type, visible } from '../../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { PoseTransformSpaceRequirement } from '../../pose-node';
import { assertIsTrue, ccenum, Vec3 } from '../../../../../core';
import { TransformHandle } from '../../../../core/animation-handle';
import { input } from '../../decorator/input';
import { poseGraphNodeCategory } from '../../decorator/node';
import { Pose } from '../../../../core/pose';
import { PoseNodeModifyPoseBase, TransformModificationQueue } from '../modify-pose-base';
import { solveTwoBoneIK } from './solve-two-bone-ik';
import { Transform } from '../../../../core/transform';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext } from '../../../animation-graph-context';
import { PoseGraphType } from '../../foundation/type-system';
import { TransformSpace } from '../transform-space';
import { POSE_GRAPH_NODE_MENU_PREFIX_IK } from './menu';

const cacheRootTransform = new Transform();
const cacheMiddleTransform = new Transform();
const cacheEndEffectorTransform = new Transform();
const cacheEndEffectorTargetPosition = new Vec3();
const cachePoleTargetPosition = new Vec3();
const cacheTransform_evaluateTarget = new Transform();

enum TargetSpecificationType {
    /**
     * Targets nothing.
     */
    NONE,

    /**
     * Targets the specified vector value.
     */
    VALUE,

    /**
     * Targets the specified bone.
     */
    BONE,
}

ccenum(TargetSpecificationType);

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeTwoBoneIKSolver.TargetSpecification`)
class TargetSpecification {
    constructor (type?: TargetSpecificationType) {
        if (typeof type !== 'undefined') {
            this.type = type;
        }
    }

    @serializable
    @editable
    @type(TargetSpecificationType)
    public type = TargetSpecificationType.VALUE;

    @serializable
    @editable
    @visible(function visible (this: TargetSpecification) { return this.type === TargetSpecificationType.VALUE; })
    public targetPosition = new Vec3();

    @serializable
    @editable
    @type(TransformSpace)
    @visible(function visible (this: TargetSpecification) { return this.type === TargetSpecificationType.VALUE; })
    public targetPositionSpace = TransformSpace.WORLD;

    @serializable
    @editable
    @visible(function visible (this: TargetSpecification) { return this.type === TargetSpecificationType.BONE; })
    public targetBone = '';

    public bind (context: AnimationGraphBindingContext, sourceBoneHandle: TransformHandle): void {
        this._sourceBoneHandle = sourceBoneHandle;
        if (this.type === TargetSpecificationType.BONE && this.targetBone) {
            this._targetBoneHandle = context.bindTransformByName(this.targetBone) ?? undefined;
        }
    }

    public evaluate (outTargetPosition: Vec3, pose: Pose, context: AnimationGraphEvaluationContext): Vec3 {
        assertIsTrue(this._sourceBoneHandle);
        if (this._targetBoneHandle) {
            pose.transforms.getPosition(this._targetBoneHandle.index, outTargetPosition);
        } else if (this.type === TargetSpecificationType.NONE) {
            pose.transforms.getPosition(this._sourceBoneHandle.index, outTargetPosition);
        } else {
            const targetTransform = Transform.setIdentity(cacheTransform_evaluateTarget);
            targetTransform.position = this.targetPosition;
            context._convertTransformToPoseTransformSpace(
                targetTransform,
                this.targetPositionSpace,
                pose,
                this._sourceBoneHandle.index,
            );
            Vec3.copy(outTargetPosition, targetTransform.position);
        }
        return outTargetPosition;
    }

    private _sourceBoneHandle: TransformHandle | undefined = undefined;
    private _targetBoneHandle: TransformHandle | undefined = undefined;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeTwoBoneIKSolver`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_IK)
export class PoseNodeTwoBoneIKSolver extends PoseNodeModifyPoseBase {
    @serializable
    @editable
    public debug = false;

    @serializable
    @editable
    public endEffectorBoneName = '';

    @serializable
    @editable
    public readonly endEffectorTarget = new TargetSpecification(TargetSpecificationType.VALUE);

    @input({ type: PoseGraphType.VEC3 })
    @visible(function visible (this: PoseNodeTwoBoneIKSolver) { return this.endEffectorTarget.type === TargetSpecificationType.VALUE; })
    get endEffectorTargetPosition (): Vec3 {
        return this.endEffectorTarget.targetPosition;
    }

    set endEffectorTargetPosition (value) {
        Vec3.copy(this.endEffectorTarget.targetPosition, value);
    }

    @serializable
    @editable
    public readonly poleTarget = new TargetSpecification(TargetSpecificationType.NONE);

    @input({ type: PoseGraphType.VEC3 })
    @visible(function visible (this: PoseNodeTwoBoneIKSolver) { return this.poleTarget.type === TargetSpecificationType.VALUE; })
    get poleTargetPosition (): Vec3 {
        return this.poleTarget.targetPosition;
    }

    set poleTargetPosition (value) {
        Vec3.copy(this.poleTarget.targetPosition, value);
    }

    public bind (context: AnimationGraphBindingContext): void {
        super.bind(context);
        if (this.endEffectorBoneName) {
            const parentBoneName = context.getParentBoneNameByName(this.endEffectorBoneName);
            const ikRootBoneName = parentBoneName
                ? context.getParentBoneNameByName(parentBoneName)
                : '';
            if (parentBoneName && ikRootBoneName) {
                const hEndEffector = context.bindTransformByName(this.endEffectorBoneName);
                const hMiddle = context.bindTransformByName(parentBoneName);
                const hIKRoot = context.bindTransformByName(ikRootBoneName);
                if (!hEndEffector || !hMiddle || !hIKRoot) {
                    hEndEffector?.destroy();
                    hMiddle?.destroy();
                    hIKRoot?.destroy();
                } else {
                    this.endEffectorTarget.bind(context, hEndEffector);
                    this.poleTarget.bind(context, hMiddle);
                    this._workspace = new Workspace(
                        hEndEffector,
                        hMiddle,
                        hIKRoot,
                    );
                }
            }
        }
    }

    protected getPoseTransformSpaceRequirement (): PoseTransformSpaceRequirement {
        return PoseTransformSpaceRequirement.COMPONENT;
    }

    protected modifyPose (context: AnimationGraphEvaluationContext, inputPose: Pose, modificationQueue: TransformModificationQueue): void {
        const {
            _workspace: workspace,
        } = this;

        if (!workspace) {
            return;
        }

        const {
            hRoot: { index: iRootTransform },
            hMiddle: { index: iMiddleTransform },
            hEndEffector: { index: iEndEffectorTransform },
        } = workspace;

        // Fetch transforms.
        const rootTransform = inputPose.transforms.getTransform(iRootTransform, cacheRootTransform);
        const middleTransform = inputPose.transforms.getTransform(iMiddleTransform, cacheMiddleTransform);
        const endEffectorTransform = inputPose.transforms.getTransform(iEndEffectorTransform, cacheEndEffectorTransform);

        const endEffectorTargetPosition = this.endEffectorTarget.evaluate(cacheEndEffectorTargetPosition, inputPose, context);
        const poleTargetPosition = this.poleTarget.evaluate(cachePoleTargetPosition, inputPose, context);

        // Solve.
        solveTwoBoneIK(
            rootTransform,
            middleTransform,
            endEffectorTransform,
            endEffectorTargetPosition,
            poleTargetPosition,
            this.debug ? this : undefined,
        );

        modificationQueue.push(iRootTransform, rootTransform);
        modificationQueue.push(iMiddleTransform, middleTransform);
        modificationQueue.push(iEndEffectorTransform, endEffectorTransform);
    }

    private _workspace: Workspace | undefined = undefined;
}

if (EDITOR) {
    PoseNodeTwoBoneIKSolver.prototype.getTitle = function getTitle (this: PoseNodeTwoBoneIKSolver): string | [string, Record<string, string>] | undefined {
        if (this.endEffectorBoneName) {
            return [`ENGINE.classes.${CLASS_NAME_PREFIX_ANIM}PoseNodeTwoBoneIKSolver.title`, {
                endEffectorBoneName: this.endEffectorBoneName,
            }];
        }
        return undefined;
    };
}

class Workspace {
    constructor (
        public hEndEffector: TransformHandle,
        public hMiddle: TransformHandle,
        public hRoot: TransformHandle,
    ) {
    }
}
