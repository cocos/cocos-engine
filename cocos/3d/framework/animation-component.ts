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
import { Component } from '../../components/component';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { ccenum } from '../../core/value-types/enum';
import AnimationClip, { AnimationSampler, AnimationTarget } from '../assets/animation-clip';

enum BlendMode {
    /**
     * !#en Animations will be blended.
     *
     * !#ch 动画将被混合
     */
    Blend = 'blend',
    /**
     * !#en Animations will be added.
     *
     * !#ch 动画将被附加
     */
    Additive = 'additive',
}

ccenum(BlendMode);

enum WrapMode {
    /**
     * !#en Only once
     *
     * !#ch 只播放一次
     */
    Once = 'once',

    /**
     * !#en Loop
     *
     * !#ch 循环播放
     */
    Loop = 'loop',

    /**
     * !#en Ping Pong
     *
     * !#ch 乒乓模式播放
     */
    PinpPong = 'ping-pong',

    /**
     * !#en Plays back the animation. The last frame is played until the end.
     *
     * !#ch 回放动画。当到结尾时，会持续播放最后一帧。
     */
    Clamp = 'clamp',
}

ccenum(WrapMode);

/**
 * !#en Animation State Class
 *
 * !#ch 动画状态类
 */
class AnimationState {
    /**
     * !#en The blend mode of animation state.
     *
     * !#ch 动画状态的混合模式
     */
    public static BlendMode = BlendMode;

    /**
     * !#en Wrapping mode of the animation.
     *
     * !#ch 动画状态的循环模式
     */
    public static WrapMode = WrapMode;

    /**
     * !#en An animation clip that is played through this state
     *
     * !#ch 通过此状态播放的动画剪辑
     */
    public clip: AnimationClip;

    /**
     * !#en Blend mode
     *
     * !#ch 混合模式
     */
    public blendMode: BlendMode = BlendMode.Blend;

    /**
     * !#en Wrapping mode
     *
     * !#ch 循环模式
     */
    public wrapMode: WrapMode = WrapMode.Loop;

    /**
     * !#en The playback speed
     *
     * !#ch 播放速度
     */
    public speed = 1.0;

    /**
     * !#en The current time of the animation.
     *
     * !#ch 当前动画播放时间
     */
    public time: number = 0.0;

    /**
     * !#en The weight of animation.
     *
     * !#ch 动画权重
     */
    public weight: number = 1.0;

    constructor (clip: AnimationClip) {
        this.clip = clip;
    }
}

/**
 * !#en Animation Controller
 *
 * !#ch 动画控制器
 */
class AnimationCtrl {
    private _animationTarget: AnimationTarget | null = null;
    private _animationSampler: AnimationSampler | null = null;
    private _current: AnimationState | null = null;
    private _next: AnimationState | null = null;
    private _blendTime = 0.0;
    private _blendDuration = 0.3;

    /**
     * !#en Set up the animation target
     *
     * !#ch 设置动画目标
     */
    public setAnimationTarget (animationTarget: AnimationTarget | null) {
        this._animationTarget = animationTarget;
        if (this._animationTarget) {
            this._animationSampler = new AnimationSampler(this._animationTarget);
        }
    }

    /**
     * !#en Animation fades in and out
     *
     * !#ch 动画的淡入淡出功能
     * @param to
     * @param duration
     */
    public crossFade (to: AnimationState | null, duration: number) {
        if (this._current === to) {
            return;
        }
        if (this._current && duration > 0.0) {
            this._next = to;
            this._blendTime = 0.0;
            this._blendDuration = duration;
        } else {
            this._current = to;
            this._next = null;
        }
    }

