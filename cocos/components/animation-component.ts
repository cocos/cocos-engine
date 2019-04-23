
import { AnimationClip, AnimationState } from '../animation';
import { CrossFade } from '../animation/cross-fade';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../core/data/class-decorator';
import { EventTargetFactory, IEventTargetCallback } from '../core/event/event-target-factory';
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
 * !#en The animation component is used to play back animations.
 *
 * Animation provide several events to register：
 *  - play : Emit when begin playing animation
 *  - stop : Emit when stop playing animation
 *  - pause : Emit when pause animation
 *  - resume : Emit when resume animation
 *  - lastframe : If animation repeat count is larger than 1, emit when animation play to the last frame
 *  - finished : Emit when finish playing animation
 *
 * !#zh Animation 组件用于播放动画。
 *
 * Animation 提供了一系列可注册的事件：
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
export class AnimationComponent extends EventTargetFactory(Component) {

    @property({ type: Boolean })
    get preview () {
        return this._preview;
    }

    set preview (value) {
        this._preview = value;
        if (!this._defaultClip) {
            return;
        }
        if (value) {
            cc.engine.animatingInEditMode = true;
            this.crossFade(this._defaultClip.name);
            this._crossFade!.play();
        } else {
            cc.engine.animatingInEditMode = false;
            this._crossFade!.stop();
            this._crossFade!.sample();
        }
    }

    /**
     * !#en Animation will play the default clip when start game.
     * !#zh 在勾选自动播放或调用 play() 时默认播放的动画剪辑。
     */
    @property({ type: AnimationClip })
    get defaultClip () {
        return this._defaultClip;
    }

    set defaultClip (value) {
        if (!CC_EDITOR || (cc.engine && cc.engine.isPlaying)) {
            return;
        }

        this._defaultClip = value;

        if (!value) {
            return;
        }

        const clips = this._clips;

        for (let i = 0, l = clips.length; i < l; i++) {
            if (equalClips(value, clips[i])) {
                return;
            }
        }

        this.addClip(value);
    }

    /**
     * !#en Current played clip.
     * !#zh 当前播放的动画剪辑。
     */
    get currentClip () {
        return this._currentClip;
    }

    set currentClip (value) {
        this._currentClip = value;
    }

    @property({ type: [AnimationClip] })
    get clips () {
        return this._clips;
    }

    set clips (value) {
        this._clips = value;
    }

    public static EventType = EventType;

    /**
     * !#en Whether the animation should auto play the default clip when start game.
     * !#zh 是否在运行游戏后自动播放默认动画剪辑。
     */
    @property
    public playOnLoad = false;
    private _preview = false;

    private _crossFade: CrossFade | null = null;
    private _nameToState: { [name: string]: AnimationState; } = createMap(true);
    private _didInit = false;
    private _currentClip: AnimationClip | null = null;

    /**
     * !#en All the clips used in this animation.
     * !#zh 通过脚本可以访问并播放的 AnimationClip 列表。
     */
    @property({ type: [AnimationClip] })
    private _clips: Array<(AnimationClip | null)> = [];

    @property
    private _defaultClip: AnimationClip | null = null;

    constructor () {
        super();
    }

