/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 ****************************************************************************/

import { Asset } from '../../assets/asset';
import { ccclass, property } from '../../core/data/class-decorator';
import { Vec3 } from '../../core/value-types';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXPrimitiveMode } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { BufferBlob } from '../misc/buffer-blob';
import { IBufferView } from './utils/buffer-view';

function getIndexStrideCtor (stride: number) {
    switch (stride) {
        case 1: return Uint8Array;
        case 2: return Uint16Array;
        case 4: return Uint32Array;
    }
    return Uint8Array;
}

export interface IVertexBundle {
    /**
     * The data view of this bundle.
     * This range of data is essentially mapped to a GPU vertex buffer.
     */
    view: IBufferView;

    /**
     * Attributes.
     */
    attributes: IGFXAttribute[];
}

/**
 * A primitive is a geometry constituted with a list of
 * same topology primitive graphic(such as points, lines or triangles).
 */
export interface IPrimitive {
    /**
     * The vertex bundles that this primitive use.
     */
    vertexBundelIndices: number[];

    /**
     * This primitive's topology.
     */
    primitiveMode: GFXPrimitiveMode;

    indexView?: IBufferView;

    /**
     * Geometric info for raycast purposes.
     */
    geometricInfo?: {
        doubleSided?: boolean;
        view: IBufferView;
    };
}

/**
 * Describes a mesh.
 */
export interface IMeshStruct {
    /**
     * The vertex bundles that this mesh owns.
     */
    vertexBundles: IVertexBundle[];

    /**
     * The primitives that this mesh owns.
     */
    primitives: IPrimitive[];

    /**
     * The min position of this mesh's vertices.
     */
    minPosition?: Vec3;

    /**
     * The max position of this mesh's vertices.
     */
    maxPosition?: Vec3;
}

// for raycast purpose
export type IBArray = Uint8Array | Uint16Array | Uint32Array;
export interface IGeometricInfo {
    positions: Float32Array;
    indices: IBArray;
    doubleSided?: boolean;
}

export interface IRenderingSubmesh {
    vertexBuffers: GFXBuffer[];
    indexBuffer: GFXBuffer | null;
    indirectBuffer?: GFXBuffer;
    attributes: IGFXAttribute[];
    primitiveMode: GFXPrimitiveMode;
    geometricInfo?: IGeometricInfo;
}

export class RenderingMesh {
    public constructor (
        private _subMeshes: IRenderingSubmesh[],
        private _vertexBuffers: GFXBuffer[],
        private _indexBuffers: GFXBuffer[]) {

    }

    public get subMeshes (): IRenderingSubmesh[] {
        return this._subMeshes;
    }

    public get subMeshCount () {
        return this._subMeshes.length;
    }

    public getSubmesh (index: number) {
        return this._subMeshes[index];
    }

    public destroy () {
        this._vertexBuffers.forEach((vertexBuffer) => {
            vertexBuffer.destroy();
        });
        this._vertexBuffers.length = 0;

        this._indexBuffers.forEach((indexBuffer) => {
            indexBuffer.destroy();
        });
        this._indexBuffers.length = 0;
        this._subMeshes.length = 0;
    }
}

@ccclass('cc.Mesh')
export class Mesh extends Asset {

    get _nativeAsset (): ArrayBuffer {
        return this._data!.buffer;
    }

    set _nativeAsset (value: ArrayBuffer) {
        this._data = new Uint8Array(value);
    }

    /**
     * Submeshes count of this mesh.
     * @deprecated Use this.renderingMesh.subMeshCount instead.
     */
    get subMeshCount () {
        const renderingMesh = this.renderingMesh;
        return renderingMesh ? renderingMesh.subMeshCount : 0;
    }

    /**
     * Min position of this mesh.
     * @deprecated Use this.struct.minPosition instead.
     */
    get minPosition () {
        return this.struct.minPosition;
    }

    /**
     * Max position of this mesh.
     * @deprecated Use this.struct.maxPosition instead.
     */
    get maxPosition () {
        return this.struct.maxPosition;
    }

    get struct () {
        return this._struct;
    }

    get data () {
        return this._data;
    }

    @property
    private _struct: IMeshStruct = {
        vertexBundles: [],
        primitives: [],
    };

    private _data: Uint8Array | null = null;

    private _initialized = false;

