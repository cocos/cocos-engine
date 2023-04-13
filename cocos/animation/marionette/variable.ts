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

/**
 * @en
 * Represents variable's value.
 * @zh
 * 表示变量的值。
 */
export type Value = number | string | boolean;

/**
 * @en
 * Represents animation graph variable types.
 * @zh
 * 表示动画图变量的类型。
 */
export enum VariableType {
    /**
     * @en
     * A floating.
     * @zh
     * 浮点数。
     */
    FLOAT,

    /**
     * @en
     * A boolean.
     * @zh
     * 布尔值。
     */
    BOOLEAN,

    /**
     * @en
     * A trigger.
     * @zh
     * 触发器。
     */
    TRIGGER,

    /**
     * @en
     * An integer.
     * @zh
     * 整数。
     */
    INTEGER,
}

/**
 * @en The reset mode of boolean variables. It indicates when to reset the variable as `false`.
 * @zh 布尔类型变量的重置模式，指示在哪些情况下将变量重置为 `false`。
 */
export enum TriggerResetMode {
    /**
     * @en The variable is reset when it's consumed by animation transition.
     * @zh 在该变量被动画过渡消耗后自动重置。
     */
    AFTER_CONSUMED,

    /**
     * @en The variable is reset in next frame or when it's consumed by animation transition.
     * @zh 下一帧自动重置；在该变量被动画过渡消耗后也会自动重置。
     */
    NEXT_FRAME_OR_AFTER_CONSUMED,
}

export class VarInstance {
    public type: VariableType;

    public resetMode: TriggerResetMode = TriggerResetMode.AFTER_CONSUMED;

    constructor (type: VariableType, value: Value) {
        this.type = type;
        this._value = value;
    }

    get value () {
        return this._value;
    }

    set value (value) {
        this._value = value;
        for (const { fn, thisArg, args } of this._refs) {
            fn.call(thisArg, value, ...args);
        }
    }

    public bind <T, TThis, ExtraArgs extends any[]> (
        fn: (this: TThis, value: T, ...args: ExtraArgs) => void,
        thisArg: TThis,
        ...args: ExtraArgs
    ) {
        this._refs.push({
            fn: fn as (this: unknown, value: unknown, ...args: unknown[]) => void,
            thisArg,
            args,
        });
        return this._value;
    }

    private _value: Value;
    private _refs: VarRef[] = [];
}

interface VarRef {
    fn: (this: unknown, value: unknown, ...args: unknown[]) => void;

    thisArg: unknown;

    args: unknown[];
}

interface VarRefs {
    type: VariableType;

    value: Value;

    refs: VarRef[];
}
