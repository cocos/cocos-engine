/**
 * @hidden
 */

import { IRenderingSubmesh } from '../../3d/assets/mesh';
import CurveRange from '../../3d/framework/particle/animator/curve-range';
import { Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { GFXAttributeName, GFXBufferUsageBit, GFXFormat, GFXFormatInfos, GFXMemoryUsageBit, GFXPrimitiveMode } from '../../gfx/define';
import { Node } from '../../scene-graph';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';
import GradientRange from '../../3d/framework/particle/animator/gradient-range';
import { GFX_DRAW_INFO_SIZE } from '../../gfx/buffer';

const _vertex_attrs = [
    { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F }, // xyz:position
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGBA32F }, // x:index y:size zw:texcoord
    { name: GFXAttributeName.ATTR_TEX_COORD1, format: GFXFormat.RGB32F }, // xyz:velocity
    { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA8, isNormalized: true },
];

const _temp_v1 = cc.v3();
const _temp_v2 = cc.v3();

export class LineModel extends Model {

    private _capacity: number;
    private _vertSize: number;
    private _vBuffer: ArrayBuffer | null;
    private _vertAttrsFloatCount: number;
    private _vdataF32: Float32Array | null;
    private _vdataUint32: Uint32Array | null;
    private _iaInfo: IGFXIndirectBuffer;
    private _iaInfoBuffer: GFXBuffer;
    private _subMeshData: IRenderingSubmesh | null;
    private _vertCount: number = 0;
    private _indexCount: number = 0;

