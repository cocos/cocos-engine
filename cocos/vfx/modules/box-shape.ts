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
import { ccclass, displayOrder, serializable, tooltip, type, visible } from 'cc.decorator';
import { ShapeModule } from './shape';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { Enum, Vec3 } from '../../core';
import { BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { VFXEmitterParams, ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

enum EmitFrom {
    VOLUME,
    EDGE,
    SHELL,
}

const tempPosition = new Vec3();
@ccclass('cc.BoxShapeModule')
@VFXModule.register('BoxShape', ModuleExecStageFlags.SPAWN, [BuiltinParticleParameterName.START_DIR])
export class BoxShapeModule extends ShapeModule {
    static EmitFrom = EmitFrom;

    @type(Enum(EmitFrom))
    @serializable
    public emitFrom = EmitFrom.VOLUME;

    @serializable
    @displayOrder(12)
    @tooltip('i18n:shapeModule.boxThickness')
    @visible(function (this: BoxShapeModule) { return this.emitFrom !== EmitFrom.VOLUME; })
    public boxThickness = new Vec3(0, 0, 0);

    private _thicknessPercent = new Vec3(0, 0, 0);

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        Vec3.set(this._thicknessPercent, 1 - this.boxThickness.x, 1 - this.boxThickness.y, 1 - this.boxThickness.z);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const thicknessPercent = this._thicknessPercent;
        const { fromIndex, toIndex } = context;
        const { startDir, vec3Register } = particles;
        const rand = this._rand;
        switch (this.emitFrom) {
        case EmitFrom.VOLUME:
            for (let i = fromIndex; i < toIndex; ++i) {
                vec3Register.set3fAt(rand.getFloat() - 0.5, rand.getFloat() - 0.5, rand.getFloat() - 0.5, i);
                startDir.set3fAt(0, 0, 1, i);
            }
            break;
        case EmitFrom.SHELL:
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
                vec3Register.set3fAt(tempPosition.x - 0.5, tempPosition.y - 0.5, tempPosition.z - 0.5, i);
                startDir.set3fAt(0, 0, 1, i);
            }
            break;
        case EmitFrom.EDGE:
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
                vec3Register.set3fAt(tempPosition.x - 0.5, tempPosition.y - 0.5, tempPosition.z - 0.5, i);
                startDir.set3fAt(0, 0, 1, i);
            }
            break;
        default:
        }
        super.execute(particles, params, context);
    }
}
