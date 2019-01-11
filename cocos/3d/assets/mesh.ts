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

// @ts-check
import { _decorator } from '../../core/data';
import { ccenum } from '../../core/value-types/enum';
const { ccclass, property } = _decorator;
import { Asset } from '../../assets/asset';
import { Vec3 } from '../../core/value-types';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXFormat, GFXMemoryUsageBit, GFXPrimitiveMode } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler, IGFXInputAttribute } from '../../gfx/input-assembler';
import { IBufferRange } from './utils/buffer-range';

export enum AttributeBaseType {
    /**
     * 8 bits signed integer.
     */
    INT8,

    /**
     * 8 bits unsigned integer.
     */
    UINT8,

    /**
     * 16 bits signed integer.
     */
    INT16,

    /**
     * 16 bits unsigned integer.
     */
    UINT16,

    /**
     * 32 bits signed integer.
     */
    INT32,

    /**
     * 32 bits unsigned integer.
     */
    UINT32,

    /**
     * 32 bits floating number.
     */
    FLOAT32,
}

ccenum(AttributeBaseType);

export enum AttributeType {
    /**
     * Scalar.
     */
    SCALAR,

    /**
     * 2 components vector.
     */
    VEC2,

    /**
     * 3 components vector.
     */
    VEC3,

    /**
     * 4 components vector.
     */
    VEC4,
}

ccenum(AttributeType);

export enum Topology {
    /**
     * Point list.
     */
    POINT_LIST = GFXPrimitiveMode.POINT_LIST,

    /**
     * Line list.
     */
    LINE_LIST = GFXPrimitiveMode.LINE_LIST,

    /**
     * Triangle list.
     */
    TRIANGLE_LIST = GFXPrimitiveMode.TRIANGLE_LIST,
}

ccenum(Topology);

function toGFXTopology (topology: Topology) {
    return topology as unknown as GFXPrimitiveMode;
}

export enum IndexUnit {
    /**
     * 8 bits unsigned integer.
     */
    UINT8,

    /**
     * 8 bits unsigned integer.
     */
    UINT16,

    /**
     * 8 bits unsigned integer.
     */
    UINT32,
}

ccenum(IndexUnit);

function getIndexUnitStride (indexUnit: IndexUnit) {
    switch (indexUnit) {
        case IndexUnit.UINT8: return 1;
        case IndexUnit.UINT16: return 2;
        case IndexUnit.UINT32: return 3;
    }
    return 1;
}

export interface IVertexAttribute {
    /**
     * Attribute Name.
     */
    name: string;

    /**
     * Attribute base type.
     */
    baseType: AttributeBaseType;

    /**
     * Attribute type.
     */
    type: AttributeType;

    /**
     * Whether normalize.
     */
    normalize: boolean;
}

function toGFXAttributeType (vertexAttribute: IVertexAttribute) {
    let formatName = '';
    switch (vertexAttribute.type) {
        case AttributeType.SCALAR:
            formatName = 'R';
            break;
        case AttributeType.VEC2:
            formatName = 'RG';
            break;
        case AttributeType.VEC3:
            formatName = 'RGB';
            break;
        case AttributeType.VEC4:
            formatName = 'RGBA';
            break;
    }
    switch (vertexAttribute.baseType) {
        case AttributeBaseType.INT8:
            formatName += '8I';
            break;
        case AttributeBaseType.UINT8:
            formatName += '8UI';
            break;
        case AttributeBaseType.INT16:
            formatName += '16I';
            break;
        case AttributeBaseType.UINT16:
            formatName += '16UI';
            break;
        case AttributeBaseType.INT32:
            formatName += '32I';
            break;
        case AttributeBaseType.UINT32:
            formatName += '32UI';
            break;
        case AttributeBaseType.FLOAT32:
            formatName += '32F';
            break;
    }

    const resultFormat = GFXFormat[formatName];
    if (resultFormat !== undefined) {
        return resultFormat;
    }

    return GFXFormat.R8UI;
}

export interface IVertexBundle {
    /**
     * The data range of this bundle.
     * This range of data is essentially mapped to a GPU vertex buffer.
     */
    data: IBufferRange;

    /**
     * This bundle's vertices count.
     */
    verticesCount: number;

    /**
     * Attributes.
     */
    attributes: IVertexAttribute[];
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
     * The indices data range of this primitive.
     */
    indices: IBufferRange;

    /**
     * The type of this primitive's indices.
     */
    indexUnit: IndexUnit;

    /**
     * This primitive's topology.
     */
    topology: Topology;
}

export interface IRenderingSubmesh {
    inputAssembler: GFXInputAssembler;
    primitiveMode: GFXPrimitiveMode;
    doubleSided?: boolean;
}

