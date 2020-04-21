import { property, type } from '../../data/class-decorator';
import { CCFloat } from '../../data';
import { IBlenderTemplate } from './blender-base';
import { instantiateSymbol } from './instantiate-symbol';

export class Blender1DTemplate implements IBlenderTemplate {
    @property
    public value: number = 0;

    @type([CCFloat])
    private _thresholds: number[] = [];

    constructor (thresholds: readonly number[]) {
        this.thresholds = thresholds;
    }

    @property
    get thresholds () {
        return this._thresholds;
    }

    set thresholds (thresholds: readonly number[]) {
        this._thresholds = thresholds.slice().sort((x, y) => x - y);
    }

    public [instantiateSymbol] () {
        return new Blender1D(this);
    }
}

export class Blender1D {
    private _data: Blender1DTemplate;
    private _weights: number[] = [];
    private _value: number;

    constructor (data: Blender1DTemplate) {
        this._data = data;
        this._value = data.value;
        this._weights = new Array(data.thresholds.length).fill(0);
        this.setValue(this._value);
    }

    get weights () {
        return this._weights;
    }

    public setValue (value: number) {
        this._value = value;
        if (this._data.thresholds.length === 0) {
            ; // Do nothing
        } else if (value < this._data.thresholds[0]) {
            this._weights[0] = 1;
        } else if (value < this._data.thresholds[this._data.thresholds.length - 1]) {
            this._weights[this._weights.length - 1] = 1;
        } else {
            let iUpper = 0;
            for (let iThresholds = 1; iThresholds < this._data.thresholds.length; ++iThresholds) {
                if (this._data.thresholds[iThresholds] > value) {
                    iUpper = iThresholds;
                    break;
                }
            }
            const lower = this._data.thresholds[iUpper - 1];
            const upper = this._data.thresholds[iUpper];
            const dVal = upper - lower;
            this._weights[iUpper - 1] = (upper - value) / dVal;
            this._weights[iUpper] = (value - lower) / dVal;
        }
    }
}