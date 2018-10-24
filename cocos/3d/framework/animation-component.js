/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// @ts-check
import Component from '../../components/CCComponent';
import { ccclass, property, executionOrder, menu, executeInEditMode } from '../../core/data/class-decorator';
import Enum from '../../core/value-types/enum';
import AnimationClip, { AnimationTarget, AnimationSampler } from '../assets/animation-clip';

/**
 * !#en Animation State Class
 *
 * !#ch 动画状态类
 * @class AnimationState
 */
class AnimationState {
    constructor(clip) {
        /**
         * !#en An animation clip that is played through this state
         *
         * !#ch 通过此状态播放的动画剪辑
         * @property clip
         * @type {AnimationClip}
         */
        this.clip = clip;

        /**
         * !#en Blend mode
         *
         * !#ch 混合模式
         * @property blendMode
         * @type {String}
         */
        this.blendMode = AnimationState.BlendMode.Blend;

        /**
         * !#en Wrapping mode
         *
         * !#ch 循环模式
         * @property wrapMode
         * @type {String}
         */
        this.wrapMode = AnimationState.WrapMode.Loop;

        /**
         * !#en The playback speed
         *
         * !#ch 播放速度
         * @property speed
         * @type {Number}
         */
        this.speed = 1.0;

        /**
         * !#en The current time of the animation.
         *
         * !#ch 当前动画播放时间
         * @property time
         * @type {Number}
         */
        this.time = 0.0;

        /**
         * !#en The weight of animation.
         *
         * !#ch 动画权重
         * @property weight
         * @type {Number}
         */
        this.weight = 1.0;
    }

    /**
     * !#en The blend mode of animation state
     *
     * !#ch 动画状态的混合模式
     * @static
     * @enum AnimationState.BlendMode
     */
    static BlendMode = Enum({
        /**
         * !#en Animations will be blended.
         *
         * !#ch 动画将被混合
         * @property Blend
         * @readonly
         * @type {String}
         */
        Blend: 'blend',
        /**
         * !#en Animations will be added.
         *
         * !#ch 动画将被附加
         * @property Additive
         * @readonly
         * @type {String}
         */
        Additive: 'additive'
    });

    /**
     * !#en Wrapping mode of the animation.
     *
     * !#ch 动画状态的循环模式
     * @static
     * @enum AnimationState.WrapMode
     */
    static WrapMode = Enum({
        /**
         * !#en Only once
         *
         * !#ch 只播放一次
         * @property Once
         * @readonly
         * @type {String}
         */
        Once: 'once',
        /**
         * !#en Loop
         *
         * !#ch 循环播放
         * @property Additive
         * @readonly
         * @type {String}
         */
        Loop: 'loop',
        /**
         * !#en Ping Pong
         *
         * !#ch 乒乓模式播放
         * @property PinpPong
         * @readonly
         * @type {String}
         */
        PinpPong: 'ping-pong',
        /**
         * !#en Plays back the animation. The last frame is played until the end.
         *
         * !#ch 回放动画。当到结尾时，会持续播放最后一帧。
         * @property Clamp
         * @readonly
         * @type {String}
         */
        Clamp: 'clamp'
    });
}

/**
 * !#en Animation Controller
 *
 * !#ch 动画控制器
 * @class AnimationCtrl
 */
class AnimationCtrl {
    constructor() {
        /**
         * @type {AnimationTarget}
         */
        this._animationTarget = null;

        /**
         * @type {AnimationSampler}
         */
        this._animationSampler = null;

        this._current = null;

        this._next = null;

        this._blendTime = 0.0;

        this._blendDuration = 0.3;
    }

    /**
     * !#en Set up the animation target
     *
     * !#ch 设置动画目标
     * @param {AnimationTarget} animationTarget
     */
    setAnimationTarget(animationTarget) {
        this._animationTarget = animationTarget;
        if (this._animationTarget) {
            this._animationSampler = new AnimationSampler(this._animationTarget);
        }
        this._nodeIndexers = new Map();
    }

    /**
     * !#en Animation fades in and out
     *
     * !#ch 动画的淡入淡出功能
     * @param {AnimationState} to
     * @param {Number} duration
     */
    crossFade(to, duration) {
        if (this._current && duration > 0.0) {
            this._next = to;
            this._blendTime = 0.0;
            this._blendDuration = duration;
        } else {
            this._current = to;
            this._next = null;
        }
    }

    tick(dt) {
        if (!this._animationSampler) {
            return;
        }

        this._animationSampler.reset();

        // handle blend
        if (this._current && this._next) {
            let t0 = this._getTime(this._current);
            let t1 = this._getTime(this._next);

            let alpha = this._blendTime / this._blendDuration;

            this._current.time += dt;
            this._next.time += dt;
            this._blendTime += dt;

            if (alpha > 1.0) {
                this._current = this._next;
                this._next = null;
                this._animationSampler.sample(this._current.clip, t1, 1.0);
            } else {
                this._animationSampler.sample(this._current.clip, t0, alpha);
                this._animationSampler.sample(this._next.clip, t1, 1.0 - alpha);
            }
        }

        // handle playing
        if (this._current) {
            let t0 = this._getTime(this._current);
            this._animationSampler.sample(this._current.clip, t0, 1.0);
            this._current.time += dt;
        }

        this._animationSampler.apply();
    }

