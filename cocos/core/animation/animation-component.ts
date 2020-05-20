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

import { Component } from '../components/component';
import { ccclass, help, executeInEditMode, executionOrder, menu, property } from '../data/class-decorator';
import { Event, EventTarget } from '../event';
import { CallbacksInvoker, ICallbackTable } from '../event/callbacks-invoker';
import { applyMixins, IEventTarget } from '../event/event-target-factory';
import { warnID } from '../platform/debug';
import * as ArrayUtils from '../utils/array';
import { createMap } from '../utils/js-typed';
import { ccenum } from '../value-types/enum';
import { AnimationClip } from './animation-clip';
import { AnimationState } from './animation-state';
import { CrossFade } from './cross-fade';
import { EDITOR, TEST } from 'internal:constants';

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
     * @en If animation repeat count is larger than 1, emit when animation play to the last frame
     * @zh 假如动画循环次数大于 1，当动画播放到最后一帧时触发。
     */
    LASTFRAME = 'lastframe',
    /**
     * @en Emit when finish playing animation
     * @zh 动画播放完成时触发。
     */
    FINISHED = 'finished',
}
ccenum(EventType);

/**
 * @en
 * Animation component governs a group of animation states to control playback of the states.
 * For convenient, it stores a group of animation clips.
 * Each of those clips would have an associated animation state uniquely created.
 * Animation component is eventful, it dispatch a serials playback status events.
 * See `AnimationComponent.EventType`.
 * @zh
 * 动画组件管理一组动画状态，控制它们的播放。
 * 为了方便，动画组件还存储了一组动画剪辑。
 * 每个剪辑都会独自创建一个关联的动画状态对象。
 * 动画组件具有事件特性，它会派发一系列播放状态相关的事件。
 */
@ccclass('cc.AnimationComponent')
@help('i18n:cc.AnimationComponent')
@executionOrder(99)
@executeInEditMode
@menu('Components/Animation')
export class AnimationComponent extends Component implements IEventTarget {
    /**
     * @en
     * Gets or sets clips this component governs.
     * When set, associated animation state of each existing clip will be stopped.
     * If the existing default clip is not in the set of new clips, default clip will be reset to null.
     * @zh
     * 获取或设置此组件管理的剪辑。
     * 设置时，已有剪辑关联的动画状态将被停止；若默认剪辑不在新的动画剪辑中，将被重置为空。
     */
    @property({
        type: [AnimationClip],
        tooltip: '此动画组件管理的动画剪辑',
    })
    get clips () {
        return this._clips;
    }

    set clips (value) {
        if (this._crossFade) {
            this._crossFade.clear();
        }
        // Remove state for old automatic clips.
        for (const clip of this._clips) {
            if (clip) {
                this._removeStateOfAutomaticClip(clip);
            }
        }
        // Create state for new clips.
        for (const clip of value) {
            if (clip) {
                this.createState(clip);
            }
        }
        // Default clip should be in the list of automatic clips.
        const newDefaultClip = value.find((clip) => equalClips(clip, this._defaultClip));
        if (newDefaultClip) {
            this._defaultClip = newDefaultClip;
        } else {
            this._defaultClip = null;
        }

        this._clips = value;
    }

    /**
     * @en
     * Gets or sets the default clip.
     * @en
     * 获取或设置默认剪辑。
     * 设置时，若指定的剪辑不在 `this.clips` 中则会被自动添加至 `this.clips`。
     * @see [[playOnLoad]]
     */
    @property({
        type: AnimationClip,
        tooltip: '默认动画剪辑',
    })
    get defaultClip () {
        return this._defaultClip;
    }

    set defaultClip (value) {
        this._defaultClip = value;
        if (!value) {
            return;
        }
        const isBoundedDefaultClip = this._clips.findIndex((clip) => equalClips(clip, value)) >= 0;
        if (!isBoundedDefaultClip) {
            this._clips.push(value);
            this.createState(value);
        }
    }

