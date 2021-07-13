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
import { JSB } from 'internal:constants';
import { Camera, Model } from 'cocos/core/renderer/scene';
import { UIStaticBatch } from '../components';
import { Material } from '../../core/assets/material';
import { RenderRoot2D, Renderable2D, UIComponent } from '../framework';
import { Texture, Device, Attribute, Sampler, DescriptorSetInfo, Buffer, BufferInfo, BufferUsageBit, MemoryUsageBit, DescriptorSet } from '../../core/gfx';
import { Pool, RecyclePool } from '../../core/memop';
import { CachedArray } from '../../core/memop/cached-array';
import { RenderScene } from '../../core/renderer/scene/render-scene';
import { Root } from '../../core/root';
import { Node } from '../../core/scene-graph';
import { MeshBuffer } from './mesh-buffer';
import { Stage, StencilManager } from './stencil-manager';
import { DrawBatch2D, DrawCall } from './draw-batch';
import * as VertexFormat from './vertex-format';
import { legacyCC } from '../../core/global-exports';
import { ModelLocalBindings, UBOLocal } from '../../core/pipeline/define';
import { RenderTexture } from '../../core/assets';
import { SpriteFrame } from '../assets';
import { TextureBase } from '../../core/assets/texture-base';
import { Mat4 } from '../../core/math';
import { UILocalUBOManger, UILocalBuffer } from './render-uniform-buffer';
import { DummyIA } from './dummy-ia';
import { TransformBit } from '../../core/scene-graph/node-enum';

const _dsInfo = new DescriptorSetInfo(null!);
const m4_1 = new Mat4();

interface IRenderItem {
    localBuffer: UILocalBuffer;
    bufferHash: number;
    UBOIndex: number;
    instanceID: number;
}

/**
 * @zh
 * UI 渲染流程
 */
export class Batcher2D {
    get batches () {
        return this._batches;
    }

    set currStaticRoot (value: UIStaticBatch | null) {
        this._currStaticRoot = value;
    }

    set currIsStatic (value: boolean) {
        this._currIsStatic = value;
    }

    public device: Device;
    private _screens: RenderRoot2D[] = [];
    private _drawBatchPool: Pool<DrawBatch2D>;
    private _batches: CachedArray<DrawBatch2D>;
    private _doUploadBuffersCall: Map<any, ((ui: Batcher2D) => void)> = new Map();
    private _emptyMaterial = new Material();
    private _currScene: RenderScene | null = null;
    private _currMaterial: Material = this._emptyMaterial;
    private _currTexture: Texture | null = null;
    private _currSampler: Sampler | null = null;
    private _currStaticRoot: UIStaticBatch | null = null;
    private _currComponent: Renderable2D | null = null;
    private _currTransform: Node | null = null;
    private _currTextureHash = 0;
    private _currSamplerHash = 0;
    private _currBlendTargetHash = 0;
    private _currLayer = 0;
    private _currDepthStencilStateStage: any | null = null;
    private _currIsStatic = false;
    private _currBatch!: DrawBatch2D;
    private _parentOpacity = 1;
    // DescriptorSet Cache Map
    private _descriptorSetCache = new DescriptorSetCache();
    private _dummyIA: DummyIA;
    private _localUBOManager: UILocalUBOManger;

    public reloadBatchDirty = true;
    public renderQueue: IRenderItem[] = [];
    public _currWalkIndex = 0;

    public updateBufferDirty = false;

