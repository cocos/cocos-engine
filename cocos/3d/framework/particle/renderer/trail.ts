import { Color, Vec3 } from '../../../../core';
import { ccclass, property } from '../../../../core/data/class-decorator';
import Enum from '../../../../core/value-types/enum';
import { vec3 } from '../../../../core/vmath';
import { GFX_DRAW_INFO_SIZE, GFXBuffer, IGFXIndirectBuffer } from '../../../../gfx/buffer';
import { GFXAttributeName, GFXBufferUsageBit, GFXFormat, GFXFormatInfos, GFXMemoryUsageBit, GFXPrimitiveMode } from '../../../../gfx/define';
import { GFXDevice } from '../../../../gfx/device';
import { IGFXAttribute } from '../../../../gfx/input-assembler';
import { Model } from '../../../../renderer';
import { Material } from '../../../assets';
import { IRenderingSubmesh } from '../../../assets/mesh';
import { builtinResMgr } from '../../../builtin';
import { Pool } from '../../../memop';
import CurveRange from '../animator/curve-range';
import GradientRange from '../animator/gradient-range';
import { Space, TextureMode, TrailMode } from '../enum';
import Particle from '../particle';

// tslint:disable: max-line-length
const PRE_TRIANGLE_INDEX = 1;
const NEXT_TRIANGLE_INDEX = 1 << 2;

const _temp_trailEle = { position: cc.v3(), velocity: cc.v3() } as ITrailElement;
const _temp_quat = cc.quat();
const _temp_xform = cc.mat4();
const _temp_vec3 = cc.v3();
const _temp_color = cc.color();

interface ITrailElement {
    position: Vec3;
    lifetime: number;
    width: number;
    velocity: Vec3;
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
                position: cc.v3(),
                lifetime: 0,
                width: 0,
                velocity: cc.v3(),
                color: cc.color(),
            });
        }
    }

    public getTailElement (): ITrailElement | null {
        if (this.start === -1) {
            return null;
        }
        return this.trailElements[this.end - 1];
    }

    public addElement (): ITrailElement {
        if (this.start === -1) {
            this.start = 0;
            this.end = 1;
            return this.trailElements[0];
        }
        if (this.start === this.end) {
            this.start++;
            this.start %= this.trailElements.length;
        }
        const newEleLoc = this.end++;
        this.end %= this.trailElements.length;
        return this.trailElements[newEleLoc];
    }

    public iterateElement (target: object, f: (target: object, e: ITrailElement, dt: number) => boolean, dt: number) {
        const end = this.start >= this.end ? this.end + this.trailElements.length : this.end;
        for (let i = this.start; i < end; i++) {
            if (f(target, this.trailElements[i % this.trailElements.length], dt)) {
                this.start++;
                this.start %= this.trailElements.length;
            }
        }
        if (this.start === end) {
            this.start = -1;
            this.end = -1;
        }
    }

    public clear () {
        this.start = -1;
        this.end = -1;
    }
}

@ccclass('cc.TrailModule')
export default class TrailModule {

