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
        this._fadings.push({
            state: null,
            easeDuration: Number.POSITIVE_INFINITY,
            easeTime: 0,
        });
    }

    public update (deltaTime: number) {
        let absoluteWeight = 1.0;
        for (let i = 0; i < this._fadings.length; ++i) {
            if (absoluteWeight === 0) {
                for (let j = i; j < this._fadings.length; ++j) {
                    const fading = this._fadings[j];
                    if (fading.state) {
                        fading.state.weight = 0;
                        fading.state.stop();
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
