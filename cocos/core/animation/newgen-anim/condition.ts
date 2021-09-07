import { ccclass, serializable } from '../../data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { createEval } from './create-eval';
import { VariableTypeMismatchedError } from './errors';
import { BindingHost, parametric } from './parametric';
import type { Value } from './variable';

export interface Condition extends BindingHost {
    [createEval] (context: { getParam(host: BindingHost, name: string): unknown; }): ConditionEval;
}

export interface ConditionEval {
    /**
     * Evaluates this condition.
     */
    eval(): boolean;
}

enum BinaryOperator {
    EQUAL_TO,
    NOT_EQUAL_TO,
    LESS_THAN,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN,
    GREATER_THAN_OR_EQUAL_TO,
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}BinaryCondition`)
export class BinaryCondition extends BindingHost implements Condition {
    public static readonly Operator = BinaryOperator;

    @serializable
    public operator!: BinaryOperator;

    @serializable
    @parametric<Value, [BinaryConditionEval]>({
        notify: (value: Value, conditionEval: BinaryConditionEval) => conditionEval.setLhs(value),
    })
    public lhs!: Value;

    @serializable
    @parametric<Value, [BinaryConditionEval]>({
        notify: (value: Value, conditionEval: BinaryConditionEval) => conditionEval.setRhs(value),
    })
    public rhs: Value | undefined;

    public [createEval] (context: { getParam(host: BindingHost, name: string): unknown; }) {
        const { operator } = this;
        const lhs = context.getParam(this, 'lhs') ?? this.lhs;
        const rhs = context.getParam(this, 'rhs') ?? this.rhs;
        validateConditionParamNumber(lhs, 'lhs');
        validateConditionParamNumber(rhs, 'rhs');
        return new BinaryConditionEval(operator, lhs, rhs as Value | undefined);
    }
}

export declare namespace BinaryCondition {
    export type Operator = BinaryOperator;
}

class BinaryConditionEval implements ConditionEval {
    private declare _operator: BinaryOperator;
    private declare _operands: [Value, Value | undefined];
    private declare _result: boolean;

    constructor (operator: BinaryOperator, lhs: Value, rhs?: Value) {
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
        case BinaryOperator.EQUAL_TO:
            this._result = lhs === rhs;
            break;
        case BinaryOperator.NOT_EQUAL_TO:
            this._result = lhs !== rhs;
            break;
        case BinaryOperator.LESS_THAN:
            this._result = lhs < rhs!;
            break;
        case BinaryOperator.LESS_THAN_OR_EQUAL_TO:
            this._result = lhs <= rhs!;
            break;
        case BinaryOperator.GREATER_THAN:
            this._result = lhs > rhs!;
            break;
        case BinaryOperator.GREATER_THAN_OR_EQUAL_TO:
            this._result = lhs >= rhs!;
            break;
        }
    }
}

enum UnaryOperator {
    TRUTHY,
    FALSY,
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}UnaryCondition`)
export class UnaryCondition extends BindingHost implements Condition {
    public static readonly Operator = UnaryOperator;

    @serializable
    public operator!: UnaryOperator;

    @serializable
    @parametric<Value, [UnaryConditionEval]>({
        notify: (value: Value, conditionEval: UnaryConditionEval) => conditionEval.setOperand(value),
    })
    public operand!: Value;

    public [createEval] (context: { getParam(host: BindingHost, name: string): unknown; }) {
        const { operator } = this;
        const operand = context.getParam(this, 'operand') ?? this.operand;
        validateConditionParamBoolean(operand, 'operand');
        return new UnaryConditionEval(operator, operand);
    }
}

export declare namespace UnaryCondition {
    export type Operator = UnaryOperator;
}

class UnaryConditionEval implements ConditionEval {
    private declare _operator: UnaryOperator;
    private declare _operand: Value;
    private declare _result: boolean;

    constructor (operator: UnaryOperator, operand: Value) {
        this._operator = operator;
        this._operand = operand;
        this._eval();
    }

    public setOperand (value: Value) {
        this._operand = value;
        this._eval();
    }

    /**
     * Evaluates this condition.
     */
    public eval () {
        return this._result;
    }

    private _eval () {
        const { _operand: operand } = this;
        switch (this._operator) {
        default:
        case UnaryOperator.TRUTHY:
            this._result = !!operand;
            break;
        case UnaryOperator.FALSY:
            this._result = !operand;
            break;
        }
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}TriggerCondition`)
export class TriggerCondition extends BindingHost implements Condition {
    @parametric<Value, [TriggerConditionEval]>({
        notify: (value: Value, conditionEval: TriggerConditionEval) => {
            validateConditionParamBoolean(value, 'trigger');
            conditionEval.trigger = value;
        },
    })
    public trigger!: string;

    [createEval] (context: { getParam(host: BindingHost, name: string): unknown; }): ConditionEval {
        return new TriggerConditionEval();
    }
}

class TriggerConditionEval implements ConditionEval {
    get trigger () {
        return this._triggered;
    }

    set trigger (value) {
        this._triggered = value;
    }

    public eval (): boolean {
        return this._triggered;
    }

    private _triggered = false;
}

export function validateConditionParamNumber (val: unknown, name: string): asserts val is number {
    if (typeof val !== 'number') {
        throw new VariableTypeMismatchedError(name, 'number');
    }
}

export function validateConditionParamBoolean (val: unknown, name: string): asserts val is boolean {
    if (typeof val !== 'boolean') {
        throw new VariableTypeMismatchedError(name, 'boolean');
    }
}

export function validateConditionParamTrigger (val: unknown, name: string): asserts val is boolean {
    if (typeof val !== 'object') {
        throw new VariableTypeMismatchedError(name, 'trigger');
    }
}