    public static EventType = EventType;

    /**
     * @en
     * Whether the default clip should get into playing when this components starts.
     * Note, this field takes no effect if `crossFade()` or `play()` has been called before this component starts.
     * @zh
     * 是否在组件开始运行时自动播放默认剪辑。
     * 注意，若在组件开始运行前调用了 `crossFade` 或 `play()`，此字段将不会生效。
     */
    @property({
        tooltip: '是否在动画组件开始运行时自动播放默认动画剪辑',
    })
    public playOnLoad = false;

    public _callbackTable: ICallbackTable = createMap(true);

    protected _crossFade = new CrossFade();

    protected _nameToState: { [name: string]: AnimationState; } = createMap(true);

    @property({ type: [AnimationClip] })
    protected _clips: (AnimationClip | null)[] = [];

    @property
    protected _defaultClip: AnimationClip | null = null;

    /**
     * Whether if `crossFade()` or `play()` has been called before this component starts.
     */
    private _hasBeenPlayed = false;

    public onLoad () {
        this.clips = this._clips;
        for (const stateName in this._nameToState) {
            const state = this._nameToState[stateName];
            state.initialize(this.node);
        }
    }

    public start () {
        if (!EDITOR && (this.playOnLoad && !this._hasBeenPlayed) && this._defaultClip) {
            this.crossFade(this._defaultClip.name, 0);
        }
    }

    public onEnable () {
        this._crossFade.resume();
    }

    public onDisable () {
        this._crossFade.pause();
    }

    public onDestroy () {
        this._crossFade.stop();
        for (const name in this._nameToState) {
            const state = this._nameToState[name];
            state.destroy();
        }
        this._nameToState = createMap(true);
    }

    /**
     * @en
     * Switch to play specified animation state, without fading.
     * @zh
     * 立即切换到指定动画状态。
     * @param [name] 目标动画状态的名称；若未指定，使用默认动画剪辑的名称。
     */
    public play (name?: string) {
        this._hasBeenPlayed = true;
        if (!name) {
            if (!this._defaultClip) {
                return;
            } else {
                name = this._defaultClip.name;
            }
        }
        this.crossFade(name, 0);
    }

    /**
     * @en
     * Smoothly switch to play specified animation state.
     * @zn
     * 平滑地切换到指定动画状态。
     * @param name 目标动画状态的名称。
     * @param duration 切换周期，单位为秒。
     */
    public crossFade (name: string, duration = 0.3) {
        this._hasBeenPlayed = true;
        const state = this._nameToState[name];
        if (state) {
            this._crossFade.play();
            this._crossFade.crossFade(state, duration);
        }
    }

    /**
     * @en
     * Pause all animation states and all switching.
     * @zh
     * 暂停所有动画状态，并暂停所有切换。
     */
    public pause () {
        this._crossFade.pause();
    }

    /**
     * @en
     * Resume all animation states and all switching.
     * @zh
     * 恢复所有动画状态，并恢复所有切换。
     */
    public resume () {
        this._crossFade.resume();
    }

    /**
     * @en
     * Stop all animation states and all switching.
     * @zh
     * 停止所有动画状态，并停止所有切换。
     */
    public stop () {
        this._crossFade.stop();
    }

    /**
     * @en
     * Get specified animation state.
     * @zh
     * 获取指定的动画状态。
     * @deprecated 将在 V1.0.0 移除，请转用 `this.getState()`。
     */
    public getAnimationState (name: string) {
        return this.getState(name);
    }

    /**
     * @en
     * Get specified animation state.
     * @zh
     * 获取指定的动画状态。
     * @param name 动画状态的名称。
     * @returns 不存在指定名称的动画状态时返回空，否则返回指定的动画状态。
     */
    public getState (name: string) {
        const state = this._nameToState[name];
        if (state && !state.curveLoaded) {
            state.initialize(this.node);
        }
        return state || null;
    }

