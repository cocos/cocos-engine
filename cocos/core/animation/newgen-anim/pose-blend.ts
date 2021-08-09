import { ccclass } from '../../data/class-decorator';
import { PoseEvalContext, Pose, PoseEval } from './pose';
import { Value } from './variable';
import { createEval } from './create-eval';
import { VariableTypeMismatchedError } from './errors';
import { serializable } from '../../data/decorators';

export interface PoseBlend extends Pose {
    [createEval] (_context: PoseEvalContext): PoseEval | null;
}

export class PoseBlendEval implements PoseEval {
    private declare _poseEvaluators: (PoseEval | null)[];
    private declare _weights: number[];
    private declare _inputs: number[];
    private _baseWeight = 1.0;

    public declare readonly duration: number;

    constructor (
        context: PoseEvalContext,
        poses: (Pose | null)[],
        inputs: number[],
    ) {
        this._poseEvaluators = poses.map((pose) => pose?.[createEval](context) ?? null);
        // this.duration = this._poseEvaluators.reduce(() => {}, 0.0);
        this._weights = new Array(this._poseEvaluators.length).fill(0);
        this._inputs = [...inputs];
    }

    get progress () {
        return -1.0;
    }

    public active () {
        for (let iPose = 0; iPose < this._poseEvaluators.length; ++iPose) {
            this._poseEvaluators[iPose]?.active();
        }
        this._flushPoseBaseWeights();
    }

    public inactive () {
        for (let iPose = 0; iPose < this._poseEvaluators.length; ++iPose) {
            this._poseEvaluators[iPose]?.inactive();
        }
    }

    public update (deltaTime: number) {
        for (let iPose = 0; iPose < this._poseEvaluators.length; ++iPose) {
            this._poseEvaluators[iPose]?.update(deltaTime);
        }
    }

    public sample () {
        for (let iPose = 0; iPose < this._poseEvaluators.length; ++iPose) {
            this._poseEvaluators[iPose]?.sample();
        }
    }

    public setInput (value: number, index: number) {
        this._inputs[index] = value;
        this.doEval();
    }

    public setBaseWeight (weight: number) {
        this._baseWeight = weight;
        this._flushPoseBaseWeights();
    }

    protected doEval () {
        this.eval(this._weights, this._inputs);
        this._flushPoseBaseWeights();
    }

    protected eval (_weights: number[], _inputs: readonly number[]) {

    }

    private _flushPoseBaseWeights () {
        for (let iPose = 0; iPose < this._poseEvaluators.length; ++iPose) {
            this._poseEvaluators[iPose]?.setBaseWeight(this._baseWeight * this._weights[iPose]);
        }
    }
}

export function validateBlendParam (val: unknown, name: string): asserts val is number {
    if (typeof val !== 'number') {
        // TODO var name?
        throw new VariableTypeMismatchedError(name, 'number');
    }
}
