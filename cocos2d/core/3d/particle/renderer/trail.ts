import { ccclass, property } from '../../../platform/CCClassDecorator';
import { Vec3, toRadian, Color} from '../../../value-types';
import gfx from '../../../../renderer/gfx';
import Pool from '../../../../renderer/memop/pool';
import CurveRange from '../animator/curve-range';
import GradientRange from '../animator/gradient-range';
import { Space, TextureMode, TrailMode } from '../enum';
import MapUtils from '../utils';

// tslint:disable: max-line-length
const PRE_TRIANGLE_INDEX = 1;
const NEXT_TRIANGLE_INDEX = 1 << 2;
const DIRECTION_THRESHOLD = Math.cos(toRadian(100));

const _temp_trailEle = { position: cc.v3(), velocity: cc.v3() };
const _temp_quat = cc.quat();
const _temp_xform = cc.mat4();
const _temp_Vec3 = cc.v3();
const _temp_Vec3_1 = cc.v3();
const _temp_color = cc.color();

// var barycentric = [1, 0, 0, 0, 1, 0, 0, 0, 1]; // <wireframe debug>
// var _bcIdx = 0;


class ITrailElement {
    position;
    lifetime;
    width;
    velocity;
    color;
}

// the valid element is in [start,end) range.if start equals -1,it represents the array is empty.
class TrailSegment {
    start;
    end;
    trailElements = [];

    constructor (maxTrailElementNum) {
        this.start = -1;
        this.end = -1;
        this.trailElements = [];
        while (maxTrailElementNum--) {
            this.trailElements.push({
                position: cc.v3(),
                lifetime: 0,
                width: 0,
                velocity: cc.v3(),
                direction: 0,
                color: cc.color(),
            });
        }
    }

    getElement (idx) {
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

    addElement () {
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
                position: cc.v3(),
                lifetime: 0,
                width: 0,
                velocity: cc.v3(),
                direction: 0,
                color: cc.color(),
            });
            this.start++;
            this.start %= this.trailElements.length;
        }
        const newEleLoc = this.end++;
        this.end %= this.trailElements.length;
        return this.trailElements[newEleLoc];
    }

    iterateElement (target, f, p, dt) {
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

    count () {
        if (this.start < this.end) {
            return this.end - this.start;
        } else {
            return this.trailElements.length + this.end - this.start;
        }
    }

    clear () {
        this.start = -1;
        this.end = -1;
    }
}

/**
 * !#en The trail module of 3d particle.
 * !#zh 3D 粒子拖尾模块
 * @class TrailModule
 */
@ccclass('cc.TrailModule')
export default class TrailModule {

    @property
    _enable = false;

    /**
     * !#en The enable of trailModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    @property
    get enable () {
        return this._enable;
    }

    set enable (val) {
        if (val) {
            this._createTrailData();
        }

        if (val && !this._enable) {
            this._enable = val;
            this._particleSystem._assembler._updateTrailMaterial();
        }

        this._enable = val;
        this._particleSystem._assembler._updateTrailEnable(this._enable);
    }

    /**
     * !#en Sets how particles generate trajectories.
     * !#zh 设定粒子生成轨迹的方式。
     * @property {TrailMode} mode
     */
    @property({
        type: TrailMode,
    })
    mode = TrailMode.Particles;

    /**
     * !#en Life cycle of trajectory.
     * !#zh 轨迹存在的生命周期。
     * @property {CurveRange} lifeTime
     */
    @property({
        type: CurveRange,
    })
    lifeTime = new CurveRange();

    @property
    _minParticleDistance = 0.1;

    /**
     * !#en Minimum spacing between each track particle
     * !#zh 每个轨迹粒子之间的最小间距。
     * @property {Number} minParticleDistance
     */
    @property
    get minParticleDistance () {
        return this._minParticleDistance;
    }

    set minParticleDistance (val) {
        this._minParticleDistance = val;
        this._minSquaredDistance = val * val;
    }

