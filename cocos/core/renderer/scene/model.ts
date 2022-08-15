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

// Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.
import { builtinResMgr } from '../../builtin/builtin-res-mgr';
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/rendering-sub-mesh';
import { AABB } from '../../geometry/aabb';
import { Node } from '../../scene-graph';
import { Layers } from '../../scene-graph/layers';
import { RenderScene } from '../core/render-scene';
import { Texture2D } from '../../assets/texture-2d';
import { SubModel } from './submodel';
import { Pass, IMacroPatch, BatchingSchemes } from '../core/pass';
import { legacyCC } from '../../global-exports';
import { Mat4, Vec3, Vec4 } from '../../math';
import { Attribute, DescriptorSet, Device, Buffer, BufferInfo, getTypedArrayConstructor,
    BufferUsageBit, FormatInfos, MemoryUsageBit, Filter, Address, Feature, SamplerInfo, deviceManager } from '../../gfx';
import { INST_MAT_WORLD, UBOLocal, UBOWorldBound, UNIFORM_LIGHTMAP_TEXTURE_BINDING } from '../../pipeline/define';

const m4_1 = new Mat4();

const shadowMapPatches: IMacroPatch[] = [
    { name: 'CC_RECEIVE_SHADOW', value: true },
];

const lightMapPatches: IMacroPatch[] = [
    { name: 'CC_USE_LIGHTMAP', value: true },
];

export interface IInstancedAttributeBlock {
    buffer: Uint8Array;
    views: TypedArray[];
    attributes: Attribute[];
}

export enum ModelType {
    DEFAULT,
    SKINNING,
    BAKED_SKINNING,
    BATCH_2D,
    PARTICLE_BATCH,
    LINE,
}

function uploadMat4AsVec4x3 (mat: Mat4, v1: ArrayBufferView, v2: ArrayBufferView, v3: ArrayBufferView) {
    v1[0] = mat.m00; v1[1] = mat.m01; v1[2] = mat.m02; v1[3] = mat.m12;
    v2[0] = mat.m04; v2[1] = mat.m05; v2[2] = mat.m06; v2[3] = mat.m13;
    v3[0] = mat.m08; v3[1] = mat.m09; v3[2] = mat.m10; v3[3] = mat.m14;
}

const lightmapSamplerHash = new SamplerInfo(
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
);

const lightmapSamplerWithMipHash = new SamplerInfo(
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.LINEAR,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
);

/**
 * @en A representation of a model instance
 * The base model class, which is the core component of [[MeshRenderer]],
 * adds its own Model to the rendered scene for rendering submissions when [[MeshRenderer]] is enabled.
 * This type of object represents a rendering instance in a scene, and it can contain multiple sub models,
 * each of which corresponds to a material. These sub models share the same location and form a complete object.
 * Each sub model references a sub mesh resource, which provides vertex and index buffers for rendering.
 * @zh 代表一个模型实例
 * 基础模型类，它是 [[MeshRenderer]] 的核心组成部分，在 [[MeshRenderer]] 启用时会将自己的 Model 添加到渲染场景中用于提交渲染。
 * 此类型对象代表一个场景中的渲染实例，它可以包含多个子模型，每个子模型对应一个材质。这些子模型共享同样的位置，组成一个完整的物体。
 * 每个子模型引用一个子网格资源，后者提供渲染所用的顶点与索引缓冲。
 */
export class Model {
    /**
     * @en Sub models of the current model
     * @zh 获取所有子模型
     */
    get subModels () {
        return this._subModels;
    }

    /**
     * @en Whether the model is initialized
     * @zh 是否初始化
     */
    get inited (): boolean {
        return this._inited;
    }

    /**
     * @en The axis-aligned bounding box of the model in the world space
     * @zh 获取世界空间包围盒
     */
    get worldBounds () {
        return this._worldBounds!;
    }

    /**
     * @en The axis-aligned bounding box of the model in the model space
     * @zh 获取模型空间包围盒
     */
    get modelBounds () {
        return this._modelBounds;
    }

    /**
     * @en The ubo buffer of the model
     * @zh 获取模型的 ubo 缓冲
     */
    get localBuffer () {
        return this._localBuffer;
    }

    /**
     * @en The world bound ubo buffer
     * @zh 获取世界包围盒 ubo 缓冲
     */
    get worldBoundBuffer () {
        return this._worldBoundBuffer;
    }

    /**
     * @en The time stamp of last update
     * @zh 获取上次更新时间戳
     */
    get updateStamp () {
        return this._updateStamp;
    }

