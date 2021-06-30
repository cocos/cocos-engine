/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module animation
 */

import { ccclass, serializable } from 'cc.decorator';
import { Asset } from '../assets/asset';
import { SpriteFrame } from '../../2d/assets/sprite-frame';
import { error, errorID, warn } from '../platform/debug';
import { DataPoolManager } from '../../3d/skeletal-animation/data-pool-manager';
import { binarySearchEpsilon } from '../algorithm/binary-search';
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';
import { SkelAnimDataHub } from '../../3d/skeletal-animation/skeletal-animation-data-hub';
import { ComponentPath, HierarchyPath, TargetPath, evaluatePath, isPropertyPath } from './target-path';
import { WrapMode as AnimationWrapMode, WrapMode, WrapModeMask } from './types';
import { IValueProxyFactory } from './value-proxy';
import { legacyCC } from '../global-exports';
import { RealCurve, RealInterpMode } from '../curves';
import { ObjectCurve } from '../curves/object-curve';
import { Color, Mat4, Quat, Size, Vec2, Vec3, Vec4 } from '../math';
import { Node } from '../scene-graph/node';
import { IntegerCurve } from '../curves/integer-curve';
import { QuaternionCurve, QuaternionInterpMode } from '../curves/quat-curve';
import { KeySharedQuaternionCurves, KeySharedRealCurves } from '../curves/keys-shared-curves';
import { assertIsTrue } from '../data/utils/asserts';
import type { PoseOutput } from './pose-output';
import * as legacy from './legacy-clip-data';
import { BAKE_SKELETON_CURVE_SYMBOL } from './internal-symbols';
import { RealKeyframeValue } from '../curves/curve';
import { CubicSplineNumberValue, CubicSplineVec2Value, CubicSplineVec3Value, CubicSplineVec4Value } from './cubic-spline-value';

export declare namespace AnimationClip {
    export interface IEvent {
        frame: number;
        func: string;
        params: string[];
    }

    export type { legacy as _legacy };
}

// #region Tracks

type TrackPath = TargetPath[];

interface Range {
    min: number;
    max: number;
}

const createEvalSymbol = Symbol('CreateEval');

const CLASS_NAME_PREFIX_ANIM = 'cc.animation.';

// Export for test
export const searchForRootBonePathSymbol = Symbol('SearchForRootBonePath');

/**
 * A track describes the path of animate a target.
 * It's the basic unit of animation clip.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}Track`)
export class Track {
    @serializable
    public path: TrackPath = [];

    @serializable
    public setter!: IValueProxyFactory | undefined;

    public getChannels (): Channel[] {
        return [];
    }

    public getRange (): Range {
        const range: Range = { min: Infinity, max: -Infinity };
        for (const channel of this.getChannels()) {
            range.min = Math.min(range.min, channel.curve.rangeMin);
            range.max = Math.max(range.max, channel.curve.rangeMax);
        }
        return range;
    }

    public [createEvalSymbol] (runtimeBinding: RuntimeBinding): TrackEval {
        throw new Error(`No Impl`);
    }
}

interface TrackEval {
    /**
     * Evaluates the track.
     * @param time The time.
     */
    evaluate(time: number, runtimeBinding: RuntimeBinding): unknown;
}

type Curve = RealCurve | IntegerCurve | QuaternionCurve | ObjectCurve<unknown>;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}Channel`)
export class Channel<T = Curve> {
    constructor (curve: T) {
        this._curve = curve;
    }

    @serializable
    public name = '';

    get curve () {
        return this._curve;
    }

    @serializable
    private _curve!: T;
}

type RealChannel = Channel<RealCurve>;

type IntegerChannel = Channel<IntegerCurve>;

type QuaternionChannel = Channel<QuaternionCurve>;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}SingleChannelTrack`)
export abstract class SingleChannelTrack<TCurve extends Curve> extends Track {
    constructor () {
        super();
        this._channel = new Channel<TCurve>(this.createCurve());
    }

    get channel () {
        return this._channel;
    }

    public getChannels () {
        return [this._channel];
    }

    protected createCurve (): TCurve {
        throw new Error(`Not impl`);
    }

    public [createEvalSymbol] (_runtimeBinding: RuntimeBinding): TrackEval {
        const { curve } = this._channel;
        return {
            evaluate: (time) => curve.evaluate(time),
        };
    }

    @serializable
    private _channel: Channel<TCurve>;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}RealTrack`)
export class RealTrack extends SingleChannelTrack<RealCurve> {
    protected createCurve () {
        return new RealCurve();
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}IntegerTrack`)
export class IntegerTrack extends SingleChannelTrack<IntegerCurve> {
    protected createCurve () {
        return new IntegerCurve();
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}QuaternionTrack`)
export class QuaternionTrack extends SingleChannelTrack<QuaternionCurve> {
    protected createCurve () {
        return new QuaternionCurve();
    }

    public [createEvalSymbol] () {
        return new QuatTrackEval(this.getChannels()[0].curve);
    }
}

class QuatTrackEval {
    constructor (private _curve: QuaternionCurve) {

    }

    public evaluate (time: number) {
        this._curve.evaluate(time, this._result);
        return this._result;
    }

    private _result: Quat = new Quat();
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ObjectTrack`)
export class ObjectTrack<T> extends SingleChannelTrack<ObjectCurve<unknown>> {
    protected createCurve () {
        return new ObjectCurve<T>();
    }
}

function maskIfEmpty<T extends Curve> (curve: T) {
    return curve.empty ? undefined : curve;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}VectorTrack`)
export class VectorTrack extends Track {
    constructor () {
        super();
        this._channels = new Array(4) as VectorTrack['_channels'];
        for (let i = 0; i < this._channels.length; ++i) {
            const channel = new Channel<RealCurve>(new RealCurve());
            channel.name = 'X';
            this._channels[i] = channel;
        }
    }

    get componentsCount () {
        return this._nComponents;
    }

    set componentsCount (value) {
        this._nComponents = value;
    }

    public getChannels () {
        return this._channels;
    }

    public [createEvalSymbol] () {
        switch (this._nComponents) {
        default:
        case 2:
            return new Vec2TrackEval(
                maskIfEmpty(this._channels[0].curve),
                maskIfEmpty(this._channels[1].curve),
            );
        case 3:
            return new Vec3TrackEval(
                maskIfEmpty(this._channels[0].curve),
                maskIfEmpty(this._channels[1].curve),
                maskIfEmpty(this._channels[2].curve),
            );
        case 4:
            return new Vec4TrackEval(
                maskIfEmpty(this._channels[0].curve),
                maskIfEmpty(this._channels[1].curve),
                maskIfEmpty(this._channels[2].curve),
                maskIfEmpty(this._channels[3].curve),
            );
        }
    }

    @serializable
    private _channels: [RealChannel, RealChannel, RealChannel, RealChannel];

    @serializable
    private _nComponents: 2 | 3 | 4 = 4;
}

class Vec2TrackEval {
    constructor (private _x: RealCurve | undefined, private _y: RealCurve | undefined) {

    }

    public evaluate (time: number, runtimeBinding: RuntimeBinding) {
        if ((!this._x || !this._y) && runtimeBinding.getValue) {
            Vec2.copy(this._result, runtimeBinding.getValue() as Vec2);
        }

        if (this._x) {
            this._result.x = this._x.evaluate(time);
        }
        if (this._y) {
            this._result.y = this._y.evaluate(time);
        }

        return this._result;
    }

    private _result: Vec2 = new Vec2();
}

class Vec3TrackEval {
    constructor (private _x: RealCurve | undefined, private _y: RealCurve | undefined, private _z: RealCurve | undefined) {

    }

    public evaluate (time: number, runtimeBinding: RuntimeBinding) {
        if ((!this._x || !this._y || !this._z) && runtimeBinding.getValue) {
            Vec3.copy(this._result, runtimeBinding.getValue() as Vec3);
        }

        if (this._x) {
            this._result.x = this._x.evaluate(time);
        }
        if (this._y) {
            this._result.y = this._y.evaluate(time);
        }
        if (this._z) {
            this._result.z = this._z.evaluate(time);
        }

        return this._result;
    }

    private _result: Vec3 = new Vec3();
}

class Vec4TrackEval {
    constructor (
        private _x: RealCurve | undefined,
        private _y: RealCurve | undefined,
        private _z: RealCurve | undefined,
        private _w: RealCurve | undefined,
    ) {

    }

    public evaluate (time: number, runtimeBinding: RuntimeBinding) {
        if ((!this._x || !this._y || !this._z || !this._w) && runtimeBinding.getValue) {
            Vec4.copy(this._result, runtimeBinding.getValue() as Vec4);
        }

        if (this._x) {
            this._result.x = this._x.evaluate(time);
        }
        if (this._y) {
            this._result.y = this._y.evaluate(time);
        }
        if (this._z) {
            this._result.z = this._z.evaluate(time);
        }
        if (this._w) {
            this._result.w = this._w.evaluate(time);
        }

        return this._result;
    }

    private _result: Vec4 = new Vec4();
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ColorTrack`)
export class ColorTrack extends Track {
    constructor () {
        super();
        this._channels = new Array(4) as ColorTrack['_channels'];
        for (let i = 0; i < this._channels.length; ++i) {
            const channel = new Channel<IntegerCurve>(new IntegerCurve());
            channel.name = 'R';
            this._channels[i] = channel;
        }
    }

