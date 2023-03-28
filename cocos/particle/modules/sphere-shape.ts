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
import { DistributionMode, ShapeModule } from './shape';
import { ccclass, displayOrder, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Enum, lerp, toDegree, toRadian, Vec3 } from '../../core';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../particle-base';
import { CurveRange } from '../curve-range';
import { RandNumGen } from '../rand-num-gen';

const temp = new Vec3();

@ccclass('cc.SphereShapeModule')
@ParticleModule.register('SphereShape', ModuleExecStage.SPAWN)
export class SphereShapeModule extends ShapeModule {
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
    @type(Enum(DistributionMode))
    @serializable
    @tooltip('i18n:shapeModule.arcMode')
    public distributionMode = DistributionMode.RANDOM;

    /**
       * @zh 控制可能产生粒子的弧周围的离散间隔。
       */
    @serializable
    @tooltip('i18n:shapeModule.arcSpread')
    public spread = 0;

    /**
       * @zh 粒子沿圆周发射的速度。
       */
    @type(CurveRange)
    @range([0, 1])
    @serializable
    @tooltip('i18n:shapeModule.arcSpeed')
    @visible(function (this: SphereShapeModule) {
        return this.distributionMode !== DistributionMode.RANDOM;
    })
    public speed = new CurveRange();

    @serializable
    private _arc = toRadian(360);
    private _invArc = 0;
    private _innerRadius = 0;
    private _rand = new RandNumGen();
    private _arcRounded = 0;
    private _spreadStep = 0;
    private _arcTimer = 0;
    private _arcTimePrev = 0;

    public onPlay (params: ParticleEmitterParams, states: ParticleEmitterState) {
        this._rand.seed = states.rand.getUInt32();
        this._arcTimer = 0;
        this._arcTimePrev = 0;
    }

    public tick (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        super.tick(particles, params, context);
        context.markRequiredParameter(BuiltinParticleParameter.FLOAT_REGISTER);
        if (this.distributionMode === DistributionMode.LOOP || this.distributionMode === DistributionMode.PING_PONG) {
            context.markRequiredParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
        }
        this._arcTimePrev = this._arcTimer;
        this._arcTimer += (this.speed.evaluate(context.emitterNormalizedTime, 1) * context.emitterDeltaTime) * Math.PI * 2;
        this._invArc = 1 / this._arc;
        this._innerRadius = (1 - this.radiusThickness) ** 3;
        this._spreadStep = this._arc * this.spread;
        this._arcRounded = Math.ceil(this._arc / this._spreadStep) * this._spreadStep;
    }

    public execute (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex } = context;
        const { startDir, vec3Register } = particles;
        const floatRegister = particles.floatRegister.data;
        const rand = this._rand;
        const innerRadius = this._innerRadius;
        const arcRounded = this._arcRounded;
        const spreadStep = this._spreadStep;
        const arcTimer = this._arcTimer;
        const arcTimePrev = this._arcTimePrev;
        const arc = this._arc;
        const invArc = this._invArc;
        if (this.distributionMode === DistributionMode.RANDOM) {
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    floatRegister[i] = arc * rand.getFloat();
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    floatRegister[i] = Math.floor((arcRounded * rand.getFloat()) / spreadStep) * spreadStep;
                }
            }
        } else if (this.distributionMode === DistributionMode.LOOP) {
            const spawnTimeRatio = particles.spawnTimeRatio.data;
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                    angle = Math.floor(angle / spreadStep) * spreadStep;
                    angle %= arc;
                    if (angle < 0) {
                        angle += arc;
                    }
                    floatRegister[i] = angle;
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                    angle %= arc;
                    if (angle < 0) {
                        angle += arc;
                    }
                    floatRegister[i] = angle;
                }
            }
        } else if (this.distributionMode === DistributionMode.PING_PONG) {
            const spawnTimeRatio = particles.spawnTimeRatio.data;
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                    angle = Math.floor(angle / spreadStep) * spreadStep;
                    angle *= invArc;
                    angle %= 2;
                    angle = Math.abs(angle);
                    if (angle >= 1.0) {
                        angle = 2 - angle;
                    }
                    floatRegister[i] = angle * arc;
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                    angle *= invArc;
                    angle %= 2;
                    angle = Math.abs(angle);
                    if (angle >= 1.0) {
                        angle = 2 - angle;
                    }
                    floatRegister[i] = angle * arc;
                }
            }
        } else if (this.distributionMode === DistributionMode.UNIFORM) {
            const invTotal = 1 / (toIndex - fromIndex);
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    let angle = i * invTotal * arc;
                    angle = Math.floor(angle / spreadStep) * spreadStep;
                    floatRegister[i] = angle;
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    floatRegister[i] = i * invTotal * arc;
                }
            }
        }

        for (let i = fromIndex; i < toIndex; ++i) {
            const angle = floatRegister[i];
            const z = rand.getFloatFromRange(-1, 1);
            const r = Math.sqrt(1 - z * z);
            temp.x = r * Math.cos(angle);
            temp.y = r * Math.sin(angle);
            temp.z = z;
            startDir.setVec3At(temp, i);
            Vec3.multiplyScalar(temp, temp, rand.getFloatFromRange(innerRadius, 1.0) ** 0.3333 * this.radius);
            vec3Register.setVec3At(temp, i);
        }
        super.execute(particles, params, context);
    }
}
