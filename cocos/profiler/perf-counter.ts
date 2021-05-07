/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { ccclass } from 'cc.decorator';

export interface ICounterOption {
    desc: string;
    average?: number;
    below?: number;
    over?: number;
    isInteger?: boolean;
}

export class Counter {
    get value () {
        return this._value;
    }

    set value (val) {
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
        const { average, isInteger } = this._opts;
        const v = average ? this._averageValue : this._value;
        return isInteger ? Math.round(v) : Math.round(v * 100) / 100;
    }

    public alarm () {
        return (
            (this._opts.below && this._value < this._opts.below)
            || (this._opts.over && this._value > this._opts.over)
        );
    }

    protected _average (v: number, now = 0) {
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

@ccclass('cc.PerfCounter')
export class PerfCounter extends Counter {
    private _time: number;
    constructor (id: string, opts: ICounterOption, now: number) {
        super(id, opts, now);
        this._time = now;
    }
    public start (now = 0) {
        this._time = now;

        // DISABLE: long time running will cause performance drop down
        // window.performance.mark(this._idstart);
    }

    public end (now = 0) {
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
