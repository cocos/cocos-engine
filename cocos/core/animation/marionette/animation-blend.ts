import { ccclass } from '../../data/class-decorator';
import { MotionEvalContext, Motion, MotionEval } from './motion';
import { Value } from './variable';
import { createEval } from './create-eval';
import { VariableTypeMismatchedError } from './errors';
import { serializable } from '../../data/decorators';
import { ClipStatus } from './graph-eval';
import { EditorExtendable } from '../../data/editor-extendable';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { getMotionRuntimeID, RUNTIME_ID_ENABLED } from './graph-debug';

export interface AnimationBlend extends Motion, EditorExtendable {
    [createEval] (_context: MotionEvalContext): MotionEval | null;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlendItem`)
export class AnimationBlendItem {
    @serializable
    public motion: Motion | null = null;

    public clone () {
        const that = new AnimationBlendItem();
        this._assign(that);
        return that;
    }

    protected _assign (that: AnimationBlendItem) {
        that.motion = this.motion?.clone() ?? null;
        return that;
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlend`)
export class AnimationBlend extends EditorExtendable implements Motion {
    @serializable
    name = '';
}

export class AnimationBlendEval implements MotionEval {
    public declare runtimeId?: number;

    private declare _childEvaluators: (MotionEval | null)[];
    private declare _weights: number[];
    private declare _inputs: number[];

    constructor (
        context: MotionEvalContext,
        base: AnimationBlend,
        children: AnimationBlendItem[],
        inputs: number[],
    ) {
        this._childEvaluators = children.map((child) => child.motion?.[createEval](context) ?? null);
        this._weights = new Array(this._childEvaluators.length).fill(0);
        this._inputs = [...inputs];
        if (RUNTIME_ID_ENABLED) {
            this.runtimeId = getMotionRuntimeID(base);
        }
    }

    get childCount () {
        return this._weights.length;
    }

    public getChildWeight (childIndex: number): number {
        return this._weights[childIndex];
    }

    public getChildMotionEval (childIndex: number) {
        return this._childEvaluators[childIndex];
    }

    get duration () {
        let uniformDuration = 0.0;
        for (let iChild = 0; iChild < this._childEvaluators.length; ++iChild) {
            uniformDuration += (this._childEvaluators[iChild]?.duration ?? 0.0) * this._weights[iChild];
        }
        return uniformDuration;
    }

    public getClipStatuses (baseWeight: number): Iterator<ClipStatus, any, undefined> {
        const { _childEvaluators: children, _weights: weights } = this;
        const nChildren = children.length;
        let iChild = 0;
        let currentChildIterator: Iterator<ClipStatus> | undefined;
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
                        currentChildIterator = child?.getClipStatuses(baseWeight * weights[iChild]);
                        ++iChild;
                    }
                }
            },
        };
    }

    public sample (progress: number, weight: number) {
        for (let iChild = 0; iChild < this._childEvaluators.length; ++iChild) {
            this._childEvaluators[iChild]?.sample(progress, weight * this._weights[iChild]);
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
