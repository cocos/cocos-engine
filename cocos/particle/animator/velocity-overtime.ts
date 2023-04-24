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
import { Mat4, Mat3, pseudoRandom, Quat, Vec3, EPSILON, approx } from '../../core/math';
import { Space, ModuleRandSeed } from '../enum';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import { calculateTransform } from '../particle-general-function';
import CurveRange from './curve-range';
import { ParticleSystem } from '../particle-system';

const VELOCITY_X_OVERTIME_RAND_OFFSET = ModuleRandSeed.VELOCITY_X;
const VELOCITY_Y_OVERTIME_RAND_OFFSET = ModuleRandSeed.VELOCITY_Y;
const VELOCITY_Z_OVERTIME_RAND_OFFSET = ModuleRandSeed.VELOCITY_Z;

const _temp_v3 = new Vec3();
const _temp_quat = new Quat();
const _temp_mat3 = new Mat3();
const _temp_new = new Vec3();
const _temp_normalize = new Vec3();
const _temp_old = new Vec3();

@ccclass('cc.VelocityOvertimeModule')
export default class VelocityOvertimeModule extends ParticleModuleBase {
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
     * @zh 速度修正系数（只支持 CPU 粒子）。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(5)
    @tooltip('i18n:velocityOvertimeModule.speedModifier')
    public speedModifier = new CurveRange();

    /**
     * @zh 沿 X 轴的轨道速度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(6)
    @tooltip('i18n:velocityOvertimeModule.orbitX')
    public orbitX = new CurveRange();
    /**
     * @zh 沿 Y 轴的轨道速度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(7)
    @tooltip('i18n:velocityOvertimeModule.orbitY')
    public orbitY = new CurveRange();

    /**
     * @zh 沿 Z 轴的轨道速度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(8)
    @tooltip('i18n:velocityOvertimeModule.orbitZ')
    public orbitZ = new CurveRange();

    /**
     * @zh 沿 X 轴的轨道偏移。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(9)
    @tooltip('i18n:velocityOvertimeModule.offsetX')
    public offsetX = new CurveRange();

    /**
     * @zh 沿 Y 轴的轨道偏移。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(10)
    @tooltip('i18n:velocityOvertimeModule.offsetY')
    public offsetY = new CurveRange();

    /**
     * @zh 沿 Z 轴的轨道偏移。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(11)
    @tooltip('i18n:velocityOvertimeModule.offsetZ')
    public offsetZ = new CurveRange();

    /**
     * @zh 轨道半径。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(12)
    @tooltip('i18n:velocityOvertimeModule.radius')
    public radius = new CurveRange();

    /**
     * @zh 速度计算时采用的坐标系[[Space]]。
     */
    @type(Space)
    @serializable
    @displayOrder(1)
    @tooltip('i18n:velocityOvertimeModule.space')
    public space = Space.Local;

    private rotation: Quat;
    private needTransform: boolean;
    public name = PARTICLE_MODULE_NAME.VELOCITY;
    private worldToLocal: Mat3;
    private localToWorld: Mat3;
    private hasOrbital: boolean;

    constructor () {
        super();
        this.rotation = new Quat();
        this.speedModifier.constant = 1;
        this.needTransform = false;
        this.needUpdate = true;
        this.worldToLocal = new Mat3();
        this.localToWorld = new Mat3();
        this.hasOrbital = false;
    }

