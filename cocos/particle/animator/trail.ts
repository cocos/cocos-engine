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
import { Material } from '../../core/assets/material';
import { RenderingSubMesh } from '../../core/assets/rendering-sub-mesh';
import { director } from '../../core/director';
import { AttributeName, BufferUsageBit, Format, FormatInfos, MemoryUsageBit, PrimitiveMode,
    Device, Attribute, Buffer, IndirectBuffer, BufferInfo, DrawInfo, DRAW_INFO_SIZE } from '../../core/gfx';
import { Color, Mat4, Quat, toRadian, Vec3 } from '../../core/math';
import { Pool } from '../../core/memop';
import { scene } from '../../core/renderer';
import CurveRange from './curve-range';
import GradientRange from './gradient-range';
import { Space, TextureMode, TrailMode } from '../enum';
import { Particle, ParticleModule } from '../particle';
import { legacyCC } from '../../core/global-exports';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { warnID } from '../../core';

const PRE_TRIANGLE_INDEX = 1;
const NEXT_TRIANGLE_INDEX = 1 << 2;
const DIRECTION_THRESHOLD = Math.cos(toRadian(100));

const _temp_trailEle = { position: new Vec3(), velocity: new Vec3() } as ITrailElement;
const _temp_quat = new Quat();
const _temp_xform = new Mat4();
const _temp_vec3 = new Vec3();
const _temp_vec3_1 = new Vec3();
const _temp_color = new Color();

// const barycentric = [1, 0, 0, 0, 1, 0, 0, 0, 1]; // <wireframe debug>

// let _bcIdx = 0; // <wireframe debug>

interface ITrailElement {
    position: Vec3;
    lifetime: number;
    width: number;
    velocity: Vec3;
    direction: number; // if one element's direction differs from the previous one,it means the trail's direction reverse.
    color: Color;
}

// the valid element is in [start,end) range.if start equals -1,it represents the array is empty.
class TrailSegment {
    public start: number;
    public end: number;
    public trailElements: ITrailElement[];

    constructor (maxTrailElementNum: number) {
        this.start = -1;
        this.end = -1;
        this.trailElements = [];
        while (maxTrailElementNum--) {
            this.trailElements.push({
                position: new Vec3(),
                lifetime: 0,
                width: 0,
                velocity: new Vec3(),
                direction: 0,
                color: new Color(),
            });
        }
    }

    public getElement (idx: number) {
        if (this.start === -1) {
            return null;
        }
        if (idx < 0) {
            idx = (idx + this.trailElements.length) % this.trailElements.length;
        }
        if (idx >= this.trailElements.length) {
            idx %= this.trailElements.length;
        }
        return this.trailElements[idx];
    }

    public addElement (): ITrailElement | null {
        if (this.trailElements.length === 0) {
            return null;
        }
        if (this.start === -1) {
            this.start = 0;
            this.end = 1;
            return this.trailElements[0];
        }
        if (this.start === this.end) {
            this.trailElements.splice(this.end, 0, {
                position: new Vec3(),
                lifetime: 0,
                width: 0,
                velocity: new Vec3(),
                direction: 0,
                color: new Color(),
            });
            this.start++;
            this.start %= this.trailElements.length;
        }
        const newEleLoc = this.end++;
        this.end %= this.trailElements.length;
        return this.trailElements[newEleLoc];
    }

    // eslint-disable-next-line max-len
    public iterateElement (target: TrailModule, f: (target: TrailModule, e: ITrailElement, p: Particle, dt: number) => boolean, p: Particle, dt: number) {
        const end = this.start >= this.end ? this.end + this.trailElements.length : this.end;
        for (let i = this.start; i < end; i++) {
            if (f(target, this.trailElements[i % this.trailElements.length], p, dt)) {
                this.start++;
                this.start %= this.trailElements.length;
            }
        }
        if (this.start === end) {
            this.start = -1;
            this.end = -1;
        }
    }

    public count () {
        if (this.start < this.end) {
            return this.end - this.start;
        } else {
            return this.trailElements.length + this.end - this.start;
        }
    }

    public clear () {
        this.start = -1;
        this.end = -1;
    }

    // <debug>
    // public _print () {
    //     let msg = String();
    //     this.iterateElement(this, (target: object, e: ITrailElement, p: Particle, dt: number) => {
    //         msg += 'pos:' + e.position.toString() + ' lifetime:' + e.lifetime + ' dir:' + e.direction +
    //                ' velocity:' + e.velocity.toString() + '\n';
    //         return false;
    //     }, null, 0);
    //     console.log(msg);
    // }
}

