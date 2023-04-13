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

import { ccclass, displayOrder, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Enum, toDegree, toRadian, Vec3 } from '../../core';
import { BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { FloatExpression } from '../expression/float-expression';
import { AngleBasedShapeModule } from './angle-based-shape';
import { ParticleVec3ArrayParameter } from '../particle-parameter';

const temp = new Vec3();
@ccclass('cc.DonutShapeModule')
@ParticleModule.register('DonutShape', ModuleExecStage.SPAWN, [BuiltinParticleParameterName.START_DIR])
export class DonutShapeModule extends AngleBasedShapeModule {
    /**
       * @zh 粒子发射器半径。
       */
    @serializable
    @tooltip('i18n:shapeModule.radius')
    public radius = 1;

    /**
     * @zh 粒子发射器发射位置（对 Box 类型的发射器无效）：<bg>
     * - 0 表示从表面发射；
     * - 1 表示从中心发射；
     * - 0 ~ 1 之间表示在中心到表面之间发射。
     */
    @serializable
    @tooltip('i18n:shapeModule.radiusThickness')
    public radiusThickness = 1;

    @serializable
    public donutRadius = 0.2;

    private _donutInnerRadius = 0;

    public tick (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        super.tick(particles, params, context);
        this._donutInnerRadius = (1 - this.radiusThickness) ** 2;
    }

    protected generatePosAndDir (index: number, angle: number, startDir: ParticleVec3ArrayParameter, vec3Register: ParticleVec3ArrayParameter) {
        const innerRadius = this._donutInnerRadius;
        const radius = this.radius;
        const donutRadius = this.donutRadius;
        const rand = this._rand;
        const radiusRandom = Math.sqrt(rand.getFloatFromRange(innerRadius, 1.0));
        const r = radiusRandom * donutRadius;
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        const donutAngle = rand.getFloatFromRange(0, Math.PI * 2);
        const dx = Math.cos(donutAngle);
        const dy = Math.sin(donutAngle);
        startDir.set3fAt(x * dx, y * dx, dy, index);
        temp.x = (radius + r * dx) * x;
        temp.y = (radius + r * dy) * y;
        temp.z = r * dy;
        vec3Register.setVec3At(temp, index);
    }
}
