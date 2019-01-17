
import RecyclePool from '../../3d/memop/recycle-pool';
import { CachedArray } from '../../core/memop/cached-array';
import { MeshBuffer, IMeshBufferInitData } from '../../3d/ui/mesh-buffer';
import { Material } from '../../3d/assets/material';
import { SpriteFrame } from '../../assets/CCSpriteFrame';
import { Root } from '../../core/root';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXBufferUsageBit, GFXCommandBufferType, GFXFormat, GFXMemoryUsageBit, IGFXRect } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler, IGFXInputAttribute } from '../../gfx/input-assembler';
import { GFXPipelineLayout } from '../../gfx/pipeline-layout';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Pass } from '../core/pass';
import { Camera } from '../scene/camera';
import { RenderScene } from '../scene/render-scene';
import { CanvasComponent } from '../../3d/ui/components/canvas-component';
import { LabelComponent } from '../../3d/ui/components/label-component';
import { SpriteComponent } from '../../3d/ui/components/sprite-component';
import { UIBatchModel } from './ui-batch-model';
import { vfmt } from '../../gfx/vertex-format-sample';
import { UITransformComponent } from '../../3d/ui/components/ui-transfrom-component';
// import { GFXBuffer } from '../../gfx/buffer';
// import { RenderComponent } from '../../3d/ui/components/ui-render-component';

// import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';

export interface IUIBufferBatch {
    vb: GFXBuffer;
    ib: GFXBuffer;
}

export interface IUIRenderItem {
    camera: Camera;
    pass: Pass;
    bindingLayout: GFXBindingLayout;
    pipelineLayout: GFXPipelineLayout;
    pipelineState: GFXPipelineState;
    inputAssembler: GFXInputAssembler;
}

export interface IUIRenderData {
    meshBuffer: MeshBuffer;
    material: Material;
    camera: Camera;
}

export class UI {
    private _screens: CanvasComponent[] = [];
    private _bufferPool: RecyclePool = new RecyclePool(() => {
        return new MeshBuffer();
    }, 128);

    // private _currScreen: CanvasComponent | null = null;
    // private _currMaterail: Material | null = null;
    // private _currSpriteFrame: SpriteFrame | null = null;
    // private _currUserKey = 0;
    // private _dummyNode: Node | null = null;
    // private _batchedModels: UIBatchModel[] = [];
    // private _iaPool: RecyclePool | null = null;
    // private _modelPool: RecyclePool | null = null;
    private _device: GFXDevice;
    private _cmdBuff: GFXCommandBuffer | null = null;
    private _renderArea: IGFXRect = { x: 0, y: 0, width: 0, height: 0 };
    private _scene: RenderScene;
    private _attributes: IGFXInputAttribute[] = [];
    private _bufferBatches: IUIBufferBatch[] = [];
    private _items: CachedArray<IUIRenderItem>;
    private _commitBuffers: any[] = [];

    constructor (private _root: Root) {
        this._device = _root.device;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });

        this._items = new CachedArray(64);
    }

    public initialize () {

        this._attributes = [
            { name: 'a_texCoord', format: GFXFormat.RGB32F },
            { name: 'a_position', format: GFXFormat.RG32F },
            { name: 'a_color', format: GFXFormat.RGBA8, isNormalized: true },
        ];

        this.createBufferBatch();

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        return true;
    }

    public destroy () {

        for (const buffBatch of this._bufferBatches) {
            buffBatch.vb.destroy();
            buffBatch.ib.destroy();
        }
        this._bufferBatches = [];

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
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

    public update (dt: number) {
        this._items.clear();

        // TODO: Merge batch here.
        this._renderScreens();

        this.render();
    }

    public _walk (node, fn1, fn2, level = 0) {
        level += 1;
        const len = node.children.length;

        for (let i = 0; i < len; ++i) {
            const child = node.children[i];
            const continueWalk = fn1(child, node, level);

            if (continueWalk === false) {
                fn2(child, node, level);
                break;
            }

            this._walk(child, fn1, fn2, level);
            // fn2(child, node, level);
        }
    }

    private _renderScreens () {
        for (const screen of this._screens) {
            if (!screen.enabledInHierarchy) {
                continue;
            }
            // this._currScreen = screen;

            this._walk(screen.node, (c) => {
                const image = c.getComponent(SpriteComponent);
                if (image && image.enabledInHierarchy) {
                    this._commitComp(image);
                }

                const label = c.getComponent(LabelComponent);
                if (label && label.enabledInHierarchy) {
                    this._commitComp(label);
                }
            }, null);
        }
    }

    private _commitComp (comp) {
        const buffer = this._bufferPool.add();
        buffer.initialize({
            vertexCount: comp.renderData.vertexCount,
            indexCount: comp.renderData.indiceCount,
            attributes: vfmt,
        } as IMeshBufferInitData);
        comp.updateRenderData(buffer);
        const canvasComp: CanvasComponent | null = this.getScreen(comp.viewID);

        this._emit({
            meshBuffer: buffer,
            material: comp.material,
            camera: canvasComp ? canvasComp.camera : null,
        } as IUIRenderData);
    }

    private _emit (renderData: IUIRenderData) {
        this._commitBuffers.push(renderData);
    }

    private render () {
        if (this._items.length) {
            const framebuffer = this._root.curWindow!.framebuffer;
            const cmdBuff = this._cmdBuff!;

            cmdBuff.begin();

            for (let i = 0; i < this._items.length; ++i) {
                const item = this._items.array[i];
                const camera = item.camera;

                this._renderArea.width = camera.width;
                this._renderArea.height = camera.height;

                cmdBuff.beginRenderPass(framebuffer, this._renderArea,
                    [camera.clearColor], camera.clearDepth, camera.clearStencil);

                cmdBuff.bindPipelineState(item.pipelineState);
                cmdBuff.bindBindingLayout(item.bindingLayout);
                cmdBuff.bindInputAssembler(item.inputAssembler);
                cmdBuff.draw(item.inputAssembler);

                cmdBuff.endRenderPass();
            }

            cmdBuff.end();

            this._device.queue.submit([cmdBuff]);
        }
    }

    private createBufferBatch (): IUIBufferBatch {

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 6;

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

        const batch: IUIBufferBatch = { vb, ib };
        this._bufferBatches.push(batch);
        return batch;
    }
}
