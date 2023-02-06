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
import { DEBUG } from 'internal:constants';
import { lerp, pseudoRandom, Vec3, Mat4, Quat } from '../../core/math';
import { Space, ModuleRandSeed } from '../enum';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { CurveRange } from '../curve-range';
import { calculateTransform } from '../particle-general-function';
import { ParticleUpdateContext } from '../particle-update-context';
import { ParticleSOAData } from '../particle-soa-data';
import { assert } from '../../core';

const LIMIT_VELOCITY_RAND_OFFSET = ModuleRandSeed.LIMIT;

const _temp_v3_1 = new Vec3();
const rotation = new Quat();
const velocity = new Vec3();

@ccclass('cc.LimitVelocityOverLifetimeModule')
export class LimitVelocityOverLifetimeModule extends ParticleModule {
    /**
     * @zh X 轴方向上的速度下限。
     */
    @type(CurveRange)
    @range([-1, 1])
    @displayOrder(4)
    @tooltip('i18n:limitVelocityOvertimeModule.limitX')
    @visible(function (this: LimitVelocityOverLifetimeModule): boolean {
        return this.separateAxes;
    })
    public get limitX () {
        if (!this._x) {
            this._x = new CurveRange();
        }
        return this._x;
    }

    public set limitX (val) {
        this._x = val;
    }

    /**
     * @zh Y 轴方向上的速度下限。
     */
    @type(CurveRange)
    @range([-1, 1])
    @displayOrder(5)
    @tooltip('i18n:limitVelocityOvertimeModule.limitY')
    @visible(function (this: LimitVelocityOverLifetimeModule): boolean {
        return this.separateAxes;
    })
    public get limitY () {
        if (!this._y) {
            this._y = new CurveRange();
        }
        return this._y;
    }

    public set limitY (val) {
        this._y = val;
    }

    /**
     * @zh Z 轴方向上的速度下限。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(6)
    @tooltip('i18n:limitVelocityOvertimeModule.limitZ')
    @visible(function (this: LimitVelocityOverLifetimeModule): boolean {
        return this.separateAxes;
    })
    public get limitZ () {
        if (!this._z) {
            this._z = new CurveRange();
        }
        return this._z;
    }

    public set limitZ (val) {
        this._z = val;
    }

    /**
     * @zh 速度下限。
     */
    @type(CurveRange)
    @range([-1, 1])
    @displayOrder(3)
    @tooltip('i18n:limitVelocityOvertimeModule.limit')
    @visible(function (this: LimitVelocityOverLifetimeModule): boolean {
        return !this.separateAxes;
    })
    public get limit () {
        if (!this._limit) {
            this._limit = new CurveRange();
        }
        return this._limit;
    }

    public set limit (val) {
        this._limit = val;
    }

    /**
     * @zh 当前速度与速度下限的插值。
     */
    @serializable
    @displayOrder(7)
    @tooltip('i18n:limitVelocityOvertimeModule.dampen')
    public dampen = 3;

    /**
     * @zh 是否三个轴分开限制。
     */
    @serializable
    @displayOrder(2)
    @tooltip('i18n:limitVelocityOvertimeModule.separateAxes')
    public separateAxes = false;

    /**
     * @zh 计算速度下限时采用的坐标系 [[Space]]。
     */
    @type(Space)
    @serializable
    @displayOrder(1)
    @tooltip('i18n:limitVelocityOvertimeModule.space')
    public space = Space.LOCAL;

    @serializable
    private _x: CurveRange | null = null;
    @serializable
    private _y: CurveRange | null = null;
    @serializable
    private _z: CurveRange | null = null;
    @serializable
    private _limit: CurveRange | null = null;

    public get name (): string {
        return 'limitModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.PRE_UPDATE;
    }

