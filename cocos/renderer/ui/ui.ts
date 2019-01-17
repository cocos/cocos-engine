
import RecyclePool from '../../3d/memop/recycle-pool';
import { CachedArray } from '../../core/memop/cached-array';
import { MeshBuffer } from '../../3d/ui/mesh-buffer';
import { Material } from '../../3d/assets/material';
import { SpriteFrame } from '../../assets/CCSpriteFrame';
import { Root } from '../../core/root';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType, IGFXRect } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXFramebuffer } from '../../gfx/framebuffer';
import { Camera } from '../scene/camera';
import { RenderScene } from '../scene/render-scene';
import { CanvasComponent } from '../../3d/ui/components/canvas-component';
import { LabelComponent } from '../../3d/ui/components/label-component';
import { SpriteComponent } from '../../3d/ui/components/sprite-component';
import { UIBatchModel } from './ui-batch-model';
import { vfmt } from '../../gfx/vertex-format-sample';
// import { GFXBuffer } from '../../gfx/buffer';
// import { RenderComponent } from '../../3d/ui/components/ui-render-component';

// import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';

export interface IUIRenderItem {
    camera: Camera;
    batchModel: UIBatchModel;
    cmdBuff: GFXCommandBuffer;
}

export class UI {
    private _screens: CanvasComponent[] = [];
    private _buffer: MeshBuffer | null = null;
    private _currScreen: CanvasComponent | null = null;
    private _currMaterail: Material | null = null;
    private _currSpriteFrame: SpriteFrame | null = null;
    private _currUserKey = 0;
    private _dummyNode: Node | null = null;
    private _batchedModels: UIBatchModel[] = [];
    private _iaPool: RecyclePool | null = null;
    private _modelPool: RecyclePool | null = null;
    private _device: GFXDevice;
    private _cmdBuff: GFXCommandBuffer | null = null;
    private _renderArea: IGFXRect = { x: 0, y: 0, width: 0, height: 0 };
    private _scene: RenderScene;
    private _items: CachedArray<IUIRenderItem>;
    // private _vb: GFXBuffer | null = null;
    // private _ib: GFXBuffer | null = null;
    // private _renderComps: RenderComponent[] = [];

