import { IMotion, IMotionTemplate } from './animation-graph';
import { Asset } from '../../assets';
import { ccclass, property } from '../../data/class-decorator';
import { IBlender, IBlenderTemplate } from './blender-base';
import { instantiateSymbol } from './instantiate-symbol';

@ccclass
export class BlendTreeTemplate extends Asset implements IMotionTemplate {
    @property
    public motions: Array<IMotionTemplate | null> = [];

    @property
    public blender: IBlenderTemplate | null = null;

    public [instantiateSymbol] () {
        return new BlendTree(this);
    }
}

export class BlendTree implements IMotion {
    private declare _template: BlendTreeTemplate;
    private declare _motions: Array<IMotion | null>;
    private declare _blender: IBlender | null;
    private _baseWeight = 1.0;

    constructor (template: BlendTreeTemplate) {
        this._template = template;
        this._blender = this._template.blender?.[instantiateSymbol]();
        this._motions = this._template.motions.map((motionTemplate) => motionTemplate?.[instantiateSymbol]() ?? null);
    }

    public active () {
        this._baseWeight = 1;
        for (let iMotion = 0; iMotion < this._motions.length; ++iMotion) {
            this._motions[iMotion]?.active();
        }
        this.flush();
    }

    public inactive () {
        for (let iMotion = 0; iMotion < this._motions.length; ++iMotion) {
            this._motions[iMotion]?.inactive();
        }
    }

    public flush () {
        this._flushMotionsBaseWeight();
    }

    public setBaseWeight (weight: number) {
        this._baseWeight = weight;
        this._flushMotionsBaseWeight();
    }

    private _flushMotionsBaseWeight () {
        if (this._blender) {
            for (let iMotion = 0; iMotion < this._motions.length; ++iMotion) {
                this._motions[iMotion]?.setBaseWeight(this._baseWeight * this._blender.weights[iMotion]);
            }
        }
    }
}
