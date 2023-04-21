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
import { pseudoRandom, random, repeat } from '../core/math';
import CurveRange from './animator/curve-range';
import { Particle } from './particle';

const BURST_RND_SEED = 1712325;

export class SubBurst {
    private _time = 0;
    private _repeatCount = 1;
    public repeatInterval = 1;
    private _remainingCount: number;
    private _curTime: number;
    public count: CurveRange = new CurveRange();
    public finish: boolean;
    private _ps;
    private _current = 0;
    private _delayTime = 0;

    set time (val) {
        this._time = val;
        this._curTime = val;
    }

    set repeatCount (val) {
        this._repeatCount = val;
        this._remainingCount = val;
    }

    constructor (psystem) {
        this._ps = psystem;
        this._remainingCount = 0;
        this._curTime = 0.0;
        this._current = 0.0;
        this._delayTime = 0.0;
        this.finish = false;
    }

    public reset () {
        this._remainingCount = 0;
        this._curTime = 0.0;
        this._current = this.repeatInterval;
        this._delayTime = 0.0;
        this.finish = false;
    }

    public update (dt: number, parentParticle: Particle) {
        if (this._remainingCount > 0) {
            if (!this._ps.isPlaying) {
                this._ps.play();
            }

            if (this._delayTime > this._time && this._current >= this.repeatInterval) {
                const rand = pseudoRandom(parentParticle.randomSeed ^ (BURST_RND_SEED + 1));
                this.count.bake();
                const count = this.count.evaluate(this._ps.time / this._ps.duration, rand);
                this._ps.emit(count, dt, parentParticle);
                --this._remainingCount;
                this._current = 0.0;
            }
        }

        if (this._delayTime > this._time) {
            this._current += dt;
        }
        this._delayTime += dt;

        if (this._remainingCount === 0) {
            this.finish = true;
            this._current = this.repeatInterval;
            this._delayTime = 0.0;
        }
    }

    public copy (burst: Burst) {
        this.time = burst.time;
        this.repeatCount = burst.repeatCount;
        this.repeatInterval = burst.repeatInterval;
        this._current = this.repeatInterval;
        this._delayTime = 0.0;
        this.count = burst.count;
        this.finish = false;
    }
}

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
    @range([0, 1])
    public count: CurveRange = new CurveRange();

    private _remainingCount: number;
    private _curTime: number;

    constructor () {
        this._remainingCount = 0;
        this._curTime = 0.0;
    }

    public update (psys, dt: number, parentParticle?: Particle) {
        if (this._remainingCount === 0) {
            this._remainingCount = this._repeatCount;
            psys.startDelay.bake();
            const startDelay: number = psys.startDelay.evaluate(0, random());
            this._curTime = this._time + startDelay;
        }
        if (this._remainingCount > 0) {
            let preFrameTime = repeat(psys.time, psys.duration) - dt;
            preFrameTime = (preFrameTime > 0.0) ? preFrameTime : 0.0;
            const curFrameTime = repeat(psys.time, psys.duration);
            if (this._curTime >= preFrameTime && this._curTime < curFrameTime) {
                if (!parentParticle) {
                    this.count.bake();
                    psys.emit(this.count.evaluate(this._curTime / psys.duration, random()), dt - (curFrameTime - this._curTime));
                }
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