    public getChannels () {
        return this._channels;
    }

    public [createEvalSymbol] () {
        return new ColorTrackEval(
            maskIfEmpty(this._channels[0].curve),
            maskIfEmpty(this._channels[1].curve),
            maskIfEmpty(this._channels[2].curve),
            maskIfEmpty(this._channels[3].curve),
        );
    }

    @serializable
    private _channels: [IntegerChannel, IntegerChannel, IntegerChannel, IntegerChannel];
}

class ColorTrackEval<TCurve extends IntegerCurve | RealCurve = IntegerCurve> {
    constructor (
        private _x: TCurve | undefined,
        private _y: TCurve | undefined,
        private _z: TCurve | undefined,
        private _w: TCurve | undefined,
    ) {

    }

    public evaluate (time: number, runtimeBinding: RuntimeBinding) {
        if ((!this._x || !this._y || !this._z || !this._w) && runtimeBinding.getValue) {
            Color.copy(this._result, runtimeBinding.getValue() as Color);
        }

        if (this._x) {
            this._result.r = this._x.evaluate(time);
        }
        if (this._y) {
            this._result.g = this._y.evaluate(time);
        }
        if (this._z) {
            this._result.b = this._z.evaluate(time);
        }
        if (this._w) {
            this._result.a = this._w.evaluate(time);
        }

        return this._result;
    }

    private _result: Color = new Color();
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}UntypedTrackChannel`)
class UntypedTrackChannel extends Channel<RealCurve> {
    @serializable
    public property!: string;

    constructor () {
        super(new RealCurve());
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}UntypedTrack`)
class UntypedTrack extends Track {
    @serializable
    private _channels: UntypedTrackChannel[] = [];

    public getChannels () {
        return this._channels;
    }

    public [createEvalSymbol] (runtimeBinding: RuntimeBinding) {
        if (!runtimeBinding.getValue) {
            throw new Error(`Can not decide type for untyped track: runtime binding does not provide a getter.`);
        }
        const trySearchCurve = (property: string) => this._channels.find((channel) => channel.property === property)?.curve;
        const value = runtimeBinding.getValue();
        switch (true) {
        case value instanceof Size:
        default:
            throw new Error(`Can not decide type for untyped track: got a unsupported value from runtime binding.`);
        case value instanceof Vec2:
            return new Vec2TrackEval(
                trySearchCurve('x'),
                trySearchCurve('y'),
            );
        case value instanceof Vec3:
            return new Vec3TrackEval(
                trySearchCurve('x'),
                trySearchCurve('y'),
                trySearchCurve('z'),
            );
        case value instanceof Vec4:
            return new Vec4TrackEval(
                trySearchCurve('x'),
                trySearchCurve('y'),
                trySearchCurve('z'),
                trySearchCurve('w'),
            );
        case value instanceof Color:
            // TODO: what if x, y, z, w?
            return new ColorTrackEval(
                trySearchCurve('r'),
                trySearchCurve('g'),
                trySearchCurve('b'),
                trySearchCurve('a'),
            );
        }
    }

    public addChannel (property: string): UntypedTrackChannel {
        const channel = new UntypedTrackChannel();
        channel.property = property;
        this._channels.push(channel);
        return channel;
    }
}

// #endregion

interface SkeletonAnimationBakeInfo {
    samples: number;

    frames: number;

    joints: Record<string, {
        transforms?: Mat4[];
    }>;
}

/**
 * @zh 动画剪辑表示一段使用动画编辑器编辑的关键帧动画或是外部美术工具生产的骨骼动画。
 * 它的数据主要被分为几层：轨道、关键帧和曲线。
 * @en The animation clip represents a sequence of key frame animation created with the animation editor or skeletal animation other DCC tools.
 * The data is divided in different levels: tracks, key frames, curves.
 */
@ccclass('cc.AnimationClip')
export class AnimationClip extends Asset {
    public static WrapMode = AnimationWrapMode;

    /**
     * @en Crate clip with a set of sprite frames
     * @zh 使用一组序列帧图片来创建动画剪辑
     * @example
     * ```
     * import { AnimationClip } from 'cc';
     * const clip = AnimationClip.createWithSpriteFrames(spriteFrames, 10);
     * ```
     */
    public static createWithSpriteFrames (spriteFrames: SpriteFrame[], sample: number) {
        const clip = new AnimationClip();
        clip.sample = sample || clip.sample;
        clip.duration = spriteFrames.length / clip.sample;
        const step = 1 / clip.sample;
        const track = new ObjectTrack<SpriteFrame>();
        track.path = [new ComponentPath('cc.Sprite'), 'spriteFrame'];
        const curve = track.getChannels()[0].curve;
        curve.assignSorted(spriteFrames.map((spriteFrame, index) => [step * index, spriteFrame]));
        return clip;
    }

    /**
     * @zh 动画帧率，单位为帧/秒。注意此属性仅用于编辑器动画编辑。
     * @en Animation frame rate: frames per second.
     * Note this property is only used for animation editing in Editor.
     */
    @serializable
    public sample = 60;

    /**
     * @zh 动画的播放速度。
     * @en Animation playback speed.
     */
    @serializable
    public speed = 1;

    /**
     * @zh 动画的循环模式。
     * @en Animation loop mode.
     */
    @serializable
    public wrapMode = AnimationWrapMode.Normal;

    /**
     * Sets if node TRS curves in this animation can be blended.
     * Normally this flag is enabled for model animation and disabled for other case.
     * @internal This is an internal slot. Never use it in your code.
     */
    @serializable
    public enableTrsBlending = false;

    /**
     * @zh 动画的周期。
     * @en Animation duration.
     */
    get duration () {
        return this._duration;
    }

    set duration (value) {
        this._duration = value;
    }

    /**
     * Gets the count of tracks this animation owns.
     */
    get tracksCount () {
        return this._tracks.length;
    }

    /**
     * Gets an iterable to tracks.
     */
    get tracks (): Iterable<Track> {
        return this._tracks;
    }

    /**
     * Gets or sets if compression is enabled for this animation.
     * When compression is enabled,
     * both space and performance may be optimized at production phase.
     * The price is that you can not flexible edit the animation at run time.
     */
    get compressionEnabled () {
        return this._compressionEnabled;
    }

    set compressionEnabled (value) {
        this._compressionEnabled = value;
    }

    get hash () {
        // hashes should already be computed offline, but if not, make one
        if (this._hash) { return this._hash; }
        const data = this._nativeAsset;
        const buffer = new Uint8Array(ArrayBuffer.isView(data) ? data.buffer : data);
        return this._hash = murmurhash2_32_gc(buffer, 666);
    }

    /**
     * @zh 动画包含的事件数据。
     * @en Associated event data.
     */
    get events () {
        return this._events;
    }

    set events (value) {
        this._events = value;

        const ratios: number[] = [];
        const eventGroups: IAnimationEventGroup[] = [];
        const events = this.events.sort((a, b) => a.frame - b.frame);
        for (const eventData of events) {
            const ratio = eventData.frame / this._duration;
            let i = ratios.findIndex((r) => r === ratio);
            if (i < 0) {
                i = ratios.length;
                ratios.push(ratio);
                eventGroups.push({
                    events: [],
                });
            }
            eventGroups[i].events.push({
                functionName: eventData.func,
                parameters: eventData.params,
            });
        }

        this._runtimeEvents = {
            ratios,
            eventGroups,
        };
    }