    constructor (scene: RenderScene, node: Node) {
        super(scene, node);
        this._capacity = 100;
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
        this._iaInfoBuffer = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDIRECT,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: GFX_DRAW_INFO_SIZE,
            stride: 1,
        });
    }

    public setCapacity (capacity: number) {
        this._capacity = capacity;
        this.createBuffer();
    }

    public createBuffer () {
        this._vertSize = 0;
        for (const a of _vertex_attrs) {
            (a as any).offset = this._vertSize;
            this._vertSize += GFXFormatInfos[a.format].size;
        }
        this._vertAttrsFloatCount = this._vertSize / 4; // number of float
        this._vBuffer = this._createSubMeshData();
        this._vdataF32 = new Float32Array(this._vBuffer);
        this._vdataUint32 = new Uint32Array(this._vBuffer);
    }

    public _createSubMeshData (): ArrayBuffer {
        if (this._subMeshData) {
            this.destroySubMeshData();
        }
        this._vertCount = 2;
        this._indexCount = 6;
        const vertexBuffer = this._device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: this._vertSize * this._capacity * this._vertCount,
            stride: this._vertSize,
        });
        const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertSize * this._capacity * this._vertCount);
        vertexBuffer.update(vBuffer);

        const indices: Uint16Array = new Uint16Array((this._capacity - 1) * this._indexCount);
        let dst = 0;
        for (let i = 0; i < this._capacity - 1; ++i) {
            const baseIdx = 2 * i;
            indices[dst++] = baseIdx;
            indices[dst++] = baseIdx + 1;
            indices[dst++] = baseIdx + 2;
            indices[dst++] = baseIdx + 3;
            indices[dst++] = baseIdx + 2;
            indices[dst++] = baseIdx + 1;
        }

        const indexBuffer = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: (this._capacity - 1) * this._indexCount * Uint16Array.BYTES_PER_ELEMENT,
            stride: Uint16Array.BYTES_PER_ELEMENT,
        });

        indexBuffer.update(indices);

        this._iaInfo.drawInfos[0].vertexCount = this._capacity * this._vertCount;
        this._iaInfo.drawInfos[0].indexCount = (this._capacity - 1) * this._indexCount;
        this._iaInfoBuffer.update(this._iaInfo);

        this._subMeshData = {
            vertexBuffers: [vertexBuffer],
            indexBuffer,
            indirectBuffer: this._iaInfoBuffer,
            attributes: _vertex_attrs,
            primitiveMode: GFXPrimitiveMode.TRIANGLE_LIST,
        };
        this.setSubModelMesh(0, this._subMeshData);
        return vBuffer;
    }

    public addLineVertexData (positions: Vec3[], width: CurveRange, color: GradientRange) {
        if (positions.length > 1) {
            let offset: number = 0;
            vec3.subtract(_temp_v1, positions[1], positions[0]);
            this._vdataF32![offset++] = positions[0].x;
            this._vdataF32![offset++] = positions[0].y;
            this._vdataF32![offset++] = positions[0].z;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = width.evaluate(0, 1)!;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = _temp_v1.x;
            this._vdataF32![offset++] = _temp_v1.y;
            this._vdataF32![offset++] = _temp_v1.z;
            this._vdataUint32![offset++] = color.evaluate(0, 1)._val;
            this._vdataF32![offset++] = positions[0].x;
            this._vdataF32![offset++] = positions[0].y;
            this._vdataF32![offset++] = positions[0].z;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = width.evaluate(0, 1)!;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = _temp_v1.x;
            this._vdataF32![offset++] = _temp_v1.y;
            this._vdataF32![offset++] = _temp_v1.z;
            this._vdataUint32![offset++] = color.evaluate(0, 1)._val;
            for (let i = 1; i < positions.length - 1; i++) {
                vec3.subtract(_temp_v1, positions[i - 1], positions[i]);
                vec3.subtract(_temp_v2, positions[i + 1], positions[i]);
                vec3.subtract(_temp_v2, _temp_v2, _temp_v1);
                const seg = i / positions.length;
                this._vdataF32![offset++] = positions[i].x;
                this._vdataF32![offset++] = positions[i].y;
                this._vdataF32![offset++] = positions[i].z;
                this._vdataF32![offset++] = 0;
                this._vdataF32![offset++] = width.evaluate(seg, 1)!;
                this._vdataF32![offset++] = seg;
                this._vdataF32![offset++] = 0;
                this._vdataF32![offset++] = _temp_v2.x;
                this._vdataF32![offset++] = _temp_v2.y;
                this._vdataF32![offset++] = _temp_v2.z;
                this._vdataUint32![offset++] = color.evaluate(seg, 1)._val;
                this._vdataF32![offset++] = positions[i].x;
                this._vdataF32![offset++] = positions[i].y;
                this._vdataF32![offset++] = positions[i].z;
                this._vdataF32![offset++] = 1;
                this._vdataF32![offset++] = width.evaluate(seg, 1)!;
                this._vdataF32![offset++] = seg;
                this._vdataF32![offset++] = 1;
                this._vdataF32![offset++] = _temp_v2.x;
                this._vdataF32![offset++] = _temp_v2.y;
                this._vdataF32![offset++] = _temp_v2.z;
                this._vdataUint32![offset++] = color.evaluate(seg, 1)._val;
            }
            vec3.subtract(_temp_v1, positions[positions.length - 1], positions[positions.length - 2]);
            this._vdataF32![offset++] = positions[positions.length - 1].x;
            this._vdataF32![offset++] = positions[positions.length - 1].y;
            this._vdataF32![offset++] = positions[positions.length - 1].z;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = width.evaluate(1, 1)!;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = _temp_v1.x;
            this._vdataF32![offset++] = _temp_v1.y;
            this._vdataF32![offset++] = _temp_v1.z;
            this._vdataUint32![offset++] = color.evaluate(1, 1)._val;
            this._vdataF32![offset++] = positions[positions.length - 1].x;
            this._vdataF32![offset++] = positions[positions.length - 1].y;
            this._vdataF32![offset++] = positions[positions.length - 1].z;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = width.evaluate(1, 1)!;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = _temp_v1.x;
            this._vdataF32![offset++] = _temp_v1.y;
            this._vdataF32![offset++] = _temp_v1.z;
            this._vdataUint32![offset++] = color.evaluate(1, 1)._val;
        }
        this.updateIA(Math.max(0, positions.length - 1));
    }

    public updateIA (count: number) {
        this.getSubModel(0).inputAssembler!.vertexBuffers[0].update(this._vdataF32!);
        this.getSubModel(0).inputAssembler!.indexCount = this._indexCount * count;
        this.getSubModel(0).inputAssembler!.extractDrawInfo(this._iaInfo.drawInfos[0]);
        this._iaInfoBuffer.update(this._iaInfo);
    }

    private destroySubMeshData () {
        for (const vb of this._subMeshData!.vertexBuffers) {
            vb.destroy();
        }
        this._subMeshData!.indexBuffer!.destroy();
    }
}
