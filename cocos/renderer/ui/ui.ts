
import { Material } from '../../3d/assets/material';
import { builtinResMgr } from '../../3d/builtin';
import Pool from '../../3d/memop/pool';
import RecyclePool from '../../3d/memop/recycle-pool';
import { CanvasComponent } from '../../3d/ui/components/canvas-component';
import { UIRenderComponent } from '../../3d/ui/components/ui-render-component';
import { IMeshBufferInitData, MeshBuffer } from '../../3d/ui/mesh-buffer';
import { SpriteFrame } from '../../assets/CCSpriteFrame';
import { CachedArray } from '../../core/memop/cached-array';
import { Root } from '../../core/root';
import { mat4 } from '../../core/vmath';
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
import { Node } from '../../scene-graph/node';
import { Camera } from '../scene/camera';
import { RenderScene } from '../scene/render-scene';
import { IUIMaterialInfo, UIMaterial } from './ui-material';
import { UIBatchModel } from './ui-batch-model';

export class UBOUI {
    public static MAT_VIEW_PROJ_OFFSET: number = 0;
    public static COUNT: number = 16;
    public static SIZE: number = UBOUI.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: 26, name: 'UI', members: [
            { name: 'u_matViewProj', type: GFXType.MAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOUI.COUNT);
}

const _mat4Array = new Float32Array(16);

export class UIBufferBatch {
    public vf32: Float32Array | null = null;
    public vui16: Uint16Array | null = null;
    public vb: GFXBuffer | null = null;
    public ib: GFXBuffer | null = null;
    public ia: GFXInputAssembler | null = null;
    public vbCount: number = 0;
    public vbSize: number = 0;
    public ibCount: number = 0;
    public ibSize: number = 0;
}

export class UIDrawBatch {
    public camera: Camera | null = null;
    public bufferBatch: UIBufferBatch | null = null;
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

export interface IUIRenderData {
    meshBuffer: MeshBuffer;
    material: Material;
    texture: SpriteFrame;
    priority: number;
}
export interface IUICanvas {
    camera: Camera;
    datas: IUIRenderData[];
}

export class UI {
    private _commitUIRenderDataPool: RecyclePool = new RecyclePool(() => {
        return new Object() as IUIRenderData;
    }, 128);

    private _screens: CanvasComponent[] = [];
    private _bufferPool: RecyclePool<MeshBuffer> = new RecyclePool(() => {
        return new MeshBuffer();
    }, 128);
    private _bufferBatchPool: RecyclePool<UIBufferBatch> = new RecyclePool(() => {
        return new UIBufferBatch();
    }, 128);
    private _drawBatchPool: Pool<UIDrawBatch> = new Pool(() => {
        return new UIDrawBatch();
    }, 128);
    private _device: GFXDevice;
    private _cmdBuff: GFXCommandBuffer | null = null;
    private _renderArea: IGFXRect = { x: 0, y: 0, width: 0, height: 0 };
    private _scene: RenderScene;
    // private _cameraNode: Node;
    // private _camera: Camera;
    private _attributes: IGFXInputAttribute[] = [];
    private _vertStride = 0;
    private _vertF32Count = 0;
    private _bufferBatches: UIBufferBatch[] = [];
    private _uiMaterial: UIMaterial | null = null;
    private _uiMaterials: Map<number, UIMaterial> = new Map<number, UIMaterial>();
    private _uboUI: UBOUI = new UBOUI();
    private _uiUBO: GFXBuffer | null = null;
    private _batches: CachedArray<UIDrawBatch>;
    private _bufferInitData: IMeshBufferInitData | null = null;
    private _commitUIRenderDatas: IUIRenderData[] = [];
    private _commitUICanvas: IUICanvas[] = [];
    private _sortChildList: Pool<any[]> = new Pool(() => {
        return [];
    }, 128);
    private _uiModelPool: Pool<UIBatchModel> | null = null;
    private _modelInUse: CachedArray<UIBatchModel>;

    get renderScene (): RenderScene {
        return this._scene;
    }

    constructor (private _root: Root) {
        this._device = _root.device;
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

        // this._cameraNode = new Node('UICameraNode');

        // this._camera = this._scene.createCamera({
        //     name: 'UICamera',
        //     node: this._cameraNode,
        //     projection: CameraProjection.ORTHO,
        //     fov: 45,
        //     stencil: 0,
        //     orthoHeight: 10,
        //     far: 4096,
        //     near: 0.1,
        //     color: cc.color(0, 0, 0, 255),
        //     clearFlags: GFXClearFlag.DEPTH | GFXClearFlag.STENCIL,
        //     rect: new Rect(0, 0, 1, 1),
        //     depth: 1,
        //     targetDisplay: 0,
        //     isUI: true,
        // });

        this._batches = new CachedArray(64);
        this._bufferInitData = {
            vertexCount: 0,
            indiceCount: 0,
            attributes: vfmt,
        };

        this._vertF32Count = 9;
        this._vertStride = this._vertF32Count * 4;

        cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this.update, this);

