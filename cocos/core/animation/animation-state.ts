/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { Node } from '../scene-graph/node';
import { AnimationClip, IAnimationEventGroup, IRuntimeCurve } from './animation-clip';
import { AnimCurve, RatioSampler } from './animation-curve';
import { createBoundTarget, createBufferedTarget, IBufferedTarget, IBoundTarget } from './bound-target';
import { Playable } from './playable';
import { WrapMode, WrapModeMask } from './types';
import { HierarchyPath, evaluatePath, TargetPath } from './target-path';
import { BlendStateBuffer, createBlendStateWriter, IBlendStateWriter } from '../../3d/skeletal-animation/skeletal-animation-blending';
import { legacyCC } from '../global-exports';
import { ccenum } from '../value-types/enum';
import { IValueProxyFactory } from './value-proxy';
import { assertIsTrue } from '../data/utils/asserts';
import { getGlobalAnimationStateContext } from './utils/global-context';
import { DEFAULT_EPSILON } from './epsilon';

/**
 * @en The event type supported by Animation
 * @zh Animation 支持的事件类型。
 */
export enum EventType {
    /**
     * @en Emit when begin playing animation
     * @zh 开始播放时触发。
     */
    PLAY = 'play',
    /**
     * @en Emit when stop playing animation
     * @zh 停止播放时触发。
     */
    STOP = 'stop',
    /**
     * @en Emit when pause animation
     * @zh 暂停播放时触发。
     */
    PAUSE = 'pause',
    /**
     * @en Emit when resume animation
     * @zh 恢复播放时触发。
     */
    RESUME = 'resume',

    /**
     * @en If animation repeat count is larger than 1, emit every time the animation playback finished once iteration.
     * @zh 假如动画循环次数大于 1，每当动画完成一次迭代后触发。
     */
    ITERATION_END = 'lastframe', // cspell:disable-line lastframe

    /**
     * @en Synonym(misspelled) of `ITERATION_END`.
     * @zh `ITERATION_END` 的同义词。
     * @deprecated Since V3.1. Use `ITERATION_END` instead.
     */
    LASTFRAME = ITERATION_END, // cspell:disable-line LASTFRAME

    /**
     * @en Triggered when finish playing animation.
     * @zh 动画完成播放时触发。
     */
    FINISHED = 'finished',
}
ccenum(EventType);
export class ICurveInstance {
    public commonTargetIndex?: number;

    private _curve: AnimCurve;
    private _boundTarget: IBoundTarget;
    private _rootTargetProperty?: string;
    private _curveDetail: Omit<IRuntimeCurve, 'sampler'>;

    constructor (
        runtimeCurve: Omit<IRuntimeCurve, 'sampler'>,
        target: any,
        boundTarget: IBoundTarget,
    ) {
        this._curve = runtimeCurve.curve;
        this._curveDetail = runtimeCurve;

        this._boundTarget = boundTarget;
    }

    public applySample (ratio: number, index: number, lerpRequired: boolean, samplerResultCache, weight: number) {
        if (this._curve.empty()) {
            return;
        }
        let value: any;
        if (!this._curve.hasLerp() || !lerpRequired) {
            value = this._curve.valueAt(index);
        } else {
            value = this._curve.valueBetween(
                ratio,
                samplerResultCache.from,
                samplerResultCache.fromRatio,
                samplerResultCache.to,
                samplerResultCache.toRatio,
            );
        }
        this._setValue(value, weight);
    }

    private _setValue (value: any, weight: number) {
        this._boundTarget.setValue(value);
    }

    get propertyName () { return this._rootTargetProperty || ''; }

    get curveDetail () {
        return this._curveDetail;
    }
}

/**
 * The curves in ISamplerSharedGroup share a same keys.
 */
interface ISamplerSharedGroup {
    sampler: RatioSampler | null;
    curves: ICurveInstance[];
    samplerResultCache: {
        from: number;
        fromRatio: number;
        to: number;
        toRatio: number;
    };
}

function makeSamplerSharedGroup (sampler: RatioSampler | null): ISamplerSharedGroup {
    return {
        sampler,
        curves: [],
        samplerResultCache: {
            from: 0,
            fromRatio: 0,
            to: 0,
            toRatio: 0,
        },
    };
}

const InvalidIndex = -1;

const nullIteration = -1;