    constructor (private _root: Root) {
        this._device = _root.device;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });

        this._items = new CachedArray(64);
        this._buffer = new MeshBuffer(this._root.device, vfmt);
        this._modelPool = new RecyclePool(() => {
            return this._scene.createModel(UIBatchModel);
        }, 16);
        // this._iaPool = new RecyclePool(() => {
        //     return this._root.device.createInputAssembler({
        //         attributes: vfmt,
        //         vertexBuffers: [this._buffer._vb],
        //         indexBuffer: this._buffer._ib,
        //     });
        // }, 16);
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
        this._screens.push(comp);
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

    // public flush () {
    //     const material = this._currMaterail;
    //     const buffer = this._buffer;
    //     const indiceStart = buffer!.indiceStart;
    //     const indiceOffset = buffer!.indiceOffset;
    //     const indiceCount = indiceOffset - indiceStart;
    //     if (!material || indiceCount <= 0) {
    //         return;
    //     }

    //     // Generate ia
    //     const ia = this._iaPool.add();
    //     ia._vertexBuffer = buffer!._vb;
    //     ia._indexBuffer = buffer!._ib;
    //     ia._start = indiceStart;
    //     ia._count = indiceCount;

    //     // Check stencil state and modify pass
    //     // TODO: Matching new structure
    //     // _setStencil(
    //     //     material,
    //     //     false,
    //     //     gfx.DS_FUNC_ALWAYS,
    //     //     0,
    //     //     0,
    //     //     gfx.STENCIL_OP_KEEP,
    //     //     gfx.STENCIL_OP_KEEP,
    //     //     gfx.STENCIL_OP_KEEP,
    //     //     0,
    //     // );

    //     // Generate model
    //     const model = this._modelPool.add();
    //     this._batchedModels.push(model);
    //     model.setNode(this._dummyNode);
    //     // model.setEffect(material.effect);
    //     model.setInputAssembler(ia);
    //     model._viewID = this._currScreen!.visibility;
    //     model.setUserKey(this._currUserKey++);

    //     // const item = this._UIRenderItemPool.add();
    //     // item.model = model;
    //     // item.camera = this._currScreen!.camera;
    //     // cc.director._renderSystem._scene.addModel(model);

    //     // buffer!.byteStart = buffer!.byteOffset;
    //     // buffer!.indiceStart = buffer!.indiceOffset;
    //     // buffer!.vertexStart = buffer!.vertexOffset;
    // }

    private _renderScreens () {
        // this._renderComps.length = 0;
        for (const screen of this._screens) {
            if (!screen.enabledInHierarchy) {
                continue;
            }
            this._currScreen = screen;
            this._buffer!.reset();
            // const view = screen._view;
            // // let canvasWidth = screen.designResolution.width;
            // // let canvasHeight = screen.designResolution.height;
            // screen.node.getWorldRT(view._matView);
            // mat4.invert(view._matView, view._matView);
            // // let aspect = canvasWidth / canvasHeight;
            // const aspect = cc.game.canvas.width / cc.game.canvas.height;
            // // let orthoHeight = canvasHeight / 2;
            // const orthoHeight = cc.game.canvas.height / cc.view._scaleY / 2;
            // const x = orthoHeight * aspect;
            // const y = orthoHeight;
            // mat4.ortho(view._matProj,
            //     -x, x, -y, y, 0, 4096,
            // );

            // // mat4.ortho(view._matProj, 0, canvasWidth, 0, canvasHeight, -100, 100);
            // mat4.mul(view._matViewProj, view._matProj, view._matView);
            // // mat4.copy(view._matViewProj, view._matProj);
            // mat4.invert(view._matInvViewProj, view._matViewProj);
            // view._rect.x = view._rect.y = 0;
            // // view._rect.w = cc.game._renderer._device._gl.canvas.width;
            // // view._rect.h = cc.game._renderer._device._gl.canvas.height;
            // view._rect.w = cc.game.canvas.width;
            // view._rect.h = cc.game.canvas.height;

            this._walk(screen.node, (c) => {
                const image = c.getComponent(SpriteComponent);
                if (image && image.enabledInHierarchy) {
                    this._commitComp(image);
                    // this._renderComps.push(image);
                }

                const label = c.getComponent(LabelComponent);
                if (label && label.enabledInHierarchy) {
                    this._commitComp(label);
                    // this._renderComps.push(label);
                }
            }, null);

            // this.flush();

            this._emit(
                new Float32Array(this._buffer!.vData!.buffer, 0, this._buffer!.byteOffset >> 2),
                new Uint16Array(this._buffer!.iData!.buffer, 0, this._buffer!.indiceOffset),
            );
        }
    }

    private _commitComp (comp) {
        // if ((this._currMaterail && this._currMaterail.hash !== comp.material.hash)
        //     || this._currSpriteFrame !== comp.spriteFrame) {
        //     this.flush();
        //     this._dummyNode = comp.node;
        //     this._currMaterail = comp.material;
        //     this._currSpriteFrame = comp.spriteFrame;
        // }
        comp.updateRenderData(this._buffer);
    }

    private _reset () {
        // for (const model of this._batchedModels) {
        //     cc.director._renderSystem._scene.removeModel(model);
        // }

        this._modelPool.reset();
        // this._iaPool.reset();
        this._batchedModels.length = 0;
    }

    private _emit (vertecies: Float32Array, indecies: Uint16Array) {
        // return this._batchedModels;

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

// function _setStencil (mat, enabled, func, ref, mask, failOp, zFailOp, zPassOp, writeMask) {
//     const tech = mat.effect.getTechnique(0);
//     for (let i = 0; i < tech.passes.length; ++i) {
//         const pass = tech.passes[i];
//         pass.setStencilFront(
//             enabled, func, ref, mask, failOp, zFailOp, zPassOp, writeMask,
//         );
//         pass.setStencilBack(
//             enabled, func, ref, mask, failOp, zFailOp, zPassOp, writeMask,
//         );
//     }
// }
