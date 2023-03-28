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

import { ccclass, tooltip, displayOrder, range, type, serializable, visible } from 'cc.decorator';
import { Enum } from '../../core';
import { lerp, Mat4, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { calculateTransform } from '../particle-general-function';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { CurveRange } from '../curve-range';
import { RandNumGen } from '../rand-num-gen';

const VELOCITY_X_OVERTIME_RAND_OFFSET = 197866;
const VELOCITY_Y_OVERTIME_RAND_OFFSET = 156497;
const VELOCITY_Z_OVERTIME_RAND_OFFSET = 984136;

const tempVelocity = new Vec3();
@ccclass('cc.InheritVelocityModule')
@ParticleModule.register('InheritVelocity', ModuleExecStage.UPDATE | ModuleExecStage.SPAWN, [], ['Solve', 'State'])
export class InheritVelocityModule extends ParticleModule {
    @type(CurveRange)
    @visible(true)
    @serializable
    public scale = new CurveRange();

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (this.scale.mode === CurveRange.Mode.TwoConstants || this.scale.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
        }
        if (this.scale.mode === CurveRange.Mode.TwoCurves || this.scale.mode === CurveRange.Mode.Curve) {
            context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
        }
        context.markRequiredParameter(BuiltinParticleParameter.POSITION);
        context.markRequiredParameter(BuiltinParticleParameter.VELOCITY);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const needTransform = this.space !== params.simulationSpace;
        const { velocity } = particles;
        const { fromIndex, toIndex, rotationIfNeedTransform } = context;
        if (needTransform) {
            if (this.x.mode === CurveRange.Mode.Constant) {
                tempVelocity.set(this.x.constant, this.y.constant, this.z.constant);
                Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
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
                    const seed = randomSeed[i];
                    tempVelocity.set(lerp(xMin, xMax, RandNumGen.getFloat(seed + VELOCITY_X_OVERTIME_RAND_OFFSET)),
                        lerp(yMin, yMax, RandNumGen.getFloat(seed + VELOCITY_Y_OVERTIME_RAND_OFFSET)),
                        lerp(zMin, zMax, RandNumGen.getFloat(seed + VELOCITY_Z_OVERTIME_RAND_OFFSET)));
                    Vec3.transformQuat(tempVelocity, tempVelocity, rotationIfNeedTransform);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                const randomSeed = particles.randomSeed.data;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i];
                    const normalizedTime = normalizedAliveTime[i];
                    tempVelocity.set(lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), RandNumGen.getFloat(seed + VELOCITY_X_OVERTIME_RAND_OFFSET)) * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), RandNumGen.getFloat(seed + VELOCITY_Y_OVERTIME_RAND_OFFSET)) * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), RandNumGen.getFloat(seed + VELOCITY_Z_OVERTIME_RAND_OFFSET)) * zMultiplier);
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
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
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
                    const seed = randomSeed[i];
                    tempVelocity.set(lerp(xMin, xMax, RandNumGen.getFloat(seed + VELOCITY_X_OVERTIME_RAND_OFFSET)),
                        lerp(yMin, yMax, RandNumGen.getFloat(seed + VELOCITY_Y_OVERTIME_RAND_OFFSET)),
                        lerp(zMin, zMax, RandNumGen.getFloat(seed + VELOCITY_Z_OVERTIME_RAND_OFFSET)));
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                const randomSeed = particles.randomSeed.data;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i];
                    const normalizedTime = normalizedAliveTime[i];
                    tempVelocity.set(lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), RandNumGen.getFloat(seed + VELOCITY_X_OVERTIME_RAND_OFFSET)) * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), RandNumGen.getFloat(seed + VELOCITY_Y_OVERTIME_RAND_OFFSET)) * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), RandNumGen.getFloat(seed + VELOCITY_Z_OVERTIME_RAND_OFFSET)) * zMultiplier);
                    velocity.addVec3At(tempVelocity, i);
                }
            }
        }
    }
}
