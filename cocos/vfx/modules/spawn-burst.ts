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

import { ccclass, serializable, type, range, editable, rangeMin } from 'cc.decorator';
import { FloatExpression } from '../expressions/float';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { ConstantFloatExpression } from '../expressions';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

@ccclass('cc.SpawnBurstModule')
@VFXModule.register('SpawnBurst', ModuleExecStageFlags.EMITTER)
export class SpawnBurstModule extends VFXModule {
    /**
      * @zh 发射的粒子的数量。
      */
    @type(FloatExpression)
    @serializable
    @rangeMin(0)
    public count: FloatExpression = new ConstantFloatExpression(0);

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

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { prevLoopAge, loopAge, normalizedLoopAge } = emitter;
        let prevT = prevLoopAge;
        // handle loop.
        if (prevT > loopAge) {
            const seed = this.randomStream.seed;
            this._accumulateBurst(prevT, emitter.currentDuration, 1, context);
            prevT = 0;
            this.randomStream.seed = seed;
        }
        this._accumulateBurst(prevT, loopAge, normalizedLoopAge, context);
    }

    private _accumulateBurst (prevT: number, currT: number, normalizeT: number, context: ModuleExecContext) {
        const rand = this.randomStream;
        if ((prevT <= this.time && currT > this.time) || (prevT > this.time && this.repeatCount > 1)) {
            const preEmitTime = Math.max(Math.floor((prevT - this.time) / this.repeatInterval), 0);
            if (preEmitTime < this.repeatCount) {
                const currentEmitTime = Math.min(Math.ceil((currT - this.time) / this.repeatInterval), this.repeatCount);
                const toEmitTime = currentEmitTime - preEmitTime;
                if (toEmitTime === 0) { return; }
                for (let j = 0; j < toEmitTime; j++) {
                    context.burstCount += this.count.evaluateSingle();
                }
            }
        }
    }
}
