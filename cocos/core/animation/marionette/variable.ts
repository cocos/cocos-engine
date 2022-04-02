export type Value = number | string | boolean;

export enum VariableType {
    FLOAT,

    BOOLEAN,

    TRIGGER,

    INTEGER,
}

/**
 * @zh 布尔类型变量的重置模式，指示在哪些情况下将变量重置为 `false`。
 */
export enum TriggerResetMode {
    /**
     * @zh 在该变量被动画过渡消耗后自动重置。
     */
    AFTER_CONSUMED,

    /**
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
