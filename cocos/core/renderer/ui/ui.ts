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

import { Material } from '../../assets/material';
import { CanvasComponent, UIComponent, UIRenderComponent } from '../../components/ui-base';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType  } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { GFXTextureView } from '../../gfx/texture-view';
import { Pool, RecyclePool } from '../../memop';
import { CachedArray } from '../../memop/cached-array';
import { UniformBinding, CameraDefaultMask } from '../../pipeline/define';
import { Camera } from '../../renderer/scene/camera';
import { Model } from '../../renderer/scene/model';
import { RenderScene } from '../../renderer/scene/render-scene';
import { Root } from '../../root';
import { Layers } from '../../scene-graph';
import { INode } from '../../utils/interfaces';
import { MeshBuffer } from './mesh-buffer';
import { StencilManager } from './stencil-manager';
import { UIBatchModel } from './ui-batch-model';
import { UIMaterial } from './ui-material';
import * as UIVertexFormat from './ui-vertex-format';
import { UIStaticBatchComponent } from '../../../ui';
import { UIDrawBatch } from './ui-draw-batch';

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
        if(!value){
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
    private _currCanvas = -1;
    private _currMeshBuffer: MeshBuffer | null = null;
    private _currStaticRoot: UIStaticBatchComponent | null = null;

    constructor (private _root: Root) {
        this.device = _root.device;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });
        this._uiModelPool = new Pool(() => {
            const model = this._scene.createModel<UIBatchModel>(UIBatchModel, null!);
            model.visFlags |= Layers.Enum.UI_3D;
            return model;
        }, 2);
        this._modelInUse = new CachedArray<UIBatchModel>(10);
        this._batches = new CachedArray(64);

        cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this.update, this);
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
        this._destroyUIMaterials();

        for (const batch of this._batches.array) {
            batch.destroy(this);
        }

        for (const buffBatch of this._meshBuffers) {
            buffBatch.destroy();
        }
        this._meshBuffers.splice(0);

        const matIter = this._uiMaterials.values();
        let result = matIter.next();
        while (!result.done) {
            const uiMat = result.value;
            uiMat.destroy();
            result = matIter.next();
        }

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

    public _removeUIMaterial (hash: number){
        if (this._uiMaterials.has(hash)) {
            if (this._uiMaterials.get(hash)!.decrease() === 0) {
                this._uiMaterials.delete(hash);
            }
        }
    }

    /**
     * @zh
     * 添加屏幕组件管理。
     *
     * @param comp - 屏幕组件。
     */
    public addScreen (comp: CanvasComponent) {
        this._screens.push(comp);
        if (comp.camera) {
            comp.camera.view.visibility = Layers.BitMask.UI_2D | this._screens.length;
            this._canvasMaterials.set(comp.camera.view.visibility, new Map<number, number>());
        }

        this._screens.sort(this._screenSort);
    }

    /**
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
     * 移除屏幕组件管理。
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
            const matHashInter = this._canvasMaterials.get(comp.camera.view.visibility)!.keys();
            let matHash = matHashInter.next();
            while (!matHash.done) {
                this._removeUIMaterial(matHash.value);
                matHash = matHashInter.next();
            }
        }

        let camera: Camera | null;
        for (let i = idx; i < this._screens.length; i++) {
            camera = this._screens[i].camera;
            if (camera) {
                const matRecord = this._canvasMaterials.get(camera.view.visibility)!;
                camera.view.visibility = Layers.BitMask.UI_2D | (i + 1);
                this._canvasMaterials.set(camera.view.visibility, matRecord);
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

    public render () {

        let batchPriority = 0;

        for (let i = 0; i < this._modelInUse.length; i++) {
            this._modelInUse.get(i).enabled = false;
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
                    bindingLayout.update();

                    const ia = batch.bufferBatch!.ia!;
                    ia.firstIndex = batch.firstIdx;
                    ia.indexCount = batch.idxCount;

                    const uiModel = this._uiModelPool!.alloc();
                    uiModel.initialize(ia, batch);
                    uiModel.enabled = true;
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
     * @zh
     * UI 渲染组件数据提交流程（针对顶点数据都是世界坐标下的提交流程，例如：除 graphics 和 uimodel 的大部分 ui 组件）。
     * 此处的数据最终会生成需要提交渲染的 model 数据。
     *
     * @param comp - 当前执行组件。
     * @param frame - 当前执行组件贴图。
     * @param assembler - 当前组件渲染数据组装器。
     */
    public commitComp (comp: UIRenderComponent, frame: GFXTextureView | null = null, assembler: any) {
        const renderComp = comp;
        const texView = frame;
        if (this._currMaterial.hash !== renderComp.material!.hash ||
            this._currTexView !== texView ||
            this._currCanvas !== renderComp.visibility
        ) {
            this.autoMergeBatches();
            this._currMaterial = renderComp.material!;
            this._currTexView = texView;
            this._currCanvas = renderComp.visibility;
        }

        if (assembler) {
            assembler.fillBuffers(renderComp, this);
        }
    }

    /**
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

        if (mat){
            const rebuild = StencilManager.sharedManager!.handleMaterial(mat);
            if (rebuild && model){
                for (let i = 0; i < model.subModelNum; i++) {
                    model.setSubModelMaterial(i, mat);
                }
            }
        }

        const uiCanvas = this.getScreen(comp.visibility);
        const curDrawBatch = this._drawBatchPool.alloc();
        curDrawBatch.camera = uiCanvas && uiCanvas.camera;
        curDrawBatch.model = model;
        curDrawBatch.bufferBatch = null;
        curDrawBatch.material = mat;
        curDrawBatch.texView = null;
        curDrawBatch.firstIdx = 0;
        curDrawBatch.idxCount = 0;

        curDrawBatch.pipelineState = null;
        curDrawBatch.bindingLayout = null;

        // reset current render state to null
        this._currMaterial = this._emptyMaterial;
        this._currTexView = null;
        this._currCanvas = comp.visibility;

        this._batches.push(curDrawBatch);
    }

    public commitStaticBatch (comp: UIStaticBatchComponent) {
        this._batches.append(comp.drawBatchList);
        this.finishMergeBatches();
    }

    /**
     * @zh
     * UI 渲染数据合批
     */
    public autoMergeBatches (){
        const mat = this._currMaterial;
        const buffer = this._currMeshBuffer!;
        const indicsStart = buffer.indiceStart;
        const vCount = buffer.indiceOffset - indicsStart;
        if (!vCount || !mat){
            return;
        }

        const uiCanvas = this.getScreen(this._currCanvas);

        StencilManager.sharedManager!.handleMaterial(mat);

        const curDrawBatch = this._currStaticRoot ? this._currStaticRoot.requireDrawBatch(): this._drawBatchPool.alloc();
        curDrawBatch.camera = uiCanvas && uiCanvas.camera;
        curDrawBatch.bufferBatch = buffer;
        curDrawBatch.material = mat;
        curDrawBatch.texView = this._currTexView!;
        curDrawBatch.firstIdx = indicsStart;
        curDrawBatch.idxCount = vCount;

        curDrawBatch.pipelineState = this._getUIMaterial(mat).getPipelineState();
        curDrawBatch.bindingLayout = curDrawBatch.pipelineState!.pipelineLayout.layouts[0];

        this._batches.push(curDrawBatch);

        buffer.vertexStart = buffer.vertexOffset;
        buffer.indiceStart = buffer.indiceOffset;
        buffer.byteStart = buffer.byteOffset;
    }

    /**
     * @zh
     * 跳过默认合批操作，执行强制合批。
     *
     * @param material - 当前批次的材质。
     * @param sprite - 当前批次的精灵帧。
     */
    public forceMergeBatches (material: Material, sprite: GFXTextureView | null) {
        this._currMaterial = material;
        this._currTexView = sprite;
        this.autoMergeBatches();
    }

    public finishMergeBatches (){
        this.autoMergeBatches();
        this._currMaterial = this._emptyMaterial;
        this._currTexView = null;
    }

    private _deleteUIMaterial (mat: Material) {
        if (this._uiMaterials.has(mat.hash)) {
            this._uiMaterials.get(mat.hash)!.destroy();
            this._uiMaterials.delete(mat.hash);
        }
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

    private _walk (node: INode, level = 0) {
        const len = node.children.length;

        this._preprocess(node);
        if (len > 0 && !node._static) {
            const children = node.children;
            for (let i = 0; i < children.length; ++i) {
                const child = children[i];
                this._walk(child, level);
            }
        }

        this._postprocess(node);
        level += 1;
    }

    private _renderScreens () {
        const screens = this._screens;
        for (let i = 0; i < screens.length; ++i) {
            const screen = screens[i];
            if (!screen.enabledInHierarchy) {
                continue;
            }

            this._recursiveScreenNode(screen.node);
        }
    }

    private _preprocess (c: INode) {
        const render = c._uiComp;
        if (render && render.enabledInHierarchy) {
            render.updateAssembler(this);
        }
    }

    private _postprocess (c: INode) {
        const render = c._uiComp;
        if (render && render.enabledInHierarchy) {
            render.postUpdateAssembler(this);
        }
    }

    private _recursiveScreenNode (screen: INode) {
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

        this._batches.clear();
        this._currMaterial = this._emptyMaterial;
        this._currCanvas = -1;
        this._currTexView = null;
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

    private _requireBufferBatch (){
        if (this._meshBufferUseCount >= this._meshBuffers.length) {
            this._currMeshBuffer = this._createMeshBuffer();
        } else {
            this._currMeshBuffer = this._meshBuffers[this._meshBufferUseCount];
        }

        this._meshBufferUseCount++;
        if (arguments.length === 2){
            this._currMeshBuffer.request(arguments[0], arguments[1]);
        }
    }

    private _screenSort (a: CanvasComponent, b: CanvasComponent){
        return a.priority - b.priority;
    }
}
