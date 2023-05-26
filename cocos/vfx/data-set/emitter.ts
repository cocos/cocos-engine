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
import { VFXParameterNameSpace, VFXParameterType } from '../define';
import { VFXDataSet } from '../vfx-data-set';
import { VFXParameterIdentity } from '../vfx-parameter';

let builtinEmitterParameterId = 20000;
export const AGE = new VFXParameterIdentity(builtinEmitterParameterId++, 'age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const IS_WORLD_SPACE = new VFXParameterIdentity(builtinEmitterParameterId++, 'is-world-space', VFXParameterType.BOOL, VFXParameterNameSpace.EMITTER);
export const CURRENT_DELAY = new VFXParameterIdentity(builtinEmitterParameterId++, 'current-delay', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const LOOPED_AGE = new VFXParameterIdentity(builtinEmitterParameterId++, 'looped-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const NORMALIZED_LOOP_AGE = new VFXParameterIdentity(builtinEmitterParameterId++, 'normalized-loop-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const SPAWN_REMAINDER = new VFXParameterIdentity(builtinEmitterParameterId++, 'spawn-remainder', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const SPAWN_REMAINDER_PER_UNIT = new VFXParameterIdentity(builtinEmitterParameterId++, 'spawn-remainder-per-unit', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const CURRENT_LOOP_COUNT = new VFXParameterIdentity(builtinEmitterParameterId++, 'current-loop-count', VFXParameterType.UINT32, VFXParameterNameSpace.EMITTER);
export const VELOCITY = new VFXParameterIdentity(builtinEmitterParameterId++, 'velocity', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER);
export const LOCAL_TO_WORLD = new VFXParameterIdentity(builtinEmitterParameterId++, 'local-to-world', VFXParameterType.MAT4, VFXParameterNameSpace.EMITTER);
export const WORLD_TO_LOCAL = new VFXParameterIdentity(builtinEmitterParameterId++, 'world-to-local', VFXParameterType.MAT4, VFXParameterNameSpace.EMITTER);
export const LOCAL_TO_WORLD_RS = new VFXParameterIdentity(builtinEmitterParameterId++, 'local-to-world-rs', VFXParameterType.MAT3, VFXParameterNameSpace.EMITTER);
export const WORLD_TO_LOCAL_RS = new VFXParameterIdentity(builtinEmitterParameterId++, 'world-to-local-rs', VFXParameterType.MAT3, VFXParameterNameSpace.EMITTER);
export const LOCAL_ROTATION = new VFXParameterIdentity(builtinEmitterParameterId++, 'local-rotation', VFXParameterType.QUAT, VFXParameterNameSpace.EMITTER);
export const WORLD_ROTATION = new VFXParameterIdentity(builtinEmitterParameterId++, 'world-rotation', VFXParameterType.QUAT, VFXParameterNameSpace.EMITTER);
export const RENDER_SCALE = new VFXParameterIdentity(builtinEmitterParameterId++, 'render-scale', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER);
export const CUSTOM_EMITTER_PARAMETER_ID = 30000;

export class SpawnInfo {
    count = 0;
    intervalDt = 0;
    interpStartDt = 0;
}

export class EmitterDataSet extends VFXDataSet {
    public spawnInfos: SpawnInfo[] = [new SpawnInfo()];
    public spawnInfoCount = 0;

    constructor () {
        super(VFXParameterNameSpace.EMITTER, false);
        this.addParameter(IS_WORLD_SPACE);
        this.addParameter(CURRENT_DELAY);
        this.addParameter(AGE);
        this.addParameter(LOOPED_AGE);
        this.addParameter(NORMALIZED_LOOP_AGE);
        this.addParameter(CURRENT_LOOP_COUNT);
        this.addParameter(SPAWN_REMAINDER);
        this.addParameter(SPAWN_REMAINDER_PER_UNIT);
        this.addParameter(VELOCITY);
        this.addParameter(LOCAL_TO_WORLD);
        this.addParameter(WORLD_TO_LOCAL);
        this.addParameter(LOCAL_TO_WORLD_RS);
        this.addParameter(WORLD_TO_LOCAL_RS);
        this.addParameter(LOCAL_ROTATION);
        this.addParameter(WORLD_ROTATION);
        this.addParameter(RENDER_SCALE);
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
