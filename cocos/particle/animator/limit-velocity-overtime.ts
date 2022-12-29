/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, tooltip, displayOrder, range, type, serializable, visible } from 'cc.decorator';
import { lerp, pseudoRandom, Vec3, Mat4, Quat } from '../../core';
import { Space, ModuleRandSeed } from '../enum';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';
import { calculateTransform, isCurveTwoValues } from '../particle-general-function';

const LIMIT_VELOCITY_RAND_OFFSET = ModuleRandSeed.LIMIT;

const _temp_v3 = new Vec3();
const _temp_v3_1 = new Vec3();

@ccclass('cc.LimitVelocityOvertimeModule')
export default class LimitVelocityOvertimeModule extends ParticleModuleBase {
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
     * @zh X 轴方向上的速度下限。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(4)
    @tooltip('i18n:limitVelocityOvertimeModule.limitX')
    @visible(function (this: LimitVelocityOvertimeModule): boolean {
        return this.separateAxes;
    })
    public limitX = new CurveRange();

    /**
     * @zh Y 轴方向上的速度下限。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(5)
    @tooltip('i18n:limitVelocityOvertimeModule.limitY')
    @visible(function (this: LimitVelocityOvertimeModule): boolean {
        return this.separateAxes;
    })
    public limitY = new CurveRange();

    /**
     * @zh Z 轴方向上的速度下限。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(6)
    @tooltip('i18n:limitVelocityOvertimeModule.limitZ')
    @visible(function (this: LimitVelocityOvertimeModule): boolean {
        return this.separateAxes;
    })
    public limitZ = new CurveRange();

    /**
     * @zh 速度下限。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(3)
    @tooltip('i18n:limitVelocityOvertimeModule.limit')
    @visible(function (this: LimitVelocityOvertimeModule): boolean {
        return !this.separateAxes;
    })
    public limit = new CurveRange();

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
    public space = Space.Local;

    // TODO:functions related to drag are temporarily not supported
    public drag = null;
    public multiplyDragByParticleSize = false;
    public multiplyDragByParticleVelocity = false;
    public name = PARTICLE_MODULE_NAME.LIMIT;
    private rotation: Quat;
    private needTransform: boolean;

    constructor () {
        super();
        this.rotation = new Quat();
        this.needTransform = false;
        this.needUpdate = true;
    }

    public update (space: number, worldTransform: Mat4) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const dampedVel = _temp_v3;
        if (this.separateAxes) {
            const randX = isCurveTwoValues(this.limitX) ? pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET) : 0;
            const randY = isCurveTwoValues(this.limitY) ? pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET) : 0;
            const randZ = isCurveTwoValues(this.limitZ) ? pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET) : 0;
            Vec3.set(_temp_v3_1,
                this.limitX.evaluate(normalizedTime, randX)!,
                this.limitY.evaluate(normalizedTime, randY)!,
                this.limitZ.evaluate(normalizedTime, randZ)!);
            if (this.needTransform) {
                Vec3.transformQuat(_temp_v3_1, _temp_v3_1, this.rotation);
            }
            Vec3.set(dampedVel,
                dampenBeyondLimit(p.ultimateVelocity.x, _temp_v3_1.x, this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.y, _temp_v3_1.y, this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.z, _temp_v3_1.z, this.dampen));
        } else {
            Vec3.normalize(dampedVel, p.ultimateVelocity);
            const rand = isCurveTwoValues(this.limit) ? pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET) : 0;
            Vec3.multiplyScalar(dampedVel, dampedVel,
                dampenBeyondLimit(p.ultimateVelocity.length(), this.limit.evaluate(normalizedTime, rand)!, this.dampen));
        }
        Vec3.copy(p.ultimateVelocity, dampedVel);
        Vec3.copy(p.velocity, p.ultimateVelocity);
    }
}

function dampenBeyondLimit (vel: number, limit: number, dampen: number) {
    const sgn = Math.sign(vel);
    let abs = Math.abs(vel);
    if (abs > limit) {
        const absToGive = abs - abs * dampen;
        if (absToGive > limit) {
            abs = absToGive;
        } else {
            abs = limit;
        }
    }
    return abs * sgn;
}
