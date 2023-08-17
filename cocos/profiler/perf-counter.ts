/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { ccclass } from 'cc.decorator';
import { Counter, ICounterOption } from './counter';

@ccclass('cc.PerfCounter')
export class PerfCounter extends Counter {
    private declare _time: number;
    constructor (id: string, opts: ICounterOption, now: number) {
        super(id, opts, now);
        this._time = now;
    }
    public start (now = 0): void {
        this._time = now;

        // DISABLE: long time running will cause performance drop down
        // window.performance.mark(this._idstart);
    }

    public end (now = 0): void {
        this._value = now - this._time;

        // DISABLE: long time running will cause performance drop down
        // window.performance.mark(this._idend);
        // window.performance.measure(this._id, this._idstart, this._idend);

        this._average(this._value);
    }

    public tick (): void {
        this.end();
        this.start();
    }

    public frame (now: number): void {
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
