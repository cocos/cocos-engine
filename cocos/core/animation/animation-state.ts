/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * @category animation
 */

import { EventArgumentsOf, EventCallbackOf } from '../event/defines';
import { Node } from '../scene-graph/node';
import { INode } from '../utils/interfaces';
import { AnimationBlendState, PropertyBlendState } from './animation-blend-state';
import { AnimationClip, IRuntimeCurve } from './animation-clip';
import { AnimCurve, ICurveValueProxy, RatioSampler } from './animation-curve';
import { additive3D, additiveQuat, BlendFunction } from './blending';
import { Playable } from './playable';
import { BoundTarget } from './target-modifier';
import { WrapMode, WrapModeMask, WrappedInfo } from './types';

enum PropertySpecialization {
    NodePosition,
    NodeScale,
    NodeRotation,
    None,
}

export class ICurveInstance {
    private _curve: AnimCurve;
    private _boundTarget: BoundTarget;
    private _curveValueProxy?: ICurveValueProxy;
    private _rootTarget: any;
    private _rootTargetProperty?: string;
    private _isNodeTarget: boolean;
    private _propertySpecialization: PropertySpecialization;
    private _blendTarget: PropertyBlendState | null;
    private _blendFunction: BlendFunction<any> | null;
    private _cached?: any[];
    private _curveDetail: Omit<IRuntimeCurve, 'sampler'>;

    constructor (
        runtimeCurve: Omit<IRuntimeCurve, 'sampler'>,
        target: any,
        blendTarget: PropertyBlendState | null = null) {
        this._curve = runtimeCurve.curve;
        this._curveDetail = runtimeCurve;
        this._boundTarget = new BoundTarget(target, runtimeCurve.modifiers, runtimeCurve.valueAdapter);
        this._rootTarget = target;
        this._isNodeTarget = target instanceof Node;
        this._propertySpecialization = PropertySpecialization.None;
        this._blendFunction = null;
        if (this._isNodeTarget && runtimeCurve.modifiers.length === 1) {
            switch (runtimeCurve.modifiers[0]) {
                case 'position':
                    this._propertySpecialization = PropertySpecialization.NodePosition;
                    this._blendFunction = additive3D;
                    break;
                case 'rotation':
                    this._propertySpecialization = PropertySpecialization.NodeRotation;
                    this._blendFunction = additiveQuat;
                    break;
                case 'scale':
                    this._propertySpecialization = PropertySpecialization.NodeScale;
                    this._blendFunction = additive3D;
                    break;
            }
        }
        this._blendTarget = blendTarget;
    }

    public attachToBlendState (blendState: AnimationBlendState) {
        if (this._rootTargetProperty) {
            this._blendTarget = blendState.refPropertyBlendTarget(
                this._rootTarget, this._rootTargetProperty);
        }
    }

    public dettachFromBlendState (blendState: AnimationBlendState) {
        if (this._rootTargetProperty) {
            this._blendTarget = null;
            blendState.derefPropertyBlendTarget(this._rootTarget, this._rootTargetProperty);
        }
    }

    public applySample (ratio: number, index: number, lerpRequired: boolean, samplerResultCache, weight: number) {
        if (this._curve.empty()) {
            return;
        }
        let value: any;
        if (!lerpRequired) {
            value = this._curve.valueAt(index);
        } else {
            value = this._curve.valueBetween(
                ratio,
                samplerResultCache.from,
                samplerResultCache.fromRatio,
                samplerResultCache.to,
                samplerResultCache.toRatio);
        }
        this._setValue(value, weight);
    }

