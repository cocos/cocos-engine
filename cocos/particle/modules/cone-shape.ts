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

@ccclass('cc.ConeShapeModule')
@ParticleModule.register('ConeShape', ModuleExecStage.SPAWN)
export class ConeShapeModule extends ShapeModule {
    /**
     * @zh 圆锥的轴与母线的夹角<bg>。
     * 决定圆锥发射器的开合程度。
     */
    @tooltip('i18n:shapeModule.angle')
    get angle () {
        return Math.round(toDegree(this._angle) * 100) / 100;
    }

    set angle (val) {
        this._angle = toRadian(val);
    }

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

    @serializable
    private _angle = toRadian(25);
    @serializable
    private _arc = toRadian(360);

    public tick (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        super.tick(particles, params, context);
    }

    public execute () {
        case ShapeType.CONE:
            if (this.arcMode === ArcMode.RANDOM) {
                const radiusThickness = this.radius - minRadius;
                const angleSin = Math.sin(this._angle);
                for (let i = fromIndex; i < toIndex; ++i) {
                    const theta = randomRange(0, this._arc);
                    Vec3.set(tmpPosition, Math.cos(theta), Math.sin(theta), 0);
                    Vec3.multiplyScalar(tmpPosition, tmpPosition, minRadius + radiusThickness * random());
                    Vec2.multiplyScalar(tmpDir, tmpPosition, angleSin);
                    tmpDir.z = velocityZ;
                    Vec3.normalize(tmpDir, tmpDir);
                    Vec3.scaleAndAdd(tmpPosition, tmpPosition, tmpDir, this.length * random() / -velocityZ);
                    startDir.setVec3At(tmpDir, i);
                    vec3Register.setVec3At(tmpPosition, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    tmpPosition.set(Math.cos(angle), Math.sin(angle), 0);
                    tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = velocityZ;
                    tmpDir.normalize();
                    Vec3.scaleAndAdd(tmpPosition, tmpPosition, tmpDir, this.length * random() / -velocityZ);
                    startDir.setVec3At(tmpDir, i);
                    vec3Register.setVec3At(tmpPosition, i);
                }
            }
            break;
        case ShapeType.CONE_BASE:
            if (this.arcMode === ArcMode.RANDOM) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const theta = randomRange(0, this._arc);
                    tmpPosition.set(Math.cos(theta), Math.sin(theta), 0);
                    tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = velocityZ;
                    Vec3.normalize(tmpDir, tmpDir);
                    startDir.setVec3At(tmpDir, i);
                    vec3Register.setVec3At(tmpPosition, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    tmpPosition.set(Math.cos(angle), Math.sin(angle), 0);
                    tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = velocityZ;
                    tmpDir.normalize();
                    startDir.setVec3At(tmpDir, i);
                    vec3Register.setVec3At(tmpPosition, i);
                }
            }
            break;
        case ShapeType.CONE_SHELL:
            if (this.arcMode === ArcMode.RANDOM) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const theta = randomRange(0, this._arc);
                    tmpPosition.set(Math.cos(theta), Math.sin(theta), 0);
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = -Math.cos(this._angle);
                    tmpDir.normalize();
                    Vec2.multiplyScalar(tmpPosition, tmpPosition, this.radius);
                    startDir.setVec3At(tmpDir, i);
                    vec3Register.setVec3At(tmpPosition, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    tmpPosition.set(Math.cos(angle), Math.sin(angle), 0);
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = -Math.cos(this._angle);
                    tmpDir.normalize();
                    Vec2.multiplyScalar(tmpPosition, tmpPosition, this.radius);
                    startDir.setVec3At(tmpDir, i);
                    vec3Register.setVec3At(tmpPosition, i);
                }
            }
            break;
    }
}
