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

import { ccclass, tooltip, displayOrder, range, type, serializable } from 'cc.decorator';
import { Enum } from '../../core';
import { lerp, Mat4, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { CurveRange } from '../curve-range';
import { RandNumGen } from '../rand-num-gen';

const VELOCITY_RAND_OFFSET = 197866;
const tempVelocity = new Vec3();
const seed = new Vec3();

@ccclass('cc.AddVelocityModule')
@ParticleModule.register('AddVelocity', ModuleExecStage.UPDATE | ModuleExecStage.SPAWN, [BuiltinParticleParameterName.VELOCITY])
export class AddVelocityModule extends ParticleModule {
    /**
     * @zh 速度计算时采用的坐标系[[Space]]。
     */
    @type(Enum(Space))
    @serializable
    @tooltip('i18n:velocityOvertimeModule.space')
    public space = Space.LOCAL;
    /**
     * @zh X 轴方向上的速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:velocityOvertimeModule.x')
    public x = new CurveRange();

    /**
     * @zh Y 轴方向上的速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:velocityOvertimeModule.y')
    public y = new CurveRange();

    /**
     * @zh Z 轴方向上的速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:velocityOvertimeModule.z')
    public z = new CurveRange();

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (this.x.mode === CurveRange.Mode.TwoConstants || this.x.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
        }
        if (this.x.mode === CurveRange.Mode.TwoCurves || this.x.mode === CurveRange.Mode.Curve) {
            if (context.executionStage !== ModuleExecStage.SPAWN) {
                context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
            } else {
                context.markRequiredParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
            }
        }
        context.markRequiredParameter(BuiltinParticleParameter.POSITION);
        if (context.executionStage === ModuleExecStage.UPDATE) {
            context.markRequiredParameter(BuiltinParticleParameter.VELOCITY);
        } else {
            context.markRequiredParameter(BuiltinParticleParameter.BASE_VELOCITY);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const needTransform = this.space !== params.simulationSpace;
        const velocity = context.executionStage === ModuleExecStage.UPDATE ? particles.velocity : particles.baseVelocity;
        const { fromIndex, toIndex, rotationIfNeedTransform } = context;
        if (needTransform) {
            if (this.x.mode === CurveRange.Mode.Constant) {
                tempVelocity.set(this.x.constant, this.y.constant, this.z.constant);
                Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const time = context.executionStage !== ModuleExecStage.SPAWN ? particles.normalizedAliveTime.data : particles.spawnTimeRatio.data;
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = time[i];
                    tempVelocity.set(xCurve.evaluate(normalizedTime) * xMultiplier,
                        yCurve.evaluate(normalizedTime) * yMultiplier,
                        zCurve.evaluate(normalizedTime) * zMultiplier);
                    Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const randomSeed = particles.randomSeed.data;
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandNumGen.get3Float(randomSeed[i] + VELOCITY_RAND_OFFSET, seed);
                    tempVelocity.set(lerp(xMin, xMax, ratio.x),
                        lerp(yMin, yMax, ratio.y),
                        lerp(zMin, zMax, ratio.z));
                    Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                const randomSeed = particles.randomSeed.data;
                const time = context.executionStage !== ModuleExecStage.SPAWN ? particles.normalizedAliveTime.data : particles.spawnTimeRatio.data;
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandNumGen.get3Float(randomSeed[i] + VELOCITY_RAND_OFFSET, seed);
                    const normalizedTime = time[i];
                    tempVelocity.set(lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), ratio.x) * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), ratio.y) * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), ratio.z) * zMultiplier);
                    Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                    velocity.addVec3At(tempVelocity, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.x.mode === CurveRange.Mode.Constant) {
                tempVelocity.set(this.x.constant, this.y.constant, this.z.constant);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const time = context.executionStage !== ModuleExecStage.SPAWN ? particles.normalizedAliveTime.data : particles.spawnTimeRatio.data;
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = time[i];
                    tempVelocity.set(xCurve.evaluate(normalizedTime) * xMultiplier,
                        yCurve.evaluate(normalizedTime) * yMultiplier,
                        zCurve.evaluate(normalizedTime) * zMultiplier);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const randomSeed = particles.randomSeed.data;
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandNumGen.get3Float(randomSeed[i] + VELOCITY_RAND_OFFSET, seed);
                    tempVelocity.set(lerp(xMin, xMax, ratio.x),
                        lerp(yMin, yMax, ratio.y),
                        lerp(zMin, zMax, ratio.z));
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                const randomSeed = particles.randomSeed.data;
                const time = context.executionStage !== ModuleExecStage.SPAWN ? particles.normalizedAliveTime.data : particles.spawnTimeRatio.data;
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandNumGen.get3Float(randomSeed[i] + VELOCITY_RAND_OFFSET, seed);
                    const normalizedTime = time[i];
                    tempVelocity.set(lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), ratio.x) * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), ratio.y) * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), ratio.z) * zMultiplier);
                    velocity.addVec3At(tempVelocity, i);
                }
            }
        }
    }
}
