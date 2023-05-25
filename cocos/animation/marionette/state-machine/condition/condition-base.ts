import { BindContext } from '../../parametric';
import { _decorator } from '../../../../core';
import { createEval } from '../../create-eval';
import { VariableTypeMismatchedError } from '../../errors';
import { AnimationGraphBindingContext } from '../../animation-graph-context';

export type ConditionBindingContext = AnimationGraphBindingContext;

export interface Condition {
    clone (): Condition;
    [createEval] (context: AnimationGraphBindingContext): ConditionEval;
}

export interface ConditionEval {
    /**
     * Evaluates this condition.
     */
    eval(context: ConditionEvaluationContext): boolean;
}

/**
 * Describes the context under which a transition condition evaluates.
 */
export interface ConditionEvaluationContext {
    /**
     * Weight of current transition's source state.
     */
    readonly sourceStateWeight: number;

    /**
     * The elapsed normalized time of motions in source state.
     */
    readonly sourceStateMotionTimeNormalized: number;
}