    /**
     * @en Whether GPU instancing is enabled for the current model
     * @zh 是否开启实例化渲染
     */
    get isInstancingEnabled () {
        return this._instMatWorldIdx >= 0;
    }

    /**
     * @en Model level shadow bias
     * @zh 阴影偏移值
     */
    get shadowBias () {
        return this._shadowBias;
    }

    set shadowBias (val) {
        this._shadowBias = val;
    }

    /**
     * @en Model level shadow normal bias
     * @zh 阴影法线偏移值
     */
    get shadowNormalBias () {
        return this._shadowNormalBias;
    }

    set shadowNormalBias (val) {
        this._shadowNormalBias = val;
    }

    /**
     * @en Whether the model should receive shadow
     * @zh 是否接收阴影
     */
    get receiveShadow () {
        return this._receiveShadow;
    }

    set receiveShadow (val) {
        this._receiveShadow = val;
        this.onMacroPatchesStateChanged();
    }

    /**
     * @en Whether the model should cast shadow
     * @zh 是否投射阴影
     */
    get castShadow () {
        return this._castShadow;
    }

    set castShadow (val) {
        this._castShadow = val;
    }

    /**
     * @en The node to which the model belongs
     * @zh 模型所在的节点
     */
    get node () : Node {
        return this._node;
    }

    set node (n: Node) {
        this._node = n;
    }

    /**
     * @en Model's transform
     * @zh 模型的变换
     */
    get transform () : Node {
        return this._transform;
    }

    set transform (n: Node) {
        this._transform = n;
    }

    /**
     * @en Model's visibility tag
     * Model's visibility flags, it's different from [[Node.layer]],
     * but it will also be compared with [[Camera.visibility]] during culling process.
     * @zh 模型的可见性标志
     * 模型的可见性标志与 [[Node.layer]] 不同，它会在剔除阶段与 [[Camera.visibility]] 进行比较
     */
    get visFlags () : number {
        return this._visFlags;
    }

    set visFlags (val: number) {
        this._visFlags = val;
    }

    /**
     * @en Whether the model is enabled in the render scene so that it will be rendered
     * @zh 模型是否在渲染场景中启用并被渲染
     */
    get enabled () : boolean {
        return this._enabled;
    }

    set enabled (val: boolean) {
        this._enabled = val;
    }

    /**
     * @en Rendering priority in the transparent queue of model.
     * @zh Model 在透明队列中的渲染排序优先级
     */
    get priority () : number {
        return this._priority;
    }

    set priority (val: number) {
        this._priority = val;
    }

    /**
     * @en The type of the model
     * @zh 模型类型
     */
    public type = ModelType.DEFAULT;

    /**
     * @en The render scene to which the model belongs
     * @zh 模型所在的场景
     */
    public scene: RenderScene | null = null;

    /**
     * @en Whether dynamic batching is enabled for model
     * @zh 是否动态合批
     */
    public isDynamicBatching = false;

    /**
     * @en The instance attributes
     * @zh 实例化属性
     */
    public instancedAttributes: IInstancedAttributeBlock = { buffer: null!, views: [], attributes: [] };

    /**
     * @en The world axis-aligned bounding box
     * @zh 世界空间包围盒
     */
    protected _worldBounds: AABB | null = null;

    /**
     * @en The model axis-aligned bounding box
     * @zh 模型空间包围盒
     */
    protected _modelBounds: AABB | null = null;

    /**
     * @en Sub models
     * @zh 子模型
     */
    protected _subModels: SubModel[] = [];

    /**
     * @en The node to which the model belongs
     * @zh 模型所在的节点
     */
    protected _node: Node = null!;

    /**
     * @en Model's transform
     * @zh 子模型的变换
     */
    protected _transform: Node = null!;

    /**
     * @en Current gfx device
     * @zh 当前 GFX 设备
     */
    protected _device: Device;

    /**
     * @en Whether the model is initialized
     * @zh 是否初始化过
     */
    protected _inited = false;

    /**
     * @en Descriptor set count
     * @zh 描述符集合个数
     */
    protected _descriptorSetCount = 1;

    /**
     * @en Time stamp for last update
     * @zh 更新时间戳
     */
    protected _updateStamp = -1;

    /**
     * @en Local ubo data dirty flag
     * @zh 本地 ubo 数据是否修改过
     */
    protected _localDataUpdated = true;

    /**
     * @en Local ubo data
     * @zh 本地 ubo 数据
     */
    protected _localData = new Float32Array(UBOLocal.COUNT);

    /**
     * @en Local ubo buffer
     * @zh 本地 ubo 缓冲
     */
    protected _localBuffer: Buffer | null = null;

