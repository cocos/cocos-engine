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
import { DistributionMode, MoveWarpMode, ShapeModule } from './shape';
import { ccclass, displayOrder, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Enum, lerp, toDegree, toRadian, Vec3 } from '../../core';
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../particle-base';
import { FloatExpression } from '../expression/float-expression';
import { RandomStream } from '../random-stream';
import { ParticleVec3ArrayParameter } from '../particle-parameter';

@ccclass('cc.AngleBasedShapeModule')
export abstract class AngleBasedShapeModule extends ShapeModule {
    /**
       * @zh 粒子发射器在一个扇形范围内发射。
       */
    @displayOrder(6)
    @tooltip('i18n:shapeModule.arc')
    public get arc () {
        return toDegree(this._arc);
    }

    public set arc (val) {
        this._arc = toRadian(val);
    }

    /**
      * @zh 粒子在扇形范围内的发射方式 [[ArcMode]]。
      */
    @type(Enum(DistributionMode))
    @serializable
    @tooltip('i18n:shapeModule.arcMode')
    public distributionMode = DistributionMode.RANDOM;

    @type(Enum(MoveWarpMode))
    @serializable
    @visible(function (this: AngleBasedShapeModule) {
        return this.distributionMode === DistributionMode.MOVE;
    })
    public moveWrapMode = MoveWarpMode.LOOP;

    /**
      * @zh 使用移动分布方式时的移动速度。
      */
    @type(FloatExpression)
    @range([0, 1])
    @serializable
    @tooltip('i18n:shapeModule.arcSpeed')
    @visible(function (this: AngleBasedShapeModule) {
        return this.distributionMode === DistributionMode.MOVE;
    })
    public moveSpeed = new FloatExpression();

    /**
      * @zh 控制可能产生粒子的弧周围的离散间隔。
      */
    @serializable
    @tooltip('i18n:shapeModule.arcSpread')
    public spread = 0;

    @serializable
    private _arc = toRadian(360);
    private _invArc = 0;
    private _arcRounded = 0;
    private _spreadStep = 0;
    private _arcTimer = 0;
    private _arcTimePrev = 0;

    public onPlay (params: ParticleEmitterParams, states: ParticleEmitterState) {
        super.onPlay(params, states);
        this._arcTimer = 0;
        this._arcTimePrev = 0;
    }

    public tick (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        super.tick(particles, params, context);
        if (this.distributionMode === DistributionMode.MOVE) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.SPAWN_TIME_RATIO);
        }
        this._arcTimePrev = this._arcTimer;
        let deltaTime = context.emitterDeltaTime;
        if (context.emitterNormalizedTime < context.emitterNormalizedPrevTime) {
            this._arcTimer += (this.moveSpeed.evaluate(1, 1) * (params.duration - context.emitterPreviousTime)) * Math.PI * 2;
            deltaTime = context.emitterCurrentTime;
        }
        this._arcTimer += (this.moveSpeed.evaluate(context.emitterNormalizedTime, 1) * deltaTime) * Math.PI * 2;
        this._invArc = 1 / this._arc;
        this._spreadStep = this._arc * this.spread;
        this._arcRounded = Math.ceil(this._arc / this._spreadStep) * this._spreadStep;
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex } = context;
        const rand = this._rand;
        const arcRounded = this._arcRounded;
        const spreadStep = this._spreadStep;
        const arcTimer = this._arcTimer;
        const arcTimePrev = this._arcTimePrev;
        const arc = this._arc;
        const invArc = this._invArc;
        const { startDir, vec3Register } = particles;
        if (this.distributionMode === DistributionMode.RANDOM) {
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    this.generatePosAndDir(i, arc * rand.getFloat(), startDir, vec3Register);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    this.generatePosAndDir(i, Math.floor((arcRounded * rand.getFloat()) / spreadStep) * spreadStep, startDir, vec3Register);
                }
            }
        } else if (this.distributionMode === DistributionMode.MOVE) {
            if (this.moveWrapMode === MoveWarpMode.LOOP) {
                const spawnTimeRatio = particles.spawnTimeRatio.data;
                if (this.spread > 0) {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                        angle = Math.floor(angle / spreadStep) * spreadStep;
                        angle %= arc;
                        if (angle < 0) {
                            angle += arc;
                        }
                        this.generatePosAndDir(i, angle, startDir, vec3Register);
                    }
                } else {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                        angle %= arc;
                        if (angle < 0) {
                            angle += arc;
                        }
                        this.generatePosAndDir(i, angle, startDir, vec3Register);
                    }
                }
            } else {
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
                        this.generatePosAndDir(i, angle * arc, startDir, vec3Register);
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
                        this.generatePosAndDir(i, angle * arc, startDir, vec3Register);
                    }
                }
            }
        } else {
            const invTotal = 1 / (toIndex - fromIndex);
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    let angle = i * invTotal * arc;
                    angle = Math.floor(angle / spreadStep) * spreadStep;
                    this.generatePosAndDir(i, angle, startDir, vec3Register);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    this.generatePosAndDir(i, i * invTotal * arc, startDir, vec3Register);
                }
            }
        }
        super.execute(particles, params, context);
    }

    protected abstract generatePosAndDir (index: number, angle: number, startDir: ParticleVec3ArrayParameter, vec3Register: ParticleVec3ArrayParameter);
}
