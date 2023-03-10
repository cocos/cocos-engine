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
import { DEBUG } from 'internal:constants';
import { lerp, pseudoRandom, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';
import { calculateTransform } from '../particle-general-function';
import { CurveRange } from '../curve-range';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { assert, Enum } from '../../core';
import { ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';
import { ParticleSOAData } from '../particle-soa-data';

const FORCE_OVER_LIFETIME_RAND_OFFSET = 212165;

const _temp_v3 = new Vec3();
const rotation = new Quat();

@ccclass('cc.ForceOverLifetimeModule')
export class ForceOverLifetimeModule extends ParticleModule {
    /**
     * @zh X 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(2)
    @tooltip('i18n:forceOvertimeModule.x')
    public x = new CurveRange();

    /**
     * @zh Y 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(3)
    @tooltip('i18n:forceOvertimeModule.y')
    public y = new CurveRange();

    /**
     * @zh Z 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(4)
    @tooltip('i18n:forceOvertimeModule.z')
    public z = new CurveRange();

    /**
     * @zh 加速度计算时采用的坐标系 [[Space]]。
     */
    @type(Enum(Space))
    @serializable
    @displayOrder(1)
    @tooltip('i18n:forceOvertimeModule.space')
    public space = Space.LOCAL;

    public get name (): string {
        return 'ForceModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.UPDATE;
    }

    public get updatePriority (): number {
        return 4;
    }

    // TODO:currently not supported
    public randomized = false;

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, dt: number) {
        const needTransform = calculateTransform(params.simulationSpace, this.space, context.localToWorld, context.worldToLocal, rotation);
        const { normalizedAliveTime, randomSeed } = particles;
        if (DEBUG) {
            assert(this.x.mode === this.y.mode && this.y.mode === this.z.mode, 'The curve of x, y, z must have same mode!');
        }
        if (needTransform) {
            if (this.x.mode === CurveRange.Mode.Constant) {
                const force = Vec3.set(_temp_v3,
                    this.x.constant,
                    this.y.constant,
                    this.z.constant);
                Vec3.transformQuat(force, force, rotation);
                Vec3.multiplyScalar(force, force, dt);
                for (let i = fromIndex; i < toIndex; i++) {
                    particles.addVelocityAt(force, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    const force = Vec3.set(_temp_v3,
                        xCurve.evaluate(normalizedTime) * xMultiplier,
                        yCurve.evaluate(normalizedTime) * yMultiplier,
                        zCurve.evaluate(normalizedTime) * zMultiplier);
                    Vec3.transformQuat(force, force, rotation);
                    Vec3.multiplyScalar(force, force, dt);
                    particles.addVelocityAt(force, i);
                }
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i] + FORCE_OVER_LIFETIME_RAND_OFFSET;
                    const force = Vec3.set(_temp_v3,
                        lerp(xMin, xMax, pseudoRandom(seed)),
                        lerp(yMin, yMax, pseudoRandom(seed)),
                        lerp(zMin, zMax, pseudoRandom(seed)));
                    Vec3.transformQuat(force, force, rotation);
                    Vec3.multiplyScalar(force, force, dt);
                    particles.addVelocityAt(force, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    const seed = randomSeed[i] + FORCE_OVER_LIFETIME_RAND_OFFSET;
                    const force = Vec3.set(_temp_v3,
                        lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), pseudoRandom(seed))  * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), pseudoRandom(seed))  * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), pseudoRandom(seed))  * zMultiplier);
                    Vec3.transformQuat(force, force, rotation);
                    Vec3.multiplyScalar(force, force, dt);
                    particles.addVelocityAt(force, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.x.mode === CurveRange.Mode.Constant) {
                const force = Vec3.set(_temp_v3,
                    this.x.constant,
                    this.y.constant,
                    this.z.constant);
                Vec3.multiplyScalar(force, force, dt);
                for (let i = fromIndex; i < toIndex; i++) {
                    particles.addVelocityAt(force, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    const force = Vec3.set(_temp_v3,
                        xCurve.evaluate(normalizedTime) * xMultiplier,
                        yCurve.evaluate(normalizedTime) * yMultiplier,
                        zCurve.evaluate(normalizedTime) * zMultiplier);
                    Vec3.multiplyScalar(force, force, dt);
                    particles.addVelocityAt(force, i);
                }
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i] + FORCE_OVER_LIFETIME_RAND_OFFSET;
                    const force = Vec3.set(_temp_v3,
                        lerp(xMin, xMax, pseudoRandom(seed)),
                        lerp(yMin, yMax, pseudoRandom(seed)),
                        lerp(zMin, zMax, pseudoRandom(seed)));
                    Vec3.multiplyScalar(force, force, dt);
                    particles.addVelocityAt(force, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    const seed = randomSeed[i] + FORCE_OVER_LIFETIME_RAND_OFFSET;
                    const force = Vec3.set(_temp_v3,
                        lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), pseudoRandom(seed))  * xMultiplier,
                        lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), pseudoRandom(seed))  * yMultiplier,
                        lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), pseudoRandom(seed))  * zMultiplier);
                    Vec3.multiplyScalar(force, force, dt);
                    particles.addVelocityAt(force, i);
                }
            }
        }
    }
}
