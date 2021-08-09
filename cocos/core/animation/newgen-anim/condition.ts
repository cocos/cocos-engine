import { ccclass, serializable } from '../../data/decorators';
import { createEval } from './create-eval';
import { VariableTypeMismatchedError } from './errors';
import { BindingHost, parametric } from './parametric';
import type { Value } from './variable';

enum Operator {
    BE_TRUE,
    NOT,
    EQUAL_TO,
    NOT_EQUAL_TO,
    LESS_THAN,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN,
    GREATER_THAN_OR_EQUAL_TO,
}

@ccclass('cc.animation.Condition')
export class Condition extends BindingHost {
    public static Operator = Operator;

    @serializable
    public operator!: Operator;

    @serializable
    @parametric<Value, [ConditionEval]>({
        notify: (value: Value, conditionEval: ConditionEval) => conditionEval.setLhs(value),
    })
    public lhs!: Value;

    @serializable
    @parametric<Value, [ConditionEval]>({
        notify: (value: Value, conditionEval: ConditionEval) => conditionEval.setRhs(value),
    })
    public rhs: Value | undefined;

    public [createEval] (context: { getParam(host: BindingHost, name: string): unknown; }) {
        const { operator } = this;
        const lhs = context.getParam(this, 'lhs') ?? this.lhs;
        const rhs = context.getParam(this, 'rhs') ?? this.rhs;
        if (operator === Operator.BE_TRUE || operator === Operator.NOT) {
            validateConditionParamBoolean(lhs, 'lhs');
        } else {
            validateConditionParamNumber(lhs, 'lhs');
            validateConditionParamNumber(rhs, 'rhs');
        }
        return new ConditionEval(operator, lhs, rhs as Value | undefined);
    }
}

export declare namespace Condition {
    export type Operator = typeof Operator;
}

export class ConditionEval {
    private declare _operator: Operator;
    private declare _operands: [Value, Value | undefined];
    private declare _result: Value;

    constructor (operator: Operator, lhs: Value, rhs?: Value) {
        this._operator = operator;
        this._operands = [lhs, rhs];
        this._eval();
    }

    public setLhs (value: Value) {
        this._operands[0] = value;
        this._eval();
    }

    public setRhs (value: Value) {
        this._operands[1] = value;
        this._eval();
    }

    /**
     * Evaluates this condition.
     */
    public eval () {
        return this._result;
    }

    private _eval () {
        // TODO: rhs assertion?
        const [lhs, rhs] = this._operands;
        switch (this._operator) {
        default:
        case Operator.BE_TRUE:
            this._result = !!lhs;
            break;
        case Operator.NOT:
            this._result = !lhs;
            break;
        case Operator.EQUAL_TO:
            this._result = lhs === rhs;
            break;
        case Operator.NOT_EQUAL_TO:
            this._result = lhs !== rhs;
            break;
        case Operator.LESS_THAN:
            this._result = lhs < rhs!;
            break;
        case Operator.LESS_THAN_OR_EQUAL_TO:
            this._result = lhs <= rhs!;
            break;
        case Operator.GREATER_THAN:
            this._result = lhs > rhs!;
            break;
        case Operator.GREATER_THAN_OR_EQUAL_TO:
            this._result = lhs >= rhs!;
            break;
        }
    }
}

export function validateConditionParamNumber (val: unknown, name: string): asserts val is number {
    if (typeof val !== 'number') {
        // TODO var name?
        throw new VariableTypeMismatchedError(name, 'number');
    }
}

export function validateConditionParamBoolean (val: unknown, name: string): asserts val is boolean {
    if (typeof val !== 'boolean') {
        // TODO var name?
        throw new VariableTypeMismatchedError(name, 'boolean');
    }
}
