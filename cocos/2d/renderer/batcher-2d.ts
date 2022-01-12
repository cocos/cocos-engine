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
import type { UIStaticBatch } from '../components/ui-static-batch';
import { Material } from '../../core/assets/material';
import { RenderRoot2D, Renderable2D } from '../framework';
import { Texture, Device, Attribute, Sampler, DescriptorSetInfo, Buffer,
    BufferInfo, BufferUsageBit, MemoryUsageBit, DescriptorSet } from '../../core/gfx';
import { Pool } from '../../core/memop';
import { CachedArray } from '../../core/memop/cached-array';
import { Root } from '../../core/root';
import { Node } from '../../core/scene-graph';
import { Stage, StencilManager } from './stencil-manager';
import { DrawBatch2D } from './draw-batch';
import { legacyCC } from '../../core/global-exports';
import { ModelLocalBindings, UBOLocal } from '../../core/pipeline/define';
import { SpriteFrame } from '../assets';
import { TextureBase } from '../../core/assets/texture-base';
import { sys } from '../../core/platform/sys';
import { Mat4 } from '../../core/math';
import { IBatcher } from './i-batcher';
import { StaticVBAccessor } from './static-vb-accessor';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { getAttributeStride, vfmtPosUvColor } from './vertex-format';
import { updateOpacity } from '../assembler/utils';
import { BaseRenderData, MeshRenderData } from './render-data';
import { UIMeshRenderer } from '../components/ui-mesh-renderer';

const _dsInfo = new DescriptorSetInfo(null!);
const m4_1 = new Mat4();

/**
 * @zh
 * UI 渲染流程
 */
export class Batcher2D implements IBatcher {
    get currBufferAccessor () {
        if (this._staticVBBuffer) return this._staticVBBuffer;
        // create if not set
        this._staticVBBuffer = this.switchBufferAccessor();
        return this._staticVBBuffer;
    }

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
    private _staticVBBuffer: StaticVBAccessor | null = null;
    private _bufferAccessors: Map<number, StaticVBAccessor> = new Map();
    private _meshBufferUseCount: Map<number, number> = new Map();

    private _drawBatchPool: Pool<DrawBatch2D>;
    private _batches: CachedArray<DrawBatch2D>;
    private _currBID = -1;
    private _indexStart = 0;

    private _emptyMaterial = new Material();
    private _currRenderData: BaseRenderData | null = null;
    private _currMaterial: Material = this._emptyMaterial;
    private _currTexture: Texture | null = null;
    private _currSampler: Sampler | null = null;
    private _currStaticRoot: UIStaticBatch | null = null;
    private _currComponent: Renderable2D | null = null;
    private _currTransform: Node | null = null;
    private _currTextureHash = 0;
    private _currSamplerHash = 0;
    private _currLayer = 0;
    private _currDepthStencilStateStage: any | null = null;
    private _currIsStatic = false;
    private _currHash = 0;

    private _pOpacity = 1;
    private _opacityDirty = 0;

    // DescriptorSet Cache Map
    private _descriptorSetCache = new DescriptorSetCache();

