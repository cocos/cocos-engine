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
import { ccclass, executeInEditMode, executionOrder, help, menu, property } from '../data/class-decorator';
import { Eventify } from '../event/eventify';
import { warnID } from '../platform/debug';
import * as ArrayUtils from '../utils/array';
import { createMap } from '../utils/js-typed';
import { AnimationClip } from './animation-clip';
import { AnimationState, EventType } from './animation-state';
import { CrossFade } from './cross-fade';
import { EDITOR, TEST } from 'internal:constants';
import { legacyCC } from '../global-exports';

/**
 * 动画组件管理动画状态来控制动画的播放。
 * 它提供了方便的接口用来预创建指定动画剪辑的动画状态，并提供了一系列事件：
 *  - play : 开始播放时
 *  - stop : 停止播放时
 *  - pause : 暂停播放时
 *  - resume : 恢复播放时
 *  - lastframe : 假如动画循环次数大于 1，当动画播放到最后一帧时
 *  - finished : 动画播放完成时
 */
@ccclass('cc.AnimationComponent')
@help('i18n:cc.AnimationComponent')
@executionOrder(99)
@executeInEditMode
@menu('Components/Animation')
export class AnimationComponent extends Eventify(Component) {
    /**
     * 获取此动画组件的自有动画剪辑。
     * 动画组件开始运行时会为每个自有动画剪辑创建动画状态。
     */
    @property({
        type: [AnimationClip],
        tooltip: '此动画组件的自有动画剪辑',
    })
    get clips () {
        return this._clips;
    }

    /**
     * 设置此动画组件的自有动画剪辑。
     * 设置时将移除已有的动画剪辑，并将其动画状态设为停止；若默认动画剪辑不在新的自有动画剪辑中，将被重置为空。
     */
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
     * 获取默认动画剪辑。
     * @see [[playOnLoad]]
     */
    @property({
        type: AnimationClip,
        tooltip: '默认动画剪辑',
    })
    get defaultClip () {
        return this._defaultClip;
    }

    /**
     * 设置默认动画剪辑。当指定的剪辑不在 `this.clips` 中时会被自动添加至 `this.clips`。
     */
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
     * @zh
     * 是否在动画组件开始运行时自动播放默认动画剪辑。
     * 注意，若在组件开始运行前调用了 `crossFade` 或 `play()`，此字段将不会生效。
     * @en
     * Whether the default clip should get into playing when this components starts.
     * Note, this field takes no effect if `crossFade()` or `play()` has been called before this component starts.
     */
    @property({
        tooltip: '是否在动画组件开始运行时自动播放默认动画剪辑',
    })
    public playOnLoad = false;

    protected _crossFade = new CrossFade();

    protected _nameToState: Record<string, AnimationState> = createMap(true);

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
     * 在指定周期内从当前动画状态平滑地切换到指定动画状态。
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
     * 暂停所有动画状态，并暂停动画切换。
     */
    public pause () {
        this._crossFade.pause();
    }

    /**
     * 恢复所有动画状态，并继续动画切换。
     */
    public resume () {
        this._crossFade.resume();
    }

    /**
     * 停止所有动画状态，并停止动画切换。
     */
    public stop () {
        this._crossFade.stop();
    }

    /**
     * 获取指定的动画状态。
     * @deprecated 将在 V1.0.0 移除，请转用 `this.getState()`。
     */
    public getAnimationState (name: string) {
        return this.getState(name);
    }

    /**
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
     * 使用指定的动画剪辑创建一个动画状态，并将其命名为指定的名称。
     * 若指定名称的动画状态已存在，已存在的动画状态将先被设为停止并被移除。
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
     * 停止并移除指定名称的动画状态。
     * @param name 动画状态的名称。
     */
    public removeState (name: string) {
        const state = this._nameToState[name];
        if (state) {
            state.allowLastFrameEvent(false);
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
        let removalState: AnimationState | undefined;
        for (const name in this._nameToState) {
            const state = this._nameToState[name];
            const stateClip = state.clip;
            if (stateClip === clip) {
                removalState = state;
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

        if (removalState && removalState.isPlaying) {
            if (force) { removalState.stop(); }
            else {
                if (!TEST) { warnID(3903); }
                return;
            }
        }

        this._clips = this._clips.filter((item) => item !== clip);

        if (removalState) {
            delete this._nameToState[removalState.name];
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
    public on<TFunction extends Function> (type: EventType, callback: TFunction, thisArg?: any, once?: boolean) {
        const ret = super.on(type, callback, thisArg, once);
        if (type === EventType.LASTFRAME) {
            this._syncAllowLastFrameEvent();
        }
        return ret;
    }

    public once<TFunction extends Function> (type: EventType, callback: TFunction, thisArg?: any) {
        const ret = super.once(type, callback, thisArg);
        if (type === EventType.LASTFRAME) {
            this._syncAllowLastFrameEvent();
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
    public off (type: EventType, callback?: Function, thisArg?: any) {
        super.off(type, callback, thisArg);
        if (type === EventType.LASTFRAME) {
            this._syncDisallowLastFrameEvent();
        }
    }

    protected _createState (clip: AnimationClip, name?: string) {
        return new AnimationState(clip, name);
    }

    protected _doCreateState (clip: AnimationClip, name: string) {
        const state = this._createState(clip, name);
        state._setEventTarget(this);
        state.allowLastFrameEvent(this.hasEventListener(EventType.LASTFRAME));
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

    private _syncAllowLastFrameEvent () {
        if (this.hasEventListener(EventType.LASTFRAME)) {
            for (const stateName in this._nameToState) {
                this._nameToState[stateName].allowLastFrameEvent(true);
            }
        }
    }

    private _syncDisallowLastFrameEvent () {
        if (!this.hasEventListener(EventType.LASTFRAME)) {
            for (const stateName in this._nameToState) {
                this._nameToState[stateName].allowLastFrameEvent(false);
            }
        }
    }
}

export namespace AnimationComponent {
    export type EventType = EnumAlias<typeof EventType>;
}

legacyCC.AnimationComponent = AnimationComponent;

function equalClips (clip1: AnimationClip | null, clip2: AnimationClip | null) {
    if (clip1 === clip2) {
        return true;
    }
    return !!clip1 && !!clip2 && (clip1.name === clip2.name || clip1._uuid === clip2._uuid);
}
