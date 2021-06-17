/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 * @packageDocumentation
 * @module animation
 */

import { clamp01 } from '../math/utils';
import { remove } from '../utils/array';
import { AnimationState } from './animation-state';
import { Playable } from './playable';
import { legacyCC } from '../global-exports';
import type { AnimationManager } from './animation-manager';

interface IManagedState {
    state: AnimationState | null;
    reference: number;
}

interface IFading {
    target: IManagedState;
    easeTime: number;
    easeDuration: number;
}

interface CrossFadeScheduler {
    addCrossFade(crossFade: CrossFade): void;

    removeCrossFade(crossFade: CrossFade): void;
}

export class CrossFade extends Playable {
    private readonly _managedStates: IManagedState[] = [];
    private readonly _fadings: IFading[] = [];
    private _scheduled = false;
    private declare _scheduler: CrossFadeScheduler;

    constructor (scheduler?: CrossFadeScheduler) {
        super();
        this._scheduler = scheduler ?? legacyCC.director.getAnimationManager() as AnimationManager;
    }

    public update (deltaTime: number) {
        if (this.isMotionless) {
            return;
        }

        const managedStates = this._managedStates;
        const fadings = this._fadings;

        if (managedStates.length === 1 && fadings.length === 1) {
            const state = managedStates[0].state;
            if (state) {
                state.weight = 1.0;
            }
        } else {
            this._calculateWeights(deltaTime);
        }

        if (managedStates.length === 1 && fadings.length === 1) { // Definitely not code repetition
            this._unscheduleThis();
        }
    }

    /**
     * 在指定时间内将从当前动画状态切换到指定的动画状态。
     * @param state 指定的动画状态。
     * @param duration 切换时间。
     */
    public crossFade (state: AnimationState | null, duration: number) {
        if (this._managedStates.length === 0) {
            // If we are cross fade from a "initial" pose,
            // we do not use the duration.
            // It's meaning-less and may get a bad visual effect.
            duration = 0;
        }

        if (duration === 0) {
            this.clear();
        }

        let target = this._managedStates.find((weightedState) => weightedState.state === state);
        if (!target) {
            target = { state, reference: 0 };
            if (state) {
                state.play();
            }
            this._managedStates.push(target);
        } else if (target.state?.isMotionless) {
            target.state.play();
        }
        ++target.reference;
        this._fadings.unshift({
            easeDuration: duration,
            easeTime: 0,
            target,
        });

        if (!this.isMotionless) {
            this._scheduleThis();
        }
    }

    public clear () {
        for (let iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
            const state = this._managedStates[iManagedState].state;
            if (state) {
                state.stop();
            }
        }
        this._managedStates.length = 0;
        this._fadings.length = 0;
    }

    protected onPlay () {
        super.onPlay();
        this._scheduleThis();
    }

    /**
     * 停止我们淡入淡出的所有动画状态并停止淡入淡出。
     */
    protected onPause () {
        super.onPause();
        for (let iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
            const state = this._managedStates[iManagedState].state;
            if (state) {
                state.pause();
            }
        }
        this._unscheduleThis();
    }

    /**
     * 恢复我们淡入淡出的所有动画状态并继续淡入淡出。
     */
    protected onResume () {
        super.onResume();
        for (let iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
            const state = this._managedStates[iManagedState].state;
            if (state) {
                state.resume();
            }
        }
        this._scheduleThis();
    }

    /**
     * 停止所有淡入淡出的动画状态。
     */
    protected onStop () {
        super.onStop();
        this.clear();
    }

    private _calculateWeights (deltaTime: number) {
        const managedStates = this._managedStates;
        const fadings = this._fadings;

        // Set all state's weight to 0.
        for (let iManagedState = 0; iManagedState < managedStates.length; ++iManagedState) {
            const state = managedStates[iManagedState].state;
            if (state) {
                state.weight = 0;
            }
        }

        // Allocate weights.
        let absoluteWeight = 1.0;
        let deadFadingBegin = fadings.length;
        for (let iFading = 0; iFading < fadings.length; ++iFading) {
            const fading = fadings[iFading];
            fading.easeTime += deltaTime;
            // We should properly handle the case of
            // `fading.easeTime === 0 && fading.easeDuration === 0`, which yields `NaN`.
            const relativeWeight = fading.easeDuration === 0 ? 1 : clamp01(fading.easeTime / fading.easeDuration);
            const weight = relativeWeight * absoluteWeight;
            absoluteWeight *= (1.0 - relativeWeight);
            if (fading.target.state) {
                fading.target.state.weight += weight;
            }
            if (fading.easeTime >= fading.easeDuration) {
                deadFadingBegin = iFading + 1;
                fading.easeTime = fading.easeDuration;
                break;
            }
        }

        // Kill fadings having no lifetime.
        if (deadFadingBegin !== fadings.length) {
            for (let iDeadFading = deadFadingBegin; iDeadFading < fadings.length; ++iDeadFading) {
                const deadFading = fadings[iDeadFading];
                --deadFading.target.reference;
                if (deadFading.target.reference <= 0) {
                    if (deadFading.target.state) {
                        deadFading.target.state.stop();
                    }
                    remove(this._managedStates, deadFading.target);
                }
            }
            fadings.splice(deadFadingBegin);
        }
    }

    private _scheduleThis () {
        if (!this._scheduled) {
            this._scheduler.addCrossFade(this);
            this._scheduled = true;
        }
    }

    private _unscheduleThis () {
        if (this._scheduled) {
            this._scheduler.removeCrossFade(this);
            this._scheduled = false;
        }
    }
}