    public onLoaded () {
        this.frameRate = this.sample;
    }

    /**
     * Gets the time range this animation spans.
     * @returns The time range.
     */
    public getRange () {
        const range: Range = { min: Infinity, max: -Infinity };
        for (const track of this._tracks) {
            const trackRange = track.getRange();
            range.min = Math.min(range.min, trackRange.min);
            range.max = Math.max(range.max, trackRange.max);
        }
        return range;
    }

    /**
     * Gets the specified track.
     * @param index Index to the track.
     * @returns The track.
     */
    public getTrack (index: number) {
        return this._tracks[index];
    }

    /**
     * Adds a track into this animation.
     * @param track The track.
     * @returns Index to the track.
     */
    public addTrack (track: Track) {
        const index = this._tracks.length;
        this._tracks.push(track);
        return index;
    }

    /**
     * Removes a track from this animation.
     * @param index Index to the track.
     */
    public removeTrack (index: number) {
        this._tracks.splice(index, 1);
    }

    /**
     * Removes all tracks from this animation.
     */
    public clearTracks () {
        this._tracks.length = 0;
    }

    /**
     * Creates an event evaluator for this animation.
     * @param targetNode Target node used to fire events.
     * @returns @internal Do not use this in your code.
     */
    public createEventEvaluator (targetNode: Node) {
        return new EventEvaluator(
            targetNode,
            this._runtimeEvents.ratios,
            this._runtimeEvents.eventGroups,
            this.wrapMode,
        );
    }

    /**
     * Creates an evaluator for this animation.
     * @param context The context.
     * @returns The evaluator.
     * @internal Do not use this in your code.
     */
    public createEvaluator (context: AnimationClipEvalContext) {
        const {
            target,
        } = context;

        const binder: Binder = (trackPath: TrackPath, setter: IValueProxyFactory | undefined) => {
            const trackTarget = createGeneralBinding(
                target,
                trackPath,
                setter ?? undefined,
                this.enableTrsBlending ? context.pose : undefined,
                false,
            );
            // TODO: warning
            return trackTarget ?? undefined;
        };

        return this._createEvalWithBinder(target, binder, context.rootMotion);
    }

    /**
     * Compresses this animation.
     * @internal Do not use this in your code.
     */
    public compress () {
        const compressedData = new CompressedData();
        const compressedTracks = new Set<Track>();
        for (const track of this._tracks) {
            let mayBeCompressed = false;
            if (track instanceof RealTrack) {
                mayBeCompressed = compressedData.compressRealTrack(track);
            } else if (track instanceof VectorTrack) {
                mayBeCompressed = compressedData.compressVectorTrack(track);
            } else if (track instanceof QuaternionTrack) {
                mayBeCompressed = compressedData.compressQuatTrack(track);
            }
            if (mayBeCompressed) {
                compressedTracks.add(track);
            }
        }
        this._compression = {
            data: compressedData,
            compressedTracks: Array.from(compressedTracks),
        };
    }

    /**
     * @internal Do not use this in your code.
     */
    public purgeCompressedTracks () {
        const { _compression: compression } = this;
        if (!compression) {
            return;
        }
        const compressedTracks = compression.compressedTracks;
        if (!compressedTracks) {
            return;
        }
        this._tracks = this._tracks.filter((track) => !compressedTracks.includes(track));
        compression.compressedTracks = undefined;
    }

    public destroy () {
        if (legacyCC.director.root.dataPoolManager) {
            (legacyCC.director.root.dataPoolManager as DataPoolManager).releaseAnimationClip(this);
        }
        SkelAnimDataHub.destroy(this);
        return super.destroy();
    }

    public [BAKE_SKELETON_CURVE_SYMBOL] (start: number, samples: number, frames: number): SkeletonAnimationBakeInfo {
        const step = 1.0 / samples;

        const animatedJoints = this._collectAnimatedJoints();

        const jointsBakeInfo: Record<string, {
            transforms: Mat4[];
        }> = {};
        for (const joint of animatedJoints) {
            jointsBakeInfo[joint] = {
                transforms: Array.from({ length: frames }, () => new Mat4()),
            };
        }

        const skeletonFrames = animatedJoints.reduce((result, joint) => {
            result[joint] = new BoneGlobalTransform();
            return result;
        }, {} as Record<string, BoneGlobalTransform>);
        for (const joint of Object.keys(skeletonFrames)) {
            const skeletonFrame = skeletonFrames[joint];
            const parentJoint = joint.lastIndexOf('/');
            if (parentJoint >= 0) {
                const parentJointName = joint.substring(0, parentJoint);
                const parentJointFrame = skeletonFrames[parentJointName];
                if (!parentJointFrame) {
                    warn(`Seems like we have animation for ${joint} but are missing its parent joint ${parentJointName} in animation?`);
                } else {
                    skeletonFrame.parent = parentJointFrame;
                }
            }
        }

        const binder: Binder = (trackPath: TrackPath, setter: IValueProxyFactory | undefined) => {
            if (setter || !isTargetingTRS(trackPath)) {
                return undefined;
            }

            const { path } = trackPath[0];
            const jointFrame = skeletonFrames[path];
            if (!jointFrame) {
                return undefined;
            }

            return createBoneTransformBinding(jointFrame, trackPath[1]);
        };

        const evaluator = this._createEvalWithBinder(undefined, binder, undefined);

        for (let iFrame = 0; iFrame < frames; ++iFrame) {
            const time = start + step * iFrame;
            evaluator.evaluate(time);
            for (const joint of animatedJoints) {
                Mat4.copy(
                    jointsBakeInfo[joint].transforms[iFrame],
                    skeletonFrames[joint].globalTransform,
                );
            }
            for (const joint of animatedJoints) {
                skeletonFrames[joint].invalidate();
            }
        }

        return {
            samples,

            frames,

            joints: jointsBakeInfo,
        };
    }

    /**
     * Convert all untyped tracks into typed ones and delete the original.
     * @param refine How to decide the type on specified path.
     * @internal DO NOT USE THIS IN YOUR CODE.
     */
    public upgradeUntypedTracks (refine: (path: TrackPath, setter?: IValueProxyFactory) => 'vec2' | 'vec3' | 'vec4' | 'color' | 'size') {
        const newTracks: Track[] = [];
        for (const track of this._tracks) {
            if (!(track instanceof UntypedTrack)) {
                continue;
            }
            const untypedTrack = track;

            const trySearchChannel = (property: string, outChannel: RealChannel) => {
                const untypedChannel = untypedTrack.getChannels().find((channel) => channel.property === property);
                if (untypedChannel) {
                    outChannel.name = untypedChannel.name;
                    outChannel.curve.assignSorted(
                        Array.from(untypedChannel.curve.times()),
                        Array.from(untypedChannel.curve.values()),
                    );
                }
            };
            const kind = refine(track.path, track.setter);
            switch (kind) {
            default:
                continue;
            case 'vec2': case 'vec3': case 'vec4': {
                const track = new VectorTrack();
                newTracks.push(track);
                track.componentsCount = kind === 'vec2' ? 2 : kind === 'vec3' ? 3 : 4;
                const [x, y, z, w] = track.getChannels();
                switch (kind) {
                case 'vec4':
                    trySearchChannel('w', w);
                    // fall through
                case 'vec3':
                    trySearchChannel('z', z);
                    // fall through
                default:
                case 'vec2':
                    trySearchChannel('x', x);
                    trySearchChannel('y', y);
                }
                break;
            }
            case 'color': {
                const track = new ColorTrack();
                newTracks.push(track);
                const [r, g, b, a] = track.getChannels();
                trySearchChannel('r', r);
                trySearchChannel('g', g);
                trySearchChannel('b', b);
                trySearchChannel('a', a);
                // TODO: we need float-int conversion if xyzw
                trySearchChannel('x', r);
                trySearchChannel('y', g);
                trySearchChannel('z', b);
                trySearchChannel('w', a);
                break;
            }
            case 'size':
                break;
            }
        }
    }

    /**
     * Export for test.
     */
    public [searchForRootBonePathSymbol] () {
        return this._searchForRootBonePath();
    }

    // #region Legacy area
    // The following are significantly refactored and deprecated since 3.1.
    // We deprecates the direct exposure of keys, values, events.
    // Instead, we use track to organize them together.

    /**
     * @zh 曲线可引用的所有时间轴。
     * @en Frame keys referenced by curves.
     * @deprecated Since V3.1.
     */
    get keys () {
        return this._getLegacyData().keys;
    }