    public tick (deltaTime: number) {
        if (!this._animationSampler) {
            return;
        }

        this._animationSampler.reset();

        // handle blend
        if (this._current && this._next) {
            const t0 = this._getTime(this._current);
            const t1 = this._getTime(this._next);

            const alpha = this._blendTime / this._blendDuration;

            this._current.time += deltaTime;
            this._next.time += deltaTime;
            this._blendTime += deltaTime;

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
        else if (this._current) {
            const t0 = this._getTime(this._current);
            this._animationSampler.sample(this._current.clip, t0, 1.0);
            this._current.time += deltaTime;
        }

        this._animationSampler.apply();
    }

    /**
     * !#en Get the play time of an animation clip in current animation state
     *
     * !#ch 返回当前动画状态下的动画剪辑播放时间
     * @param state - Specify animation status
     */
    private _getTime (state: AnimationState) {
        let t = state.time;
        const length = state.clip.length;
        t *= state.speed;

        if (state.wrapMode === 'once') {
            if (t > length) {
                t = 0.0;
            }
        } else if (state.wrapMode === 'loop') {
            t %= length;
        } else if (state.wrapMode === 'ping-pong') {
            const order = Math.floor(t / length);
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
 */
@ccclass('cc.AnimationComponent')
@executionOrder(99)
@executeInEditMode
@menu('Components/AnimationComponent')
export class AnimationComponent extends Component {
    @property({ type: [AnimationClip] })
    public _clips: AnimationClip[] = [];

    /**
     * !#en Current clip
     *
     * !#ch 当前动画剪辑
     */
    @property({ type: AnimationClip })
    public currentClip: AnimationClip | null = null;

    /**
     * !#en Whether to start the animation automatically
     *
     * !#ch 是否启动时自动播放动画
     */
    @property
    public playAutomatically: boolean = false;

    private _preview = false;

    private _animationController: AnimationCtrl = new AnimationCtrl();

    private _name2states: { [x: string]: AnimationState | undefined; } = {};

    private _animationTarget: AnimationTarget | null = null;

    @property({ type: Boolean })
    get preview () {
        return this._preview;
    }

    set preview (value) {
        this._preview = value;
        if (value) {
            if (this.currentClip) {
                cc.engine.animatingInEditMode = true;
                this.play(this.currentClip.name);
            }
        } else {
            cc.engine.animatingInEditMode = false;
            this._animationController.crossFade(null, 0);
        }
    }

    constructor () {
        super();
    }

    /**
     * !#en Clip required for animation playback
     *
     * !#ch 动画剪辑列表
     */
    @property({ type: [AnimationClip] })
    get clips () {
        return this._clips;
    }

    set clips (val) {
        this._clips = val;
    }

    public onLoad () {
        this._clips.forEach((clip) => {
            this._name2states[clip.name] = new AnimationState(clip);
        });

        this._resetTarget();

        if (!CC_EDITOR && this.playAutomatically && this.currentClip) {
            this.play(this.currentClip.name);
        }
    }

    public update (deltaTime: number) {
        this._animationController.tick(deltaTime);
    }

    public onDestroy () {
    }

    public onEnable () {
    }

    public onDisable () {
        this._animationTarget = null;
        this._animationController.setAnimationTarget(null);
    }

    /**
     * !#en Add an animation clip to the animation status list
     *
     * !#ch 添加动画剪辑到动画状态列表
     * @param name - The name of animation clip
     * @param animationClip - Animation clip
     */
    public addClip (name: string, animationClip: AnimationClip) {
        if (this._name2states[name]) {
            console.warn(`Failed to add clip ${name}, the name already exsits.`);
            return;
        }

        this._clips.push(animationClip);
        this._name2states[name] = new AnimationState(animationClip);
    }

    /**
     * !#en Get the animation state through the animation clip name
     *
     * !#ch 返回动画剪辑相对应的动画状态
     * @param name - The name of animation clip
     */
    public getState (name: string) {
        return this._name2states[name];
    }

    /**
     * !#en Play the name of the animation clip
     *
     * !#ch 播放相对应名字的动画剪辑
     * @param name - The name of animation clip
     * @param fadeDuration - Fade duration
     */
    public play (name: string, fadeDuration = 0.3) {
        if (!this._animationTarget) {
            return;
        }

        const state = this._name2states[name];
        if (!state) {
            console.warn(`Failed to play animation ${name}, not found.`);
            return;
        }

        state.time = 0.0;
        this._animationController.crossFade(state, fadeDuration);
    }

    public _resetTarget () {
        const animationTarget = new AnimationTarget();
        this._clips.forEach((clip) => {
            clip.channels.forEach((channel) => {
                const targetPath = channel.target;
                if (animationTarget.get(targetPath)) {
                    return;
                }
                const targetNode = this.node.getChildByPath(targetPath);
                if (!targetNode) {
                    console.warn(`Animation target ${targetPath} not found in scene graph.`);
                    return;
                }
                animationTarget.add(targetPath, targetNode);
            });
        });
        this._animationTarget = animationTarget;
        this._animationController.setAnimationTarget(this._animationTarget);
    }
}
