
import { AnimationClip, AnimationState } from '../animation';
import { CrossFade } from '../animation/cross-fade';
import { Playable } from '../animation/playable';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../core/data/class-decorator';
import { Event, EventTarget } from '../core/event';
import { CallbacksInvoker, ICallbackTable } from '../core/event/callbacks-invoker';
import { applyMixins, IEventTarget } from '../core/event/event-target-factory';
import { warnID } from '../core/platform/CCDebug';
import * as ArrayUtils from '../core/utils/array';
import { createMap } from '../core/utils/js-typed';
import { ccenum } from '../core/value-types/enum';
import { Component } from './component';

/**
 * !#en The event type supported by Animation
 * !#zh Animation 支持的事件类型
 */
export enum EventType {
    /**
     * !#en Emit when begin playing animation
     * !#zh 开始播放时触发
     */
    PLAY = 'play',
    /**
     * !#en Emit when stop playing animation
     * !#zh 停止播放时触发
     */
    STOP = 'stop',
    /**
     * !#en Emit when pause animation
     * !#zh 暂停播放时触发
     */
    PAUSE = 'pause',
    /**
     * !#en Emit when resume animation
     * !#zh 恢复播放时触发
     */
    RESUME = 'resume',
    /**
     * !#en If animation repeat count is larger than 1, emit when animation play to the last frame
     * !#zh 假如动画循环次数大于 1，当动画播放到最后一帧时触发
     */
    LASTFRAME = 'lastframe',
    /**
     * !#en Emit when finish playing animation
     * !#zh 动画播放完成时触发
     */
    FINISHED = 'finished',
}
ccenum(EventType);

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
@executionOrder(99)
@executeInEditMode
@menu('Components/AnimationComponent')
export class AnimationComponent extends Component implements IEventTarget {
    /**
     * 获取此动画组件的自有动画剪辑。
     * 动画组件开始运行时会为每个自有动画剪辑创建动画状态。
     */
    @property({ type: [AnimationClip] })
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
    @property({ type: AnimationClip })
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

    get currentPlaying () {
        return this._currentPlaying;
    }

    public static EventType = EventType;

    /**
     * 是否在动画组件开始运行时自动播放默认动画剪辑。
     */
    @property
    public playOnLoad = false;

    public _callbackTable: ICallbackTable = createMap(true);

    private _crossFade = new CrossFade();

    private _nameToState: { [name: string]: AnimationState; } = createMap(true);

    @property({ type: [AnimationClip] })
    private _clips: Array<(AnimationClip | null)> = [];

    @property
    private _defaultClip: AnimationClip | null = null;

    private _currentPlaying: Playable = this._crossFade;

    constructor () {
        super();
    }

    public onLoad () {
        this.clips = this._clips;
    }

    public start () {
        for (const stateName of Object.keys(this._nameToState)) {
            const state = this._nameToState[stateName];
            state.initialize(this.node);
        }
        cc.director.getAnimationManager().addCrossFade(this._crossFade);
        this._crossFade.play();
        if (!CC_EDITOR && this.playOnLoad && this._defaultClip) {
            this.crossFade(this._defaultClip.name, 0);
        }
    }

    public onEnable () {
        if (this._crossFade) {
            this._crossFade.resume();
        }
    }

    public onDisable () {
        if (this._crossFade) {
            this._crossFade.pause();
        }
    }

    public onDestroy () {
        if (this._crossFade) {
            this._crossFade.stop();
            cc.director.getAnimationManager().removeCrossFade(this._crossFade);
            this._crossFade.stop();
        }
    }

    /**
     * !#en Plays an animation and stop other animations.
     * !#zh 播放指定的动画，并且停止当前正在播放动画。如果没有指定动画，则播放默认动画。
     * @param [name] - The name of animation to play. If no name is supplied then the default animation will be played.
     * @param [startTime] - play an animation from startTime
     * @return The AnimationState of playing animation. In cases where the animation can't be played
     * (ie, there is no default animation or no animation with the specified name), the function will return null.
     * @example
     * var animCtrl = this.node.getComponent(cc.Animation);
     * animCtrl.play("linear");
     */
    public play (name?: string, startTime = 0) {
        if (!name) {
            if (!this._defaultClip) {
                return null;
            } else {
                name = this._defaultClip.name;
            }
        }
        const state = this._nameToState[name];
        if (state) {
            this._currentPlaying.stop();
            this._currentPlaying = state;
            state.setTime(startTime);
            state.play();
        }
        return state;
    }

