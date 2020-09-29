import { ccclass } from '../../../core/data/class-decorator';
import { Counter, ICounterOption } from './counter';

@ccclass('cc.PerfCounter')
export class PerfCounter extends Counter {
    private _time: number;
    constructor (id: string, opts: ICounterOption, now: number) {
        super(id, opts, now);
        this._time = now;
    }
    public start (now: number = 0) {
        this._time = now;

        // DISABLE: long time running will cause performance drop down
        // window.performance.mark(this._idstart);
    }

    public end (now: number = 0) {
        this._value = now - this._time;

        // DISABLE: long time running will cause performance drop down
        // window.performance.mark(this._idend);
        // window.performance.measure(this._id, this._idstart, this._idend);

        this._average(this._value);
    }

    public tick () {
        this.end();
        this.start();
    }

    public frame (now: number) {
        const t = now;
        const e = t - this._time;
        this._total++;
        const avg = this._opts.average || 1000;

        if (e > avg) {
            this._value = this._total * 1000 / e;
            this._total = 0;
            this._time = t;
            this._average(this._value);
        }
    }
}