    @property
    _space = Space.World;

    /**
     * !#en The coordinate system of trajectories.
     * !#zh 轨迹设定时的坐标系。
     * @property {Space} space
     */
    @property({
        type: Space,
    })
    get space () {
        return this._space;
    }

    set space (val) {
        this._space = val;
        if (this._particleSystem) {
            this._particleSystem._assembler._updateTrailMaterial();
        }
    }

    /**
     * !#en Whether the particle itself exists.
     * !#zh 粒子本身是否存在。
     * @property {Boolean} existWithParticles
     */
    @property
    existWithParticles = true;

    /**
     * !#en Set the texture fill method
     * !#zh 设定纹理填充方式。
     * @property {TextureMode} textureMode
     */
    @property({
        type: TextureMode,
    })
    textureMode = TextureMode.Stretch;

    /**
     * !#en Whether to use particle width
     * !#zh 是否使用粒子的宽度。
     * @property {Boolean} widthFromParticle
     */
    @property
    widthFromParticle = true;


    /**
     * !#en Curves that control track length
     * !#zh 控制轨迹长度的曲线。
     * @property {CurveRange} widthRatio
     */
    @property({
        type: CurveRange,
    })
    widthRatio = new CurveRange();

    /**
     * !#en Whether to use particle color
     * !#zh 是否使用粒子的颜色。
     * @property {Boolean} colorFromParticle
     */
    @property
    colorFromParticle = false;

    /**
     * !#en The color of trajectories.
     * !#zh 轨迹的颜色。
     * @property {GradientRange} colorOverTrail
     */
    @property({
        type: GradientRange,
    })
    colorOverTrail = new GradientRange();

    /**
     * !#en Trajectories color over time.
     * !#zh 轨迹随时间变化的颜色。
     * @property {GradientRange} colorOvertime
     */
    @property({
        type: GradientRange,
    })
    colorOvertime = new GradientRange();

    _particleSystem = null;
    _minSquaredDistance = 0;
    _vertSize = 0;
    _trailNum = 0;
    _trailLifetime = 0;
    vbOffset = 0;
    ibOffset = 0;
    _trailSegments = null;
    _particleTrail = null;
    _ia = null;
    _gfxVFmt = null;
    _vbF32 = null;
    _vbUint32 = null;
    _iBuffer = null;
    _needTransform = null;
    _defaultMat = null;
    _material = null;

