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
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { C_DELTA_TIME, E_SPAWN_REMAINDER, E_LOOPED_AGE, E_SPAWN_INFOS, E_SPAWN_INFO_COUNT } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { SpawnInfo } from '../data';
import { VFXParameterRegistry } from '../vfx-parameter';

const spawnInfo = new SpawnInfo();

@ccclass('cc.SpawnRateModule')
@VFXModule.register('SpawnRate', VFXExecutionStageFlags.EMITTER, [E_SPAWN_INFOS.name], [E_LOOPED_AGE.name])
export class SpawnRateModule extends VFXModule {
    /**
     * @zh 每秒发射的粒子数。
     */
    @type(FloatExpression)
    @rangeMin(0)
    public get rate () {
        if (!this._rate) {
            this._rate = new ConstantFloatExpression(10);
        }
        return this._rate;
    }

    public set rate (val) {
        this._rate = val;
        this.requireRecompile();
    }

    @serializable
    private _rate: FloatExpression | null = null;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(E_SPAWN_REMAINDER);
        parameterMap.ensure(E_SPAWN_INFOS);
        parameterMap.ensure(E_SPAWN_INFO_COUNT);
        parameterMap.ensure(E_LOOPED_AGE);
        compileResult &&= this.rate.compile(parameterMap, parameterRegistry, this);
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap)  {
        const deltaTime = parameterMap.getFloatValue(C_DELTA_TIME).data;
        const spawnRemainder = parameterMap.getFloatValue(E_SPAWN_REMAINDER);
        const loopedAge = parameterMap.getFloatValue(E_LOOPED_AGE).data;
        const spawnInfos = parameterMap.getSpawnInfoArrayValue(E_SPAWN_INFOS);
        const spawnInfoCount = parameterMap.getUint32Value(E_SPAWN_INFO_COUNT);
        if (spawnInfoCount.data === spawnInfos.size) {
            spawnInfos.reserve(spawnInfos.size * 2);
        }
        const rateExp = this._rate as FloatExpression;
        rateExp.bind(parameterMap);
        const spawnRate = rateExp.evaluate(0);
        const intervalDt = 1 / spawnRate;
        const interpStartDt = (1 - spawnRemainder.data) * intervalDt;
        const count = spawnRemainder.data + (loopedAge > 0 ? spawnRate : 0) * deltaTime;
        const spawnCount = Math.floor(count);
        spawnRemainder.data = count - spawnCount;
        spawnInfo.count = spawnCount;
        spawnInfo.intervalDt = intervalDt;
        spawnInfo.interpStartDt = interpStartDt;
        spawnInfos.setSpawnInfoAt(spawnInfo, spawnInfoCount.data);
        spawnInfoCount.data += 1;
    }
}