/**
 * @en
 * The AnimationState gives full control over animation playback process.
 * In most cases the Animation Component is sufficient and easier to use. Use the AnimationState if you need full control.
 * @zh
 * AnimationState 完全控制动画播放过程。<br/>
 * 大多数情况下 动画组件 是足够和易于使用的。如果您需要更多的动画控制接口，请使用 AnimationState。
 *
 */
export class AnimationState extends Playable {
    /**
     * @en The clip that is associated with this animation state.
     * @zh 此动画状态关联的剪辑。
     */
    get clip () {
        return this._clip;
    }

    /**
     * @en The name of the animation state.
     * @zh 此动画状态的名字。
     */
    get name () {
        return this._name;
    }

    /**
     * @en The iteration duration of this animation in seconds. It's a synonymy of `this.duration`.
     * @zh 单次动画的持续时间，单位为秒。和 `this.duration` 同义。
     */
    get length () {
        return this.duration;
    }

    /**
     * @en
     * Gets or sets the wrapping mode of the animation playback.
     * The initial wrapping mode is what set to the clip.
     * @note When set wrapping mode, the accumulated playback time and repeat count got reset:
     * Setting wrapping mode as `AnimationClip.WrapMode.Normal` or `AnimationClip.WrapMode.Reverse` would reset the repeat count as `1`,
     * Otherwise, the repeat count is reset as `Infinity`(infinite repeat count).
     * @zh
     * 获取或设置动画播放的循环模式。
     * 初始的循环模式将从动画剪辑中读取。
     * @note 设置循环模式时，会重置累计播放时间和重复次数：
     * 设置循环模式为 `AnimationClip.WrapMode.Normal` 或 `AnimationClip.WrapMode.Reverse` 时重复次数将被重置为 `1`，
     * 其余循环模式将重置重复次数为 `Infinity`（无限次）。
     */
    get wrapMode () {
        return this._wrapMode;
    }

    set wrapMode (value: WrapMode) {
        this._wrapMode = value;
        this.time = 0;
        if (value & WrapModeMask.Loop) {
            this.repeatCount = Infinity;
        } else {
            this.repeatCount = 1;
        }
    }

    /**
     * @en The playback's repeat count.
     * It may be used to qualify the iteration count of various playback wrapping mode into limited count.
     * The initial repeat count is decided by the initial wrapping mode.
     * @zh 播放的重复次数，可以用来限定各种播放循环模式的迭代次数。
     * 初始的重复次数是由初始的循环模式决定的。
     */
    get repeatCount () {
        return this._repeatCount;
    }

    set repeatCount (value: number) {
        this._repeatCount = value;

        const shouldWrap = this._wrapMode & WrapModeMask.ShouldWrap;
        const reverse = (this.wrapMode & WrapModeMask.Reverse) === WrapModeMask.Reverse;
        if (value === Infinity && !shouldWrap && !reverse) {
            this._isIfl = true;
            this._currentPosition.setAsIfl();
        } else {
            this._isIfl = false;
        }
    }

    /**
     * @en The start delay which represents the number of seconds from an animation's start time to the start of
     * the active interval.
     * @zh 延迟多少秒播放。
     * @default 0
     */
    get delay () {
        return this._delay;
    }

    set delay (value: number) {
        this._delayTime = this._delay = value;
    }

    /**
     * @en The duration of the clip, in seconds.
     * @zh 动画剪辑的周期，单位为秒。
     */
    get duration () {
        return this.clip.duration;
    }

    /**
     * @en The animation's playback speed.
     * @zh 播放速率。
     * @default 1.0
     */
    public speed = 1;

    /**
     * @en The accumulated time of this animation in seconds.
     * Negative accumulated time behaves specially.
     * @zh 动画当前**累计播放**的时间，单位为秒。
     * 累计播放时间为负值时具有特殊的含义。
     * @default 0
     */
    get time () {
        return this._time;
    }

    /**
     * @en Sets the accumulated time of this animation in seconds.
     * @zh 设置动画的 **累计播放** 时间，单位为秒。
     */
    set time (value) {
        this._setTime(value);
        this._currentSampled = false;
    }

    /**
     * @en Gets the time progress, in seconds.
     * @zh 获取动画的时间进度，单位为秒。
     */
    get current () {
        return this._currentPosition.time;
    }

    /**
     * @en Gets the playback ratio.
     * @zh 获取动画播放的比例时间。
     */
    get ratio () {
        return this._currentPosition.ratio;
    }