    set keys (value) {
        this._legacyDataDirty = true;
        this._getLegacyData().keys = value;
    }

    /**
     * @zh 此动画包含的所有曲线。
     * @en Curves this animation contains.
     * @deprecated Since V3.1.
     */
    get curves () {
        this._legacyDataDirty = true;
        return this._getLegacyData().curves;
    }

    set curves (value) {
        this._getLegacyData().curves = value;
    }

    /**
     * @deprecated Since V3.1.
     */
    get commonTargets () {
        return this._getLegacyData().commonTargets;
    }

    set commonTargets (value) {
        this._legacyDataDirty = true;
        this._getLegacyData().commonTargets = value;
    }

    /**
     * 此动画的数据。
     * @deprecated Since V3.1.
     */
    get data () {
        return this._getLegacyData().data;
    }

    /**
     * @internal
     * @deprecated Since V3.1.
     */
    public getPropertyCurves () {
        return this._getLegacyData().getPropertyCurves();
    }

    /**
     * @protected
     * @deprecated Since V3.1.
     */
    get eventGroups (): readonly IAnimationEventGroup[] {
        return this._runtimeEvents.eventGroups;
    }

    /**
     * @zh 提交事件数据的修改。
     * 当你修改了 `this.events` 时，必须调用 `this.updateEventDatas()` 使修改生效。
     * @en
     * Commit event data update.
     * You should call this function after you changed the `events` data to take effect.
     * @internal
     * @deprecated Since V3.1.
     */
    public updateEventDatas () {
        // EMPTY
    }

    /**
     * @zh 返回本动画是否包含事件数据。
     * @en Returns if this animation contains event data.
     * @protected
     */
    public hasEvents () {
        return this.events.length !== 0;
    }

    /**
     * Migrates legacy data into tracks.
     * @internal This method tend to be used as internal purpose or patch.
     * DO NOT use it in your code since it might be removed for the future at any time.
     * @deprecated Since V3.1.
     */
    public syncLegacyData () {
        if (this._legacyData) {
            this._fromLegacy(this._legacyData);
            this._legacyData = undefined;
        }
    }

    // #endregion

    @serializable
    private _duration = 0;

    @serializable
    private _hash = 0;

    private frameRate = 0;

    @serializable
    private _tracks: Track[] = [];

    @serializable
    private _compressionEnabled = false;

    @serializable
    private _compression: {
        data: CompressedData;
        compressedTracks: Track[] | undefined;
    } | undefined = undefined;

    private _legacyData: legacy.AnimationClipLegacyData | undefined = undefined;

    private _legacyDataDirty = false;

    @serializable
    private _events: AnimationClip.IEvent[] = [];

    private _runtimeEvents: {
        ratios: number[];
        eventGroups: IAnimationEventGroup[];
    } = {
        ratios: [],
        eventGroups: [],
    };

    private _createEvalWithBinder (target: unknown, binder: Binder, rootMotionOptions: RootMotionOptions | undefined) {
        if (this._legacyDataDirty) {
            this._legacyDataDirty = false;
            this.syncLegacyData();
        }

        const rootMotionTrackExcludes: Track[] = [];
        let rootMotionEvaluation: RootMotionEvaluation | undefined;
        if (rootMotionOptions) {
            rootMotionEvaluation = this._createRootMotionEvaluation(
                target,
                rootMotionOptions,
                rootMotionTrackExcludes,
            );
        }

        const trackEvalStatues: TrackEvalStatus[] = [];
        let compressedDataEvaluator: CompressedDataEvaluator | undefined;

        for (const track of this._tracks) {
            if (this._compression?.compressedTracks?.includes(track)) {
                continue;
            }
            if (rootMotionTrackExcludes.includes(track)) {
                continue;
            }
            const trackTarget = binder(track.path, track.setter);
            if (!trackTarget) {
                continue;
            }
            const trackEval = track[createEvalSymbol](trackTarget);
            trackEvalStatues.push({
                binding: trackTarget,
                trackEval,
            });
        }

        if (this._compression) {
            compressedDataEvaluator = this._compression.data.createEval(binder);
        }

        const evaluation = new AnimationClipEvaluation(
            trackEvalStatues,
            compressedDataEvaluator,
            rootMotionEvaluation,
        );

        return evaluation;
    }

    private _createRootMotionEvaluation (
        target: unknown,
        rootMotionOptions: RootMotionOptions,
        rootMotionTrackExcludes: Track[],
    ) {
        if (!(target instanceof Node)) {
            error(`Current context does not allow root motion.`);
            return undefined;
        }

        const rootBonePath = this._searchForRootBonePath();
        if (!rootBonePath) {
            warn(`Root motion is ignored since root bone could not be located in animation.`);
            return undefined;
        }

        const rootBone = target.getChildByPath(rootBonePath);
        if (!rootBone) {
            warn(`Root motion is ignored since the root bone could not be located in scene.`);
            return undefined;
        }

        // const { } = rootMotionOptions;

        const boneTransform = new BoneTransform();
        const rootMotionsTrackEvaluations: TrackEvalStatus[] = [];
        for (const track of this._tracks) {
            const { path: trackPath } = track;
            if (!isTargetingTRS(trackPath)) {
                continue;
            }
            const bonePath = trackPath[0].path;
            if (bonePath !== rootBonePath) {
                continue;
            }
            rootMotionTrackExcludes.push(track);
            const property = trackPath[1];
            const trackTarget = createBoneTransformBinding(boneTransform, property);
            if (!trackTarget) {
                continue;
            }
            const trackEval = track[createEvalSymbol](trackTarget);
            rootMotionsTrackEvaluations.push({
                binding: trackTarget,
                trackEval,
            });
        }
        const rootMotionEvaluation = new RootMotionEvaluation(
            rootBone,
            this._duration,
            boneTransform,
            rootMotionsTrackEvaluations,
        );

        return rootMotionEvaluation;
    }

    private _searchForRootBonePath () {
        const paths = this._tracks.map((track) => {
            if (isTargetingTRS(track.path)) {
                const { path } = track.path[0];
                return {
                    path,
                    rank: path.split('/').length,
                };
            } else {
                return {
                    path: '',
                    rank: 0,
                };
            }
        });

        paths.sort((a, b) => a.rank - b.rank);

        const iNonEmptyPath = paths.findIndex((p) => p.rank !== 0);
        if (iNonEmptyPath < 0) {
            return '';
        }

        const nPaths = paths.length;
        const firstPath = paths[iNonEmptyPath];
        let highestPathsAreSame = true;
        for (let iPath = iNonEmptyPath + 1; iPath < nPaths; ++iPath) {
            const path = paths[iPath];
            if (path.rank !== firstPath.rank) {
                break;
            }
            if (path.path !== firstPath.path) {
                highestPathsAreSame = false;
                break;
            }
        }

        return highestPathsAreSame ? firstPath.path : '';
    }

    private _getLegacyData () {
        if (!this._legacyData) {
            this._legacyData = this._toLegacy();
        }
        return this._legacyData;
    }

    private _toLegacy (): legacy.AnimationClipLegacyData {
        const keys: number[][] = [];
        const legacyCurves: legacy.LegacyClipCurve[] = [];
        const commonTargets: legacy.LegacyCommonTarget[] = [];

        const legacyClipData = new legacy.AnimationClipLegacyData(this._duration);
        legacyClipData.keys = keys;
        legacyClipData.curves = legacyCurves;
        legacyClipData.commonTargets = commonTargets;
        return legacyClipData;
    }

