/*
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
*/

/**
 * @category asset
 */

import { Asset } from '../../assets/asset';
import { ccclass, property } from '../../core/data/class-decorator';
import { Vec3 } from '../../core/value-types';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXAttributeName, GFXBufferUsageBit, GFXFormat, GFXFormatInfos, GFXFormatType, GFXMemoryUsageBit, GFXPrimitiveMode } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { BufferBlob } from '../misc/buffer-blob';
import { IBufferView } from './utils/buffer-view';
import { postLoadMesh } from './utils/mesh-utils';

function getIndexStrideCtor (stride: number) {
    switch (stride) {
        case 1: return Uint8Array;
        case 2: return Uint16Array;
        case 4: return Uint32Array;
    }
    return Uint8Array;
}

/**
 * @zh
 * 顶点块。顶点块描述了一组**交错排列**（interleaved）的顶点属性并存储了顶点属性的实际数据。<br>
 * 交错排列是指在实际数据的缓冲区中，每个顶点的所有属性总是依次排列，并总是出现在下一个顶点的所有属性之前。
 */
export interface IVertexBundle {
    /**
     * 所有顶点属性的实际数据块。
     */
    view: IBufferView;

    /**
     * 包含的所有顶点属性。
     */
    attributes: IGFXAttribute[];
}

/**
 * 子网格。子网格由一系列相同类型的图元组成（例如点、线、面等）。
 */
export interface IPrimitive {
    /**
     * 此子网格引用的顶点块，索引至网格的顶点块数组。
     */
    vertexBundelIndices: number[];

    /**
     * 此子网格的图元类型。
     */
    primitiveMode: GFXPrimitiveMode;

    /**
     * 此子网格使用的索引数据。
     */
    indexView?: IBufferView;

    /**
     * （用于射线检测的）几何信息。
     */
    geometricInfo?: {
        doubleSided?: boolean;
        view: IBufferView;
    };
}

/**
 * 描述了网格的结构。
 */
export interface IMeshStruct {
    /**
     * 此网格所有的顶点块。
     */
    vertexBundles: IVertexBundle[];

    /**
     * 此网格的所有子网格。
     */
    primitives: IPrimitive[];

    /**
     * （各分量都）小于等于此网格任何顶点位置的最大位置。
     */
    minPosition?: Vec3;

    /**
     * （各分量都）大于等于此网格任何顶点位置的最小位置。
     */
    maxPosition?: Vec3;
}

/**
 * 允许存储索引的数组视图。
 */
export type IBArray = Uint8Array | Uint16Array | Uint32Array;

/**
 * 几何信息。
 */
export interface IGeometricInfo {
    /**
     * 顶点位置。
     */
    positions: Float32Array;

    /**
     * 索引数据。
     */
    indices: IBArray;

    /**
     * 是否将图元按双面对待。
     */
    doubleSided?: boolean;
}

/**
 * 渲染子网格。
 */
export interface IRenderingSubmesh {
    /**
     * 使用的所有顶点缓冲区。
     */
    vertexBuffers: GFXBuffer[];

    /**
     * 使用的索引缓冲区，若未使用则为 `null`。
     */
    indexBuffer: GFXBuffer | null;

    /**
     * 间接绘制缓冲区。
     */
    indirectBuffer?: GFXBuffer;

    /**
     * 所有顶点属性。
     */
    attributes: IGFXAttribute[];

    /**
     * 图元类型。
     */
    primitiveMode: GFXPrimitiveMode;

    /**
     * （用于射线检测的）几何信息。
     */
    geometricInfo?: IGeometricInfo;
}

/**
 * 渲染网格。
 */
export class RenderingMesh {
    public constructor (
        private _subMeshes: IRenderingSubmesh[]) {
    }

    /**
     * 渲染子网格。
     */
    public get subMeshes (): IRenderingSubmesh[] {
        return this._subMeshes;
    }

    /**
     * 渲染子网格的数目。
     */
    public get subMeshCount () {
        return this._subMeshes.length;
    }

