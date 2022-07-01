import { director } from '../..';
import { Batcher2D } from '../../../2d/renderer/batcher-2d';
import { RenderDrawInfo } from '../../../2d/renderer/render-draw-info';
import { Material } from '../../assets';
import { Attribute, Device, Sampler, SamplerInfo, Texture } from '../../gfx';
import { EmptyTexture } from '../../gfx/empty/empty-texture';
import { Root } from '../../root';
import { Node } from '../../scene-graph';
import { Model } from '../scene';

export class NativeRenderDrawInfo {
    constructor (batcher: NativeBatcher2d) { }

    // get batcher ():NativeBatcher2d { return new NativeBatcher2d(); }
    // set batcher (batcher: NativeBatcher2d) {}

    get bufferId (): number { return 0; }
    set bufferId (bufferId: number) { }

    get vertexOffset (): number { return 0; }
    set vertexOffset (vertexOffset: number) { }

    get indexOffset (): number { return 0; }
    set indexOffset (indexOffset: number) { }

    get vbBuffer (): ArrayBufferLike { return new ArrayBuffer(0); }
    set vbBuffer (vbBuffer: ArrayBufferLike) { }

    get ibBuffer (): ArrayBufferLike { return new ArrayBuffer(0); }
    set ibBuffer (ibBuffer: ArrayBufferLike) { }

    get vDataBuffer (): ArrayBufferLike { return new ArrayBuffer(0); }
    set vDataBuffer (vDataBuffer: ArrayBufferLike) { }

    get iDataBuffer (): ArrayBufferLike { return new ArrayBuffer(0); }
    set iDataBuffer (iDataBuffer: ArrayBufferLike) { }

    get vbCount (): number { return 0; }
    set vbCount (vbCount: number) { }

    get ibCount (): number { return 0; }
    set ibCount (ibCount: number) { }

    get node (): Node { return new Node(); }
    set node (node: Node) { }

    get vertDirty (): boolean { return false; }
    set vertDirty (val: boolean) { }

    get dataHash (): number { return 0; }
    set dataHash (dataHash: number) { }

    get stencilStage (): number { return 0; }
    set stencilStage (stencilStage: number) { }

    get isMeshBuffer (): boolean { return false; }
    set isMeshBuffer (isMeshBuffer: boolean) { }

    get material (): Material { return new Material(); }
    set material (material: Material) { }

    get texture (): Texture { return new EmptyTexture(); }
    set texture (texture: Texture) { }

    get textureHash (): number { return 0; }
    set textureHash (textureHash: number) { }

    get sampler (): Sampler { return new Sampler(new SamplerInfo(), 0); }
    set sampler (sampler: Sampler) { }

    get blendHash (): number { return 0; }
    set blendHash (blendHash: number) { }

    get model (): Model { return new Model(); }
    set model (model: Model) { }

    setRender2dBufferToNative (data: TypedArray, stride: number, size: number, type: number) { }
    syncSharedBufferToNative (data: TypedArray) { }

    getAttrSharedBufferForJS (): ArrayBufferLike { return new ArrayBuffer(0); }
}

export class NativeRenderEntity {
    constructor (batcher: NativeBatcher2d) { }

    addDynamicRenderDrawInfo (drawInfo: NativeRenderDrawInfo) { }
    setDynamicRenderDrawInfo (drawInfo: NativeRenderDrawInfo, index: number) { }
    removeDynamicRenderDrawInfo () { }

    get node (): Node { return new Node(); }
    set node (node: Node) { }

    get staticDrawInfoSize (): number { return 0; }
    set staticDrawInfoSize (size: number) { }

    setRenderEntityType (type: number) { }

    getStaticRenderDrawInfo (index: number): NativeRenderDrawInfo {
        const batcher = director.root!.batcher2D;
        return new NativeRenderDrawInfo(batcher.nativeObj);
    }

    getEntitySharedBufferForJS (): ArrayBufferLike { return new ArrayBuffer(0); }
}

export class NativeUIMeshBuffer {
    get vData () { return new Float32Array(); }
    set vData (val: Float32Array) { }

    get iData () { return new Uint16Array(); }
    set iData (val: Uint16Array) { }

    syncSharedBufferToNative (data: TypedArray) { }

    initialize (device: Device, attrs: Attribute[], vFloatCount: number, iCount: number) { }
    reset () { }
    destroy () { }
    setDirty () { }
    recycleIA () { }
    uploadBuffers () { }
}

export class NativeBatcher2d {
    syncMeshBuffersToNative (buffers: NativeUIMeshBuffer[], length: number) { }

    update () { }
    uploadBuffers () { }
    reset () { }

    addRootNode (node: Node) { }
}

export class NativeUIModelProxy {
    initModel (node) { }
    activeSubModel (index: number) { }
    uploadData () { }
    destroy () { }
    clear () { }
    updateModels (model) { }
    attachDrawInfo () { }
    attachNode (node) { }
}
