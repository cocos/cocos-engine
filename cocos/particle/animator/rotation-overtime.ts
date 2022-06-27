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
import { Mat4, pseudoRandom, Quat, Vec4, Vec3 } from '../../core/math';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';
import { ModuleRandSeed, RenderMode } from '../enum';

const ROTATION_OVERTIME_RAND_OFFSET = ModuleRandSeed.ROTATION;

@ccclass('cc.RotationOvertimeModule')
export default class RotationOvertimeModule extends ParticleModuleBase {
    @serializable
    _enable = false;
    /**
     * @zh 是否启用。
     */
    @displayOrder(0)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        if (this._enable === val) return;
        this._enable = val;
        if (!this.target) return;
        this.target.enableModule(this.name, val, this);
    }

    @serializable
    private _separateAxes = false;

    /**
     * @zh 是否三个轴分开设定旋转（暂不支持）。
     */
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
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(2)
    @tooltip('i18n:rotationOvertimeModule.x')
    @visible(function (this: RotationOvertimeModule): boolean { return this.separateAxes; })
    public x = new CurveRange();

    /**
     * @zh 绕 Y 轴设定旋转。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(3)
    @tooltip('i18n:rotationOvertimeModule.y')
    @visible(function (this: RotationOvertimeModule): boolean { return this.separateAxes; })
    public y = new CurveRange();

    /**
     * @zh 绕 Z 轴设定旋转。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(4)
    @tooltip('i18n:rotationOvertimeModule.z')
    public z = new CurveRange();

    public name = PARTICLE_MODULE_NAME.ROTATION;

    private _startMat:Mat4 = new Mat4();
    private _matRot:Mat4 = new Mat4();
    private _quatRot:Quat = new Quat();
    private _otherEuler:Vec3 = new Vec3();

    private _processRotation (p: Particle, r2d: number) {
        // Same as the particle-vs-legacy.chunk glsl statemants
        const renderMode = p.particleSystem.processor.getInfo().renderMode;
        if (renderMode !== RenderMode.Mesh) {
            if (renderMode === RenderMode.StrecthedBillboard) {
                this._quatRot.set(0, 0, 0, 1);
            }
        }

        Quat.normalize(this._quatRot, this._quatRot);
        if (this._quatRot.w < 0.0) { // Use vec3 to save quat so we need identify negative w
            this._quatRot.x += Particle.INDENTIFY_NEG_QUAT; // Indentify negative w & revert the quat in shader
        }
    }

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const rotationRand = pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET);
        const renderMode = p.particleSystem.processor.getInfo().renderMode;

        if ((!this._separateAxes) || (renderMode === RenderMode.VerticalBillboard || renderMode === RenderMode.HorizontalBillboard)) {
            Quat.fromEuler(p.deltaQuat, 0, 0, this.z.evaluate(normalizedTime, rotationRand)! * dt * Particle.R2D);
        } else {
            Quat.fromEuler(p.deltaQuat, this.x.evaluate(normalizedTime, rotationRand)! * dt * Particle.R2D, this.y.evaluate(normalizedTime, rotationRand)! * dt * Particle.R2D, this.z.evaluate(normalizedTime, rotationRand)! * dt * Particle.R2D);
        }

        // Rotation-overtime combine with start rotation, after that we get quat from the mat
        p.deltaMat = Mat4.fromQuat(p.deltaMat, p.deltaQuat);
        p.localMat = p.localMat.multiply(p.deltaMat); // accumulate rotation

        if (!p.startRotated) {
            if (renderMode !== RenderMode.Mesh) {
                if (renderMode === RenderMode.StrecthedBillboard) {
                    p.startEuler.set(0, 0, 0);
                } else if (renderMode !== RenderMode.Billboard) {
                    p.startEuler.set(0, 0, p.startEuler.z);
                }
            }
            Quat.fromEuler(p.startRotation, p.startEuler.x * Particle.R2D, p.startEuler.y * Particle.R2D, p.startEuler.z * Particle.R2D);
            p.startRotated = true;
        }

        this._startMat = Mat4.fromQuat(this._startMat, p.startRotation);
        this._matRot = this._startMat.multiply(p.localMat);

        Mat4.getRotation(this._quatRot, this._matRot);
        this._processRotation(p, Particle.R2D);
        p.rotation.set(this._quatRot.x, this._quatRot.y, this._quatRot.z);
    }
}