    public start () {
        this._init();
        this._startCrossFade();
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
            this._crossFade = null;
        }
    }

    /**
     * !#en Get all the clips used in this animation.
     * !#zh 获取动画组件上的所有动画剪辑。
     */
    public getClips () {
        return this._clips;
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
        const state = this.crossFade(name);
        if (state) {
            state.time = startTime;
        }
        return state;
    }

    public crossFade (name?: string, duration = 0.3) {
        const state = this.getAnimationState(name || (this._defaultClip && this._defaultClip.name) || '');
        this._crossFade!.crossFade(state, duration);
        return state;
    }

    /**
     * !#en Returns the animation state named name. If no animation with the specified name, the function will return null.
     * !#zh 获取当前或者指定的动画状态，如果未找到指定动画剪辑则返回 null。
     */
    public getAnimationState (name: string) {
        this._init();
        const state = this._nameToState[name];
        if (state && !state.curveLoaded) {
            state.initialize(this.node);
        }
        return state || null;
    }

    /**
     * !#en Adds a clip to the animation with name newName. If a clip with that name already exists it will be replaced with the new clip.
     * !#zh 添加动画剪辑，并且可以重新设置该动画剪辑的名称。
     * @param clip the clip to add
     * @return The AnimationState which gives full control over the animation clip.
     */
    public addClip (clip: AnimationClip, newName?: string): AnimationState | undefined {
        if (!clip) {
            warnID(3900);
            return;
        }
        this._init();

        // add clip
        if (!ArrayUtils.contains(this._clips, clip)) {
            this._clips.push(clip);
        }

        // replace same name clip
        newName = newName || clip.name;
        const oldState = this._nameToState[newName];
        if (oldState) {
            if (oldState.clip === clip) {
                return oldState;
            }
            else {
                const index = this._clips.indexOf(oldState.clip);
                if (index !== -1) {
                    this._clips.splice(index, 1);
                }
            }
        }

        // replace state
        const newState = new AnimationState(clip, newName);
        this._nameToState[newName] = newState;
        return newState;
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
     */
    public removeClip (clip: AnimationClip, force?: boolean) {
        if (!clip) {
            warnID(3901);
            return;
        }
        this._init();

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
     * @param [useCapture=false] - When set to true, the capture argument prevents callback
     *                              from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
     *                              When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
     *                              Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
     *
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
    public on (type: string, callback: (state: AnimationState) => void, target?: Object | null, useCapture?: boolean) {
        this._init();
        const ret = super.on(type, callback, target, useCapture);
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
     * @param {Boolean} [useCapture=false] - Specifies whether the callback being removed was registered as a capturing callback or not.
     *                              If not specified, useCapture defaults to false. If a callback was registered twice,
     *                              one with capture and one without, each must be removed separately. Removal of a capturing callback
     *                              does not affect a non-capturing version of the same listener, and vice versa.
     *
     * @example
     * // unregister event to all animation
     * animation.off('play', this.onPlay, this);
     */
    public off (type: string, callback: IEventTargetCallback, target?: Object | null, useCapture?: boolean) {
        this._init();

        if (type === 'lastframe') {
            const nameToState = this._nameToState;
            for (const name of Object.keys(nameToState)) {
                const state = nameToState[name]!;
                state._lastframeEventOn = false;
            }
        }

        super.off(type, callback, target, useCapture);
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Internal Methods
    ///////////////////////////////////////////////////////////////////////////////

    // Dont forget to call _init before every actual process in public methods.
    // Just invoking _init by onLoad is not enough because onLoad is called only if the entity is active.

    private _init () {
        if (this._didInit) {
            return;
        }
        this._didInit = true;
        this._crossFade = new CrossFade(this.node);
        this._createStates();
    }

    private _startCrossFade () {
        cc.director.getAnimationManager().addCrossFade(this._crossFade!);
        this._crossFade!.play();
    }

    private _createStates () {
        this._nameToState = createMap(true);
        // Create animation states.
        for (const clip of this._clips) {
            if (clip) {
                const state = this._createState(clip);
                if (CC_EDITOR) {
                    state.initialize(this.node);
                }
            }
        }
        const isDefaultClipBounded = this._clips.findIndex((clip) => equalClips(clip, this._defaultClip)) >= 0;
        if (this._defaultClip && !isDefaultClipBounded) {
            const state = this._createState(this._defaultClip);
            if (CC_EDITOR) {
                state.initialize(this.node);
            }
        }
    }

    private _createState (clip: AnimationClip, name?: string) {
        const state = new AnimationState(clip, name);
        state._setEventTarget(this);
        this._nameToState[state.name] = state;
        return state;
    }
}

cc.AnimationComponent = AnimationComponent;

function equalClips (clip1: AnimationClip | null, clip2: AnimationClip | null) {
    if (clip1 === clip2) {
        return true;
    }
    return !!clip1 && !!clip2 && (clip1.name === clip2.name || clip1._uuid === clip2._uuid);
}