    /**
     * The weight.
     */
    public weight = 0;

    /**
     * @en
     * The editing frame rate, in FPS.
     * @zh
     * 此动画状态的编辑帧率，单位为帧每秒。
     */
    public frameRate = 0;

    /**
     * This field is only visible from within internal.
     */
    protected _targetNode: Node | null = null;

    /**
     * This field is only visible from within internal.
     */
    protected _curveLoaded = false;

    private _clip: AnimationClip;
    private _context: AnimationState.Context;
    private _time = 0;
    private _samplerSharedGroups: ISamplerSharedGroup[] = [];
    private _target: Node | null = null;
    /**
     * May be `null` due to failed to initialize.
     */
    private _commonTargetStatuses: (null | {
        target: IBufferedTarget;
        changed: boolean;
    })[] = [];
    private _wrapMode = WrapMode.Normal;
    private _repeatCount = 1;
    /**
     * Is current in infinity forward loop mode.
     */
    private _isIfl = false;
    private _delay = 0;
    private _delayTime = 0;
    private _name: string;
    private _currentPosition = new PlaybackPosition();
    /**
     * Whether current time has been sampled.
     * If not, we won't take the next time update through `update()` call.
     */
    private _currentSampled = false;
    private _blendStateBuffer: BlendStateBuffer | null = null;
    private _blendStateWriters: IBlendStateWriter[] = [];
    private _ignoreIndex = InvalidIndex;
    private _blendStateWriterHost = {
        weight: 0,
        enabled: false,
    };

    /**
     * @zh
     * 创建一个用于播放动画剪辑的动画状态对象。
     * @en
     * Creates an animation state object that is used to play the specified animation clip.
     * @param context The animation state's context.
     * @param clip The associated animation clip.
     * @param name Name of the animation state. If not specified or is empty, the clip's name would be taken.
     */
    constructor (context: AnimationState.Context, clip: AnimationClip, name?: string);

    /**
     * @zh
     * 创建一个用于播放动画剪辑的动画状态对象。将使用全局上下文。
     * @en
     * Creates an animation state object that is used to play the specified animation clip.
     * The context would be set to global context.
     * @param clip The associated animation clip.
     * @param name Name of the animation state. If not specified or is empty, the clip's name would be taken.
     */
    constructor (clip: AnimationClip, name?: string);

    constructor (
        contextOrClip: AnimationState.Context | AnimationClip,
        clipOrName: AnimationClip | string | undefined,
        name?: string,
    ) {
        super();
        if (typeof clipOrName === 'object') {
            this._clip = clipOrName;
            this._context = contextOrClip as AnimationState.Context;
        } else {
            this._clip = contextOrClip as AnimationClip;
            this._context = getGlobalAnimationStateContext();
            name = clipOrName;
        }
        this._name = name || this._clip.name;
    }

    /**
     * This method is used for internal purpose only.
     */
    get curveLoaded () {
        return this._curveLoaded;
    }

