import { IMotion, IMotionTemplate } from './animation-graph';
import { property, ccclass, type } from '../../data/class-decorator';
import { AnimationClip } from '../animation-clip';
import { AnimationState } from '../animation-state';
import { instantiateSymbol } from './instantiate-symbol';

@ccclass
export class StateMotionTemplate implements IMotionTemplate {
    @type(AnimationClip)
    public clip: AnimationClip | null = null;

    public [instantiateSymbol] () {
        return new StateMotion(this);
    }
}

export class StateMotion implements IMotion {
    private _template: StateMotionTemplate;
    private _state: AnimationState | null = null;
    private _weight = 1.0;

    constructor (template: StateMotionTemplate) {
        this._template = template;
        const { clip } = this._template;
        if (clip) {
            this._state = new AnimationState(clip);
        }
    }

    public active () {

    }

    public inactive () {
        
    }

    public setBaseWeight (weight: number) {
        this._weight = weight;
        this._updateStateWeight();
    }

    private _updateStateWeight () {
        if (this._state) {
            this._state.weight = this._weight;
        }
    }
}