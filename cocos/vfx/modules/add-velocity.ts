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

import { ccclass, tooltip, range, type, serializable } from 'cc.decorator';
import { Enum, lerp, Vec3 } from '../../core';
import { Space } from '../enum';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../particle-base';
import { FloatExpression } from '../expression/float-expression';
import { RandomStream } from '../random-stream';

const tempVelocity = new Vec3();
const seed = new Vec3();
const requiredParameter = BuiltinParticleParameterFlags.VELOCITY | BuiltinParticleParameterFlags.POSITION;

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
    @type(FloatExpression)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:velocityOvertimeModule.x')
    public x = new FloatExpression();

    /**
     * @zh Y 轴方向上的速度分量。
     */
    @type(FloatExpression)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:velocityOvertimeModule.y')
    public y = new FloatExpression();

    /**
     * @zh Z 轴方向上的速度分量。
     */
    @type(FloatExpression)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:velocityOvertimeModule.z')
    public z = new FloatExpression();

    private _randomOffset = 0;

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._randomOffset = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (this.x.mode === FloatExpression.Mode.TWO_CONSTANTS || this.x.mode === FloatExpression.Mode.TWO_CURVES) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
        if (this.x.mode === FloatExpression.Mode.TWO_CURVES || this.x.mode === FloatExpression.Mode.CURVE) {
            if (context.executionStage !== ModuleExecStage.SPAWN) {
                context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME);
            } else {
                context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
            }
        }
        context.markRequiredBuiltinParameters(requiredParameter);
        if (context.executionStage !== ModuleExecStage.UPDATE) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.BASE_VELOCITY);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const needTransform = this.space !== params.simulationSpace;
        const randomOffset = this._randomOffset;
        const velocity = context.executionStage === ModuleExecStage.UPDATE ? particles.velocity : particles.baseVelocity;
        const { fromIndex, toIndex, rotationIfNeedTransform } = context;
        if (needTransform) {
            if (this.x.mode === FloatExpression.Mode.CONSTANT) {
                tempVelocity.set(this.x.constant, this.y.constant, this.z.constant);
                Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.CURVE) {
                const time = context.executionStage !== ModuleExecStage.SPAWN
                    ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = time[i];
                    Vec3.set(tempVelocity,
                        xCurve.evaluate(normalizedTime) * xMultiplier,
                        yCurve.evaluate(normalizedTime) * yMultiplier,
                        zCurve.evaluate(normalizedTime) * zMultiplier);
                    Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const randomSeed = particles.randomSeed.data;
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                    Vec3.set(tempVelocity,
                        lerp(xMin, xMax, ratio.x),
                        lerp(yMin, yMax, ratio.y),
                        lerp(zMin, zMax, ratio.z));
                    Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                const randomSeed = particles.randomSeed.data;
                const time = context.executionStage !== ModuleExecStage.SPAWN
                    ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                    const normalizedTime = time[i];
                    Vec3.set(tempVelocity,
                        lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), ratio.x) * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), ratio.y) * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), ratio.z) * zMultiplier);
                    Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                    velocity.addVec3At(tempVelocity, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.x.mode === FloatExpression.Mode.CONSTANT) {
                Vec3.set(tempVelocity, this.x.constant, this.y.constant, this.z.constant);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.CURVE) {
                const time = context.executionStage !== ModuleExecStage.SPAWN
                    ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = time[i];
                    Vec3.set(tempVelocity,
                        xCurve.evaluate(normalizedTime) * xMultiplier,
                        yCurve.evaluate(normalizedTime) * yMultiplier,
                        zCurve.evaluate(normalizedTime) * zMultiplier);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const randomSeed = particles.randomSeed.data;
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                    Vec3.set(tempVelocity,
                        lerp(xMin, xMax, ratio.x),
                        lerp(yMin, yMax, ratio.y),
                        lerp(zMin, zMax, ratio.z));
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                const randomSeed = particles.randomSeed.data;
                const time = context.executionStage !== ModuleExecStage.SPAWN
                    ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                    const normalizedTime = time[i];
                    Vec3.set(tempVelocity,
                        lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), ratio.x) * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), ratio.y) * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), ratio.z) * zMultiplier);
                    velocity.addVec3At(tempVelocity, i);
                }
            }
        }
    }
}
