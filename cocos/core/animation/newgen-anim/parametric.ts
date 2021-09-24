import { VariableType } from '.';
import { ccclass, serializable } from '../../data/decorators';
import { assertIsTrue } from '../../data/utils/asserts';
import { warn } from '../../platform/debug';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

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

export interface BindContext {
    bind<TValue, TThis, TArgs extends any[]>(
        variable: string,
        type: VariableType,
        callback: BindCallback<TValue, TThis, TArgs>,
        thisArg: TThis,
        ...args: TArgs
    ): TValue | undefined;
}

export function bindOr<TValue, TThis, TArgs extends any[]> (
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

    if (!bindable.variable) {
        return bindable.value;
    }

    const initialValue = context.bind(
        variable,
        type,
        callback,
        thisArg,
        ...args,
    );

    if (typeof initialValue === 'undefined') {
        return value;
    } else {
        return initialValue;
    }
}
