import { Material } from '../../core/assets';
import { Attribute, Device, Sampler, Texture } from '../../core/gfx';
import { Node } from '../../core/scene-graph';
import { Model } from '../../core/renderer/scene';

export declare class NativeRenderDrawInfo {
    constructor();

    get vbBuffer(): ArrayBufferLike;
    set vbBuffer(vbBuffer: ArrayBufferLike);

    get ibBuffer(): ArrayBufferLike;
    set ibBuffer(ibBuffer: ArrayBufferLike);

    get vDataBuffer(): ArrayBufferLike;
    set vDataBuffer(vDataBuffer: ArrayBufferLike);

    get iDataBuffer(): ArrayBufferLike;
    set iDataBuffer(iDataBuffer: ArrayBufferLike);

    get material(): Material | null;
    set material(material: Material | null);

    get texture(): Texture | null;
    set texture(texture: Texture | null);

    get sampler(): Sampler | null;
    set sampler(sampler: Sampler | null);

    get model(): Model | null;
    set model(model: Model | null);

    get subNode(): Node;
    set subNode(node: Node);

    changeMeshBuffer();
    setRender2dBufferToNative(data: TypedArray);
    syncSharedBufferToNative(data: TypedArray);
    getAttrSharedBufferForJS(): ArrayBufferLike;
}

export declare class NativeRenderEntity {
    constructor();

    addDynamicRenderDrawInfo(drawInfo: NativeRenderDrawInfo);
    setDynamicRenderDrawInfo(drawInfo: NativeRenderDrawInfo, index: number);
    removeDynamicRenderDrawInfo();
    clearDynamicRenderDrawInfos();

    get isMask(): boolean;
    set isMask(val: boolean);

    get isSubMask(): boolean;
    set isSubMask(val: boolean);

    get isMaskInverted(): boolean;
    set isMaskInverted(val: boolean);

    get node(): Node | null;
    set node(node: Node | null);

    get stencilStage(): number;
    set stencilStage(stage: number);

    get staticDrawInfoSize(): number;
    set staticDrawInfoSize(size: number);

    get useLocal(): boolean;
    set useLocal(val: boolean);

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
    syncRootNodesToNative(nodes: Node[]);
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
