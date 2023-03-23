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

import { ccclass, tooltip, displayOrder, range, type, serializable, visible, rangeMin } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { lerp, pseudoRandom, Vec3, Mat4, Quat, approx } from '../../core/math';
import { Space, ModuleRandSeed } from '../enum';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { CurveRange } from '../curve-range';
import { calculateTransform } from '../particle-general-function';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleVec3Parameter } from '../particle-parameter';
import { assert } from '../../core';

const LIMIT_VELOCITY_RAND_OFFSET = ModuleRandSeed.LIMIT;

const _temp_v3_1 = new Vec3();
const tempVelocity = new Vec3();

@ccclass('cc.LimitVelocity')
@ParticleModule.register('LimitVelocity', ModuleExecStage.UPDATE, 6)
export class LimitVelocityModule extends ParticleModule {
    /**
     * @zh X 轴方向上的速度下限。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(4)
    @tooltip('i18n:limitVelocityOvertimeModule.limitX')
    @visible(function (this: LimitVelocityModule): boolean {
        return this.separateAxes;
    })
    public limitX = new CurveRange(1)

    /**
     * @zh Y 轴方向上的速度下限。
     */
    @type(CurveRange)
    @range([0, 1])
    @displayOrder(5)
    @tooltip('i18n:limitVelocityOvertimeModule.limitY')
    @visible(function (this: LimitVelocityModule): boolean {
        return this.separateAxes;
    })
    public get limitY () {
        if (!this._y) {
            this._y = new CurveRange(1);
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
    @range([0, 1])
    @displayOrder(6)
    @tooltip('i18n:limitVelocityOvertimeModule.limitZ')
    @visible(function (this: LimitVelocityModule): boolean {
        return this.separateAxes;
    })
    public get limitZ () {
        if (!this._z) {
            this._z = new CurveRange(1);
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
    @range([0, 1])
    @displayOrder(3)
    @tooltip('i18n:limitVelocityOvertimeModule.limit')
    @visible(function (this: LimitVelocityModule): boolean {
        return !this.separateAxes;
    })
    public get limit () {
        return this.limitX;
    }

    public set limit (val) {
        this.limitX = val;
    }

    /**
     * @zh 当前速度与速度下限的插值。
     */
    @serializable
    @displayOrder(7)
    @tooltip('i18n:limitVelocityOvertimeModule.dampen')
    @rangeMin(0)
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
    private _y: CurveRange | null = null;
    @serializable
    private _z: CurveRange | null = null;
    private _needTransform = false;
    private _rotation = new Quat();

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (this.separateAxes && DEBUG) {
            assert(this.limitX.mode === this.limitY.mode && this.limitY.mode === this.limitZ.mode, 'The curve of limitX, limitY, limitZ must have same mode!');
        }
        context.markRequiredParameter(BuiltinParticleParameter.VELOCITY);
        context.markRequiredParameter(BuiltinParticleParameter.BASE_VELOCITY);
        if (this.limitX.mode === CurveRange.Mode.Curve || this.limitX.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
        }
        if (this.limitX.mode === CurveRange.Mode.TwoConstants || this.limitX.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
        }
        this._needTransform = calculateTransform(params.simulationSpace,
            this.space, context.localToWorld, context.worldToLocal, this._rotation);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex } = context;
        const dampen = this.dampen;
        if (approx(dampen, 0)) {
            return;
        }
        const { velocity, baseVelocity } = particles;
        const rotation = this._rotation;
        if (this.separateAxes) {
            if (this._needTransform) {
                if (this.limitX.mode === CurveRange.Mode.Constant) {
                    Vec3.set(_temp_v3_1, this.limitX.constant, this.limitY.constant, this.limitY.constant);
                    Vec3.transformQuat(_temp_v3_1, _temp_v3_1, rotation);
                    for (let i = fromIndex; i < toIndex; i++) {
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.set(tempVelocity,
                            tempVelocity.x - dampenBeyondLimit(tempVelocity.x, _temp_v3_1.x, dampen),
                            tempVelocity.y - dampenBeyondLimit(tempVelocity.y, _temp_v3_1.y, dampen),
                            tempVelocity.z - dampenBeyondLimit(tempVelocity.z, _temp_v3_1.z, dampen));
                        velocity.subVec3At(tempVelocity, i);
                        baseVelocity.subVec3At(tempVelocity, i);
                    }
                } else if (this.limitX.mode === CurveRange.Mode.Curve) {
                    const { spline: splineX, multiplier: xMultiplier } = this.limitX;
                    const { spline: splineY, multiplier: yMultiplier } = this.limitY;
                    const { spline: splineZ, multiplier: zMultiplier } = this.limitZ;
                    const normalizedAliveTime = particles.normalizedAliveTime.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const normalizedTime = normalizedAliveTime[i];
                        Vec3.set(_temp_v3_1, splineX.evaluate(normalizedTime) * xMultiplier,
                            splineY.evaluate(normalizedTime) * yMultiplier,
                            splineZ.evaluate(normalizedTime) * zMultiplier);
                        Vec3.transformQuat(_temp_v3_1, _temp_v3_1, rotation);
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.set(tempVelocity,
                            tempVelocity.x - dampenBeyondLimit(tempVelocity.x, _temp_v3_1.x, dampen),
                            tempVelocity.y - dampenBeyondLimit(tempVelocity.y, _temp_v3_1.y, dampen),
                            tempVelocity.z - dampenBeyondLimit(tempVelocity.z, _temp_v3_1.z, dampen));
                        velocity.subVec3At(tempVelocity, i);
                        baseVelocity.subVec3At(tempVelocity, i);
                    }
                } else if (this.limitX.mode === CurveRange.Mode.TwoConstants) {
                    const { constantMin: xMin, constantMax: xMax } = this.limitX;
                    const { constantMin: yMin, constantMax: yMax } = this.limitY;
                    const { constantMin: zMin, constantMax: zMax } = this.limitZ;
                    const randomSeed = particles.randomSeed.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const seed = randomSeed[i];
                        Vec3.set(_temp_v3_1, lerp(xMin, xMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)),
                            lerp(yMin, yMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)),
                            lerp(zMin, zMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)));
                        Vec3.transformQuat(_temp_v3_1, _temp_v3_1, rotation);
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.set(tempVelocity,
                            tempVelocity.x - dampenBeyondLimit(tempVelocity.x, _temp_v3_1.x, dampen),
                            tempVelocity.y - dampenBeyondLimit(tempVelocity.y, _temp_v3_1.y, dampen),
                            tempVelocity.z - dampenBeyondLimit(tempVelocity.z, _temp_v3_1.z, dampen));
                        velocity.subVec3At(tempVelocity, i);
                        baseVelocity.subVec3At(tempVelocity, i);
                    }
                } else {
                    const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.limitX;
                    const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.limitY;
                    const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.limitZ;
                    const normalizedAliveTime = particles.normalizedAliveTime.data;
                    const randomSeed = particles.randomSeed.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const seed = randomSeed[i];
                        const normalizedTime = normalizedAliveTime[i];
                        Vec3.set(_temp_v3_1, lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * xMultiplier,
                            lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * yMultiplier,
                            lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * zMultiplier);
                        Vec3.transformQuat(_temp_v3_1, _temp_v3_1, rotation);
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.set(tempVelocity,
                            tempVelocity.x - dampenBeyondLimit(tempVelocity.x, _temp_v3_1.x, dampen),
                            tempVelocity.y - dampenBeyondLimit(tempVelocity.y, _temp_v3_1.y, dampen),
                            tempVelocity.z - dampenBeyondLimit(tempVelocity.z, _temp_v3_1.z, dampen));
                        velocity.subVec3At(tempVelocity, i);
                        baseVelocity.subVec3At(tempVelocity, i);
                    }
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (this.limitX.mode === CurveRange.Mode.Constant) {
                    Vec3.set(_temp_v3_1, this.limitX.constant, this.limitY.constant, this.limitY.constant);
                    for (let i = fromIndex; i < toIndex; i++) {
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.set(tempVelocity,
                            tempVelocity.x - dampenBeyondLimit(tempVelocity.x, _temp_v3_1.x, dampen),
                            tempVelocity.y - dampenBeyondLimit(tempVelocity.y, _temp_v3_1.y, dampen),
                            tempVelocity.z - dampenBeyondLimit(tempVelocity.z, _temp_v3_1.z, dampen));
                        velocity.subVec3At(tempVelocity, i);
                        baseVelocity.subVec3At(tempVelocity, i);
                    }
                } else if (this.limitX.mode === CurveRange.Mode.Curve) {
                    const { spline: splineX, multiplier: xMultiplier } = this.limitX;
                    const { spline: splineY, multiplier: yMultiplier } = this.limitY;
                    const { spline: splineZ, multiplier: zMultiplier } = this.limitZ;
                    const normalizedAliveTime = particles.normalizedAliveTime.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const normalizedTime = normalizedAliveTime[i];
                        Vec3.set(_temp_v3_1, splineX.evaluate(normalizedTime) * xMultiplier,
                            splineY.evaluate(normalizedTime) * yMultiplier,
                            splineZ.evaluate(normalizedTime) * zMultiplier);
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.set(tempVelocity,
                            tempVelocity.x - dampenBeyondLimit(tempVelocity.x, _temp_v3_1.x, dampen),
                            tempVelocity.y - dampenBeyondLimit(tempVelocity.y, _temp_v3_1.y, dampen),
                            tempVelocity.z - dampenBeyondLimit(tempVelocity.z, _temp_v3_1.z, dampen));
                        velocity.subVec3At(tempVelocity, i);
                        baseVelocity.subVec3At(tempVelocity, i);
                    }
                } else if (this.limitX.mode === CurveRange.Mode.TwoConstants) {
                    const { constantMin: xMin, constantMax: xMax } = this.limitX;
                    const { constantMin: yMin, constantMax: yMax } = this.limitY;
                    const { constantMin: zMin, constantMax: zMax } = this.limitZ;
                    const randomSeed = particles.randomSeed.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const seed = randomSeed[i];
                        Vec3.set(_temp_v3_1, lerp(xMin, xMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)),
                            lerp(yMin, yMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)),
                            lerp(zMin, zMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)));
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.set(tempVelocity,
                            tempVelocity.x - dampenBeyondLimit(tempVelocity.x, _temp_v3_1.x, dampen),
                            tempVelocity.y - dampenBeyondLimit(tempVelocity.y, _temp_v3_1.y, dampen),
                            tempVelocity.z - dampenBeyondLimit(tempVelocity.z, _temp_v3_1.z, dampen));
                        velocity.subVec3At(tempVelocity, i);
                        baseVelocity.subVec3At(tempVelocity, i);
                    }
                } else {
                    const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.limitX;
                    const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.limitY;
                    const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.limitZ;
                    const normalizedAliveTime = particles.normalizedAliveTime.data;
                    const randomSeed = particles.randomSeed.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const seed = randomSeed[i];
                        const normalizedTime = normalizedAliveTime[i];
                        Vec3.set(_temp_v3_1, lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * xMultiplier,
                            lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * yMultiplier,
                            lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * zMultiplier);
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.set(tempVelocity,
                            tempVelocity.x - dampenBeyondLimit(tempVelocity.x, _temp_v3_1.x, dampen),
                            tempVelocity.y - dampenBeyondLimit(tempVelocity.y, _temp_v3_1.y, dampen),
                            tempVelocity.z - dampenBeyondLimit(tempVelocity.z, _temp_v3_1.z, dampen));
                        velocity.subVec3At(tempVelocity, i);
                        baseVelocity.subVec3At(tempVelocity, i);
                    }
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.limitX.mode === CurveRange.Mode.Constant) {
                const { constant } = this.limit;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const length = tempVelocity.length();
                    Vec3.multiplyScalar(tempVelocity, tempVelocity,
                        1 - dampenBeyondLimit(length, constant, dampen) / length);
                    velocity.subVec3At(tempVelocity, i);
                    baseVelocity.subVec3At(tempVelocity, i);
                }
            } else if (this.limitX.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.limit;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const length = tempVelocity.length();
                    Vec3.multiplyScalar(tempVelocity, tempVelocity,
                        1 - dampenBeyondLimit(length, spline.evaluate(normalizedAliveTime[i]) * multiplier, dampen) / length);
                    velocity.subVec3At(tempVelocity, i);
                    baseVelocity.subVec3At(tempVelocity, i);
                }
            } else if (this.limitX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.limit;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i];
                    velocity.getVec3At(tempVelocity, i);
                    const length = tempVelocity.length();
                    Vec3.multiplyScalar(tempVelocity, tempVelocity,
                        1 - dampenBeyondLimit(length, lerp(constantMin, constantMax, pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)), dampen) / length);
                    velocity.subVec3At(tempVelocity, i);
                    baseVelocity.subVec3At(tempVelocity, i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.limit;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i];
                    const normalizedTime = normalizedAliveTime[i];
                    velocity.getVec3At(tempVelocity, i);
                    const length = tempVelocity.length();
                    Vec3.multiplyScalar(tempVelocity, tempVelocity,
                        1 - dampenBeyondLimit(length, lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), pseudoRandom(seed + LIMIT_VELOCITY_RAND_OFFSET)) * multiplier, dampen) / length);
                    velocity.subVec3At(tempVelocity, i);
                    baseVelocity.subVec3At(tempVelocity, i);
                }
            }
        }
    }

    protected needsFilterSerialization () {
        return true;
    }

    protected getSerializedProps () {
        if (!this.separateAxes) {
            return ['separateAxes', 'x'];
        } else {
            return ['separateAxes', 'x', '_y', '_z'];
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
