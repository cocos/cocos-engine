/**
 * @category animation
 */

import { removeIf } from '../core/utils/array';
import { clamp01 } from '../core/value-types';
import { AnimationState } from './animation-state';
import { Playable } from './playable';

interface IFadeState {
    state: AnimationState | null;
    easeTime: number;
    easeDuration: number;
}

export class CrossFade extends Playable {
    private _fadings: IFadeState[] = [];

    constructor () {
        super();
        this._unshiftDefault();
    }

    public update (deltaTime: number) {
        if (!this.isPlaying || this.isPaused) {
            return;
        }
        let absoluteWeight = 1.0;
        for (let i = 0; i < this._fadings.length; ++i) {
            if (absoluteWeight === 0) {
                for (let j = i; j < this._fadings.length; ++j) {
                    const follingFading = this._fadings[j];
                    if (follingFading.state) {
                        this._directStopState(follingFading.state);
                    }
                }
                this._fadings.splice(i);
                break;
            }
            const fading = this._fadings[i];
            fading.easeTime += deltaTime;
            const relativeWeight = clamp01(fading.easeTime / fading.easeDuration);
            const weight = relativeWeight * absoluteWeight;
            absoluteWeight = absoluteWeight * (1.0 - relativeWeight);
            if (fading.state) {
                fading.state.weight = weight;
            }
        }
        // if (this._animations.length > 1) {
        //     console.log(this._animations.map((a) => a.state ? `[${a.state.name}:${a.state.weight}]` : '<null>').join(';'));
        // }
    }

    /**
     * 在指定时间内将从当前动画状态切换到指定的动画状态。
     * @param state 指定的动画状态。
     * @param duration 切换时间。
     */
    public crossFade (state: AnimationState | null, duration: number) {
        let es = removeIf(this._fadings, (animation) => animation.state === state);
        if (es === undefined) {
            es = {
                easeDuration: duration,
                easeTime: 0,
                state,
            };
        }
        this._fadings.unshift(es);
        if (state) {
            this._directPlayState(state);
        }
    }

    /**
     * 停止我们淡入淡出的所有动画状态并停止淡入淡出。
     */
    public onPause () {
        super.onPause();
        for (const fading of this._fadings) {
            if (fading.state) {
                fading.state.pause();
            }
        }
    }

    /**
     * 恢复我们淡入淡出的所有动画状态并继续淡入淡出。
     */
    public onResume () {
        super.onResume();
        for (const fading of this._fadings) {
            if (fading.state) {
                fading.state.resume();
            }
        }
    }

    /**
     * 停止所有淡入淡出的动画状态并移除最后一个动画状态之外的所有动画状态。
     */
    public onStop () {
        super.onStop();
        const currentFading = this._fadings[0];
        if (currentFading.state) {
            currentFading.state.weight = 1;
        }
        for (const fading of this._fadings) {
            if (fading.state) {
                this._directStopState(fading.state);
            }
        }
        this._fadings.splice(1, this._fadings.length - 1);
        // this._fadings.length = 0;
        // this._unshiftDefault();
    }

    public clear () {
        this.stop();
        this._fadings.length = 0;
        this._unshiftDefault();
    }

    private _unshiftDefault () {
        this._fadings.unshift({
            state: null,
            easeDuration: Number.POSITIVE_INFINITY,
            easeTime: 0,
        });
    }

    private _directStopState (state: AnimationState) {
        // state.weight = 0;
        state.stop();
    }

    private _directPlayState (state: AnimationState) {
        state.weight = 1;
        state.play();
    }
}