    /**
     * 获取指定的渲染子网格。
     * @param index 渲染子网格的索引。
     */
    public getSubmesh (index: number) {
        return this._subMeshes[index];
    }

    /**
     * 移除所有渲染子网格。
     */
    public clearSubMeshes () {
        for (const subMesh of this._subMeshes) {
            for (const vb of subMesh.vertexBuffers) {
                vb.destroy();
            }
            if (subMesh.indexBuffer) {
                subMesh.indexBuffer.destroy();
            }
        }
        this._subMeshes.splice(0);
    }

    /**
     * 销毁此渲染网格，移除其所有渲染子网格。
     */
    public destroy () {
        this.clearSubMeshes();
        this._subMeshes.length = 0;
    }
}

export interface IMeshCreateInfo {
    /**
     * 网格结构。
     */
    struct: IMeshStruct;

    /**
     * 网格二进制数据。
     */
    data: Uint8Array;
}

/**
 * 网格资源。
 */
@ccclass('cc.Mesh')
export class Mesh extends Asset {

    get _nativeAsset (): ArrayBuffer {
        return this._data!.buffer;
    }

    set _nativeAsset (value: ArrayBuffer) {
        if (this._data && this._data.byteLength === value.byteLength) {
            this._data.set(new Uint8Array(value));
            if (cc.loader._cache[this.nativeUrl]) {
                cc.loader._cache[this.nativeUrl].content = this._data.buffer;
            }
        }
        else {
            this._data = new Uint8Array(value);
        }
        this.loaded = true;
        this.emit('load');
    }

    /**
     * 此网格的子网格数量。
     * @deprecated 请使用 `this.renderingMesh.subMeshCount`。
     */
    get subMeshCount () {
        const renderingMesh = this.renderingMesh;
        return renderingMesh ? renderingMesh.subMeshCount : 0;
    }

    /**
     * （各分量都）小于等于此网格任何顶点位置的最大位置。
     * @deprecated 请使用 `this.struct.minPosition`。
     */
    get minPosition () {
        return this.struct.minPosition;
    }

    /**
     * （各分量都）大于等于此网格任何顶点位置的最大位置。
     * @deprecated 请使用 `this.struct.maxPosition`。
     */
    get maxPosition () {
        return this.struct.maxPosition;
    }

    /**
     * 此网格的结构。
     */
    get struct () {
        return this._struct;
    }

    /**
     * 此网格的数据。
     */
    get data () {
        return this._data;
    }

    @property
    private _struct: IMeshStruct = {
        vertexBundles: [],
        primitives: [],
    };

    @property
    private _dataLength: number = 0;

    private _data: Uint8Array | null = null;

    private _initialized = false;

    private _renderingMesh: RenderingMesh | null = null;

    constructor () {
        super();
        this.loaded = false;
    }

    public initialize () {
        if (this._initialized) {
            return;
        }

        this._initialized = true;

        if (!this._data) {
            this._data = new Uint8Array(this._dataLength);
            postLoadMesh(this);
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
                if (this.loaded) {
                    indexBuffer.update(ib);
                }
                else {
                    this.once('load', () => {
                        indexBuffer!.update(ib);
                    });
                }
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
                const positions = new Float32Array(buffer, info.view.offset, info.view.length / 4);
                subMesh.geometricInfo = {
                    indices: ib,
                    positions,
                };
            }

            submeshes.push(subMesh);
        }

