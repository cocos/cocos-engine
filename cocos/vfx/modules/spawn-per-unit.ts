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

import { ccclass, displayOrder, serializable, tooltip, type, range } from 'cc.decorator';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ModuleExecContext, VFXEmitterParams, VFXEmitterState } from '../base';
import { FloatExpression } from '../expressions/float';
import { ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { ConstantExpression } from '../expressions';

@ccclass('cc.SpawnPerUnitModule')
@VFXModule.register('SpawnPerUnit', ModuleExecStageFlags.EMITTER | ModuleExecStageFlags.EVENT_HANDLER)
export class SpawnPerUnitModule extends VFXModule {
    /**
      * @zh 每移动单位距离发射的粒子数。
      */
    @type(FloatExpression)
    @serializable
    @range([0, 1])
    @displayOrder(15)
    @tooltip('i18n:particle_system.rateOverDistance')
    public rate = new ConstantExpression();

    private _rand = new RandomStream();

    public onPlay (params: VFXEmitterParams, state: VFXEmitterState) {
        this._rand.seed = Math.imul(state.randomStream.getUInt32(), state.randomStream.getUInt32());
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { emitterVelocity, normalizedLoopAge: normalizeT, emitterDeltaTime, previousTime, currentTime } = context;
        let deltaTime = emitterDeltaTime;
        if (previousTime > currentTime) {
            const seed = this._rand.seed;
            context.spawnContinuousCount += emitterVelocity.length() * this.rate.evaluateSingle(1, this._rand, context) * (params.duration - previousTime);
            deltaTime = currentTime;
            this._rand.seed = seed;
        }
        context.spawnContinuousCount += emitterVelocity.length() * this.rate.evaluateSingle(normalizeT, this._rand, context) * deltaTime;
    }
}
