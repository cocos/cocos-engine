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
import { E_AGE, E_CURRENT_DELAY, E_CURRENT_LOOP_COUNT, E_IS_WORLD_SPACE, E_LOCAL_ROTATION, E_LOCAL_TO_WORLD, E_LOCAL_TO_WORLD_RS, E_LOOPED_AGE, E_NORMALIZED_LOOP_AGE, E_RENDER_SCALE, E_SPAWN_REMAINDER, E_SPAWN_REMAINDER_PER_UNIT, E_VELOCITY, E_WORLD_ROTATION, E_WORLD_TO_LOCAL, E_WORLD_TO_LOCAL_RS, VFXParameterNameSpace } from '../define';
import { VFXDataSet } from '../vfx-data-set';

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
        this.addParameter(E_IS_WORLD_SPACE);
        this.addParameter(E_CURRENT_DELAY);
        this.addParameter(E_AGE);
        this.addParameter(E_LOOPED_AGE);
        this.addParameter(E_NORMALIZED_LOOP_AGE);
        this.addParameter(E_CURRENT_LOOP_COUNT);
        this.addParameter(E_SPAWN_REMAINDER);
        this.addParameter(E_SPAWN_REMAINDER_PER_UNIT);
        this.addParameter(E_VELOCITY);
        this.addParameter(E_LOCAL_TO_WORLD);
        this.addParameter(E_WORLD_TO_LOCAL);
        this.addParameter(E_LOCAL_TO_WORLD_RS);
        this.addParameter(E_WORLD_TO_LOCAL_RS);
        this.addParameter(E_LOCAL_ROTATION);
        this.addParameter(E_WORLD_ROTATION);
        this.addParameter(E_RENDER_SCALE);
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
