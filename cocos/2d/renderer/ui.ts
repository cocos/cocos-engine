/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

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
/**
 * @packageDocumentation
 * @hidden
 */

import { UIStaticBatch } from '../components';
import { Material } from '../../core/assets/material';
import { Canvas, RenderRoot2D, UIComponent, UIRenderable } from '../framework';
import { Texture, Device, Attribute, Sampler, DescriptorSetInfo } from '../../core/gfx';
import { Pool, RecyclePool } from '../../core/memop';
import { CachedArray } from '../../core/memop/cached-array';
import { Camera } from '../../core/renderer/scene/camera';
import { Model } from '../../core/renderer/scene/model';
import { RenderScene } from '../../core/renderer/scene/render-scene';
import { Root } from '../../core/root';
import { Layers, Node } from '../../core/scene-graph';
import { MeshBuffer } from './mesh-buffer';
import { StencilManager } from './stencil-manager';
import { UIDrawBatch } from './ui-draw-batch';
import * as UIVertexFormat from './ui-vertex-format';
import { legacyCC } from '../../core/global-exports';
import { DescriptorSetHandle, DSPool, SubModelPool, SubModelView } from '../../core/renderer/core/memory-pools';
import { ModelLocalBindings } from '../../core/pipeline/define';
import { RenderTexture } from '../../core/assets';
import { SpriteFrame } from '../assets';
import { TextureBase } from '../../core/assets/texture-base';
import { sys } from '../../core/platform/sys';

const _dsInfo = new DescriptorSetInfo(null!);

/**
 * @zh
 * UI 渲染流程
 */
export class UI {
    get renderScene (): RenderScene {
        return this._scene;
    }

    get currBufferBatch () {
        if (this._currMeshBuffer) return this._currMeshBuffer;
        // create if not set
        this._currMeshBuffer = this.acquireBufferBatch();
        return this._currMeshBuffer;
    }

    set currBufferBatch (buffer: MeshBuffer|null) {
        if (buffer) {
            this._currMeshBuffer = buffer;
        }
    }

    get batches () {
        return this._batches;
    }

    /**
     * Acquire a new mesh buffer if the vertex layout differs from the current one.
     * @param attributes
     */
    public acquireBufferBatch (attributes: Attribute[] = UIVertexFormat.vfmtPosUvColor) {
        const strideBytes = attributes === UIVertexFormat.vfmtPosUvColor ? 36 /* 9x4 */ : UIVertexFormat.getAttributeStride(attributes);
        if (!this._currMeshBuffer || (this._currMeshBuffer.vertexFormatBytes) !== strideBytes) {
            this._requireBufferBatch(attributes);
            return this._currMeshBuffer;
        }
        return this._currMeshBuffer;
    }

    set currStaticRoot (value: UIStaticBatch | null) {
        this._currStaticRoot = value;
    }

    public device: Device;
    private _screens: RenderRoot2D[] = [];
    private _bufferBatchPool: RecyclePool<MeshBuffer> = new RecyclePool(() => new MeshBuffer(this), 128);
    private _drawBatchPool: Pool<UIDrawBatch>;
    private _scene: RenderScene;
    private _meshBuffers: Map<number, MeshBuffer[]> = new Map();
    private _meshBufferUseCount: Map<number, number> = new Map();
    private _batches: CachedArray<UIDrawBatch>;
    private _doUploadBuffersCall: Map<any, ((ui:UI) => void)> = new Map();
    private _emptyMaterial = new Material();
    private _currMaterial: Material = this._emptyMaterial;
    private _currTexture: Texture | null = null;
    private _currSampler: Sampler | null = null;
    private _currMeshBuffer: MeshBuffer | null = null;
    private _currStaticRoot: UIStaticBatch | null = null;
    private _currComponent: UIRenderable | null = null;
    private _currTransform: Node | null = null;
    private _currTextureHash = 0;
    private _currSamplerHash = 0;
    private _currBlendTargetHash = 0;
    private _currLayer = 0;
    private _currDepthStencilStateStage: any|null = null;
    private _parentOpacity = 1;
    // DescriptorSet Cache Map
    private _descriptorSetCacheMap = new Map<number, Map<number, DescriptorSetHandle>>();