    private _fromLegacy (legacyData: legacy.AnimationClipLegacyData) {
        const newTracks: Track[] = [];

        const {
            keys: legacyKeys,
            curves: legacyCurves,
            commonTargets: legacyCommonTargets,
        } = legacyData;

        const untypedTracks = legacyCommonTargets.map((legacyCommonTarget) => {
            const track = new UntypedTrack();
            track.path = legacyCommonTarget.modifiers;
            track.setter = legacyCommonTarget.valueAdapter;
            newTracks.push(track);
            return track;
        });

        for (const legacyCurve of legacyCurves) {
            const legacyCurveData = legacyCurve.data;
            const legacyValues = legacyCurveData.values;
            if (legacyValues.length === 0) {
                // Legacy clip did not record type info.
                continue;
            }
            const legacyKeysIndex = legacyCurveData.keys;
            // Rule: negative index means single frame.
            const times = legacyKeysIndex < 0 ? [0.0] : legacyKeys[legacyCurveData.keys];
            const firstValue = legacyValues[0];
            // Rule: default to true.
            const interpolate = legacyCurveData ?? true;
            // Rule: _arrayLength only used for morph target, internally.
            assertIsTrue(typeof legacyCurveData._arrayLength !== 'number' || typeof firstValue === 'number');
            const legacyEasingMethodConverter = new legacy.LegacyEasingMethodConverter(legacyCurveData, times.length);

            const installPathAndSetter = (track: Track) => {
                track.path = legacyCurve.modifiers;
                track.setter = legacyCurve.valueAdapter;
            };

            let legacyCommonTargetCurve: RealCurve | undefined;
            if (typeof legacyCurve.commonTarget === 'number') {
                // Rule: common targets should only target Vectors/`Size`/`Color`.
                if (!legacyValues.every((value) => typeof value === 'number')) {
                    warn(`Incorrect curve.`);
                    continue;
                }
                // Rule: Each curve that has common target should be numeric curve and targets string property.
                if (legacyCurve.valueAdapter || legacyCurve.modifiers.length !== 1 || typeof legacyCurve.modifiers[0] !== 'string') {
                    warn(`Incorrect curve.`);
                    continue;
                }
                const propertyName = legacyCurve.modifiers[0];
                const untypedTrack = untypedTracks[legacyCurve.commonTarget];
                const { curve } = untypedTrack.addChannel(propertyName);
                legacyCommonTargetCurve = curve;
            }

            const convertCurve = () => {
                if (typeof firstValue === 'number') {
                    if (!legacyValues.every((value) => typeof value === 'number')) {
                        warn(`Misconfigured curve.`);
                        return;
                    }
                    let realCurve: RealCurve;
                    if (legacyCommonTargetCurve) {
                        realCurve = legacyCommonTargetCurve;
                    } else {
                        const track = new RealTrack();
                        installPathAndSetter(track);
                        newTracks.push(track);
                        realCurve = track.channel.curve;
                    }
                    const interpMethod = interpolate ? RealInterpMode.LINEAR : RealInterpMode.CONSTANT;
                    realCurve.assignSorted(times, (legacyValues as number[]).map((value) => new RealKeyframeValue({ value, interpMode: interpMethod })));
                    legacyEasingMethodConverter.convert(realCurve);
                    return;
                } else if (typeof firstValue === 'object') {
                    switch (true) {
                    default:
                        break;
                    case legacyValues.every((value) => value instanceof Vec2):
                    case legacyValues.every((value) => value instanceof Vec3):
                    case legacyValues.every((value) => value instanceof Vec4): {
                        type Vec4plus = Vec4[];
                        type Vec3plus = (Vec3 | Vec4)[];
                        type Vec2plus = (Vec2 | Vec3 | Vec4)[];
                        const components = firstValue instanceof Vec2 ? 2 : firstValue instanceof Vec3 ? 3 : 4;
                        const track = new VectorTrack();
                        installPathAndSetter(track);
                        track.componentsCount = components;
                        const [{ curve: x }, { curve: y }, { curve: z }, { curve: w }] = track.getChannels();
                        const interpMethod = interpolate ? RealInterpMode.LINEAR : RealInterpMode.CONSTANT;
                        const valueToFrame = (value: number): RealKeyframeValue => new RealKeyframeValue({ value, interpMode: interpMethod });
                        switch (components) {
                        case 4:
                            w.assignSorted(times, (legacyValues as Vec4plus).map((value) => valueToFrame(value.w)));
                            legacyEasingMethodConverter.convert(w);
                            // falls through
                        case 3:
                            z.assignSorted(times, (legacyValues as Vec3plus).map((value) => valueToFrame(value.z)));
                            legacyEasingMethodConverter.convert(z);
                            // falls through
                        default:
                            x.assignSorted(times, (legacyValues as Vec2plus).map((value) => valueToFrame(value.x)));
                            legacyEasingMethodConverter.convert(x);
                            y.assignSorted(times, (legacyValues as Vec2plus).map((value) => valueToFrame(value.y)));
                            legacyEasingMethodConverter.convert(y);
                            break;
                        }
                        newTracks.push(track);
                        return;
                    }
                    case legacyValues.every((value) => value instanceof Quat): {
                        assertIsTrue(legacyEasingMethodConverter.nil);
                        const track = new QuaternionTrack();
                        installPathAndSetter(track);
                        const interpMode = interpolate ? QuaternionInterpMode.SLERP : QuaternionInterpMode.CONSTANT;
                        track.channel.curve.assignSorted(times, (legacyValues as Quat[]).map((value) => ({
                            value: Quat.clone(value),
                            interpMode,
                        })));
                        newTracks.push(track);
                        return;
                    }
                    case legacyValues.every((value) => value instanceof Color): {
                        const track = new ColorTrack();
                        installPathAndSetter(track);
                        const [{ curve: r }, { curve: g }, { curve: b }, { curve: a }] = track.getChannels();
                        const interpMethod = interpolate ? RealInterpMode.LINEAR : RealInterpMode.CONSTANT;
                        const valueToFrame = (value: number): RealKeyframeValue => new RealKeyframeValue({ value, interpMode: interpMethod });
                        r.assignSorted(times, (legacyValues as Color[]).map((value) => valueToFrame(value.r)));
                        legacyEasingMethodConverter.convert(r);
                        g.assignSorted(times, (legacyValues as Color[]).map((value) => valueToFrame(value.g)));
                        legacyEasingMethodConverter.convert(g);
                        b.assignSorted(times, (legacyValues as Color[]).map((value) => valueToFrame(value.b)));
                        legacyEasingMethodConverter.convert(b);
                        a.assignSorted(times, (legacyValues as Color[]).map((value) => valueToFrame(value.a)));
                        legacyEasingMethodConverter.convert(a);
                        newTracks.push(track);
                        return;
                    }
                    case legacyValues.every((value) => value instanceof CubicSplineNumberValue): {
                        assertIsTrue(legacyEasingMethodConverter.nil);
                        const track = new RealTrack();
                        installPathAndSetter(track);
                        const interpMethod = interpolate ? RealInterpMode.CUBIC : RealInterpMode.CONSTANT;
                        track.channel.curve.assignSorted(times, (legacyValues as CubicSplineNumberValue[]).map((value) => new RealKeyframeValue({
                            value: value.dataPoint,
                            startTangent: value.inTangent,
                            endTangent: value.outTangent,
                            interpMode: interpMethod,
                        })));
                        newTracks.push(track);
                        return;
                    }
                    case legacyValues.every((value) => value instanceof CubicSplineVec2Value):
                    case legacyValues.every((value) => value instanceof CubicSplineVec3Value):
                    case legacyValues.every((value) => value instanceof CubicSplineVec4Value): {
                        assertIsTrue(legacyEasingMethodConverter.nil);
                        type Vec4plus = CubicSplineVec4Value[];
                        type Vec3plus = (CubicSplineVec3Value | CubicSplineVec4Value)[];
                        type Vec2plus = (CubicSplineVec2Value | CubicSplineVec3Value | CubicSplineVec4Value)[];
                        const components = firstValue instanceof CubicSplineVec2Value ? 2 : firstValue instanceof CubicSplineVec3Value ? 3 : 4;
                        const track = new VectorTrack();
                        installPathAndSetter(track);
                        track.componentsCount = components;
                        const [x, y, z, w] = track.getChannels();
                        const interpMethod = interpolate ? RealInterpMode.LINEAR : RealInterpMode.CONSTANT;
                        const valueToFrame = (value: number, startTangent: number, endTangent: number): RealKeyframeValue => new RealKeyframeValue({
                            value,
                            startTangent,
                            endTangent,
                            interpMode: interpMethod,
                        });
                        switch (components) {
                        case 4:
                            w.curve.assignSorted(times, (legacyValues as Vec4plus).map(
                                (value) => valueToFrame(value.dataPoint.w, value.inTangent.w, value.outTangent.w),
                            ));
                            // falls through
                        case 3:
                            z.curve.assignSorted(times, (legacyValues as Vec3plus).map(
                                (value) => valueToFrame(value.dataPoint.z, value.inTangent.z, value.outTangent.z),
                            ));
                            // falls through
                        default:
                            x.curve.assignSorted(times, (legacyValues as Vec2plus).map(
                                (value) => valueToFrame(value.dataPoint.y, value.inTangent.y, value.outTangent.y),
                            ));
                            y.curve.assignSorted(times, (legacyValues as Vec2plus).map(
                                (value) => valueToFrame(value.dataPoint.x, value.inTangent.x, value.outTangent.x),
                            ));
                            break;
                        }
                        newTracks.push(track);
                        return;
                    }
                    } // End switch
                }

                const objectTrack = new ObjectTrack();
                installPathAndSetter(objectTrack);
                objectTrack.channel.curve.assignSorted(times, legacyValues);
                newTracks.push(objectTrack);
            };

            convertCurve();
        }

        for (const track of newTracks) {
            this.addTrack(track);
        }
    }

