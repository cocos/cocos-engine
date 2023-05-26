import { Mat3 } from '../../core';
import { VFXParameterType } from '../define';
import { VFXParameter } from '../vfx-parameter';

export class Mat3Parameter extends VFXParameter {
    get isArray (): boolean {
        return false;
    }

    get type (): VFXParameterType {
        return VFXParameterType.MAT3;
    }

    get data (): Readonly<Mat3> {
        return this._data;
    }

    set data (val: Readonly<Mat3>) {
        Mat3.copy(this._data, val);
    }

    private _data = new Mat3();
}
