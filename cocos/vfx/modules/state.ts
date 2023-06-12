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
import { ccclass, serializable, type, visible } from 'cc.decorator';
import { Enum } from '../../core';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { P_NORMALIZED_AGE, P_IS_DEAD, P_INV_LIFETIME, C_DELTA_TIME, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

export enum LifetimeElapsedOperation {
    KILL,
    LOOP_LIFETIME,
    KEEP
}

@ccclass('cc.StateModule')
@VFXModule.register('State', ModuleExecStageFlags.UPDATE, [P_NORMALIZED_AGE.name])
export class StateModule extends VFXModule {
    @type(Enum(LifetimeElapsedOperation))
    @visible(true)
    @serializable
    public lifetimeElapsedOperation = LifetimeElapsedOperation.KILL;

    public tick (parameterMap: VFXParameterMap) {
        if (this.lifetimeElapsedOperation === LifetimeElapsedOperation.KILL) {
            parameterMap.ensureParameter(P_IS_DEAD);
        }
        parameterMap.ensureParameter(P_NORMALIZED_AGE);
        parameterMap.ensureParameter(P_INV_LIFETIME);
    }

    public execute (parameterMap: VFXParameterMap) {
        const normalizedAge = parameterMap.getFloatArrayVale(P_NORMALIZED_AGE).data;
        const invLifeTime = parameterMap.getFloatArrayVale(P_INV_LIFETIME).data;
        const deltaTime = parameterMap.getFloatValue(C_DELTA_TIME).data;
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        if (this.lifetimeElapsedOperation === LifetimeElapsedOperation.LOOP_LIFETIME) {
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAge[particleHandle] += deltaTime * invLifeTime[particleHandle];
                if (normalizedAge[particleHandle] > 1) {
                    normalizedAge[particleHandle] -= 1;
                }
            }
        } else if (this.lifetimeElapsedOperation === LifetimeElapsedOperation.KEEP) {
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAge[particleHandle] += deltaTime * invLifeTime[particleHandle];
                if (normalizedAge[particleHandle] > 1) {
                    normalizedAge[particleHandle] = 1;
                }
            }
        } else {
            const isDead = parameterMap.getBoolArrayValue(P_IS_DEAD).data;
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAge[particleHandle] += deltaTime * invLifeTime[particleHandle];
                if (normalizedAge[particleHandle] > 1) {
                    normalizedAge[particleHandle] = 1;
                    isDead[particleHandle] = 1;
                }
            }
        }
    }
}