export class RenderingMesh {
    public constructor (
        private _subMeshes: Array<IRenderingSubmesh | null>,
        private _vertexBuffers: GFXBuffer[],
        private _indexBuffers: GFXBuffer[]) {

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

        this._subMeshes.forEach((subMesh) => {
            if (subMesh) {
                subMesh.inputAssembler.destroy();
            }
        });
        this._subMeshes.length = 0;
    }
}

@ccclass('cc.Mesh')
export class Mesh extends Asset {

    get _nativeAsset () {
        return this._data;
    }

    set _nativeAsset (value) {
        this._data = value;
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
     */
    get minPosition () {
        return this._minPosition;
    }

    /**
     * Max position of this mesh.
     */
    get maxPosition () {
        return this._maxPosition;
    }

    /**
     * The vertex bundles that this mesh owns.
     */
    @property
    public _vertexBundles: IVertexBundle[] = [];

    /**
     * The primitives that this mesh owns.
     */
    @property
    public _primitives: IPrimitive[] = [];

    /**
     * The min position of this mesh's vertices.
     */
    @property(Vec3)
    public _minPosition: Vec3 = new Vec3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);

    /**
     * The max position of this mesh's vertices.
     */
    @property(Vec3)
    public _maxPosition: Vec3 = new Vec3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

    private _data: Uint8Array | null = null;

    private _initialized = false;

    private _renderingMesh: RenderingMesh | null = null;

    constructor () {
        super();
    }

    /**
     * Destory this mesh and immediately release its video memory.
     */
    public destroy () {
        if (this._renderingMesh) {
            this._renderingMesh.destroy();
            this._renderingMesh = null;
            this._initialized = false;
        }
        return super.destroy();
    }

    /**
     * Gets the rendering mesh.
     */
    public get renderingMesh () {
        this._lazyInitRenderResources();
        return this._renderingMesh;
    }

    /**
     * !#en
     * Gets the specified submesh.
     * @param index Index of the specified submesh.
     * @deprecated Using this.renderingMesh.getSubmesh(index)inputAssembler instead.
     */
    public getSubMesh (index: number) {
        const renderingSubmesh = this.renderingMesh ? this.renderingMesh.getSubmesh(index) : null;
        return renderingSubmesh ? renderingSubmesh.inputAssembler : null;
    }

    private _lazyInitRenderResources () {
        if (this._initialized) {
            return;
        }

        this._initialized = true;

        if (this._data === null) {
            return;
        }

        const buffer = this._data.buffer;

        const gfxDevice = cc.director.root.device as GFXDevice;

        const vertexBuffers = this._createVertexBuffers(gfxDevice, buffer);

        const indexBuffers: GFXBuffer[] = [];

        const renderingSubmeshes = this._primitives.map((primitive) => {
            if (primitive.vertexBundelIndices.length === 0) {
                return null;
            }

            const indexBuffer = gfxDevice.createBuffer({
                usage: GFXBufferUsageBit.INDEX,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: primitive.indices.length,
                stride: getIndexUnitStride(primitive.indexUnit),
            });
            indexBuffers.push(indexBuffer);

            indexBuffer.update(buffer, primitive.indices.offset, primitive.indices.length);

            const gfxAttributes: IGFXInputAttribute[] = [];
            primitive.vertexBundelIndices.forEach((iVertexBundle) => {
                const vertexBundle = this._vertexBundles[iVertexBundle];
                vertexBundle.attributes.forEach((attribute) => {
                    const gfxAttribute: IGFXInputAttribute = {
                        name: attribute.name,
                        format: toGFXAttributeType(attribute),
                        stream: iVertexBundle,
                    };
                    if ('normalize' in attribute) {
                        gfxAttribute.isNormalized = attribute.normalize;
                    }
                    gfxAttributes.push(gfxAttribute);
                });
            });

            const referedVertexBuffers = primitive.vertexBundelIndices.map(
                (i) => vertexBuffers[i]);

            return {
                primitiveMode: toGFXTopology(primitive.topology),
                inputAssembler: gfxDevice.createInputAssembler({
                    attributes: gfxAttributes,
                    vertexBuffers: referedVertexBuffers,
                    indexBuffer,
                }),
            } as IRenderingSubmesh ;
        });

        this._renderingMesh = new RenderingMesh(renderingSubmeshes, vertexBuffers, indexBuffers);
    }

    private _createVertexBuffers (gfxDevice: GFXDevice, data: ArrayBuffer): GFXBuffer[] {
        return this._vertexBundles.map((vertexBundle) => {
            const vertexBuffer = gfxDevice.createBuffer({
                usage: GFXBufferUsageBit.VERTEX,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: vertexBundle.data.length,
                stride: vertexBundle.data.length / vertexBundle.verticesCount,
            });
            vertexBuffer.update(new Uint8Array(data, vertexBundle.data.offset, vertexBundle.data.length));
            return vertexBuffer;
        });
    }
}
cc.Mesh = Mesh;
