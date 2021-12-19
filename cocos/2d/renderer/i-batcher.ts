import { CachedArray, Material, Node } from '../../core';
import { TextureBase } from '../../core/assets/texture-base';
import { Device } from '../../core/gfx';
import { Attribute } from '../../core/gfx/base/define';
import { Camera } from '../../core/renderer/scene/camera';
import { Model } from '../../core/renderer/scene/model';
import { SpriteFrame } from '../assets/sprite-frame';
import { UIStaticBatch } from '../components/ui-static-batch';
import { Renderable2D, RenderRoot2D, UIComponent } from '../framework';
import { LinearBufferAccessor } from './linear-buffer-accessor';
import { DrawBatch2D } from './draw-batch';

export interface IBatcher {
    currBufferAccessor: LinearBufferAccessor;
    readonly batches: CachedArray<DrawBatch2D>;
    // registerCustomBuffer (attributes: MeshBuffer | Attribute[], callback: ((...args: number[]) => void) | null) : MeshBuffer;
    // unRegisterCustomBuffer (buffer: MeshBuffer);

    currStaticRoot: UIStaticBatch | null;
    currIsStatic: boolean;

    device: Device;

    initialize(): boolean;
    destroy();

    addScreen (comp: RenderRoot2D);
    getFirstRenderCamera (node: Node): Camera | null;
    removeScreen (comp: RenderRoot2D);

    sortScreens ();

    update ();
    uploadBuffers ();
    reset ();

    switchBufferAccessor (attributes?: Attribute[]): LinearBufferAccessor;

    commitComp (comp: Renderable2D, frame: TextureBase | SpriteFrame | null, assembler: any, transform: Node | null);
    commitModel (comp: UIComponent | Renderable2D, model: Model | null, mat: Material | null);

    setupStaticBatch (staticComp: UIStaticBatch, bufferAccessor: LinearBufferAccessor);
    endStaticBatch ();
    commitStaticBatch (comp: UIStaticBatch);

    autoMergeBatches (renderComp?: Renderable2D);
    forceMergeBatches (material: Material, frame: TextureBase | SpriteFrame | null, renderComp: Renderable2D);
    finishMergeBatches ();
    flushMaterial (mat: Material);

    walk (node: Node, level?: number);
}
