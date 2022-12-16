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
import { pseudoRandom, Quat, Vec3 } from '../../core/math';
import { Space, ModuleRandSeed } from '../enum';
import { calculateTransform } from '../particle-general-function';
import CurveRange from './curve-range';

import { ParticleModule, PARTICLE_MODULE_NAME } from '../particle';
import { Enum } from '../../core';
import { ParticleUpdateContext } from '../particle-update-context';
import { ParticleSOAData } from '../particle-soa-data';

const FORCE_OVERTIME_RAND_OFFSET = ModuleRandSeed.FORCE;

const _temp_v3 = new Vec3();

@ccclass('cc.ForceOvertimeModule')
export default class ForceOvertimeModule extends ParticleModule {
    /**
     * @zh 是否启用。
     */
    @displayOrder(0)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        this._enable = val;
    }

    /**
     * @zh X 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(2)
    @tooltip('i18n:forceOvertimeModule.x')
    public x = new CurveRange();

    /**
     * @zh Y 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(3)
    @tooltip('i18n:forceOvertimeModule.y')
    public y = new CurveRange();

    /**
     * @zh Z 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(4)
    @tooltip('i18n:forceOvertimeModule.z')
    public z = new CurveRange();

    /**
     * @zh 加速度计算时采用的坐标系 [[Space]]。
     */
    @type(Enum(Space))
    @serializable
    @displayOrder(1)
    @tooltip('i18n:forceOvertimeModule.space')
    public space = Space.LOCAL;

    // TODO:currently not supported
    public randomized = false;

    private rotation: Quat;
    @serializable
    private _enable = false;

    constructor () {
        super();
        this.rotation = new Quat();
    }

    public update (particles: ParticleSOAData, context: ParticleUpdateContext) {
        const needTransform = calculateTransform(context.simulationSpace, this.space, context.worldTransform, this.rotation);
        const dt = context.deltaTime;
        const { count, normalizedAliveTime, randomSeed } = particles;
        if (needTransform) {
            for (let i = 0; i < count; i++) {
                const normalizedTime = normalizedAliveTime[i];
                const seed = randomSeed[i] + FORCE_OVERTIME_RAND_OFFSET;
                const force = Vec3.set(_temp_v3,
                    this.x.evaluate(normalizedTime, pseudoRandom(seed)),
                    this.y.evaluate(normalizedTime, pseudoRandom(seed)),
                    this.z.evaluate(normalizedTime, pseudoRandom(seed)));
                Vec3.transformQuat(force, force, this.rotation);
                force.multiplyScalar(dt);
                particles.addVelocityAt(force, i);
            }
        } else {
            for (let i = 0; i < count; i++) {
                const normalizedTime = normalizedAliveTime[i];
                const seed = randomSeed[i] + FORCE_OVERTIME_RAND_OFFSET;
                const force = Vec3.set(_temp_v3,
                    this.x.evaluate(normalizedTime, pseudoRandom(seed)),
                    this.y.evaluate(normalizedTime, pseudoRandom(seed)),
                    this.z.evaluate(normalizedTime, pseudoRandom(seed)));
                force.multiplyScalar(dt);
                particles.addVelocityAt(force, i);
            }
        }
    }
}
