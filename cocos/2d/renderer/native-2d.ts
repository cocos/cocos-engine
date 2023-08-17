/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Material } from '../../asset/assets';
import { Attribute, Device, Sampler, Texture } from '../../gfx';
import { Node } from '../../scene-graph';
import { Model } from '../../render-scene/scene';

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
    constructor(type: number);

    addDynamicRenderDrawInfo(drawInfo: NativeRenderDrawInfo);
    setDynamicRenderDrawInfo(drawInfo: NativeRenderDrawInfo, index: number);
    removeDynamicRenderDrawInfo();
    clearDynamicRenderDrawInfos();
    clearStaticRenderDrawInfos();

    get node(): Node | null;
    set node(node: Node | null);

    get renderTransform(): Node | null;
    set renderTransform(node: Node | null);

    get stencilStage(): number;
    set stencilStage(stage: number);

    get staticDrawInfoSize(): number;
    set staticDrawInfoSize(size: number);

    getStaticRenderDrawInfo(index: number): NativeRenderDrawInfo;
    getEntitySharedBufferForJS(): ArrayBufferLike;
}

export declare class NativeUIMeshBuffer {
    get vData(): Float32Array;
    set vData(val: Float32Array);
    get iData(): Uint16Array;
    set iData(val: Uint16Array);

    syncSharedBufferToNative(data: TypedArray);

    initialize(attrs: Attribute[]);
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
    activeSubModels();
    uploadData();
    destroy();
    clear();
    getModel(): Model;
    updateModels(model);
    attachDrawInfo();
    attachNode(node);
    clearModels();
}

export declare class NativeStencilManager {
    setStencilStage(stageIndex: number);
    getStencilSharedBufferForJS(): ArrayBufferLike;
}