    /**
     * @en Instance matrix id
     * @zh 实例矩阵索引
     */
    private _instMatWorldIdx = -1;
    private _lightmap: Texture2D | null = null;
    private _lightmapUVParam: Vec4 = new Vec4();

    /**
     * @en World AABB buffer
     * @zh 世界空间包围盒缓冲
     */
    protected _worldBoundBuffer: Buffer | null = null;

    /**
     * @en Whether the model should receive shadow
     * @zh 是否接收阴影
     */
    protected _receiveShadow = false;

    /**
     * @en Whether the model should cast shadow
     * @zh 是否投射阴影
     */
    protected _castShadow = false;

    /**
     * @en Shadow bias
     * @zh 阴影偏移
     */
    protected _shadowBias = 0;

    /**
     * @en Shadow normal bias
     * @zh 阴影法线偏移
     */
    protected _shadowNormalBias = 0;

    /**
     * @en Whether the model is enabled in the render scene so that it will be rendered
     * @zh 模型是否在渲染场景中启用并被渲染
     */
    protected _enabled = true;

    /**
     * @en The visibility flags
     * @zh 可见性标志位
     */
    protected _visFlags = Layers.Enum.NONE;

    protected _priority = 0;

    /**
     * @internal
     * @en native object
     * @zh 原生对象
     */

    /**
     * @internal
     * @en return native object
     * @zh 返回原生对象
     */
    /**
     * @en Constructor to create an empty model
     * @zh 创建一个空模型
     */
    constructor () {
        this._device = deviceManager.gfxDevice;
    }

    /**
     * @en Initialize the model
     * @zh 初始化模型
     */
    public initialize () {
        if (this._inited) {
            return;
        }
        this._receiveShadow = true;
        this.castShadow = false;
        this.enabled = true;
        this.visFlags = Layers.Enum.NONE;
        this._inited = true;
    }

