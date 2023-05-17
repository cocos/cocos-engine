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
import { ShapeLocationModule } from './shape-location';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { Enum, Vec3 } from '../../core';
import { ParticleDataSet, POSITION } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

enum LocationMode {
    VOLUME,
    EDGE,
    SHELL,
}

const tempPosition = new Vec3();
const dir = new Vec3();
const pos = new Vec3();
@ccclass('cc.BoxLocationModule')
@VFXModule.register('BoxLocation', ModuleExecStageFlags.SPAWN, [POSITION.name])
export class BoxLocationModule extends ShapeLocationModule {
    static LocationMode = LocationMode;

    @type(Enum(LocationMode))
    @serializable
    public locationMode = LocationMode.VOLUME;

    @serializable
    @visible(function (this: BoxLocationModule) { return this.locationMode !== LocationMode.VOLUME; })
    public boxThickness = new Vec3(0, 0, 0);

    private _thicknessPercent = new Vec3(0, 0, 0);

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        Vec3.set(this._thicknessPercent, 1 - this.boxThickness.x, 1 - this.boxThickness.y, 1 - this.boxThickness.z);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const thicknessPercent = this._thicknessPercent;
        const { fromIndex, toIndex } = context;
        const position = particles.getVec3Parameter(POSITION);
        const rand = this.randomStream;
        switch (this.locationMode) {
        case LocationMode.VOLUME:
            for (let i = fromIndex; i < toIndex; ++i) {
                Vec3.set(pos, rand.getFloat() - 0.5, rand.getFloat() - 0.5, rand.getFloat() - 0.5);
                this.storePosition(i, pos, position);
            }
            break;
        case LocationMode.SHELL:
            for (let i = fromIndex; i < toIndex; ++i) {
                const x = rand.getFloat();
                const y = rand.getFloat();
                const z = rand.getFloat();
                const face = rand.getIntFromRange(0, 3);
                Vec3.set(tempPosition,
                    face === 0 ? (x >= 0.5 ? 1 : 0) : x,
                    face === 1 ? (y >= 0.5 ? 1 : 0) : y,
                    face === 2 ? (z >= 0.5 ? 1 : 0) : z);
                tempPosition.x *= rand.getFloatFromRange(thicknessPercent.x, 1);
                tempPosition.y *= rand.getFloatFromRange(thicknessPercent.y, 1);
                tempPosition.z *= rand.getFloatFromRange(thicknessPercent.z, 1);
                Vec3.set(pos, tempPosition.x - 0.5, tempPosition.y - 0.5, tempPosition.z - 0.5);
                this.storePosition(i, pos, position);
            }
            break;
        case LocationMode.EDGE:
            for (let i = fromIndex; i < toIndex; ++i) {
                const x = rand.getFloat();
                const y = rand.getFloat();
                const z = rand.getFloat();
                const face = rand.getIntFromRange(0, 3);
                Vec3.set(tempPosition,
                    face !== 0 ? (x >= 0.5 ? 1 : 0) : x,
                    face !== 1 ? (y >= 0.5 ? 1 : 0) : y,
                    face !== 2 ? (z >= 0.5 ? 1 : 0) : z);
                tempPosition.x *= rand.getFloatFromRange(thicknessPercent.x, 1);
                tempPosition.y *= rand.getFloatFromRange(thicknessPercent.y, 1);
                tempPosition.z *= rand.getFloatFromRange(thicknessPercent.z, 1);
                Vec3.set(pos, tempPosition.x - 0.5, tempPosition.y - 0.5, tempPosition.z - 0.5);
                this.storePosition(i, pos, position);
            }
            break;
        default:
        }
    }
}