    /**
     * This method is used for internal purpose only.
     */
    public initialize (root: Node, propertyCurves?: readonly IRuntimeCurve[]) {
        if (this._curveLoaded) { return; }
        this._curveLoaded = true;
        this._destroyBlendStateWriters();
        this._samplerSharedGroups.length = 0;
        this._blendStateBuffer = this._context.blendStateBuffer ?? null;
        if (this._blendStateBuffer) {
            this._blendStateBuffer.bindState(this);
        }
        this._targetNode = root;
        const clip = this._clip;

        this.speed = clip.speed;
        this.wrapMode = clip.wrapMode;
        this.frameRate = clip.sample;

        if ((this.wrapMode & WrapModeMask.Loop) === WrapModeMask.Loop) {
            this.repeatCount = Infinity;
        } else {
            this.repeatCount = 1;
        }

        /**
         * Create the bound target. Especially optimized for skeletal case.
         */
        const createBoundTargetOptimized = <BoundTargetT extends IBoundTarget>(
            createFn: (...args: Parameters<typeof createBoundTarget>) => BoundTargetT | null,
            rootTarget: any,
            path: TargetPath[],
            valueAdapter: IValueProxyFactory | undefined,
            isConstant: boolean,
        ): BoundTargetT | null => {
            if (!isTargetingTRS(path) || !this._blendStateBuffer) {
                return createFn(rootTarget, path, valueAdapter);
            } else {
                const targetNode = evaluatePath(rootTarget, ...path.slice(0, path.length - 1));
                if (targetNode !== null && targetNode instanceof Node) {
                    const propertyName = path[path.length - 1] as 'position' | 'rotation' | 'scale' | 'eulerAngles';
                    const blendStateWriter = createBlendStateWriter(
                        this._blendStateBuffer,
                        targetNode,
                        propertyName,
                        this._blendStateWriterHost,
                        isConstant,
                    );
                    this._blendStateWriters.push(blendStateWriter);
                    return createFn(rootTarget, [], blendStateWriter);
                }
            }
            return null;
        };

        this._commonTargetStatuses = clip.commonTargets.map((commonTarget, index) => {
            const target = createBoundTargetOptimized(
                createBufferedTarget,
                root,
                commonTarget.modifiers,
                commonTarget.valueAdapter,
                false,
            );
            if (target === null) {
                return null;
            } else {
                return {
                    target,
                    changed: false,
                };
            }
        });

        if (!propertyCurves) {
            propertyCurves = clip.getPropertyCurves();
        }
        for (let iPropertyCurve = 0; iPropertyCurve < propertyCurves.length; ++iPropertyCurve) {
            const propertyCurve = propertyCurves[iPropertyCurve];
            let samplerSharedGroup = this._samplerSharedGroups.find((value) => value.sampler === propertyCurve.sampler);
            if (!samplerSharedGroup) {
                samplerSharedGroup = makeSamplerSharedGroup(propertyCurve.sampler);
                this._samplerSharedGroups.push(samplerSharedGroup);
            }

            let rootTarget: any;
            if (typeof propertyCurve.commonTarget === 'undefined') {
                rootTarget = root;
            } else {
                const commonTargetStatus = this._commonTargetStatuses[propertyCurve.commonTarget];
                if (!commonTargetStatus) {
                    continue;
                }
                rootTarget = commonTargetStatus.target.peek();
            }

            const boundTarget = createBoundTargetOptimized(
                createBoundTarget,
                rootTarget,
                propertyCurve.modifiers,
                propertyCurve.valueAdapter,
                propertyCurve.curve.constant(),
            );

            if (boundTarget === null) {
                // warn(`Failed to bind "${root.name}" to curve in clip ${clip.name}: ${err}`);
            } else {
                const curveInstance = new ICurveInstance(
                    propertyCurve,
                    rootTarget,
                    boundTarget,
                );
                curveInstance.commonTargetIndex = propertyCurve.commonTarget;
                samplerSharedGroup.curves.push(curveInstance);
            }
        }
    }

    public destroy () {
        this._destroyBlendStateWriters();
    }

    /**
     * @private
     */
    public onBlendFinished () {
        this._blendStateWriterHost.enabled = false;
    }

    /**
     * @zh
     * 等价于 `this.time = time`。
     * @en
     * Equivalent to `this.time = time`.
     * @deprecated Since V3.1. Directly set `this.time` or `this.current` instead.
     * @param time The time to set.
     */
    public setTime (time: number) {
        this.time = time;
    }

    /**
     * @zh 步进播放时间并进行采样。
     * 注意，此方法可能受“完美首帧”机制影响导致时间并没有改变：
     * 在动画状态初始时或通过 `this.time` 显式地设置播放时间后，
     * 只要未进行过播放（无论是通过 `update()` 还是 `sample()`），
     * 那么下次 `update()` 时不会改变播放时间，而是仅仅应用彼时的状态。
     * 这是为了确保在动画映入眼帘时不会突兀地调过首帧。
     * 要避免完美首帧，需要确保更新后的时间已被应用。例如，通过 `sample()` 调用。
     * @en Steps the playback time and do sampling.
     * Note, this method may be affected by the "perfect first frame" mechanism:
     * when the animation state is in initial state or its time got explicitly set through `this.time`
     * and never been played(thought whatever `update()` or `sample()`),
     * the next `update()` call would not change the play time but only apply then time.
     * The reason for this is to prevent the first frame from being suddenly skipped as the animation came into view.
     * To avoid the perfect first frame,
     * ensure the updated time has been applied. For example, through `sample()` call.
     * @param delta The delta time, in seconds.
     */
    public update (delta: number) {
        if (this._delayTime > 0) {
            this._delayTime -= delta;
            if (this._delayTime > 0) {
                return;
            }
        }

        const {
            ratio: lastRatio,
            iterations: lastIterations,
            forwarding: lastForwarding,
        } = this._currentPosition;
        const lastPositionSampled = this._currentSampled;

        if (lastPositionSampled) {
            const time = this._time + delta * this.speed;
            this._setTime(time);
        }

        this.sample();

        if (lastPositionSampled) {
            this._countEvents(lastRatio, lastIterations, lastForwarding);
        } else {
            const index = this._clip.getEventGroupIndexAtRatio(this._currentPosition.ratio);
            if (index >= 0) {
                this._triggerEventsInIndexRange(index, index, true);
            }
        }
    }

