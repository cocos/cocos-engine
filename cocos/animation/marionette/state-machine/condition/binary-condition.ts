
import { Condition, ConditionEval, ConditionEvalContext } from './condition-base';
import { VariableType, BindableNumber, bindNumericOr } from '../../parametric';
import { _decorator } from '../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { createEval } from '../../create-eval';

const { ccclass, serializable } = _decorator;

enum BinaryOperator {
    EQUAL_TO,
    NOT_EQUAL_TO,
    LESS_THAN,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN,
    GREATER_THAN_OR_EQUAL_TO,
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}BinaryCondition`)
export class BinaryCondition implements Condition {
    public static readonly Operator = BinaryOperator;

    @serializable
    public operator: BinaryOperator = BinaryOperator.EQUAL_TO;

    @serializable
    public lhs: BindableNumber = new BindableNumber();

    @serializable
    public rhs: BindableNumber = new BindableNumber();

    public clone () {
        const that = new BinaryCondition();
        that.operator = this.operator;
        that.lhs = this.lhs.clone();
        that.rhs = this.rhs.clone();
        return that;
    }

    public [createEval] (context: ConditionEvalContext) {
        const { operator, lhs, rhs } = this;
        const evaluation = new BinaryConditionEval(operator, 0.0, 0.0);
        const lhsValue = bindNumericOr(
            context,
            lhs,
            VariableType.FLOAT,
            evaluation.setLhs,
            evaluation,
        );
        const rhsValue = bindNumericOr(
            context,
            rhs,
            VariableType.FLOAT,
            evaluation.setRhs,
            evaluation,
        );
        evaluation.reset(lhsValue, rhsValue);
        return evaluation;
    }
}

export declare namespace BinaryCondition {
    export type Operator = BinaryOperator;
}

class BinaryConditionEval implements ConditionEval {
    private declare _operator: BinaryOperator;
    private declare _lhs: number;
    private declare _rhs: number;
    private declare _result: boolean;

    constructor (operator: BinaryOperator, lhs: number, rhs: number) {
        this._operator = operator;
        this._lhs = lhs;
        this._rhs = rhs;
        this._eval();
    }

    public reset (lhs: number, rhs: number) {
        this._lhs = lhs;
        this._rhs = rhs;
        this._eval();
    }

    public setLhs (value: number) {
        this._lhs = value;
        this._eval();
    }

    public setRhs (value: number) {
        this._rhs = value;
        this._eval();
    }

    /**
     * Evaluates this condition.
     */
    public eval () {
        return this._result;
    }

    private _eval () {
        const {
            _lhs: lhs,
            _rhs: rhs,
        } = this;
        switch (this._operator) {
        default:
        case BinaryOperator.EQUAL_TO:
            this._result = lhs === rhs;
            break;
        case BinaryOperator.NOT_EQUAL_TO:
            this._result = lhs !== rhs;
            break;
        case BinaryOperator.LESS_THAN:
            this._result = lhs < rhs;
            break;
        case BinaryOperator.LESS_THAN_OR_EQUAL_TO:
            this._result = lhs <= rhs;
            break;
        case BinaryOperator.GREATER_THAN:
            this._result = lhs > rhs;
            break;
        case BinaryOperator.GREATER_THAN_OR_EQUAL_TO:
            this._result = lhs >= rhs;
            break;
        }
    }
}