    constructor () {
        this._gfxVFmt = new gfx.VertexFormat([
            { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3},
            { name: gfx.ATTR_TEX_COORD, type: gfx.ATTR_TYPE_FLOAT32, num: 4},
            //{ name: gfx.ATTR_TEX_COORD2, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }, // <wireframe debug>
            { name: gfx.ATTR_TEX_COORD1, type: gfx.ATTR_TYPE_FLOAT32, num: 3},
            { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
        ]);

        this._vertSize = this._gfxVFmt._bytes;

        this._particleTrail = new MapUtils(); // Map<Particle, TrailSegment>();
    }

    onInit (ps) {
        this._particleSystem = ps;
        this.minParticleDistance = this._minParticleDistance;
        let burstCount = 0;
        for (const b of ps.bursts) {
            burstCount += b.getMaxCount(ps);
        }
        this.lifeTime.constant = 1;
        this._trailNum = Math.ceil(ps.startLifetime.getMax() * this.lifeTime.getMax() * 60 * (ps.rateOverTime.getMax() * ps.duration + burstCount));
        this._trailSegments = new Pool(() => new TrailSegment(10), Math.ceil(ps.rateOverTime.getMax() * ps.duration));
        if (this._enable) {
            this.enable = this._enable;
            this._updateMaterial();
        }
    }

    onEnable () {
    }

    onDisable () {
    }

    destroy () {
        if (this._trailSegments) {
            this._trailSegments.clear((obj) => { obj.trailElements.length = 0; });
            this._trailSegments = null;
        }
    }

    clear () {
        if (this.enable) {
            const trailIter = this._particleTrail.values();
            let trail = trailIter.next();
            while (!trail.done) {
                trail.value.clear();
                trail = trailIter.next();
            }
            this._particleTrail.clear();
            this.updateTrailBuffer();
        }
    }

    _createTrailData () {
        let model = this._particleSystem._assembler._model;
        
        if (model) {
            model.createTrailData(this._gfxVFmt, this._trailNum);

            let subData = model._subDatas[1];
            this._vbF32 = subData.getVData();
            this._vbUint32 = subData.getVData(Uint32Array);
            this._iBuffer = subData.iData;
        }
    }

    _updateMaterial () {
        if (this._particleSystem) {
            const mat = this._particleSystem.trailMaterial;
            if (mat) {
                this._material = mat;
            } else {
                this._material = this._particleSystem._assembler._defaultTrailMat;
            }
        }
    }

    update () {
        this._trailLifetime = this.lifeTime.evaluate(this._particleSystem._time, 1);
        if (this.space === Space.World && this._particleSystem._simulationSpace === Space.Local) {
            this._needTransform = true;
            this._particleSystem.node.getWorldMatrix(_temp_xform);
            this._particleSystem.node.getWorldRotation(_temp_quat);
        } else {
            this._needTransform = false;
        }
    }

    animate (p, scaledDt) {
        if (!this._trailSegments) {
            return;
        }
        let trail = this._particleTrail.get(p);
        if (!trail) {
            trail = this._trailSegments.alloc();
            this._particleTrail.set(p, trail);
            return;
        }
        let lastSeg = trail.getElement(trail.end - 1);
        if (this._needTransform) {
            Vec3.transformMat4(_temp_Vec3, p.position, _temp_xform);
        } else {
            Vec3.copy(_temp_Vec3, p.position);
        }
        if (lastSeg) {
            trail.iterateElement(this, this._updateTrailElement, p, scaledDt);
            if (Vec3.squaredDistance(lastSeg.position, _temp_Vec3) < this._minSquaredDistance) {
                return;
            }
        }
        lastSeg = trail.addElement();
        if (!lastSeg) {
            return;
        }
        Vec3.copy(lastSeg.position, _temp_Vec3);
        lastSeg.lifetime = 0;
        if (this.widthFromParticle) {
            lastSeg.width = p.size.x * this.widthRatio.evaluate(0, 1);
        } else {
            lastSeg.width = this.widthRatio.evaluate(0, 1);
        }
        const trailNum = trail.count();
        if (trailNum === 2) {
            const lastSecondTrail = trail.getElement(trail.end - 2);
            Vec3.subtract(lastSecondTrail.velocity, lastSeg.position, lastSecondTrail.position);
        } else if (trailNum > 2) {
            const lastSecondTrail = trail.getElement(trail.end - 2);
            const lastThirdTrail = trail.getElement(trail.end - 3);
            Vec3.subtract(_temp_Vec3, lastThirdTrail.position, lastSecondTrail.position);
            Vec3.subtract(_temp_Vec3_1, lastSeg.position, lastSecondTrail.position);
            Vec3.subtract(lastSecondTrail.velocity, _temp_Vec3_1, _temp_Vec3);
            if (Vec3.equals(cc.Vec3.ZERO, lastSecondTrail.velocity)) {
                Vec3.copy(lastSecondTrail.velocity, _temp_Vec3);
            }
        }
        if (this.colorFromParticle) {
            lastSeg.color.set(p.color);
        } else {
            lastSeg.color.set(this.colorOvertime.evaluate(0, 1));
        }
    }

    _updateTrailElement (trail, trailEle, p, dt) {
        trailEle.lifetime += dt;
        if (trail.colorFromParticle) {
            trailEle.color.set(p.color);
            trailEle.color.multiply(trail.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
        } else {
            trailEle.color.set(trail.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
        }
        if (trail.widthFromParticle) {
            trailEle.width = p.size.x * trail.widthRatio.evaluate(trailEle.lifetime / trail._trailLifetime, 1);
        } else {
            trailEle.width = trail.widthRatio.evaluate(trailEle.lifetime / trail._trailLifetime, 1);
        }
        return trailEle.lifetime > trail._trailLifetime;
    }

    removeParticle (p) {
        const trail = this._particleTrail.get(p);
        if (trail && this._trailSegments) {
            trail.clear();
            this._trailSegments.free(trail);
            this._particleTrail.delete(p);
        }
    }

    updateTrailBuffer () {
        this.vbOffset = 0;
        this.ibOffset = 0;
        
        for (const p of this._particleTrail.keys()) {
            const trailSeg = this._particleTrail.get(p);
            if (trailSeg.start === -1) {
                continue;
            }
            const indexOffset = this.vbOffset * 4 / this._vertSize;
            const end = trailSeg.start >= trailSeg.end ? trailSeg.end + trailSeg.trailElements.length : trailSeg.end;
            const trailNum = end - trailSeg.start;
            // const lastSegRatio = Vec3.distance(trailSeg.getTailElement()!.position, p.position) / this._minParticleDistance;
            const textCoordSeg = 1 / (trailNum /*- 1 + lastSegRatio*/);
            const startSegEle = trailSeg.trailElements[trailSeg.start];
            this._fillVertexBuffer(startSegEle, this.colorOverTrail.evaluate(1, 1), indexOffset, 1, 0, NEXT_TRIANGLE_INDEX);
            for (let i = trailSeg.start + 1; i < end; i++) {
                const segEle = trailSeg.trailElements[i % trailSeg.trailElements.length];
                const j = i - trailSeg.start;
                this._fillVertexBuffer(segEle, this.colorOverTrail.evaluate(1 - j / trailNum, 1), indexOffset, 1 - j * textCoordSeg, j, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);
            }
            if (this._needTransform) {
                Vec3.transformMat4(_temp_trailEle.position, p.position, _temp_xform);
            } else {
                Vec3.copy(_temp_trailEle.position, p.position);
            }
            if (trailNum === 1 || trailNum === 2) {
                const lastSecondTrail = trailSeg.getElement(trailSeg.end - 1);
                Vec3.subtract(lastSecondTrail.velocity, _temp_trailEle.position, lastSecondTrail.position);
                this._vbF32[this.vbOffset - this._vertSize / 4 - 4] = lastSecondTrail.velocity.x;
                this._vbF32[this.vbOffset - this._vertSize / 4 - 3] = lastSecondTrail.velocity.y;
                this._vbF32[this.vbOffset - this._vertSize / 4 - 2] = lastSecondTrail.velocity.z;
                this._vbF32[this.vbOffset - 4] = lastSecondTrail.velocity.x;
                this._vbF32[this.vbOffset - 3] = lastSecondTrail.velocity.y;
                this._vbF32[this.vbOffset - 2] = lastSecondTrail.velocity.z;
                Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, lastSecondTrail.position);
                this._checkDirectionReverse(_temp_trailEle, lastSecondTrail);
            } else if (trailNum > 2) {
                const lastSecondTrail = trailSeg.getElement(trailSeg.end - 1);
                const lastThirdTrail = trailSeg.getElement(trailSeg.end - 2);
                Vec3.subtract(_temp_Vec3, lastThirdTrail.position, lastSecondTrail.position);
                Vec3.subtract(_temp_Vec3_1, _temp_trailEle.position, lastSecondTrail.position);
                Vec3.normalize(_temp_Vec3, _temp_Vec3);
                Vec3.normalize(_temp_Vec3_1, _temp_Vec3_1);
                Vec3.subtract(lastSecondTrail.velocity, _temp_Vec3_1, _temp_Vec3);
                Vec3.normalize(lastSecondTrail.velocity, lastSecondTrail.velocity);
                this._checkDirectionReverse(lastSecondTrail, lastThirdTrail);
                this.vbOffset -= this._vertSize / 4 * 2;
                this.ibOffset -= 6;
                //_bcIdx = (_bcIdx - 6 + 9) % 9;  // <wireframe debug>
                this._fillVertexBuffer(lastSecondTrail, this.colorOverTrail.evaluate(textCoordSeg, 1), indexOffset, textCoordSeg, trailNum - 1, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);
                Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, lastSecondTrail.position);
                Vec3.normalize(_temp_trailEle.velocity, _temp_trailEle.velocity);
                this._checkDirectionReverse(_temp_trailEle, lastSecondTrail);
            }
            if (this.widthFromParticle) {
                _temp_trailEle.width = p.size.x * this.widthRatio.evaluate(0, 1);
            } else {
                _temp_trailEle.width = this.widthRatio.evaluate(0, 1);
            }
            _temp_trailEle.color = p.color;

            if (Vec3.equals(_temp_trailEle.velocity, cc.Vec3.ZERO)) {
                this.ibOffset -= 3;
            } else {
                this._fillVertexBuffer(_temp_trailEle, this.colorOverTrail.evaluate(0, 1), indexOffset, 0, trailNum, PRE_TRIANGLE_INDEX);
            }
        }
        this._updateIA(this.ibOffset);
    }

    _fillVertexBuffer (trailSeg, colorModifer, indexOffset, xTexCoord, trailEleIdx, indexSet) {
        this._vbF32[this.vbOffset++] = trailSeg.position.x;
        this._vbF32[this.vbOffset++] = trailSeg.position.y;
        this._vbF32[this.vbOffset++] = trailSeg.position.z;
        this._vbF32[this.vbOffset++] = 0;
        this._vbF32[this.vbOffset++] = trailSeg.width;
        this._vbF32[this.vbOffset++] = xTexCoord;
        this._vbF32[this.vbOffset++] = 0;
        // this._vbF32[this.vbOffset++] = barycentric[_bcIdx++];  // <wireframe debug>
        // this._vbF32[this.vbOffset++] = barycentric[_bcIdx++];
        // this._vbF32[this.vbOffset++] = barycentric[_bcIdx++];
        // _bcIdx %= 9;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.x;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.y;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.z;
        _temp_color.set(trailSeg.color);
        _temp_color.multiply(colorModifer);
        this._vbUint32[this.vbOffset++] = _temp_color._val;
        this._vbF32[this.vbOffset++] = trailSeg.position.x;
        this._vbF32[this.vbOffset++] = trailSeg.position.y;
        this._vbF32[this.vbOffset++] = trailSeg.position.z;
        this._vbF32[this.vbOffset++] = 1;
        this._vbF32[this.vbOffset++] = trailSeg.width;
        this._vbF32[this.vbOffset++] = xTexCoord;
        this._vbF32[this.vbOffset++] = 1;
        // this._vbF32[this.vbOffset++] = barycentric[_bcIdx++];  // <wireframe debug>
        // this._vbF32[this.vbOffset++] = barycentric[_bcIdx++];
        // this._vbF32[this.vbOffset++] = barycentric[_bcIdx++];
        // _bcIdx %= 9;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.x;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.y;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.z;
        this._vbUint32[this.vbOffset++] = _temp_color._val;
        if (indexSet & PRE_TRIANGLE_INDEX) {
            this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx;
            this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx - 1;
            this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
        }
        if (indexSet & NEXT_TRIANGLE_INDEX) {
            this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx;
            this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
            this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx + 2;
        }
    }

    _updateIA (count) {
        if (this._particleSystem && this._particleSystem._assembler) {
            this._particleSystem._assembler.updateIA(1, count, true, true);
        }
    }

    _checkDirectionReverse (currElement, prevElement) {
        if (Vec3.dot(currElement.velocity, prevElement.velocity) < DIRECTION_THRESHOLD) {
            currElement.direction = 1 - prevElement.direction;
        } else {
            currElement.direction = prevElement.direction;
        }
    }
}
