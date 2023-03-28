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
import { ArcMode, ShapeModule } from './shape';
import { ccclass, displayOrder, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Enum, toDegree, toRadian, Vec3 } from '../../core';
import { ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { CurveRange } from '../curve-range';

@ccclass('cc.HemisphereShapeModule')
@ParticleModule.register('HemisphereShape', ModuleExecStage.SPAWN)
export class HemisphereShapeModule extends ShapeModule {
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

    /**
     * @zh 粒子发射器在一个扇形范围内发射。
     */
    @displayOrder(6)
    @tooltip('i18n:shapeModule.arc')
    get arc () {
        return toDegree(this._arc);
    }

    set arc (val) {
        this._arc = toRadian(val);
    }

    /**
        * @zh 粒子在扇形范围内的发射方式 [[ArcMode]]。
        */
    @type(Enum(ArcMode))
    @serializable
    @tooltip('i18n:shapeModule.arcMode')
    public arcMode = ArcMode.RANDOM;

    /**
        * @zh 控制可能产生粒子的弧周围的离散间隔。
        */
    @serializable
    @tooltip('i18n:shapeModule.arcSpread')
    public arcSpread = 0;

    /**
        * @zh 粒子沿圆周发射的速度。
        */
    @type(CurveRange)
    @range([0, 1])
    @serializable
    @tooltip('i18n:shapeModule.arcSpeed')
    @visible(function (this: ShapeModule) {
        return this.arcMode !== ArcMode.RANDOM;
    })
    public arcSpeed = new CurveRange();

    @serializable
    private _arc = toRadian(360);

    public tick (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        super.tick(particles, params, context);
    }

    public execute () {
        case ShapeType.HEMISPHERE:
            for (let i = fromIndex; i < toIndex; ++i) {
                const z = randomRange(-1, 1);
                const a = randomRange(0, 2 * Math.PI);
                const r = Math.sqrt(1 - z * z);
                tmpPosition.x = r * Math.cos(a);
                tmpPosition.y = r * Math.sin(a);
                tmpPosition.z = z;
                tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                if (tmpPosition.z > 0) {
                    tmpPosition.z *= -1;
                }
                Vec3.normalize(tmpDir, tmpPosition);
                startDir.setVec3At(tmpDir, i);
                vec3Register.setVec3At(tmpPosition, i);
            }
            break;
        case ShapeType.HEMISPHERE_SHELL:
            for (let i = fromIndex; i < toIndex; ++i) {
                const z = randomRange(-1, 1);
                const a = randomRange(0, 2 * Math.PI);
                const r = Math.sqrt(1 - z * z);
                tmpPosition.x = r * Math.cos(a);
                tmpPosition.y = r * Math.sin(a);
                tmpPosition.z = z;
                tmpPosition.multiplyScalar(this.radius);
                if (tmpPosition.z > 0) {
                    tmpPosition.z *= -1;
                }
                Vec3.normalize(tmpDir, tmpPosition);
                startDir.setVec3At(tmpDir, i);
                vec3Register.setVec3At(tmpPosition, i);
            }
    }
}
