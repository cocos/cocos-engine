
import { Material } from '../../3d/assets/material';
import { RenderableComponent } from '../../3d/framework/renderable-component';
import Pool from '../../3d/memop/pool';
import RecyclePool from '../../3d/memop/recycle-pool';
import { IAssembler } from '../../3d/ui/assembler/assembler';
import { StencilManager } from '../../3d/ui/assembler/mask/stencil-manager';
import { CanvasComponent } from '../../3d/ui/components/canvas-component';
import { UIRenderComponent } from '../../3d/ui/components/ui-render-component';
import { MeshBuffer } from '../../3d/ui/mesh-buffer';
// import { UIBufferBatch } from '../../3d/ui/UIBufferBatch';
import { SpriteFrame } from '../../assets/CCSpriteFrame';
import { CachedArray } from '../../core/memop/cached-array';
import { Root } from '../../core/root';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXBuffer, IGFXBufferInfo } from '../../gfx/buffer';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import {
    GFXBufferUsageBit,
    GFXClearFlag,
    GFXCommandBufferType,
    GFXFormat,
    GFXMemoryUsageBit,
    GFXType,
    IGFXRect,
} from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler, IGFXInputAttribute } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { GFXUniformBlock } from '../../gfx/shader';
import { GFXTextureView } from '../../gfx/texture-view';
import { vfmt } from '../../gfx/vertex-format-sample';
import { UBOUI } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { Camera } from '../scene/camera';
import { RenderScene } from '../scene/render-scene';
import { UIBatchModel } from './ui-batch-model';
import { IUIMaterialInfo, UIMaterial } from './ui-material';

const _mat4Array = new Float32Array(16);

// export class UIBufferBatch {
//     public vf32: Float32Array | null = null;
//     public vui16: Uint16Array | null = null;
//     public vb: GFXBuffer | null = null;
//     public ib: GFXBuffer | null = null;
//     public ia: GFXInputAssembler | null = null;
//     public vbCount: number = 0;
//     public vbSize: number = 0;
//     public ibCount: number = 0;
//     public ibSize: number = 0;
// }

export class UIDrawBatch {
    public camera: Camera | null = null;
    public bufferBatch: MeshBuffer | null = null;
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
    }
}

// export interface IUIRenderData {
//     meshBuffer: MeshBuffer;
//     material: Material;
//     texture: SpriteFrame;
//     priority: number;
// }
// export interface IUICanvas {
//     camera: Camera;
//     datas: IUIRenderData[];
// }

export class UI {

    get renderScene (): RenderScene {
        return this._scene;
    }

    get currBufferBatch () {
        return this._currMeshBuffer;
    }
    public device: GFXDevice;
    // private _commitUIRenderDataPool: RecyclePool = new RecyclePool(() => {
    //     return new Object() as IUIRenderData;
    // }, 128);

