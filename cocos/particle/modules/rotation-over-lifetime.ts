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

import { ccclass, tooltip, displayOrder, range, type, radian, serializable, visible, displayName } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { Mat4, pseudoRandom, Quat, Vec4, Vec3, lerp } from '../../core/math';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { CurveRange } from '../curve-range';
import { assert, CCBoolean } from '../../core';
import { ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';
import { ParticleSOAData } from '../particle-soa-data';

const ROTATION_OVERTIME_RAND_OFFSET = 125292;

@ccclass('cc.RotationOverLifetimeModule')
export class RotationOverLifetimeModule extends ParticleModule {
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
    @type(CurveRange)
    @range([-1, 1])
    @radian
    @displayOrder(2)
    @tooltip('i18n:rotationOvertimeModule.x')
    @visible(function (this: RotationOverLifetimeModule): boolean { return this.separateAxes; })
    public get x () {
        if (!this._x) {
            this._x = new CurveRange();
        }
        return this._x;
    }

    public set x (val) {
        this._x = val;
    }

    /**
     * @zh 绕 Y 轴设定旋转。
     */
    @type(CurveRange)
    @range([-1, 1])
    @radian
    @displayOrder(3)
    @tooltip('i18n:rotationOvertimeModule.y')
    @visible(function (this: RotationOverLifetimeModule): boolean { return this.separateAxes; })
    public get y () {
        if (!this._y) {
            this._y = new CurveRange();
        }
        return this._y;
    }

    public set y (val) {
        this._y = val;
    }

    /**
     * @zh 绕 Z 轴设定旋转。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(4)
    @tooltip('i18n:rotationOvertimeModule.z')
    @visible(function (this: RotationOverLifetimeModule): boolean { return this.separateAxes; })
    public z = new CurveRange();

    @type(CurveRange)
    @range([-1, 1])
    @radian
    @displayOrder(4)
    @tooltip('i18n:rotationOvertimeModule.z')
    @visible(function (this: RotationOverLifetimeModule): boolean { return !this.separateAxes; })
    public get angularVelocity () {
        return this.z;
    }

    public set angularVelocity (val) {
        this.z = val;
    }

    public get name (): string {
        return 'RotationModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.UPDATE;
    }

    public get updatePriority (): number {
        return 1;
    }

    @serializable
    private _separateAxes = false;
    @serializable
    private _y: CurveRange | null = null;
    @serializable
    private _x: CurveRange | null = null;

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, dt: number) {
        const {  angularVelocityZ, normalizedAliveTime, randomSeed } = particles;
        if (!this._separateAxes) {
            if (this.z.mode === CurveRange.Mode.Constant) {
                const constant = this.z.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocityZ[i] += constant;
                }
            } else if (this.z.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocityZ[i] += spline.evaluate(normalizedAliveTime[i]) * multiplier;
                }
            } else if (this.z.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocityZ[i] += lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET));
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocityZ[i] += lerp(splineMin.evaluate(normalizedAliveTime[i]), splineMax.evaluate(normalizedAliveTime[i]), pseudoRandom(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET)) * multiplier;
                }
            }
        } else {
            if (DEBUG) {
                assert(this.x.mode === this.y.mode && this.y.mode === this.z.mode, 'The curve of x, y, z must have same mode!');
            }
            const { angularVelocityX, angularVelocityY } = particles;
            // eslint-disable-next-line no-lonely-if
            if (this.z.mode === CurveRange.Mode.Constant) {
                const constantX = this.x.constant;
                const constantY = this.y.constant;
                const constantZ = this.z.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocityX[i] += constantX;
                    angularVelocityY[i] += constantY;
                    angularVelocityZ[i] += constantZ;
                }
            } else if (this.z.mode === CurveRange.Mode.Curve) {
                const { spline: splineX, multiplier: xMultiplier } = this.x;
                const { spline: splineY, multiplier: yMultiplier } = this.y;
                const { spline: splineZ, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocityX[i] += splineX.evaluate(normalizedAliveTime[i]) * xMultiplier;
                    angularVelocityY[i] += splineY.evaluate(normalizedAliveTime[i]) * yMultiplier;
                    angularVelocityZ[i] += splineZ.evaluate(normalizedAliveTime[i]) * zMultiplier;
                }
            } else if (this.z.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocityX[i] += lerp(xMin, xMax, pseudoRandom(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET));
                    angularVelocityY[i] += lerp(yMin, yMax, pseudoRandom(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET));
                    angularVelocityZ[i] += lerp(zMin, zMax, pseudoRandom(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET));
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    angularVelocityX[i] += lerp(xMin.evaluate(normalizedAliveTime[i]), xMax.evaluate(normalizedAliveTime[i]), pseudoRandom(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET)) * xMultiplier;
                    angularVelocityY[i] += lerp(yMin.evaluate(normalizedAliveTime[i]), yMax.evaluate(normalizedAliveTime[i]), pseudoRandom(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET)) * yMultiplier;
                    angularVelocityZ[i] += lerp(zMin.evaluate(normalizedAliveTime[i]), zMax.evaluate(normalizedAliveTime[i]), pseudoRandom(randomSeed[i] + ROTATION_OVERTIME_RAND_OFFSET)) * zMultiplier;
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
