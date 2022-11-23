import { Quat, Vec3 } from '../../core';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { Node } from '../../scene-graph/node';
import { TransformHandle } from '../core/animation-handle';
import { Pose } from '../core/pose';
import { ExoticTrsAGEvaluation as AGExoticTrsEvaluation } from '../exotic-animation/exotic-animation';
import { TrackEval } from '../tracks/track';

/**
 * This module contains utilities to marry animation clip with animation graph.
 */

/**
 * The context in which animation clips can be bound in an animation graph.
 */
export interface AnimationClipGraphBindingContext {
    /**
     * The root node. This should be the animation controller's host node.
     */
    origin: Node;

    /**
     * Binds a scene node transform into animation graph.
     * @param path Path to the scene node from `origin`.
     * @returns The transform handle if successfully bound, `null` otherwise.
     */
    bindTransform(path: string): TransformHandle | null;
}

/**
 * The context in which animation clips can evaluate during animation graph evaluation.
 */
export interface AnimationClipGraphEvaluationContext {
    /**
     * The output pose.
     */
    readonly pose: Pose;
}

/**
 * A pose binding describes how to get/set part of a bound transform in animation graph.
 * The `T` can be `Vec3`, `Quat` for now.
 */
export interface PoseBinding<T> {
    /**
     * Destroys this binding.
     */
    destroy(): void;

    /**
     * Sets the part's value.
     * @param value The value.
     * @param pose The pose.
     */
    setValue(value: T, pose: Pose): void;

    /**
     * Reads the part's value.
     * @param pose The pose.
     */
    getValue(pose: Pose): Readonly<T>;
}

const CACHE_VEC3_GET_VALUE = new Vec3();

const CACHE_QUAT_GET_VALUE = new Quat();

/**
 * The pose binding base is base class of all pose binding classes.
 * It holds a transform handle.
 */
class PoseBindingBase {
    constructor (transformHandle: TransformHandle) {
        this._transformHandle = transformHandle;
    }

    /**
     * Releases the held transform handle.
     */
    public destroy () {
        this._transformHandle.destroy();
    }

    /**
     * The held transform handle.
     */
    protected declare readonly _transformHandle: TransformHandle;
}

/**
 * The pose position binding describes how to get/set the position of a bound transform in animation graph.
 */
class PosePositionBinding extends PoseBindingBase implements PoseBinding<Vec3> {
    public setValue (value: Vec3, pose: Pose): void {
        pose.transforms.setPosition(this._transformHandle.index, value);
    }

    public getValue (pose: Pose) {
        return pose.transforms.getPosition(this._transformHandle.index, CACHE_VEC3_GET_VALUE) as Readonly<Vec3>;
    }
}

/**
 * The pose rotation binding describes how to get/set the rotation(in quaternion) of a bound transform in animation graph.
 */
class PoseRotationBinding extends PoseBindingBase implements PoseBinding<Quat> {
    public setValue (value: Quat, pose: Pose): void {
        pose.transforms.setRotation(this._transformHandle.index, value);
    }

    public getValue (pose: Pose) {
        return pose.transforms.getRotation(this._transformHandle.index, CACHE_QUAT_GET_VALUE) as Readonly<Quat>;
    }
}

/**
 * The pose euler angles binding describes how to get/set the rotation(in euler angles) of a bound transform in animation graph.
 */
class PoseEulerAnglesBinding extends PoseBindingBase implements PoseBinding<Vec3> {
    public setValue (value: Vec3, pose: Pose): void {
        const quat = Quat.fromEuler(PoseEulerAnglesBinding._EULER_TO_QUAT_CACHE, value.x, value.y, value.z);
        pose.transforms.setRotation(this._transformHandle.index, quat);
    }

    public getValue (pose: Pose) {
        const q = pose.transforms.getRotation(this._transformHandle.index, CACHE_QUAT_GET_VALUE) as Readonly<Quat>;
        return Quat.toEuler(CACHE_VEC3_GET_VALUE, q) as Readonly<Vec3>;
    }

    private static _EULER_TO_QUAT_CACHE = new Quat();
}

/**
 * The pose euler scale binding describes how to get/set the scale of a bound transform in animation graph.
 */
class PoseScaleBinding extends PoseBindingBase implements PoseBinding<Vec3> {
    public setValue (value: Vec3, pose: Pose): void {
        pose.transforms.setScale(this._transformHandle.index, value);
    }

    public getValue (pose: Pose) {
        return pose.transforms.getScale(this._transformHandle.index, CACHE_VEC3_GET_VALUE) as Readonly<Vec3>;
    }
}

/**
 * Creates a corresponding pose binding.
 * @param transformHandle Handle to the transform.
 * @param propertyKey Indicates the binding type.
 * @returns The pose binding.
 */
// eslint-disable-next-line consistent-return
export function bindPoseTransform (
    transformHandle: TransformHandle,
    propertyKey: 'position' | 'rotation' | 'scale' | 'eulerAngles',
): PoseBinding<unknown> {
    switch (propertyKey) {
    case 'position':
        return new PosePositionBinding(transformHandle);
    case 'rotation':
        return new PoseRotationBinding(transformHandle);
    case 'eulerAngles':
        return new PoseEulerAnglesBinding(transformHandle);
    case 'scale':
        return new PoseScaleBinding(transformHandle);
    default:
        assertIsTrue(false);
    }
}

/**
 * Describes the evaluation of a animation clip track in sense of animation graph.
 */
export class AGTrackEvaluation<TValue> {
    constructor (binding: PoseBinding<TValue>, trackEvaluation: TrackEval<TValue>) {
        this._binding = binding;
        this._trackSampler = trackEvaluation;
    }

    public destroy () {
        this._binding.destroy();
    }

    public evaluate (time: number, pose: Pose) {
        const { _trackSampler: trackSampler, _binding: binding  } = this;
        const defaultValue = /* binding.getValue && */trackSampler.requiresDefault
            ? binding.getValue(pose) as TValue extends unknown ? unknown : TValue
            : undefined;
        const value = trackSampler.evaluate(time, defaultValue);
        binding.setValue(value, pose);
    }

    private _binding: PoseBinding<TValue>;
    private _trackSampler: TrackEval<TValue>;
}

/**
 * Describes the evaluation of a animation clip in sense of animation graph.
 */
export class AGAnimationClipEvaluation {
    constructor (
        trackEvaluations: AGTrackEvaluation<any>[],
        exoticAnimationEvaluation: AGExoticTrsEvaluation | undefined,
    ) {
        this._trackEvaluations = trackEvaluations;
        this._exoticAnimationEvaluation = exoticAnimationEvaluation;
    }

    /**
     * Destroys all the track evaluations and exotic animation evaluation.
     */
    public destroy () {
        this._exoticAnimationEvaluation?.destroy();

        this._trackEvaluations.forEach((trackEvaluation) => {
            trackEvaluation.destroy();
        });
    }

    /**
     * Evaluates.
     * @param time The time.
     * @param context The evaluation context.
     */
    public evaluate (time: number, context: AnimationClipGraphEvaluationContext) {
        const {
            _trackEvaluations: trackEvaluations,
            _exoticAnimationEvaluation: exoticAnimationEvaluation,
        } = this;

        const { pose } = context;

        for (const trackEvaluation of trackEvaluations) {
            trackEvaluation.evaluate(time, pose);
        }

        if (exoticAnimationEvaluation) {
            exoticAnimationEvaluation.evaluate(time, pose);
        }
    }

    private _trackEvaluations: AGTrackEvaluation<any>[] = [];

    private _exoticAnimationEvaluation: AGExoticTrsEvaluation | undefined;
}
