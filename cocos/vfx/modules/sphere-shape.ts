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
import { ccclass, serializable, tooltip } from 'cc.decorator';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Vec3 } from '../../core';
import { BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { AngleBasedShapeModule } from './angle-based-shape';
import { ParticleVec3ArrayParameter } from '../particle-parameter';

const temp = new Vec3();

@ccclass('cc.SphereShapeModule')
@ParticleModule.register('SphereShape', ModuleExecStage.SPAWN, [BuiltinParticleParameterName.START_DIR])
export class SphereShapeModule extends AngleBasedShapeModule {
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

    private _innerRadius = 0;

    public tick (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        super.tick(particles, params, context);
        this._innerRadius = (1 - this.radiusThickness) ** 3;
    }

    protected generatePosAndDir (index: number, angle: number, startDir: ParticleVec3ArrayParameter, vec3Register: ParticleVec3ArrayParameter) {
        const innerRadius = this._innerRadius;
        const radius = this.radius;
        const rand = this._rand;
        const z = rand.getFloatFromRange(-1, 1);
        const r = Math.sqrt(1 - z * z);
        temp.x = r * Math.cos(angle);
        temp.y = r * Math.sin(angle);
        temp.z = z;
        startDir.setVec3At(temp, index);
        Vec3.multiplyScalar(temp, temp, rand.getFloatFromRange(innerRadius, 1.0) ** 0.3333 * radius);
        vec3Register.setVec3At(temp, index);
    }
}