    /**
     * 是否启用
     */
    @property({
        displayOrder: 0,
    })
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        if (val && !this._trailModel) {
            this._createModel();
        }
        if (val && !this._enable) {
            this._enable = val;
            this._particleSystem.renderer._updateTrailMaterial();
        }
        this._enable = val;
        if (this._trailModel) {
            this._trailModel.enabled = val;
        }
    }

    @property
    public _enable = false;

    /**
     * 设定粒子生成轨迹的方式
     */
    @property({
        type: TrailMode,
        displayOrder: 1,
    })
    public mode = TrailMode.Particles;

    /**
     * 设定粒子中生成轨迹的比例
     */
    @property({
        displayOrder: 2,
    })
    public ratio = 1;

    /**
     * 轨迹存在的生命周期
     */
    @property({
        type: CurveRange,
        displayOrder: 3,
    })
    public lifeTime = new CurveRange();

    /**
     * 每个轨迹粒子之间的最小间距
     */
    @property({
        displayOrder: 5,
    })
    public get minParticleDistance () {
        return this._minParticleDistance;
    }

    public set minParticleDistance (val) {
        this._minParticleDistance = val;
        this._minSquaredDistance = val * val;
    }

    @property
    public _minParticleDistance = 0.1;

    /**
     * 轨迹设定时的坐标系
     */
    @property({
        type: Space,
    })
    private _space = Space.World;

    @property({
        type: Space,
        displayOrder: 6,
    })
    public get space () {
        return this._space;
    }

    public set space (val) {
        this._space = val;
        this._particleSystem.renderer._updateTrailMaterial();
    }

    /**
     * 粒子本身是否存在
     */
    @property({
        displayOrder: 7,
    })
    public existWithParticles = true;

    /**
     * 设定纹理填充方式
     */
    @property({
        type: TextureMode,
        displayOrder: 8,
    })
    public textureMode = TextureMode.Stretch;

    /**
     * 控制轨迹长度的曲线
     */
    @property({
        type: CurveRange,
        displayOrder: 9,
    })
    public widthRatio = new CurveRange();

    @property({
        type: GradientRange,
        displayOrder: 10,
    })
    public colorOverTrail = new GradientRange();

    private _particleSystem: any;
    private _minSquaredDistance: number = 0;
    private _vertSize: number;
    private _trailNum: number = 0;
    private _trailLifetime: number = 0;
    private vbOffset: number = 0;
    private ibOffset: number = 0;
    private _trailSegments: Pool<TrailSegment>;
    private _particleTrail: Map<Particle, TrailSegment>;
    private _trailModel: Model | null = null;
    private _iaInfo: IGFXIndirectBuffer;
    private _iaInfoBuffer: GFXBuffer;
    private _subMeshData: IRenderingSubmesh | null = null;
    private _vertAttrs: IGFXAttribute[];
    private _vbF32: Float32Array;
    private _vbUint32: Uint32Array;
    private _iBuffer: Uint16Array;
    private _needTransform: boolean;
    private _defaultMat: Material | null = null;

    constructor () {
        this._iaInfo = {
            drawInfos: [{
                vertexCount: 0,
                firstVertex: 0,
                indexCount: 0,
                firstIndex: 0,
                vertexOffset: 0,
                instanceCount: 0,
                firstInstance: 0,
            }],
        };

        this._vertAttrs = [
            { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F }, // xyz:position
            { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGBA32F }, // x:index y:size zw:texcoord
            { name: GFXAttributeName.ATTR_TEX_COORD1, format: GFXFormat.RGB32F }, // xyz:velocity
            { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA8, isNormalized: true },
        ];
        this._vertSize = 0;
        for (const a of this._vertAttrs) {
            this._vertSize += GFXFormatInfos[a.format].size;
        }

        this._particleTrail = new Map<Particle, TrailSegment>();
    }

    public init (ps) {
        this._particleSystem = ps;
        this.lifeTime.constant = 1;
        let burstCount = 0;
        for (const b of ps.bursts) {
            burstCount += b.getMaxCount(ps);
        }
        this._trailNum = Math.ceil(ps.startLifetime.getMax() * this.lifeTime.getMax() * 60 * (ps.rateOverTime.getMax() * ps.duration + burstCount));
        this._trailSegments = new Pool(() => new TrailSegment(Math.ceil(ps.startLifetime.getMax() * this.lifeTime.getMax() * 60)), Math.ceil(ps.rateOverTime.getMax() * ps.duration));
        if (this._enable) {
            this.enable = this._enable;
            this._updateMaterial();
        }
    }

    public onEnable () {
        if (this._enable && this._trailModel) {
            this._trailModel.enabled = true;
        }
    }

    public onDisable () {
        if (this._enable && this._trailModel) {
            this._trailModel.enabled = false;
        }
    }

    public destroy () {
        if (this._trailModel) {
            this._particleSystem._getRenderScene().destroyModel(this._trailModel!);
            this._trailModel = null;
        }
    }

    private _createModel () {
        if (this._trailModel) {
            return;
        }
        const device: GFXDevice = cc.director.root.device;
        const vertexBuffer = device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: this._vertSize * this._trailNum * 2,
            stride: this._vertSize,
        });
        const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertSize * this._trailNum * 2);
        this._vbF32 = new Float32Array(vBuffer);
        this._vbUint32 = new Uint32Array(vBuffer);
        vertexBuffer.update(vBuffer);

        const indexBuffer = device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: this._trailNum * 6 * Uint16Array.BYTES_PER_ELEMENT,
            stride: Uint16Array.BYTES_PER_ELEMENT,
        });
        this._iBuffer = new Uint16Array(this._trailNum * 6);
        indexBuffer.update(this._iBuffer);

        this._iaInfoBuffer = device.createBuffer({
            usage: GFXBufferUsageBit.INDIRECT,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: GFX_DRAW_INFO_SIZE,
            stride: 1,
        });
        this._iaInfo.drawInfos[0].vertexCount = this._trailNum * 2;
        this._iaInfo.drawInfos[0].indexCount = this._trailNum * 6;
        this._iaInfoBuffer.update(this._iaInfo);

        this._subMeshData = {
            vertexBuffers: [vertexBuffer],
            indexBuffer,
            indirectBuffer: this._iaInfoBuffer,
            attributes: this._vertAttrs!,
            primitiveMode: GFXPrimitiveMode.TRIANGLE_LIST,
        };

        this._trailModel = this._particleSystem._getRenderScene().createModel(Model, this._particleSystem.node);
        this._trailModel!.setSubModelMesh(0, this._subMeshData);
        this._trailModel!.enabled = true;
    }

    public _updateMaterial () {
        if (this._particleSystem) {
            const mat = this._particleSystem.renderer.trailMaterial;
            if (mat) {
                this._trailModel!.setSubModelMaterial(0, mat);
            } else {
                this._trailModel!.setSubModelMaterial(0, this._particleSystem.renderer._defaultTrailMat);
            }
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
        let trail = this._particleTrail.get(p);
        if (!trail) {
            trail = this._trailSegments.alloc();
            this._particleTrail.set(p, trail);
        }
        let lastSeg = trail.getTailElement();
        if (this._needTransform) {
            vec3.transformMat4(_temp_vec3, p.position, _temp_xform);
        } else {
            vec3.copy(_temp_vec3, p.position);
        }
        if (lastSeg) {
            trail.iterateElement(this, this._updateTrailElement, scaledDt);
            if (vec3.squaredDistance(lastSeg.position, _temp_vec3) < this._minSquaredDistance) {
                return;
            }
        }
        lastSeg = trail.addElement();
        vec3.copy(lastSeg.position, _temp_vec3);
        lastSeg.lifetime = 0;
        lastSeg.width = p.size.x;
        if (this._needTransform) {
            vec3.transformQuat(lastSeg.velocity, p.ultimateVelocity, _temp_quat);
        } else {
            vec3.copy(lastSeg.velocity, p.ultimateVelocity);
        }
        lastSeg.color.set(p.color);
    }

    private _updateTrailElement (module: any, trailEle: ITrailElement, dt: number): boolean {
        trailEle.lifetime += dt;
        return trailEle.lifetime > module._trailLifetime;
    }

    public removeParticle (p: Particle) {
        const trail = this._particleTrail.get(p);
        if (trail) {
            trail.clear();
            this._trailSegments.free(trail);
            this._particleTrail.delete(p);
        }
    }

    public updateRenderData () {
        this.vbOffset = 0;
        this.ibOffset = 0;
        for (const p of this._particleTrail.keys()) {
            const trailSeg = this._particleTrail.get(p)!;
            if (trailSeg.start === -1) {
                continue;
            }
            const indexOffset = this.vbOffset * 4 / this._vertSize;
            const end = trailSeg.start >= trailSeg.end ? trailSeg.end + trailSeg.trailElements.length : trailSeg.end;
            const trailNum = end - trailSeg.start;
            // const lastSegRatio = vec3.distance(trailSeg.getTailElement()!.position, p.position) / this._minParticleDistance;
            const textCoordSeg = 1 / (trailNum /*- 1 + lastSegRatio*/);
            const startSegEle = trailSeg.trailElements[trailSeg.start];
            this._fillVertexBuffer(startSegEle, this.colorOverTrail.evaluate(1, 1), indexOffset, 0, 0, NEXT_TRIANGLE_INDEX);
            for (let i = trailSeg.start + 1; i < end; i++) {
                const segEle = trailSeg.trailElements[i % trailSeg.trailElements.length];
                const j = i - trailSeg.start;
                this._fillVertexBuffer(segEle, this.colorOverTrail.evaluate(1 - j / trailNum, 1), indexOffset, j * textCoordSeg, j, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);
            }
            if (this._needTransform) {
                vec3.transformMat4(_temp_trailEle.position, p.position, _temp_xform);
                vec3.transformQuat(_temp_trailEle.velocity, p.ultimateVelocity, _temp_quat);
            } else {
                vec3.copy(_temp_trailEle.position, p.position);
                vec3.copy(_temp_trailEle.velocity, p.ultimateVelocity);
            }
            _temp_trailEle.width = p.size.x;
            _temp_trailEle.color = p.color;
            this._fillVertexBuffer(_temp_trailEle, this.colorOverTrail.evaluate(0, 1), indexOffset, 1, trailNum, PRE_TRIANGLE_INDEX);
        }
        this.updateIA(this.ibOffset);
    }

    private _fillVertexBuffer (trailSeg: ITrailElement, colorModifer: Color, indexOffset: number, xTexCoord: number, trailEleIdx: number, indexSet: number) {
        this._vbF32[this.vbOffset++] = trailSeg.position.x;
        this._vbF32[this.vbOffset++] = trailSeg.position.y;
        this._vbF32[this.vbOffset++] = trailSeg.position.z;
        this._vbF32[this.vbOffset++] = 0;
        this._vbF32[this.vbOffset++] = trailSeg.width;
        this._vbF32[this.vbOffset++] = xTexCoord;
        this._vbF32[this.vbOffset++] = 0;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.x;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.y;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.z;
        trailSeg.color.mul(colorModifer, _temp_color);
        this._vbUint32[this.vbOffset++] = _temp_color._val;
        this._vbF32[this.vbOffset++] = trailSeg.position.x;
        this._vbF32[this.vbOffset++] = trailSeg.position.y;
        this._vbF32[this.vbOffset++] = trailSeg.position.z;
        this._vbF32[this.vbOffset++] = 1;
        this._vbF32[this.vbOffset++] = trailSeg.width;
        this._vbF32[this.vbOffset++] = xTexCoord;
        this._vbF32[this.vbOffset++] = 1;
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

    public updateIA (count: number) {
        this._trailModel!.getSubModel(0).inputAssembler!.vertexBuffers[0].update(this._vbF32!);
        this._trailModel!.getSubModel(0).inputAssembler!.indexBuffer!.update(this._iBuffer!);
        this._trailModel!.getSubModel(0).inputAssembler!.indexCount = count;
        this._trailModel!.getSubModel(0).inputAssembler!.extractDrawInfo(this._iaInfo.drawInfos[0]);
        this._iaInfoBuffer.update(this._iaInfo);
    }
}
