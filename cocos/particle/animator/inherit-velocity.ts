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

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { Enum, Mat3, Mat4, pseudoRandom, Quat, toRadian, Vec3 } from '../../core';
import { range } from '../../core/data/decorators';
import { Space, ModuleRandSeed } from '../enum';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';

export const InheritMode = Enum({
    Initial: 0,
    Current: 1,
});

const INHERIT_VELOCITY_RAND = ModuleRandSeed.INHERIT_VELOCITY;

const _temp_vel = new Vec3();
const _out_vel = new Vec3();
const _world_mat4 = new Mat4();
const _world_mat3 = new Mat3();

@ccclass('cc.InheritVelocityModule')
export default class InheritVelocityModule extends ParticleModuleBase {
    public name: string = PARTICLE_MODULE_NAME.INHERIT;

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
    _mode = InheritMode.Initial;

    @type(InheritMode)
    @displayOrder(1)
    public get mode () {
        return this._mode;
    }

    public set mode (val) {
        this._mode = val;
    }

    @type(CurveRange)
    @serializable
    @range([0, Number.POSITIVE_INFINITY])
    @displayOrder(2)
    public speedModifier = new CurveRange();

    constructor () {
        super();
        this.speedModifier.constant = 1;
        this.needUpdate = true;
    }

    public update (ps, space, worldTransform) {
        this.speedModifier.bake();
    }

    private caculateWorldVelocity (outVel: Vec3, p: Particle, parentPs, vel: Vec3) {
        const ps = p.particleSystem;
        if (ps) {
            if (this.mode === InheritMode.Initial) {
                Vec3.copy(outVel, vel);
            } else if (this.mode === InheritMode.Current) {
                if (parentPs.simulationSpace === Space.World) {
                    Vec3.copy(outVel, vel);
                } else {
                    parentPs.node.getWorldMatrix(_world_mat4);
                    Mat3.fromMat4(_world_mat3, _world_mat4);
                    Vec3.transformMat3(outVel, vel, _world_mat3);
                }
            }
        }
    }

    public animate (p: Particle, dt: number): void {
        const ps = p.particleSystem;
        if (ps) {
            const parentParicle: Particle | null = p.parentParticle;
            if (parentParicle && ps.simulationSpace === Space.World) {
                const currentVelocity = parentParicle.ultimateVelocity;
                const initialVelocity = parentParicle.initialVelocity;

                const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
                const speedMod = this.speedModifier.evaluate(normalizedTime, pseudoRandom(p.randomSeed + INHERIT_VELOCITY_RAND));

                if (this.mode === InheritMode.Initial) {
                    Vec3.copy(_temp_vel, initialVelocity);
                } else if (this.mode === InheritMode.Current) {
                    Vec3.copy(_temp_vel, currentVelocity);
                }
                Vec3.multiplyScalar(_temp_vel, _temp_vel, speedMod);
                this.caculateWorldVelocity(_out_vel, p, parentParicle.particleSystem, _temp_vel);
                Vec3.add(p.animatedVelocity, p.animatedVelocity, _out_vel);

                Vec3.add(p.ultimateVelocity, p.velocity, p.animatedVelocity);
            }
        }
    }
}