    /**
     * @en
     * Creates a state for specified clip.
     * If there is already a clip with same name, the existing animation state will be stopped and overridden.
     * @zh
     * 使用指定的动画剪辑创建一个动画状态。
     * 若指定名称的动画状态已存在，已存在的动画状态将先被设为停止并被覆盖。
     * @param clip 动画剪辑。
     * @param name 动画状态的名称，若未指定，则使用动画剪辑的名称。
     * @returns 新创建的动画状态。
     */
    public createState (clip: AnimationClip, name?: string) {
        name = name || clip.name;
        this.removeState(name);

        return this._doCreateState(clip, name);
    }

    /**
     * @en
     * Stops and removes specified clip.
     * @zh
     * 停止并移除指定的动画状态。
     * @param name 动画状态的名称。
     */
    public removeState (name: string) {
        const state = this._nameToState[name];
        if (state) {
            state.stop();
            delete this._nameToState[name];
        }
    }

    /**
     * 添加一个动画剪辑到 `this.clips`中并以此剪辑创建动画状态。
     * @deprecated 将在 V1.0.0 移除，请转用 `this.createState()`。
     * @param clip 动画剪辑。
     * @param name 动画状态的名称，若未指定，则使用动画剪辑的名称。
     * @returns 新创建的动画状态。
     */
    public addClip (clip: AnimationClip, name?: string): AnimationState {
        if (!ArrayUtils.contains(this._clips, clip)) {
            this._clips.push(clip);
        }
        return this.createState(clip, name);
    }

    /**
     * @en
     * Remove clip from the animation list. This will remove the clip and any animation states based on it.<br>
     * If there are animation states depend on the clip are playing or clip is defaultClip, it will not delete the clip.<br>
     * But if force is true, then will always remove the clip and any animation states based on it. If clip is defaultClip, defaultClip will be reset to null
     * @zh
     * 从动画列表中移除指定的动画剪辑，<br/>
     * 如果依赖于 clip 的 AnimationState 正在播放或者 clip 是 defaultClip 的话，默认是不会删除 clip 的。<br/>
     * 但是如果 force 参数为 true，则会强制停止该动画，然后移除该动画剪辑和相关的动画。这时候如果 clip 是 defaultClip，defaultClip 将会被重置为 null。<br/>
     * @deprecated 将在 V1.0.0 移除，请转用 `this.removeState()`。
     * @param {Boolean} [force=false] - If force is true, then will always remove the clip and any animation states based on it.
     */
    public removeClip (clip: AnimationClip, force?: boolean) {
        let state: AnimationState | undefined;
        for (const name of Object.keys(this._nameToState)) {
            state = this._nameToState[name];
            const stateClip = state.clip;
            if (stateClip === clip) {
                break;
            }
        }

        if (clip === this._defaultClip) {
            if (force) { this._defaultClip = null; }
            else {
                if (!TEST) { warnID(3902); }
                return;
            }
        }

        if (state && state.isPlaying) {
            if (force) { state.stop(); }
            else {
                if (!TEST) { warnID(3903); }
                return;
            }
        }

        this._clips = this._clips.filter((item) => item !== clip);

        if (state) {
            delete this._nameToState[state.name];
        }
    }

