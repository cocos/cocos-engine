import { Condition, ConditionEval, ConditionBindingContext, ConditionEvaluationContext } from './condition-base';
import { _decorator } from '../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { createEval } from '../../create-eval';
import { instantiate } from '../../../../serialization';
import type { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding/binding';
import { TCVariableBinding } from './binding/variable-binding';

import './binding/runtime';

const { ccclass, serializable } = _decorator;

/**
 * @zh 二元条件操作符。
 * @en Operator used in binary condition.
 */
enum BinaryOperator {
    EQUAL_TO,
    NOT_EQUAL_TO,
    LESS_THAN,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN,
    GREATER_THAN_OR_EQUAL_TO,
}

type LhsBinding = TCBinding<TCBindingValueType.FLOAT | TCBindingValueType.INTEGER>;

type lhsBindingEvaluation = TCBindingEvaluation<TCBindingValueType.FLOAT | TCBindingValueType.INTEGER>;

/**
 * @zh 描述一个二元条件，它有两个数值类型的操作数。
 * @en Describes a binary condition, there are two operands with numeric type.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}BinaryCondition`)
export class BinaryCondition implements Condition {
    public static readonly Operator = BinaryOperator;

    /**
     * @zh
     * 运算符。
     * @en
     * Operator.
     */
    @serializable
    public operator: BinaryOperator = BinaryOperator.EQUAL_TO;

    /**
     * @zh
     * 左操作数的值。
     * @en
     * Left operand value.
     */
    @serializable
    public lhs = 0.0;

    /**
     * @zh
     * 左操作数上的绑定。
     * @en
     * Left operand binding.
     */
    @serializable
    public lhsBinding: LhsBinding = new TCVariableBinding<TCBindingValueType.FLOAT | TCBindingValueType.INTEGER>();

    /**
     * @zh
     * 右操作数的值。
     * @en
     * Right operand value.
     */
    @serializable
    public rhs = 0.0;

    public clone (): BinaryCondition {
        const that = new BinaryCondition();
        that.operator = this.operator;
        that.lhs = this.lhs;
        that.lhsBinding = instantiate(this.lhsBinding);
        that.rhs = this.rhs;
        return that;
    }

    public [createEval] (context: ConditionBindingContext): BinaryConditionEval {
        const lhsBindingEvaluation = this.lhsBinding?.bind(context);

        const binaryConditionEval = new BinaryConditionEval(
            this.operator,
            this.lhs,
            this.rhs,
            lhsBindingEvaluation,
        );

        return binaryConditionEval;
    }
}

export declare namespace BinaryCondition {
    export type Operator = BinaryOperator;
}

class BinaryConditionEval implements ConditionEval {
    constructor (
        private _operator: BinaryOperator,
        lhsValue: number,
        rhsValue: number,
        private _lhsBindingEvaluation: lhsBindingEvaluation | undefined,
    ) {
        this._lhsValue = lhsValue;
        this._rhsValue = rhsValue;
    }

    /**
     * Evaluates this condition.
     */
    public eval (context: ConditionEvaluationContext): boolean {
        const lhsValue = this._lhsBindingEvaluation?.evaluate(context) ?? this._lhsValue;
        const rhsValue = this._rhsValue;

        switch (this._operator) {
        default:
        case BinaryOperator.EQUAL_TO:
            return lhsValue === rhsValue;
        case BinaryOperator.NOT_EQUAL_TO:
            return lhsValue !== rhsValue;
        case BinaryOperator.LESS_THAN:
            return lhsValue < rhsValue;
        case BinaryOperator.LESS_THAN_OR_EQUAL_TO:
            return lhsValue <= rhsValue;
        case BinaryOperator.GREATER_THAN:
            return lhsValue > rhsValue;
        case BinaryOperator.GREATER_THAN_OR_EQUAL_TO:
            return lhsValue >= rhsValue;
        }
    }

    private declare _lhsValue: number;
    private declare _rhsValue: number;
}
