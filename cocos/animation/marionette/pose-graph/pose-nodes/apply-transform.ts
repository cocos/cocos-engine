import { EDITOR } from 'internal:constants';
import { ccclass, editable, range, serializable, type, visible } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { PoseNode, PoseTransformSpaceRequirement } from '../pose-node';
import {
    AnimationGraphBindingContext, AnimationGraphEvaluationContext,
} from '../../animation-graph-context';
import { input } from '../decorator/input';
import { approx, assertIsTrue, ccenum, error, Quat, Vec3 } from '../../../../core';
import { TransformHandle } from '../../../core/animation-handle';
import { poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE } from './menu-common';
import { IntensitySpecification } from './intensity-specification';
import { Pose } from '../../../core/pose';
import { PoseNodeModifyPoseBase, TransformModificationQueue } from './modify-pose-base';
import { PoseGraphType } from '../foundation/type-system';
import { TransformSpace } from './transform-space';
import { Transform } from '../../../core/transform';

export enum TransformOperation {
    LEAVE_UNCHANGED,

    REPLACE,

    ADD,
}

ccenum(TransformOperation);

const APPLY_INTENSITY_EPSILON = 1e-5;

const cacheTransform = new Transform();

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeApplyTransform`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE)
@poseGraphNodeAppearance({ themeColor: '#72A869' })
export class PoseNodeApplyTransform extends PoseNodeModifyPoseBase {
    @serializable
    @editable
    public node = '';

    @serializable
    @editable
    @type(TransformOperation)
    public positionOperation = TransformOperation.LEAVE_UNCHANGED;

    @serializable
    @editable
    @input({ type: PoseGraphType.VEC3 })
    @visible(function visible (this: PoseNodeApplyTransform) { return this.positionOperation !== TransformOperation.LEAVE_UNCHANGED; })
    public position = new Vec3();

    @serializable
    @editable
    @type(TransformOperation)
    public rotationOperation = TransformOperation.LEAVE_UNCHANGED;

    @serializable
    @editable
    @input({ type: PoseGraphType.QUAT })
    @visible(function visible (this: PoseNodeApplyTransform) { return this.rotationOperation !== TransformOperation.LEAVE_UNCHANGED; })
    public rotation = new Quat();

    @serializable
    @editable
    @range([0.0, 1.0, 0.01])
    public intensity = new IntensitySpecification();

    @serializable
    @editable
    @type(TransformSpace)
    public transformSpace: TransformSpace = TransformSpace.WORLD;

    @input({ type: PoseGraphType.FLOAT })
    public get intensityValue (): number {
        return this.intensity.value;
    }

    public set intensityValue (value) {
        this.intensity.value = value;
    }

    public bind (context: AnimationGraphBindingContext): void {
        const {
            node: nodeName,
        } = this;

        super.bind(context);

        if (!nodeName) {
            return;
        }

        const transformHandle = context.bindTransformByName(nodeName);
        if (!transformHandle) {
            error(`Failed to bind transform ${nodeName}`);
            return;
        }

        this._transformHandle = transformHandle;

        this.intensity.bind(context);
    }

    protected getPoseTransformSpaceRequirement (): PoseTransformSpaceRequirement {
        return PoseTransformSpaceRequirement.NO;
    }

    protected modifyPose (context: AnimationGraphEvaluationContext, inputPose: Pose, modificationQueue: TransformModificationQueue): Pose {
        const {
            _transformHandle: transformHandle,
        } = this;

        if (!transformHandle) {
            return inputPose;
        }

        const intensity = this.intensity.evaluate(inputPose);

        // If intensity is too small. Takes no effect.
        if (intensity < APPLY_INTENSITY_EPSILON) {
            return inputPose;
        }

        const fullIntensity = approx(intensity, 1.0, APPLY_INTENSITY_EPSILON);

        const { index: transformIndex } = transformHandle;

        const nodeTransform = inputPose.transforms.getTransform(transformIndex, cacheTransform);

        const { rotationOperation } = this;
        if (rotationOperation !== TransformOperation.LEAVE_UNCHANGED) {
            const { rotation, transformSpace: rotationSpace } = this;
            context._convertPoseSpaceTransformToTargetSpace(
                nodeTransform,
                rotationSpace,
                inputPose,
                transformIndex,
            );
            switch (rotationOperation) {
            default:
            case TransformOperation.REPLACE:
                replaceRotation(nodeTransform, rotation, intensity, fullIntensity);
                break;
            case TransformOperation.ADD:
                addRotation(nodeTransform, rotation, intensity, fullIntensity);
                break;
            }
            context._convertTransformToPoseTransformSpace(
                nodeTransform,
                rotationSpace,
                inputPose,
                transformIndex,
            );
        }

        const { positionOperation } = this;
        if (positionOperation !== TransformOperation.LEAVE_UNCHANGED) {
            const { position, transformSpace: positionSpace } = this;
            context._convertPoseSpaceTransformToTargetSpace(
                nodeTransform,
                positionSpace,
                inputPose,
                transformIndex,
            );
            switch (positionOperation) {
            default:
            case TransformOperation.REPLACE:
                replacePosition(nodeTransform, position, intensity, fullIntensity);
                break;
            case TransformOperation.ADD:
                addPosition(nodeTransform, position, intensity, fullIntensity);
                break;
            }
            context._convertTransformToPoseTransformSpace(
                nodeTransform,
                positionSpace,
                inputPose,
                transformIndex,
            );
        }

        modificationQueue.push(transformIndex, nodeTransform);

        return inputPose;
    }

    private _transformHandle: TransformHandle | null = null;
}

const {
    replace: replacePosition,
    add: addPosition,
} = ((): {
    replace: (transform: Transform, value: Readonly<Vec3>, intensity: number, fullIntensity: boolean) => void,
    add: (transform: Transform, value: Readonly<Vec3>, intensity: number, fullIntensity: boolean) => void,
} => {
    const cacheInput = new Vec3();
    const cacheResult = new Vec3();

    return {
        replace,
        add,
    };

    function replace (transform: Transform, value: Readonly<Vec3>, intensity: number, fullIntensity: boolean): void {
        if (fullIntensity) {
            transform.position = value;
        } else {
            const inputPosition = Vec3.copy(cacheInput, transform.position);
            Vec3.lerp(inputPosition, inputPosition, value, intensity);
            transform.position = inputPosition;
        }
    }

    function add (transform: Transform, value: Readonly<Vec3>, intensity: number, fullIntensity: boolean): void {
        const result = cacheResult;
        if (fullIntensity) {
            Vec3.copy(result, value);
        } else {
            Vec3.slerp(result, Vec3.ZERO, value, intensity);
        }
        Vec3.add(result, transform.position, result);
        transform.position = result;
    }
})();

const {
    replace: replaceRotation,
    add: addRotation,
} = ((): {
    replace: (transform: Transform, value: Readonly<Quat>, intensity: number, fullIntensity: boolean) => void,
    add: (transform: Transform, value: Readonly<Quat>, intensity: number, fullIntensity: boolean) => void,
} => {
    const cacheInput = new Quat();
    const cacheResult = new Quat();

    return {
        replace,
        add,
    };

    function replace (transform: Transform, value: Readonly<Quat>, intensity: number, fullIntensity: boolean): void {
        if (fullIntensity) {
            transform.rotation = value;
        } else {
            const inputRotation = Quat.copy(cacheInput, transform.rotation);
            Quat.slerp(inputRotation, inputRotation, value, intensity);
            transform.rotation = inputRotation;
        }
    }

    function add (transform: Transform, value: Readonly<Quat>, intensity: number, fullIntensity: boolean): void {
        const inputRotation = Quat.copy(cacheInput, transform.rotation);
        const resultRotation = cacheResult;
        if (fullIntensity) {
            Quat.copy(resultRotation, value);
        } else {
            Quat.slerp(resultRotation, Quat.IDENTITY, value, intensity);
        }
        Quat.multiply(resultRotation, resultRotation, inputRotation);
        transform.rotation = resultRotation;
    }
})();

if (EDITOR) {
    PoseNodeApplyTransform.prototype.getTitle = function getTitle (this: PoseNodeApplyTransform): string | [string, Record<string, string>] | undefined {
        if (this.node) {
            return [`ENGINE.classes.${CLASS_NAME_PREFIX_ANIM}PoseNodeApplyTransform.title`, { nodeName: this.node }];
        }
        return undefined;
    };
}