    private _renderingMesh: RenderingMesh | null = null;

    constructor () {
        super();
    }

    /**
     * Destory this mesh and immediately release its GPU resources.
     */
    public destroy () {
        this._tryDestroyRenderingMesh();
        return super.destroy();
    }

    /**
     * Assigns new mesh struct to this.
     * @param struct The new mesh's struct.
     * @param data The new mesh's data.
     */
    public assign (struct: IMeshStruct, data: Uint8Array) {
        this._struct = struct;
        this._data = data;
        this._tryDestroyRenderingMesh();
    }

    /**
     * Gets the rendering mesh.
     */
    public get renderingMesh (): RenderingMesh {
        this._init();
        return this._renderingMesh!;
    }

    /**
     * !#en
     * Gets the specified submesh.
     * @param index Index of the specified submesh.
     * @deprecated Use this.renderingMesh.getSubmesh(index).inputAssembler instead.
     */
    public getSubMesh (index: number): IRenderingSubmesh {
        return this.renderingMesh.getSubmesh(index);
    }

    public merge (mesh: Mesh, validate?: boolean): boolean {
        if (validate !== undefined && validate) {
            if (!this.validateMergingMesh(mesh)) {
                return false;
            }
        } // if

        // merge buffer
        const bufferBlob = new BufferBlob();

        // merge vertex buffer
        let vertCount = 0;
        let vertStride = 0;
        let srcOffset = 0;
        let dstOffset = 0;
        let vb: ArrayBuffer;
        let vbView: Uint8Array;
        let srcVBView: Uint8Array;
        let dstVBView: Uint8Array;

        const vertexBundles = new Array<IVertexBundle>(this._struct.vertexBundles.length);
        for (let i = 0; i < this._struct.vertexBundles.length; ++i) {
            const bundle = this._struct.vertexBundles[i];
            const dstBundle = mesh._struct.vertexBundles[i];

            srcOffset = bundle.view.offset;
            dstOffset = dstBundle.view.offset;
            vertStride = bundle.view.stride;
            vertCount = bundle.view.count + dstBundle.view.count;

            vb = new ArrayBuffer(vertCount * vertStride);
            vbView = new Uint8Array(vb);

            srcVBView = this._data!.subarray(srcOffset, srcOffset + bundle.view.length);
            srcOffset += srcVBView.length;
            dstVBView = mesh._data!.subarray(dstOffset, dstOffset + dstBundle.view.length);
            dstOffset += dstVBView.length;

            vbView.set(srcVBView);
            vbView.set(dstVBView, bundle.view.length);

            vertexBundles[i] = {
                attributes: bundle.attributes,
                view: {
                    offset: bufferBlob.getLength(),
                    length: vb.byteLength,
                    count: vertCount,
                    stride: vertStride,
                },
            };

            bufferBlob.addBuffer(vb);
        }

        // merge index buffer
        let idxCount = 0;
        let idxStride = 2;
        let vertBatchCount = 0;
        let ibView: Uint8Array | Uint16Array | Uint32Array;
        let srcIBView: Uint8Array | Uint16Array | Uint32Array;
        let dstIBView: Uint8Array | Uint16Array | Uint32Array;

        const primitives: IPrimitive[] = new Array<IPrimitive>(this._struct.primitives.length);
        for (let i = 0; i < this._struct.primitives.length; ++i) {
            const prim = this._struct.primitives[i];
            const dstPrim = mesh._struct.primitives[i];

            primitives[i] = {
                primitiveMode: prim.primitiveMode,
                vertexBundelIndices: prim.vertexBundelIndices,
            };

            for (const bundleIdx of prim.vertexBundelIndices) {
                vertBatchCount = Math.max(vertBatchCount, this._struct.vertexBundles[bundleIdx].view.count);
            }

            if (prim.indexView && dstPrim.indexView) {
                idxCount = prim.indexView.count;
                idxCount += dstPrim.indexView.count;

                srcOffset = prim.indexView.offset;
                dstOffset = dstPrim.indexView.offset;

                if (idxCount < 256) {
                    idxStride = 1;
                } else if (idxCount < 65536) {
                    idxStride = 2;
                } else {
                    idxStride = 4;
                }

                const ib = new ArrayBuffer(idxCount * idxStride);
                if (idxStride === 2) {
                    ibView = new Uint16Array(ib);
                } else if (idxStride === 1) {
                    ibView = new Uint8Array(ib);
                } else { // Uint32
                    ibView = new Uint32Array(ib);
                }

                // merge src indices
                if (prim.indexView.stride === 2) {
                    srcIBView = new Uint16Array(this._data!.buffer, srcOffset, prim.indexView.count);
                } else if (prim.indexView.stride === 1) {
                    srcIBView = new Uint8Array(this._data!.buffer, srcOffset, prim.indexView.count);
                } else { // Uint32
                    srcIBView = new Uint32Array(this._data!.buffer, srcOffset, prim.indexView.count);
                }

                if (idxStride === prim.indexView.stride) {
                    ibView.set(srcIBView);
                } else {
                    for (let n = 0; n < prim.indexView.count; ++n) {
                        ibView[n] = srcIBView[n];
                    }
                }
                srcOffset += prim.indexView.length;

                // merge dst indices
                if (dstPrim.indexView.stride === 2) {
                    dstIBView = new Uint16Array(mesh._data!.buffer, dstOffset, dstPrim.indexView.count);
                } else if (dstPrim.indexView.stride === 1) {
                    dstIBView = new Uint8Array(mesh._data!.buffer, dstOffset, dstPrim.indexView.count);
                } else { // Uint32
                    dstIBView = new Uint32Array(mesh._data!.buffer, dstOffset, dstPrim.indexView.count);
                }
                for (let n = 0; n < dstPrim.indexView.count; ++n) {
                    ibView[prim.indexView.count + n] = vertBatchCount + dstIBView[n];
                }
                dstOffset += dstPrim.indexView.length;

                primitives[i].indexView = {
                    offset: bufferBlob.getLength(),
                    length: ib.byteLength,
                    count: idxCount,
                    stride: idxStride,
                };

                bufferBlob.setNextAlignment(idxStride);
                bufferBlob.addBuffer(ib);
            }

            if (prim.geometricInfo && dstPrim.geometricInfo) {
                const geomBuffSize = prim.geometricInfo.view.length + dstPrim.geometricInfo.view.length;
                const geomBuff = new ArrayBuffer(geomBuffSize);
                const geomBuffView = new Uint8Array(geomBuff);
                const srcView = new Uint8Array(this._data!.buffer, prim.geometricInfo.view.offset, prim.geometricInfo.view.length);
                const dstView = new Uint8Array(mesh._data!.buffer, dstPrim.geometricInfo.view.offset, dstPrim.geometricInfo.view.length);
                geomBuffView.set(srcView);
                geomBuffView.set(dstView, srcView.length);

                bufferBlob.setNextAlignment(4);
                primitives[i].geometricInfo = {
                    doubleSided: prim.geometricInfo.doubleSided,
                    view: {
                        offset: bufferBlob.getLength(),
                        length: geomBuffView.length,
                        count: prim.geometricInfo.view.count,
                        stride: prim.geometricInfo.view.stride,
                    },
                };
                bufferBlob.addBuffer(geomBuff);
            }
        }

        // Create mesh struct.
        const meshStruct: IMeshStruct = {
            vertexBundles,
            primitives,
            minPosition: this._struct.minPosition,
            maxPosition: this._struct.maxPosition,
        };

        if (meshStruct.minPosition && mesh._struct.minPosition) {
            meshStruct.minPosition.x = Math.min(meshStruct.minPosition.x, mesh._struct.minPosition.x);
            meshStruct.minPosition.y = Math.min(meshStruct.minPosition.y, mesh._struct.minPosition.y);
            meshStruct.minPosition.z = Math.min(meshStruct.minPosition.z, mesh._struct.minPosition.z);
        }
        if (meshStruct.maxPosition && mesh._struct.maxPosition) {
            meshStruct.maxPosition.x = Math.max(meshStruct.maxPosition.x, mesh._struct.maxPosition.x);
            meshStruct.maxPosition.y = Math.max(meshStruct.maxPosition.y, mesh._struct.maxPosition.y);
            meshStruct.maxPosition.z = Math.max(meshStruct.maxPosition.z, mesh._struct.maxPosition.z);
        }

        // Create mesh.
        this.assign(meshStruct, new Uint8Array(bufferBlob.getCombined()));
        this._init ();

        return true;
    }