    /**
     * 立即执行一次采样。
     */
    public sample () {
        this._currentSampled = true;
        this._sampleCurves(this._currentPosition.ratio);
    }

    protected onPlay () {
        this.setTime(0);
        this._delayTime = this._delay;
        this._onReplayOrResume();
        this._context.emit?.(EventType.PLAY, this);
    }

    protected onStop () {
        if (!this.isPaused) {
            this._onPauseOrStop();
        }
        this._context.emit?.(EventType.STOP, this);
    }

    protected onResume () {
        this._onReplayOrResume();
        this._context.emit?.(EventType.RESUME, this);
    }

    protected onPause () {
        this._onPauseOrStop();
        this._context.emit?.(EventType.PAUSE, this);
    }

    protected _sampleCurves (ratio: number) {
        this._blendStateWriterHost.weight = this.weight;
        this._blendStateWriterHost.enabled = true;

        // Before we sample, we pull values of common targets.
        for (let iCommonTarget = 0; iCommonTarget < this._commonTargetStatuses.length; ++iCommonTarget) {
            const commonTargetStatus = this._commonTargetStatuses[iCommonTarget];
            if (!commonTargetStatus) {
                continue;
            }
            commonTargetStatus.target.pull();
            commonTargetStatus.changed = false;
        }

        for (let iSamplerSharedGroup = 0, szSamplerSharedGroup = this._samplerSharedGroups.length;
            iSamplerSharedGroup < szSamplerSharedGroup; ++iSamplerSharedGroup) {
            const samplerSharedGroup = this._samplerSharedGroups[iSamplerSharedGroup];
            const sampler = samplerSharedGroup.sampler;
            const { samplerResultCache } = samplerSharedGroup;
            let index = 0;
            let lerpRequired = false;
            if (!sampler) {
                index = 0;
            } else {
                index = sampler.sample(ratio);
                if (index < 0) {
                    index = ~index;
                    if (index <= 0) {
                        index = 0;
                    } else if (index >= sampler.ratios.length) {
                        index = sampler.ratios.length - 1;
                    } else {
                        lerpRequired = true;
                        samplerResultCache.from = index - 1;
                        samplerResultCache.fromRatio = sampler.ratios[samplerResultCache.from];
                        samplerResultCache.to = index;
                        samplerResultCache.toRatio = sampler.ratios[samplerResultCache.to];
                        index = samplerResultCache.from;
                    }
                }
            }

            for (let iCurveInstance = 0, szCurves = samplerSharedGroup.curves.length;
                iCurveInstance < szCurves; ++iCurveInstance) {
                const curveInstance = samplerSharedGroup.curves[iCurveInstance];
                curveInstance.applySample(ratio, index, lerpRequired, samplerResultCache, this.weight);
                if (curveInstance.commonTargetIndex !== undefined) {
                    const commonTargetStatus = this._commonTargetStatuses[curveInstance.commonTargetIndex];
                    if (commonTargetStatus) {
                        commonTargetStatus.changed = true;
                    }
                }
            }
        }

        // After sample, we push values of common targets.
        for (let iCommonTarget = 0; iCommonTarget < this._commonTargetStatuses.length; ++iCommonTarget) {
            const commonTargetStatus = this._commonTargetStatuses[iCommonTarget];
            if (!commonTargetStatus) {
                continue;
            }
            if (commonTargetStatus.changed) {
                commonTargetStatus.target.push();
            }
        }
    }

    private _setTime (time: number) {
        this._time = time;
        if (this._isIfl) {
            this._currentPosition.updateIfl(time, this.duration);
        } else {
            this._currentPosition.update(time, this.duration, this._wrapMode, this._repeatCount);
        }
    }

