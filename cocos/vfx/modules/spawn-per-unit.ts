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

import { ccclass, serializable, type } from 'cc.decorator';
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { E_VELOCITY, C_DELTA_TIME, E_LOOPED_AGE, E_SPAWN_REMAINDER_PER_UNIT, E_SPAWN_INFOS, E_SPAWN_INFO_COUNT } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { SpawnInfo } from '../data';

const spawnInfo = new SpawnInfo();
@ccclass('cc.SpawnPerUnitModule')
@VFXModule.register('SpawnPerUnit', VFXExecutionStageFlags.EMITTER, [E_SPAWN_INFOS.name], [E_LOOPED_AGE.name])
export class SpawnPerUnitModule extends VFXModule {
    /**
      * @zh 每移动单位距离发射的粒子数。
      */
    @type(FloatExpression)
    public get spawnSpacing () {
        if (!this._spawnSpacing) {
            this._spawnSpacing = new ConstantFloatExpression(0.2);
        }
        return this._spawnSpacing;
    }

    public set spawnSpacing (val) {
        this._spawnSpacing = val;
        this.requireRecompile();
    }

    @serializable
    private _spawnSpacing: FloatExpression | null = null;

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        super.compile(parameterMap, owner);
        this.spawnSpacing.compile(parameterMap, this);
    }

    public execute (parameterMap: VFXParameterMap) {
        const velocity = parameterMap.getVec3Value(E_VELOCITY).data;
        const deltaTime = parameterMap.getFloatValue(C_DELTA_TIME).data;
        const loopedAge = parameterMap.getFloatValue(E_LOOPED_AGE).data;
        const spawnRemainderPerUnit = parameterMap.getFloatValue(E_SPAWN_REMAINDER_PER_UNIT);
        const spawnInfos = parameterMap.getSpawnInfoArrayValue(E_SPAWN_INFOS);
        const spawnInfoCount = parameterMap.getUint32Value(E_SPAWN_INFO_COUNT);
        if (spawnInfoCount.data === spawnInfos.capacity) {
            spawnInfos.reserve(spawnInfos.capacity * 2);
        }
        const spawnSpacingExp = this._spawnSpacing as FloatExpression;
        spawnSpacingExp.bind(parameterMap);
        let spawnSpacing = spawnSpacingExp.evaluateSingle();
        spawnSpacing = spawnSpacing <= 0 ? 0 : (1 / Math.max(spawnSpacing, 1e-6));
        spawnSpacing *= velocity.length();
        const spawnCount =  spawnRemainderPerUnit.data + spawnSpacing * deltaTime;
        const intervalDt =  1 / spawnSpacing;
        const interpStartDt = (1 - spawnRemainderPerUnit.data) * intervalDt;
        const spawnCountFloor = Math.floor(spawnCount);
        spawnRemainderPerUnit.data = spawnCount - spawnCountFloor;

        spawnInfo.count = loopedAge > 0 ? spawnCountFloor : 0;
        spawnInfo.intervalDt = intervalDt;
        spawnInfo.interpStartDt = interpStartDt;
        spawnInfos.setSpawnInfoAt(spawnInfo, spawnInfoCount.data);
        spawnInfoCount.data += 1;
    }
}
