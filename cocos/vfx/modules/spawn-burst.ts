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

import { ccclass, serializable, type, range, editable } from 'cc.decorator';
import { lerp } from '../../core';
import { FloatExpression } from '../expression/float-expression';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ParticleDataSet } from '../particle-data-set';
import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from '../particle-base';
import { RandomStream } from '../random-stream';

@ccclass('cc.SpawnBurstModule')
@ParticleModule.register('SpawnBurst', ModuleExecStage.EMITTER_UPDATE | ModuleExecStage.EVENT_HANDLER)
export class SpawnBurstModule extends ParticleModule {
    /**
      * @zh 发射的粒子的数量。
      */
    @type(FloatExpression)
    @serializable
    @range([0, 1])
    public count = new FloatExpression();

    /**
     * @zh 粒子系统开始运行到触发此次 Burst 的时间。
     */
    @editable
    public get time () {
        return this._time;
    }

    public set time (val) {
        this._time = val;
    }

    /**
      * @zh Burst 的触发次数。
      */
    @editable
    public get repeatCount () {
        return this._repeatCount;
    }

    public set repeatCount (val) {
        this._repeatCount = val;
    }

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

    private _rand = new RandomStream();

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._rand.seed = Math.imul(state.randomStream.getUInt32(), state.randomStream.getUInt32()) >>> 0;
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { emitterPreviousTime, emitterCurrentTime, emitterNormalizedTime } = context;
        let prevT = emitterPreviousTime;
        // handle loop.
        if (prevT > emitterCurrentTime) {
            this._accumulateBurst(prevT, params.duration, 1, context);
            prevT = 0;
        }
        this._accumulateBurst(prevT, emitterCurrentTime, emitterNormalizedTime, context);
    }

    private _accumulateBurst (prevT: number, currT: number, normalizeT: number, context: ParticleExecContext) {
        const rand = this._rand;
        if ((prevT <= this.time && currT > this.time) || (prevT > this.time && this.repeatCount > 1)) {
            const preEmitTime = Math.max(Math.floor((prevT - this.time) / this.repeatInterval), 0);
            if (preEmitTime < this.repeatCount) {
                const currentEmitTime = Math.min(Math.ceil((currT - this.time) / this.repeatInterval), this.repeatCount);
                const toEmitTime = currentEmitTime - preEmitTime;
                if (toEmitTime === 0) { return; }
                if (this.count.mode === FloatExpression.Mode.CONSTANT) {
                    for (let j = 0; j < toEmitTime; j++) {
                        context.burstCount += this.count.constant;
                    }
                } else if (this.count.mode === FloatExpression.Mode.CURVE) {
                    const { spline, multiplier } = this.count;
                    for (let j = 0; j < toEmitTime; j++) {
                        context.burstCount += spline.evaluate(normalizeT) * multiplier;
                    }
                } else if (this.count.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                    const { constantMin, constantMax } = this.count;
                    for (let j = 0; j < toEmitTime; j++) {
                        context.burstCount += lerp(constantMin, constantMax, rand.getFloat());
                    }
                } else {
                    const { splineMin, splineMax, multiplier } = this.count;
                    for (let j = 0; j < toEmitTime; j++) {
                        context.burstCount += lerp(splineMin.evaluate(normalizeT), splineMax.evaluate(normalizeT), rand.getFloat()) * multiplier;
                    }
                }
            }
        }
    }
}
