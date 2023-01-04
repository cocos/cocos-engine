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

import { ccclass, type, serializable, editable, range } from 'cc.decorator';
import { repeat } from '../core/math';
import { CurveRange } from './curve-range';
import { ParticleUpdateContext } from './particle-update-context';

@ccclass('cc.Burst')
export default class Burst {
    /**
     * @zh 粒子系统开始运行到触发此次 Burst 的时间。
     */
    @editable
    get time () {
        return this._time;
    }

    set time (val) {
        this._time = val;
    }

    /**
     * @zh Burst 的触发次数。
     */
    @editable
    get repeatCount () {
        return this._repeatCount;
    }

    set repeatCount (val) {
        this._repeatCount = val;
    }

    /**
     * @zh 发射的粒子的数量。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    public count: CurveRange = new CurveRange();

    /**
     * @zh 每次触发的间隔时间。
     */
    @serializable
    @editable
    public repeatInterval = 1;
    @serializable
    private _repeatCount = 1;
    @serializable
    private _time = 0;

    public getMaxCount (psys) {
        return this.count.getMax() * Math.min(Math.ceil(psys.duration / this.repeatInterval), this.repeatCount);
    }
}
