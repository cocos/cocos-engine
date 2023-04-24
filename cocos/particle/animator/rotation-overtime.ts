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
import { ParticleSystem } from '../particle-system';

const ROTATION_OVERTIME_RAND_OFFSET = ModuleRandSeed.ROTATION;
const _temp_rot = new Quat();

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
    private renderMode;

    constructor () {
        super();
        this.needUpdate = true;
    }

    public update (ps: ParticleSystem, space: number, worldTransform: Mat4) {
        this.renderMode = ps.processor.getInfo().renderMode;
        this.x.bake();
        this.y.bake();
        this.z.bake();
    }

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const rotationRand = pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET);

        if ((!this._separateAxes) || (this.renderMode === RenderMode.VerticalBillboard || this.renderMode === RenderMode.HorizontalBillboard)) {
            Quat.fromEuler(p.deltaQuat, 0, 0, this.z.evaluate(normalizedTime, rotationRand)! * dt * Particle.R2D);
        } else {
            Quat.fromEuler(p.deltaQuat, this.x.evaluate(normalizedTime, rotationRand)! * dt * Particle.R2D, this.y.evaluate(normalizedTime, rotationRand)! * dt * Particle.R2D, this.z.evaluate(normalizedTime, rotationRand)! * dt * Particle.R2D);
        }

        // Rotation-overtime combine with start rotation
        Quat.multiply(p.localQuat, p.localQuat, p.deltaQuat); // accumulate rotation
        Quat.normalize(p.localQuat, p.localQuat);
        if (!p.startRotated) {
            if (this.renderMode !== RenderMode.Mesh) {
                if (this.renderMode === RenderMode.StrecthedBillboard) {
                    p.startEuler.set(0, 0, 0);
                } else if (this.renderMode !== RenderMode.Billboard) {
                    p.startEuler.set(0, 0, p.startEuler.z);
                }
            }
            Quat.fromEuler(p.startRotation, p.startEuler.x * Particle.R2D, p.startEuler.y * Particle.R2D, p.startEuler.z * Particle.R2D);
            Quat.normalize(p.startRotation, p.startRotation);
            p.startRotated = true;
        }

        Quat.multiply(_temp_rot, p.startRotation, p.localQuat);
        Quat.normalize(_temp_rot, _temp_rot);

        Quat.toEuler(p.rotation, _temp_rot, true);
        Vec3.set(p.rotation, p.rotation.x / Particle.R2D, p.rotation.y / Particle.R2D, p.rotation.z / Particle.R2D);
    }
}
