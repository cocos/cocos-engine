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

import { ccclass, tooltip, displayOrder, type, serializable, range } from 'cc.decorator';
import { Color, Mat4, Quat, toRadian, Vec3 } from '../../core/math';
import { CurveRange } from '../curve-range';
import { GradientRange } from '../gradient-range';
import { Space, TextureMode, TrailMode } from '../enum';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { Enum } from '../../core';

const PRE_TRIANGLE_INDEX = 1;
const NEXT_TRIANGLE_INDEX = 1 << 2;
const DIRECTION_THRESHOLD = Math.cos(toRadian(100));

const _temp_quat = new Quat();
const _temp_xform = new Mat4();
const _temp_vec3 = new Vec3();
const _temp_vec3_1 = new Vec3();
const _temp_color = new Color();

@ccclass('cc.TrailModule')
export class TrailModule extends ParticleModule {
    /**
     * 设定粒子生成轨迹的方式。
     */
    @type(TrailMode)
    @serializable
    @displayOrder(1)
    @tooltip('i18n:trailSegment.mode')
    public mode = TrailMode.Particles;

    /**
     * 轨迹存在的生命周期。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(3)
    @tooltip('i18n:trailSegment.lifeTime')
    public lifeTime = new CurveRange();

    /**
     * 每个轨迹粒子之间的最小间距。
     */
    @displayOrder(5)
    @tooltip('i18n:trailSegment.minParticleDistance')
    public get minParticleDistance () {
        return this._minParticleDistance;
    }

    public set minParticleDistance (val) {
        this._minParticleDistance = val;
    }

    @type(Enum(Space))
    @displayOrder(6)
    @tooltip('i18n:trailSegment.space')
    public get space () {
        return this._space;
    }

    public set space (val) {
        this._space = val;
    }

    /**
     * 粒子本身是否存在。
     */
    @serializable
    public existWithParticles = true;

    /**
     * 设定纹理填充方式。
     */
    @type(TextureMode)
    @serializable
    @displayOrder(8)
    @tooltip('i18n:trailSegment.textureMode')
    public textureMode = TextureMode.Stretch;

    @serializable
    @displayOrder(9)
    @tooltip('i18n:trailSegment.widthFromParticle')
    public widthFromParticle = true;

    /**
     * 控制轨迹长度的曲线。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(10)
    @tooltip('i18n:trailSegment.widthRatio')
    public widthRatio = new CurveRange();

    @serializable
    @displayOrder(11)
    @tooltip('i18n:trailSegment.colorFromParticle')
    public colorFromParticle = false;

    @type(GradientRange)
    @serializable
    @displayOrder(12)
    @tooltip('i18n:trailSegment.colorOverTrail')
    public colorOverTrail = new GradientRange();

    @type(GradientRange)
    @serializable
    @displayOrder(13)
    @tooltip('i18n:trailSegment.colorOvertime')
    public colorOvertime = new GradientRange();

    public get name (): string {
        return 'TrailModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.POST_UPDATE;
    }

    /**
     * 轨迹设定时的坐标系。
     */
    @serializable
    private _space = Space.World;
    private _needTransform = false;
    @serializable
    private _minParticleDistance = 0.1;

    // public update () {
    //     this._trailLifetime = this.lifeTime.evaluate(this._particleSystem._time, 1)!;
    //     if (this.space === Space.World && this._particleSystem._simulationSpace === Space.Local) {
    //         this._needTransform = true;
    //         this._particleSystem.node.getWorldMatrix(_temp_xform);
    //         this._particleSystem.node.getWorldRotation(_temp_quat);
    //     } else {
    //         this._needTransform = false;
    //     }
    // }

    // public animate (p: Particle, scaledDt: number) {
    //     if (!this._trailSegments) {
    //         return;
    //     }

    //     if (p.loopCount > p.lastLoop) {
    //         if (p.trailDelay > 1) {
    //             p.lastLoop = p.loopCount;
    //             p.trailDelay = 0;
    //         } else {
    //             p.trailDelay++;
    //         }
    //         return;
    //     }