    private _collectAnimatedJoints () {
        const joints = new Set<string>();

        for (const track of this._tracks) {
            if (!track.setter && isTargetingTRS(track.path)) {
                const { path } = track.path[0];
                joints.add(path);
            }
        }

        if (this._compression) {
            for (const joint of this._compression.data.collectAnimatedJoints()) {
                joints.add(joint);
            }
        }

        return Array.from(joints);
    }
}

legacyCC.AnimationClip = AnimationClip;

type Binder = (path: TrackPath, setter: IValueProxyFactory | undefined) => undefined | RuntimeBinding;

type RuntimeBinding = {
    setValue(value: unknown): void;

    getValue?(): unknown;
};

// #region Data compression

@ccclass(`${CLASS_NAME_PREFIX_ANIM}CompressedData`)
class CompressedData {
    public compressRealTrack (track: RealTrack) {
        const curve = track.channel.curve;
        const mayBeCompressed = KeySharedRealCurves.allowedForCurve(curve);
        if (!mayBeCompressed) {
            return false;
        }
        this._tracks.push({
            type: CompressedDataTrackType.FLOAT,
            path: track.path,
            setter: track.setter,
            components: [this._addRealCurve(curve)],
        });
        return true;
    }

    public compressVectorTrack (vectorTrack: VectorTrack) {
        const nComponents = vectorTrack.componentsCount;
        const channels = vectorTrack.getChannels();
        const mayBeCompressed = channels.every(({ curve }) => KeySharedRealCurves.allowedForCurve(curve));
        if (!mayBeCompressed) {
            return false;
        }
        const components = new Array<CompressedCurvePointer>(nComponents);
        for (let i = 0; i < nComponents; ++i) {
            const channel = channels[i];
            components[i] = this._addRealCurve(channel.curve);
        }
        this._tracks.push({
            type:
                nComponents === 2
                    ? CompressedDataTrackType.VEC2
                    : nComponents === 3
                        ? CompressedDataTrackType.VEC3
                        : CompressedDataTrackType.VEC4,
            path: vectorTrack.path,
            setter: vectorTrack.setter,
            components,
        });
        return true;
    }

    public compressQuatTrack (track: QuaternionTrack) {
        const curve = track.channel.curve;
        const mayBeCompressed = KeySharedQuaternionCurves.allowedForCurve(curve);
        if (!mayBeCompressed) {
            return false;
        }
        this._quatTracks.push({
            path: track.path,
            setter: track.setter,
            pointer: this._addQuaternionCurve(curve),
        });
        return true;
    }

    public createEval (binder: Binder) {
        const compressedDataEvalStatus: CompressedDataEvalStatus = {
            keySharedCurvesEvalStatuses: [],
            trackEvalStatuses: [],
            keysSharedQuatCurvesEvalStatues: [],
            quatTrackEvalStatuses: [],
        };

        const {
            keySharedCurvesEvalStatuses,
            trackEvalStatuses,
            keysSharedQuatCurvesEvalStatues,
            quatTrackEvalStatuses,
        } = compressedDataEvalStatus;

        for (const curves of this._curves) {
            keySharedCurvesEvalStatuses.push({
                curves,
                result: new Array(curves.curveCount).fill(0.0),
            });
        }

        for (const track of this._tracks) {
            const trackTarget = binder(track.path, track.setter);
            if (!trackTarget) {
                continue;
            }
            let immediate: CompressedTrackImmediate | undefined;
            switch (track.type) {
            default:
            case CompressedDataTrackType.FLOAT:
                break;
            case CompressedDataTrackType.VEC2:
                immediate = new Vec2();
                break;
            case CompressedDataTrackType.VEC3:
                immediate = new Vec3();
                break;
            case CompressedDataTrackType.VEC4:
                immediate = new Vec4();
                break;
            }
            trackEvalStatuses.push({
                type: track.type,
                target: trackTarget,
                curves: track.components,
                immediate,
            });
        }

        for (const curves of this._quatCurves) {
            keysSharedQuatCurvesEvalStatues.push({
                curves,
                result: Array.from({ length: curves.curveCount }, () => new Quat()),
            });
        }

        for (const track of this._quatTracks) {
            const trackTarget = binder(track.path, track.setter);
            if (!trackTarget) {
                continue;
            }
            quatTrackEvalStatuses.push({
                target: trackTarget,
                curve: track.pointer,
            });
        }

        return new CompressedDataEvaluator(compressedDataEvalStatus);
    }

    public collectAnimatedJoints () {
        const joints: string[] = [];

        for (const track of this._tracks) {
            if (!track.setter && isTargetingTRS(track.path)) {
                const { path } = track.path[0];
                joints.push(path);
            }
        }

        return joints;
    }

    @serializable
    private _curves: KeySharedRealCurves[] = [];

    @serializable
    private _tracks: CompressedTrack[] = [];

    @serializable
    private _quatCurves: KeySharedQuaternionCurves[] = [];

    @serializable
    private _quatTracks: CompressedQuatTrack[] = [];

    private _addRealCurve (curve: RealCurve): CompressedCurvePointer {
        const times = Array.from(curve.times());
        let iKeySharedCurves = this._curves.findIndex((shared) => shared.matchCurve(curve));
        if (iKeySharedCurves < 0) {
            iKeySharedCurves = this._curves.length;
            const keySharedCurves = new KeySharedRealCurves(times);
            this._curves.push(keySharedCurves);
        }
        const iCurve = this._curves[iKeySharedCurves].curveCount;
        this._curves[iKeySharedCurves].addCurve(curve);
        return {
            shared: iKeySharedCurves,
            component: iCurve,
        };
    }

    public _addQuaternionCurve (curve: QuaternionCurve): CompressedQuatCurvePointer {
        const times = Array.from(curve.times());
        let iKeySharedCurves = this._quatCurves.findIndex((shared) => shared.matchCurve(curve));
        if (iKeySharedCurves < 0) {
            iKeySharedCurves = this._quatCurves.length;
            const keySharedCurves = new KeySharedQuaternionCurves(times);
            this._quatCurves.push(keySharedCurves);
        }
        const iCurve = this._quatCurves[iKeySharedCurves].curveCount;
        this._quatCurves[iKeySharedCurves].addCurve(curve);
        return {
            shared: iKeySharedCurves,
            curve: iCurve,
        };
    }

    public validate () {
        return this._tracks.length > 0;
    }
}

class CompressedDataEvaluator {
    constructor (compressedDataEvalStatus: CompressedDataEvalStatus) {
        this._compressedDataEvalStatus = compressedDataEvalStatus;
    }

    public evaluate (time: number) {
        const {
            keySharedCurvesEvalStatuses,
            trackEvalStatuses: compressedTrackEvalStatuses,
            keysSharedQuatCurvesEvalStatues,
            quatTrackEvalStatuses,
        } = this._compressedDataEvalStatus;

        const getPreEvaluated = (pointer: CompressedCurvePointer) => keySharedCurvesEvalStatuses[pointer.shared].result[pointer.component];

        for (const { curves, result } of keySharedCurvesEvalStatuses) {
            curves.evaluate(time, result);
        }

        for (const { type, target, immediate, curves } of compressedTrackEvalStatuses) {
            let value: unknown = immediate;
            switch (type) {
            default:
                break;
            case CompressedDataTrackType.FLOAT:
                value = getPreEvaluated(curves[0]);
                break;
            case CompressedDataTrackType.VEC2:
                Vec2.set(
                    value as Vec2,
                    getPreEvaluated(curves[0]),
                    getPreEvaluated(curves[1]),
                );
                break;
            case CompressedDataTrackType.VEC3:
                Vec3.set(
                    value as Vec3,
                    getPreEvaluated(curves[0]),
                    getPreEvaluated(curves[1]),
                    getPreEvaluated(curves[2]),
                );
                break;
            case CompressedDataTrackType.VEC4:
                Vec4.set(
                    value as Vec4,
                    getPreEvaluated(curves[0]),
                    getPreEvaluated(curves[1]),
                    getPreEvaluated(curves[2]),
                    getPreEvaluated(curves[4]),
                );
                break;
            }
            target.setValue(value);
        }

        for (const { curves, result } of keysSharedQuatCurvesEvalStatues) {
            curves.evaluate(time, result);
        }

        for (const { target, curve } of quatTrackEvalStatuses) {
            target.setValue(keysSharedQuatCurvesEvalStatues[curve.shared].result[curve.curve]);
        }
    }

