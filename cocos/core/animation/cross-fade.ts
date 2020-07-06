/**
 * @category animation
 */

import { clamp01 } from '../math/utils';
import { remove } from '../utils/array';
import { AnimationState } from './animation-state';
import { Playable } from './playable';
import { legacyCC } from '../global-exports';

interface IManagedState {
    state: AnimationState | null;
    reference: number;
}

interface IFading {
    target: IManagedState;
    easeTime: number;
    easeDuration: number;
}

export class CrossFade extends Playable {
    private readonly _managedStates: IManagedState[] = [];
    private readonly _fadings: IFading[] = [];

    constructor () {
        super();
    }

    public update (deltaTime: number) {
        if (this.isMotionless) {
            return;
        }

        // Set all state's weight to 0.
        for (let iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
            const state = this._managedStates[iManagedState].state;
            if (state) {
                state.weight = 0;
            }
        }

        // Allocate weights.
        let absoluteWeight = 1.0;
        let deadFadingBegin = this._fadings.length;
        for (let iFading = 0; iFading < this._fadings.length; ++iFading) {
            const fading = this._fadings[iFading];
            fading.easeTime += deltaTime;
            // We should properly handle the case of
            // `fading.easeTime === 0 && fading.easeDuration === 0`, which yields `NaN`.
            const relativeWeight = fading.easeDuration === 0 ? 1 : clamp01(fading.easeTime / fading.easeDuration);
            const weight = relativeWeight * absoluteWeight;
            absoluteWeight = absoluteWeight * (1.0 - relativeWeight);
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
        if (deadFadingBegin !== this._fadings.length) {
            for (let iDeadFading = deadFadingBegin; iDeadFading < this._fadings.length; ++iDeadFading) {
                const deadFading = this._fadings[iDeadFading];
                --deadFading.target.reference;
                if (deadFading.target.reference <= 0) {
                    if (deadFading.target.state) {
                        deadFading.target.state.stop();
                    }
                    remove(this._managedStates, deadFading.target);
                }
            }
            this._fadings.splice(deadFadingBegin);
        }

        for (let iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
            const state = this._managedStates[iManagedState].state;
            if (state && state.isMotionless) {
                state.sample();
            }
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
        legacyCC.director.getAnimationManager().addCrossFade(this);
    }

    /**
     * 停止我们淡入淡出的所有动画状态并停止淡入淡出。
     */
    protected onPause () {
        super.onPause();
        legacyCC.director.getAnimationManager().removeCrossFade(this);
        for (let iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
            const state = this._managedStates[iManagedState].state;
            if (state) {
                state.pause();
            }
        }
    }

    /**
     * 恢复我们淡入淡出的所有动画状态并继续淡入淡出。
     */
    protected onResume () {
        super.onResume();
        legacyCC.director.getAnimationManager().addCrossFade(this);
        for (let iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
            const state = this._managedStates[iManagedState].state;
            if (state) {
                state.resume();
            }
        }
    }

    /**
     * 停止所有淡入淡出的动画状态。
     */
    protected onStop () {
        super.onStop();
        legacyCC.director.getAnimationManager().removeCrossFade(this);
        this.clear();
    }
}
