/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { _decorator } from '../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { AnimationGraphBindingContext } from './animation-graph-context';
import { VariableNotDefinedError, VariableTypeMismatchedError } from './errors';
import type { VarInstance } from './graph-eval';
import { VariableType } from './variable';

export { VariableType };

export interface Bindable<TValue> {
    value: TValue;

    variable: string;

    clone(): Bindable<TValue>;
}

const { ccclass, serializable } = _decorator;

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

export type BindContext = AnimationGraphBindingContext;

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
): number | TValue {
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

export function validateVariableType (type: VariableType, expected: VariableType, name: string): void {
    if (type !== expected) {
        throw new VariableTypeMismatchedError(name, 'number');
    }
}

export function validateVariableTypeNumeric (type: VariableType, name: string): void {
    if (type !== VariableType.FLOAT && type !== VariableType.INTEGER) {
        throw new VariableTypeMismatchedError(name, 'number or integer');
    }
}

export function validateVariableTypeTriggerLike (type: VariableType, name: string): void {
    if (type !== VariableType.TRIGGER) {
        throw new VariableTypeMismatchedError(name, 'trigger');
    }
}
