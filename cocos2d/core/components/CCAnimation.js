/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var AnimationAnimator = require('../../animation/animation-animator');
var AnimationClip = require('../../animation/animation-clip');

function equalClips (clip1, clip2) {
    if (clip1 === clip2) {
        return true;
    }

    return clip1 && clip2 && (clip1.name === clip2.name || clip1._uuid === clip2._uuid);
}

/**
 * !#en The animation component is used to play back animations.
 *   
 * Animation provide several events to register：
 *  - play : Emit when egine playing animation
 *  - stop : Emit when stop playing animation
 *  - pause : Emit when pause animation
 *  - resume : Emit when resume animation
 *  - lastframe : If animation repeat coutn is larger than 1, emit when animation play to the last frame
 *  - finished : Emit when finish playing animation
 *
 * !#zh Animation 组件用于播放动画。你能指定动画剪辑到动画组件并从脚本控制播放。
 *   
 * Animation 提供了一系列可注册的事件：
 *  - play : 开始播放时
 *  - stop : 停止播放时
 *  - pause : 暂停播放时
 *  - resume : 恢复播放时
 *  - lastframe : 假如动画循环次数大于 1，当动画播放到最后一帧时
 *  - finished : 动画播放完成时
 * 
 * @class Animation
 * @extends CCComponent
 */