    constructor (private _root: Root) {
        this.device = _root.device;
        this._batches = new CachedArray(64);
        this._drawBatchPool = new Pool(() => new DrawBatch2D(), 128, (obj) => obj.destroy(this));
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

        this._bufferAccessors.forEach((accessor: StaticVBAccessor) => {
            accessor.destroy();
        });
        this._bufferAccessors.clear();

        if (this._drawBatchPool) {
            this._drawBatchPool.destroy();
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

    public update () {
        const screens = this._screens;
        let offset = 0;
        for (let i = 0; i < screens.length; ++i) {
            const screen = screens[i];
            const scene = screen._getRenderScene();
            if (!screen.enabledInHierarchy || !scene) {
                continue;
            }
            // Reset state and walk
            this._opacityDirty = 0;
            this._pOpacity = 1;
            this.walk(screen.node);
            this.autoMergeBatches(this._currComponent!);

            let batchPriority = 0;
            if (this._batches.length > offset) {
                for (; offset < this._batches.length; ++offset) {
                    const batch = this._batches.array[offset];

                    if (batch.model) {
                        const subModels = batch.model.subModels;
                        for (let j = 0; j < subModels.length; j++) {
                            subModels[j].priority = batchPriority++;
                        }
                    } else {
                        batch.descriptorSet = this._descriptorSetCache.getDescriptorSet(batch);
                    }
                    scene.addBatch(batch);
                }
            }
        }
    }

    public uploadBuffers () {
        this._meshDataArray.forEach(rd => {
            rd.uploadBuffers();
        });
        this._meshDataArray = [];

        if (this._batches.length > 0) {
            this._bufferAccessors.forEach((accessor: StaticVBAccessor) => {
                accessor.uploadBuffers();
                accessor.reset();
            });

            this._descriptorSetCache.update();
        }
    }

    public reset () {
        // Reset batches
        for (let i = 0; i < this._batches.length; ++i) {
            const batch = this._batches.array[i];
            if (batch.isStatic) {
                continue;
            }

            batch.clear();
            this._drawBatchPool.free(batch);
        }
        // Reset buffer accessors
        this._bufferAccessors.forEach((accessor: StaticVBAccessor) => {
            accessor.reset();
        });
        this._staticVBBuffer = null;

        this._currBID = -1;
        this._indexStart = 0;
        this._currHash = 0;
        this._currLayer = 0;
        this._currRenderData = null;
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
     * Switch the mesh buffer for corresponding vertex layout if necessary.
     * @param attributes use [[VertexFormat.vfmtPosUvColor]] by default
     */
    public switchBufferAccessor (attributes: Attribute[] = vfmtPosUvColor) {
        const strideBytes = attributes === vfmtPosUvColor ? 36 /* 9x4 */ : getAttributeStride(attributes);
        // If current accessor not compatible with the requested attributes
        if (!this._staticVBBuffer || (this._staticVBBuffer.vertexFormatBytes) !== strideBytes) {
            let accessor = this._bufferAccessors.get(strideBytes);
            if (!accessor) {
                accessor = new StaticVBAccessor(this.device, attributes);
                this._bufferAccessors.set(strideBytes, accessor);
            }
            // let meshBufferUseCount = this._meshBufferUseCount.get(strideBytes) || 0;
            // // @ts-expect-error Property '__isWebIOS14OrIPadOS14Env' does not exist on 'sys'
            // if (vertexCount && indexCount || sys.__isWebIOS14OrIPadOS14Env) {
            //     // useCount++ when _recreateMeshBuffer
            //     meshBufferUseCount++;
            // }
            // this._meshBufferUseCount.set(strideBytes, meshBufferUseCount);

            this._staticVBBuffer = accessor;
            this._currBID = -1;
        }
        return this._staticVBBuffer;
    }

    public updateBuffer (attributes: Attribute[], bid: number) {
        const accessor = this.switchBufferAccessor(attributes);
        // If accessor changed, then current bid will be reset to -1, this check will pass too
        if (this._currBID !== bid) {
            this._currBID = bid;
            this._indexStart = accessor.getMeshBuffer(bid).indexOffset;
        }
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
    public commitComp (comp: Renderable2D, renderData: BaseRenderData|null, frame: TextureBase|SpriteFrame|null, assembler, transform: Node|null) {
        let dataHash = 0;
        let mat;
        let bufferID = -1;
        if (renderData && renderData.chunk) {
            if (!renderData.isValid()) return;
            dataHash = renderData.dataHash;
            mat = renderData.material;
            bufferID = renderData.chunk.bufferId;
        }
        comp.stencilStage = StencilManager.sharedManager!.stage;
        const depthStencilStateStage = comp.stencilStage;

        if (this._currHash !== dataHash || dataHash === 0 || this._currMaterial !== mat
            || this._currDepthStencilStateStage !== depthStencilStateStage) {
            // Merge all previous data to a render batch, and update buffer for next render data
            this.autoMergeBatches(this._currComponent!);
            if (renderData && !renderData.isMeshBuffer) {
                this.updateBuffer(renderData.vertexFormat, bufferID);
            }

            this._currRenderData = renderData;
            this._currHash = renderData ? renderData.dataHash : 0;
            this._currComponent = comp;
            this._currTransform = transform;
            this._currMaterial = comp.getRenderMaterial(0)!;
            // this._currBlendTargetHash = comp.blendHash;
            this._currDepthStencilStateStage = depthStencilStateStage;
            this._currLayer = comp.node.layer;
            if (frame) {
                this._currTexture = frame.getGFXTexture();
                this._currSampler = frame.getGFXSampler();
                this._currTextureHash = frame.getHash();
                this._currSamplerHash = this._currSampler.hash;
            } else {
                this._currTexture = null;
                this._currSampler = null;
                this._currTextureHash = 0;
                this._currSamplerHash = 0;
            }
        }

        assembler.fillBuffers(comp, this);
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
    public commitModel (comp: UIMeshRenderer | Renderable2D, model: Model | null, mat: Material | null) {
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
            curDrawBatch.visFlags = comp.node.layer;
            curDrawBatch.model = model;
            curDrawBatch.texture = null;
            curDrawBatch.sampler = null;
            curDrawBatch.useLocalData = null;
            if (!depthStencil) { depthStencil = null; }
            curDrawBatch.fillPasses(mat, depthStencil, dssHash, null, 0, subModel.patches, this);
            curDrawBatch.inputAssembler = subModel.inputAssembler;
            curDrawBatch.model!.visFlags = curDrawBatch.visFlags;
            curDrawBatch.descriptorSet = subModel.descriptorSet;
            this._batches.push(curDrawBatch);
        }

        // reset current render state to null
        this._currMaterial = this._emptyMaterial;
        this._currRenderData = null;
        this._currComponent = null;
        this._currTransform = null;
        this._currTexture = null;
        this._currSampler = null;
        this._currTextureHash = 0;
        this._currLayer = 0;
    }

    public setupStaticBatch (staticComp: UIStaticBatch, bufferAccessor: StaticVBAccessor) {
        this.finishMergeBatches();
        this._staticVBBuffer = bufferAccessor;
        this.currStaticRoot = staticComp;
    }

    public endStaticBatch () {
        this.finishMergeBatches();
        this.currStaticRoot = null;
        // Clear linear buffer to switch to the correct internal accessor
        this._staticVBBuffer = null;
        this.switchBufferAccessor();
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

    private _meshDataArray :MeshRenderData[] = [];
    /**
     * @en
     * End a section of render data and submit according to the batch condition.
     *
     * @zh
     * 根据合批条件，结束一段渲染数据并提交。
     */
    public autoMergeBatches (renderComp?: Renderable2D) {
        const mat = this._currMaterial;
        if (!mat) {
            return;
        }
        let ia;
        const rd = this._currRenderData as MeshRenderData;
        const accessor = this._staticVBBuffer;
        // Previous batch using mesh buffer
        if (rd && rd.isMeshBuffer) {
            ia = rd.requestIA(this.device);
            if (-1 === this._meshDataArray.indexOf(rd)) {
                this._meshDataArray.push(rd);
            }
        } else if (accessor) {
        // Previous batch using static vb buffer
            const bid = this._currBID;
            const buf = accessor.getMeshBuffer(bid);
            if (!buf) {
                return;
            }
            const indexCount = buf.indexOffset - this._indexStart;
            if (indexCount <= 0) return;
            assertIsTrue(this._indexStart < buf.indexOffset);
            buf.setDirty();
            // Request ia
            ia = buf.requireFreeIA(this.device);
            ia.firstIndex = this._indexStart;
            ia.indexCount = indexCount;
            // Update index tracker and bid
            this._indexStart = buf.indexOffset;
        }
        this._currBID = -1;

        // Request ia failed
        if (!ia) {
            return;
        }

        let blendState;
        let depthStencil;
        let dssHash = 0;
        let bsHash = 0;
        if (renderComp) {
            blendState = renderComp.blendHash === -1 ? null : renderComp.getBlendState();
            bsHash = renderComp.blendHash;
            if (renderComp.customMaterial !== null) {
                depthStencil = StencilManager.sharedManager!.getStencilStage(renderComp.stencilStage, mat);
            } else {
                depthStencil = StencilManager.sharedManager!.getStencilStage(renderComp.stencilStage);
            }
            dssHash = StencilManager.sharedManager!.getStencilHash(renderComp.stencilStage);
        }

        const curDrawBatch = this._currStaticRoot ? this._currStaticRoot._requireDrawBatch() : this._drawBatchPool.alloc();
        curDrawBatch.visFlags = this._currLayer;
        curDrawBatch.texture = this._currTexture!;
        curDrawBatch.sampler = this._currSampler;
        curDrawBatch.inputAssembler = ia;
        curDrawBatch.useLocalData = this._currTransform;
        curDrawBatch.textureHash = this._currTextureHash;
        curDrawBatch.samplerHash = this._currSamplerHash;
        curDrawBatch.fillPasses(mat, depthStencil, dssHash, blendState, bsHash, null, this);

        this._batches.push(curDrawBatch);

        // HACK: After sharing buffer between drawcalls, the performance degradation a lots on iOS 14 or iPad OS 14 device
        // TODO: Maybe it can be removed after Apple fixes it?
        // @ts-expect-error Property '__isWebIOS14OrIPadOS14Env' does not exist on 'sys'
        if (sys.__isWebIOS14OrIPadOS14Env && !this._currIsStatic) {
        //     this._currMeshBuffer = null;
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
    public forceMergeBatches (material: Material, frame: TextureBase | SpriteFrame | null, renderComp: Renderable2D) {
        this._currMaterial = material;

        if (frame) {
            this._currTexture = frame.getGFXTexture();
            this._currSampler = frame.getGFXSampler();
            this._currTextureHash = frame.getHash();
            this._currSamplerHash = this._currSampler.hash;
        } else {
            this._currTexture = this._currSampler = null;
            this._currTextureHash = this._currSamplerHash = 0;
        }
        this._currLayer = renderComp.node.layer;

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
        if (!node.activeInHierarchy) {
            return;
        }
        const children = node.children;
        const uiProps = node._uiProps;
        const render = uiProps.uiComp as Renderable2D;

        // Save opacity
        const parentOpacity = this._pOpacity;
        let opacity = parentOpacity;
        // TODO Always cascade ui property's local opacity before remove it
        const selfOpacity = render && render.color ? render.color.a / 255 : 1;
        this._pOpacity = opacity *= selfOpacity * uiProps.localOpacity;
        // TODO Set opacity to ui property's opacity before remove it
        // @ts-expect-error temporary force set, will be removed with ui property's opacity
        uiProps._opacity = opacity;
        if (uiProps.colorDirty) {
            // Cascade color dirty state
            this._opacityDirty++;
        }

        // Render assembler update logic
        if (render && render.enabledInHierarchy) {
            render.updateAssembler(this);
        }

        // Update cascaded opacity to vertex buffer
        if (this._opacityDirty && render && render.renderData && render.renderData.vertexCount > 0) {
            // HARD COUPLING
            updateOpacity(render.renderData, opacity);
        }

        if (children.length > 0 && !node._static) {
            for (let i = 0; i < children.length; ++i) {
                const child = children[i];
                this.walk(child, level);
            }
        }

        if (uiProps.colorDirty) {
            // Reduce cascaded color dirty state
            this._opacityDirty--;
            // Reset color dirty
            uiProps.colorDirty = false;
        }
        // Restore opacity
        this._pOpacity = parentOpacity;
        // Post render assembler update logic
        // ATTENTION: Will also reset colorDirty inside postUpdateAssembler
        if (render && render.enabledInHierarchy) {
            render.postUpdateAssembler(this);
        }

        level += 1;
    }

    private _screenSort (a: RenderRoot2D, b: RenderRoot2D) {
        return a.node.getSiblingIndex() - b.node.getSiblingIndex();
    }

    // TODO: Not a good way to do the job
    private _releaseDescriptorSetCache (textureHash: number) {
        this._descriptorSetCache.releaseDescriptorSetCache(textureHash);
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
        this._descriptorSet = device.createDescriptorSet(_dsInfo);
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

    public isValid () {
        return this._transform && this._transform.isValid;
    }

    public uploadLocalData () {
        const node = this._transform!;
        // @ts-expect-error TS2445
        if (node.hasChangedFlags || node._dirtyFlags) {
            node.updateWorldTransform();
            this._transformUpdate = true;
        }
        if (this._transformUpdate) {
            const worldMatrix = node.worldMatrix;
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
        this._localCachePool = new Pool(() => new LocalDescriptorSet(), 16, (obj) => obj.destroy());
    }

    public getDescriptorSet (batch: DrawBatch2D): DescriptorSet {
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
            hash = batch.textureHash ^ batch.samplerHash;
            if (this._descriptorSetCache.has(hash)) {
                return this._descriptorSetCache.get(hash)!;
            } else {
                _dsInfo.layout = batch.passes[0].localSetLayout;
                const descriptorSet = root.device.createDescriptorSet(_dsInfo) as DescriptorSet;
                const binding = ModelLocalBindings.SAMPLER_SPRITE;
                descriptorSet.bindTexture(binding, batch.texture!);
                descriptorSet.bindSampler(binding, batch.sampler!);
                descriptorSet.update();

                this._descriptorSetCache.set(hash, descriptorSet);
                this._dsCacheHashByTexture.set(batch.textureHash, hash);

                return descriptorSet;
            }
        }
    }

    public update () {
        const caches = this._localDescriptorSetCache;
        const uselessArray: number[] = [];
        caches.forEach((value) => {
            if (value.isValid()) {
                value.uploadLocalData();
            } else {
                value.reset();
                const pos = caches.indexOf(value);
                uselessArray.push(pos);
            }
        });
        for (let i = uselessArray.length - 1; i >= 0; i--) {
            caches.splice(uselessArray[i], 1);
        }
    }

    public reset () {
        const caches = this._localDescriptorSetCache;
        caches.forEach((value) => {
            this._localCachePool.free(value);
        });
        this._localDescriptorSetCache.length = 0;
    }

    public releaseDescriptorSetCache (textureHash) {
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
        this._localCachePool.destroy();
    }
}

legacyCC.internal.Batcher2D = Batcher2D;