    public get updatePriority (): number {
        return 6;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        const needTransform = calculateTransform(particleUpdateContext.simulationSpace,
            this.space, particleUpdateContext.worldTransform, rotation);
        const { count, normalizedAliveTime, randomSeed, animatedVelocityX, animatedVelocityY, animatedVelocityZ } = particles;
        if (this.separateAxes) {
            if (DEBUG) {
                assert(this.limitX.mode === this.limitY.mode && this.limitY.mode === this.limitZ.mode, 'The curve of limitX, limitY, limitZ must have same mode!');
            }
            if (needTransform) {
                if (this.limitX.mode === CurveRange.Mode.Constant) {
                    Vec3.set(_temp_v3_1, this.limitX.constant, this.limitY.constant, this.limitY.constant);
                    Vec3.transformQuat(_temp_v3_1, _temp_v3_1, rotation);
                    for (let i = 0; i < count; i++) {
                        particles.getVelocityAt(velocity, i);
                        velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                        Vec3.set(velocity,
                            dampenBeyondLimit(velocity.x, _temp_v3_1.x, this.dampen),
                            dampenBeyondLimit(velocity.y, _temp_v3_1.y, this.dampen),
                            dampenBeyondLimit(velocity.z, _temp_v3_1.z, this.dampen));
                        particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                    }
                } else if (this.limitX.mode === CurveRange.Mode.Curve) {
                    const { spline: splineX, multiplier: xMultiplier } = this.limitX;
                    const { spline: splineY, multiplier: yMultiplier } = this.limitY;
                    const { spline: splineZ, multiplier: zMultiplier } = this.limitZ;
                    for (let i = 0; i < count; i++) {
                        const normalizedTime = normalizedAliveTime[i];
                        Vec3.set(_temp_v3_1, splineX.evaluate(normalizedTime) * xMultiplier,
                            splineY.evaluate(normalizedTime) * yMultiplier,
                            splineZ.evaluate(normalizedTime) * zMultiplier);
                        Vec3.transformQuat(_temp_v3_1, _temp_v3_1, rotation);
                        particles.getVelocityAt(velocity, i);
                        velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                        Vec3.set(velocity,
                            dampenBeyondLimit(velocity.x, _temp_v3_1.x, this.dampen),
                            dampenBeyondLimit(velocity.y, _temp_v3_1.y, this.dampen),
                            dampenBeyondLimit(velocity.z, _temp_v3_1.z, this.dampen));
                        particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                    }
                } else if (this.limitX.mode === CurveRange.Mode.TwoConstants) {
                    const { constantMin: xMin, constantMax: xMax } = this.limitX;
                    const { constantMin: yMin, constantMax: yMax } = this.limitY;
                    const { constantMin: zMin, constantMax: zMax } = this.limitZ;
                    for (let i = 0; i < count; i++) {
                        const seed = randomSeed[i];
                        Vec3.set(_temp_v3_1, lerp(xMin, xMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)),
                            lerp(yMin, yMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)),
                            lerp(zMin, zMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)));
                        Vec3.transformQuat(_temp_v3_1, _temp_v3_1, rotation);
                        particles.getVelocityAt(velocity, i);
                        velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                        Vec3.set(velocity,
                            dampenBeyondLimit(velocity.x, _temp_v3_1.x, this.dampen),
                            dampenBeyondLimit(velocity.y, _temp_v3_1.y, this.dampen),
                            dampenBeyondLimit(velocity.z, _temp_v3_1.z, this.dampen));
                        particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                    }
                } else {
                    const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.limitX;
                    const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.limitY;
                    const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.limitZ;
                    for (let i = 0; i < count; i++) {
                        const seed = randomSeed[i];
                        const normalizedTime = normalizedAliveTime[i];
                        Vec3.set(_temp_v3_1, lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * xMultiplier,
                            lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * yMultiplier,
                            lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * zMultiplier);
                        Vec3.transformQuat(_temp_v3_1, _temp_v3_1, rotation);
                        particles.getVelocityAt(velocity, i);
                        velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                        Vec3.set(velocity,
                            dampenBeyondLimit(velocity.x, _temp_v3_1.x, this.dampen),
                            dampenBeyondLimit(velocity.y, _temp_v3_1.y, this.dampen),
                            dampenBeyondLimit(velocity.z, _temp_v3_1.z, this.dampen));
                        particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                    }
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (this.limitX.mode === CurveRange.Mode.Constant) {
                    Vec3.set(_temp_v3_1, this.limitX.constant, this.limitY.constant, this.limitY.constant);
                    for (let i = 0; i < count; i++) {
                        particles.getVelocityAt(velocity, i);
                        velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                        Vec3.set(velocity,
                            dampenBeyondLimit(velocity.x, _temp_v3_1.x, this.dampen),
                            dampenBeyondLimit(velocity.y, _temp_v3_1.y, this.dampen),
                            dampenBeyondLimit(velocity.z, _temp_v3_1.z, this.dampen));
                        particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                    }
                } else if (this.limitX.mode === CurveRange.Mode.Curve) {
                    const { spline: splineX, multiplier: xMultiplier } = this.limitX;
                    const { spline: splineY, multiplier: yMultiplier } = this.limitY;
                    const { spline: splineZ, multiplier: zMultiplier } = this.limitZ;
                    for (let i = 0; i < count; i++) {
                        const normalizedTime = normalizedAliveTime[i];
                        Vec3.set(_temp_v3_1, splineX.evaluate(normalizedTime) * xMultiplier,
                            splineY.evaluate(normalizedTime) * yMultiplier,
                            splineZ.evaluate(normalizedTime) * zMultiplier);
                        particles.getVelocityAt(velocity, i);
                        velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                        Vec3.set(velocity,
                            dampenBeyondLimit(velocity.x, _temp_v3_1.x, this.dampen),
                            dampenBeyondLimit(velocity.y, _temp_v3_1.y, this.dampen),
                            dampenBeyondLimit(velocity.z, _temp_v3_1.z, this.dampen));
                        particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                    }
                } else if (this.limitX.mode === CurveRange.Mode.TwoConstants) {
                    const { constantMin: xMin, constantMax: xMax } = this.limitX;
                    const { constantMin: yMin, constantMax: yMax } = this.limitY;
                    const { constantMin: zMin, constantMax: zMax } = this.limitZ;
                    for (let i = 0; i < count; i++) {
                        const seed = randomSeed[i];
                        Vec3.set(_temp_v3_1, lerp(xMin, xMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)),
                            lerp(yMin, yMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)),
                            lerp(zMin, zMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)));
                        particles.getVelocityAt(velocity, i);
                        velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                        Vec3.set(velocity,
                            dampenBeyondLimit(velocity.x, _temp_v3_1.x, this.dampen),
                            dampenBeyondLimit(velocity.y, _temp_v3_1.y, this.dampen),
                            dampenBeyondLimit(velocity.z, _temp_v3_1.z, this.dampen));
                        particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                    }
                } else {
                    const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.limitX;
                    const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.limitY;
                    const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.limitZ;
                    for (let i = 0; i < count; i++) {
                        const seed = randomSeed[i];
                        const normalizedTime = normalizedAliveTime[i];
                        Vec3.set(_temp_v3_1, lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * xMultiplier,
                            lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * yMultiplier,
                            lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * zMultiplier);
                        particles.getVelocityAt(velocity, i);
                        velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                        Vec3.set(velocity,
                            dampenBeyondLimit(velocity.x, _temp_v3_1.x, this.dampen),
                            dampenBeyondLimit(velocity.y, _temp_v3_1.y, this.dampen),
                            dampenBeyondLimit(velocity.z, _temp_v3_1.z, this.dampen));
                        particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                    }
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.limitX.mode === CurveRange.Mode.Constant) {
                const { constant } = this.limit;
                for (let i = 0; i < count; i++) {
                    particles.getVelocityAt(velocity, i);
                    velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                    const length = velocity.length();
                    velocity.normalize();
                    Vec3.multiplyScalar(velocity, velocity,
                        dampenBeyondLimit(length, constant, this.dampen));
                    particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                }
            } else if (this.limitX.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.limit;
                for (let i = 0; i < count; i++) {
                    particles.getVelocityAt(velocity, i);
                    velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                    const length = velocity.length();
                    velocity.normalize();
                    Vec3.multiplyScalar(velocity, velocity,
                        dampenBeyondLimit(length, spline.evaluate(normalizedAliveTime[i]) * multiplier, this.dampen));
                    particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                }
            } else if (this.limitX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.limit;
                for (let i = 0; i < count; i++) {
                    const seed = randomSeed[i];
                    particles.getVelocityAt(velocity, i);
                    velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                    const length = velocity.length();
                    velocity.normalize();
                    Vec3.multiplyScalar(velocity, velocity,
                        dampenBeyondLimit(length, lerp(constantMin, constantMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen));
                    particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.limit;
                for (let i = 0; i < count; i++) {
                    const seed = randomSeed[i];
                    const normalizedTime = normalizedAliveTime[i];
                    particles.getVelocityAt(velocity, i);
                    velocity.add3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]);
                    const length = velocity.length();
                    velocity.normalize();
                    Vec3.multiplyScalar(velocity, velocity,
                        dampenBeyondLimit(length, lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * multiplier, this.dampen));
                    particles.setVelocityAt(velocity.subtract3f(animatedVelocityX[i], animatedVelocityY[i], animatedVelocityZ[i]), i);
                }
            }
        }
    }

    protected _onBeforeSerialize (props) {
        if (!this.separateAxes) {
            return ['separateAxes', '_limit'];
        } else {
            return ['separateAxes', '_x', '_y', '_z'];
        }
    }
}

function dampenBeyondLimit (vel: number, limit: number, dampen: number) {
    const sgn = Math.sign(vel);
    let abs = Math.abs(vel);
    if (abs > limit) {
        abs = lerp(abs, limit, dampen);
    }
    return abs * sgn;
}
