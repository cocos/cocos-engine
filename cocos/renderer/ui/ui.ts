
import { Material } from '../../3d/assets/material';
import { builtinResMgr } from '../../3d/builtin';
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
    GFXCommandBufferType,
    GFXFormat,
    GFXMemoryUsageBit,
    GFXType,
    IGFXRect,
} from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler, IGFXInputAttribute } from '../../gfx/input-assembler';
import { GFXUniformBlock } from '../../gfx/shader';
import { GFXTextureView } from '../../gfx/texture-view';
import { vfmt } from '../../gfx/vertex-format-sample';
import { BaseNode } from '../../scene-graph/base-node';
import { Camera } from '../scene/camera';
import { RenderScene } from '../scene/render-scene';
import { IUIMaterialInfo, UIMaterial } from './ui-material';

export class UBOUI {
    public static MAT_VIEW_PROJ_OFFSET: number = 0;
    public static COUNT: number = UBOUI.MAT_VIEW_PROJ_OFFSET + 16;
    public static SIZE: number = UBOUI.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: 30, name: 'CCUI', members: [
            { name: 'cc_matViewProj', type: GFXType.MAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOUI.COUNT);
}

const _mat4Array = new Float32Array(16);

export interface IUIBufferBatch {
    vf32: Float32Array;
    vui16: Uint16Array;
    vbSize: number;
    ibSize: number;
    vb: GFXBuffer;
    ib: GFXBuffer;
    ia: GFXInputAssembler;
}

export interface IUIDrawBatch {
    camera: Camera;
    bufferBatch: IUIBufferBatch;
    uiMaterial: UIMaterial;
    texView: GFXTextureView;
}

export interface IUIRenderData {
    meshBuffer: MeshBuffer;
    material: Material;
    texture: SpriteFrame;
    camera: Camera;
}

export class UI {
    private _commitUIRenderDataPool: RecyclePool = new RecyclePool(() => {
        return new Object() as IUIRenderData;
    }, 128);

    private _screens: CanvasComponent[] = [];
    private _bufferPool: RecyclePool<MeshBuffer> = new RecyclePool(() => {
        return new MeshBuffer();
    }, 128);
    private _bufferBatchPool: RecyclePool<IUIBufferBatch> = new RecyclePool(() => {
        return new Object() as IUIBufferBatch;
    }, 128);
    private _drawBatchPool: RecyclePool<IUIDrawBatch> = new RecyclePool(() => {
        return new Object() as IUIDrawBatch;
    }, 128);
    private _device: GFXDevice;
    private _cmdBuff: GFXCommandBuffer | null = null;
    private _renderArea: IGFXRect = { x: 0, y: 0, width: 0, height: 0 };
    private _scene: RenderScene;
    private _attributes: IGFXInputAttribute[] = [];
    private _bufferBatches: IUIBufferBatch[] = [];
    private _uiMaterial: UIMaterial | null = null;
    private _uiMaterials: UIMaterial[] = [];
    private _uboUI: UBOUI = new UBOUI();
    private _uiUBO: GFXBuffer | null = null;
    private _batches: CachedArray<IUIDrawBatch>;
    private _bufferInitData: IMeshBufferInitData | null = null;
    private _commitUIRenderDatas: IUIRenderData[] = [];

    constructor (private _root: Root) {
        this._device = _root.device;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });

