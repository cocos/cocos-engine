import { ccclass, serializable } from '../../data/decorators';
import { assertIsTrue } from '../../data/utils/asserts';
import { warn } from '../../platform/debug';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { VariableNotDefinedError, VariableTypeMismatchedError } from './errors';
import type { VarInstance } from './graph-eval';

export enum VariableType {
    FLOAT,

    BOOLEAN,

    TRIGGER,

    INTEGER,
}

export interface Bindable<TValue> {
    value: TValue;

    variable: string;

    clone(): Bindable<TValue>;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}BindableNumber`)
export class BindableNumber implements Bindable<number> {
    @serializable
    public variable = '';

    @serializable
    public value = 0.0;

    constructor (value = 0.0) {
        this.value = value;
    }

    public clone (): Bindable<number> {
        const that = new BindableNumber();
        that.value = this.value;
        that.variable = this.variable;
        return that;
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}BindableBoolean`)
export class BindableBoolean implements Bindable<boolean> {
    @serializable
    public variable = '';

    @serializable
    public value = false;

    constructor (value = false) {
        this.value = value;
    }

    public clone (): Bindable<boolean> {
        const that = new BindableBoolean();
        that.value = this.value;
        that.variable = this.variable;
        return that;
    }
}

export type BindCallback<TValue, TThis, TArgs extends any[]> =
    (this: TThis, value: TValue, ...args: TArgs) => void;

export type VariableTypeValidator = () => void;

export interface BindContext {
    getVar(id: string): VarInstance | undefined;
}

export function bindOr<TValue, TThis, TArgs extends any[]> (
    context: BindContext,
    bindable: Bindable<TValue>,
    type: VariableType,
    callback: BindCallback<TValue, TThis, TArgs>,
    thisArg: TThis,
    ...args: TArgs
): TValue {
    const {
        variable,
        value,
    } = bindable;

    if (!variable) {
        return value;
    }

    const varInstance = context.getVar(variable);
    if (!validateVariableExistence(varInstance, variable)) {
        return value;
    }

    if (varInstance.type !== type) {
        throw new VariableTypeMismatchedError(variable, 'number');
    }

    const initialValue = varInstance.bind(
        callback,
        thisArg,
        ...args,
    );

    return initialValue as unknown as TValue;
}

export function bindNumericOr<TValue, TThis, TArgs extends any[]> (
    context: BindContext,
    bindable: Bindable<TValue>,
    type: VariableType,
    callback: BindCallback<TValue, TThis, TArgs>,
    thisArg: TThis,
    ...args: TArgs
) {
    const {
        variable,
        value,
    } = bindable;

    if (!variable) {
        return value;
    }

    const varInstance = context.getVar(variable);
    if (!validateVariableExistence(varInstance, variable)) {
        return value;
    }

    if (type !== VariableType.FLOAT && type !== VariableType.INTEGER) {
        throw new VariableTypeMismatchedError(variable, 'number or integer');
    }

    const initialValue = varInstance.bind(
        callback,
        thisArg,
        ...args,
    );

    return initialValue as unknown as number;
}

export function validateVariableExistence (varInstance: VarInstance | undefined, name: string): varInstance is VarInstance {
    if (!varInstance) {
        // TODO, warn only?
        throw new VariableNotDefinedError(name);
    } else {
        return true;
    }
}

export function validateVariableType (type: VariableType, expected: VariableType, name: string) {
    if (type !== expected) {
        throw new VariableTypeMismatchedError(name, 'number');
    }
}

export function validateVariableTypeNumeric (type: VariableType, name: string) {
    if (type !== VariableType.FLOAT && type !== VariableType.INTEGER) {
        throw new VariableTypeMismatchedError(name, 'number or integer');
    }
}
