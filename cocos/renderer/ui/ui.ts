/**
 * @hidden
 */

import { CanvasComponent, MeshBuffer, StencilManager, UIComponent, UIRenderComponent, UIVertexFormat } from '../../3d/ui';
import { Material } from '../../3d/assets/material';
import Pool from '../../3d/memop/pool';
import RecyclePool from '../../3d/memop/recycle-pool';
import { CachedArray } from '../../core/memop/cached-array';
import { Root } from '../../core/root';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType  } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { GFXTextureView } from '../../gfx/texture-view';
import { UniformBinding } from '../../pipeline/define';
import { Camera } from '../scene/camera';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';
import { UIBatchModel } from './ui-batch-model';
import { UIMaterial } from './ui-material';
import { INode } from '../../core/utils/interfaces';

export class UIDrawBatch {
    public camera: Camera | null = null;
    public bufferBatch: MeshBuffer | null = null;
    public model: Model | null = null;
    public material: Material | null = null;
    public texView: GFXTextureView | null = null;
    public firstIdx: number = 0;
    public idxCount: number = 0;
    public pipelineState: GFXPipelineState | null = null;
    public bindingLayout: GFXBindingLayout | null = null;
    public useLocalData: INode | null = null;

    public destroy (ui: UI) {
        if (this.pipelineState) {
            ui._getUIMaterial(this.material!).revertPipelineState(this.pipelineState);
            this.pipelineState = null;
        }

        if (this.bindingLayout) {
            this.bindingLayout = null;
        }
    }

    public clear (ui: UI) {
        if (this.pipelineState) {
            ui._getUIMaterial(this.material!).revertPipelineState(this.pipelineState);
            this.pipelineState = null;
        }
        this.camera = null;
        this.bufferBatch = null;
        this.material = null;
        this.texView = null;
        this.firstIdx = 0;
        this.idxCount = 0;
        this.model = null;
    }
}

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

    get debugScreen () {
        return this._debugScreen;
    }

    set debugScreen (value){
        this._debugScreen = value;
        if (this._debugScreen && this._debugScreen.camera ) {
            this._debugScreen.camera.view.visibility = this._screens.length + 1;
        }
    }

    public device: GFXDevice;
    private _screens: CanvasComponent[] = [];
    private _debugScreen: CanvasComponent | null = null;
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
    private _batches: CachedArray<UIDrawBatch>;
    private _uiModelPool: Pool<UIBatchModel> | null = null;
    private _modelInUse: CachedArray<UIBatchModel>;
    // batcher
    private _emptyMaterial = Material.getInstantiatedMaterial(new Material(), new cc.RenderableComponent(), CC_EDITOR ? true : false);
    private _currMeshBuffer: MeshBuffer | null = null;
    private _currMaterial: Material = this._emptyMaterial;
    private _currTexView: GFXTextureView | null = null;
    private _currCanvas = -1;

    constructor (private _root: Root) {
        this.device = _root.device;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });
        this._uiModelPool = new Pool(() => this._scene.createModel<UIBatchModel>(UIBatchModel, null!), 2);
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
        if (this._uiMaterials.has(hash)){
            this._uiMaterials.delete(hash);
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
            comp.camera.view.visibility = this._screens.length;
        }

        if (this._debugScreen && this._debugScreen.camera) {
            this._debugScreen.camera.view.visibility = this._screens.length + 1;
        }
    }

    /**
     * @zh
     * 通过屏幕编号获得屏幕组件。
     *
     * @param visibility - 屏幕编号。
     */
    public getScreen (visibility: number) {
        let screens = this._screens;
        for (let i = 0; i < screens.length; ++i) {
            let screen = screens[i];
            if (screen.camera) {
                if (screen.camera.view.visibility === visibility) {
                    return screen;
                }
            }
        }

        if (this._debugScreen && this._debugScreen.camera && this._debugScreen.camera.view.visibility === visibility) {
            return this._debugScreen;
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
        if (this._debugScreen && this._debugScreen.camera ) {
            this._debugScreen.camera.view.visibility = this._screens.length + 1;
        }

        let camera: Camera | null;
        for (let i = idx; i < this._screens.length; i++) {
            camera = this._screens[i].camera;
            if (camera) {
                camera.view.visibility = i;
            }
        }
    }

    public update (dt: number) {
        this._renderScreens();

        // update buffers
        if (this._batches.length > 0) {
            let buffers = this._meshBuffers;
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
                        batch.model.viewID = batch.camera.view.visibility;
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
                        uiModel.viewID = batch.camera.view.visibility;
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
    public commitComp (comp: UIRenderComponent, frame: GFXTextureView | null = null, assembler?: any) {
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

        const curDrawBatch = this._drawBatchPool.alloc();
        curDrawBatch.camera = uiCanvas && uiCanvas.camera;
        curDrawBatch.bufferBatch = this._currMeshBuffer;
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
            console.log('111111111');
            const uiMat = result.value;
            uiMat.destroy();
            result = matIter.next();
        }
        this._uiMaterials.clear();
    }

    private _walk (node: INode, level = 0) {
        const len = node.childrenCount;

        this._preprocess(node);
        if (len > 0) {
            let children = node.children;
            for (let i = 0; i < children.length; ++i) {
                let child = children[i];
                this._walk(child, level);
            }
        }

        this._postprocess(node);
        level += 1;
    }

    private _renderScreens () {
        let screens = this._screens;
        for (let i = 0; i < screens.length; ++i) {
            let screen = screens[i];
            if (!screen.enabledInHierarchy) {
                continue;
            }

            this._recursiveScreenNode(screen.node);
        }

        if (!CC_EDITOR && this._debugScreen && this._debugScreen.enabledInHierarchy) {
            this._recursiveScreenNode(this._debugScreen.node);
        }
    }

    private _preprocess (c: INode) {
        // ts-ignore
        let render = c._uiComp;
        if (render && render.enabledInHierarchy) {
            render.updateAssembler(this);
        }
    }

    private _postprocess (c: INode) {
        let render = c._uiComp;
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
}