    public validateMergingMesh (mesh: Mesh) {
        // validate vertex bundles
        if (this._struct.vertexBundles.length !== mesh._struct.vertexBundles.length) {
            return false;
        }

        for (let i = 0; i < this._struct.vertexBundles.length; ++i) {
            const bundle = this._struct.vertexBundles[i];
            const dstBundle = mesh._struct.vertexBundles[i];

            if (bundle.attributes.length !== dstBundle.attributes.length) {
                return false;
            }
            for (let j = 0; j < bundle.attributes.length; ++j) {
                if (bundle.attributes[j].format !== dstBundle.attributes[j].format) {
                    return false;
                }
            }
        }

        // validate primitives
        if (this._struct.primitives.length !== mesh._struct.primitives.length) {
            return false;
        }
        for (let i = 0; i < this._struct.primitives.length; ++i) {
            const prim = this._struct.primitives[i];
            const dstPrim = mesh._struct.primitives[i];
            if (prim.vertexBundelIndices.length !== dstPrim.vertexBundelIndices.length) {
                return false;
            }
            for (let j = 0; j < prim.vertexBundelIndices.length; ++j) {
                if (prim.vertexBundelIndices[j] !== dstPrim.vertexBundelIndices[j]) {
                    return false;
                }
            }
            if (prim.primitiveMode !== dstPrim.primitiveMode) {
                return false;
            }

            if (prim.indexView) {
                if (dstPrim.indexView === undefined) {
                    return false;
                }
            } else {
                if (dstPrim.indexView) {
                    return false;
                }
            }
        }

        return true;
    }

