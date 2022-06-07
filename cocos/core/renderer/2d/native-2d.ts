import { RenderEntity } from '../../../2d/renderer/render-entity';
import { Material } from '../../assets';
import { Attribute, Device, Sampler, SamplerInfo, Texture } from '../../gfx';
import { EmptyTexture } from '../../gfx/empty/empty-texture';
import { Node } from '../../scene-graph';

export class NativeRenderEntity {
    constructor (batcher: NativeBatcher2d) {}

    get bufferId ():number { return 0; }
    set bufferId (bufferId:number) {}

    get vertexOffset ():number { return 0; }
    set vertexOffset (vertexOffset:number) {}

    get indexOffset ():number { return 0; }
    set indexOffset (indexOffset:number) {}

    get vbBuffer ():ArrayBufferLike { return new ArrayBuffer(0); }
    set vbBuffer (vbBuffer:ArrayBufferLike) {}

    get vDataBuffer ():ArrayBufferLike { return new ArrayBuffer(0); }
    set vDataBuffer (vDataBuffer:ArrayBufferLike) {}

    get iDataBuffer ():ArrayBufferLike { return new ArrayBuffer(0); }
    set iDataBuffer (iDataBuffer:ArrayBufferLike) {}

    get node ():Node { return new Node(); }
    set node (node:Node) {}

    get vertDirty ():boolean { return false; }
    set vertDirty (val:boolean) {}

    get dataHash ():number { return 0; }
    set dataHash (dataHash:number) {}

    get stencilStage (): number { return 0; }
    set stencilStage (stencilStage:number) {}

    get isMeshBuffer ():boolean { return false; }
    set isMeshBuffer (isMeshBuffer:boolean) {}

    get material ():Material { return new Material(); }
    set material (material:Material) {}

    get texture (): Texture { return new EmptyTexture(); }
    set texture (texture:Texture) {}

    get textureHash (): number { return 0; }
    set textureHash (textureHash:number) {}

    get sampler ():Sampler { return new Sampler(new SamplerInfo(), 0); }
    set sampler (sampler:Sampler) {}

    get blendHash (): number { return 0; }
    set blendHash (blendHash:number) {}

    //setAdvanceRenderDataArr (dataArr: NativeAdvanceRenderData[]) {}
    setRender2dBufferToNative (data:TypedArray, stride:number, size:number) {}
    syncSharedBufferToNative (data:TypedArray) {}
}

export class NativeUIMeshBuffer {
    get vData () { return new Float32Array(); }
    set vData (val:Float32Array) {}

    get iData () { return new Uint16Array(); }
    set iData (val:Uint16Array) {}

    syncSharedBufferToNative (data:TypedArray) {}

    initialize (device:Device,  attrs: Attribute[], vFloatCount: number, iCount: number) {}
    reset () {}
    destroy () {}
    setDirty () {}
    recycleIA () {}
    uploadBuffers () {}
}

export class NativeBatcher2d {
    syncMeshBuffersToNative (buffers: NativeUIMeshBuffer[], length:number) {}
    syncRenderEntitiesToNative (renderEntities: NativeRenderEntity[]) {}
    //syncMeshBufferAttrToNative (data:TypedArray, stride:number, size:number) {}
    ItIsDebugFuncInBatcher2d () {}

    update () {}
    uploadBuffers () {}
    reset () {}
}

export class NativeAdvanceRenderData {
    ParseRender2dData (data:TypedArray) {}

    get x () { return 0; }
    set x (val) {}

    get y () { return 0; }
    set y (val) {}

    get z () { return 0; }
    set z (val) {}

    get u () { return 0; }
    set u (val) {}

    get v () { return 0; }
    set v (val) {}

    get colorR () { return 0; }
    set colorR (val) {}

    get colorG () { return 0; }
    set colorG (val) {}

    get colorB () { return 0; }
    set colorB (val) {}

    get colorA () { return 0; }
    set colorA (val) {}
}
