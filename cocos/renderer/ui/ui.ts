
import { Material } from '../../3d/assets/material';
import RecyclePool from '../../3d/memop/recycle-pool';
import { CanvasComponent } from '../../3d/ui/components/canvas-component';
import { UIRenderComponent } from '../../3d/ui/components/ui-render-component';
import { IMeshBufferInitData, MeshBuffer } from '../../3d/ui/mesh-buffer';
import { SpriteFrame } from '../../assets/CCSpriteFrame';
import { CachedArray } from '../../core/memop/cached-array';
import { Root } from '../../core/root';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXBuffer, IGFXBufferInfo } from '../../gfx/buffer';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import {
    GFXBufferUsageBit,
    GFXCommandBufferType,
    GFXFormat,
    GFXMemoryUsageBit,
    IGFXRect,
} from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler, IGFXInputAttribute } from '../../gfx/input-assembler';
import { GFXTexture } from '../../gfx/texture';
import { vfmt } from '../../gfx/vertex-format-sample';
import { BaseNode } from '../../scene-graph/base-node';
import { Camera } from '../scene/camera';
import { RenderScene } from '../scene/render-scene';
import { IUIMaterialInfo, UIMaterial } from './ui-material';

export interface IUIBufferBatch {
    vb: GFXBuffer;
    ib: GFXBuffer;
    ia: GFXInputAssembler;
    vf32: Float32Array;
    vi16: Int16Array;
}

export interface IUIDrawBatch {
    camera: Camera;
    bufferBatch: IUIBufferBatch;
    uiMaterial: UIMaterial;
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
            { name: 'a_color', format: GFXFormat.RGBA32F, binding: 0 },
            { name: 'a_position', format: GFXFormat.RGB32F, binding: 1 },
            { name: 'a_texCoord', format: GFXFormat.RG32F, binding: 2 },
        ];

        this.createBufferBatch();

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        /*
        // create ui material
        const material = new Material();
        material.effectName = 'sprite-material';
        // material.setProperty('mainTexture', texture);
        // material.update();

        this._uiMaterial = this.createUIMaterial({ material });
        */

        return true;
    }

    public destroy () {
        this.destroyUIMaterials();

        for (const buffBatch of this._bufferBatches) {
            buffBatch.vb!.destroy();
            buffBatch.ib!.destroy();
            buffBatch.ia!.destroy();
        }
        this._bufferBatches = [];

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
        this._batches.clear();

        this._renderScreens();

        /*
        // Merge batch
        if (this._commitUIRenderDatas.length) {
            const first = this._commitUIRenderDatas[0];

            let curCamera: Camera = first.camera;
            let curTexture: GFXTexture | null = first.texture.getGFXTexture();
            let curBufferBatch: IUIBufferBatch = this._bufferBatches[0];
            let vbOffset = 0;
            let ibOffset = 0;
            let ibcount = 0;
            let vb = curBufferBatch.vb;
            let vbBuffer = (vb.buffer as ArrayBuffer);
            let lastVF32;

            for (const uiRenderData of this._commitUIRenderDatas) {

                if (ibcount + uiRenderData.meshBuffer.iData!.length < 65535) {
                    const vf32: Float32Array = uiRenderData.meshBuffer.vData!;
                    const vbSize = vf32.length * 4 + vbOffset;
                    if (vbSize > vb.size) {
                        vb.resize(vbSize);

                        vbBuffer = (vb.buffer as ArrayBuffer);
                        lastVF32 = curBufferBatch.vf32;
                        curBufferBatch.vf32 = new Float32Array(vbBuffer);
                        curBufferBatch.vf32.set(lastVF32, 0);
                    }

                    curBufferBatch.vf32.set(vf32, vbOffset);
                    vbOffset += vf32.length * 4;


                } else {

                }

                if (curCamera !== uiRenderData.camera) {

                    if (curBufferBatch) {

                        if (curBufferBatch.ib!.count + uiRenderData.meshBuffer.iData!.length > 65535) {

                        }
                    }

                    curCamera = uiRenderData.camera;
                    curTexture = uiRenderData.texture.getGFXTexture();
                    curBufferBatch = this._drawBatchPool.add();

                    continue;
                }

                if (curTexture !== uiRenderData.texture.getGFXTexture()) {
                    curTexture = uiRenderData.texture.getGFXTexture();
                }

                // uiRenderData.meshBuffer.iData.length;
            }
        }
        */
    }

    public render () {

        const material = this._uiMaterial!;

        if (this._batches.length) {
            const framebuffer = this._root.curWindow!.framebuffer;
            const cmdBuff = this._cmdBuff!;

            cmdBuff.begin();

            for (let i = 0; i < this._batches.length; ++i) {
                const batch = this._batches.array[i];
                const camera = batch.camera!;

                this._renderArea.width = camera.width;
                this._renderArea.height = camera.height;

                cmdBuff.beginRenderPass(framebuffer, this._renderArea, [], camera.clearDepth, camera.clearStencil);
                cmdBuff.bindPipelineState(material.pipelineState);
                cmdBuff.bindBindingLayout(material.bindingLayout);
                cmdBuff.bindInputAssembler(batch.bufferBatch!.ia!);
                cmdBuff.draw(batch.bufferBatch!.ia!);

                cmdBuff.endRenderPass();
            }

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

    private createBufferBatch (): IUIBufferBatch {

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 9;

        const vb = this._device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vbStride * 128,
            stride: vbStride,
        });

        const ibStride = Uint16Array.BYTES_PER_ELEMENT;

        const ib = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibStride * 128,
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
        this._bufferBatches.push(batch);
        return batch;
    }
}
