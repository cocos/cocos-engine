import { _decorator, EditorExtendable, editorExtrasTag } from '../../core';
import { MotionEvalContext, Motion, MotionEval, MotionPort } from './motion';
import { createEval } from './create-eval';
import { VariableTypeMismatchedError } from './errors';
import { ReadonlyClipOverrideMap, ClipStatus } from './graph-eval';

import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { getMotionRuntimeID, RUNTIME_ID_ENABLED } from './graph-debug';
import { cloneAnimationGraphEditorExtrasFrom } from './animation-graph-editor-extras-clone-helper';
import { AnimationGraphEvaluationContext, AnimationGraphLayerWideBindingContext } from './animation-graph-context';
import { blendPoseInto, Pose } from '../core/pose';

const { ccclass, serializable } = _decorator;

export interface AnimationBlend extends Motion, EditorExtendable {
    [createEval] (_context: AnimationGraphLayerWideBindingContext, overrides: ReadonlyClipOverrideMap | null): MotionEval | null;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlendItem`)
export class AnimationBlendItem {
    @serializable
    public motion: Motion | null = null;

    public clone () {
        const that = new AnimationBlendItem();
        this._copyTo(that);
        return that;
    }

    protected _copyTo (that: AnimationBlendItem) {
        that.motion = this.motion?.clone() ?? null;
        return that;
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlend`)
export class AnimationBlend extends EditorExtendable implements Motion {
    @serializable
    name = '';

    public copyTo (that: AnimationBlend) {
        that.name = this.name;
        that[editorExtrasTag] = cloneAnimationGraphEditorExtrasFrom(this);
    }
}

export class AnimationBlendEval implements MotionEval {
    public declare runtimeId?: number;

    private declare _childEvaluators: (MotionEval | null)[];
    private declare _weights: number[];
    private declare _inputs: number[];

    constructor (
        context: AnimationGraphLayerWideBindingContext,
        overrides: ReadonlyClipOverrideMap | null,
        base: AnimationBlend,
        children: AnimationBlendItem[],
        inputs: number[],
    ) {
        this._childEvaluators = children.map((child) => child.motion?.[createEval](context, overrides) ?? null);
        this._weights = new Array(this._childEvaluators.length).fill(0);
        this._inputs = [...inputs];
        if (RUNTIME_ID_ENABLED) {
            this.runtimeId = getMotionRuntimeID(base);
        }
    }

    public createPort (): MotionPort {
        return new AnimationBlendPort(
            this,
            this._childEvaluators.map((childEval) => childEval?.createPort() ?? null),
        );
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

    public __evaluatePort (port: AnimationBlendPort, progress: number, context: AnimationGraphEvaluationContext): Pose {
        const nChild = this._childEvaluators.length;
        let sumWeight = 0.0;
        let finalPose: Pose | null = null;
        for (let iChild = 0; iChild < nChild; ++iChild) {
            const childWeight = this._weights[iChild];
            if (!childWeight) {
                continue;
            }
            const childOutput = port.childPorts[iChild]?.evaluate(progress, context);
            if (!childOutput) {
                continue;
            }
            sumWeight += childWeight;
            if (!finalPose) {
                finalPose = childOutput;
            } else {
                if (sumWeight) {
                    const t = childWeight / sumWeight;
                    blendPoseInto(finalPose, childOutput, t);
                }
                context.popPose();
            }
        }
        if (finalPose) {
            return finalPose;
        }
        return context.pushDefaultedPose();
    }

    public overrideClips (overrides: ReadonlyClipOverrideMap, context: AnimationGraphLayerWideBindingContext): void {
        for (let iChild = 0; iChild < this._childEvaluators.length; ++iChild) {
            this._childEvaluators[iChild]?.overrideClips(overrides, context);
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

class AnimationBlendPort implements MotionPort {
    constructor (host: AnimationBlendEval, childPorts: readonly (MotionPort | null)[]) {
        this._host = host;
        this.childPorts = childPorts;
    }

    public childPorts: readonly (MotionPort | null)[] = [];

    public evaluate (progress: number, context: AnimationGraphEvaluationContext): Pose {
        return this._host.__evaluatePort(this, progress, context);
    }

    private _host: AnimationBlendEval;
}

export function validateBlendParam (val: unknown, name: string): asserts val is number {
    if (typeof val !== 'number') {
        // TODO var name?
        throw new VariableTypeMismatchedError(name, 'number');
    }
}