    private _init () {
        if (this._initialized) {
            return;
        }

        this._initialized = true;

        if (this._data === null) {
            return;
        }

        const buffer = this._data.buffer;
        const gfxDevice: GFXDevice = cc.director.root.device;
        const vertexBuffers = this._createVertexBuffers(gfxDevice, buffer);
        const indexBuffers: GFXBuffer[] = [];
        const submeshes: IRenderingSubmesh[] = [];

        for (const prim of this._struct.primitives) {
            if (prim.vertexBundelIndices.length === 0) {
                continue;
            }

            let indexBuffer: GFXBuffer | null = null;
            let ib: any = null;
            if (prim.indexView) {
                const idxView = prim.indexView;

                indexBuffer = gfxDevice.createBuffer({
                    usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: idxView.length,
                    stride: idxView.stride,
                });
                indexBuffers.push(indexBuffer);

                ib = new (getIndexStrideCtor(idxView.stride))(buffer, idxView.offset, idxView.count);
                indexBuffer.update(ib);
            }

            const vbReference = prim.vertexBundelIndices.map((i) => vertexBuffers[i]);

            let gfxAttributes: IGFXAttribute[] = [];
            if (prim.vertexBundelIndices.length > 0) {
                const idx = prim.vertexBundelIndices[0];
                const vertexBundle = this._struct.vertexBundles[idx];
                gfxAttributes = vertexBundle.attributes;
            }

            const subMesh: IRenderingSubmesh = {
                primitiveMode: prim.primitiveMode,
                vertexBuffers: vbReference,
                indexBuffer,
                attributes: gfxAttributes,
            };

            if (prim.geometricInfo) {
                const info = prim.geometricInfo;
                subMesh.geometricInfo = {
                    indices: ib,
                    positions: new Float32Array(buffer, info.view.offset, info.view.length / 4),
                };
            }

            submeshes.push(subMesh);
        }

        this._renderingMesh = new RenderingMesh(submeshes, vertexBuffers, indexBuffers);
    }

    private _createVertexBuffers (gfxDevice: GFXDevice, data: ArrayBuffer): GFXBuffer[] {
        return this._struct.vertexBundles.map((vertexBundle) => {
            const vertexBuffer = gfxDevice.createBuffer({
                usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: vertexBundle.view.length,
                stride: vertexBundle.view.stride,
            });

            vertexBuffer.update(new Uint8Array(data, vertexBundle.view.offset, vertexBundle.view.length));
            return vertexBuffer;
        });
    }

    private _tryDestroyRenderingMesh () {
        if (this._renderingMesh) {
            this._renderingMesh.destroy();
            this._renderingMesh = null;
            this._initialized = false;
        }
    }
}
cc.Mesh = Mesh;
