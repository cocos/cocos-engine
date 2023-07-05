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
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { E_LOOPED_AGE, C_DELTA_TIME, E_SPAWN_INFOS, E_SPAWN_INFO_COUNT } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { SpawnInfo } from '../data';
import { VFXParameterRegistry } from '../vfx-parameter';

const spawnInfo = new SpawnInfo();

@ccclass('cc.SpawnBurstInstantaneousModule')
@VFXModule.register('SpawnBurstInstantaneous', VFXExecutionStageFlags.EMITTER, [E_SPAWN_INFOS.name], [E_LOOPED_AGE.name])
export class SpawnBurstInstantaneousModule extends VFXModule {
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
        this.requireRecompile();
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
        this.requireRecompile();
    }

    @serializable
    private _time: FloatExpression | null = null;
    @serializable
    private _count: FloatExpression | null = null;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(E_SPAWN_INFOS);
        parameterMap.ensure(E_SPAWN_INFO_COUNT);
        parameterMap.ensure(E_LOOPED_AGE);
        compileResult &&= this.count.compile(parameterMap, parameterRegistry, this);
        compileResult &&= this.time.compile(parameterMap, parameterRegistry, this);
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap) {
        const loopAge = parameterMap.getFloatValue(E_LOOPED_AGE).data;
        const deltaTime = parameterMap.getFloatValue(C_DELTA_TIME).data;
        const spawnInfos = parameterMap.getSpawnInfoArrayValue(E_SPAWN_INFOS);
        const spawnInfoCount = parameterMap.getUint32Value(E_SPAWN_INFO_COUNT);
        if (spawnInfoCount.data === spawnInfos.size) {
            spawnInfos.reserve(spawnInfos.size * 2);
        }
        const countExp = this._count as FloatExpression;
        const timeExp = this._time as FloatExpression;
        countExp.bind(parameterMap);
        timeExp.bind(parameterMap);
        const spawnCount = countExp.evaluate(0);
        const spawnTime = timeExp.evaluate(0);

        const spawnStartDt = (spawnTime - (loopAge - deltaTime));

        if (spawnStartDt >= 0 && spawnTime < loopAge) {
            spawnInfo.count = spawnCount;
            spawnInfo.intervalDt = 0;
            spawnInfo.interpStartDt = spawnStartDt;
            spawnInfos.setSpawnInfoAt(spawnInfo, spawnInfoCount.data);
            spawnInfoCount.data += 1;
        }
    }
}