    //     let trail = this._particleTrail.get(p);
    //     if (!trail) {
    //         trail = this._trailSegments.alloc();
    //         this._particleTrail.set(p, trail);
    //         // Avoid position and trail are one frame apart at the end of the particle animation.
    //         return;
    //     }
    //     let lastSeg = trail.getElement(trail.end - 1);
    //     if (this._needTransform) {
    //         Vec3.transformMat4(_temp_vec3, p.position, _temp_xform);
    //     } else {
    //         Vec3.copy(_temp_vec3, p.position);
    //     }
    //     if (lastSeg) {
    //         trail.iterateElement(this, this._updateTrailElement, p, scaledDt);
    //         if (Vec3.squaredDistance(lastSeg.position, _temp_vec3) < this._minSquaredDistance) {
    //             return;
    //         }
    //     }
    //     lastSeg = trail.addElement();
    //     if (!lastSeg) {
    //         return;
    //     }

    //     Vec3.copy(lastSeg.position, _temp_vec3);
    //     lastSeg.lifetime = 0;
    //     if (this.widthFromParticle) {
    //         lastSeg.width = p.size.x * this.widthRatio.evaluate(0, 1)!;
    //     } else {
    //         lastSeg.width = this.widthRatio.evaluate(0, 1)!;
    //     }

    //     const trailNum = trail.count();
    //     if (trailNum === 2) {
    //         const lastSecondTrail = trail.getElement(trail.end - 2)!;
    //         Vec3.subtract(lastSecondTrail.velocity, lastSeg.position, lastSecondTrail.position);
    //     } else if (trailNum > 2) {
    //         const lastSecondTrail = trail.getElement(trail.end - 2)!;
    //         const lastThirdTrail = trail.getElement(trail.end - 3)!;
    //         Vec3.subtract(_temp_vec3, lastThirdTrail.position, lastSecondTrail.position);
    //         Vec3.subtract(_temp_vec3_1, lastSeg.position, lastSecondTrail.position);
    //         Vec3.subtract(lastSecondTrail.velocity, _temp_vec3_1, _temp_vec3);
    //         if (Vec3.equals(Vec3.ZERO, lastSecondTrail.velocity)) {
    //             Vec3.copy(lastSecondTrail.velocity, _temp_vec3);
    //         }
    //         Vec3.normalize(lastSecondTrail.velocity, lastSecondTrail.velocity);
    //         this._checkDirectionReverse(lastSecondTrail, lastThirdTrail);
    //     }
    //     if (this.colorFromParticle) {
    //         lastSeg.color.set(p.color);
    //     } else {
    //         lastSeg.color.set(this.colorOvertime.evaluate(0, 1));
    //     }
    // }

    // private _updateTrailElement (module: any, trailEle: ITrailElement, p: Particle, dt: number): boolean {
    //     trailEle.lifetime += dt;
    //     if (module.colorFromParticle) {
    //         trailEle.color.set(p.color);
    //         trailEle.color.multiply(module.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
    //     } else {
    //         trailEle.color.set(module.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
    //     }
    //     if (module.widthFromParticle) {
    //         trailEle.width = p.size.x * module.widthRatio.evaluate(trailEle.lifetime / module._trailLifetime, 1)!;
    //     } else {
    //         trailEle.width = module.widthRatio.evaluate(trailEle.lifetime / module._trailLifetime, 1)!;
    //     }
    //     return trailEle.lifetime > module._trailLifetime;
    // }

    // private _checkDirectionReverse (currElement: ITrailElement, prevElement: ITrailElement) {
    //     if (Vec3.dot(currElement.velocity, prevElement.velocity) < DIRECTION_THRESHOLD) {
    //         currElement.direction = 1 - prevElement.direction;
    //     } else {
    //         currElement.direction = prevElement.direction;
    //     }
    // }
}
