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
import { lerp, Mat4, pseudoRandom, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { calculateTransform } from '../particle-general-function';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';
import { CurveRange } from '../curve-range';

const VELOCITY_X_OVERTIME_RAND_OFFSET = 197866;
const VELOCITY_Y_OVERTIME_RAND_OFFSET = 156497;
const VELOCITY_Z_OVERTIME_RAND_OFFSET = 984136;

const _temp_v3 = new Vec3();

@ccclass('cc.VelocityOverLifetimeModule')
export class VelocityOverLifetimeModule extends ParticleModule {
    /**
     * @zh X 轴方向上的速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(2)
    @tooltip('i18n:velocityOvertimeModule.x')
    public x = new CurveRange();

    /**
     * @zh Y 轴方向上的速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(3)
    @tooltip('i18n:velocityOvertimeModule.y')
    public y = new CurveRange();

    /**
     * @zh Z 轴方向上的速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(4)
    @tooltip('i18n:velocityOvertimeModule.z')
    public z = new CurveRange();

    /**
     * @zh 速度计算时采用的坐标系[[Space]]。
     */
    @type(Enum(Space))
    @serializable
    @displayOrder(1)
    @tooltip('i18n:velocityOvertimeModule.space')
    public space = Space.LOCAL;

    public get name (): string {
        return 'VelocityModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.PRE_UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    private rotation: Quat;

    constructor () {
        super();
        this.rotation = new Quat();
    }

    public update (particles: ParticleSOAData, context: ParticleUpdateContext) {
        const needTransform = calculateTransform(context.simulationSpace, this.space, context.worldTransform, this.rotation);
        const { count, normalizedAliveTime, randomSeed } = particles;
        const rotation = this.rotation;
        const velocity = new Vec3();
        if (needTransform) {
            if (this.x.mode === CurveRange.Mode.Constant) {
                velocity.set(this.x.constant, this.y.constant, this.z.constant);
                Vec3.transformQuat(velocity, velocity, rotation);
                for (let i = 0; i < count; i++) {
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = 0; i < count; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    velocity.set(xCurve.evaluate(normalizedTime) * xMultiplier,
                        yCurve.evaluate(normalizedTime) * yMultiplier,
                        zCurve.evaluate(normalizedTime) * zMultiplier);
                    Vec3.transformQuat(velocity, velocity, rotation);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = 0; i < count; i++) {
                    const seed = randomSeed[i];
                    velocity.set(lerp(xMin, xMax, pseudoRandom(seed + VELOCITY_X_OVERTIME_RAND_OFFSET)),
                        lerp(yMin, yMax, pseudoRandom(seed + VELOCITY_Y_OVERTIME_RAND_OFFSET)),
                        lerp(zMin, zMax, pseudoRandom(seed + VELOCITY_Z_OVERTIME_RAND_OFFSET)));
                    Vec3.transformQuat(velocity, velocity, rotation);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = 0; i < count; i++) {
                    const seed = randomSeed[i];
                    const normalizedTime = normalizedAliveTime[i];
                    velocity.set(lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), pseudoRandom(seed + VELOCITY_X_OVERTIME_RAND_OFFSET)) * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), pseudoRandom(seed + VELOCITY_Y_OVERTIME_RAND_OFFSET)) * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), pseudoRandom(seed + VELOCITY_Z_OVERTIME_RAND_OFFSET)) * zMultiplier);
                    Vec3.transformQuat(velocity, velocity, rotation);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.x.mode === CurveRange.Mode.Constant) {
                velocity.set(this.x.constant, this.y.constant, this.z.constant);
                for (let i = 0; i < count; i++) {
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = 0; i < count; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    velocity.set(xCurve.evaluate(normalizedTime) * xMultiplier,
                        yCurve.evaluate(normalizedTime) * yMultiplier,
                        zCurve.evaluate(normalizedTime) * zMultiplier);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = 0; i < count; i++) {
                    const seed = randomSeed[i];
                    velocity.set(lerp(xMin, xMax, pseudoRandom(seed + VELOCITY_X_OVERTIME_RAND_OFFSET)),
                        lerp(yMin, yMax, pseudoRandom(seed + VELOCITY_Y_OVERTIME_RAND_OFFSET)),
                        lerp(zMin, zMax, pseudoRandom(seed + VELOCITY_Z_OVERTIME_RAND_OFFSET)));
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = 0; i < count; i++) {
                    const seed = randomSeed[i];
                    const normalizedTime = normalizedAliveTime[i];
                    velocity.set(lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), pseudoRandom(seed + VELOCITY_X_OVERTIME_RAND_OFFSET)) * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), pseudoRandom(seed + VELOCITY_Y_OVERTIME_RAND_OFFSET)) * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), pseudoRandom(seed + VELOCITY_Z_OVERTIME_RAND_OFFSET)) * zMultiplier);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            }
        }
    }
}
