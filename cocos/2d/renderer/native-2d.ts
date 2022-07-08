import { Material } from '../../core/assets';
import { Attribute, Device, Sampler, Texture } from '../../core/gfx';
import { Node } from '../../core/scene-graph';
import { Model } from '../../core/renderer/scene';

export declare class NativeRenderDrawInfo {
    constructor(batcher: NativeBatcher2d);

    // get batcher ():NativeBatcher2d { return new NativeBatcher2d(); }
    // set batcher (batcher: NativeBatcher2d) {}

    get accId(): number;
    set accId(accId: number);

    get bufferId(): number;
    set bufferId(bufferId: number);

    get vertexOffset(): number;
    set vertexOffset(vertexOffset: number);

    get indexOffset(): number;
    set indexOffset(indexOffset: number);

    get vbBuffer(): ArrayBufferLike;
    set vbBuffer(vbBuffer: ArrayBufferLike);

    get ibBuffer(): ArrayBufferLike;
    set ibBuffer(ibBuffer: ArrayBufferLike);

    get vDataBuffer(): ArrayBufferLike;
    set vDataBuffer(vDataBuffer: ArrayBufferLike);

    get iDataBuffer(): ArrayBufferLike;
    set iDataBuffer(iDataBuffer: ArrayBufferLike);

    get vbCount(): number;
    set vbCount(vbCount: number);

    get ibCount(): number;
    set ibCount(ibCount: number);

    get vertDirty(): boolean;
    set vertDirty(val: boolean);

    get dataHash(): number;
    set dataHash(dataHash: number);

    get isMeshBuffer(): boolean;
    set isMeshBuffer(isMeshBuffer: boolean);

    get material(): Material | null;
    set material(material: Material | null);

    get texture(): Texture | null;
    set texture(texture: Texture | null);

    get textureHash(): number;
    set textureHash(textureHash: number);

    get sampler(): Sampler | null;
    set sampler(sampler: Sampler | null);

    get blendHash(): number;
    set blendHash(blendHash: number);

    get model(): Model | null;
    set model(model: Model | null);

    setRender2dBufferToNative(data: TypedArray, stride: number, size: number);
    syncSharedBufferToNative(data: TypedArray);
    getAttrSharedBufferForJS(): ArrayBufferLike;
}

export declare class NativeRenderEntity {
    constructor(batcher: NativeBatcher2d);

    addDynamicRenderDrawInfo(drawInfo: NativeRenderDrawInfo);
    setDynamicRenderDrawInfo(drawInfo: NativeRenderDrawInfo, index: number);
    removeDynamicRenderDrawInfo();

    get isMask(): boolean;
    set isMask(val: boolean);

    get isSubMask(): boolean;
    set isSubMask(val: boolean);

    get isMaskInverted():boolean;
    set isMaskInverted(val:boolean);

    get node(): Node | null;
    set node(node: Node | null);

    get stencilStage(): number;
    set stencilStage(stage: number);

    get customMaterial(): Material;
    set customMaterial(mat: Material);

    get commitModelMaterial(): Material;
    set commitModelMaterial(mat: Material);

    get staticDrawInfoSize(): number;
    set staticDrawInfoSize(size: number);

    setRenderEntityType(type: number);
    getStaticRenderDrawInfo(index: number): NativeRenderDrawInfo;
    getEntitySharedBufferForJS(): ArrayBufferLike;
}

export declare class NativeUIMeshBuffer {
    get vData(): Float32Array;
    set vData(val: Float32Array);
    get iData(): Uint16Array;
    set iData(val: Uint16Array);

    syncSharedBufferToNative(data: TypedArray);

    initialize(device: Device, attrs: Attribute[], vFloatCount: number, iCount: number);
    reset();
    destroy();
    setDirty();
    recycleIA();
    uploadBuffers();
}

export declare class NativeBatcher2d {
    syncMeshBuffersToNative(accId: number, buffers: NativeUIMeshBuffer[]);
    update();
    uploadBuffers();
    reset();
    addRootNode(node: Node);
    releaseDescriptorSetCache(texture: Texture, sampler: Sampler);
}

export declare class NativeUIModelProxy {
    initModel(node);
    activeSubModel(index: number);
    uploadData();
    destroy();
    clear();
    updateModels(model);
    attachDrawInfo();
    attachNode(node);
}

export declare class NativeStencilManager {
    setStencilStage(stageIndex: number);
    getStencilSharedBufferForJS(): ArrayBufferLike;
}