    private _screens: CanvasComponent[] = [];
    // private _bufferPool: RecyclePool<MeshBuffer> = new RecyclePool(() => {
    //     return new MeshBuffer();
    // }, 128);
    private _bufferBatchPool: RecyclePool<MeshBuffer> = new RecyclePool(() => {
        return new MeshBuffer(this);
    }, 128);
    private _drawBatchPool: Pool<UIDrawBatch> = new Pool(() => {
        return new UIDrawBatch();
    }, 128);
    private _cmdBuff: GFXCommandBuffer | null = null;
    // private _renderArea: IGFXRect = { x: 0, y: 0, width: 0, height: 0 };
    private _scene: RenderScene;
    // private _cameraNode: Node;
    // private _camera: Camera;
    private _attributes: IGFXInputAttribute[] = [];
    // private _vertStride = 0;
    // private _vertF32Count = 0;
    private _meshBuffers: MeshBuffer[] = [];
    private _meshBufferUseCount = 0;
    // private _uiMaterial: UIMaterial | null = null;
    private _uiMaterials: Map<number, UIMaterial> = new Map<number, UIMaterial>();
    private _uboUI: UBOUI = new UBOUI();
    private _uiUBO: GFXBuffer | null = null;
    private _batches: CachedArray<UIDrawBatch>;
    // private _bufferInitData: IMeshBufferInitData | null = null;
    // private _commitUIRenderDatas: IUIRenderData[] = [];
    // private _commitUICanvas: IUICanvas[] = [];
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
        if (CC_EDITOR) {
            cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, (scene) => {
                this._scene = scene.renderScene;
                // the models will be destroyed in renderScene
                this._modelInUse.clear();
                this._uiModelPool = new Pool(() => this._scene.createModel<UIBatchModel>(UIBatchModel, null), 2);
            });
        } else {
            this._scene = this._root.createScene({
                name: 'GUIScene',
            });
            this._uiModelPool = new Pool(() => this._scene.createModel<UIBatchModel>(UIBatchModel, null), 2);
        }
        this._modelInUse = new CachedArray<UIBatchModel>(10);
        this._batches = new CachedArray(64);
        // this._bufferInitData = {
        //     vertexCount: 0,
        //     indiceCount: 0,
        //     attributes: vfmt,
        // };

        // this._vertF32Count = 9;
        // this._vertStride = this._vertF32Count * 4;

        cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this.update, this);
    }

    public initialize () {

        this._attributes = vfmt;

        this._requireBufferBatch();

        this._cmdBuff = this.device.createCommandBuffer({
            allocator: this.device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        // this._uiMaterial = this.createUIMaterial({ material: builtinResMgr.get<Material>('sprite-material') });

        this._uiUBO = this.device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOUI.SIZE,
        });

        return true;
    }

    public destroy () {
        this._destroyUIMaterials();

        if (this._uiUBO) {
            this._uiUBO.destroy();
            this._uiUBO = null;
        }

        for (const batch of this._batches.array) {
            batch.destroy(this);
        }

        for (const buffBatch of this._meshBuffers) {
            buffBatch.destroy();
            // buffBatch.vb!.destroy();
            // buffBatch.ib!.destroy();
            // buffBatch.ia!.destroy();
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

    // public resize (width: number, height: number) {
    //     this._camera.orthoHeight = height;

    //     let cameraPos =  this._camera.node.getWorldPosition();
    //     cameraPos.x = width * 0.5;
    //     cameraPos.y = height * 0.5;
    //     cameraPos.z = 1000.0;
    //     this._camera.node.setPosition(cameraPos);
    //     this._camera.update();
    // }

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

    public addScreen (comp) {
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

    public removeScreen (comp) {
        const idx = this._screens.indexOf(comp);
        if (idx !== -1) {
            this._screens.splice(idx, 1);
        }

        let camera;
        for (let i = idx; i < this._screens.length;) {
            camera = this._screens[i].camera;
            if (camera) {
                camera.view.visibility = ++i;
            }
        }
    }

    // public createBuffer (vertexCount: number, indiceCount: number) {
    //     const buffer = this._bufferPool.add();
    //     this._bufferInitData!.vertexCount = vertexCount;
    //     this._bufferInitData!.indiceCount = indiceCount;
    //     buffer.initialize(this._bufferInitData as IMeshBufferInitData);
    //     return buffer;
    // }

    // public createUIRenderData () {
    //     return this._commitUIRenderDataPool.add();
    // }

    public update (dt: number) {
        this._reset();
        this._renderScreens();

        // Merge batch
        // if (this._commitUIRenderDatas.length) {
        // this.mergeBatches();

        // update buffers
        if (this._batches.length > 0) {
            for (const bufferBatch of this._meshBuffers) {
                bufferBatch.uploadData();
                bufferBatch.reset();
                // if (bufferBatch.vbSize > bufferBatch.vb!.size) {
                //     bufferBatch.vb!.resize(bufferBatch.vbSize);
                // }
                // bufferBatch.vb!.update(bufferBatch.vf32!);

                // if (bufferBatch.ibSize > bufferBatch.ib!.size) {
                //     bufferBatch.ib!.resize(bufferBatch.ibSize);
                // }
                // bufferBatch.ib!.update(bufferBatch.vui16!);
            }
        }

        this.render();
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

    public commitComp (comp: UIRenderComponent, frame: SpriteFrame | null, assembler: IAssembler) {
        const texView = frame && frame.getGFXTextureView();
        if (this._currMaterial.hash !== comp.material!.hash ||
            this._currTexView !== texView ||
            this._currCanvas !== comp.visibility
        ) {
            this.autoMergeBatches();
            this._currMaterial  = comp.material!;
            this._currTexView = texView;
            this._currCanvas = comp.visibility;
        }

        assembler.fillBuffers(comp, this);
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
    }

    public forceMergeBatches (material: Material, sprite: SpriteFrame | null) {
        this._currMaterial = material;
        this._currTexView = sprite && sprite.getGFXTextureView();
        this.autoMergeBatches();
    }

    // public commitComp (comp: UIRenderComponent) {
    //     const assembler = comp.updateAssembler(this);
    //     // this.flushBatches(comp, comp.spriteFrame ? comp.spriteFrame : null);
    //     // const canvasComp: CanvasComponent | null = this.getScreen(comp.viewID);

    //     // const renderDataFormat: IUIRenderData = this._commitUIRenderDataPool.add();
    //     // renderDataFormat.meshBuffer = buffer;
    //     // renderDataFormat.material = comp.material as Material;
    //     // renderDataFormat.camera = canvasComp!.camera!;
    // }

    // private mergeBatches () {
    //     let curTexView: GFXTextureView | null = null;
    //     let curMaterialHash: number = 0;
    //     let curMaterial: Material | null = null;
    //     let bufferBatchIdx = 0;
    //     let curBufferBatch: UIBufferBatch = this._bufferBatches[bufferBatchIdx++];
    //     let firstIdx = 0;
    //     let idxCount = 0;
    //     let vertCount = 0;

    //     let vf32: Float32Array;
    //     let vui16: Uint16Array;
    //     let vCount = 0;
    //     let vbSize = 0;
    //     let ibSize = 0;
    //     let curDrawBatch: UIDrawBatch | null = null;

    //     let index = 0;
    //     let len = 0;
    //     let isEnding = false;
    //     let textureView: GFXTextureView | null = null;

    //     for (const uiCanvas of this._commitUICanvas) {

    //         index = 0;
    //         len = uiCanvas.datas.length;

    //         for (const uiRenderData of uiCanvas.datas) {
    //             index++;

    //             if (idxCount + uiRenderData.meshBuffer.vData!.length > 65535) {
    //                 if (bufferBatchIdx >= this._bufferBatches.length) {
    //                     this.createBufferBatch();
    //                 }

    //                 curBufferBatch = this._bufferBatches[bufferBatchIdx++];
    //                 firstIdx = 0;
    //                 idxCount = 0;
    //                 vertCount = 0;
    //                 // isNewBatch = true;
    //             }

    //             // merge vertices
    //             vf32 = uiRenderData.meshBuffer.vData!;
    //             vCount = (vf32.length / this._vertF32Count);
    //             vbSize = (vCount + vertCount) * this._vertStride;
    //             if (vbSize > curBufferBatch.vbSize) {
    //                 curBufferBatch.vbCount = vCount + vertCount;
    //                 curBufferBatch.vbSize = vbSize;

    //                 const lastVF32 = curBufferBatch.vf32;
    //                 curBufferBatch.vf32 = new Float32Array(curBufferBatch.vbCount * this._vertF32Count);
    //                 if (lastVF32) {
    //                     curBufferBatch.vf32.set(lastVF32!, 0);
    //                 }
    //             }

    //             curBufferBatch.vf32!.set(vf32, vertCount * this._vertF32Count);

    //             // merge indices
    //             vui16 = uiRenderData.meshBuffer.iData!;
    //             ibSize = (vui16.length + idxCount) * 2;
    //             if (ibSize > curBufferBatch.ibSize) {
    //                 curBufferBatch.ibCount = vui16.length + idxCount;
    //                 curBufferBatch.ibSize = ibSize;

    //                 const lastVUI16 = curBufferBatch.vui16!;
    //                 curBufferBatch.vui16 = new Uint16Array(curBufferBatch.ibCount);
    //                 if (lastVUI16) {
    //                     curBufferBatch.vui16.set(lastVUI16, 0);
    //                 }
    //             }

    //             for (let n = 0; n < vui16.length; ++n) {
    //                 curBufferBatch.vui16![idxCount + n] = vui16[n] + vertCount;
    //             }

    //             textureView = uiRenderData.texture && uiRenderData.texture.getGFXTextureView();
    //             if (curMaterialHash !== uiRenderData.material.hash ||
    //                 curTexView !== textureView) {
    //                 if (curTexView) {
    //                     curDrawBatch = this._drawBatchPool.alloc();
    //                     curDrawBatch.camera = uiCanvas.camera;
    //                     curDrawBatch.bufferBatch = curBufferBatch;
    //                     curDrawBatch.material = curMaterial;
    //                     curDrawBatch.texView = curTexView!;
    //                     curDrawBatch.firstIdx = firstIdx;
    //                     curDrawBatch.idxCount = idxCount - firstIdx;
    //                     firstIdx = idxCount;

    //                     curDrawBatch.pipelineState = this._getUIMaterial(curMaterial!).getPipelineState();
    //                     curDrawBatch.bindingLayout = curDrawBatch.pipelineState!.pipelineLayout.layouts[0];

    //                     this._batches.push(curDrawBatch);
    //                 }

    //                 curTexView = textureView;
    //                 curMaterialHash = uiRenderData.material.hash;
    //                 curMaterial = uiRenderData.material;

    //                 // firstIdx = idxCount;
    //                 // idxCount = 0;
    //             }

    //             idxCount += vui16.length;
    //             vertCount += vCount;

    //             isEnding = index === len;
    //             // get the last data
    //             if (isEnding) {
    //                 curDrawBatch = this._drawBatchPool.alloc();
    //                 curDrawBatch.camera = uiCanvas.camera;
    //                 curDrawBatch.bufferBatch = curBufferBatch;
    //                 curDrawBatch.material = uiRenderData.material;
    //                 curDrawBatch.texView = curTexView!;
    //                 curDrawBatch.firstIdx = firstIdx;
    //                 curDrawBatch.idxCount = idxCount - firstIdx;
    //                 firstIdx = idxCount;

    //                 curDrawBatch.pipelineState = this._getUIMaterial(uiRenderData.material).getPipelineState();
    //                 curDrawBatch.bindingLayout = curDrawBatch.pipelineState!.pipelineLayout.layouts[0];

    //                 this._batches.push(curDrawBatch);
    //             }
    //         } // for
    //     }
    // }

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

    private _walk (node: Node, fn1, fn2, level = 0, isRenderComp = false) {
        let resortNodeList;

        const len = node.childrenCount;

        fn1(node);
        if (len > 0) {
            resortNodeList = this._defineNodeOrder(node);
            for (const comp of resortNodeList) {
                this._walk(comp, fn1, fn2, level);
            }
            // for (let i = 0; i < len; ++i) {
            //     const child = node.children[i];
            //     this._walk(child, fn1, fn2, level);
            // }

            this._sortChildList.free(resortNodeList);
        }

        fn2(node);
        level += 1;
    }

    private _defineNodeOrder (node: Node) {
        let sortList: any[] = this._sortChildList.alloc();
        sortList = node.children.slice();

        sortList.sort((a, b) => {
            const ca = a.getComponent(UIRenderComponent);
            const cb = b.getComponent(UIRenderComponent);
            if (ca && cb) {
                return ca.priority - cb.priority;
            }
            else if (!ca) {
                return -Number.MAX_SAFE_INTEGER;
            } else {
                return 1;
            }
        });

        return sortList;
    }

    private _renderScreens () {
        for (const screen of this._screens) {
            if (!screen.enabledInHierarchy) {
                continue;
            }

            // this._currScreen = screen;
            // this._commitUIRenderDatas.length = 0;

            this._walk(screen.node, (c: Node) => {
                const render = c.getComponent(UIRenderComponent);
                if (render && render.enabledInHierarchy) {
                    // this.commitComp(render);
                    render.updateAssembler(this);
                }
            }, (c: Node) => {
                const render = c.getComponent(UIRenderComponent);
                if (render && render.enabledInHierarchy) {
                    // this.postCommitComp(render);
                    render.postUpdateAssembler(this);
                }
            });

            this.autoMergeBatches();

            // this._commitUICanvas.push({ camera: screen.camera!, datas: this._commitUIRenderDatas });
        }
    }

    private _reset () {
        // this._bufferPool.reset();
        for (let i = 0; i < this._batches.length; ++i) {
            const batch = this._batches.array[i];
            batch.clear(this);
            this._drawBatchPool.free(batch);
        }
        this._batches.clear();
        // this._commitUICanvas = [];

        this._currMaterial = this._emptyMaterial;
        this._currCanvas = -1;
        this._currTexView = null;
        this._meshBufferUseCount = 0;
        this._requireBufferBatch();
        StencilManager.sharedManager!.reset();
        // this._commitUIRenderDataPool.reset();
        // this._commitUICanvas.length = 0;
    }

    private _createMeshBuffer (): MeshBuffer {

        // const vbStride = Float32Array.BYTES_PER_ELEMENT * 9;

        // const vb = this._device.createBuffer({
        //     usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
        //     memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
        //     size: 0,
        //     stride: vbStride,
        // });

        // const ibStride = Uint16Array.BYTES_PER_ELEMENT;

        // const ib = this._device.createBuffer({
        //     usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
        //     memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
        //     size: 0,
        //     stride: ibStride,
        // });

        // const ia = this._device.createInputAssembler({
        //     attributes: this._attributes,
        //     vertexBuffers: [vb],
        //     indexBuffer: ib,
        // });

        // const batch = this._bufferBatchPool.add();
        // batch.vb = vb;
        // batch.ib = ib;
        // batch.ia = ia;
        // batch.vf32 = null;
        // batch.vui16 = null;
        // batch.vbSize = vb.size;
        // batch.ibSize = ib.size;
        const batch = this._bufferBatchPool.add();
        batch.initialize(this._attributes, this._requireBufferBatch);
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
