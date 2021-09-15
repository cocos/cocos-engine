import { ccclass } from '../../data/class-decorator';
import { PoseEvalContext, Pose, PoseEval } from './pose';
import { Value } from './variable';
import { createEval } from './create-eval';
import { VariableTypeMismatchedError } from './errors';
import { serializable } from '../../data/decorators';
import { PoseStatus } from './graph-eval';

export interface PoseBlend extends Pose {
    [createEval] (_context: PoseEvalContext): PoseEval | null;
}

export class PoseBlendEval implements PoseEval {
    private declare _poseEvaluators: (PoseEval | null)[];
    private declare _weights: number[];
    private declare _inputs: number[];

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

    public poses (baseWeight: number): Iterator<PoseStatus, any, undefined> {
        const { _poseEvaluators: children, _weights: weights } = this;
        const nChildren = children.length;
        let iChild = 0;
        let currentChildIterator: Iterator<PoseStatus> | undefined;
        return {
            next () {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    if (currentChildIterator) {
                        const result = currentChildIterator.next();
                        if (!result.done) {
                            return result;
                        }
                    }
                    if (iChild >= nChildren) {
                        return { done: true, value: undefined };
                    } else {
                        const child = children[iChild];
                        currentChildIterator = child?.poses(baseWeight * weights[iChild]);
                        ++iChild;
                    }
                }
            },
        };
    }

    public sample (time: number, weight: number) {
        for (let iPose = 0; iPose < this._poseEvaluators.length; ++iPose) {
            this._poseEvaluators[iPose]?.sample(time, weight * this._weights[iPose]);
        }
    }

    public setInput (value: number, index: number) {
        this._inputs[index] = value;
        this.doEval();
    }

    protected doEval () {
        this.eval(this._weights, this._inputs);
    }

    protected eval (_weights: number[], _inputs: readonly number[]) {

    }
}

export function validateBlendParam (val: unknown, name: string): asserts val is number {
    if (typeof val !== 'number') {
        // TODO var name?
        throw new VariableTypeMismatchedError(name, 'number');
    }
}
