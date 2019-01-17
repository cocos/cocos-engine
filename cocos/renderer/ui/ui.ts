
// import { vfmt3D } from '../../2d/renderer/webgl/vertex-format';
import RecyclePool from '../../3d/memop/recycle-pool';
import { CachedArray } from '../../core/memop/cached-array';
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
import { UIBatchModel } from './ui-batch-model';

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

export class UI {
    // private _buffer: MeshBuffer | null = new MeshBuffer(this, vfmt3D);
    private _batchedModels: UIBatchModel[] = [];
    private _iaPool: RecyclePool | null = new RecyclePool(16, () => {
        // return this._root.device.createInputAssembler({

        // });
    });
    private _modelPool: RecyclePool = new RecyclePool(16, () => {
        return this._scene.createModel(UIBatchModel);
    });
    private _device: GFXDevice;
    private _cmdBuff: GFXCommandBuffer | null = null;
    private _renderArea: IGFXRect = { x: 0, y: 0, width: 0, height: 0 };
    private _scene: RenderScene;
    private _attributes: IGFXInputAttribute[] = [];
    private _bufferBatches: IUIBufferBatch[] = [];
    private _items: CachedArray<IUIRenderItem>;

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
    }

    public removeScreen (comp) {
    }

    public update (dt: number) {
        this._items.clear();

        // TODO: Merge batch here.

        this.render();
    }

    private _emit (): UIBatchModel[] {
        return this._batchedModels;
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