    /**
     * @en Destroy the model
     * @zh 销毁模型
     */
    public destroy () {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            this._subModels[i].destroy();
        }
        if (this._localBuffer) {
            this._localBuffer.destroy();
            this._localBuffer = null;
        }
        if (this._worldBoundBuffer) {
            this._worldBoundBuffer.destroy();
            this._worldBoundBuffer = null;
        }
        this._worldBounds = null;
        this._modelBounds = null;
        this._subModels.length = 0;
        this._inited = false;
        this._localDataUpdated = true;
        this._transform = null!;
        this._node = null!;
        this.isDynamicBatching = false;
    }

    /**
     * @en Attach the model to a [[renderer.RenderScene]]
     * @zh 添加模型到渲染场景 [[renderer.RenderScene]] 中
     * @param scene destination scene
     */
    public attachToScene (scene: RenderScene) {
        this.scene = scene;
        this._localDataUpdated = true;
    }

    /**
     * @en Detach the model from its render scene
     * @zh 移除场景中的模型
     */
    public detachFromScene () {
        this.scene = null;
    }

    /**
     * @en Update the model's transform
     * @zh 更新模型的变换
     * @param stamp time stamp
     */
    public updateTransform (stamp: number) {
        const node = this.transform;
        // @ts-expect-error TS2445
        if (node.hasChangedFlags || node._dirtyFlags) {
            node.updateWorldTransform();
            this._localDataUpdated = true;
            const worldBounds = this._worldBounds;
            if (this._modelBounds && worldBounds) {
                // @ts-expect-error TS2445
                this._modelBounds.transform(node._mat, node._pos, node._rot, node._scale, worldBounds);
            }
        }
    }

    /**
     * @en Update the model's world AABB
     * @zh 更新模型的世界空间包围盒
     */
    public updateWorldBound () {
        const node = this.transform;
        if (node !== null) {
            node.updateWorldTransform();
            this._localDataUpdated = true;
            const worldBounds = this._worldBounds;
            if (this._modelBounds && worldBounds) {
                // @ts-expect-error TS2445
                this._modelBounds.transform(node._mat, node._pos, node._rot, node._scale, worldBounds);
            }
        }
    }

    /**
     * @en Update the model's ubo
     * @zh 更新模型的 ubo
     * @param stamp time stamp
     */
    public updateUBOs (stamp: number) {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].update();
        }
        this._updateStamp = stamp;

        if (!this._localDataUpdated) { return; }
        this._localDataUpdated = false;

        // @ts-expect-error using private members here for efficiency
        const worldMatrix = this.transform._mat;
        const idx = this._instMatWorldIdx;
        if (idx >= 0) {
            const attrs = this.instancedAttributes.views;
            uploadMat4AsVec4x3(worldMatrix, attrs[idx], attrs[idx + 1], attrs[idx + 2]);
        } else if (this._localBuffer) {
            Mat4.toArray(this._localData, worldMatrix, UBOLocal.MAT_WORLD_OFFSET);
            Mat4.inverseTranspose(m4_1, worldMatrix);

            Mat4.toArray(this._localData, m4_1, UBOLocal.MAT_WORLD_IT_OFFSET);
            this._localBuffer.update(this._localData);
        }
    }

    /**
     * @en Create the model's AABB
     * @zh 创建模型的包围盒
     * @param minPos min position of the AABB
     * @param maxPos max position of the AABB
     */
    public createBoundingShape (minPos?: Vec3, maxPos?: Vec3) {
        if (!minPos || !maxPos) { return; }
        this._modelBounds = AABB.fromPoints(AABB.create(), minPos, maxPos);
        this._worldBounds = AABB.clone(this._modelBounds);
    }

    private _createSubModel () {
        return new SubModel();
    }

    /**
     * @en Initialize a sub model with the sub mesh data and the material.
     * @zh 用子网格数据和材质初始化一个子模型。
     * @param idx sub model's index
     * @param subMeshData sub mesh
     * @param mat sub material
     */
    public initSubModel (idx: number, subMeshData: RenderingSubMesh, mat: Material) {
        this.initialize();

        let isNewSubModel = false;
        if (this._subModels[idx] == null) {
            this._subModels[idx] = this._createSubModel();
            isNewSubModel = true;
        } else {
            this._subModels[idx].destroy();
        }
        this._subModels[idx].initialize(subMeshData, mat.passes, this.getMacroPatches(idx));

        // This is a temporary solution
        // It should not be written in a fixed way, or modified by the user
        this._subModels[idx].initPlanarShadowShader();
        this._subModels[idx].initPlanarShadowInstanceShader();

        this._updateAttributesAndBinding(idx);
    }

    /**
     * @en Set material for a given sub model
     * @zh 为指定的子模型设置材质
     * @param idx sub model's index
     * @param subMesh sub mesh
     */
    public setSubModelMesh (idx: number, subMesh: RenderingSubMesh) {
        if (!this._subModels[idx]) { return; }
        this._subModels[idx].subMesh = subMesh;
    }

    /**
     * @en Set a sub material
     * @zh 设置一个子材质
     * @param idx sub model's index
     * @param mat sub material
     */
    public setSubModelMaterial (idx: number, mat: Material) {
        if (!this._subModels[idx]) { return; }
        this._subModels[idx].passes = mat.passes;
        this._updateAttributesAndBinding(idx);
    }

    /**
     * @en Pipeline changed callback
     * @zh 管线更新回调
     */
    public onGlobalPipelineStateChanged () {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].onPipelineStateChanged();
        }
    }

    /**
     * @en Shader macro changed callback
     * @zh Shader 宏更新回调
     */
    public onMacroPatchesStateChanged () {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].onMacroPatchesStateChanged(this.getMacroPatches(i));
        }
    }

    public onGeometryChanged () {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].onGeometryChanged();
        }
    }

    /**
     * @internal
     * If the model has lighting map
     * initialize lighting map info before model initializing
     * because the lighting map will influence the shader
     */
    public initLightingmap (texture: Texture2D | null, uvParam: Vec4) {
        this._lightmap = texture;
        this._lightmapUVParam = uvParam;
    }

    /**
     * @en Update the light map info
     * @zh 更新光照贴图信息
     * @param texture light map
     * @param uvParam uv coordinate
     */
    public updateLightingmap (texture: Texture2D | null, uvParam: Vec4) {
        Vec4.toArray(this._localData, uvParam, UBOLocal.LIGHTINGMAP_UVPARAM);
        this._localDataUpdated = true;
        this._lightmap = texture;
        this._lightmapUVParam = uvParam;

        this.onMacroPatchesStateChanged();

        if (texture === null) {
            texture = builtinResMgr.get<Texture2D>('empty-texture');
        }

        const gfxTexture = texture.getGFXTexture();
        if (gfxTexture) {
            const sampler = this._device.getSampler(texture.mipmaps.length > 1 ? lightmapSamplerWithMipHash : lightmapSamplerHash);
            const subModels = this._subModels;
            for (let i = 0; i < subModels.length; i++) {
                const { descriptorSet } = subModels[i];
                descriptorSet.bindTexture(UNIFORM_LIGHTMAP_TEXTURE_BINDING, gfxTexture);
                descriptorSet.bindSampler(UNIFORM_LIGHTMAP_TEXTURE_BINDING, sampler);
                descriptorSet.update();
            }
        }
    }

    /**
     * @en Update the shadow bias
     * @zh 更新阴影偏移
     */
    public updateLocalShadowBias () {
        const sv = this._localData;
        sv[UBOLocal.LOCAL_SHADOW_BIAS + 0] = this._shadowBias;
        sv[UBOLocal.LOCAL_SHADOW_BIAS + 1] = this._shadowNormalBias;
        sv[UBOLocal.LOCAL_SHADOW_BIAS + 2] = 0;
        sv[UBOLocal.LOCAL_SHADOW_BIAS + 3] = 0;
        this._localDataUpdated = true;
    }

    /**
     * @en Return shader's macro patches
     * @zh 获取 shader 宏
     * @param subModelIndex sub model's index
     */
    public getMacroPatches (subModelIndex: number): IMacroPatch[] | null {
        let patches = this.receiveShadow ? shadowMapPatches : null;
        if (this._lightmap != null) {
            patches = patches ? patches.concat(lightMapPatches) : lightMapPatches;
        }
        return patches;
    }

    protected _updateAttributesAndBinding (subModelIndex: number) {
        const subModel = this._subModels[subModelIndex];
        if (!subModel) { return; }

        this._initLocalDescriptors(subModelIndex);
        this._updateLocalDescriptors(subModelIndex, subModel.descriptorSet);

        this._initWorldBoundDescriptors(subModelIndex);

        if (subModel.worldBoundDescriptorSet) {
            this._updateWorldBoundDescriptors(subModelIndex, subModel.worldBoundDescriptorSet);
        }

        const shader = subModel.passes[0].getShaderVariant(subModel.patches)!;
        this._updateInstancedAttributes(shader.attributes, subModel.passes[0]);
    }

    protected _getInstancedAttributeIndex (name: string) {
        const { attributes } = this.instancedAttributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].name === name) { return i; }
        }
        return -1;
    }

    private _setInstMatWorldIdx (idx: number) {
        this._instMatWorldIdx = idx;
    }

    // sub-classes can override the following functions if needed

    // for now no submodel level instancing attributes
    protected _updateInstancedAttributes (attributes: Attribute[], pass: Pass) {
        if (!pass.device.hasFeature(Feature.INSTANCED_ARRAYS)) { return; }
        // free old data

        let size = 0;
        for (let j = 0; j < attributes.length; j++) {
            const attribute = attributes[j];
            if (!attribute.isInstanced) { continue; }
            size += FormatInfos[attribute.format].size;
        }

        const attrs = this.instancedAttributes;
        attrs.buffer = new Uint8Array(size);
        attrs.views.length = attrs.attributes.length = 0;
        let offset = 0;
        for (let j = 0; j < attributes.length; j++) {
            const attribute = attributes[j];
            if (!attribute.isInstanced) { continue; }
            const attr = new Attribute();
            attr.format = attribute.format;
            attr.name = attribute.name;
            attr.isNormalized = attribute.isNormalized;
            attr.location = attribute.location;
            attrs.attributes.push(attr);

            const info = FormatInfos[attribute.format];

            const typeViewArray = new (getTypedArrayConstructor(info))(attrs.buffer.buffer, offset, info.count);
            attrs.views.push(typeViewArray);
            offset += info.size;
        }
        if (pass.batchingScheme === BatchingSchemes.INSTANCING) { pass.getInstancedBuffer().destroy(); } // instancing IA changed
        this._setInstMatWorldIdx(this._getInstancedAttributeIndex(INST_MAT_WORLD));
        this._localDataUpdated = true;
    }

    protected _initLocalDescriptors (subModelIndex: number) {
        if (!this._localBuffer) {
            this._localBuffer = this._device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                UBOLocal.SIZE,
                UBOLocal.SIZE,
            ));
        }
    }

    protected _initWorldBoundDescriptors (subModelIndex: number) {
        if (!this._worldBoundBuffer) {
            this._worldBoundBuffer = this._device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                UBOWorldBound.SIZE,
                UBOWorldBound.SIZE,
            ));
        }
    }

    protected _updateLocalDescriptors (subModelIndex: number, descriptorSet: DescriptorSet) {
        if (this._localBuffer) descriptorSet.bindBuffer(UBOLocal.BINDING, this._localBuffer);
    }

    protected _updateWorldBoundDescriptors (subModelIndex: number, descriptorSet: DescriptorSet) {
        if (this._worldBoundBuffer) descriptorSet.bindBuffer(UBOWorldBound.BINDING, this._worldBoundBuffer);
    }
}