    constructor (private _root: Root) {
        this.device = _root.device;
        this._batches = new CachedArray(64);
        this._drawBatchPool = new Pool(() => new DrawBatch2D(), 128);
        this._dummyIA = new DummyIA(this.device);
        this._localUBOManager = new UILocalUBOManger(this.device);
        this._currBatch = this._drawBatchPool.alloc();
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

        if (this._drawBatchPool) {
            this._drawBatchPool.destroy((obj) => {
                obj.destroy(this);
            });
        }

        this._descriptorSetCache.destroy();

        StencilManager.sharedManager!.destroy();
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

    public getFirstRenderCamera (node: Node): Camera | null {
        if (node.scene && node.scene.renderScene) {
            const cameras = node.scene.renderScene.cameras;
            for (let i = 0; i < cameras.length; i++) {
                const camera = cameras[i];
                if (camera.visibility & node.layer) {
                    return camera;
                }
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

    public addUploadBuffersFunc (target: any, func: ((ui: Batcher2D) => void)) {
        this._doUploadBuffersCall.set(target, func);
    }

    public removeUploadBuffersFunc (target: any) {
        this._doUploadBuffersCall.delete(target);
    }

    public update () {
        if (this.reloadBatchDirty) {
            this.renderQueue.length = 0;
            this._localUBOManager.reset(); // 需要重新录制就先清空
        }

        const screens = this._screens;
        for (let i = 0; i < screens.length; ++i) {
            const screen = screens[i];
            if (!screen.enabledInHierarchy) {
                continue;
            }
            this._recursiveScreenNode(screen.node);
        }

        let batchPriority = 0;
        if (this._batches.length) {
            for (let i = 0; i < this._batches.length; ++i) {
                const batch = this._batches.array[i];
                if (!batch.renderScene) continue;

                if (batch.model) {
                    const subModels = batch.model.subModels;
                    for (let j = 0; j < subModels.length; j++) {
                        subModels[j].priority = batchPriority++;
                    }
                } else {
                    for (let i = 0; i < batch.drawcalls.length; i++) {
                        batch.drawcalls[i].descriptorSet = this._descriptorSetCache.getDescriptorSet(batch, batch.drawcalls[i]);
                    }
                }
                batch.renderScene.addBatch(batch);
            }
        }
    }

    public uploadBuffers () {
        if (this._batches.length > 0) {
            const calls = this._doUploadBuffersCall;
            calls.forEach((value, key) => {
                value.call(key, this);
            });

            this._descriptorSetCache.update();
            if (this.reloadBatchDirty || this.updateBufferDirty) {
                this._localUBOManager.updateBuffer();
                this.reloadBatchDirty = false; // 这里应该是更新用
                this.updateBufferDirty = false;
            }
        }
    }

    public reset () {
        for (let i = 0; i < this._batches.length; ++i) {
            const batch = this._batches.array[i];
            if (batch.isStatic) {
                continue;
            }

            batch.clear(); // batch 是不是需要重新录制？？？
            this._drawBatchPool.free(batch);
        }
        DrawBatch2D.drawcallPool.reset();

        this._currLayer = 0;
        this._currMaterial = this._emptyMaterial;
        this._currTexture = null;
        this._currSampler = null;
        this._currComponent = null;
        this._currTransform = null;
        this._currScene = null;
        this._batches.clear(); // DC 数量有问题
        StencilManager.sharedManager!.reset();
        this._descriptorSetCache.reset();
        // this._localUBOManager.reset(); // 用 dirty 来控制reset
        this._currWalkIndex = 0;
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
    public commitComp (comp: Renderable2D, frame: TextureBase | SpriteFrame | RenderTexture | null, assembler: any, transform: Node | null) {
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

        const renderScene = renderComp._getRenderScene();
        const mat = renderComp.getRenderMaterial(0)!;
        renderComp.stencilStage = StencilManager.sharedManager!.stage;

        const blendTargetHash = renderComp.blendHash;
        const depthStencilStateStage = renderComp.stencilStage;

        // 这儿要用 material Hash 了，那 uniform 不同怎么合批？
        // 这里需要一个 额外的 机制，判断还能不能放得下这些 uniform？
        // 需要一个条件，这个条件是我排除用户 uniform 之后可用的 uniform 数量
        // 可配置，怎么配置？给个变量？倒是可以随意变
        // 需要优化
        if (this._currScene !== renderScene || this._currLayer !== comp.node.layer || this._currMaterial !== mat
            || this._currBlendTargetHash !== blendTargetHash || this._currDepthStencilStateStage !== depthStencilStateStage
            || this._currTextureHash !== textureHash || this._currSamplerHash !== samplerHash || this._currTransform !== transform) {
            this.autoMergeBatches(this._currComponent!);
            this._currScene = renderScene;
            this._currComponent = renderComp;
            this._currTransform = transform;
            this._currMaterial = mat;
            this._currTexture = texture;
            this._currSampler = samp;
            this._currTextureHash = textureHash;
            this._currSamplerHash = samplerHash;
            this._currBlendTargetHash = blendTargetHash;
            this._currDepthStencilStateStage = depthStencilStateStage;
            this._currLayer = comp.node.layer;
            this._currBatch = this._drawBatchPool.alloc();
            this._currBatch.UICapacityDirty = true;
        }

        // 暂时不用新建 batch
        // if(!this._currBatch) {
        //     this._currBatch = this._drawBatchPool.alloc();
        // }
        // 来一个填充一个，然后不用判断合批，直到不能合批
        // this._currBatch.fillBuffers(comp, this._localUBOManager, mat);

        // 这个 dirty 负责将node 的 dirtyFlag 传递给 UITransform
        // 然后 除了置位之外，这个 dirty 会影响两个 dirty
        // 一个是 _rectDirty 更新 anchor 和 size 用
        // 一个是 _renderDataDirty 更新所有其他数据用
        // 考虑合并
        // 为什么不直接使用 node._dirtyFlag 由于会被 gizmo 提前更新置位掉，这里想要使用的时候位就空了
        const uiPros = comp.node._uiProps;
        if (comp.node.hasChangedFlags) {
            uiPros.uiTransformComp!.setRectDirty(comp.node.hasChangedFlags);
        }
        // 这个可以优化为执行不同函数？？ // 最好执行不同的函数 // 还有个 dirty 需要的，更新用的
        let bufferInfo: IRenderItem;
        let localBuffer;
        if (this.reloadBatchDirty) {
            // 由于节点树顺序发生变化，导致 buffer 中的数据发生变化，所以全部重新录制
            // 没有集中处理的必要
            // 全部信息都在此
            this._currBatch.fillBuffers(comp, this._localUBOManager, mat, this);
            bufferInfo = this.renderQueue[this._currWalkIndex];
            localBuffer = bufferInfo.localBuffer;
            this._resetRenderDirty(comp);
        } else if (comp.node.hasChangedFlags || uiPros.uiTransformComp!._rectDirty || comp._renderDataDirty) {
            // 需要考虑的是，此处的更新的 dirty
            // 这里的更新，可以没有世界坐标的变化
            bufferInfo = this.renderQueue[this._currWalkIndex];
            localBuffer = bufferInfo.localBuffer;

            // 全局的 dirty 因为只有上传和不上传两种状态
            this.updateBufferDirty = true; // 决定要不要上传 buffer 的 dirty
            this._currBatch.updateBuffer(comp, bufferInfo, localBuffer);
            // 更新数据即可 // 需要利用组件的各种 dirty 来判断是否要更新，类似于 renderDataDirty
            this._resetRenderDirty(comp);
        } else {
            bufferInfo = this.renderQueue[this._currWalkIndex];
            localBuffer = bufferInfo.localBuffer;
        }
        this._currBatch.fillDrawCall(bufferInfo, localBuffer);
        ++this._currWalkIndex;
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
    public commitModel (comp: UIComponent | Renderable2D, model: Model | null, mat: Material | null) {
        // if the last comp is spriteComp, previous comps should be batched.
        if (this._currMaterial !== this._emptyMaterial) {
            this.autoMergeBatches(this._currComponent!);
        }

        let depthStencil;
        let dssHash = 0;
        if (mat) {
            // Notice: A little hack, if not this two stage, not need update here, while control by stencilManger
            if (comp.stencilStage === Stage.ENABLED || comp.stencilStage === Stage.DISABLED) {
                comp.stencilStage = StencilManager.sharedManager!.stage;
            }
            depthStencil = StencilManager.sharedManager!.getStencilStage(comp.stencilStage, mat);
            dssHash = StencilManager.sharedManager!.getStencilHash(comp.stencilStage);
        }

        const stamp = legacyCC.director.getTotalFrames();
        if (model) {
            model.updateTransform(stamp);
            model.updateUBOs(stamp);
        }

        for (let i = 0; i < model!.subModels.length; i++) {
            const curDrawBatch = this._drawBatchPool.alloc();
            const subModel = model!.subModels[i];
            curDrawBatch.renderScene = comp._getRenderScene();
            curDrawBatch.visFlags = comp.node.layer;
            curDrawBatch.model = model;
            curDrawBatch.bufferBatch = null;
            curDrawBatch.texture = null;
            curDrawBatch.sampler = null;
            curDrawBatch.useLocalData = null;
            if (!depthStencil) { depthStencil = null; }
            curDrawBatch.fillPasses(mat, depthStencil, dssHash, null, 0, subModel.patches, this);
            curDrawBatch.descriptorSet = subModel.descriptorSet;
            curDrawBatch.inputAssembler = subModel.inputAssembler;
            curDrawBatch.model!.visFlags = curDrawBatch.visFlags;
            this._batches.push(curDrawBatch);
        }

        // reset current render state to null
        this._currMaterial = this._emptyMaterial;
        this._currScene = null;
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
    public autoMergeBatches (renderComp?: Renderable2D) {
        if (!this._currScene) return;

        let blendState;
        let depthStencil;
        let dssHash = 0;
        let bsHash = 0;
        if (renderComp) {
            blendState = renderComp.blendHash === -1 ? null : renderComp.getBlendState();
            bsHash = renderComp.blendHash;
            if (renderComp.customMaterial !== null) {
                depthStencil = StencilManager.sharedManager!.getStencilStage(renderComp.stencilStage, this._currMaterial);
            } else {
                depthStencil = StencilManager.sharedManager!.getStencilStage(renderComp.stencilStage);
            }
            dssHash = StencilManager.sharedManager!.getStencilHash(renderComp.stencilStage);
        }

        // 先有一个 currBatch，然后这 currBatch 调用方法
        // const curDrawBatch = this._currStaticRoot ? this._currStaticRoot._requireDrawBatch() : this._drawBatchPool.alloc();
        const curDrawBatch = this._currStaticRoot ? this._currStaticRoot._requireDrawBatch() : this._currBatch;
        curDrawBatch.renderScene = this._currScene;
        curDrawBatch.visFlags = this._currLayer;
        curDrawBatch.texture = this._currTexture!;
        curDrawBatch.sampler = this._currSampler;
        curDrawBatch.inputAssembler = this._dummyIA.ia;
        curDrawBatch.useLocalData = this._currTransform;
        curDrawBatch.textureHash = this._currTextureHash;
        curDrawBatch.samplerHash = this._currSamplerHash;
        curDrawBatch.fillPasses(this._currMaterial, depthStencil, dssHash, blendState, bsHash, null, this);

        // 这儿填充？？
        this._batches.push(curDrawBatch);
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
    public forceMergeBatches (material: Material, frame: TextureBase | SpriteFrame | RenderTexture | null, renderComp: Renderable2D) {
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
        this._currLayer = renderComp.node.layer;
        this._currScene = renderComp._getRenderScene();

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

        this._preProcess(node);
        if (len > 0 && !node._static) {
            const children = node.children;
            for (let i = 0; i < children.length; ++i) {
                const child = children[i];
                this.walk(child, level);
            }
        }

        this._postProcess(node);

        level += 1;
    }

    private _preProcess (node: Node) {
        const render = node._uiProps.uiComp;
        if (!render) { // hack for opacity
            const localAlpha = node._uiProps.localOpacity;
            node._uiProps.opacity = (node.parent && node.parent._uiProps) ? node.parent._uiProps.opacity * localAlpha : localAlpha;
        }
        if (!node._uiProps.uiTransformComp) {
            return;
        }
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

    private _screenSort (a: RenderRoot2D, b: RenderRoot2D) {
        return a.node.getSiblingIndex() - b.node.getSiblingIndex();
    }

    private _applyOpacity (comp: Renderable2D) {
        const color = comp.color.a / 255;
        const opacity = (this._parentOpacity *= color);
        // const currMeshBuffer = this.currBufferBatch!;
        // const byteOffset = currMeshBuffer.byteOffset >> 2;
        // const vBuf = currMeshBuffer.vData!;
        // const lastByteOffset = currMeshBuffer.lastByteOffset >> 2;
        // const stride = currMeshBuffer.vertexFormatBytes / 4;
        // for (let i = lastByteOffset; i < byteOffset; i += stride) {
        //     vBuf[i + MeshBuffer.OPACITY_OFFSET] *= opacity;
        // }

        // currMeshBuffer.lastByteOffset = currMeshBuffer.byteOffset;
    }

    private _releaseDescriptorSetCache (textureHash: number) {
        this._descriptorSetCache.releaseDescriptorSetCache(textureHash);
    }

    private _resetRenderDirty (comp: Renderable2D) {
        comp._renderDataDirty = false;
        comp.node._uiProps.uiTransformComp!._rectDirty = false;
    }
}

class LocalDescriptorSet  {
    private _descriptorSet: DescriptorSet | null = null;
    private _transform: Node | null = null;
    private _textureHash = 0;
    private _samplerHash = 0;
    private _localBuffer: Buffer | null = null;
    private _transformUpdate = true;
    private declare _localData;

    public get descriptorSet (): DescriptorSet | null {
        return this._descriptorSet;
    }

    constructor () {
        const device = legacyCC.director.root.device;
        this._localData = new Float32Array(UBOLocal.COUNT);
        this._localBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            UBOLocal.SIZE,
            UBOLocal.SIZE,
        ));
    }

    public initialize (batch) {
        const device = legacyCC.director.root.device;
        this._transform = batch.useLocalData;
        this._textureHash = batch.textureHash;
        this._samplerHash = batch.samplerHash;
        _dsInfo.layout = batch.passes[0].localSetLayout;
        this._descriptorSet =  device.createDescriptorSet(_dsInfo);
        this._descriptorSet!.bindBuffer(UBOLocal.BINDING, this._localBuffer!);
        const binding = ModelLocalBindings.SAMPLER_SPRITE;
        this._descriptorSet!.bindTexture(binding, batch.texture!);
        this._descriptorSet!.bindSampler(binding, batch.sampler!);
        this._descriptorSet!.update();
        this._transformUpdate = true;
    }

    public updateTransform (transform: Node) {
        if (transform === this._transform) return;
        this._transform = transform;
        this._transformUpdate = true;
        this.uploadLocalData();
    }

    public updateLocal () {
        if (!this._transform) return;
        this.uploadLocalData();
    }

    public equals (transform, textureHash, samplerHash) {
        return this._transform === transform && this._textureHash === textureHash && this._samplerHash === samplerHash;
    }

    public reset () {
        this._transform = null;
        this._textureHash = 0;
        this._samplerHash = 0;
    }

    public destroy () {
        if (this._localBuffer) {
            this._localBuffer.destroy();
            this._localBuffer = null;
        }

        if (this._descriptorSet) {
            this._descriptorSet.destroy();
            this._descriptorSet = null;
        }

        this._localData = null;
    }

    private uploadLocalData () {
        const node = this._transform!;
        // @ts-expect-error TS2445
        if (node.hasChangedFlags || node._dirtyFlags) {
            node.updateWorldTransform();
        }
        if (this._transformUpdate) {
            // @ts-expect-error TS2445
            const worldMatrix = node._mat;
            Mat4.toArray(this._localData, worldMatrix, UBOLocal.MAT_WORLD_OFFSET);
            Mat4.inverseTranspose(m4_1, worldMatrix);
            if (!JSB) {
                // fix precision lost of webGL on android device
                // scale worldIT mat to around 1.0 by product its sqrt of determinant.
                const det = Mat4.determinant(m4_1);
                const factor = 1.0 / Math.sqrt(det);
                Mat4.multiplyScalar(m4_1, m4_1, factor);
            }
            Mat4.toArray(this._localData, m4_1, UBOLocal.MAT_WORLD_IT_OFFSET);
            this._localBuffer!.update(this._localData);
            this._transformUpdate = false;
        }
    }
}

class DescriptorSetCache {
    private _descriptorSetCache = new Map<number, DescriptorSet>();
    private _dsCacheHashByTexture = new Map<number, number>();
    private _localDescriptorSetCache: LocalDescriptorSet[] = [];
    private _localCachePool: Pool<LocalDescriptorSet>;

    constructor () {
        this._localCachePool = new Pool(() => new LocalDescriptorSet(), 16);
    }

    public getDescriptorSet (batch: DrawBatch2D, drawCall: DrawCall): DescriptorSet {
        const root = legacyCC.director.root;
        let hash;
        if (batch.useLocalData) {
            const caches = this._localDescriptorSetCache;
            for (let i = 0, len = caches.length; i < len; i++) {
                const cache: LocalDescriptorSet = caches[i];
                if (cache.equals(batch.useLocalData, batch.textureHash, batch.samplerHash)) {
                    return cache.descriptorSet!;
                }
            }
            const localDs = this._localCachePool.alloc();
            localDs.initialize(batch);
            this._localDescriptorSetCache.push(localDs);
            return localDs.descriptorSet!;
        } else {
            // 创建并返回缓存
            // 双层 Map 不再适用，需要使用 hash 值了
            // 这儿需要一个 简单且快的 hash 算法，把这个两层的 map 缩减为一层
            // texture hash 位数不定
            // simpler hash genSamplerHash 得来，28+ 位
            // UBO hash 可能只要两三位就够
            // 两个 hash + 一个拼接 hash 可以用 ^
            // 新问题，怎么释放，texture 的 hash 把所有的释放
            hash = batch.textureHash ^ batch.samplerHash ^ drawCall.bufferHash;
            if (this._descriptorSetCache.has(hash)) {
                return this._descriptorSetCache.get(hash)!;
            } else {
                const device = legacyCC.director.root.device;
                _dsInfo.layout = batch.passes[0].localSetLayout;
                const descriptorSet = root.device.createDescriptorSet(_dsInfo);
                const binding = ModelLocalBindings.SAMPLER_SPRITE;
                descriptorSet.bindTexture(binding, batch.texture!);
                descriptorSet.bindSampler(binding, batch.sampler!);
                const localBufferView = drawCall.bufferView;
                descriptorSet.bindBuffer(ModelLocalBindings.UBO_LOCAL, localBufferView); // 这儿绑定的是 bufferView
                descriptorSet.update();

                this._descriptorSetCache.set(hash, descriptorSet);
                this._dsCacheHashByTexture.set(batch.textureHash, hash);

                return descriptorSet;
            }
            // const descriptorSetTextureMap = this._descriptorSetCache.get(batch.textureHash);
            // if (descriptorSetTextureMap && descriptorSetTextureMap.has(batch.samplerHash)) {
            //     return descriptorSetTextureMap.get(batch.samplerHash)!;
            // } else {
            //     _dsInfo.layout = batch.passes[0].localSetLayout;
            //     const handle = DSPool.alloc(root.device, _dsInfo);
            //     const descriptorSet = DSPool.get(handle);
            //     const binding = ModelLocalBindings.SAMPLER_SPRITE;
            //     descriptorSet.bindTexture(binding, batch.texture!);
            //     descriptorSet.bindSampler(binding, batch.sampler!);
            //     descriptorSet.update();

            //     if (descriptorSetTextureMap) {
            //         this._descriptorSetCache.get(batch.textureHash)!.set(batch.samplerHash, handle);
            //     } else {
            //         this._descriptorSetCache.set(batch.textureHash, new Map([[batch.samplerHash, handle]]));
            //     }
            //     return handle;
            // }
        }
    }

    public update () {
        const caches = this._localDescriptorSetCache;
        caches.forEach((value) => {
            value.updateLocal();
        });
    }

    public reset () {
        const caches = this._localDescriptorSetCache;
        caches.forEach((value) => {
            this._localCachePool.free(value);
        });
        this._localDescriptorSetCache.length = 0;
    }

    public releaseDescriptorSetCache (textureHash) {
        // if (this._descriptorSetCache.has(textureHash)) {
        //     DSPool.free(this._descriptorSetCache.get(textureHash)!);
        //     this._descriptorSetCache.delete(textureHash);
        // }

        // 新加缓存
        const key = this._dsCacheHashByTexture.get(textureHash);
        if (key && this._descriptorSetCache.has(key)) {
            this._descriptorSetCache.get(key)!.destroy();
            this._descriptorSetCache.delete(key);
            this._dsCacheHashByTexture.delete(textureHash);
        }
    }

    public destroy () {
        this._descriptorSetCache.forEach((value, key, map) => {
            value.destroy();
        });
        this._descriptorSetCache.clear();
        this._dsCacheHashByTexture.clear();
        this._localDescriptorSetCache.length = 0;
        this._localCachePool.destroy((obj) => { obj.destroy(); });
    }
}

legacyCC.internal.Batcher2D = Batcher2D;
