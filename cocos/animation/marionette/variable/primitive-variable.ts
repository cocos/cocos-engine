import { DEBUG } from 'internal:constants';
import { assertIsTrue } from '../../../core';
import { ccclass, serializable } from '../../../core/data/decorators';
import { BasicVariableDescription, VariableType, createInstanceTag, VarInstanceBase, Value } from './basic';

export type PlainVariableType = VariableType.FLOAT | VariableType.INTEGER | VariableType.BOOLEAN;

@ccclass('cc.animation.PlainVariable')
export class PlainVariable {
    // TODO: we should not specify type here but due to de-serialization limitation
    // See: https://github.com/cocos-creator/3d-tasks/issues/7909
    @serializable
    private _type: PlainVariableType = VariableType.FLOAT;

    // Same as `_type`
    @serializable
    private _value: Value = 0.0;

    constructor (type?: PlainVariableType) {
        if (typeof type === 'undefined') {
            return;
        }

        this._type = type;
        switch (type) {
        default:
            break;
        case VariableType.FLOAT:
            this._value = 0.0;
            break;
        case VariableType.INTEGER:
            this._value = 0;
            break;
        case VariableType.BOOLEAN:
            this._value = false;
            break;
        }
    }

    get type (): PlainVariableType {
        return this._type;
    }

    get value (): Value {
        return this._value;
    }

    set value (value) {
        if (DEBUG) {
            switch (this._type) {
            default:
                break;
            case VariableType.FLOAT:
                assertIsTrue(typeof value === 'number');
                break;
            case VariableType.INTEGER:
                assertIsTrue(Number.isInteger(value));
                break;
            case VariableType.BOOLEAN:
                assertIsTrue(typeof value === 'boolean');
                break;
            }
        }
        this._value = value;
    }

    public [createInstanceTag] (): VarInstancePrimitive {
        return new VarInstancePrimitive(this._type, this._value);
    }
}

export class VarInstancePrimitive extends VarInstanceBase {
    constructor (type: VariableType, value: Value) {
        super(type);
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
