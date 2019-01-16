
// import { vfmt3D } from '../../2d/renderer/webgl/vertex-format';
import RecyclePool from '../../3d/memop/recycle-pool';
import { CachedArray } from '../../core/memop/cached-array';
import { Root } from '../../core/root';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType, IGFXRect } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXFramebuffer } from '../../gfx/framebuffer';
import { Camera } from '../scene/camera';
import { RenderScene } from '../scene/render-scene';
import { UIBatchModel } from './ui-batch-model';

export interface IUIRenderItem {
    camera: Camera;
    batchModel: UIBatchModel;
    cmdBuff: GFXCommandBuffer;
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
    private _items: CachedArray<IUIRenderItem>;

    constructor (private _root: Root) {
        this._device = _root.device;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });

        this._items = new CachedArray(64);
    }

    public initialize () {

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        return true;
    }

    public destroy () {
        // this._reset();

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

                cmdBuff.execute([item.cmdBuff], 1);

                cmdBuff.endRenderPass();
            }

            cmdBuff.end();

            this._device.queue.submit([cmdBuff]);
        }
    }
}
