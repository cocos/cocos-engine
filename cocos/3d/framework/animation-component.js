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
import { Enum } from '../../core/value-types/index';
import { _decorator } from '../../core/data/index';
const { ccclass, property, executionOrder } = _decorator;
/**
 * @typedef {import("../assets/animation-clip").default} AnimationClip
 * @typedef {import("../framework/skeleton-instance").default} SkeletonInstance
 */

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
        this._current = null;

        this._next = null;

        this._blendTime = 0.0;

        this._blendDuration = 0.3;

        this._skeleton = null;

        this._skelFrom = null;

        this._skelTo = null;
    }

    /**
     * !#en Set up the skeleton
     *
     * !#ch 设置骨架
     * @param {SkeletonInstance} skel - Skeleton instance
     */
    setSkeletonInstance(skel) {
        this._skeleton = skel;
        this._skelFrom = skel.clone();
        this._skelTo = skel.clone();
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

                this._current.clip.sample(this._skeleton, t1);
            } else {
                this._current.clip.sample(this._skelFrom, t0);
                this._next.clip.sample(this._skelTo, t1);

                this._skeleton.blend(this._skelFrom, this._skelTo, alpha);
                this._skeleton.updateMatrices();
            }

            return;
        }

        // handle playing
        if (this._current) {
            let t0 = this._getTime(this._current);
            this._current.clip.sample(this._skeleton, t0);

            this._current.time += dt;
        }
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
@executionOrder(200)
@ccclass('cc.AnimationComponent')
export default class AnimationComponent extends Component {
    @property
    _clips = [];

    /**
     * !#en Current clip
     *
     * !#ch 当前动画剪辑
     * @property currentClip
     * @type {AnimationClip}
     */
    @property
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

    /**
     * !#en Animation state
     *
     * !#ch 动画状态列表
     * @type {Object}
     */
    _name2states = {};

    /**
     * !#en Animation controller
     *
     * !#ch 动画控制器
     * @type {AnimationCtrl}
     */
    _animCtrl = new AnimationCtrl();

    /**
     * !#en Instantiate bone nodes
     *
     * !#ch 实例化骨骼节点
     * @type {SkeletonInstance}
     */
    _skeletonInstance = null;

    /**
     * !#en Clip required for animation playback
     *
     * !#ch 动画剪辑列表
     * @property clips
     * @type {AnimationClip[]}
     */
    @property
    get clips() {
        return this._clips;
    }

    set clips(val) {
        this._clips = val;
    }

    /**
     * !#en Animation skeleton
     *
     * !#ch 动画骨骼
     * @property skeleton
     * @type {SkeletonInstance}
     */
    get skeletonInstance() {
        return this._skeletonInstance;
    }

    set skeletonInstance(value) {
        this._skeletonInstance = value;
        this._animCtrl.setSkeletonInstance(this._skeletonInstance);
    }

    onLoad() {
        AnimationComponent.system.add(this);

        if (this.playAutomatically != undefined &&
            this.playAutomatically &&
            this.currentClip != undefined &&
            this.currentClip) {
            this.play(this.currentClip.name);
        }
    }

    update(dt) {
        if (!this.skeletonInstance) {
            // console.error(`Animation component depends on skinning model component.`);
            let skeleton = this.node.getComponentInChildren('SkinningModel');
            this.skeletonInstance = skeleton;
        }
        if (this.skeletonInstance) {
            this._animCtrl.tick(dt);
        }
    }

    onDestroy() {
        AnimationComponent.system.remove(this);
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
        if (!this._name2states[name]) {
            console.warn(`Failed to play animation ${name}, not found.`);
            return;
        }

        let animState = this._name2states[name];
        animState.time = 0.0;

        this._animCtrl.crossFade(animState, fadeDuration);
    }
}
