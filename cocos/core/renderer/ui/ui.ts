/*
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 * @hidden
 */

import { UIStaticBatchComponent } from '../../../ui';
import { Material } from '../../assets/material';
import { CanvasComponent, UIComponent, UIRenderComponent } from '../../components/ui-base';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { GFXSampler } from '../../gfx/sampler';
import { GFXTextureView } from '../../gfx/texture-view';
import { Pool, RecyclePool } from '../../memop';
import { CachedArray } from '../../memop/cached-array';
import { UniformBinding } from '../../pipeline/define';
import { Camera } from '../../renderer/scene/camera';
import { Model } from '../../renderer/scene/model';
import { RenderScene } from '../../renderer/scene/render-scene';
import { Root } from '../../root';
import { Layers, Node } from '../../scene-graph';
import { MeshBuffer } from './mesh-buffer';
import { StencilManager } from './stencil-manager';
import { UIBatchModel } from './ui-batch-model';
import { UIDrawBatch } from './ui-draw-batch';
import { UIMaterial } from './ui-material';
import * as UIVertexFormat from './ui-vertex-format';
import { legacyCC } from '../../global-exports';

/**
 * @zh
 * UI 渲染流程
 */
export class UI {

    get renderScene (): RenderScene {
        return this._scene;
    }

    get currBufferBatch () {
        return this._currMeshBuffer;
    }

    set currBufferBatch (value) {
        if (!value) {
            return;
        }

        this._currMeshBuffer = value;
    }

    set currStaticRoot (value: UIStaticBatchComponent | null) {
        this._currStaticRoot = value;
    }

    public device: GFXDevice;
    private _screens: CanvasComponent[] = [];
    private _bufferBatchPool: RecyclePool<MeshBuffer> = new RecyclePool(() => {
        return new MeshBuffer(this);
    }, 128);
    private _drawBatchPool: Pool<UIDrawBatch> = new Pool(() => {
        return new UIDrawBatch();
    }, 128);
    private _cmdBuff: GFXCommandBuffer | null = null;
    private _scene: RenderScene;
    private _attributes: IGFXAttribute[] = [];
    private _meshBuffers: MeshBuffer[] = [];
    private _meshBufferUseCount = 0;
    private _uiMaterials: Map<number, UIMaterial> = new Map<number, UIMaterial>();
    private _canvasMaterials: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
    private _batches: CachedArray<UIDrawBatch>;
    private _uiModelPool: Pool<UIBatchModel> | null = null;
    private _modelInUse: CachedArray<UIBatchModel>;
    // batcher
    private _emptyMaterial = new Material();
    private _currMaterial: Material = this._emptyMaterial;
    private _currTexView: GFXTextureView | null = null;
    private _currSampler: GFXSampler | null = null;
    private _currCanvas: CanvasComponent | null = null;
    private _currMeshBuffer: MeshBuffer | null = null;
    private _currStaticRoot: UIStaticBatchComponent | null = null;
    private _parentOpacity = 1;

