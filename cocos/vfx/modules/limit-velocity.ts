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
import { lerp, Vec3, approx, assertIsTrue } from '../../core';
import { Space } from '../enum';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { VFXEmitterParams, ModuleExecContext } from '../base';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const randomOffset = 721883;

const _temp_v3_1 = new Vec3();
const tempVelocity = new Vec3();
const seed = new Vec3();
const requiredParameters = BuiltinParticleParameterFlags.VELOCITY | BuiltinParticleParameterFlags.BASE_VELOCITY;

@ccclass('cc.LimitVelocity')
@VFXModule.register('LimitVelocity', ModuleExecStageFlags.UPDATE, [BuiltinParticleParameterName.VELOCITY], [BuiltinParticleParameterName.VELOCITY])
export class LimitVelocityModule extends VFXModule {
    /**
     * @zh X 轴方向上的速度下限。
     */
    @type(FloatExpression)
    @serializable
    @range([0, 1])
    @displayOrder(4)
    @tooltip('i18n:limitVelocityOvertimeModule.limitX')
    @visible(function (this: LimitVelocityModule): boolean {
        return this.separateAxes;
    })
    public limitX = new FloatExpression(1)

    /**
     * @zh Y 轴方向上的速度下限。
     */
    @type(FloatExpression)
    @range([0, 1])
    @displayOrder(5)
    @tooltip('i18n:limitVelocityOvertimeModule.limitY')
    @visible(function (this: LimitVelocityModule): boolean {
        return this.separateAxes;
    })
    public get limitY () {
        if (!this._y) {
            this._y = new FloatExpression(1);
        }
        return this._y;
    }

    public set limitY (val) {
        this._y = val;
    }

    /**
     * @zh Z 轴方向上的速度下限。
     */
    @type(FloatExpression)
    @range([0, 1])
    @displayOrder(6)
    @tooltip('i18n:limitVelocityOvertimeModule.limitZ')
    @visible(function (this: LimitVelocityModule): boolean {
        return this.separateAxes;
    })
    public get limitZ () {
        if (!this._z) {
            this._z = new FloatExpression(1);
        }
        return this._z;
    }

    public set limitZ (val) {
        this._z = val;
    }