    private _countEvents (lastRatio: number, lastIterations: number, lastForwarding: boolean) {
        const currentIterations = this._currentPosition.iterations;
        const currentRatio = this._currentPosition.ratio;
        const repeatCount = this._repeatCount;

        this._triggerEventsInRange(
            lastRatio,
            lastIterations,
            lastForwarding,
            currentRatio,
            currentIterations,
            this._clip.eventGroups.length,
        );

        if (Math.abs(this._time) / this.duration >= repeatCount) {
            this.stop();
            this._context.emit?.(EventType.FINISHED, this);
        }
    }

    private _triggerEventsInRange (
        startRatio: number,
        startIterations: number,
        startForwarding: boolean,
        endRatio: number,
        endIterations: number,
        markerCount: number,
    ) {
        const clip = this._clip;
        const startIndex = getEventIndex(clip, startRatio, startForwarding);

        const isPingPong = (this._wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong;
        const lastFrameEvent = !!this._context.lastFrameEvent && this._repeatCount > 1;
        const diffIterations = Math.trunc(endIterations) - Math.trunc(startIterations);
        let forwarding = startForwarding;

        if (diffIterations === 0 && markerCount > 0) {
            const endIndex = getEventIndex(clip, endRatio, forwarding);
            if (endIndex > startIndex) {
                this._triggerEventsInIndexRange(startIndex + 1, endIndex, true);
            } else if (startIndex > endIndex) {
                assertIsTrue(startIndex > 0);
                this._triggerEventsInIndexRange(endIndex < 0 ? 0 : endIndex, startIndex - 1, false);
            }
            return;
        }

        const iLastIteration = Math.abs(diffIterations);
        for (let iIteration = 0;
            iIteration <= iLastIteration;
            ++iIteration, forwarding = isPingPong ? !forwarding : forwarding
        ) {
            if (markerCount > 0) {
                let first = 0;
                let last = markerCount - 1;
                if (iIteration === 0) {
                    if (forwarding) {
                        if (startIndex >= (markerCount - 1)) {
                            continue;
                        } else {
                            first = startIndex + 1;
                        }
                    } else if (startIndex < 1) {
                        continue;
                    } else {
                        first = startIndex - 1;
                    }
                } else if (iIteration === iLastIteration) {
                    const endIndex = getEventIndex(clip, endRatio, forwarding);
                    if (forwarding && endIndex < 0
                    || !forwarding && endIndex >= markerCount) {
                        continue;
                    } else {
                        last = endIndex < 0 ? 0 : endIndex;
                    }
                }
                this._triggerEventsInIndexRange(first, last, forwarding);
            }
            if (lastFrameEvent) {
                // If the iteration isn't last or if it is but the end ratio reaches the end,
                // we should emit the last frame event.
                if (iIteration !== iLastIteration
                    || forwarding && Math.abs(endRatio - 1.0) < DEFAULT_EPSILON
                    || !forwarding && Math.abs(endRatio) < DEFAULT_EPSILON) {
                    this._context.emit?.(EventType.ITERATION_END, this);
                }
            }
        }
    }

    private _triggerEventsInIndexRange (startIndex: number, endIndex: number, forwarding: boolean) {
        assertIsTrue(endIndex >= startIndex);
        if (forwarding) {
            for (let i = startIndex; i <= endIndex; ++i) {
                this._context.emitFrameEvent?.(this._fireEvent, this, [i]);
            }
        } else {
            for (let i = endIndex; i >= endIndex; --i) {
                this._context.emitFrameEvent?.(this._fireEvent, this, [i]);
            }
        }
    }

    private _fireEvent (index: number) {
        if (!this._targetNode || !this._targetNode.isValid) {
            return;
        }

        const { eventGroups } = this._clip;

        assertIsTrue(index >= 0 && index < eventGroups.length);

        const eventGroup = eventGroups[index];
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

    private _onReplayOrResume () {
        this._context.enqueue(this);
    }

    private _onPauseOrStop () {
        this._context.dequeue(this);
    }

    private _destroyBlendStateWriters () {
        for (let iBlendStateWriter = 0; iBlendStateWriter < this._blendStateWriters.length; ++iBlendStateWriter) {
            this._blendStateWriters[iBlendStateWriter].destroy();
        }
        this._blendStateWriters.length = 0;
        if (this._blendStateBuffer) {
            this._blendStateBuffer.unbindState(this);
            this._blendStateBuffer = null;
        }
        this._blendStateWriterHost.enabled = false;
    }
}

function isTargetingTRS (path: TargetPath[]) {
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

/**
 * Gets the most triggered frame event index `index`. `-1` means no frame event is covered.
 * If `forwarding` is `true`, the covered frame event range is `[0, index]`(inclusive),
 * Otherwise the covered frame event range is `[length - 1, index]`,
 * @param clip
 * @param ratio
 * @param forwarding
 */
function getEventIndex (clip: AnimationClip, ratio: number, forwarding: boolean) {
    let eventIndex = clip.getEventGroupIndexAtRatio(ratio);
    if (eventIndex < 0) {
        eventIndex = ~eventIndex - 1;
        // If direction is inverse, increase index.
        if (!forwarding) {
            eventIndex += 1;
        }
    }
    return eventIndex;
}

export declare namespace AnimationState {
    export interface Context {
        /**
         * The blend state buffer to use.
         */
        blendStateBuffer?: BlendStateBuffer;

        /**
         * Enqueue an animation state.
         * While an animation state is enqueued,
         * the context should be responsible to invoke its `update()` method to update the animation state.
         */
        enqueue(state: AnimationState): void;

        /**
         * Dequeue an animation state.
         * While an animation state is enqueued,
         * the context shall not invoke its `update()` method.
         */
        dequeue(state: AnimationState): void;

        /**
         * @zh
         * 是否允许触发 `LAST_EVENT` 事件。
         * @en
         * Whether `LastFrame` should be triggered.
         */
        lastFrameEvent?: boolean;

        /**
         * @zh
         * 触发动画播放事件。若未指定则不会触发动画播放事件。
         * @en
         * Emit an animation playback event. If not specified, animation playback events are not triggered.
         * @param type Event type.
         * @param state The state that triggered the event.
         */
        emit?(type: string, state: AnimationState): void;

        /**
         * @zh
         * 触发动画帧事件。若未指定则不会触发动画帧事件。
         * @en
         * Emit a animation frame event. If not specified, animation frame events are not triggered.
         * @param fn The function to invoke.
         * @param thisArg The `this` argument should be passed to `fn`.
         * @param args The arguments should be passed to `fn`.
         */
        emitFrameEvent?<ThisArg, Args extends unknown[]>(fn: (this: ThisArg, ...args: Args) => void, thisArg: unknown, args: Args): void;
    }
}

class PlaybackPosition {
    /**
     * Progress time.
     */
    public time = 0;

    /**
     * Playback ratio.
     */
    public ratio = 0;

    /**
     * Is forwarding playing.
     */
    public forwarding = true;

    /**
     * The scaled accumulated time.
     */
    public iterations = 0;

    public setAsIfl () {
        this.time = 0.0;
        this.forwarding = true;
    }

    public update (accTime: number, duration: number, wrapMode: WrapMode, repeatCount: number) {
        const accTimeAbs = Math.abs(accTime);
        const multiples = accTimeAbs / duration;
        const clampedIterations = Math.min(multiples, repeatCount);
        let time = 0;
        const integral = Math.trunc(clampedIterations);
        if (integral !== clampedIterations) {
            time = duration * (clampedIterations - integral);
            this.iterations = clampedIterations;
        } else if (clampedIterations === repeatCount || accTimeAbs === 0) {
            time = duration;
            this.iterations = clampedIterations - 1;
        } else {
            time = 0;
            this.iterations = clampedIterations;
        }
        let forwarding = true;
        if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong && Math.trunc(this.iterations) & 1) {
            forwarding = !forwarding;
        }
        if ((wrapMode & WrapModeMask.Reverse) === WrapModeMask.Reverse) {
            forwarding = !forwarding;
        }
        if (Math.sign(accTime) < 0) {
            forwarding = !forwarding;
        }
        if (!forwarding) {
            time = duration - time;
        }
        this.forwarding = forwarding;
        this.time = time;
        this.ratio = time / duration;
    }

    public updateIfl (accTime: number, duration: number) {
        let time = accTime;
        let iterationAdjustment = 0;
        if (accTime >= duration) {
            time = accTime % duration;
            if (time === 0) {
                time = duration;
                iterationAdjustment = -1;
            }
        } else if (accTime < 0) {
            time = accTime % duration;
            if (time !== 0) {
                time += duration;
                iterationAdjustment = -1;
            }
        }
        this.time = time;
        this.ratio = time / duration;
        this.iterations = iterationAdjustment + Math.trunc(Math.abs(accTime) / duration);
    }
}

legacyCC.AnimationState = AnimationState;
