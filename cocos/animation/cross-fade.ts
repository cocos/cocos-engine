import { removeIf } from '../core/utils/array';
import { clamp01 } from '../core/vmath';
import { Node } from '../scene-graph';
import { AnimationState } from './animation-state';
import { Playable } from './playable';

interface IFadeState {
    state: AnimationState | null;
    easeTime: number;
    easeDuration: number;
}

export class CrossFade extends Playable {
    private _fadings: IFadeState[] = [];

    constructor (public target: Node) {
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
                    const fading = this._fadings[j];
                    if (fading.state) {
                        this._directStopState(fading.state);
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

    public sample () {
        const currentFading = this._fadings[0];
        if (currentFading.state) {
            currentFading.state.sample();
        }
    }

    public onPause () {
        super.onPause();
        for (const fading of this._fadings) {
            if (fading.state) {
                fading.state.pause();
            }
        }
    }

    public onResume () {
        super.onResume();
        for (const fading of this._fadings) {
            if (fading.state) {
                fading.state.resume();
            }
        }
    }

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
        if (!state.clip) {
            return;
        }

        if (!state.curveLoaded) {
            state.initialize(this.target);
        }

        state.play();
        state.weight = 1;
    }
}