    constructor (private _root: Root) {
        this.device = _root.device;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });
        this._uiModelPool = new Pool(() => {
            const model = legacyCC.director.root.createModel(UIBatchModel);
            model.enabled = true;
            model.visFlags |= Layers.Enum.UI_3D;
            return model;
        }, 2);
        this._modelInUse = new CachedArray<UIBatchModel>(10);
        this._batches = new CachedArray(64);

        legacyCC.director.on(legacyCC.Director.EVENT_BEFORE_DRAW, this.update, this);
    }

    public initialize () {

        this._attributes = UIVertexFormat.vfmt;

        this._requireBufferBatch();

        this._cmdBuff = this.device.createCommandBuffer({
            allocator: this.device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        return true;
    }

    public destroy () {

        for (const batch of this._batches.array) {
            batch.destroy(this);
        }

        for (const buffBatch of this._meshBuffers) {
            buffBatch.destroy();
        }
        this._meshBuffers.splice(0);

        this._destroyUIMaterials();

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public getRenderSceneGetter () {
        return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), 'renderScene')!.get!.bind(this);
    }

    public _getUIMaterial (mat: Material): UIMaterial {
        if (this._uiMaterials.has(mat.hash)) {
            return this._uiMaterials.get(mat.hash)!;
        } else {
            const uiMat = new UIMaterial();
            uiMat.initialize({ material: mat });
            this._uiMaterials.set(mat.hash, uiMat);
            return uiMat;
        }
    }

    public _removeUIMaterial (hash: number) {
        if (this._uiMaterials.has(hash)) {
            if (this._uiMaterials.get(hash)!.decrease() === 0) {
                this._uiMaterials.delete(hash);
            }
        }
    }

    /**
     * @en
     * Add the managed CanvasComponent.
     *
     * @zh
     * 添加屏幕组件管理。
     *
     * @param comp - 屏幕组件。
     */
    public addScreen (comp: CanvasComponent) {
        const screens = this._screens;
        // clear the canvas old visibility cache in canvasMaterial list
        for (let i = 0; i < screens.length; i++) {
            const screen = screens[i];
            if (screen.camera) {
                const visibility = screen.camera.view.visibility;
                const matRecord = this._canvasMaterials.get(visibility);
                if (matRecord) {
                    const matHashInter = matRecord!.keys();
                    let matHash = matHashInter.next();
                    while (!matHash.done) {
                        this._removeUIMaterial(matHash.value);
                        matHash = matHashInter.next();
                    }

                    matRecord.clear();
                }
            }
        }

        this._screens.push(comp);
        this._screens.sort(this._screenSort);
        for (let i = 0; i < screens.length; i++) {
            const element = screens[i];
            if (element.camera) {
                element.camera.view.visibility = Layers.BitMask.UI_2D | (i + 1);
                if (!this._canvasMaterials.has(element.camera.view.visibility)) {
                    this._canvasMaterials.set(element.camera.view.visibility, new Map<number, number>());
                }
            }
        }
    }

    /**
     * @en
     * Get the CanvasComponent by number.
     *
     * @zh
     * 通过屏幕编号获得屏幕组件。
     *
     * @param visibility - 屏幕编号。
     */
    public getScreen (visibility: number) {
        const screens = this._screens;
        for (let i = 0; i < screens.length; ++i) {
            const screen = screens[i];
            if (screen.camera) {
                if (screen.camera.view.visibility === visibility) {
                    return screen;
                }
            }
        }

        return null;
    }

    /**
     * @zh
     * Removes the CanvasComponent from the list.
     *
     * @param comp - 被移除的屏幕。
     */
    public removeScreen (comp: CanvasComponent) {
        const idx = this._screens.indexOf(comp);
        if (idx === -1) {
            return;
        }

        this._screens.splice(idx, 1);
        if (comp.camera) {
            const matRecord = this._canvasMaterials.get(comp.camera.view.visibility);
            const matHashInter = matRecord!.keys();
            let matHash = matHashInter.next();
            while (!matHash.done) {
                this._removeUIMaterial(matHash.value);
                matHash = matHashInter.next();
            }

            matRecord!.clear();
        }

        let camera: Camera | null;
        for (let i = idx; i < this._screens.length; i++) {
            camera = this._screens[i].camera;
            if (camera) {
                const matRecord = this._canvasMaterials.get(camera.view.visibility)!;
                camera.view.visibility = Layers.BitMask.UI_2D | (i + 1);
                const newMatRecord = this._canvasMaterials.get(camera.view.visibility)!;
                matRecord.forEach((value: number, key: number) => {
                    newMatRecord.set(key, value);
                });

                matRecord.clear();
            }
        }
    }

    public update (dt: number) {
        this._renderScreens();

        // update buffers
        if (this._batches.length > 0) {
            const buffers = this._meshBuffers;
            for (let i = 0; i < buffers.length; ++i) {
                const bufferBatch = buffers[i];
                bufferBatch.uploadData();
                bufferBatch.reset();
            }
        }

        this.render();
        this._reset();
    }

    public sortScreens () {
        this._screens.sort(this._screenSort);
    }

    public render () {

        let batchPriority = 0;

        for (let i = 0; i < this._modelInUse.length; i++) {
            this._scene.removeModel(this._modelInUse.get(i));
            this._uiModelPool!.free(this._modelInUse.get(i));
        }
        this._modelInUse.clear();

        if (this._batches.length) {

            for (let i = 0; i < this._batches.length; ++i) {
                const batch = this._batches.array[i];

                if (batch.model) {
                    if (batch.camera) {
                        const visFlags = batch.camera.view.visibility;
                        batch.model.visFlags = visFlags;
                        batch.model.node.layer = visFlags;
                    }
                    for (let j = 0; j < batch.model.subModelNum; j++) {
                        batch.model.getSubModel(j).priority = batchPriority++;
                    }
                } else {
                    const bindingLayout = batch.bindingLayout!;
                    // assumes sprite materials has only one sampler
                    bindingLayout.bindTextureView(UniformBinding.CUSTOM_SAMPLER_BINDING_START_POINT, batch.texView!);
                    bindingLayout.bindSampler(UniformBinding.CUSTOM_SAMPLER_BINDING_START_POINT, batch.sampler!);
                    bindingLayout.update();

                    const ia = batch.bufferBatch!.ia!;
                    ia.firstIndex = batch.firstIdx;
                    ia.indexCount = batch.idxCount;

                    const uiModel = this._uiModelPool!.alloc();
                    uiModel.directInitialize(ia, batch);
                    this._scene.addModel(uiModel);
                    uiModel.getSubModel(0).priority = batchPriority++;
                    if (batch.camera) {
                        uiModel.visFlags = batch.camera.view.visibility;
                        if (this._canvasMaterials.get(batch.camera.view.visibility)!.get(batch.material!.hash) == null) {
                            this._uiMaterials.get(batch.material!.hash)!.increase();
                            this._canvasMaterials.get(batch.camera.view.visibility)!.set(batch.material!.hash, 1);
                        }
                    }
                    this._modelInUse.push(uiModel);
                }
            }
        }
    }

    /**
     * @en
     * Render component data submission process of UI.
     * The submitted vertex data is the UI for world coordinates.
     * For example: The UI components except Graphics and UIModelComponent.
     *
     * @zh
     * UI 渲染组件数据提交流程（针对提交的顶点数据是世界坐标的提交流程，例如：除 graphics 和 uimodel 的大部分 ui 组件）。
     * 此处的数据最终会生成需要提交渲染的 model 数据。
     *
     * @param comp - 当前执行组件。
     * @param frame - 当前执行组件贴图。
     * @param assembler - 当前组件渲染数据组装器。
     */
    public commitComp (comp: UIRenderComponent, frame: GFXTextureView | null = null, assembler: any, sampler: GFXSampler | null = null) {
        const renderComp = comp;
        const texView = frame;
        const samp = sampler;

        if (this._currMaterial.hash !== renderComp.material!.hash ||
            this._currTexView !== texView || this._currSampler !== samp
        ) {
            this.autoMergeBatches();
            this._currMaterial = renderComp.material!;
            this._currTexView = texView;
            this._currSampler = samp;
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
     * For example: The UI components of Graphics and UIModelComponent.
     *
     * @zh
     * UI 渲染组件数据提交流程（针对例如： graphics 和 uimodel 等数据量较为庞大的 ui 组件）。
     *
     * @param comp - 当前执行组件。
     * @param model - 提交渲染的 model 数据。
     * @param mat - 提交渲染的材质。
     */
    public commitModel (comp: UIComponent, model: Model | null, mat: Material | null) {
        // if the last comp is spriteComp, previous comps should be batched.
        if (this._currMaterial !== this._emptyMaterial) {
            this.autoMergeBatches();
        }

        if (mat) {
            const rebuild = StencilManager.sharedManager!.handleMaterial(mat);
            if (rebuild && model) {
                for (let i = 0; i < model.subModelNum; i++) {
                    model.setSubModelMaterial(i, mat);
                }
            }
        }

        const uiCanvas = this._currCanvas;
        const curDrawBatch = this._drawBatchPool.alloc();
        curDrawBatch.camera = uiCanvas && uiCanvas.camera;
        curDrawBatch.model = model;
        curDrawBatch.bufferBatch = null;
        curDrawBatch.material = mat;
        curDrawBatch.texView = null;
        curDrawBatch.sampler = null;
        curDrawBatch.firstIdx = 0;
        curDrawBatch.idxCount = 0;

        curDrawBatch.pipelineState = null;
        curDrawBatch.bindingLayout = null;

        // reset current render state to null
        this._currMaterial = this._emptyMaterial;
        this._currTexView = null;
        this._currSampler = null;

        this._batches.push(curDrawBatch);
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
    public commitStaticBatch (comp: UIStaticBatchComponent) {
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
    public autoMergeBatches () {
        const mat = this._currMaterial;
        const buffer = this._currMeshBuffer!;
        const indicsStart = buffer.indicesStart;
        const vCount = buffer.indicesOffset - indicsStart;
        if (!vCount || !mat) {
            return;
        }

        const uiCanvas = this._currCanvas;

        StencilManager.sharedManager!.handleMaterial(mat);

        const curDrawBatch = this._currStaticRoot ? this._currStaticRoot._requireDrawBatch() : this._drawBatchPool.alloc();
        curDrawBatch.camera = uiCanvas && uiCanvas.camera;
        curDrawBatch.bufferBatch = buffer;
        curDrawBatch.material = mat;
        curDrawBatch.texView = this._currTexView!;
        curDrawBatch.sampler = this._currSampler;
        curDrawBatch.firstIdx = indicsStart;
        curDrawBatch.idxCount = vCount;

        curDrawBatch.pipelineState = this._getUIMaterial(mat).getPipelineState();
        curDrawBatch.bindingLayout = curDrawBatch.pipelineState!.pipelineLayout.layouts[0];

        this._batches.push(curDrawBatch);

        buffer.vertexStart = buffer.vertexOffset;
        buffer.indicesStart = buffer.indicesOffset;
        buffer.byteStart = buffer.byteOffset;
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
    public forceMergeBatches (material: Material, sprite: GFXTextureView | null) {
        this._currMaterial = material;
        this._currTexView = sprite;
        this.autoMergeBatches();
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
        this._currTexView = null;
    }

    private _destroyUIMaterials () {
        const matIter = this._uiMaterials.values();
        let result = matIter.next();
        while (!result.done) {
            const uiMat = result.value;
            uiMat.destroy();
            result = matIter.next();
        }
        this._uiMaterials.clear();
    }

    private _walk (node: Node, level = 0) {
        const len = node.children.length;

        const parentOpacity = this._parentOpacity;
        this._parentOpacity *= node._uiProps.opacity;
        this._preprocess(node);
        if (len > 0 && !node._static) {
            const children = node.children;
            for (let i = 0; i < children.length; ++i) {
                const child = children[i];
                this._walk(child, level);
            }
        }

        this._postprocess(node);
        this._parentOpacity = parentOpacity;

        level += 1;
    }

    private _renderScreens () {
        const screens = this._screens;
        for (let i = 0; i < screens.length; ++i) {
            const screen = screens[i];
            if (!screen.enabledInHierarchy) {
                continue;
            }

            this._currCanvas = screen;
            this._recursiveScreenNode(screen.node);
        }
    }

    private _preprocess (c: Node) {
        if (!c._uiProps.uiTransformComp) {
            return;
        }

        // parent changed can flush child visibility
        c._uiProps.uiTransformComp._canvas = this._currCanvas;
        const render = c._uiProps.uiComp;
        if (render && render.enabledInHierarchy) {
            render.updateAssembler(this);
        }
    }

    private _postprocess (c: Node) {
        const render = c._uiProps.uiComp;
        if (render && render.enabledInHierarchy) {
            render.postUpdateAssembler(this);
        }
    }

    private _recursiveScreenNode (screen: Node) {
        this._walk(screen);

        this.autoMergeBatches();
    }

    private _reset () {
        for (let i = 0; i < this._batches.length; ++i) {
            const batch = this._batches.array[i];
            if (batch.isStatic) {
                continue;
            }

            batch.clear(this);
            this._drawBatchPool.free(batch);
        }

        this._parentOpacity = 1;
        this._batches.clear();
        this._currMaterial = this._emptyMaterial;
        this._currCanvas = null;
        this._currTexView = null;
        this._currSampler = null;
        this._meshBufferUseCount = 0;
        this._requireBufferBatch();
        StencilManager.sharedManager!.reset();
    }

    private _createMeshBuffer (): MeshBuffer {
        const batch = this._bufferBatchPool.add();
        batch.initialize(this._attributes, this._requireBufferBatch.bind(this));
        this._meshBuffers.push(batch);
        return batch;
    }

    private _requireBufferBatch () {
        if (this._meshBufferUseCount >= this._meshBuffers.length) {
            this._currMeshBuffer = this._createMeshBuffer();
        } else {
            this._currMeshBuffer = this._meshBuffers[this._meshBufferUseCount];
        }

        this._meshBufferUseCount++;
        if (arguments.length === 2) {
            this._currMeshBuffer.request(arguments[0], arguments[1]);
        }
    }

    private _screenSort (a: CanvasComponent, b: CanvasComponent) {
        const delta = a.priority - b.priority;
        return delta === 0 ? a.node.getSiblingIndex() - b.node.getSiblingIndex() : delta;
    }

    private _applyOpacity (comp: UIRenderComponent) {
        const color = comp.color.a / 255;
        const opacity = (this._parentOpacity = this._parentOpacity * color);
        const byteOffset = this._currMeshBuffer!.byteOffset >> 2;
        const vbuf = this._currMeshBuffer!.vData!;
        const lastByteOffset = this._currMeshBuffer!.lastByteOffset >> 2;
        for (let i = lastByteOffset; i < byteOffset; i += 9) {
            vbuf[i + MeshBuffer.OPACITY_OFFSET] = opacity;
        }

        this._currMeshBuffer!.lastByteOffset = this._currMeshBuffer!.byteOffset;
    }
}