    private _setValue (value: any, weight: number) {
        if (!this._blendFunction || !this._blendTarget || this._blendTarget.refCount <= 1) {
            switch (this._propertySpecialization) {
                case PropertySpecialization.NodePosition:
                    this._rootTarget.setPosition(value);
                    break;
                case PropertySpecialization.NodeRotation:
                    this._rootTarget.setRotation(value);
                    break;
                case PropertySpecialization.NodeScale:
                    this._rootTarget.setScale(value);
                    break;
                default:
                    this._boundTarget.setValue(value);
                    break;
            }
        } else {
            this._blendTarget.value = this._blendFunction(value, weight, this._blendTarget);
            this._blendTarget.weight += weight;
        }
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
        from: number,
        fromRatio: number,
        to: number,
        toRatio: number,
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

export interface IAnimationEventDefinitionMap {
    'finished': (animationState: AnimationState) => void;
    'lastframe': (animationState: AnimationState) => void;
    'play': (animationState: AnimationState) => void;
    'pause': (animationState: AnimationState) => void;
    'resume': (animationState: AnimationState) => void;
    'stop': (animationState: AnimationState) => void;
}

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
     * @en The clip that is being played by this animation state.
     * @zh 此动画状态正在播放的剪辑。
     */
    get clip () {
        return this._clip;
    }

    /**
     * @en The name of the playing animation.
     * @zh 动画的名字。
     */
    get name () {
        return this._name;
    }

    get length () {
        return this.duration;
    }

    /**
     * @en
     * Wrapping mode of the playing animation.
     * Notice : dynamic change wrapMode will reset time and repeatCount property
     * @zh
     * 动画循环方式。
     * 需要注意的是，动态修改 wrapMode 时，会重置 time 以及 repeatCount。
     * @default: WrapMode.Normal
     */
    get wrapMode () {
        return this._wrapMode;
    }

    set wrapMode (value: WrapMode) {
        this._wrapMode = value;

        if (CC_EDITOR) { return; }

        // dynamic change wrapMode will need reset time to 0
        this.time = 0;

        if (value & WrapModeMask.Loop) {
            this.repeatCount = Infinity;
        }
        else {
            this.repeatCount = 1;
        }
    }

    /**
     * @en The animation's iteration count property.
     *
     * A real number greater than or equal to zero (including positive infinity) representing the number of times
     * to repeat the animation node.
     *
     * Values less than zero and NaN values are treated as the value 1.0 for the purpose of timing model
     * calculations.
     *
     * @zh 迭代次数，指动画播放多少次后结束, normalize time。 如 2.5（2次半）。
     *
     * @property repeatCount
     * @type {Number}
     * @default 1
     */
    get repeatCount () {
        return this._repeatCount;
    }

    set repeatCount (value: number) {
        this._repeatCount = value;

        const shouldWrap = this._wrapMode & WrapModeMask.ShouldWrap;
        const reverse = (this.wrapMode & WrapModeMask.Reverse) === WrapModeMask.Reverse;
        if (value === Infinity && !shouldWrap && !reverse) {
            this._process = this.simpleProcess;
        }
        else {
            this._process = this.process;
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
     * @en The curves list.
     * @zh 曲线列表。
     */
    // public curves: AnimCurve[] = [];

    // http://www.w3.org/TR/web-animations/#idl-def-AnimationTiming

    /**
     * @en The iteration duration of this animation in seconds. (length)
     * @zh 单次动画的持续时间，秒。（动画长度）
     * @readOnly
     */
    public duration = 1;

    /**
     * @en The animation's playback speed. 1 is normal playback speed.
     * @zh 播放速率。
     * @default: 1.0
     */
    public speed = 1;

    /**
     * @en The current time of this animation in seconds.
     * @zh 动画当前的时间，秒。
     * @default 0
     */
    public time = 0;

    /**
     * The weight.
     */
    public weight = 0;

    public frameRate = 0;

    public _lastframeEventOn = false;

    protected _wrapMode = WrapMode.Normal;

    protected _repeatCount = 1;

    /**
     * Mark whether the current frame is played.
     * When set new time to animation state, we should ensure the frame at the specified time being played at next update.
     */
    protected _currentFramePlayed = false;
    protected _delay = 0;
    protected _delayTime = 0;
    protected _wrappedInfo = new WrappedInfo();
    protected _lastWrapInfo: WrappedInfo | null = null;
    protected _lastWrapInfoEvent: WrappedInfo | null = null;
    protected _process = this.process;
    protected _target: INode | null = null;
    protected _targetNode: INode | null = null;
    protected _clip: AnimationClip;
    protected _name: string;
    protected _lastIterations?: number;
    protected _samplerSharedGroups: ISamplerSharedGroup[] = [];
    protected _curveLoaded = false;
    protected _ignoreIndex = InvalidIndex;

    constructor (clip: AnimationClip, name?: string) {
        super();
        this._clip = clip;
        this._name = name || (clip && clip.name);
    }

    get curveLoaded () {
        return this._curveLoaded;
    }

    public initialize (root: INode, propertyCurves?: readonly IRuntimeCurve[]) {
        if (this._curveLoaded) { return; }
        this._curveLoaded = true;
        this._samplerSharedGroups.length = 0;
        this._targetNode = root;
        const clip = this._clip;

        this.duration = clip.duration;
        this.speed = clip.speed;
        this.wrapMode = clip.wrapMode;
        this.frameRate = clip.sample;

        if ((this.wrapMode & WrapModeMask.Loop) === WrapModeMask.Loop) {
            this.repeatCount = Infinity;
        } else {
            this.repeatCount = 1;
        }

        if (!propertyCurves) { propertyCurves = clip.getPropertyCurves(); }
        for (let iPropertyCurve = 0; iPropertyCurve < propertyCurves.length; ++iPropertyCurve) {
            const propertyCurve = propertyCurves[iPropertyCurve];
            let samplerSharedGroup = this._samplerSharedGroups.find((value) => value.sampler === propertyCurve.sampler);
            if (!samplerSharedGroup) {
                samplerSharedGroup = makeSamplerSharedGroup(propertyCurve.sampler);
                this._samplerSharedGroups.push(samplerSharedGroup);
            }

            try {
                samplerSharedGroup.curves.push(new ICurveInstance(propertyCurve, root));
            } catch (err) {
                // warn(`Failed to bind "${root.name}" to curve in clip ${clip.name}: ${err}`);
            }
        }
    }

    public _emit (type, state) {
        if (this._target && this._target.isValid) {
            this._target.emit(type, type, state);
        }
    }

    public emit<K extends string> (type: K, ...args: EventArgumentsOf<K, IAnimationEventDefinitionMap>): void;

    public emit (...restargs: any[]) {
        const args = new Array(restargs.length);
        for (let i = 0, l = args.length; i < l; i++) {
            args[i] = restargs[i];
        }
        cc.director.getAnimationManager().pushDelayEvent(this, '_emit', args);
    }

    public on<K extends string> (type: K, callback: EventCallbackOf<K, IAnimationEventDefinitionMap>, target?: any): void;

    public on (type: string, callback: Function, target?: any) {
        if (this._target && this._target.isValid) {
            if (type === 'lastframe') {
                this._lastframeEventOn = true;
            }
            return this._target.on(type, callback, target);
        }
        else {
            return null;
        }
    }

    public once<K extends string> (type: K, callback: EventCallbackOf<K, IAnimationEventDefinitionMap>, target?: any): void;

    public once (type: string, callback: Function, target?: any) {
        if (this._target && this._target.isValid) {
            if (type === 'lastframe') {
                this._lastframeEventOn = true;
            }
            return this._target.once(type, (event) => {
                callback.call(target, event);
                this._lastframeEventOn = false;
            });
        }
        else {
            return null;
        }
    }

    public off (type: string, callback: Function, target?: any) {
        if (this._target && this._target.isValid) {
            if (type === 'lastframe') {
                if (!this._target.hasEventListener(type)) {
                    this._lastframeEventOn = false;
                }
            }
            this._target.off(type, callback, target);
        }
    }

    public _setEventTarget (target) {
        this._target = target;
    }

    public setTime (time: number) {
        this._currentFramePlayed = false;
        this.time = time || 0;

        if (!CC_EDITOR) {
            this._lastWrapInfoEvent = null;
            this._ignoreIndex = InvalidIndex;

            const info = this.getWrappedInfo(time, this._wrappedInfo);
            const direction = info.direction;
            let frameIndex = this._clip.getEventGroupIndexAtRatio(info.ratio);

            // only ignore when time not on a frame index
            if (frameIndex < 0) {
                frameIndex = ~frameIndex - 1;

                // if direction is inverse, then increase index
                if (direction < 0) { frameIndex += 1; }

                this._ignoreIndex = frameIndex;
            }
        }
    }

    public update (delta: number) {
        // calculate delay time

        if (this._delayTime > 0) {
            this._delayTime -= delta;
            if (this._delayTime > 0) {
                // still waiting
                return;
            }
        }

        // make first frame perfect

        // var playPerfectFirstFrame = (this.time === 0);
        if (this._currentFramePlayed) {
            this.time += (delta * this.speed);
        }
        else {
            this._currentFramePlayed = true;
        }

        this._process();
    }

    public _needReverse (currentIterations: number) {
        const wrapMode = this.wrapMode;
        let needReverse = false;

        if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
            const isEnd = currentIterations - (currentIterations | 0) === 0;
            if (isEnd && (currentIterations > 0)) {
                currentIterations -= 1;
            }

            const isOddIteration = currentIterations & 1;
            if (isOddIteration) {
                needReverse = !needReverse;
            }
        }
        if ((wrapMode & WrapModeMask.Reverse) === WrapModeMask.Reverse) {
            needReverse = !needReverse;
        }
        return needReverse;
    }

    public getWrappedInfo (time: number, info?: WrappedInfo) {
        info = info || new WrappedInfo();

        let stopped = false;
        const duration = this.duration;
        const repeatCount = this.repeatCount;

        let currentIterations = time > 0 ? (time / duration) : -(time / duration);
        if (currentIterations >= repeatCount) {
            currentIterations = repeatCount;

            stopped = true;
            let tempRatio = repeatCount - (repeatCount | 0);
            if (tempRatio === 0) {
                tempRatio = 1;  // 如果播放过，动画不复位
            }
            time = tempRatio * duration * (time > 0 ? 1 : -1);
        }

        if (time > duration) {
            const tempTime = time % duration;
            time = tempTime === 0 ? duration : tempTime;
        }
        else if (time < 0) {
            time = time % duration;
            if (time !== 0) { time += duration; }
        }

        let needReverse = false;
        const shouldWrap = this._wrapMode & WrapModeMask.ShouldWrap;
        if (shouldWrap) {
            needReverse = this._needReverse(currentIterations);
        }

        let direction = needReverse ? -1 : 1;
        if (this.speed < 0) {
            direction *= -1;
        }

        // calculate wrapped time
        if (shouldWrap && needReverse) {
            time = duration - time;
        }

        info.ratio = time / duration;
        info.time = time;
        info.direction = direction;
        info.stopped = stopped;
        info.iterations = currentIterations;

        return info;
    }

    public sample () {
        const info = this.getWrappedInfo(this.time, this._wrappedInfo);
        this._sampleCurves(info.ratio);
        if (!CC_EDITOR) {
            this._sampleEvents(info);
        }
        return info;
    }

    public process () {
        // sample
        const info = this.sample();

        if (this._lastframeEventOn) {
            let lastInfo;
            if (!this._lastWrapInfo) {
                lastInfo = this._lastWrapInfo = new WrappedInfo(info);
            } else {
                lastInfo = this._lastWrapInfo;
            }

            if (this.repeatCount > 1 && ((info.iterations | 0) > (lastInfo.iterations | 0))) {
                this.emit('lastframe', this);
            }

            lastInfo.set(info);
        }

        if (info.stopped) {
            this.stop();
            this.emit('finished', this);
        }
    }

    public simpleProcess () {
        let time = this.time;
        const duration = this.duration;

        if (time > duration) {
            time = time % duration;
            if (time === 0) { time = duration; }
        }
        else if (time < 0) {
            time = time % duration;
            if (time !== 0) { time += duration; }
        }

        const ratio = time / duration;
        this._sampleCurves(ratio);

        if (!CC_EDITOR) {
            if (this._clip.hasEvents()) {
                this._sampleEvents(this.getWrappedInfo(this.time, this._wrappedInfo));
            }
        }

        if (this._lastframeEventOn) {
            if (this._lastIterations === undefined) {
                this._lastIterations = ratio;
            }

            if ((this.time > 0 && this._lastIterations > ratio) || (this.time < 0 && this._lastIterations < ratio)) {
                this.emit('lastframe', this);
            }

            this._lastIterations = ratio;
        }
    }

    public attachToBlendState (blendState: AnimationBlendState) {
        for (const samplerSharedGroup of this._samplerSharedGroups) {
            for (const curveInstance of samplerSharedGroup.curves) {
                curveInstance.attachToBlendState(blendState);
            }
        }
    }

    public detachFromBlendState (blendState: AnimationBlendState) {
        for (const samplerSharedGroup of this._samplerSharedGroups) {
            for (const curveInstance of samplerSharedGroup.curves) {
                curveInstance.dettachFromBlendState(blendState);
            }
        }
    }

    public cache (frames: number) {
    }

    protected onPlay () {
        // replay
        this.setTime(0);
        this._delayTime = this._delay;

        cc.director.getAnimationManager().addAnimation(this);

        this.emit('play', this);
    }

    protected onStop () {
        if (!this.isPaused) {
            cc.director.getAnimationManager().removeAnimation(this);
        }

        this.emit('stop', this);
    }

    protected onResume () {
        cc.director.getAnimationManager().addAnimation(this);
        this.emit('resume', this);
    }

    protected onPause () {
        cc.director.getAnimationManager().removeAnimation(this);
        this.emit('pause', this);
    }

    private _sampleCurves (ratio: number) {
        for (let iSamplerSharedGroup = 0, szSamplerSharedGroup = this._samplerSharedGroups.length;
            iSamplerSharedGroup < szSamplerSharedGroup; ++iSamplerSharedGroup) {
            const samplerSharedGroup = this._samplerSharedGroups[iSamplerSharedGroup];
            const sampler = samplerSharedGroup.sampler;
            const { samplerResultCache } = samplerSharedGroup;
            let index: number = 0;
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
                    }
                }
            }

            for (let iCurveInstance = 0, szCurves = samplerSharedGroup.curves.length;
                iCurveInstance < szCurves; ++iCurveInstance) {
                const curveInstace = samplerSharedGroup.curves[iCurveInstance];
                curveInstace.applySample(ratio, index, lerpRequired, samplerResultCache, this.weight);
            }
        }
    }

    private _sampleEvents (wrapInfo: WrappedInfo) {
        const length = this._clip.eventGroups.length;
        let direction = wrapInfo.direction;
        let eventIndex = this._clip.getEventGroupIndexAtRatio(wrapInfo.ratio);
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

        wrapInfo.frameIndex = eventIndex;

        if (!this._lastWrapInfoEvent) {
            this._fireEvent(eventIndex);
            this._lastWrapInfoEvent = new WrappedInfo(wrapInfo);
            return;
        }

        const wrapMode = this.wrapMode;
        const currentIterations = wrapIterations(wrapInfo.iterations);

        const lastWrappedInfo = this._lastWrapInfoEvent;
        let lastIterations = wrapIterations(lastWrappedInfo.iterations);
        let lastIndex = lastWrappedInfo.frameIndex;
        const lastDirection = lastWrappedInfo.direction;

        const interationsChanged = lastIterations !== -1 && currentIterations !== lastIterations;

        if (lastIndex === eventIndex && interationsChanged && length === 1) {
            this._fireEvent(0);
        } else if (lastIndex !== eventIndex || interationsChanged) {
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

                cc.director.getAnimationManager().pushDelayEvent(this, '_fireEvent', [lastIndex]);
            } while (lastIndex !== eventIndex && lastIndex > -1 && lastIndex < length);
        }

        this._lastWrapInfoEvent.set(wrapInfo);
    }

    private _fireEvent (index: number) {
        if (!this._targetNode || !this._targetNode.isValid) {
            return;
        }

        const { eventGroups } = this._clip;
        if (index < 0 || index >= eventGroups.length || this._ignoreIndex === index) {
            return;
        }

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
}

function wrapIterations (iterations: number) {
    if (iterations - (iterations | 0) === 0) {
        iterations -= 1;
    }
    return iterations | 0;
}

cc.AnimationState = AnimationState;
