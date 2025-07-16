import { Quat, Vec3 } from '../../../core';

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

    /**
     * @zh
     * 三维向量。
     * @en
     * Vector 3d.
     */
    VEC3_experimental,

    /**
     * @zh
     * 四元数。
     * @en
     * Quaternion.
     */
    QUAT_experimental,
}

export type PrimitiveValue = number | string | boolean;

/**
 * @en
 * Represents variable's value.
 * @zh
 * 表示变量的值。
 */
export type Value = PrimitiveValue | Readonly<Vec3> | Readonly<Quat>;

export interface VariableTypeValueTypeMap {
    [VariableType.FLOAT]: number;
    [VariableType.INTEGER]: number;
    [VariableType.BOOLEAN]: boolean;
    [VariableType.TRIGGER]: boolean;
    [VariableType.VEC3_experimental]: Vec3;
    [VariableType.QUAT_experimental]: Quat;
}

export const createInstanceTag = Symbol('CreateInstance');

export interface BasicVariableDescription<TType> {
    readonly type: TType;

    value: TType extends keyof VariableTypeValueTypeMap ? VariableTypeValueTypeMap[TType] : never;

    /**
     * @internal
     */
    [createInstanceTag](): VarInstanceBase;
}

export interface VarRef {
    fn: (this: unknown, value: unknown, ...args: unknown[]) => void;

    thisArg: unknown;

    args: unknown[];
}

export abstract class VarInstanceBase {
    constructor (public readonly type: VariableType) {

    }

    public bind <T, TThis, ExtraArgs extends any[]> (
        fn: (this: TThis, value: T, ...args: ExtraArgs) => void,
        thisArg: TThis,
        ...args: ExtraArgs
    ): Value {
        this._refs.push({
            fn: fn as (this: unknown, value: unknown, ...args: unknown[]) => void,
            thisArg,
            args,
        });
        return this.getValue();
    }

    get value (): Value {
        return this.getValue();
    }

    set value (value) {
        this.setValue(value);
        for (const { fn, thisArg, args } of this._refs) {
            fn.call(thisArg, value, ...args);
        }
    }

    protected abstract getValue(): Value;

    protected abstract setValue(value: Value): void;

    private _refs: VarRef[] = [];
}