    constructor (private _root: Root) {
        this.device = _root.device;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });
        this._batches = new CachedArray(64);
        this._drawBatchPool = new Pool(() => new UIDrawBatch(), 128);
    }

    public initialize () {
        return true;
    }

    public destroy () {
        for (let i = 0; i < this._batches.length; i++) {
            if (this._batches.array[i]) {
                this._batches.array[i].destroy(this);
            }
        }
        this._batches.destroy();

        for (const size of this._meshBuffers.keys()) {
            const buffers = this._meshBuffers.get(size);
            if (buffers) {
                buffers.forEach((buffer) => buffer.destroy());
            }
        }

        if (this._drawBatchPool) {
            this._drawBatchPool.destroy((obj) => {
                obj.destroy(this);
            });
        }

        if (this._descriptorSetCacheMap) {
            this._destroyDescriptorSet();
        }

        this._meshBuffers.clear();
        legacyCC.director.root.destroyScene(this._scene);

        StencilManager.sharedManager!.destroy();
    }

    public getRenderSceneGetter () {
        return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), 'renderScene')!.get!.bind(this);
    }

    /**
     * @en
     * Add the managed Canvas.
     *
     * @zh
     * 添加屏幕组件管理。
     *
     * @param comp - 屏幕组件。
     */
    public addScreen (comp: RenderRoot2D) {
        this._screens.push(comp);
        this._screens.sort(this._screenSort);
    }

    public getFirstRenderCamera (node: Node) {
        const cameras = this.renderScene.cameras;
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.visibility & node.layer) {
                return camera;
            }
        }
        return null;
    }

    /**
     * @zh
     * Removes the Canvas from the list.
     *
     * @param comp - 被移除的屏幕。
     */
    public removeScreen (comp: RenderRoot2D) {
        const idx = this._screens.indexOf(comp);
        if (idx === -1) {
            return;
        }

        this._screens.splice(idx, 1);
    }

    public sortScreens () {
        this._screens.sort(this._screenSort);
    }

    public addUploadBuffersFunc (target: any, func: ((ui:UI) => void)) {
        this._doUploadBuffersCall.set(target, func);
    }

    public removeUploadBuffersFunc (target: any) {
        this._doUploadBuffersCall.delete(target);
    }

    public update () {
        const screens = this._screens;
        for (let i = 0; i < screens.length; ++i) {
            const screen = screens[i];
            if (!screen.enabledInHierarchy) {
                continue;
            }
            this._recursiveScreenNode(screen.node);
        }

        let batchPriority = 0;
        this._scene.removeBatches();
        if (this._batches.length) {
            for (let i = 0; i < this._batches.length; ++i) {
                const batch = this._batches.array[i];

                if (batch.model) {
                    const subModels = batch.model.subModels;
                    for (let j = 0; j < subModels.length; j++) {
                        subModels[j].priority = batchPriority++;
                    }
                } else {
                    // TODO: particle 2d not finish
                    const descriptorSetTextureMap = this._descriptorSetCacheMap.get(batch.textureHash);
                    if (descriptorSetTextureMap && descriptorSetTextureMap.has(batch.samplerHash)) {
                        batch.hDescriptorSet = descriptorSetTextureMap.get(batch.samplerHash)!;
                    } else {
                        this._initDescriptorSet(batch);
                        const descriptorSet = DSPool.get(batch.hDescriptorSet);

                        const binding = ModelLocalBindings.SAMPLER_SPRITE;
                        descriptorSet.bindTexture(binding, batch.texture!);
                        descriptorSet.bindSampler(binding, batch.sampler!);
                        descriptorSet.update();

                        if (descriptorSetTextureMap) {
                            this._descriptorSetCacheMap.get(batch.textureHash)!.set(batch.samplerHash, batch.hDescriptorSet);
                        } else {
                            this._descriptorSetCacheMap.set(batch.textureHash, new Map([[batch.samplerHash, batch.hDescriptorSet]]));
                        }
                    }
                }
                this._scene.addBatch(batch);
            }
        }
    }

    public uploadBuffers () {
        if (this._batches.length > 0) {
            const calls = this._doUploadBuffersCall;
            for (const key of calls.keys()) {
                const list = calls.get(key);
                list!.call(key, this);
            }

            const buffers = this._meshBuffers;
            for (const i of buffers.keys()) {
                const list = buffers.get(i);
                if (list) {
                    list.forEach((bb) => {
                        bb.uploadBuffers();
                        bb.reset();
                    });
                }
            }
        }
    }

    public reset () {
        for (let i = 0; i < this._batches.length; ++i) {
            const batch = this._batches.array[i];
            if (batch.isStatic) {
                continue;
            }

            batch.clear();
            this._drawBatchPool.free(batch);
        }

        this._parentOpacity = 1;
        this._currLayer = 0;
        this._currMaterial = this._emptyMaterial;
        this._currTexture = null;
        this._currSampler = null;
        this._currComponent = null;
        this._currTransform = null;
        this._meshBufferUseCount.clear();
        this._batches.clear();
        StencilManager.sharedManager!.reset();
    }

    /**
     * @en
     * Render component data submission process of UI.
     * The submitted vertex data is the UI for world coordinates.
     * For example: The UI components except Graphics and UIModel.
     *
     * @zh
     * UI 渲染组件数据提交流程（针对提交的顶点数据是世界坐标的提交流程，例如：除 Graphics 和 UIModel 的大部分 ui 组件）。
     * 此处的数据最终会生成需要提交渲染的 model 数据。
     *
     * @param comp - 当前执行组件。
     * @param frame - 当前执行组件贴图。
     * @param assembler - 当前组件渲染数据组装器。
     */
    public commitComp (comp: UIRenderable, frame: TextureBase | SpriteFrame | RenderTexture | null, assembler: any, transform: Node | null) {
        const renderComp = comp;
        let texture;
        let samp;
        let textureHash = 0;
        let samplerHash = 0;
        if (frame) {
            texture = frame.getGFXTexture();
            samp = frame.getGFXSampler();
            textureHash = frame.getHash();
            samplerHash = frame.getSamplerHash();
        } else {
            texture = null;
            samp = null;
        }

        const mat = renderComp.getRenderMaterial(0);
        renderComp.stencilStage = StencilManager.sharedManager!.stage;

        const blendTargetHash = renderComp.blendHash;
        const depthStencilStateStage = renderComp.stencilStage;

        if (this._currLayer !== comp.node.layer || this._currMaterial !== mat || this._currBlendTargetHash !== blendTargetHash || this._currDepthStencilStateStage !== depthStencilStateStage
            || this._currTextureHash !== textureHash || this._currSamplerHash !== samplerHash || this._currTransform !== transform) {
            this.autoMergeBatches(this._currComponent!);
            this._currComponent = renderComp;
            this._currTransform = transform;
            this._currMaterial = mat!;
            this._currTexture = texture;
            this._currSampler = samp;
            this._currTextureHash = textureHash;
            this._currSamplerHash = samplerHash;
            this._currBlendTargetHash = blendTargetHash;
            this._currDepthStencilStateStage = depthStencilStateStage;
            this._currLayer = comp.node.layer;
        }

        if (assembler) {
            assembler.fillBuffers(renderComp, this);
            this._applyOpacity(renderComp);
        }
    }

    /**
     * @en
     * Render component data submission process of UI.
     * The submitted vertex data is the UI for local coordinates.
     * For example: The UI components of Graphics and UIModel.
     *
     * @zh
     * UI 渲染组件数据提交流程（针对例如： Graphics 和 UIModel 等数据量较为庞大的 ui 组件）。
     *
     * @param comp - 当前执行组件。
     * @param model - 提交渲染的 model 数据。
     * @param mat - 提交渲染的材质。
     */
    public commitModel (comp: UIComponent | UIRenderable, model: Model | null, mat: Material | null) {
        // if the last comp is spriteComp, previous comps should be batched.
        if (this._currMaterial !== this._emptyMaterial) {
            this.autoMergeBatches(this._currComponent!);
        }

        let depthStencil;
        if (mat) {
            // Todo: Graphics Node behind Mask need set Stage
            if (comp instanceof UIComponent) {
                comp.stencilStage = StencilManager.sharedManager!.stage;
            }
            depthStencil = StencilManager.sharedManager!.getStencilStage(comp.stencilStage);
        }

        const stamp = legacyCC.director.getTotalFrames();
        if (model) {
            model.updateTransform(stamp);
            model.updateUBOs(stamp);
        }

        for (let i = 0; i < model!.subModels.length; i++) {
            const curDrawBatch = this._drawBatchPool.alloc();
            const subModel = model!.subModels[i];
            curDrawBatch.visFlags = comp.node.layer;
            curDrawBatch.model = model;
            curDrawBatch.bufferBatch = null;
            curDrawBatch.texture = null;
            curDrawBatch.sampler = null;
            curDrawBatch.useLocalData = null;
            if (!depthStencil) { depthStencil = null; }
            curDrawBatch.fillPasses(mat, depthStencil, null);
            curDrawBatch.hDescriptorSet = SubModelPool.get(subModel.handle, SubModelView.DESCRIPTOR_SET);
            curDrawBatch.hInputAssembler = SubModelPool.get(subModel.handle, SubModelView.INPUT_ASSEMBLER);
            curDrawBatch.model!.visFlags = curDrawBatch.visFlags;
            this._batches.push(curDrawBatch);
        }

        // reset current render state to null
        this._currMaterial = this._emptyMaterial;
        this._currComponent = null;
        this._currTransform = null;
        this._currTexture = null;
        this._currSampler = null;
        this._currTextureHash = 0;
        this._currSamplerHash = 0;
        this._currLayer = 0;
    }

    /**
     * @en
     * Submit separate render data.
     * This data does not participate in the batch.
     *
     * @zh
     * 提交独立渲染数据.
     * @param comp 静态组件
     */
    public commitStaticBatch (comp: UIStaticBatch) {
        this._batches.concat(comp.drawBatchList);
        this.finishMergeBatches();
    }

    /**
     * @en
     * End a section of render data and submit according to the batch condition.
     *
     * @zh
     * 根据合批条件，结束一段渲染数据并提交。
     */
    public autoMergeBatches (renderComp?: UIRenderable) {
        const buffer = this.currBufferBatch;
        const hIA = buffer?.recordBatch();
        const mat = this._currMaterial;
        if (!hIA || !mat) {
            return;
        }
        let blendState;
        let depthStencil;
        if (renderComp) {
            blendState = renderComp.blendHash === -1 ? null : renderComp.getBlendState();
            depthStencil = StencilManager.sharedManager!.getStencilStage(renderComp.stencilStage);
        }

        const curDrawBatch = this._currStaticRoot ? this._currStaticRoot._requireDrawBatch() : this._drawBatchPool.alloc();
        curDrawBatch.visFlags = this._currLayer;
        curDrawBatch.bufferBatch = buffer;
        curDrawBatch.texture = this._currTexture!;
        curDrawBatch.sampler = this._currSampler;
        curDrawBatch.hInputAssembler = hIA;
        curDrawBatch.useLocalData = this._currTransform;
        curDrawBatch.textureHash = this._currTextureHash;
        curDrawBatch.samplerHash = this._currSamplerHash;
        curDrawBatch.fillPasses(mat, depthStencil, blendState);

        this._batches.push(curDrawBatch);

        buffer!.vertexStart = buffer!.vertexOffset;
        buffer!.indicesStart = buffer!.indicesOffset;
        buffer!.byteStart = buffer!.byteOffset;

        // HACK: After sharing buffer between drawcalls, the performance degradation a lots on iOS 14 or iPad OS 14 device
        // TODO: Maybe it can be removed after Apple fixes it?
        if (sys.__isWebIOS14OrIPadOS14Env) {
            this._currMeshBuffer = null;
        }
    }

    /**
     * @en
     * Force changes to current batch data and merge
     *
     * @zh
     * 强行修改当前批次数据并合并。
     *
     * @param material - 当前批次的材质。
     * @param sprite - 当前批次的精灵帧。
     */
    public forceMergeBatches (material: Material, frame: TextureBase | SpriteFrame | RenderTexture | null, renderComp?: UIRenderable) {
        this._currMaterial = material;

        if (frame) {
            this._currTexture = frame.getGFXTexture();
            this._currSampler = frame.getGFXSampler();
            this._currTextureHash = frame.getHash();
            this._currSamplerHash = frame.getSamplerHash();
        } else {
            this._currTexture = this._currSampler = null;
            this._currTextureHash = this._currSamplerHash = 0;
        }

        this.autoMergeBatches(renderComp);
    }

    /**
     * @en
     * Forced to merge the data of the previous batch to start a new batch.
     *
     * @zh
     * 强制合并上一个批次的数据，开启新一轮合批。
     */
    public finishMergeBatches () {
        this.autoMergeBatches();
        this._currMaterial = this._emptyMaterial;
        this._currTexture = null;
        this._currComponent = null;
        this._currTransform = null;
        this._currTextureHash = 0;
        this._currSamplerHash = 0;
        this._currLayer = 0;
    }

    /**
     * @en
     * Force to change the current material.
     *
     * @zh
     * 强制刷新材质。
     */
    public flushMaterial (mat: Material) {
        this._currMaterial = mat;
    }

    public walk (node: Node, level = 0) {
        const len = node.children.length;

        const parentOpacity = this._parentOpacity;
        this._parentOpacity *= node._uiProps.opacity;

        this._preProcess(node);
        if (len > 0 && !node._static) {
            const children = node.children;
            for (let i = 0; i < children.length; ++i) {
                const child = children[i];
                this.walk(child, level);
            }
        }

        this._postProcess(node);
        this._parentOpacity = parentOpacity;

        level += 1;
    }

    private _preProcess (node: Node) {
        if (!node._uiProps.uiTransformComp) {
            return;
        }

        const render = node._uiProps.uiComp;
        if (render && render.enabledInHierarchy) {
            render.updateAssembler(this);
        }
    }

    private _postProcess (node: Node) {
        const render = node._uiProps.uiComp;
        if (render && render.enabledInHierarchy) {
            render.postUpdateAssembler(this);
        }
    }

    private _recursiveScreenNode (screen: Node) {
        this.walk(screen);
        this.autoMergeBatches(this._currComponent!);
    }

    private _createMeshBuffer (attributes: Attribute[]): MeshBuffer {
        const batch = this._bufferBatchPool.add();
        batch.initialize(attributes, this._requireBufferBatch.bind(this, attributes));
        const strideBytes = UIVertexFormat.getAttributeStride(attributes);
        let buffers = this._meshBuffers.get(strideBytes);
        if (!buffers) { buffers = []; this._meshBuffers.set(strideBytes, buffers); }
        buffers.push(batch);
        return batch;
    }

    private _requireBufferBatch (attributes: Attribute[]) {
        const strideBytes = UIVertexFormat.getAttributeStride(attributes);
        let buffers = this._meshBuffers.get(strideBytes);
        if (!buffers) { buffers = []; this._meshBuffers.set(strideBytes, buffers); }
        const meshBufferUseCount = this._meshBufferUseCount.get(strideBytes) || 0;

        if (meshBufferUseCount >= buffers.length) {
            this._currMeshBuffer = this._createMeshBuffer(attributes);
        } else {
            this._currMeshBuffer = buffers[meshBufferUseCount];
        }
        this._meshBufferUseCount.set(strideBytes, meshBufferUseCount + 1);
        if (arguments.length === 3) {
            this._currMeshBuffer.request(arguments[1], arguments[2]);
        }
    }

    private _screenSort (a: RenderRoot2D, b: RenderRoot2D) {
        return a.node.getSiblingIndex() - b.node.getSiblingIndex();
    }

    private _applyOpacity (comp: UIRenderable) {
        const color = comp.color.a / 255;
        const opacity = (this._parentOpacity *= color);
        const currMeshBuffer = this.currBufferBatch!;
        const byteOffset = currMeshBuffer.byteOffset >> 2;
        const vBuf = currMeshBuffer.vData!;
        const lastByteOffset = currMeshBuffer.lastByteOffset >> 2;
        const stride = currMeshBuffer.vertexFormatBytes / 4;
        for (let i = lastByteOffset; i < byteOffset; i += stride) {
            vBuf[i + MeshBuffer.OPACITY_OFFSET] *= opacity;
        }

        currMeshBuffer.lastByteOffset = currMeshBuffer.byteOffset;
    }

    private _initDescriptorSet (batch: UIDrawBatch) {
        const root = legacyCC.director.root;

        _dsInfo.layout = batch.passes[0].localSetLayout;
        batch.hDescriptorSet = DSPool.alloc(root.device, _dsInfo);
    }

    private _releaseDescriptorSetCache (textureHash: number) {
        if (this._descriptorSetCacheMap.has(textureHash)) {
            this._descriptorSetCacheMap.get(textureHash)!.forEach((value) => {
                DSPool.free(value);
            });
            this._descriptorSetCacheMap.delete(textureHash);
        }
    }

    private _destroyDescriptorSet () {
        this._descriptorSetCacheMap.forEach((value, key, map) => {
            value.forEach((hDescriptorSet) => {
                DSPool.free(hDescriptorSet);
            });
        });
        this._descriptorSetCacheMap.clear();
    }
}

legacyCC.internal.UI = UI;