    /**
     * !#en Get the play time of an animation clip in current animation state
     *
     * !#ch 返回当前动画状态下的动画剪辑播放时间
     * @param {AnimationState} state - Specify animation status
     */
    _getTime(state) {
        let t = state.time;
        let length = state.clip.length;
        t *= state.speed;

        if (state.wrapMode === 'once') {
            if (t > length) {
                t = 0.0;
            }
        } else if (state.wrapMode === 'loop') {
            t %= length;
        } else if (state.wrapMode === 'ping-pong') {
            let order = Math.floor(t / length);
            if (order % 2 === 1) {
                t = length - t % length;
            }
        }

        return t;
    }
}

/**
 * !#en
 * Basic animation component for playing animation
 *
 * !#ch
 * 基础动画组件用于动画播放
 * @class AnimationComponent
 * @extends Component
 */
@ccclass('cc.AnimationComponent')
@executionOrder(99)
@executeInEditMode
@menu('Components/AnimationComponent')
export default class AnimationComponent extends Component {
    /**
     * @type {AnimationClip[]}
     */
    @property
    _clips = [];

    /**
     * !#en Current clip
     *
     * !#ch 当前动画剪辑
     * @property currentClip
     * @type {AnimationClip}
     */
    @property(AnimationClip)
    currentClip = null;

    /**
     * !#en Whether to start the animation automatically
     *
     * !#ch 是否启动时自动播放动画
     * @property playAutomatically
     * @type {Boolean}
     */
    @property
    playAutomatically = false;

    _preview = false;

    @property({type: Boolean})
    get preview() {
        return this._preview;
    }

    set preview(value) {
        this._preview = value;
        if (value) {
            if (this.currentClip) {
                cc.engine.animatingInEditMode = true;
                this.play(this.currentClip.name);
            }
        } else {
            cc.engine.animatingInEditMode = false;
            this._animCtrl.crossFade(null, 0);
        }
    }

    /**
     * !#en Animation state
     *
     * !#ch 动画状态列表
     * @type {Object}
     */
    _name2states = {};

    constructor() {
        super();

        /**
         * @type {AnimationTarget}
         */
        this._target = null;

        /**
         * !#en Animation controller
         *
         * !#ch 动画控制器
         * @type {AnimationCtrl}
         */
        this._animCtrl = new AnimationCtrl();
    }

    /**
     * !#en Clip required for animation playback
     *
     * !#ch 动画剪辑列表
     * @property clips
     * @type {AnimationClip[]}
     */
    @property([AnimationClip])
    get clips() {
        return this._clips;
    }

    set clips(val) {
        this._clips = val;
    }

    onLoad() {
        this._clips.forEach(clip => {
            this._name2states[clip.name] = new AnimationState(clip);
        });

        if (this.playAutomatically != undefined &&
            this.playAutomatically &&
            this.currentClip != undefined &&
            this.currentClip) {
            this.play(this.currentClip.name);
        }
    }

    update(dt) {
        this._animCtrl.tick(dt);
    }

    onDestroy() {
    }

    onEnable() {
        this._resetTarget();
    }

    onDisable() {
        this._target = null;
        this._animCtrl.setAnimationTarget(null);
    }

    /**
     * !#en Add an animation clip to the animation status list
     *
     * !#ch 添加动画剪辑到动画状态列表
     * @param {String} name - The name of animation clip
     * @param {AnimationClip} animClip - Animation clip
     */
    addClip(name, animClip) {
        if (this._name2states[name]) {
            console.warn(`Failed to add clip ${name}, the name already exsits.`);
            return;
        }

        this._clips.push(animClip);
        this._name2states[name] = new AnimationState(animClip);
    }

    /**
     * !#en Get the animation state through the animation clip name
     *
     * !#ch 返回动画剪辑相对应的动画状态
     * @param {String} name - The name of animation clip
     */
    getState(name) {
        return this._name2states[name];
    }

    /**
     * !#en Play the name of the animation clip
     *
     * !#ch 播放相对应名字的动画剪辑
     * @param {String} name - The name of animation clip
     * @param {Number} fadeDuration - Fade duration
     */
    play(name, fadeDuration = 0.3) {
        if (!this._target) {
            return;
        }

        if (!this._name2states[name]) {
            console.warn(`Failed to play animation ${name}, not found.`);
            return;
        }

        let animState = this._name2states[name];
        animState.time = 0.0;

        this._animCtrl.crossFade(animState, fadeDuration);
    }

    _resetTarget() {
        this._target = new AnimationTarget();
        this._clips.forEach(clip => {
            clip.frames.forEach(frame => {
                frame.channels.forEach(channel => {
                    const targetPath = channel.target;
                    if (this._target.get(targetPath)) {
                        return;
                    }
                    const targetNode = this.node.getChildByPath(targetPath);
                    if (!targetNode) {
                        console.warn(`Animation target ${targetPath} not found in scene graph.`);
                        return;
                    }
                    this._target.add(targetPath, targetNode);
                });
            });
        });
        this._animCtrl.setAnimationTarget(this._target);
    }
}
