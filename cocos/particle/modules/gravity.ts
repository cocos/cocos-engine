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

import { ccclass, displayOrder, range, serializable, tooltip, type } from "../../core/data/decorators";
import { ParticleModule, ParticleUpdateStage } from "../particle-module";
import { ParticleSOAData } from "../particle-soa-data";
import { ParticleUpdateContext } from "../particle-update-context";
import { CurveRange } from "../curve-range";
import { approx, EPSILON, pseudoRandom } from "../../core/math";
import { Space } from "../enum";

@ccclass('cc.GravityModule')
export class GravityModule extends ParticleModule {

    /**
     * @zh 粒子受重力影响的重力系数。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(13)
    @tooltip('i18n:particle_system.gravityModifier')
    public gravityModifier = new CurveRange();

    public get name (): string {
        return 'GravityModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.PRE_UPDATE;
    }

    public update(particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        if (particleUpdateContext.simulationSpace === Space.LOCAL) {
            const r: Quat = this.node.getRotation();
            Mat4.fromQuat(this._localMat, r);
            this._localMat.transpose(); // just consider rotation, use transpose as invert
        }

        if (this.node.parent) {
            this.node.parent.getWorldMatrix(_tempParentInverse);
            _tempParentInverse.invert();
        }
        if (ps.simulationSpace === Space.LOCAL) {
            const gravityFactor = -this.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed))! * 9.8 * dt;
            this._gravity.x = 0.0;
            this._gravity.y = gravityFactor;
            this._gravity.z = 0.0;
            this._gravity.w = 1.0;
            if (!approx(gravityFactor, 0.0, EPSILON)) {
                if (this.node.parent) {
                    this._gravity = this._gravity.transformMat4(_tempParentInverse);
                }
                this._gravity = this._gravity.transformMat4(this._localMat);

                p.velocity.x += this._gravity.x;
                p.velocity.y += this._gravity.y;
                p.velocity.z += this._gravity.z;
            }
        } else {
            // apply gravity.
            p.velocity.y -= ps.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed))! * 9.8 * dt;
        }
    }

}