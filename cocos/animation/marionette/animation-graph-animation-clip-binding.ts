import { Quat, Vec3 } from '../../core';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { Node } from '../../scene-graph/node';
import { TransformHandle } from '../core/animation-handle';
import { Pose } from '../core/pose';
import { ExoticTrsAGEvaluation as AGExoticTrsEvaluation } from '../exotic-animation/exotic-animation';
import { TrackEval } from '../tracks/track';

export interface AnimationClipGraphBindingContext {
    origin: Node;

    bindTransform(path: string): TransformHandle | null;
}

export interface AnimationClipGraphEvaluationContext {
    readonly pose: Pose;
}

export interface PoseBinding<T> {
    destroy(): void;

    setValue(value: T, pose: Pose): void;

    getValue(pose: Pose): Readonly<T>;
}

const CACHE_VEC3_GET_VALUE = new Vec3();

const CACHE_QUAT_GET_VALUE = new Quat();

class PoseBindingBase {
    constructor (transformHandle: TransformHandle) {
        this._transformHandle = transformHandle;
    }

    public destroy () {
        this._transformHandle.destroy();
    }

    protected declare readonly _transformHandle: TransformHandle;
}

class PosePositionBinding extends PoseBindingBase implements PoseBinding<Vec3> {
    public setValue (value: Vec3, pose: Pose): void {
        pose.transforms.setPosition(this._transformHandle.index, value);
    }

    public getValue (pose: Pose) {
        return pose.transforms.getPosition(this._transformHandle.index, CACHE_VEC3_GET_VALUE) as Readonly<Vec3>;
    }
}

class PoseRotationBinding extends PoseBindingBase implements PoseBinding<Quat> {
    public setValue (value: Quat, pose: Pose): void {
        pose.transforms.setRotation(this._transformHandle.index, value);
    }

    public getValue (pose: Pose) {
        return pose.transforms.getRotation(this._transformHandle.index, CACHE_QUAT_GET_VALUE) as Readonly<Quat>;
    }
}

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

class PoseScaleBinding extends PoseBindingBase implements PoseBinding<Vec3> {
    public setValue (value: Vec3, pose: Pose): void {
        pose.transforms.setScale(this._transformHandle.index, value);
    }

    public getValue (pose: Pose) {
        return pose.transforms.getScale(this._transformHandle.index, CACHE_VEC3_GET_VALUE) as Readonly<Vec3>;
    }
}

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

export class AGAnimationClipEvaluation {
    constructor (
        trackEvaluations: AGTrackEvaluation<any>[],
        exoticAnimationEvaluation: AGExoticTrsEvaluation | undefined,
    ) {
        this._trackEvaluations = trackEvaluations;
        this._exoticAnimationEvaluation = exoticAnimationEvaluation;
    }

    public destroy () {
        this._exoticAnimationEvaluation?.destroy();

        this._trackEvaluations.forEach((trackEvaluation) => {
            trackEvaluation.destroy();
        });
    }

    /**
     * Evaluates this animation.
     * @param time The time.
     */
    public evaluate (time: number, output: AnimationClipGraphEvaluationContext) {
        const {
            _trackEvaluations: trackEvaluations,
            _exoticAnimationEvaluation: exoticAnimationEvaluation,
        } = this;

        const { pose } = output;

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
