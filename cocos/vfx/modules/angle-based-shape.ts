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
import { ccclass, displayOrder, range, serializable, tooltip, type, visible } from 'cc.decorator';
import { DistributionMode, MoveWarpMode, ShapeModule } from './shape';
import { Enum, lerp, toDegree, toRadian } from '../../core';
import { BuiltinParticleParameterFlags, ParticleDataSet, SPAWN_TIME_RATIO } from '../particle-data-set';
import { VFXEmitterParams, VFXEmitterState, ModuleExecContext } from '../base';
import { FloatExpression } from '../expressions/float';
import { Vec3ArrayParameter } from '../vfx-parameter';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression } from '../expressions';

@ccclass('cc.AngleBasedShapeModule')
export abstract class AngleBasedShapeModule extends ShapeModule {
    /**
       * @zh 粒子发射器在一个扇形范围内发射。
       */
    @displayOrder(6)
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
    @visible(function (this: AngleBasedShapeModule) {
        return this.distributionMode === DistributionMode.MOVE;
    })
    public moveSpeed: FloatExpression = new ConstantFloatExpression();

    /**
      * @zh 控制可能产生粒子的弧周围的离散间隔。
      */
    @serializable
    public spread = 0;

    @serializable
    private _arc = toRadian(360);
    private _invArc = 0;
    private _arcRounded = 0;
    private _spreadStep = 0;
    private _arcTimer = 0;
    private _arcTimePrev = 0;

    public onPlay (states: VFXEmitterState) {
        super.onPlay(states);
        this._arcTimer = 0;
        this._arcTimePrev = 0;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        if (this.distributionMode === DistributionMode.MOVE) {
            particles.markRequiredParameter(SPAWN_TIME_RATIO);
        }
        this._arcTimePrev = this._arcTimer;
        let deltaTime = emitter.deltaTime;
        if (emitter.normalizedLoopAge < emitter.normalizedPrevLoopAge) {
            this._arcTimer += (this.moveSpeed.evaluateSingle(1, 1) * (emitter.currentDuration - emitter.prevLoopAge)) * Math.PI * 2;
            deltaTime = emitter.loopAge;
        }
        this._arcTimer += (this.moveSpeed.evaluateSingle(emitter.normalizedLoopAge, 1) * deltaTime) * Math.PI * 2;
        this._invArc = 1 / this._arc;
        this._spreadStep = this._arc * this.spread;
        this._arcRounded = Math.ceil(this._arc / this._spreadStep) * this._spreadStep;
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const rand = this._rand;
        const arcRounded = this._arcRounded;
        const spreadStep = this._spreadStep;
        const arcTimer = this._arcTimer;
        const arcTimePrev = this._arcTimePrev;
        const arc = this._arc;
        const invArc = this._invArc;
        const { initialDir, vec3Register } = particles;
        if (this.distributionMode === DistributionMode.RANDOM) {
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    this.generatePosAndDir(i, arc * rand.getFloat(), initialDir, vec3Register);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    this.generatePosAndDir(i, Math.floor((arcRounded * rand.getFloat()) / spreadStep) * spreadStep, initialDir, vec3Register);
                }
            }
        } else if (this.distributionMode === DistributionMode.MOVE) {
            if (this.moveWrapMode === MoveWarpMode.LOOP) {
                const spawnTimeRatio = particles.getFloatParameter(SPAWN_TIME_RATIO).data;
                if (this.spread > 0) {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                        angle = Math.floor(angle / spreadStep) * spreadStep;
                        angle %= arc;
                        if (angle < 0) {
                            angle += arc;
                        }
                        this.generatePosAndDir(i, angle, initialDir, vec3Register);
                    }
                } else {
                    for (let i = fromIndex; i < toIndex; ++i) {
                        let angle = lerp(arcTimer, arcTimePrev, spawnTimeRatio[i]);
                        angle %= arc;
                        if (angle < 0) {
                            angle += arc;
                        }
                        this.generatePosAndDir(i, angle, initialDir, vec3Register);
                    }
                }
            } else {
                const spawnTimeRatio = particles.getFloatParameter(SPAWN_TIME_RATIO).data;
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
                        this.generatePosAndDir(i, angle * arc, initialDir, vec3Register);
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
                        this.generatePosAndDir(i, angle * arc, initialDir, vec3Register);
                    }
                }
            }
        } else {
            const invTotal = 1 / (toIndex - fromIndex);
            if (this.spread > 0) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    let angle = i * invTotal * arc;
                    angle = Math.floor(angle / spreadStep) * spreadStep;
                    this.generatePosAndDir(i, angle, initialDir, vec3Register);
                }
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    this.generatePosAndDir(i, i * invTotal * arc, initialDir, vec3Register);
                }
            }
        }
        super.execute(particles, emitter, user, context);
    }

    protected abstract generatePosAndDir (index: number, angle: number, initialDir: Vec3ArrayParameter, vec3Register: Vec3ArrayParameter);
}