        this._batches = new CachedArray(64);
        this._bufferInitData = {
            vertexCount: 0,
            indiceCount: 0,
            attributes: vfmt,
        };
    }

    public initialize () {

        this._attributes = [
            { name: 'a_color', format: GFXFormat.RGBA32F },
            { name: 'a_position', format: GFXFormat.RGB32F },
            { name: 'a_texCoord', format: GFXFormat.RG32F },
        ];

        this.createBufferBatch();

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        this._uiMaterial = this.createUIMaterial({ material: builtinResMgr.get<Material>('sprite-material')});

        this._uiUBO = this._device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOUI.SIZE,
        });

        return true;
    }

    public destroy () {
        this.destroyUIMaterials();

        if (this._uiUBO) {
            this._uiUBO.destroy();
            this._uiUBO = null;
        }

        for (const buffBatch of this._bufferBatches) {
            buffBatch.vb!.destroy();
            buffBatch.ib!.destroy();
            buffBatch.ia!.destroy();
        }
        this._bufferBatches.splice(0);

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public createUIMaterial (info: IUIMaterialInfo): UIMaterial | null {
        const uiMtrl = new UIMaterial();
        if (uiMtrl.initialize(info)) {
            this._uiMaterials.push(uiMtrl);
            return uiMtrl;
        } else {
            return null;
        }
    }

    public destroyUIMaterial (uiMaterial: UIMaterial) {
        for (let i = 0; i < this._uiMaterials.length; ++i) {
            if (this._uiMaterials[i] === uiMaterial) {
                uiMaterial.destroy();
                this._uiMaterials.splice(i);
                return;
            }
        }
    }

    public destroyUIMaterials () {
        for (const uiMaterial of this._uiMaterials) {
            uiMaterial.destroy();
        }
        this._uiMaterials = [];
    }

    public addScreen (comp) {
        this._screens.push(comp);
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
        
        for (let i = 0; i < this._batches.array.length; ++i) {
            this._drawBatchPool.remove(this._batches.array[i]);
        }
        this._batches.clear();

        this._commitUIRenderDatas = [];

        this._renderScreens();

        // Merge batch
        if (this._commitUIRenderDatas.length) {
            this.mergeBatches();

            // update buffers
            for (const bufferBatch of this._bufferBatches) {
                if (bufferBatch.vbSize > bufferBatch.vb.size) {
                    bufferBatch.vb.resize(bufferBatch.vbSize);
                }
                bufferBatch.vb.update(bufferBatch.vf32);

                if (bufferBatch.ibSize > bufferBatch.ib.size) {
                    bufferBatch.ib.resize(bufferBatch.ibSize);
                }
                bufferBatch.ib.update(bufferBatch.vui16);

                bufferBatch.ia.vertexCount = bufferBatch.vf32.length;
                bufferBatch.ia.indexCount = bufferBatch.vui16.length;
            }
        }
    }

    public render () {

        const material = this._uiMaterial!;

        if (this._batches.length) {
            const framebuffer = this._root.curWindow!.framebuffer;
            const cmdBuff = this._cmdBuff!;

            cmdBuff.begin();

            let curCamera: Camera | null = null;

            for (let i = 0; i < this._batches.length; ++i) {
                const batch = this._batches.array[i];
                const camera = batch.camera!;

                if (curCamera !== camera) {
                    if (curCamera) {
                        cmdBuff.endRenderPass();
                    }
                    this._renderArea.width = camera.orthoHeight * camera.aspect;
                    this._renderArea.height = camera.orthoHeight;

                    camera.update();

                    // update ubo
                    mat4.array(_mat4Array, camera.matViewProj);
                    this._uboUI.view.set(_mat4Array, UBOUI.MAT_VIEW_PROJ_OFFSET);

                    this._uiUBO!.update(this._uboUI.view);

                    curCamera = camera;

                    cmdBuff.beginRenderPass(framebuffer, this._renderArea, [], camera.clearDepth, camera.clearStencil);
                }

                material.bindingLayout.bindBuffer(0, this._uiUBO!);
                material.bindingLayout.bindTextureView(1, batch.texView);
                material.bindingLayout.update();

                cmdBuff.bindPipelineState(material.pipelineState);
                cmdBuff.bindBindingLayout(material.bindingLayout);
                cmdBuff.bindInputAssembler(batch.bufferBatch.ia);
                cmdBuff.draw(batch.bufferBatch.ia);
            }

            cmdBuff.endRenderPass();
            cmdBuff.end();

            this._device.queue.submit([cmdBuff]);
        }
    }

    private _walk (node, fn1, fn2, level = 0) {
        level += 1;
        const len = node.children.length;
        fn1(node);
        for (let i = 0; i < len; ++i) {
            const child = node.children[i];
            this._walk(child, fn1, fn2, level);
        }

        fn2(node);
    }

    private _renderScreens () {
        this._reset();
        for (const screen of this._screens) {
            if (!screen.enabledInHierarchy) {
                continue;
            }
            // this._currScreen = screen;

            this._walk(screen.node, (c: BaseNode) => {
                const renderComponent = c.getComponent(UIRenderComponent);
                if (renderComponent && renderComponent.enabledInHierarchy) {
                    this._commitComp(renderComponent);
                }
            }, (c: BaseNode) => {
                    const renderComponent = c.getComponent(UIRenderComponent);
                    if (renderComponent && renderComponent.enabledInHierarchy) {
                        this._postCommitComp(renderComponent);
                    }
            });
        }
    }

    private _reset () {
        this._bufferPool.reset();
        this._commitUIRenderDataPool.reset();
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
        let curCamera: Camera | null = null;
        let curTexView: GFXTextureView | null = null;
        let bufferBatchIdx = 0;
        let curBufferBatch: IUIBufferBatch = this._bufferBatches[bufferBatchIdx++];
        let vOffset = 0;
        let iOffset = 0;
        let vf32: Float32Array;
        let vui16: Uint16Array;
        let vbSize = 0;
        let ibSize = 0;
        let isNewBatch = false;

        for (const uiRenderData of this._commitUIRenderDatas) {

            if (iOffset + uiRenderData.meshBuffer.vData!.length > 65535) {
                if (bufferBatchIdx >= this._bufferBatches.length) {
                    this.createBufferBatch();
                }

                curBufferBatch = this._bufferBatches[bufferBatchIdx++];
                vOffset = 0;
                iOffset = 0;
                isNewBatch = true;
            } else {
                isNewBatch = false;
            }

            // merge vertices
            vf32 = uiRenderData.meshBuffer.vData!;
            vbSize = (vf32.length + vOffset) * 4;
            if (vbSize > curBufferBatch.vbSize) {
                curBufferBatch.vbSize = vbSize;
                const lastVF32 = curBufferBatch.vf32;
                curBufferBatch.vf32 = new Float32Array(vf32.length + vOffset);
                curBufferBatch.vf32.set(lastVF32, 0);
            }

            curBufferBatch.vf32.set(vf32, vOffset);

            // merge indices
            vui16 = uiRenderData.meshBuffer.iData!;
            ibSize = (vui16.length + iOffset) * 2;
            if (ibSize > curBufferBatch.ibSize) {
                curBufferBatch.ibSize = ibSize;
                const lastVUI16 = curBufferBatch.vui16;
                curBufferBatch.vui16 = new Uint16Array(vui16.length + iOffset);
                curBufferBatch.vui16.set(lastVUI16, 0);
            }

            for (let n = 0; n < vui16.length; ++n) {
                curBufferBatch.vui16[iOffset + n] = vui16[n] + vOffset;
            }

            curBufferBatch.vui16.set(vui16, iOffset);

            vOffset += vf32.length;
            iOffset += vui16.length;

            if (curCamera !== uiRenderData.camera) {
                isNewBatch = true;
                curCamera = uiRenderData.camera;
            }
            
            if (curTexView !== uiRenderData.texture.getGFXTextureView()) {
                curTexView = uiRenderData.texture.getGFXTextureView();
                isNewBatch = true;
            }

            if (isNewBatch) {
                const batch = this._drawBatchPool.add();
                batch.camera = curCamera;
                batch.bufferBatch = curBufferBatch;
                batch.uiMaterial = this._uiMaterial!;
                batch.texView = curTexView!;
                this._batches.push(batch);
            }
        } // for
    }

    private createBufferBatch (): IUIBufferBatch {

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 9;
        const vbCount = 128;
        const varrCount = 128 * 9;

        const vb = this._device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vbStride * vbCount,
            stride: vbStride,
        });

        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibCount = 128;

        const ib = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibStride * ibCount,
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
        batch.vf32 = new Float32Array(varrCount);
        batch.vui16 = new Uint16Array(ibCount);
        batch.vbSize = vb.size;
        batch.ibSize = ib.size;
        this._bufferBatches.push(batch);
        return batch;
    }
}
