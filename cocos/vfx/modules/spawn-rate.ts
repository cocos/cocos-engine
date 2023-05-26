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
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ParticleDataSet } from '../particle-data-set';
import { DELTA_TIME, ContextDataSet } from '../context-data-set';
import { FloatExpression } from '../expressions/float';
import { ConstantFloatExpression } from '../expressions';
import { EmitterDataSet, LOOPED_AGE, SPAWN_REMAINDER } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { FloatParameter } from '../parameters';

@ccclass('cc.SpawnRateModule')
@VFXModule.register('SpawnRate', ModuleExecStageFlags.EMITTER | ModuleExecStageFlags.EVENT_HANDLER)
export class SpawnRateModule extends VFXModule {
    /**
     * @zh 每秒发射的粒子数。
     */
    @type(FloatExpression)
    @serializable
    @rangeMin(0)
    public rate: FloatExpression = new ConstantFloatExpression(10);

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        this.rate.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet)  {
        const deltaTime = context.getParameterUnsafe<FloatParameter>(DELTA_TIME).data;
        const spawnRemainder = emitter.getParameterUnsafe<FloatParameter>(SPAWN_REMAINDER);
        const loopedAge = emitter.getParameterUnsafe<FloatParameter>(LOOPED_AGE).data;
        this.rate.bind(particles, emitter, user, context);
        const spawnRate = this.rate.evaluateSingle();
        const intervalDt = 1 / spawnRate;
        const interpStartDt = (1 - spawnRemainder.data) * intervalDt;
        const count = spawnRemainder.data + (loopedAge > 0 ? spawnRate : 0) * deltaTime;
        const spawnCount = Math.floor(count);
        spawnRemainder.data = count - spawnCount;
        emitter.addSpawnInfo(spawnCount, intervalDt, interpStartDt);
    }
}
