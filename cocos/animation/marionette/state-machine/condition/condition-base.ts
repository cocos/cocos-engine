import { BindContext } from '../../parametric';
import { _decorator } from '../../../../core';
import { createEval } from '../../create-eval';
import { VariableTypeMismatchedError } from '../../errors';
import { AnimationGraphBindingContext } from '../../animation-graph-context';

export type ConditionEvalContext = AnimationGraphBindingContext;

export interface Condition {
    clone (): Condition;
    [createEval] (context: AnimationGraphBindingContext): ConditionEval;
}

export interface ConditionEval {
    /**
     * Evaluates this condition.
     */
    eval(): boolean;
}
