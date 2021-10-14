import {
    VariableType,
    BindableBoolean, BindableNumber, BindContext, bindOr, validateVariableExistence, validateVariableType,
    bindNumericOr,
} from './parametric';
import { ccclass, serializable } from '../../data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { createEval } from './create-eval';
import { VariableTypeMismatchedError } from './errors';
import type { Value } from './variable';

export type ConditionEvalContext = BindContext;

export interface Condition {
    clone (): Condition;
    [createEval] (context: BindContext): ConditionEval;
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

    public [createEval] (context: BindContext) {
        const { operator, lhs, rhs } = this;
        const evaluation = new BinaryConditionEval(operator, 0.0, 0.0);
        const lhsValue = bindNumericOr(
            context,
            lhs,
            VariableType.NUMBER,
            evaluation.setLhs,
            evaluation,
        );
        const rhsValue = bindNumericOr(
            context,
            rhs,
            VariableType.NUMBER,
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

enum UnaryOperator {
    TRUTHY,
    FALSY,
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}UnaryCondition`)
export class UnaryCondition implements Condition {
    public static readonly Operator = UnaryOperator;

    @serializable
    public operator: UnaryOperator = UnaryOperator.TRUTHY;

    @serializable
    public operand = new BindableBoolean();

    public clone () {
        const that = new UnaryCondition();
        that.operator = this.operator;
        that.operand = this.operand.clone();
        return that;
    }

    public [createEval] (context: ConditionEvalContext) {
        const { operator, operand } = this;
        const evaluation = new UnaryConditionEval(operator, false);
        const value = bindOr(
            context,
            operand,
            VariableType.BOOLEAN,
            evaluation.setOperand,
            evaluation,
        );
        evaluation.reset(value);
        return evaluation;
    }
}

export declare namespace UnaryCondition {
    export type Operator = UnaryOperator;
}

class UnaryConditionEval implements ConditionEval {
    private declare _operator: UnaryOperator;
    private declare _operand: boolean;
    private declare _result: boolean;

    constructor (operator: UnaryOperator, operand: boolean) {
        this._operator = operator;
        this._operand = operand;
        this._eval();
    }

    public reset (value: boolean) {
        this.setOperand(value);
    }

    public setOperand (value: boolean) {
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
export class TriggerCondition implements Condition {
    @serializable
    public trigger = '';

    public clone () {
        const that = new TriggerCondition();
        that.trigger = this.trigger;
        return that;
    }

    [createEval] (context: BindContext): ConditionEval {
        const evaluation = new TriggerConditionEval(false);
        const triggerInstance = context.getVar(this.trigger);
        if (validateVariableExistence(triggerInstance, this.trigger)) {
            validateVariableType(triggerInstance.type, VariableType.TRIGGER, this.trigger);
            evaluation.setTrigger(triggerInstance.bind(
                evaluation.setTrigger,
                evaluation,
            ) as boolean);
        }
        return evaluation;
    }
}

class TriggerConditionEval implements ConditionEval {
    constructor (triggered: boolean) {
        this._triggered = triggered;
    }

    public setTrigger (trigger: boolean) {
        this._triggered = trigger;
    }

    public eval (): boolean {
        return this._triggered;
    }

    private _triggered = false;
}

export function validateConditionParamNumber (val: unknown, name: string): asserts val is number {
    if (typeof val !== 'number') {
        throw new VariableTypeMismatchedError(name, 'float');
    }
}

export function validateConditionParamInteger (val: unknown, name: string): asserts val is number {
    if (!Number.isInteger(val)) {
        throw new VariableTypeMismatchedError(name, 'integer');
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