    public crossFade (name: string, duration = 0.3) {
        const state = this._nameToState[name];
        if (state) {
            if (this._currentPlaying !== this._crossFade) {
                this._currentPlaying.stop();
            }
            this._currentPlaying = this._crossFade;
            this._crossFade.crossFade(state, duration);
        }
    }

    /**
     * 获取指定的动画状态。
     * @deprecated 请使用 `this.getState`。
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
            state.stop();
            delete this._nameToState[name];
        }
    }

    /**
     * 添加一个动画剪辑到 `this.clips`中并以此剪辑创建动画状态。
     * @param clip 动画剪辑。
     * @param name 动画状态的名称，若未指定，则使用动画剪辑的名称。
     * @returns 新创建的动画状态。
     * @deprecated 请使用 `this.createState`.
     */
    public addClip (clip: AnimationClip, name?: string): AnimationState {
        if (!ArrayUtils.contains(this._clips, clip)) {
            this._clips.push(clip);
        }
        return this.createState(clip, name);
    }

    /**
     * !#en
     * Remove clip from the animation list. This will remove the clip and any animation states based on it.
     * If there are animation states depand on the clip are playing or clip is defaultClip, it will not delete the clip.
     * But if force is true, then will always remove the clip and any animation states based on it. If clip is defaultClip, defaultClip will be reset to null
     * !#zh
     * 从动画列表中移除指定的动画剪辑，<br/>
     * 如果依赖于 clip 的 AnimationState 正在播放或者 clip 是 defaultClip 的话，默认是不会删除 clip 的。
     * 但是如果 force 参数为 true，则会强制停止该动画，然后移除该动画剪辑和相关的动画。这时候如果 clip 是 defaultClip，defaultClip 将会被重置为 null。
     * @param {Boolean} [force=false] - If force is true, then will always remove the clip and any animation states based on it.
     * @deprecated 请使用 `this.removeState`.
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
                if (!CC_TEST) { warnID(3902); }
                return;
            }
        }

        if (state && state.isPlaying) {
            if (force) { state.stop(); }
            else {
                if (!CC_TEST) { warnID(3903); }
                return;
            }
        }

        this._clips = this._clips.filter((item) => item !== clip);

        if (state) {
            delete this._nameToState[state.name];
        }
    }

    /**
     * !#en
     * Register animation event callback.
     * The event arguments will provide the AnimationState which emit the event.
     * When play an animation, will auto register the event callback to the AnimationState,
     * and unregister the event callback from the AnimationState when animation stopped.
     * !#zh
     * 注册动画事件回调。
     * 回调的事件里将会附上发送事件的 AnimationState。
     * 当播放一个动画时，会自动将事件注册到对应的 AnimationState 上，停止播放时会将事件从这个 AnimationState 上取消注册。
     * @param type - A string representing the event type to listen for.
     * @param callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param [target] - The target (this object) to invoke the callback, can be null
     * @return Just returns the incoming callback so you can save the anonymous function easier.
     * @typescript
     * on(type: string, callback: (event: Event.EventCustom) => void, target?: any, useCapture?: boolean): (event: Event.EventCustom) => void
     * on<T>(type: string, callback: (event: T) => void, target?: any, useCapture?: boolean): (event: T) => void
     * @example
     * onPlay: function (type, state) {
     *     // callback
     * }
     *
     * // register event to all animation
     * animation.on('play', this.onPlay, this);
     */
    public on (type: string, callback: (state: AnimationState) => void, target?: Object) {
        const ret = EventTarget.prototype.on.call(this, type, callback, target);
        if (type === 'lastframe') {
            for (const stateName of Object.keys(this._nameToState)) {
                this._nameToState[stateName]!._lastframeEventOn = true;
            }
        }
        return ret;
    }

    /**
     * !#en
     * Unregister animation event callback.
     * !#zh
     * 取消注册动画事件回调。
     * @method off
     * @param {String} type - A string representing the event type being removed.
     * @param {Function} [callback] - The callback to remove.
     * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
     * @example
     * // unregister event to all animation
     * animation.off('play', this.onPlay, this);
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
     * IEventTarget implementations, they will be overwrote with the same implementation in EventTarget by applyMixins
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
        const state = this._nameToState[name];
        if (state && equalClips(clip, state.clip)) {
            state.stop();
            delete this._nameToState[name];
        }
    }

    private _doCreateState (clip: AnimationClip, name: string) {
        const state = new AnimationState(clip, name);
        state._setEventTarget(this);
        if (this.node) {
            state.initialize(this.node);
        }
        this._nameToState[state.name] = state;
        return state;
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