    private _compressedDataEvalStatus: CompressedDataEvalStatus;
}

interface CompressedTrack {
    path: TrackPath;
    setter: IValueProxyFactory | undefined;
    type: CompressedDataTrackType;
    components: CompressedCurvePointer[];
}

interface CompressedQuatTrack {
    path: TrackPath;
    setter: IValueProxyFactory | undefined;
    pointer: CompressedQuatCurvePointer;
}

enum CompressedDataTrackType {
    FLOAT,
    VEC2,
    VEC3,
    VEC4,
}

interface TrackEvalStatus {
    binding: RuntimeBinding;
    trackEval: TrackEval;
}

type CompressedTrackImmediate = Vec2 | Vec3 | Vec4;

interface CompressedDataEvalStatus {
    keySharedCurvesEvalStatuses: Array<{
        curves: KeySharedRealCurves;
        result: number[];
    }>;

    trackEvalStatuses: Array<{
        type: CompressedDataTrackType;
        target: RuntimeBinding;
        immediate: CompressedTrackImmediate | undefined;
        curves: CompressedCurvePointer[];
    }>;

    keysSharedQuatCurvesEvalStatues: Array<{
        curves: KeySharedQuaternionCurves;
        result: Quat[];
    }>;

    quatTrackEvalStatuses: Array<{
        target: RuntimeBinding;
        curve: CompressedQuatCurvePointer;
    }>;
}

interface CompressedCurvePointer {
    shared: number;
    component: number;
}

interface CompressedQuatCurvePointer {
    shared: number;
    curve: number;
}

// #endregion
interface AnimationClipEvalContext {
    /**
     * The output pose.
     */
    pose?: PoseOutput;

    /**
     * The root animating target(should be scene node now).
     */
    target: unknown;

    /**
     * Path to the root bone.
     */
    rootMotion?: RootMotionOptions;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RootMotionOptions {
}

class AnimationClipEvaluation {
    /**
     * @internal
     * @param trackEvalStatuses
     * @param compressedDataEvaluator
     */
    constructor (
        trackEvalStatuses: TrackEvalStatus[],
        compressedDataEvaluator: CompressedDataEvaluator | undefined,
        rootMotionEvaluation: RootMotionEvaluation | undefined,
    ) {
        this._trackEvalStatues = trackEvalStatuses;
        this._compressedDataEvaluator = compressedDataEvaluator;
        this._rootMotionEvaluation = rootMotionEvaluation;
    }

    /**
     * Evaluates this animation.
     * @param time The time.
     */
    public evaluate (time: number) {
        const {
            _trackEvalStatues: trackEvalStatuses,
            _compressedDataEvaluator: compressedDataEvaluator,
        } = this;

        for (const trackEvalStatus of trackEvalStatuses) {
            const value = trackEvalStatus.trackEval.evaluate(time, trackEvalStatus.binding);
            trackEvalStatus.binding.setValue(value);
        }

        if (compressedDataEvaluator) {
            compressedDataEvaluator.evaluate(time);
        }
    }

    /**
     * Gets the root bone motion.
     * @param startTime Start time.
     * @param endTime End time.
     */
    public evaluateRootMotion (time: number, motionLength: number) {
        const { _rootMotionEvaluation: rootMotionEvaluation } = this;
        if (rootMotionEvaluation) {
            rootMotionEvaluation.evaluate(time, motionLength);
        }
    }

    private _compressedDataEvaluator: CompressedDataEvaluator | undefined;
    private _trackEvalStatues:TrackEvalStatus[] = [];
    private _rootMotionEvaluation: RootMotionEvaluation | undefined = undefined;
}

class BoneTransform {
    public position = new Vec3();
    public scale = new Vec3(1.0, 1.0, 1.0);
    public rotation = new Quat();
    public eulerAngles = new Vec3();

    public getTransform (out: Mat4) {
        Mat4.fromRTS(out, this.rotation, this.position, this.scale);
    }
}

class BoneGlobalTransform extends BoneTransform {
    public parent: BoneGlobalTransform | null = null;

    public get globalTransform (): Readonly<Mat4> {
        const transform = this._transform;
        if (this._dirty) {
            this._dirty = false;
            Mat4.fromRTS(transform, this.rotation, this.position, this.scale);
            if (this.parent) {
                Mat4.multiply(transform, this.parent.globalTransform, transform);
            }
        }
        return this._transform;
    }

    public invalidate () {
        this._dirty = true;
    }

    private _dirty = true;
    private _transform = new Mat4();
}

const motionTransformCache = new Mat4();

class RootMotionEvaluation {
    constructor (
        private _rootBone: Node,
        private _duration: number,
        private _boneTransform: BoneTransform,
        private _trackEvalStatuses: TrackEvalStatus[],
    ) {

    }

    public evaluate (time: number, motionLength: number) {
        const motionTransform = this._calcMotionTransform(time, motionLength, this._motionTransformCache);

        const {
            _translationMotionCache: translationMotion,
            _rotationMotionCache: rotationMotion,
            _scaleMotionCache: scaleMotion,
            _rootBone: rootBone,
        } = this;

        Mat4.toRTS(motionTransform, rotationMotion, translationMotion, scaleMotion);

        Vec3.add(translationMotion, translationMotion, rootBone.position);
        rootBone.setPosition(translationMotion);

        Quat.multiply(rotationMotion, rotationMotion, rootBone.rotation);
        rootBone.setRotation(rotationMotion);

        Vec3.multiply(scaleMotion, scaleMotion, rootBone.scale);
        rootBone.setScale(scaleMotion);
    }

    private _calcMotionTransform (time: number, motionLength: number, outTransform: Mat4) {
        const { _duration: duration } = this;
        const remainLength = duration - time;
        assertIsTrue(remainLength >= 0);
        const startTransform = this._evaluateAt(time, this._startTransformCache);
        if (motionLength < remainLength) {
            const endTransform = this._evaluateAt(time + motionLength, this._endTransformCache);
            relativeTransform(outTransform, startTransform, endTransform);
        } else {
            Mat4.identity(outTransform);

            const accumulateMotionTransform = (from: Mat4, to: Mat4) => {
                relativeTransform(motionTransformCache, from, to);
                Mat4.multiply(outTransform, outTransform, motionTransformCache);
            };

            const diff = motionLength - remainLength;
            const repeatCount = Math.floor(diff / duration);
            const lastRemainTime = diff - repeatCount * duration;
            const clipStartTransform = this._evaluateAt(0, this._initialTransformCache);
            const clipEndTransform = this._evaluateAt(duration, this._clipEndTransformCache);
            const endTransform = this._evaluateAt(lastRemainTime, this._endTransformCache);

            // Start -> Clip End
            accumulateMotionTransform(startTransform, clipEndTransform);

            // Whole clip x Repeat Count
            relativeTransform(motionTransformCache, clipStartTransform, clipEndTransform);
            for (let i = 0; i < repeatCount; ++i) {
                Mat4.multiply(outTransform, outTransform, motionTransformCache);
            }

            // Clip Start -> End
            accumulateMotionTransform(clipStartTransform, endTransform);
        }
        return outTransform;
    }

    private _evaluateAt (time: number, outTransform: Mat4) {
        const {
            _trackEvalStatuses: trackEvalStatuses,
        } = this;

        for (const trackEvalStatus of trackEvalStatuses) {
            const value = trackEvalStatus.trackEval.evaluate(time, trackEvalStatus.binding);
            trackEvalStatus.binding.setValue(value);
        }

        this._boneTransform.getTransform(outTransform);
        return outTransform;
    }