        this._renderingMesh = new RenderingMesh(submeshes);
    }

    /**
     * 销毁此网格，并释放它占有的所有 GPU 资源。
     */
    public destroy () {
        this.destroyRenderingMesh();
        return super.destroy();
    }

    /**
     * 释放此网格占有的所有 GPU 资源。
     */
    public destroyRenderingMesh () {
        if (this._renderingMesh) {
            this._renderingMesh.destroy();
            this._renderingMesh = null;
            this._data = null;
            this._initialized = false;
        }
    }

    /**
     * 重置此网格的结构和数据。
     * @param struct 新的结构。
     * @param data 新的数据。
     * @deprecated 将在 V1.0.0 移除，请转用 `this.reset()`。
     */
    public assign (struct: IMeshStruct, data: Uint8Array) {
        this.reset({
            struct,
            data,
        });
    }

    /**
     * 重置此网格。
     * @param info 网格重置选项。
     */
    public reset (info: IMeshCreateInfo) {
        this.destroyRenderingMesh();
        this._struct = info.struct;
        this._data = info.data;
        this.loaded = true;
        this.emit('load');
    }

    /**
     * 此网格创建的渲染网格。
     */
    public get renderingMesh (): RenderingMesh {
        this.initialize();
        return this._renderingMesh!;
    }

    /**
     * 获取此网格创建的渲染子网格。
     * @param index 渲染子网格的索引。
     * @returns 指定的渲染子网格。
     * @deprecated 请使用 `this.renderingMesh.getSubmesh(index)`。
     */
    public getSubMesh (index: number): IRenderingSubmesh {
        return this.renderingMesh.getSubmesh(index);
    }

    /**
     * 合并指定的网格到此网格中。
     * @param mesh 合并的网格。
     * @param [validate=false] 是否进行验证。
     * @returns 是否验证成功。若验证选项为 `true` 且验证未通过则返回 `false`，否则返回 `true`。
     */
    public merge (mesh: Mesh, validate?: boolean): boolean {
        if (validate !== undefined && validate) {
            if (!this.loaded || !mesh.loaded || !this.validateMergingMesh(mesh)) {
                return false;
            }
        }

        if (!this._initialized && mesh._data) {
            const struct = JSON.parse(JSON.stringify(mesh._struct));
            const data = mesh._data.slice();
            this.reset({struct, data});
            this.initialize();
            return true;
        }

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
        let srcAttrOffset = 0;
        let srcVBOffset = 0;
        let dstVBOffset = 0;
        let attrSize = 0;
        let dstAttrView: Uint8Array;
        let hasAttr = false;

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

            srcAttrOffset = 0;
            for (const attr of bundle.attributes) {
                dstVBOffset = 0;
                hasAttr = false;
                for (const dstAttr of dstBundle.attributes) {
                    if (attr.name === dstAttr.name && attr.format === dstAttr.format) {
                        hasAttr = true;
                        break;
                    }
                    dstVBOffset += GFXFormatInfos[dstAttr.format].size;
                }
                if (hasAttr) {
                    attrSize = GFXFormatInfos[attr.format].size;
                    srcVBOffset = bundle.view.length + srcAttrOffset;
                    for (let v = 0; v < dstBundle.view.count; ++v) {
                        dstAttrView = dstVBView.subarray(dstVBOffset, dstVBOffset + attrSize);
                        vbView.set(dstAttrView, srcVBOffset);
                        srcVBOffset += bundle.view.stride;
                        dstVBOffset += dstBundle.view.stride;
                    }
                }
                srcAttrOffset += GFXFormatInfos[attr.format].size;
            }

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
                        count: prim.geometricInfo.view.count + dstPrim.geometricInfo.view.count,
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
            Vec3.min(meshStruct.minPosition, meshStruct.minPosition, mesh._struct.minPosition);
        }
        if (meshStruct.maxPosition && mesh._struct.maxPosition) {
            Vec3.max(meshStruct.maxPosition, meshStruct.maxPosition, mesh._struct.maxPosition);
        }

        // Create mesh.
        this.reset({
            struct: meshStruct,
            data: new Uint8Array(bufferBlob.getCombined()),
        });
        this.initialize();

        return true;
    }

    /**
     * 验证指定网格是否可以合并至当前网格。
     *
     * 当满足以下条件之一时，指定网格可以合并至当前网格：
     *  - 当前网格无数据而待合并网格有数据；
     *  - 它们的顶点块数目相同且对应顶点块的布局一致，并且它们的子网格数目相同且对应子网格的布局一致。
     *
     * 两个顶点块布局一致当且仅当：
     *  - 它们具有相同数量的顶点属性且对应的顶点属性具有相同的属性格式。
     *
     * 两个子网格布局一致，当且仅当：
     *  - 它们具有相同的图元类型并且引用相同数量、相同索引的顶点块；并且，
     *  - 要么都需要索引绘制，要么都不需要索引绘制。
     * @param mesh 指定的网格。
     */
    public validateMergingMesh (mesh: Mesh) {
        if (!this._data && mesh._data) {
            return true;
        }

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

    /**
     * 读取子网格的指定属性。
     * @param primitiveIndex 子网格索引。
     * @param attributeName 属性名称。
     * @returns 不存在指定的子网格、子网格不存在指定的属性或属性无法读取时返回 `null`，
     * 否则，创建足够大的缓冲区包含指定属性的所有数据，并为该缓冲区创建与属性类型对应的数组视图。
     */
    public readAttribute (primitiveIndex: number, attributeName: GFXAttributeName): Storage | null {
        let result: Storage | null = null;
        this._accessAttribute(primitiveIndex, attributeName, (vertexBundle, iAttribute) => {
            const format = vertexBundle.attributes[iAttribute].format;

            const inputView = new DataView(
                this._data!.buffer,
                vertexBundle.view.offset + getOffset(vertexBundle.attributes, iAttribute));

            const formatInfo = GFXFormatInfos[format];
            const storageConstructor = getStorageConstructor(format);
            const reader = getReader(inputView, format);
            if (!storageConstructor || !reader) {
                return;
            }
            const vertexCount = vertexBundle.view.count;
            const componentCount = formatInfo.count;
            const storage = new storageConstructor(vertexCount * componentCount);
            const inputStride = vertexBundle.view.stride;
            for (let iVertex = 0; iVertex < vertexCount; ++iVertex) {
                for (let iComponent = 0; iComponent < componentCount; ++iComponent) {
                    storage[componentCount * iVertex + iComponent] = reader(inputStride * iVertex + storage.BYTES_PER_ELEMENT * iComponent);
                }
            }
            result = storage;
            return;
        });
        return result;
    }

    /**
     * 读取子网格的指定属性到目标缓冲区中。
     * @param primitiveIndex 子网格索引。
     * @param attributeName 属性名称。
     * @param buffer 目标缓冲区。
     * @param stride 相邻属性在目标缓冲区的字节间隔。
     * @param offset 首个属性在目标缓冲区中的偏移。
     * @returns 不存在指定的子网格、子网格不存在指定的属性或属性无法读取时返回 `false`，否则返回 `true`。
     */
    public copyAttribute (primitiveIndex: number, attributeName: GFXAttributeName, buffer: ArrayBuffer, stride: number, offset: number) {
        let written = false;
        this._accessAttribute(primitiveIndex, attributeName, (vertexBundle, iAttribute) => {
            const format = vertexBundle.attributes[iAttribute].format;

            const inputView = new DataView(
                this._data!.buffer,
                vertexBundle.view.offset + getOffset(vertexBundle.attributes, iAttribute));

            const outputView = new DataView(buffer, offset);

            const formatInfo = GFXFormatInfos[format];

            const reader = getReader(inputView, format);
            const writer = getWriter(outputView, format);
            if (!reader || !writer) {
                return;
            }

            const vertexCount = vertexBundle.view.count;
            const componentCount = formatInfo.count;

            const inputStride = vertexBundle.view.stride;
            const inputComponentByteLength = getComponentByteLength(format);
            const outputStride = stride;
            const outputComponentByteLength = inputComponentByteLength;
            for (let iVertex = 0; iVertex < vertexCount; ++iVertex) {
                for (let iComponent = 0; iComponent < componentCount; ++iComponent) {
                    const inputOffset = inputStride * iVertex + inputComponentByteLength * iComponent;
                    const outputOffset = outputStride * iVertex + outputComponentByteLength * iComponent;
                    writer(outputOffset, reader(inputOffset));
                }
            }
            written = true;
            return;
        });
        return written;
    }

    /**
     * 读取子网格的索引数据。
     * @param primitiveIndex 子网格索引。
     * @returns 不存在指定的子网格或子网格不存在索引数据时返回 `null`，
     * 否则，创建足够大的缓冲区包含所有索引数据，并为该缓冲区创建与索引类型对应的数组视图。
     */
    public readIndices (primitiveIndex: number) {
        if (!this._data ||
            primitiveIndex >= this._struct.primitives.length) {
            return null;
        }
        const primitive = this._struct.primitives[primitiveIndex];
        if (!primitive.indexView) {
            return null;
        }
        const indexCount = primitive.indexView.count;
        const indexFormat = indexCount < 256 ? GFXFormat.R8UI : (indexCount < 65536 ? GFXFormat.R16UI : GFXFormat.R32UI);
        const storage = new (getStorageConstructor(indexFormat)!)(indexCount);
        const reader = getReader(new DataView(this._data.buffer), indexFormat)!;
        for (let i = 0; i < indexCount; ++i) {
            storage[i] = reader(primitive.indexView.offset + storage.BYTES_PER_ELEMENT * i);
        }
        return storage;
    }

    /**
     * 读取子网格的索引数据到目标数组中。
     * @param primitiveIndex 子网格索引。
     * @param outputArray 目标数组。
     * @returns 不存在指定的子网格或子网格不存在索引数据时返回 `false`，否则返回 `true`。
     */
    public copyIndices (primitiveIndex: number, outputArray: number[] | ArrayBufferView) {
        if (!this._data ||
            primitiveIndex >= this._struct.primitives.length) {
            return false;
        }
        const primitive = this._struct.primitives[primitiveIndex];
        if (!primitive.indexView) {
            return false;
        }
        const indexCount = primitive.indexView.count;
        const indexFormat = primitive.indexView.stride === 1 ? GFXFormat.R8UI : (primitive.indexView.stride === 2 ? GFXFormat.R16UI : GFXFormat.R32UI);
        const reader = getReader(new DataView(this._data.buffer), indexFormat)!;
        for (let i = 0; i < indexCount; ++i) {
            outputArray[i] = reader(primitive.indexView.offset + GFXFormatInfos[indexFormat].size * i);
        }
        return true;
    }

    private _accessAttribute (
        primitiveIndex: number,
        attributeName: GFXAttributeName,
        accessor: (vertexBundle: IVertexBundle, iAttribute: number) => void) {
        if (!this._data ||
            primitiveIndex >= this._struct.primitives.length) {
            return;
        }
        const primitive = this._struct.primitives[primitiveIndex];
        for (const vertexBundleIndex of primitive.vertexBundelIndices) {
            const vertexBundle = this._struct.vertexBundles[vertexBundleIndex];
            const iAttribute = vertexBundle.attributes.findIndex((a) => a.name === attributeName);
            if (iAttribute < 0) {
                continue;
            }
            accessor(vertexBundle, iAttribute);
            break;
        }
        return;
    }

    private _createVertexBuffers (gfxDevice: GFXDevice, data: ArrayBuffer): GFXBuffer[] {
        return this._struct.vertexBundles.map((vertexBundle) => {
            const vertexBuffer = gfxDevice.createBuffer({
                usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: vertexBundle.view.length,
                stride: vertexBundle.view.stride,
            });

            const view = new Uint8Array(data, vertexBundle.view.offset, vertexBundle.view.length);
            if (this.loaded) {
                vertexBuffer.update(view);
            }
            else {
                this.once('load', () => {
                    vertexBuffer.update(view);
                });
            }
            return vertexBuffer;
        });
    }
}
cc.Mesh = Mesh;