    public update (ps: ParticleSystem, space: number, worldTransform: Mat4) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
        this.hasOrbital = this.offsetX.getMaxAbs() > 0 || this.offsetY.getMaxAbs() > 0 || this.offsetZ.getMaxAbs() > 0
            || this.orbitX.getMaxAbs() > 0 || this.orbitY.getMaxAbs() > 0 || this.orbitZ.getMaxAbs() > 0;
        if (this.needTransform) {
            if (this.hasOrbital) {
                Mat3.fromMat4(this.localToWorld, worldTransform);
                Mat3.invert(this.worldToLocal, this.localToWorld);
            }
        }
        this.offsetX.bake();
        this.offsetY.bake();
        this.offsetZ.bake();
        this.radius.bake();
        this.orbitX.bake();
        this.orbitY.bake();
        this.orbitZ.bake();
        this.speedModifier.bake();
        this.x.bake();
        this.y.bake();
        this.z.bake();
    }

    private calculateOrbital (p: Particle, dt: number, normalizedTime: number, speedMod: number) {
        const offX = this.offsetX.evaluate(normalizedTime, pseudoRandom(p.randomSeed ^ VELOCITY_X_OVERTIME_RAND_OFFSET))!;
        const offY = this.offsetY.evaluate(normalizedTime, pseudoRandom(p.randomSeed ^ VELOCITY_X_OVERTIME_RAND_OFFSET))!;
        const offZ = this.offsetZ.evaluate(normalizedTime, pseudoRandom(p.randomSeed ^ VELOCITY_X_OVERTIME_RAND_OFFSET))!;
        const offset = Vec3.set(_temp_v3, offX, offY, offZ);

        const radial = this.radius.evaluate(normalizedTime, pseudoRandom(p.randomSeed)) * dt;

        const avelX = this.orbitX.evaluate(normalizedTime, pseudoRandom(p.randomSeed ^ VELOCITY_X_OVERTIME_RAND_OFFSET))! * dt * Particle.R2D;
        const avelY = this.orbitY.evaluate(normalizedTime, pseudoRandom(p.randomSeed ^ VELOCITY_Y_OVERTIME_RAND_OFFSET))! * dt * Particle.R2D;
        const avelZ = this.orbitZ.evaluate(normalizedTime, pseudoRandom(p.randomSeed ^ VELOCITY_Z_OVERTIME_RAND_OFFSET))! * dt * Particle.R2D;
        const angM = Mat3.fromQuat(_temp_mat3, Quat.fromEuler(_temp_quat, avelX, avelY, avelZ));

        _temp_old.set(p.position);
        if (this.needTransform) {
            Vec3.transformMat3(_temp_old, _temp_old, this.worldToLocal);
        }
        Vec3.subtract(_temp_old, _temp_old, offset);

        _temp_new.set(_temp_old);
        Vec3.transformMat3(_temp_new, _temp_new, angM);
        Vec3.normalize(_temp_normalize, _temp_new);
        Vec3.multiplyScalar(_temp_normalize, _temp_normalize, radial);
        Vec3.add(_temp_new, _temp_new, _temp_normalize);
        let animatedVelocity = Vec3.subtract(_temp_new, _temp_new, _temp_old);
        if (this.needTransform) {
            animatedVelocity = Vec3.transformMat3(_temp_new, _temp_new, this.localToWorld);
        }

        Vec3.multiplyScalar(animatedVelocity, animatedVelocity, 1 / dt);
        Vec3.add(p.animatedVelocity, p.animatedVelocity, animatedVelocity);
    }

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const vel = Vec3.set(_temp_v3, this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed ^ VELOCITY_X_OVERTIME_RAND_OFFSET))!, this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed ^ VELOCITY_Y_OVERTIME_RAND_OFFSET))!, this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed ^ VELOCITY_Z_OVERTIME_RAND_OFFSET))!);
        if (this.needTransform) {
            Vec3.transformQuat(vel, vel, this.rotation);
        }
        Vec3.add(p.animatedVelocity, p.animatedVelocity, vel);

        const speedMod = this.speedModifier.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_X_OVERTIME_RAND_OFFSET))!;

        if (this.hasOrbital) {
            this.calculateOrbital(p, dt, normalizedTime, speedMod);
        }

        Vec3.add(p.ultimateVelocity, p.velocity, p.animatedVelocity);
        Vec3.multiplyScalar(p.ultimateVelocity, p.ultimateVelocity, speedMod);
    }
}
