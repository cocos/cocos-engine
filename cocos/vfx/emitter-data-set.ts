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
import { Mat3, Mat4, Quat, Vec3 } from '../core';
import { VFXParameterNameSpace, VFXParameterType } from './define';
import { VFXParameterIdentity } from './vfx-parameter';

let builtinEmitterParameterId = 20000;
export const AGE = new VFXParameterIdentity(builtinEmitterParameterId++, 'age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const IS_WORLD_SPACE = new VFXParameterIdentity(builtinEmitterParameterId++, 'is-world-space', VFXParameterType.BOOL, VFXParameterNameSpace.EMITTER);
export const CURRENT_DELAY = new VFXParameterIdentity(builtinEmitterParameterId++, 'current-delay', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const LOOPED_AGE = new VFXParameterIdentity(builtinEmitterParameterId++, 'looped-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const NORMALIZED_LOOP_AGE = new VFXParameterIdentity(builtinEmitterParameterId++, 'normalized-loop-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const CURRENT_LOOP_COUNT = new VFXParameterIdentity(builtinEmitterParameterId++, 'current-loop-count', VFXParameterType.UINT32, VFXParameterNameSpace.EMITTER);
export const CURRENT_DURATION = new VFXParameterIdentity(builtinEmitterParameterId++, 'current-duration', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const VELOCITY = new VFXParameterIdentity(builtinEmitterParameterId++, 'velocity', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER);
export const CUSTOM_EMITTER_PARAMETER_ID = 30000;

export class SpawnInfo {
    count = 0;
    intervalDt = 0;
    interpStartDt = 0;
}

export class EmitterDataSet {
    public isWorldSpace = false;
    public currentDelay = 0;
    public age = 0;
    public loopAge = 0;
    public normalizedLoopAge = 0;
    public currentLoopCount = 0;
    public spawnRemainder = 0;
    public currentDuration = 0;
    public velocity = new Vec3();
    public prevWorldPosition = new Vec3();
    public worldPosition = new Vec3();
    public localToWorld = new Mat4();
    public localToWorldRS = new Mat3();
    public worldToLocal = new Mat4();
    public worldToLocalRS = new Mat3();
    public localRotation = new Quat();
    public worldRotation = new Quat();
    public renderScale = new Vec3();

    public spawnInfos: SpawnInfo[] = [new SpawnInfo()];
    public spawnInfoCount = 0;

    getFloatParameter (id: VFXParameterIdentity): number {
        switch (id) {
        case AGE: return this.age;
        case CURRENT_DELAY: return this.currentDelay;
        case LOOPED_AGE: return this.loopAge;
        case NORMALIZED_LOOP_AGE: return this.normalizedLoopAge;
        case CURRENT_DURATION: return this.currentDuration;
        default: throw new Error('unreachable');
        }
    }

    getVec3Parameter (id: VFXParameterIdentity): Vec3 {
        switch (id) {
        case VELOCITY: return this.velocity;
        default: throw new Error('unreachable');
        }
    }

    addSpawnInfo (spawnCount: number, intervalDt: number, interpStartDt: number) {
        if (this.spawnInfoCount >= this.spawnInfos.length) {
            this.spawnInfos.push(new SpawnInfo());
        }
        const spawnInfo = this.spawnInfos[this.spawnInfoCount++];
        spawnInfo.count = spawnCount;
        spawnInfo.intervalDt = intervalDt;
        spawnInfo.interpStartDt = interpStartDt;
    }

    clearSpawnInfo () {
        this.spawnInfoCount = 0;
    }
}