function getOffset (attributes: IGFXAttribute[], attributeIndex: number) {
    let result = 0;
    for (let i = 0; i < attributeIndex; ++i) {
        const attribute = attributes[i];
        result += GFXFormatInfos[attribute.format].size;
    }
    return result;
}

type Storage = Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array | Float64Array;

type StorageConstructor = Constructor<Storage>;

function getStorageConstructor (format: GFXFormat): StorageConstructor | null {
    const info = GFXFormatInfos[format];
    const stride = info.size / info.count;
    switch (info.type) {
        case GFXFormatType.UNORM:
        case GFXFormatType.UINT: {
            switch (stride) {
                case 1: return Uint8Array;
                case 2: return Uint16Array;
                case 4: return Uint32Array;
            }
            break;
        }
        case GFXFormatType.SNORM:
        case GFXFormatType.INT: {
            switch (stride) {
                case 1: return Int8Array;
                case 2: return Int16Array;
                case 4: return Int32Array;
            }
            break;
        }
        case GFXFormatType.FLOAT: {
            return Float32Array;
        }
    }
    return null;
}

const isLittleEndian = cc.sys.isLittleEndian;

function getComponentByteLength (format: GFXFormat) {
    const info = GFXFormatInfos[format];
    return info.size / info.count;
}

function getReader (dataView: DataView, format: GFXFormat) {
    const info = GFXFormatInfos[format];
    const stride = info.size / info.count;

    switch (info.type) {
        case GFXFormatType.UNORM: {
            switch (stride) {
                case 1: return (offset: number) => dataView.getUint8(offset);
                case 2: return (offset: number) => dataView.getUint16(offset, isLittleEndian);
                case 4: return (offset: number) => dataView.getUint32(offset, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.SNORM: {
            switch (stride) {
                case 1: return (offset: number) => dataView.getInt8(offset);
                case 2: return (offset: number) => dataView.getInt16(offset, isLittleEndian);
                case 4: return (offset: number) => dataView.getInt32(offset, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.INT: {
            switch (stride) {
                case 1: return (offset: number) => dataView.getInt8(offset);
                case 2: return (offset: number) => dataView.getInt16(offset, isLittleEndian);
                case 4: return (offset: number) => dataView.getInt32(offset, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.UINT: {
            switch (stride) {
                case 1: return (offset: number) => dataView.getUint8(offset);
                case 2: return (offset: number) => dataView.getUint16(offset, isLittleEndian);
                case 4: return (offset: number) => dataView.getUint32(offset, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.FLOAT: {
            return (offset: number) => dataView.getFloat32(offset, isLittleEndian);
        }
    }

    return null;
}

function getWriter (dataView: DataView, format: GFXFormat) {
    const info = GFXFormatInfos[format];
    const stride = info.size / info.count;

    switch (info.type) {
        case GFXFormatType.UNORM: {
            switch (stride) {
                case 1: return (offset: number, value: number) => dataView.setUint8(offset, value);
                case 2: return (offset: number, value: number) => dataView.setUint16(offset, value, isLittleEndian);
                case 4: return (offset: number, value: number) => dataView.setUint32(offset, value, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.SNORM: {
            switch (stride) {
                case 1: return (offset: number, value: number) => dataView.setInt8(offset, value);
                case 2: return (offset: number, value: number) => dataView.setInt16(offset, value, isLittleEndian);
                case 4: return (offset: number, value: number) => dataView.setInt32(offset, value, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.INT: {
            switch (stride) {
                case 1: return (offset: number, value: number) => dataView.setInt8(offset, value);
                case 2: return (offset: number, value: number) => dataView.setInt16(offset, value, isLittleEndian);
                case 4: return (offset: number, value: number) => dataView.setInt32(offset, value, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.UINT: {
            switch (stride) {
                case 1: return (offset: number, value: number) => dataView.setUint8(offset, value);
                case 2: return (offset: number, value: number) => dataView.setUint16(offset, value, isLittleEndian);
                case 4: return (offset: number, value: number) => dataView.setUint32(offset, value, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.FLOAT: {
            return (offset: number, value: number) => dataView.setFloat32(offset, value, isLittleEndian);
        }
    }

    return null;
}
