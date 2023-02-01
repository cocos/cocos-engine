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

import { ccclass, type, serializable, editable, range } from 'cc.decorator';
import { repeat } from '../core/math';
import CurveRange from './animator/curve-range';

@ccclass('cc.Burst')
export default class Burst {
    @serializable
    private _time = 0;

    /**
     * @zh 粒子系统开始运行到触发此次 Brust 的时间。
     */
    @editable
    get time () {
        return this._time;
    }

    set time (val) {
        this._time = val;
        this._curTime = val;
    }

    @serializable
    private _repeatCount = 1;

    /**
     * @zh Burst 的触发次数。
     */
    @editable
    get repeatCount () {
        return this._repeatCount;
    }

    set repeatCount (val) {
        this._repeatCount = val;
        this._remainingCount = val;
    }

    /**
     * @zh 每次触发的间隔时间。
     */
    @serializable
    @editable
    public repeatInterval = 1;

    /**
     * @zh 发射的粒子的数量。
     */
    @type(CurveRange)
    @serializable
    @range([0, Number.POSITIVE_INFINITY, 1])
    public count: CurveRange = new CurveRange();

    private _remainingCount: number;
    private _curTime: number;

    constructor () {
        this._remainingCount = 0;
        this._curTime = 0.0;
    }

    public update (psys, dt: number) {
        if (this._remainingCount === 0) {
            this._remainingCount = this._repeatCount;
            this._curTime = this._time;
        }
        if (this._remainingCount > 0) {
            let preFrameTime = repeat(psys._time - psys.startDelay.evaluate(0, 1), psys.duration) - dt;
            preFrameTime = (preFrameTime > 0.0) ? preFrameTime : 0.0;
            const curFrameTime = repeat(psys.time - psys.startDelay.evaluate(0, 1), psys.duration);
            if (this._curTime >= preFrameTime && this._curTime < curFrameTime) {
                psys.emit(this.count.evaluate(this._curTime / psys.duration, 1), dt - (curFrameTime - this._curTime));
                this._curTime += this.repeatInterval;
                --this._remainingCount;
            }
        }
    }

    public reset () {
        this._remainingCount = 0;
        this._curTime = 0.0;
    }

    public getMaxCount (psys) {
        return this.count.getMax() * Math.min(Math.ceil(psys.duration / this.repeatInterval), this.repeatCount);
    }
}
