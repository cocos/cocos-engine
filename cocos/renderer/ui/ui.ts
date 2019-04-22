
import { Material } from '../../3d/assets/material';
import { RenderableComponent } from '../../3d/framework/renderable-component';
import Pool from '../../3d/memop/pool';
import RecyclePool from '../../3d/memop/recycle-pool';
import { IAssembler } from '../../3d/ui/assembler/assembler';
import { StencilManager } from '../../3d/ui/assembler/mask/stencil-manager';
import { CanvasComponent } from '../../3d/ui/components/canvas-component';
import { UIComponent } from '../../3d/ui/components/ui-component';
import { UIRenderComponent } from '../../3d/ui/components/ui-render-component';
import { MeshBuffer } from '../../3d/ui/mesh-buffer';
import { SpriteFrame } from '../../assets/sprite-frame';
import { CachedArray } from '../../core/memop/cached-array';
import { Root } from '../../core/root';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { GFXTextureView } from '../../gfx/texture-view';
import { vfmt } from '../../gfx/vertex-format-sample';
import { Node } from '../../scene-graph/node';
import { Camera } from '../scene/camera';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';
import { UIBatchModel } from './ui-batch-model';
import { UIMaterial } from './ui-material';

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

export class UI {

    get renderScene (): RenderScene {
        return this._scene;
    }

    get currBufferBatch () {
        return this._currMeshBuffer;
    }

    get debugScreen (){
        return this._debugScreen;
    }

    set debugScreen (value){
        this._debugScreen = value;
        if (this._debugScreen){
            const screen = this.getScreen(this._debugScreen.visibility);
            if (screen) {
                this.removeScreen(screen.visibility);
            }
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
    private _sortChildList: Pool<any[]> = new Pool(() => {
        return [];
    }, 128);
    private _uiModelPool: Pool<UIBatchModel> | null = null;
    private _modelInUse: CachedArray<UIBatchModel>;
    // batcher
    private _emptyMaterial = Material.getInstantiatedMaterial(new Material(), new RenderableComponent(), CC_EDITOR ? true : false);
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

        this._attributes = vfmt;

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

        for (const uiMat of this._uiMaterials.values()) {
            uiMat.destroy();
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

    public addScreen (comp: CanvasComponent) {
        this._screens.push(comp);
        if (comp.camera) {
            comp.camera.view.visibility = this._screens.length;
        }
    }

    public getScreen (visibility: number) {
        for (const screen of this._screens) {
            if (screen.camera) {
                if (screen.camera.view.visibility === visibility) {
                    return screen;
                }
            }
        }

        return null;
    }

    public removeScreen (comp: CanvasComponent) {
        const idx = this._screens.indexOf(comp);
        if (idx === -1) {
            return;
        }

        this._screens.splice(idx, 1);

        let camera: Camera | null;
        for (let i = idx; i < this._screens.length;) {
            camera = this._screens[i].camera;
            if (camera) {
                camera.view.visibility = ++i;
            }
        }
    }

    public update (dt: number) {
        this._renderScreens();

        // update buffers
        if (this._batches.length > 0) {
            for (const bufferBatch of this._meshBuffers) {
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
                    bindingLayout.bindTextureView(0, batch.texView!);
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

    public commitComp (comp: UIComponent, frame: GFXTextureView | null, assembler: IAssembler) {
        if (comp instanceof UIRenderComponent) {
            const renderComp = comp as UIRenderComponent;
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

            assembler.fillBuffers(renderComp, this);
        } else {
            // if the last comp is spriteComp, previous comps should be batched.
            if (this._currMaterial !== this._emptyMaterial) {
                this.autoMergeBatches();
            }
            const uiCanvas = this.getScreen(comp.visibility);
            const curDrawBatch = this._drawBatchPool.alloc();
            curDrawBatch.camera = uiCanvas && uiCanvas.camera;
            curDrawBatch.model = (comp as any).modelComponent._model;
            curDrawBatch.bufferBatch = null;
            curDrawBatch.material = null;
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
    }

    public autoMergeBatches (){
        const mat = this._currMaterial;
        const buffer = this._currMeshBuffer!;
        const indicsStart = buffer.indiceStart;
        const vCount = this._currMeshBuffer!.indiceOffset - indicsStart;
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

    public forceMergeBatches (material: Material, sprite: SpriteFrame | null) {
        this._currMaterial = material;
        this._currTexView = sprite && sprite.getGFXTextureView();
        this.autoMergeBatches();
    }

    private _deleteUIMaterial (mat: Material) {
        if (this._uiMaterials.has(mat.hash)) {
            this._uiMaterials.get(mat.hash)!.destroy();
            this._uiMaterials.delete(mat.hash);
        }
    }

    private _destroyUIMaterials () {
        for (const uiMat of this._uiMaterials.values()) {
            uiMat.destroy();
        }
        this._uiMaterials.clear();
    }

    private _walk (node: Node, fn1: (node: Node) => void, fn2: (node: Node) => void, level = 0) {
        let resortNodeList;

        const len = node.childrenCount;

        fn1(node);
        if (len > 0) {
            resortNodeList = this._defineNodeOrder(node);
            for (const comp of resortNodeList) {
                this._walk(comp, fn1, fn2, level);
            }

            this._sortChildList.free(resortNodeList);
        }

        fn2(node);
        level += 1;
    }

    private _defineNodeOrder (node: Node) {
        let sortList: any[] = this._sortChildList.alloc();
        sortList = node.children.slice();

        sortList.sort((a, b) => {
            const ca = a.getComponent(UIComponent);
            const cb = b.getComponent(UIComponent);
            if (ca && cb) {
                return -(ca.priority - cb.priority);
            }
            else if (!ca) {
                return 1;
            } else {
                return -1;
            }
        });

        return sortList;
    }

    private _renderScreens () {
        for (const screen of this._screens) {
            if (!screen.enabledInHierarchy) {
                continue;
            }

            this._recursiveScreenNode(screen.node);
            this.autoMergeBatches();
        }

        if (!CC_EDITOR && this._debugScreen && this._debugScreen.enabledInHierarchy) {
            this._recursiveScreenNode(this._debugScreen.node);
            this.autoMergeBatches();
        }
    }

    private _recursiveScreenNode (screen: Node) {
        this._walk(screen, (c: Node) => {
            const render = c.getComponent(UIComponent);
            if (render && render.enabledInHierarchy) {
                render.updateAssembler(this);
            }
        }, (c: Node) => {
            const render = c.getComponent(UIComponent);
            if (render && render.enabledInHierarchy) {
                render.postUpdateAssembler(this);
            }
        });
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