        // this.resize(this._camera.width, this._camera.height);
    }

    public initialize () {

        this._attributes = [
            { name: 'a_position', format: GFXFormat.RGB32F },
            { name: 'a_texCoord', format: GFXFormat.RG32F },
            { name: 'a_color', format: GFXFormat.RGBA32F },
        ];

        this.createBufferBatch();

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        // this._uiMaterial = this.createUIMaterial({ material: builtinResMgr.get<Material>('sprite-material') });

        this._uiUBO = this._device.createBuffer({
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

        for (const buffBatch of this._bufferBatches) {
            buffBatch.vb!.destroy();
            buffBatch.ib!.destroy();
            buffBatch.ia!.destroy();
        }
        this._bufferBatches.splice(0);

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
                if (screen.camera.visibility === visibility) {
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

    public createBuffer (vertexCount: number, indiceCount: number) {
        const buffer = this._bufferPool.add();
        this._bufferInitData!.vertexCount = vertexCount;
        this._bufferInitData!.indiceCount = indiceCount;
        buffer.initialize(this._bufferInitData as IMeshBufferInitData);
        return buffer;
    }

    public createUIRenderData () {
        return this._commitUIRenderDataPool.add();
    }

    public addToQueue (uiRenderData: IUIRenderData) {
        this._commitUIRenderDatas.push(uiRenderData);
    }

    public update (dt: number) {

        for (let i = 0; i < this._batches.length; ++i) {
            const batch = this._batches.array[i];
            batch.clear(this);
            this._drawBatchPool.free(batch);
        }
        this._batches.clear();
        this._commitUICanvas = [];

        this._renderScreens();

        // Merge batch
        if (this._commitUIRenderDatas.length) {
            this.mergeBatches();

            // update buffers
            for (const bufferBatch of this._bufferBatches) {
                if (bufferBatch.vbSize > bufferBatch.vb!.size) {
                    bufferBatch.vb!.resize(bufferBatch.vbSize);
                }
                bufferBatch.vb!.update(bufferBatch.vf32!);

                if (bufferBatch.ibSize > bufferBatch.ib!.size) {
                    bufferBatch.ib!.resize(bufferBatch.ibSize);
                }
                bufferBatch.ib!.update(bufferBatch.vui16!);
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
        this._reset();
        for (const screen of this._screens) {
            if (!screen.enabledInHierarchy) {
                continue;
            }

            this._commitUIRenderDatas = [];

            // this._currScreen = screen;
            this._commitUIRenderDatas.length = 0;

            this._walk(screen.node, (c: Node) => {
                const render = c.getComponent(UIRenderComponent);
                if (render && render.enabledInHierarchy) {
                    this._commitComp(render);
                }
            }, (c: Node) => {
                const render = c.getComponent(UIRenderComponent);
                if (render && render.enabledInHierarchy) {
                    this._postCommitComp(render);
                }
            });

            this._commitUICanvas.push({ camera: screen.camera!, datas: this._commitUIRenderDatas });
        }
    }

    private _reset () {
        this._bufferPool.reset();
        this._commitUIRenderDataPool.reset();
        this._commitUICanvas.length = 0;
    }

    private _commitComp (comp: UIRenderComponent) {
        comp.updateAssembler(this);
        // const canvasComp: CanvasComponent | null = this.getScreen(comp.viewID);

        // const renderDataFormat: IUIRenderData = this._commitUIRenderDataPool.add();
        // renderDataFormat.meshBuffer = buffer;
        // renderDataFormat.material = comp.material as Material;
        // renderDataFormat.camera = canvasComp!.camera!;
    }

    private _postCommitComp (comp: UIRenderComponent) {
        comp.postUpdateAssembler();
    }

    private mergeBatches () {
        let curTexView: GFXTextureView | null = null;
        let curMaterialHash: number = 0;
        let bufferBatchIdx = 0;
        let curBufferBatch: UIBufferBatch = this._bufferBatches[bufferBatchIdx++];
        let firstIdx = 0;
        let idxCount = 0;
        let vertCount = 0;

        let vf32: Float32Array;
        let vui16: Uint16Array;
        let vCount = 0;
        let vbSize = 0;
        let ibSize = 0;
        let curDrawBatch: UIDrawBatch | null = null;

        let index = 0;
        let len = 0;
        let isEnding = false;

        for (const uiCanvas of this._commitUICanvas) {

            index = 0;
            len = uiCanvas.datas.length;

            for (const uiRenderData of uiCanvas.datas) {
                index++;

                if (idxCount + uiRenderData.meshBuffer.vData!.length > 65535) {
                    if (bufferBatchIdx >= this._bufferBatches.length) {
                        this.createBufferBatch();
                    }

                    curBufferBatch = this._bufferBatches[bufferBatchIdx++];
                    firstIdx = 0;
                    idxCount = 0;
                    vertCount = 0;
                    // isNewBatch = true;
                }

                // merge vertices
                vf32 = uiRenderData.meshBuffer.vData!;
                vCount = (vf32.length / this._vertF32Count);
                vbSize = (vCount + vertCount) * this._vertStride;
                if (vbSize > curBufferBatch.vbSize) {
                    curBufferBatch.vbCount = vCount + vertCount;
                    curBufferBatch.vbSize = vbSize;

                    const lastVF32 = curBufferBatch.vf32;
                    curBufferBatch.vf32 = new Float32Array(curBufferBatch.vbCount * this._vertF32Count);
                    if (lastVF32) {
                        curBufferBatch.vf32.set(lastVF32!, 0);
                    }
                }

                curBufferBatch.vf32!.set(vf32, vertCount * this._vertF32Count);

                // merge indices
                vui16 = uiRenderData.meshBuffer.iData!;
                ibSize = (vui16.length + idxCount) * 2;
                if (ibSize > curBufferBatch.ibSize) {
                    curBufferBatch.ibCount = vui16.length + idxCount;
                    curBufferBatch.ibSize = ibSize;

                    const lastVUI16 = curBufferBatch.vui16!;
                    curBufferBatch.vui16 = new Uint16Array(curBufferBatch.ibCount);
                    if (lastVUI16) {
                        curBufferBatch.vui16.set(lastVUI16, 0);
                    }
                }

                for (let n = 0; n < vui16.length; ++n) {
                    curBufferBatch.vui16![idxCount + n] = vui16[n] + vertCount;
                }

                if (curMaterialHash !== uiRenderData.material.hash ||
                    curTexView !== uiRenderData.texture.getGFXTextureView()) {
                    if (curTexView) {
                        curDrawBatch = this._drawBatchPool.alloc();
                        curDrawBatch.camera = uiCanvas.camera;
                        curDrawBatch.bufferBatch = curBufferBatch;
                        curDrawBatch.material = uiRenderData.material;
                        curDrawBatch.texView = curTexView!;
                        curDrawBatch.firstIdx = firstIdx;
                        curDrawBatch.idxCount = idxCount - firstIdx;
                        firstIdx = idxCount;

                        curDrawBatch.pipelineState = this._getUIMaterial(uiRenderData.material).getPipelineState();
                        curDrawBatch.bindingLayout = curDrawBatch.pipelineState!.pipelineLayout.layouts[0];

                        this._batches.push(curDrawBatch);
                    }

                    curTexView = uiRenderData.texture.getGFXTextureView();
                    curMaterialHash = uiRenderData.material.hash;

                    // firstIdx = idxCount;
                    // idxCount = 0;
                }

                idxCount += vui16.length;
                vertCount += vCount;

                isEnding = index === len;
                // get the last data
                if (isEnding) {
                    curDrawBatch = this._drawBatchPool.alloc();
                    curDrawBatch.camera = uiCanvas.camera;
                    curDrawBatch.bufferBatch = curBufferBatch;
                    curDrawBatch.material = uiRenderData.material;
                    curDrawBatch.texView = curTexView!;
                    curDrawBatch.firstIdx = firstIdx;
                    curDrawBatch.idxCount = idxCount - firstIdx;
                    firstIdx = idxCount;

                    curDrawBatch.pipelineState = this._getUIMaterial(uiRenderData.material).getPipelineState();
                    curDrawBatch.bindingLayout = curDrawBatch.pipelineState!.pipelineLayout.layouts[0];

                    this._batches.push(curDrawBatch);
                }
            } // for
        }
    }

    private createBufferBatch (): UIBufferBatch {

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 9;

        const vb = this._device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: 0,
            stride: vbStride,
        });

        const ibStride = Uint16Array.BYTES_PER_ELEMENT;

        const ib = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: 0,
            stride: ibStride,
        });

        const ia = this._device.createInputAssembler({
            attributes: this._attributes,
            vertexBuffers: [vb],
            indexBuffer: ib,
        });

        const batch = this._bufferBatchPool.add();
        batch.vb = vb;
        batch.ib = ib;
        batch.ia = ia;
        batch.vf32 = null;
        batch.vui16 = null;
        batch.vbSize = vb.size;
        batch.ibSize = ib.size;
        this._bufferBatches.push(batch);
        return batch;
    }
}