@ccclass('cc.TrailModule')
export default class TrailModule extends ParticleModule {
    /**
     * 是否启用。
     */
    @displayOrder(0)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        this._enable = val;
    }

    @serializable
    private _enable = false;

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

    @serializable
    private _minParticleDistance = 0.1;

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
        this._minSquaredDistance = val * val;
    }

    @type(Space)
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

    /**
     * 轨迹设定时的坐标系。
     */
    @type(Space)
    private _space = Space.World;

    private _minSquaredDistance = 0;
    private _trailSegments: Pool<TrailSegment> | null = null;
    private _particleTrail: Map<Particle, TrailSegment>;
    private _needTransform = false;

    constructor () {
        super();
        this._particleTrail = new Map<Particle, TrailSegment>();
    }

    public onInit (ps) {
        this._particleSystem = ps;
        this.minParticleDistance = this._minParticleDistance;
        let burstCount = 0;
        const psTime = ps.startLifetime.getMax();
        const psRate = ps.rateOverTime.getMax();
        const duration = ps.duration;
        for (let i = 0, len = ps.bursts.length; i < len; i++) {
            const b = ps.bursts[i];
            burstCount += b.getMaxCount(ps) * Math.ceil(psTime / duration);
        }
        if (this.lifeTime.getMax() < 1.0) {
            warnID(6036);
        }
        this._trailNum = Math.ceil(psTime * Math.ceil(this.lifeTime.getMax()) * 60 * (psRate * duration + burstCount));
        this._trailSegments = new Pool(() => new TrailSegment(10), Math.ceil(psRate * duration), (obj: TrailSegment) => obj.trailElements.length = 0);
        if (this._enable) {
            this.enable = this._enable;
        }
    }

    public clear () {
        if (this.enable) {
            const trailIter = this._particleTrail.values();
            let trail = trailIter.next();
            while (!trail.done) {
                trail.value.clear();
                trail = trailIter.next();
            }
            this._particleTrail.clear();
        }
    }

    public update () {
        this._trailLifetime = this.lifeTime.evaluate(this._particleSystem._time, 1)!;
        if (this.space === Space.World && this._particleSystem._simulationSpace === Space.Local) {
            this._needTransform = true;
            this._particleSystem.node.getWorldMatrix(_temp_xform);
            this._particleSystem.node.getWorldRotation(_temp_quat);
        } else {
            this._needTransform = false;
        }
    }

    public animate (p: Particle, scaledDt: number) {
        if (!this._trailSegments) {
            return;
        }

        if (p.loopCount > p.lastLoop) {
            if (p.trailDelay > 1) {
                p.lastLoop = p.loopCount;
                p.trailDelay = 0;
            } else {
                p.trailDelay++;
            }
            return;
        }

        let trail = this._particleTrail.get(p);
        if (!trail) {
            trail = this._trailSegments.alloc();
            this._particleTrail.set(p, trail);
            // Avoid position and trail are one frame apart at the end of the particle animation.
            return;
        }
        let lastSeg = trail.getElement(trail.end - 1);
        if (this._needTransform) {
            Vec3.transformMat4(_temp_vec3, p.position, _temp_xform);
        } else {
            Vec3.copy(_temp_vec3, p.position);
        }
        if (lastSeg) {
            trail.iterateElement(this, this._updateTrailElement, p, scaledDt);
            if (Vec3.squaredDistance(lastSeg.position, _temp_vec3) < this._minSquaredDistance) {
                return;
            }
        }
        lastSeg = trail.addElement();
        if (!lastSeg) {
            return;
        }

        Vec3.copy(lastSeg.position, _temp_vec3);
        lastSeg.lifetime = 0;
        if (this.widthFromParticle) {
            lastSeg.width = p.size.x * this.widthRatio.evaluate(0, 1)!;
        } else {
            lastSeg.width = this.widthRatio.evaluate(0, 1)!;
        }

        const trailNum = trail.count();
        if (trailNum === 2) {
            const lastSecondTrail = trail.getElement(trail.end - 2)!;
            Vec3.subtract(lastSecondTrail.velocity, lastSeg.position, lastSecondTrail.position);
        } else if (trailNum > 2) {
            const lastSecondTrail = trail.getElement(trail.end - 2)!;
            const lastThirdTrail = trail.getElement(trail.end - 3)!;
            Vec3.subtract(_temp_vec3, lastThirdTrail.position, lastSecondTrail.position);
            Vec3.subtract(_temp_vec3_1, lastSeg.position, lastSecondTrail.position);
            Vec3.subtract(lastSecondTrail.velocity, _temp_vec3_1, _temp_vec3);
            if (Vec3.equals(Vec3.ZERO, lastSecondTrail.velocity)) {
                Vec3.copy(lastSecondTrail.velocity, _temp_vec3);
            }
            Vec3.normalize(lastSecondTrail.velocity, lastSecondTrail.velocity);
            this._checkDirectionReverse(lastSecondTrail, lastThirdTrail);
        }
        if (this.colorFromParticle) {
            lastSeg.color.set(p.color);
        } else {
            lastSeg.color.set(this.colorOvertime.evaluate(0, 1));
        }
    }

    public removeParticle (p: Particle) {
        const trail = this._particleTrail.get(p);
        if (trail && this._trailSegments) {
            trail.clear();
            this._trailSegments.free(trail);
            this._particleTrail.delete(p);
        }
    }

    private _updateTrailElement (module: any, trailEle: ITrailElement, p: Particle, dt: number): boolean {
        trailEle.lifetime += dt;
        if (module.colorFromParticle) {
            trailEle.color.set(p.color);
            trailEle.color.multiply(module.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
        } else {
            trailEle.color.set(module.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
        }
        if (module.widthFromParticle) {
            trailEle.width = p.size.x * module.widthRatio.evaluate(trailEle.lifetime / module._trailLifetime, 1)!;
        } else {
            trailEle.width = module.widthRatio.evaluate(trailEle.lifetime / module._trailLifetime, 1)!;
        }
        return trailEle.lifetime > module._trailLifetime;
    }

    private _checkDirectionReverse (currElement: ITrailElement, prevElement: ITrailElement) {
        if (Vec3.dot(currElement.velocity, prevElement.velocity) < DIRECTION_THRESHOLD) {
            currElement.direction = 1 - prevElement.direction;
        } else {
            currElement.direction = prevElement.direction;
        }
    }
}
