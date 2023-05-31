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

import { ccclass, serializable, type, rangeMin } from 'cc.decorator';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ParticleDataSet, ContextDataSet, EmitterDataSet, UserDataSet } from '../data-set';
import { FloatParameter } from '../parameters';
import { E_LOOPED_AGE, C_DELTA_TIME } from '../define';

@ccclass('cc.SpawnBurstModule')
@VFXModule.register('SpawnBurst', ModuleExecStageFlags.EMITTER)
export class SpawnBurstModule extends VFXModule {
    /**
      * @zh 发射的粒子的数量。
      */
    @type(FloatExpression)
    @rangeMin(0)
    public get count () {
        if (!this._count) {
            this._count = new ConstantFloatExpression(1);
        }
        return this._count;
    }

    public set count (val) {
        this._count = val;
    }

    /**
     * @zh 粒子系统开始运行到触发此次 Burst 的时间。
     */
    @type(FloatExpression)
    public get time () {
        if (!this._time) {
            this._time = new ConstantFloatExpression(0);
        }
        return this._time;
    }

    public set time (val) {
        this._time = val;
    }

    @serializable
    private _time: FloatExpression | null = null;
    @serializable
    private _count: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet): void {
        this.count.tick(particles, emitter, user, context);
        this.time.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const loopAge = emitter.getParameterUnsafe<FloatParameter>(E_LOOPED_AGE).data;
        const deltaTime = context.getParameterUnsafe<FloatParameter>(C_DELTA_TIME).data;
        const countExp = this._count as FloatExpression;
        const timeExp = this._time as FloatExpression;
        countExp.bind(particles, emitter, user, context);
        timeExp.bind(particles, emitter, user, context);
        const spawnCount = countExp.evaluateSingle();
        const spawnTime = timeExp.evaluateSingle();

        const spawnStartDt = (spawnTime - (loopAge - deltaTime));

        if (spawnStartDt >= 0 && (spawnTime - loopAge) < 0) {
            emitter.addSpawnInfo(spawnCount, 0, spawnStartDt);
        }
    }
}