var Animation = cc.Class({
    name: 'cc.Animation',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/Animation',
        help: 'i18n:COMPONENT.help_url.animation',
        executeInEditMode: true,
    },

    ctor: function () {
        // The actual implement for Animation
        this._animator = null;

        this._nameToState = {};
        this._didInit = false;

        this._currentClip = null;

        this._listeners = [];
    },

    properties: {

        _defaultClip: {
            default: null,
            type: AnimationClip,
        },

        /**
         * !#en Animation will play the default clip when start game.
         * !#zh 在勾选自动播放或调用 play() 时默认播放的动画剪辑。
         * @property defaultClip
         * @type {AnimationClip}
         */
        defaultClip: {
            type: AnimationClip,
            get: function () {
                return this._defaultClip;
            },
            set: function (value) {
                if (!CC_EDITOR || (cc.engine && cc.engine.isPlaying)) {
                    return;
                }

                this._defaultClip = value;

                if (!value) {
                    return;
                }

                var clips = this._clips;

                for (var i = 0, l = clips.length; i < l; i++) {
                    if (equalClips(value, clips[i])) {
                        return;
                    }
                }

                this.addClip(value);
            },
            tooltip: 'i18n:COMPONENT.animation.default_clip'
        },

        /**
         * !#en Current played clip.
         * !#zh 当前播放的动画剪辑。
         * @property currentClip
         * @type {AnimationClip}
         */
        currentClip: {
            get: function () {
                return this._currentClip;
            },
            set: function (value) {
                this._currentClip = value;
            },
            type: AnimationClip,
            visible: false
        },

        /**
         * !#en All the clips used in this animation.
         * !#zh 通过脚本可以访问并播放的 AnimationClip 列表。
         * @property _clips
         * @type {AnimationClip[]}
         * @private
         */
        _clips: {
            default: [],
            type: [AnimationClip],
            tooltip: 'i18n:COMPONENT.animation.clips',
            visible: true
        },

        /**
         * !#en Whether the animation should auto play the default clip when start game.
         * !#zh 是否在运行游戏后自动播放默认动画剪辑。
         * @property playOnLoad
         * @type {Boolean}
         * @default true
         */
        playOnLoad: {
            default: false,
            tooltip: 'i18n:COMPONENT.animation.play_on_load'
        }
    },

    onEnable: function () {
        if (!CC_EDITOR && this.playOnLoad && this._defaultClip) {
            this.playOnLoad = false;

            var state = this.getAnimationState(this._defaultClip.name);
            this._animator.playState(state);
        }
        else {
            this.resume();
        }
    },

    onDisable: function () {
        this.pause();
    },

    onDestroy: function () {
        this.stop();
    },

    ///////////////////////////////////////////////////////////////////////////////
    // Public Methods
    ///////////////////////////////////////////////////////////////////////////////

    /**
     * !#en Get all the clips used in this animation.
     * !#zh 获取动画组件上的所有动画剪辑。
     * @method getClips
     * @return {AnimationClip[]}
     */
    getClips: function () {
        return this._clips;
    },

    /**
     * !#en Plays an animation and stop other animations.
     * !#zh 播放当前或者指定的动画，并且停止当前正在播放动画。
     * @method play
     * @param {String} [name] - The name of animation to play. If no name is supplied then the default animation will be played.
     * @param {Number} [startTime] - play an animation from startTime
     * @return {AnimationState} - The AnimationState of playing animation. In cases where the animation can't be played (ie, there is no default animation or no animation with the specified name), the function will return null.
     * @example
     * var animCtrl = this.node.getComponent(cc.Animation);
     * animCtrl.play("linear");
     */
    play: function (name, startTime) {
        var state = this.playAdditive(name, startTime);
        var playingStates = this._animator.playingAnims;

        for (var i = playingStates.length; i >= 0; i--) {
            if (playingStates[i] === state) {
                continue;
            }

            this._animator.stopState(playingStates[i]);
        }

        return state;
    },

    /**
     * !#en
     * Plays an additive animation, it will not stop other animations.
     * If there are other animations playing, then will play several animations at the same time.
     * !#zh 播放当前或者指定的动画（将不会停止当前播放的动画）。
     * @method playAdditive
     * @param {String} [name] - The name of animation to play. If no name is supplied then the default animation will be played.
     * @param {Number} [startTime] - play an animation from startTime
     * @return {AnimationState} - The AnimationState of playing animation. In cases where the animation can't be played (ie, there is no default animation or no animation with the specified name), the function will return null.
     * @example
     * // linear_1 and linear_2 at the same time playing.
     * var animCtrl = this.node.getComponent(cc.Animation);
     * animCtrl.playAdditive("linear_1");
     * animCtrl.playAdditive("linear_2");
     */
    playAdditive: function (name, startTime) {
        this._init();
        var state = this.getAnimationState(name || this._defaultClip.name);
        if (state) {
            var animator = this._animator;

            if (animator.isPlaying && state.isPlaying) {
                if (state.isPaused) {
                    animator.resumeState(state);
                }
                else {
                    animator.stopState(state);
                    animator.playState(state, startTime);
                }
            }
            else {
                animator.playState(state, startTime);
            }

            this.currentClip = state.clip;
        }
        return state;
    },

    /**
     * !#en Stops an animation named name. If no name is supplied then stops all playing animations that were started with this Animation. <br/>
     * Stopping an animation also Rewinds it to the Start.
     * !#zh 停止当前或者指定的动画。如果没有指定名字，则停止所有动画。
     * @method stop
     * @param {String} [name] - The animation to stop, if not supplied then stops all playing animations.
     */
    stop: function (name) {
        if (!this._didInit) {
            return;
        }
        if (name) {
            var state = this._nameToState[name];
            if (state) {
                this._animator.stopState(state);
            }
        }
        else {
            this._animator.stop();
        }
    },

    /**
     * !#en Pauses an animation named name. If no name is supplied then pauses all playing animations that were started with this Animation.
     * !#zh 暂停当前或者指定的动画。如果没有指定名字，则暂停当前正在播放的动画。
     * @method pause
     * @param {String} [name] - The animation to pauses, if not supplied then pauses all playing animations.
     */
    pause: function (name) {
        if (!this._didInit) {
            return;
        }
        if (name) {
            var state = this._nameToState[name];
            if (state) {
                this._animator.pauseState(state);
            }
        }
        else {
            this._animator.pause();
        }
    },

    /**
     * !#en Resumes an animation named name. If no name is supplied then resumes all paused animations that were started with this Animation.
     * !#zh 重新播放指定的动画，如果没有指定名字，则重新播放当前正在播放的动画。
     * @method resume
     * @param {String} [name] - The animation to resumes, if not supplied then resumes all paused animations.
     */
    resume: function (name) {
        if (!this._didInit) {
            return;
        }
        if (name) {
            var state = this._nameToState[name];
            if (state) {
                this._animator.resumeState(state);
            }
        }
        else {
            this._animator.resume();
        }
    },

    /**
     * !#en Make an animation named name go to the specified time. If no name is supplied then make all animations go to the specified time.
     * !#zh 设置指定动画的播放时间。如果没有指定名字，则设置所有动画的播放时间。
     * @method setCurrentTime
     * @param {Number} [time] - The time to go to
     * @param {String} [name] - Specified animation name, if not supplied then make all animations go to the time.
     */
    setCurrentTime: function (time, name) {
        this._init();
        if (name) {
            var state = this._nameToState[name];
            if (state) {
                this._animator.setStateTime(state, time);
            }
        }
        else {
            for (var name in this._nameToState) {
                state = this._nameToState[name];
                this._animator.setStateTime(state, time);
            }
        }
    },

    /**
     * !#en Returns the animation state named name. If no animation with the specified name, the function will return null.
     * !#zh 获取当前或者指定的动画状态，如果未找到指定动画剪辑则返回 null。
     * @method getAnimationState
     * @param {String} name
     * @return {AnimationState}
     */
    getAnimationState: function (name) {
        this._init();
        var state = this._nameToState[name];

        if (CC_EDITOR && (!state || !cc.js.array.contains(this._clips, state.clip))) {
            this._didInit = false;

            if (this.animator) {
                this.animator.stop();
            }

            this._init();
            state = this._nameToState[name];
        }

        if (state && !state.curveLoaded) {
            this._animator._reloadClip(state);
        }

        return state || null;
    },

    /**
     * !#en Adds a clip to the animation with name newName. If a clip with that name already exists it will be replaced with the new clip.
     * !#zh 添加动画剪辑，并且可以重新设置该动画剪辑的名称。
     * @method addClip
     * @param {AnimationClip} clip - the clip to add
     * @param {String} [newName]
     * @return {AnimationState} - The AnimationState which gives full control over the animation clip.
     */
    addClip: function (clip, newName) {
        if (!clip) {
            cc.warn('Invalid clip to add');
            return;
        }
        this._init();

        // add clip
        if (!cc.js.array.contains(this._clips, clip)) {
            this._clips.push(clip);
        }

        // replace same name clip
        newName = newName || clip.name;
        var oldState = this._nameToState[newName];
        if (oldState) {
            if (oldState.clip === clip) {
                return oldState;
            }
            else {
                var index = this._clips.indexOf(oldState.clip);
                if (index !== -1) {
                    this._clips.splice(index, 1);
                }
            }
        }

        // replace state
        var newState = new cc.AnimationState(clip, newName);
        this._nameToState[newName] = newState;
        return newState;
    },

    /**
     * !#en 
     * Remove clip from the animation list. This will remove the clip and any animation states based on it.
     * If there are animation states depand on the clip are playing or clip is defaultClip, it will not delete the clip.
     * But if force is true, then will always remove the clip and any animation states based on it. If clip is defaultClip, defaultClip will be reset to null
     * !#zh
     * 从动画列表中移除指定的动画剪辑，<br/>
     * 如果依赖于 clip 的 AnimationState 正在播放或者 clip 是 defaultClip 的话，默认是不会删除 clip 的。
     * 但是如果 force 参数为 true，则会强制停止该动画，然后移除该动画剪辑和相关的动画。这时候如果 clip 是 defaultClip，defaultClip 将会被重置为 null。
     * @method removeClip
     * @param {AnimationClip} clip
     * @param {Boolean} force If force is true, then will always remove the clip and any animation states based on it.
     */
    removeClip: function (clip, force) {
        if (!clip) {
            cc.warn('Invalid clip to remove');
            return;
        }
        this._init();

        var state;
        for (var name in this._nameToState) {
            state = this._nameToState[name];
            var stateClip = state.clip;
            if (stateClip === clip) {
                break;
            }
        }

        if (clip === this._defaultClip) {
            if (force) this._defaultClip = null;
            else {
                if (!CC_TEST) cc.warn('clip is defaultClip, set force to true to force remove clip and animation state');
                return;
            } 
        }

        if (state && state.isPlaying) {
            if (force) this.stop(state.name);
            else {
                if (!CC_TEST) cc.warn('animation state is playing, set force to true to force stop and remove clip and animation state');
                return;
            }
        }

        this._clips = this._clips.filter(function (item) {
            return item !== clip;
        });

        if (state) {
            delete this._nameToState[state.name];    
        }
    },

    /**
     * !#en
     * Samples animations at the current state.<br/>
     * This is useful when you explicitly want to set up some animation state, and sample it once.
     * !#zh 对当前动画进行采样。你可以手动将动画设置到某一个状态，然后采样一次。
     * @method sample
     */
    sample: function () {
        this._init();
        this._animator.sample();
    },


    /**
     * !#en 
     * Register animation event callback.
     * The event argumetns will provide the AnimationState which emit the event.
     * When play an animation, will auto register the event callback to the AnimationState, and unregister the event callback from the AnimationState when animation stopped.
     * !#zh
     * 注册动画事件回调。
     * 回调的事件里将会附上发送事件的 AnimationState。
     * 当播放一个动画时，会自动将事件注册到对应的 AnimationState 上，停止播放时会将事件从这个 AnimationState 上取消注册。
     * @method on
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event} callback.param event
     * @param {Object} target - The target to invoke the callback, can be null
     * @param {Boolean} useCapture - When set to true, the capture argument prevents callback
     *                              from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
     *                              When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
     *                              Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
     *
     * @example
     * onPlay: function (event) {
     *     var state = event.detail;    // state instanceof cc.AnimationState
     *     var type = event.type;       // type === 'play';
     * }
     * 
     * // register event to all animation
     * animation.on('', 'play',      this.onPlay,        this);
     */
    on: function (type, callback, target, useCapture) {
        this._init();
        var listeners = this._listeners;

        for (var i = 0, l = listeners.length; i < l; i++) {
            var listener = listeners[i];
            if (listener[0] === type &&
                listener[1] === callback &&
                listener[2] === target &&
                listener[3] === useCapture) {
                return;
            }
        }

        var anims = this._animator.playingAnims;
        for (var j = 0, jj = anims.length; j < jj; j++) {
            anims[j].on(type, callback, target, useCapture);
        }

        listeners.push([type, callback, target, useCapture]);
    },


    /**
     * !#en
     * Unregister animation event callback.
     * !#zh
     * 取消注册动画事件回调。
     * @method off
     * @param {String} type - A string representing the event type being removed.
     * @param {Function} callback - The callback to remove.
     * @param {Object} target - The target to invoke the callback, if it's not given, only callback without target will be removed
     * @param {Boolean} useCapture - Specifies whether the callback being removed was registered as a capturing callback or not.
     *                              If not specified, useCapture defaults to false. If a callback was registered twice,
     *                              one with capture and one without, each must be removed separately. Removal of a capturing callback
     *                              does not affect a non-capturing version of the same listener, and vice versa.
     *
     * @example
     * // unregister event to all animation
     * animation.off('', 'play',      this.onPlay,        this);
     */
    off: function (type, callback, target, useCapture) {
        this._init();
        var listeners = this._listeners;

        for (var i = listeners.length - 1; i >= 0; i--) {
            var listener = listeners[i];
            if (listener[0] === type &&
                listener[1] === callback &&
                listener[2] === target &&
                listener[3] === useCapture) {

                var anims = this._animator.playingAnims;
                for (var j = 0, jj = anims.length; j < jj; j++) {
                    anims[j].off(type, callback, target, useCapture);
                }

                listeners.splice(i, 1);
            }
        }
    },

    ///////////////////////////////////////////////////////////////////////////////
    // Internal Methods
    ///////////////////////////////////////////////////////////////////////////////

    // Dont forget to call _init before every actual process in public methods.
    // Just invoking _init by onLoad is not enough because onLoad is called only if the entity is active.

    _init: function () {
        if (this._didInit) {
            return;
        }
        this._didInit = true;
        this._animator = new AnimationAnimator(this.node, this);
        this._createStates();
    },

    _createStates: function() {
        this._nameToState = {};
        
        // create animation states
        var state = null;
        var defaultClipState = false;
        for (var i = 0; i < this._clips.length; ++i) {
            var clip = this._clips[i];
            if (clip) {
                state = new cc.AnimationState(clip);

                if (CC_EDITOR) {
                    this._animator._reloadClip(state);
                }

                this._nameToState[state.name] = state;
                if (equalClips(this._defaultClip, clip)) {
                    defaultClipState = state;
                }
            }
        }
        if (this._defaultClip && !defaultClipState) {
            state = new cc.AnimationState(this._defaultClip);

            if (CC_EDITOR) {
                this._animator._reloadClip(state);
            }

            this._nameToState[state.name] = state;
        }
    }
});

cc.Animation = module.exports = Animation;