    /**
     * @en
     * Register animation event callback.<bg>
     * The event arguments will provide the AnimationState which emit the event.<bg>
     * When play an animation, will auto register the event callback to the AnimationState,<bg>
     * and unregister the event callback from the AnimationState when animation stopped.
     * @zh
     * 注册动画事件回调。<bg>
     * 回调的事件里将会附上发送事件的 AnimationState。<bg>
     * 当播放一个动画时，会自动将事件注册到对应的 AnimationState 上，停止播放时会将事件从这个 AnimationState 上取消注册。
     * @param type - 表示要侦听的事件类型的字符串。
     * @param callback - 调度事件时将调用的回调。
     *                   如果回调是重复的（回调是唯一的），则忽略回调。
     * @param target - 调用回调的目标（此对象）可以为null
     * @return 只返回传入的回调，以便可以更轻松地保存匿名函数。
     * @example
     * ```typescript
     * onPlay: function (type, state) {
     *     // callback
     * }
     *
     * // register event to all animation
     * animation.on('play', this.onPlay, this);
     * ```
     */
    public on (type: string, callback: (type: string, state: AnimationState) => void, target?: Object) {
        const ret = EventTarget.prototype.on.call(this, type, callback, target);
        if (type === 'lastframe') {
            for (const stateName of Object.keys(this._nameToState)) {
                this._nameToState[stateName]!._lastframeEventOn = true;
            }
        }
        return ret;
    }

    /**
     * @en
     * Unregister animation event callback.
     * @zh
     * 取消注册动画事件回调。
     * @param {String} type - 要删除的事件类型的字符串。
     * @param {Function} callback - 要删除的回调
     * @param {Object} target - 调用回调的目标（此对象），如果没有给出，则只删除没有目标的回调
     * @example
     * ```typescript
     * // unregister event to all animation
     * animation.off('play', this.onPlay, this);
     * ```
     */
    public off (type: string, callback: Function, target?: Object) {
        if (type === 'lastframe') {
            const nameToState = this._nameToState;
            for (const name of Object.keys(nameToState)) {
                const state = nameToState[name]!;
                state._lastframeEventOn = false;
            }
        }

        EventTarget.prototype.off.call(this, type, callback, target);
    }

    /**
     * @en IEventTarget implementations, they will be overwrote with the same implementation in EventTarget by applyMixins
     * @zh IEventTarget 实现，它们将被 applyMixins 在 EventTarget 中用相同的实现覆盖。
     */
    public targetOff (keyOrTarget?: string | Object | undefined): void {}
    public once (type: string, callback: Function, target?: Object | undefined): Function | undefined {
        return;
    }
    public dispatchEvent (event: Event): void {}
    public hasEventListener (key: string, callback?: Function | undefined, target?: Object | undefined): boolean {
        return false;
    }
    public removeAll (keyOrTarget?: string | Object | undefined): void {}
    public emit (key: string, ...args: any[]): void {}

    protected _createState (clip: AnimationClip, name?: string) {
        return new AnimationState(clip, name);
    }

    protected _doCreateState (clip: AnimationClip, name: string) {
        const state = this._createState(clip, name);
        state._setEventTarget(this);
        if (this.node) {
            state.initialize(this.node);
        }
        this._nameToState[state.name] = state;
        return state;
    }

    private _getStateByNameOrDefaultClip (name?: string) {
        if (!name) {
            if (!this._defaultClip) {
                return null;
            } else {
                name = this._defaultClip.name;
            }
        }
        const state = this._nameToState[name];
        if (state) {
            return state;
        } else {
            return null;
        }
    }

    private _removeStateOfAutomaticClip (clip: AnimationClip) {
        // tslint:disable-next-line:forin
        for (const name in this._nameToState) {
            const state = this._nameToState[name];
            if (equalClips(clip, state.clip)) {
                state.stop();
                delete this._nameToState[name];
            }
        }
    }
}

// for restore on and off
const {on, off} = AnimationComponent.prototype;
applyMixins(AnimationComponent, [CallbacksInvoker, EventTarget]);
// restore
AnimationComponent.prototype.on = on;
AnimationComponent.prototype.off = off;

cc.AnimationComponent = AnimationComponent;

function equalClips (clip1: AnimationClip | null, clip2: AnimationClip | null) {
    if (clip1 === clip2) {
        return true;
    }
    return !!clip1 && !!clip2 && (clip1.name === clip2.name || clip1._uuid === clip2._uuid);
}
