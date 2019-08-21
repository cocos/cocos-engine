/**
 * @category animation
 */
import { clamp01 } from '../core/math/utils';
import { AnimationState } from './animation-state';
import { Playable } from './playable';
import { remove } from '../core/utils/array';

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
        if (!this.isPlaying || this.isPaused) {
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
            if (absoluteWeight === 0) {
                deadFadingBegin = iFading;
                break;
            }
            const fading = this._fadings[iFading];
            fading.easeTime += deltaTime;
            const relativeWeight = clamp01(fading.easeTime / fading.easeDuration);
            const weight = relativeWeight * absoluteWeight;
            absoluteWeight = absoluteWeight * (1.0 - relativeWeight);
            if (fading.target.state) {
                fading.target.state.weight += weight;
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
    }

    /**
     * 在指定时间内将从当前动画状态切换到指定的动画状态。
     * @param state 指定的动画状态。
     * @param duration 切换时间。
     */
    public crossFade (state: AnimationState | null, duration: number) {
        if (duration === 0) {
            this.clear();
        }
        let target = this._managedStates.find((weightedState) => weightedState.state === state);
        if (!target) {
            target = { state, reference: 0, };
            if (state) {
                state.play();
            }
            this._managedStates.push(target);
        }
        ++target.reference;
        this._fadings.unshift({
            easeDuration: duration,
            easeTime: 0,
            target,
        });
    }

    /**
     * 停止我们淡入淡出的所有动画状态并停止淡入淡出。
     */
    public onPause () {
        super.onPause();
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
    public onResume () {
        super.onResume();
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
    public onStop () {
        super.onStop();
        this.clear();
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
}
