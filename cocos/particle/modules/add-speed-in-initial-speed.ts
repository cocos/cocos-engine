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

import { ccclass, displayOrder, range, serializable, tooltip, type } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from '../particle-base';
import { CurveRange } from '../curve-range';
import { lerp, Mat4, Vec3 } from '../../core/math';
import { RandNumGen } from '../rand-num-gen';

const tempVelocity = new Vec3();

@ccclass('cc.AddSpeedInInitialDirectionModule')
@ParticleModule.register('AddSpeedInInitialDirection', ModuleExecStage.SPAWN, ['Shape'])
export class AddSpeedInInitialDirectionModule extends ParticleModule {
    /**
      * @zh 粒子初始速度。
      */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:particle_system.startSpeed')
    public startSpeed = new CurveRange(5);

    private _rand = new RandNumGen();

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._rand.seed = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.POSITION);
        context.markRequiredParameter(BuiltinParticleParameter.VELOCITY);
        context.markRequiredParameter(BuiltinParticleParameter.BASE_VELOCITY);
        context.markRequiredParameter(BuiltinParticleParameter.START_DIR);
        if (this.startSpeed.mode === CurveRange.Mode.Curve || this.startSpeed.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex, emitterNormalizedTime: normalizedT, emitterNormalizedPrevTime: normalizedPrevT } = context;
        const { startDir, baseVelocity } = particles;
        const mode = this.startSpeed.mode;
        const rand = this._rand;
        if (mode === CurveRange.Mode.Constant) {
            const constant = this.startSpeed.constant;
            for (let i = fromIndex; i < toIndex; ++i) {
                const curveStartSpeed = constant;
                startDir.getVec3At(tempVelocity, i);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, curveStartSpeed);
                baseVelocity.setVec3At(tempVelocity, i);
            }
        } else if (mode ===  CurveRange.Mode.TwoConstants) {
            const { constantMin, constantMax } = this.startSpeed;
            for (let i = fromIndex; i < toIndex; ++i) {
                const curveStartSpeed = lerp(constantMin, constantMax, rand.getFloat());
                startDir.getVec3At(tempVelocity, i);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, curveStartSpeed);
                baseVelocity.setVec3At(tempVelocity, i);
            }
        } else if (mode ===  CurveRange.Mode.Curve) {
            const { spline, multiplier } = this.startSpeed;
            const spawnTime = particles.spawnTimeRatio.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                const curveStartSpeed = spline.evaluate(lerp(normalizedT, normalizedPrevT, spawnTime[i])) * multiplier;
                startDir.getVec3At(tempVelocity, i);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, curveStartSpeed);
                baseVelocity.setVec3At(tempVelocity, i);
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.startSpeed;
            const spawnTime = particles.spawnTimeRatio.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                const curveStartSpeed = lerp(splineMin.evaluate(time), splineMax.evaluate(time), rand.getFloat()) * multiplier;
                startDir.getVec3At(tempVelocity, i);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, curveStartSpeed);
                baseVelocity.setVec3At(tempVelocity, i);
            }
        }
    }
}