    /**
     * @zh 速度下限。
     */
    @type(FloatExpression)
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
    private _y: FloatExpression | null = null;
    @serializable
    private _z: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameters(requiredParameters);
        if (this.limitX.mode === FloatExpression.Mode.CURVE || this.limitX.mode === FloatExpression.Mode.TWO_CURVES) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.NORMALIZED_AGE);
        }
        if (this.limitX.mode === FloatExpression.Mode.TWO_CONSTANTS || this.limitX.mode === FloatExpression.Mode.TWO_CURVES) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const dampen = this.dampen;
        if (approx(dampen, 0)) {
            return;
        }
        const { velocity, baseVelocity } = particles;
        const randomOffset = this._randomOffset;
        const rotation = context.rotationIfNeedTransform;
        const needTransform = this.space === params.simulationSpace;
        if (this.separateAxes) {
            if (needTransform) {
                if (this.limitX.mode === FloatExpression.Mode.CONSTANT) {
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
                } else if (this.limitX.mode === FloatExpression.Mode.CURVE) {
                    const { spline: splineX, multiplier: xMultiplier } = this.limitX;
                    const { spline: splineY, multiplier: yMultiplier } = this.limitY;
                    const { spline: splineZ, multiplier: zMultiplier } = this.limitZ;
                    const normalizedAge = particles.normalizedAge.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const normalizedTime = normalizedAge[i];
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
                } else if (this.limitX.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                    const { constantMin: xMin, constantMax: xMax } = this.limitX;
                    const { constantMin: yMin, constantMax: yMax } = this.limitY;
                    const { constantMin: zMin, constantMax: zMax } = this.limitZ;
                    const randomSeed = particles.randomSeed.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                        Vec3.set(_temp_v3_1, lerp(xMin, xMax, ratio.x),
                            lerp(yMin, yMax, ratio.y),
                            lerp(zMin, zMax, ratio.z));
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
                    const normalizedAge = particles.normalizedAge.data;
                    const randomSeed = particles.randomSeed.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                        const normalizedTime = normalizedAge[i];
                        Vec3.set(_temp_v3_1, lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), ratio.x) * xMultiplier,
                            lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), ratio.y) * yMultiplier,
                            lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), ratio.z) * zMultiplier);
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
                if (this.limitX.mode === FloatExpression.Mode.CONSTANT) {
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
                } else if (this.limitX.mode === FloatExpression.Mode.CURVE) {
                    const { spline: splineX, multiplier: xMultiplier } = this.limitX;
                    const { spline: splineY, multiplier: yMultiplier } = this.limitY;
                    const { spline: splineZ, multiplier: zMultiplier } = this.limitZ;
                    const normalizedAge = particles.normalizedAge.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const normalizedTime = normalizedAge[i];
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
                } else if (this.limitX.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                    const { constantMin: xMin, constantMax: xMax } = this.limitX;
                    const { constantMin: yMin, constantMax: yMax } = this.limitY;
                    const { constantMin: zMin, constantMax: zMax } = this.limitZ;
                    const randomSeed = particles.randomSeed.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const seed = randomSeed[i];
                        Vec3.set(_temp_v3_1, lerp(xMin, xMax, RandomStream.getFloat(seed + randomOffset)),
                            lerp(yMin, yMax, RandomStream.getFloat(seed + randomOffset)),
                            lerp(zMin, zMax, RandomStream.getFloat(seed + randomOffset)));
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
                    const normalizedAge = particles.normalizedAge.data;
                    const randomSeed = particles.randomSeed.data;
                    for (let i = fromIndex; i < toIndex; i++) {
                        const seed = randomSeed[i];
                        const normalizedTime = normalizedAge[i];
                        Vec3.set(_temp_v3_1, lerp(xMin.evaluate(normalizedTime), xMax.evaluate(normalizedTime), RandomStream.getFloat(seed + randomOffset)) * xMultiplier,
                            lerp(yMin.evaluate(normalizedTime), yMax.evaluate(normalizedTime), RandomStream.getFloat(seed + randomOffset)) * yMultiplier,
                            lerp(zMin.evaluate(normalizedTime), zMax.evaluate(normalizedTime), RandomStream.getFloat(seed + randomOffset)) * zMultiplier);
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
            if (this.limitX.mode === FloatExpression.Mode.CONSTANT) {
                const { constant } = this.limit;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const length = tempVelocity.length();
                    Vec3.multiplyScalar(tempVelocity, tempVelocity,
                        1 - dampenBeyondLimit(length, constant, dampen) / length);
                    velocity.subVec3At(tempVelocity, i);
                    baseVelocity.subVec3At(tempVelocity, i);
                }
            } else if (this.limitX.mode === FloatExpression.Mode.CURVE) {
                const { spline, multiplier } = this.limit;
                const normalizedAge = particles.normalizedAge.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const length = tempVelocity.length();
                    Vec3.multiplyScalar(tempVelocity, tempVelocity,
                        1 - dampenBeyondLimit(length, spline.evaluate(normalizedAge[i]) * multiplier, dampen) / length);
                    velocity.subVec3At(tempVelocity, i);
                    baseVelocity.subVec3At(tempVelocity, i);
                }
            } else if (this.limitX.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const { constantMin, constantMax } = this.limit;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i];
                    velocity.getVec3At(tempVelocity, i);
                    const length = tempVelocity.length();
                    Vec3.multiplyScalar(tempVelocity, tempVelocity,
                        1 - dampenBeyondLimit(length, lerp(constantMin, constantMax, RandomStream.getFloat(seed + randomOffset)), dampen) / length);
                    velocity.subVec3At(tempVelocity, i);
                    baseVelocity.subVec3At(tempVelocity, i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.limit;
                const normalizedAge = particles.normalizedAge.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i];
                    const normalizedTime = normalizedAge[i];
                    velocity.getVec3At(tempVelocity, i);
                    const length = tempVelocity.length();
                    Vec3.multiplyScalar(tempVelocity, tempVelocity,
                        1 - dampenBeyondLimit(length, lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), RandomStream.getFloat(seed + randomOffset)) * multiplier, dampen) / length);
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
