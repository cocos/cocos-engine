import { assertIsTrue } from '../../../core';
import { ccclass, serializable } from '../../../core/data/decorators';
import { BasicVariableDescription, createInstanceTag, Value, VariableType, VarInstanceBase } from './basic';

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

const TRIGGER_VARIABLE_FLAG_VALUE_START = 0;
const TRIGGER_VARIABLE_FLAG_VALUE_MASK = 1;
const TRIGGER_VARIABLE_FLAG_RESET_MODE_START = 1;
const TRIGGER_VARIABLE_FLAG_RESET_MODE_MASK = 6; // 0b110

// DO NOT CHANGE TO THIS VALUE. This is related to V3.5 migration.
const TRIGGER_VARIABLE_DEFAULT_FLAGS = 0;

// Let's ensure `0`'s meaning: `value: false, resetMode: TriggerSwitchMode: TriggerResetMode.AFTER_CONSUMED`
assertIsTrue((
    (0 << TRIGGER_VARIABLE_FLAG_VALUE_START)
    | (TriggerResetMode.AFTER_CONSUMED << TRIGGER_VARIABLE_FLAG_RESET_MODE_START)
) === TRIGGER_VARIABLE_DEFAULT_FLAGS);

@ccclass('cc.animation.TriggerVariable')
export class TriggerVariable implements BasicVariableDescription<VariableType.TRIGGER> {
    get type (): VariableType.TRIGGER {
        return VariableType.TRIGGER as const;
    }

    get value (): boolean {
        return !!((this._flags & TRIGGER_VARIABLE_FLAG_VALUE_MASK) >> TRIGGER_VARIABLE_FLAG_VALUE_START);
    }

    set value (value) {
        if (value) {
            this._flags |= (1 << TRIGGER_VARIABLE_FLAG_VALUE_START);
        } else {
            this._flags &= ~(1 << TRIGGER_VARIABLE_FLAG_VALUE_START);
        }
    }

    get resetMode (): TriggerResetMode {
        return ((this._flags & TRIGGER_VARIABLE_FLAG_RESET_MODE_MASK) >> TRIGGER_VARIABLE_FLAG_RESET_MODE_START);
    }

    set resetMode (value: TriggerResetMode) {
        // Clear
        this._flags &= ~TRIGGER_VARIABLE_FLAG_RESET_MODE_MASK;
        // Set
        this._flags |= (value << TRIGGER_VARIABLE_FLAG_RESET_MODE_START);
    }

    public [createInstanceTag] (): VarInstanceTrigger {
        return new VarInstanceTrigger(this.value, this.resetMode);
    }

    // l -> h
    // value(1 bits) | reset_mode(2 bits)
    @serializable
    private _flags = TRIGGER_VARIABLE_DEFAULT_FLAGS;
}

export class VarInstanceTrigger extends VarInstanceBase {
    public readonly resetMode: TriggerResetMode = TriggerResetMode.AFTER_CONSUMED;

    constructor (value: Value, resetMode: TriggerResetMode) {
        super(VariableType.TRIGGER);
        this.resetMode = resetMode;
        this._value = value;
    }

    protected getValue (): Value {
        return this._value;
    }

    protected setValue (value: Value): void {
        this._value = value;
    }

    private _value: Value;
}
