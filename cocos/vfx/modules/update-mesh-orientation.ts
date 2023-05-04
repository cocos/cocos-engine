/* eslint-disable max-len */
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

import { ccclass, tooltip, displayOrder, range, type, radian, serializable, visible } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { Vec3, lerp, assertIsTrue, CCBoolean } from '../../core';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { VFXEmitterParams, ModuleExecContext } from '../base';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';

const ROTATION_OVERTIME_RAND_OFFSET = 125292;
const seed = new Vec3();

@ccclass('cc.UpdateMeshOrientationModule')
@VFXModule.register('UpdateMeshOrientation', ModuleExecStageFlags.UPDATE, [BuiltinParticleParameterName.ANGULAR_VELOCITY], [])
export class UpdateMeshOrientationModule extends VFXModule {
    /**
     * @zh 是否三个轴分开设定旋转。
     */
    @type(CCBoolean)
    @displayOrder(1)
    @tooltip('i18n:rotationOvertimeModule.separateAxes')
    get separateAxes () {
        return this._separateAxes;
    }

    set separateAxes (val) {
        this._separateAxes = val;
    }

    /**
     * @zh 绕 X 轴设定旋转。
     */
    @type(FloatExpression)
    @range([-1, 1])
    @radian
    @displayOrder(2)
    @tooltip('i18n:rotationOvertimeModule.x')
    @visible(function (this: RotationModule): boolean { return this.separateAxes; })
    public get x () {
        if (!this._x) {
            this._x = new FloatExpression();
        }
        return this._x;
    }

    public set x (val) {
        this._x = val;
    }

    /**
     * @zh 绕 Y 轴设定旋转。
     */
    @type(FloatExpression)
    @range([-1, 1])
    @radian
    @displayOrder(3)
    @tooltip('i18n:rotationOvertimeModule.y')
    @visible(function (this: RotationModule): boolean { return this.separateAxes; })
    public get y () {
        if (!this._y) {
            this._y = new FloatExpression();
        }
        return this._y;
    }

    public set y (val) {
        this._y = val;
    }

    /**
     * @zh 绕 Z 轴设定旋转。
     */
    @type(FloatExpression)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(4)
    @tooltip('i18n:rotationOvertimeModule.z')
    @visible(function (this: RotationModule): boolean { return this.separateAxes; })
    public z = new FloatExpression();

    @type(FloatExpression)
    @range([-1, 1])
    @radian
    @displayOrder(4)
    @tooltip('i18n:rotationOvertimeModule.z')
    @visible(function (this: RotationModule): boolean { return !this.separateAxes; })
    public get angularVelocity () {
        return this.z;
    }

    public set angularVelocity (val) {
        this.z = val;
    }

    @serializable
    private _separateAxes = false;
    @serializable
    private _y: FloatExpression | null = null;
    @serializable
    private _x: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
        if (this.separateAxes && DEBUG) {
            assertIsTrue(this.x.mode === this.y.mode && this.y.mode === this.z.mode, 'The curve of x, y, z must have same mode!');
        }
        particles.markRequiredParameters(BuiltinParticleParameterFlags.ANGULAR_VELOCITY);
        particles.markRequiredParameters(BuiltinParticleParameterFlags.ROTATION);
        if (this.z.mode === FloatExpression.Mode.CURVE || this.z.mode === FloatExpression.Mode.TWO_CURVES) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.NORMALIZED_AGE);
        }
        if (this.z.mode === FloatExpression.Mode.TWO_CONSTANTS || this.z.mode === FloatExpression.Mode.TWO_CURVES) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { angularVelocity } = particles;
        const { fromIndex, toIndex } = context;
        if (!this._separateAxes) {
            if (this.z.mode === FloatExpression.Mode.CONSTANT) {
                const constant = this.z.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocity.addZAt(constant, i);
                }
            } else if (this.z.mode === FloatExpression.Mode.CURVE) {
                const { spline, multiplier } = this.z;
                const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocity.addZAt(spline.evaluate(normalizedAge[i]) * multiplier, i);
                }
            } else if (this.z.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                const { constantMin, constantMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocity.addZAt(lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET)), i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.z;
                const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
                const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const time = normalizedAge[i];
                    angularVelocity.addZAt(lerp(splineMin.evaluate(time), splineMax.evaluate(time), RandomStream.getFloat(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET)) * multiplier, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.z.mode === FloatExpression.Mode.CONSTANT) {
                const constantX = this.x.constant;
                const constantY = this.y.constant;
                const constantZ = this.z.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocity.add3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.z.mode === FloatExpression.Mode.CURVE) {
                const { spline: splineX, multiplier: xMultiplier } = this.x;
                const { spline: splineY, multiplier: yMultiplier } = this.y;
                const { spline: splineZ, multiplier: zMultiplier } = this.z;
                const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const time = normalizedAge[i];
                    angularVelocity.add3fAt(splineX.evaluate(time) * xMultiplier,
                        splineY.evaluate(time) * yMultiplier,
                        splineZ.evaluate(time) * zMultiplier, i);
                }
            } else if (this.z.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandomStream.get3Float(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET, seed);
                    angularVelocity.add3fAt(lerp(xMin, xMax, ratio.x),
                        lerp(yMin, yMax, ratio.y),
                        lerp(zMin, zMax, ratio.z), i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
                const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const time = normalizedAge[i];
                    const seed = randomSeed[i];
                    angularVelocity.add3fAt(lerp(xMin.evaluate(time), xMax.evaluate(time), RandomStream.getFloat(seed + ROTATION_OVERTIME_RAND_OFFSET)) * xMultiplier,
                        lerp(yMin.evaluate(time), yMax.evaluate(time), RandomStream.getFloat(seed + ROTATION_OVERTIME_RAND_OFFSET)) * yMultiplier,
                        lerp(zMin.evaluate(time), zMax.evaluate(time), RandomStream.getFloat(seed + ROTATION_OVERTIME_RAND_OFFSET)) * zMultiplier, i);
                }
            }
        }
    }

    protected needsFilterSerialization () {
        return true;
    }

    protected getSerializedProps () {
        if (!this.separateAxes) {
            return ['separateAxes', 'z'];
        } else {
            return ['separateAxes', '_x', '_y', 'z'];
        }
    }
}
