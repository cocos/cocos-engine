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
import { ShapeModule, DistributionMode } from './shape';
import { ccclass, displayOrder, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Enum, toDegree, toRadian, Vec3 } from '../../core';
import { BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../particle-base';
import { CurveRange } from '../curve-range';
import { RandNumGen } from '../rand-num-gen';

@ccclass('cc.RectangleShapeModule')
@ParticleModule.register('RectangleShape', ModuleExecStage.SPAWN, [BuiltinParticleParameterName.START_DIR])
export class RectangleShapeModule extends ShapeModule {
    public execute (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex } = context;
        const { vec3Register, startDir } = particles;
        const rand = this._rand;
        for (let i = fromIndex; i < toIndex; i++) {
            vec3Register.set3fAt(rand.getFloatFromRange(-0.5, 0.5), rand.getFloatFromRange(-0.5, 0.5), 0, i);
            startDir.set3fAt(0, 0, 1, i);
        }
    }
}
