import { ccclass } from '../../../core/data/class-decorator';

export interface ICounterOption {
    desc: string;
    counter: Counter;
    min?: number;
    max?: number;
    average?: number;
    below?: number;
    over?: number;
    color?: string;
}

@ccclass('cc.Counter')
export class Counter {
    get value (){
        return this._value;
    }

    set value (val){
        this._value = val;
    }

    protected _id: string;
    protected _opts: ICounterOption;
    protected _accumStart: number;
    protected _total = 0;
    protected _value = 0;
    protected _averageValue = 0;
    protected _accumValue = 0;
    protected _accumSamples = 0;

    constructor (id: string, opts: ICounterOption, now: number) {
        this._id = id;
        this._opts = opts;
        this._accumStart = now;
    }

    public sample (now: number) {
        this._average(this._value, now);
    }

    public human () {
        const v = this._opts.average ? this._averageValue : this._value;
        return Math.round(v * 100) / 100;
    }

    public alarm () {
        return (
            (this._opts.below && this._value < this._opts.below) ||
            (this._opts.over && this._value > this._opts.over)
        );
    }

    protected _average (v: number, now: number = 0) {
        if (this._opts.average) {
            this._accumValue += v;
            ++this._accumSamples;

            const t = now;
            if (t - this._accumStart >= this._opts.average) {
                this._averageValue = this._accumValue / this._accumSamples;
                this._accumValue = 0;
                this._accumStart = t;
                this._accumSamples = 0;
            }
        }
    }
}
