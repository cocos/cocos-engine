import { DEBUG } from 'internal:constants';
import { error, Quat, Vec3, warnID } from '../../core';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { Node } from '../../scene-graph/node';
import { AnimationClip, exoticAnimationTag } from '../animation-clip';
import { TransformHandle } from '../core/animation-handle';
import { Pose } from '../core/pose';
import { createEvalSymbol } from '../define';
import { ExoticTrsAGEvaluation } from '../exotic-animation/exotic-animation';
import { isTrsPropertyName, normalizedFollowTag, Track, TrackBinding, trackBindingTag, TrackEval } from '../tracks/track';
import { UntypedTrack } from '../tracks/untyped-track';

/**
 * This module contains utilities to marry animation clip with animation graph.
 *
 * A typical workflow is:
 *
 * At initial, an animation clip is bound to animation graph in `AnimationClipGraphBindingContext`,
 * an `AnimationClipAGEvaluation` is created after this phase to track the evaluation.
 *
 * Then at each frame, `AnimationClipAGEvaluation.evaluate()` is called,
 * passed with the current `AnimationClipGraphEvaluationContext`.
 * The evaluation context gives the pose that need to be filled,
 * then animation clip emplaces sampled animation data into the pose.
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
 * Currently, the context is just the output pose.
 */
export type AnimationClipGraphEvaluationContext = Pose;

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
function bindPoseTransform (
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
class AGTrackEvaluation<TValue> {
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

function bindTrackAG (animationClip: AnimationClip, track: Track, bindContext: AnimationClipGraphBindingContext) {
    const trackBinding = track[trackBindingTag];
    const trackTarget = createRuntimeBindingAG(trackBinding, bindContext);
    if (DEBUG && !trackTarget) {
        // If we got a null track target here, we should already have warn logged,
        // To elaborate on error details, we warn here as well.
        // Note: if in the future this log appears alone,
        // it must be a BUG which break promise by above statement.
        warnID(
            3937,
            animationClip.name,
            bindContext.origin.name,
        );
    }
    return trackTarget ?? undefined;
}

function createRuntimeBindingAG (track: TrackBinding, bindContext: AnimationClipGraphBindingContext) {
    const {
        origin,
    } = bindContext;
    const { path, proxy } = track;
    const nPaths = path.length;
    const iLastPath = nPaths - 1;

    if (nPaths !== 0 && (path.isPropertyAt(iLastPath) || path.isElementAt(iLastPath)) && !proxy) {
        const lastPropertyKey = path.isPropertyAt(iLastPath)
            ? path.parsePropertyAt(iLastPath)
            : path.parseElementAt(iLastPath);
        const resultTarget = path[normalizedFollowTag](origin, 0, nPaths - 1);
        if (resultTarget === null) {
            return null;
        }

        if (resultTarget instanceof Node && isTrsPropertyName(lastPropertyKey)) {
            const transformPath = (() => {
                const segments = [] as string[];
                let node: Node | null = resultTarget;
                for (; node && node !== origin; node = node.parent) {
                    segments.unshift(node.name);
                }
                if (node === origin) {
                    return segments.join('/');
                } else {
                    return undefined;
                }
            })();
            if (typeof transformPath === 'string') {
                const transformHandle = bindContext.bindTransform(transformPath);
                if (!transformHandle) {
                    return undefined;
                }
                return bindPoseTransform(transformHandle, lastPropertyKey);
            }
        }
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // TODO: here should be resolved before this can be landed.
    error(`Animation graph currently only supports (bone) transform animations.`);
    return undefined;
}

/**
 * Describes the evaluation of a animation clip in sense of animation graph.
 */
export class AnimationClipAGEvaluation {
    constructor (
        clip: AnimationClip,
        context: AnimationClipGraphBindingContext,
    ) {
        clip._trySyncLegacyData();

        const trackEvaluations: AGTrackEvaluation<unknown>[] = [];
        let exoticAnimationEvaluation: ExoticTrsAGEvaluation | undefined;

        const {
            tracks,
            [exoticAnimationTag]: exoticAnimation,
        } = clip;

        for (const track of tracks) {
            if (track instanceof UntypedTrack) {
            // Untyped track is not supported in AG.
                continue;
            }
            if (Array.from(track.channels()).every(({ curve }) => curve.keyFramesCount === 0)) {
                continue;
            }
            const trackRuntimeBinding = bindTrackAG(clip, track, context);
            if (!trackRuntimeBinding) {
                continue;
            }
            const trackSampler = track[createEvalSymbol]();
            const trackEvaluation = new AGTrackEvaluation(trackRuntimeBinding, trackSampler);
            trackEvaluations.push(trackEvaluation);
        }

        if (exoticAnimation) {
            exoticAnimationEvaluation = exoticAnimation.createEvaluatorForAnimationGraph(context);
        }

        this._trackEvaluations = trackEvaluations;
        this._exoticAnimationEvaluation = exoticAnimationEvaluation;
    }

    /**
     * Destroys all the track evaluations and exotic animation evaluation.
     */
    public destroy () {
        this._exoticAnimationEvaluation?.destroy();

        const {
            _trackEvaluations: trackEvaluations,
        } = this;
        const nTrackEvaluations = trackEvaluations.length;
        for (let iNodeEvaluation = 0; iNodeEvaluation < nTrackEvaluations; ++iNodeEvaluation) {
            trackEvaluations[iNodeEvaluation].destroy();
        }
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

        const pose = context;

        const nTrackEvaluations = trackEvaluations.length;
        for (let iNodeEvaluation = 0; iNodeEvaluation < nTrackEvaluations; ++iNodeEvaluation) {
            trackEvaluations[iNodeEvaluation].evaluate(time, pose);
        }

        if (exoticAnimationEvaluation) {
            exoticAnimationEvaluation.evaluate(time, pose);
        }
    }

    private _trackEvaluations: AGTrackEvaluation<any>[] = [];

    private _exoticAnimationEvaluation: ExoticTrsAGEvaluation | undefined;
}