    private _initialTransformCache = new Mat4();
    private _clipEndTransformCache = new Mat4();
    private _startTransformCache = new Mat4();
    private _endTransformCache = new Mat4();
    private _motionTransformCache = new Mat4();
    private _translationMotionCache = new Vec3();
    private _rotationMotionCache = new Quat();
    private _scaleMotionCache = new Vec3();
}

function relativeTransform (out: Mat4, from: Mat4, to: Mat4) {
    Mat4.invert(out, from);
    Mat4.multiply(out, to, out);
}

function createBoneTransformBinding (boneTransform: BoneTransform, property: TrsTrackPath[1]) {
    switch (property) {
    default:
        return undefined;
    case 'position':
        return {
            setValue (value: Vec3) {
                Vec3.copy(boneTransform.position, value);
            },
        };
    case 'rotation':
        return {
            setValue (value: Quat) {
                Quat.copy(boneTransform.rotation, value);
            },
        };
    case 'scale':
        return {
            setValue (value: Vec3) {
                Vec3.copy(boneTransform.scale, value);
            },
        };
    case 'eulerAngles':
        return {
            setValue (value: Vec3) {
                Vec3.copy(boneTransform.eulerAngles, value);
            },
        };
    }
}

/**
 * Bind runtime target. Especially optimized for skeletal case.
 */
function createGeneralBinding (
    rootTarget: unknown,
    path: TrackPath,
    setter: IValueProxyFactory | undefined,
    poseOutput: PoseOutput | undefined,
    isConstant: boolean,
): RuntimeBinding | null {
    if (!isTargetingTRS(path) || !poseOutput) {
        return createRuntimeBinding(rootTarget, path, setter);
    } else {
        const targetNode = evaluatePath(rootTarget, ...path.slice(0, path.length - 1));
        if (targetNode !== null && targetNode instanceof Node) {
            const propertyName = path[path.length - 1] as 'position' | 'rotation' | 'scale' | 'eulerAngles';
            const blendStateWriter = poseOutput.createPoseWriter(targetNode, propertyName, isConstant);
            return blendStateWriter;
        }
    }
    return null;
}

type TrsTrackPath = [HierarchyPath, 'position' | 'rotation' | 'scale' | 'eulerAngles'];

function isTargetingTRS (path: TargetPath[]): path is TrsTrackPath {
    let prs: string | undefined;
    if (path.length === 1 && typeof path[0] === 'string') {
        prs = path[0];
    } else if (path.length > 1) {
        for (let i = 0; i < path.length - 1; ++i) {
            if (!(path[i] instanceof HierarchyPath)) {
                return false;
            }
        }
        prs = path[path.length - 1] as string;
    }
    switch (prs) {
    case 'position':
    case 'scale':
    case 'rotation':
    case 'eulerAngles':
        return true;
    default:
        return false;
    }
}

function createRuntimeBinding (target: unknown, trackPath: TrackPath, setter?: IValueProxyFactory): null | RuntimeBinding {
    const lastPath = trackPath[trackPath.length - 1];
    if (trackPath.length !== 0 && isPropertyPath(lastPath) && !setter) {
        const resultTarget = evaluatePath(target, ...trackPath.slice(0, trackPath.length - 1));
        if (resultTarget === null) {
            return null;
        }
        return {
            setValue: (value) => {
                resultTarget[lastPath] = value;
            },
            // eslint-disable-next-line arrow-body-style
            getValue: () => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return resultTarget[lastPath];
            },
        };
    } else if (!setter) {
        error(
            `You provided a ill-formed track path.`
            + `The last component of track path should be property key, or the setter should not be empty.`,
        );
        return null;
    } else {
        const resultTarget = evaluatePath(target, ...trackPath);
        if (resultTarget === null) {
            return null;
        }
        const proxy = setter.forTarget(resultTarget);
        const binding: RuntimeBinding = {
            setValue: (value) => {
                proxy.set(value);
            },
        };
        const proxyGet = proxy.get;
        if (proxyGet) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            binding.getValue = () => proxyGet.call(proxy);
        }
        return binding;
    }
}

// #region Events

interface IAnimationEvent {
    functionName: string;
    parameters: string[];
}

interface IAnimationEventGroup {
    events: IAnimationEvent[];
}

const InvalidIndex = -1;

class EventEvaluator {
    constructor (
        private _targetNode: Node,
        private _ratios: readonly number[],
        private _eventGroups: readonly IAnimationEventGroup[],
        private _wrapMode: WrapMode,
    ) {

    }

    public setWrapMode (wrapMode: WrapMode) {
        this._wrapMode = wrapMode;
    }

    public ignore (ratio: number, direction: number) {
        this._ignoreIndex = InvalidIndex;
        this._sampled = false;

        let frameIndex = getEventGroupIndexAtRatio(ratio, this._ratios);

        // only ignore when time not on a frame index
        if (frameIndex < 0) {
            frameIndex = ~frameIndex - 1;

            // if direction is inverse, then increase index
            if (direction < 0) { frameIndex += 1; }

            this._ignoreIndex = frameIndex;
        }
    }

    public sample (ratio: number, direction: number, iterations: number) {
        const length = this._eventGroups.length;
        let eventIndex = getEventGroupIndexAtRatio(ratio, this._ratios);
        if (eventIndex < 0) {
            eventIndex = ~eventIndex - 1;
            // If direction is inverse, increase index.
            if (direction < 0) {
                eventIndex += 1;
            }
        }

        if (this._ignoreIndex !== eventIndex) {
            this._ignoreIndex = InvalidIndex;
        }

        if (!this._sampled) {
            this._sampled = true;
            this._doFire(eventIndex, false);
            this._lastFrameIndex = eventIndex;
            this._lastIterations = iterations;
            this._lastDirection = direction;
            return;
        }

        const wrapMode = this._wrapMode;
        const currentIterations = wrapIterations(iterations);

        let lastIterations = wrapIterations(this._lastIterations);
        let lastIndex = this._lastFrameIndex;
        const lastDirection = this._lastDirection;

        const iterationsChanged = lastIterations !== -1 && currentIterations !== lastIterations;

        if (lastIndex === eventIndex && iterationsChanged && length === 1) {
            this._doFire(0, false);
        } else if (lastIndex !== eventIndex || iterationsChanged) {
            direction = lastDirection;

            do {
                if (lastIndex !== eventIndex) {
                    if (direction === -1 && lastIndex === 0 && eventIndex > 0) {
                        if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
                            direction *= -1;
                        } else {
                            lastIndex = length;
                        }
                        lastIterations++;
                    } else if (direction === 1 && lastIndex === length - 1 && eventIndex < length - 1) {
                        if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
                            direction *= -1;
                        } else {
                            lastIndex = -1;
                        }
                        lastIterations++;
                    }

                    if (lastIndex === eventIndex) {
                        break;
                    }
                    if (lastIterations > currentIterations) {
                        break;
                    }
                }

                lastIndex += direction;
                this._doFire(lastIndex, true);
            } while (lastIndex !== eventIndex && lastIndex > -1 && lastIndex < length);
        }

        this._lastFrameIndex = eventIndex;
        this._lastIterations = iterations;
        this._lastDirection = direction;
    }

    private _lastFrameIndex = -1;
    private _lastIterations = 0.0;
    private _lastDirection = 0;
    private _ignoreIndex = InvalidIndex;
    private _sampled = false;

    private _doFire (eventIndex: number, delay: boolean) {
        if (delay) {
            legacyCC.director.getAnimationManager().pushDelayEvent(this._checkAndFire, this, [eventIndex]);
        } else {
            this._checkAndFire(eventIndex);
        }
    }

    private _checkAndFire (eventIndex: number) {
        if (!this._targetNode || !this._targetNode.isValid) {
            return;
        }

        const { _eventGroups: eventGroups } = this;
        if (eventIndex < 0 || eventIndex >= eventGroups.length || this._ignoreIndex === eventIndex) {
            return;
        }

        const eventGroup = eventGroups[eventIndex];
        const components = this._targetNode.components;
        for (const event of eventGroup.events) {
            const { functionName } = event;
            for (const component of components) {
                const fx = component[functionName];
                if (typeof fx === 'function') {
                    fx.apply(component, event.parameters);
                }
            }
        }
    }
}

function wrapIterations (iterations: number) {
    if (iterations - (iterations | 0) === 0) {
        iterations -= 1;
    }
    return iterations | 0;
}

function getEventGroupIndexAtRatio (ratio: number, ratios: readonly number[]) {
    const result = binarySearchEpsilon(ratios, ratio);
    return result;
}

// #endregion
