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

import { ccclass, tooltip, displayOrder, range, type, serializable } from 'cc.decorator';
import { pseudoRandom, Quat, Vec3 } from '../../core';
import { Space, ModuleRandSeed } from '../enum';
import { calculateTransform, isCurveTwoValues } from '../particle-general-function';
import CurveRange from './curve-range';

import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';

const FORCE_OVERTIME_RAND_OFFSET = ModuleRandSeed.FORCE;

const _temp_v3 = new Vec3();

@ccclass('cc.ForceOvertimeModule')
export default class ForceOvertimeModule extends ParticleModuleBase {
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
     * @zh X 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(2)
    @tooltip('i18n:forceOvertimeModule.x')
    public x = new CurveRange();

    /**
     * @zh Y 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(3)
    @tooltip('i18n:forceOvertimeModule.y')
    public y = new CurveRange();

    /**
     * @zh Z 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(4)
    @tooltip('i18n:forceOvertimeModule.z')
    public z = new CurveRange();

    /**
     * @zh 加速度计算时采用的坐标系 [[Space]]。
     */
    @type(Space)
    @serializable
    @displayOrder(1)
    @tooltip('i18n:forceOvertimeModule.space')
    public space = Space.Local;

    // TODO:currently not supported
    public randomized = false;

    private rotation: Quat;
    private needTransform: boolean;
    public name = PARTICLE_MODULE_NAME.FORCE;

    constructor () {
        super();
        this.rotation = new Quat();
        this.needTransform = false;
        this.needUpdate = true;
    }

    public update (space, worldTransform) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    public animate (p: Particle, dt) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const randX = isCurveTwoValues(this.x) ? pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET) : 0;
        const randY = isCurveTwoValues(this.y) ? pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET) : 0;
        const randZ = isCurveTwoValues(this.z) ? pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET) : 0;

        const force = Vec3.set(_temp_v3,
            this.x.evaluate(normalizedTime, randX)!,
            this.y.evaluate(normalizedTime, randY)!,
            this.z.evaluate(normalizedTime, randZ)!);
        if (this.needTransform) {
            Vec3.transformQuat(force, force, this.rotation);
        }
        Vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);
        Vec3.copy(p.ultimateVelocity, p.velocity);
    }
}
