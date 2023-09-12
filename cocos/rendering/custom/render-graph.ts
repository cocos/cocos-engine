/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { AdjI, AdjacencyGraph, BidirectionalGraph, ComponentGraph, ED, InEI, MutableGraph, MutableReferenceGraph, NamedGraph, OutE, OutEI, PolymorphicGraph, PropertyGraph, PropertyMap, ReferenceGraph, UuidGraph, VertexListGraph, directional, parallel, reindexEdgeList, traversal } from './graph';
import { Material } from '../../asset/assets';
import { Camera } from '../../render-scene/scene/camera';
import { AccessFlagBit, Buffer, ClearFlagBit, Color, Format, Framebuffer, LoadOp, RenderPass, SampleCount, Sampler, SamplerInfo, ShaderStageFlagBit, StoreOp, Swapchain, Texture, TextureFlagBit, TextureType, Viewport } from '../../gfx';
import { AccessType, AttachmentType, ClearValueType, CopyPair, LightInfo, MovePair, QueueHint, ResolvePair, ResourceDimension, ResourceFlags, ResourceResidency, SceneFlags, UploadPair, RenderCommonObjectPool } from './types';
import { RenderScene } from '../../render-scene/core/render-scene';
import { RenderWindow } from '../../render-scene/core/render-window';
import { Light } from '../../render-scene/scene';
import { RecyclePool } from '../../core/memop';

export class ClearValue {
    constructor (x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    reset (x = 0, y = 0, z = 0, w = 0): void {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    x: number;
    y: number;
    z: number;
    w: number;
}

export class RasterView {
    constructor (
        slotName = '',
        accessType: AccessType = AccessType.WRITE,
        attachmentType: AttachmentType = AttachmentType.RENDER_TARGET,
        loadOp: LoadOp = LoadOp.LOAD,
        storeOp: StoreOp = StoreOp.STORE,
        clearFlags: ClearFlagBit = ClearFlagBit.ALL,
        clearColor: Color = new Color(),
        shaderStageFlags: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
    ) {
        this.slotName = slotName;
        this.accessType = accessType;
        this.attachmentType = attachmentType;
        this.loadOp = loadOp;
        this.storeOp = storeOp;
        this.clearFlags = clearFlags;
        this.clearColor = clearColor;
        this.shaderStageFlags = shaderStageFlags;
    }
    reset (
        slotName = '',
        accessType: AccessType = AccessType.WRITE,
        attachmentType: AttachmentType = AttachmentType.RENDER_TARGET,
        loadOp: LoadOp = LoadOp.LOAD,
        storeOp: StoreOp = StoreOp.STORE,
        clearFlags: ClearFlagBit = ClearFlagBit.ALL,
        shaderStageFlags: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
    ): void {
        this.slotName = slotName;
        this.slotName1 = '';
        this.accessType = accessType;
        this.attachmentType = attachmentType;
        this.loadOp = loadOp;
        this.storeOp = storeOp;
        this.clearFlags = clearFlags;
        this.clearColor.reset();
        this.slotID = 0;
        this.shaderStageFlags = shaderStageFlags;
    }
    slotName: string;
    slotName1 = '';
    accessType: AccessType;
    attachmentType: AttachmentType;
    loadOp: LoadOp;
    storeOp: StoreOp;
    clearFlags: ClearFlagBit;
    readonly clearColor: Color;
    slotID = 0;
    shaderStageFlags: ShaderStageFlagBit;
}

export class ComputeView {
    constructor (
        name = '',
        accessType: AccessType = AccessType.READ,
        clearFlags: ClearFlagBit = ClearFlagBit.NONE,
        clearValueType: ClearValueType = ClearValueType.NONE,
        clearValue: ClearValue = new ClearValue(),
        shaderStageFlags: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
    ) {
        this.name = name;
        this.accessType = accessType;
        this.clearFlags = clearFlags;
        this.clearValueType = clearValueType;
        this.clearValue = clearValue;
        this.shaderStageFlags = shaderStageFlags;
    }
    reset (
        name = '',
        accessType: AccessType = AccessType.READ,
        clearFlags: ClearFlagBit = ClearFlagBit.NONE,
        clearValueType: ClearValueType = ClearValueType.NONE,
        shaderStageFlags: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
    ): void {
        this.name = name;
        this.accessType = accessType;
        this.plane = 0;
        this.clearFlags = clearFlags;
        this.clearValueType = clearValueType;
        this.clearValue.reset();
        this.shaderStageFlags = shaderStageFlags;
    }
    name: string;
    accessType: AccessType;
    plane = 0;
    clearFlags: ClearFlagBit;
    clearValueType: ClearValueType;
    readonly clearValue: ClearValue;
    shaderStageFlags: ShaderStageFlagBit;
}

export class ResourceDesc {
    reset (): void {
        this.dimension = ResourceDimension.BUFFER;
        this.alignment = 0;
        this.width = 0;
        this.height = 0;
        this.depthOrArraySize = 0;
        this.mipLevels = 0;
        this.format = Format.UNKNOWN;
        this.sampleCount = SampleCount.X1;
        this.textureFlags = TextureFlagBit.NONE;
        this.flags = ResourceFlags.NONE;
        this.viewType = TextureType.TEX2D;
    }
    dimension: ResourceDimension = ResourceDimension.BUFFER;
    alignment = 0;
    width = 0;
    height = 0;
    depthOrArraySize = 0;
    mipLevels = 0;
    format: Format = Format.UNKNOWN;
    sampleCount: SampleCount = SampleCount.X1;
    textureFlags: TextureFlagBit = TextureFlagBit.NONE;
    flags: ResourceFlags = ResourceFlags.NONE;
    viewType: TextureType = TextureType.TEX2D;
}

export class ResourceTraits {
    constructor (residency: ResourceResidency = ResourceResidency.MANAGED) {
        this.residency = residency;
    }
    reset (residency: ResourceResidency = ResourceResidency.MANAGED): void {
        this.residency = residency;
    }
    residency: ResourceResidency;
}

export class RenderSwapchain {
    constructor (swapchain: Swapchain | null = null) {
        this.swapchain = swapchain;
    }
    reset (swapchain: Swapchain | null = null): void {
        this.swapchain = swapchain;
        this.renderWindow = null;
        this.currentID = 0;
        this.numBackBuffers = 0;
        this.generation = 0xFFFFFFFF;
    }
    /*pointer*/ swapchain: Swapchain | null;
    /*pointer*/ renderWindow: RenderWindow | null = null;
    currentID = 0;
    numBackBuffers = 0;
    generation = 0xFFFFFFFF;
}

export class ResourceStates {
    reset (): void {
        this.states = AccessFlagBit.NONE;
    }
    states: AccessFlagBit = AccessFlagBit.NONE;
}

export class ManagedBuffer {
    constructor (buffer: Buffer | null = null) {
        this.buffer = buffer;
    }
    reset (buffer: Buffer | null = null): void {
        this.buffer = buffer;
        this.fenceValue = 0;
    }
    /*refcount*/ buffer: Buffer | null;
    fenceValue = 0;
}

export class PersistentBuffer {
    constructor (buffer: Buffer | null = null) {
        this.buffer = buffer;
    }
    reset (buffer: Buffer | null = null): void {
        this.buffer = buffer;
        this.fenceValue = 0;
    }
    /*refcount*/ buffer: Buffer | null;
    fenceValue = 0;
}

export class ManagedTexture {
    constructor (texture: Texture | null = null) {
        this.texture = texture;
    }
    reset (texture: Texture | null = null): void {
        this.texture = texture;
        this.fenceValue = 0;
    }
    /*refcount*/ texture: Texture | null;
    fenceValue = 0;
}

export class PersistentTexture {
    constructor (texture: Texture | null = null) {
        this.texture = texture;
    }
    reset (texture: Texture | null = null): void {
        this.texture = texture;
        this.fenceValue = 0;
    }
    /*refcount*/ texture: Texture | null;
    fenceValue = 0;
}

export class ManagedResource {
    reset (): void {
        this.unused = 0;
    }
    unused = 0;
}

export class Subpass {
    reset (): void {
        this.rasterViews.clear();
        this.computeViews.clear();
        this.resolvePairs.length = 0;
    }
    readonly rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
    readonly resolvePairs: ResolvePair[] = [];
}

//=================================================================
// SubpassGraph
//=================================================================
// Graph Concept
export class SubpassGraphVertex {
    readonly _outEdges: OutE[] = [];
    readonly _inEdges: OutE[] = [];
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class SubpassGraphNameMap implements PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    set (v: number, names: string): void {
        this._names[v] = names;
    }
    readonly _names: string[];
}

export class SubpassGraphSubpassMap implements PropertyMap {
    constructor (readonly subpasses: Subpass[]) {
        this._subpasses = subpasses;
    }
    get (v: number): Subpass {
        return this._subpasses[v];
    }
    readonly _subpasses: Subpass[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum SubpassGraphComponent {
    Name,
    Subpass,
}

export interface SubpassGraphComponentType {
    [SubpassGraphComponent.Name]: string;
    [SubpassGraphComponent.Subpass]: Subpass;
}

export interface SubpassGraphComponentPropertyMap {
    [SubpassGraphComponent.Name]: SubpassGraphNameMap;
    [SubpassGraphComponent.Subpass]: SubpassGraphSubpassMap;
}

//-----------------------------------------------------------------
// SubpassGraph Implementation
export class SubpassGraph implements BidirectionalGraph
, AdjacencyGraph
, VertexListGraph
, MutableGraph
, PropertyGraph
, NamedGraph
, ComponentGraph {
    //-----------------------------------------------------------------
    // Graph
    // type vertex_descriptor = number;
    nullVertex (): number { return 0xFFFFFFFF; }
    // type edge_descriptor = ED;
    readonly directed_category: directional = directional.bidirectional;
    readonly edge_parallel_category: parallel = parallel.allow;
    readonly traversal_category: traversal = traversal.incidence
        | traversal.bidirectional
        | traversal.adjacency
        | traversal.vertex_list;
    //-----------------------------------------------------------------
    // IncidenceGraph
    // type out_edge_iterator = OutEI;
    // type degree_size_type = number;
    edge (u: number, v: number): boolean {
        for (const oe of this._vertices[u]._outEdges) {
            if (v === oe.target as number) {
                return true;
            }
        }
        return false;
    }
    source (e: ED): number {
        return e.source as number;
    }
    target (e: ED): number {
        return e.target as number;
    }
    outEdges (v: number): OutEI {
        return new OutEI(this._vertices[v]._outEdges.values(), v);
    }
    outDegree (v: number): number {
        return this._vertices[v]._outEdges.length;
    }
    //-----------------------------------------------------------------
    // BidirectionalGraph
    // type in_edge_iterator = InEI;
    inEdges (v: number): InEI {
        return new InEI(this._vertices[v]._inEdges.values(), v);
    }
    inDegree (v: number): number {
        return this._vertices[v]._inEdges.length;
    }
    degree (v: number): number {
        return this.outDegree(v) + this.inDegree(v);
    }
    //-----------------------------------------------------------------
    // AdjacencyGraph
    // type adjacency_iterator = AdjI;
    adjacentVertices (v: number): AdjI {
        return new AdjI(this, this.outEdges(v));
    }
    //-----------------------------------------------------------------
    // VertexListGraph
    vertices (): IterableIterator<number> {
        return this._vertices.keys();
    }
    numVertices (): number {
        return this._vertices.length;
    }
    //-----------------------------------------------------------------
    // EdgeListGraph
    numEdges (): number {
        let numEdges = 0;
        for (const v of this.vertices()) {
            numEdges += this.outDegree(v);
        }
        return numEdges;
    }
    //-----------------------------------------------------------------
    // MutableGraph
    clear (): void {
        // ComponentGraph
        this._names.length = 0;
        this._subpasses.length = 0;
        // Graph Vertices
        this._vertices.length = 0;
    }
    addVertex (
        name: string,
        subpass: Subpass,
    ): number {
        const vert = new SubpassGraphVertex();
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._names.push(name);
        this._subpasses.push(subpass);
        return v;
    }
    clearVertex (v: number): void {
        const vert = this._vertices[v];
        // clear out edges
        for (const oe of vert._outEdges) {
            const target = this._vertices[oe.target as number];
            for (let i = 0; i !== target._inEdges.length;) { // remove all edges
                if (target._inEdges[i].target === v) {
                    target._inEdges.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
        vert._outEdges.length = 0;

        // clear in edges
        for (const ie of vert._inEdges) {
            const source = this._vertices[ie.target as number];
            for (let i = 0; i !== source._outEdges.length;) { // remove all edges
                if (source._outEdges[i].target === v) {
                    source._outEdges.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
        vert._inEdges.length = 0;
    }
    removeVertex (u: number): void {
        this._vertices.splice(u, 1);
        this._names.splice(u, 1);
        this._subpasses.splice(u, 1);

        const sz = this._vertices.length;
        if (u === sz) {
            return;
        }

        for (let v = 0; v !== sz; ++v) {
            const vert = this._vertices[v];
            reindexEdgeList(vert._outEdges, u);
            reindexEdgeList(vert._inEdges, u);
        }
    }
    addEdge (u: number, v: number): ED | null {
        // update in/out edge list
        this._vertices[u]._outEdges.push(new OutE(v));
        this._vertices[v]._inEdges.push(new OutE(u));
        return new ED(u, v);
    }
    removeEdges (u: number, v: number): void {
        const source = this._vertices[u];
        // remove out edges of u
        for (let i = 0; i !== source._outEdges.length;) { // remove all edges
            if (source._outEdges[i].target === v) {
                source._outEdges.splice(i, 1);
            } else {
                ++i;
            }
        }
        // remove in edges of v
        const target = this._vertices[v];
        for (let i = 0; i !== target._inEdges.length;) { // remove all edges
            if (target._inEdges[i].target === u) {
                target._inEdges.splice(i, 1);
            } else {
                ++i;
            }
        }
    }
    removeEdge (e: ED): void {
        const u = e.source as number;
        const v = e.target as number;
        const source = this._vertices[u];
        for (let i = 0; i !== source._outEdges.length;) {
            if (source._outEdges[i].target === v) {
                source._outEdges.splice(i, 1);
                break; // remove one edge
            } else {
                ++i;
            }
        }
        const target = this._vertices[v];
        for (let i = 0; i !== target._inEdges.length;) {
            if (target._inEdges[i].target === u) {
                target._inEdges.splice(i, 1);
                break; // remove one edge
            } else {
                ++i;
            }
        }
    }
    //-----------------------------------------------------------------
    // NamedGraph
    vertexName (v: number): string {
        return this._names[v];
    }
    vertexNameMap (): SubpassGraphNameMap {
        return new SubpassGraphNameMap(this._names);
    }
    //-----------------------------------------------------------------
    // PropertyGraph
    get (tag: string): SubpassGraphNameMap | SubpassGraphSubpassMap {
        switch (tag) {
        // Components
        case 'Name':
            return new SubpassGraphNameMap(this._names);
        case 'Subpass':
            return new SubpassGraphSubpassMap(this._subpasses);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends SubpassGraphComponent> (id: T, v: number): SubpassGraphComponentType[T] {
        switch (id) {
        case SubpassGraphComponent.Name:
            return this._names[v] as SubpassGraphComponentType[T];
        case SubpassGraphComponent.Subpass:
            return this._subpasses[v] as SubpassGraphComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends SubpassGraphComponent> (id: T): SubpassGraphComponentPropertyMap[T] {
        switch (id) {
        case SubpassGraphComponent.Name:
            return new SubpassGraphNameMap(this._names) as SubpassGraphComponentPropertyMap[T];
        case SubpassGraphComponent.Subpass:
            return new SubpassGraphSubpassMap(this._subpasses) as SubpassGraphComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._names[v];
    }
    setName (v: number, value: string): void {
        this._names[v] = value;
    }
    getSubpass (v: number): Subpass {
        return this._subpasses[v];
    }

    readonly components: string[] = ['Name', 'Subpass'];
    readonly _vertices: SubpassGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _subpasses: Subpass[] = [];
}

export class RasterSubpass {
    constructor (subpassID = 0xFFFFFFFF, count = 1, quality = 0) {
        this.subpassID = subpassID;
        this.count = count;
        this.quality = quality;
    }
    reset (subpassID = 0xFFFFFFFF, count = 1, quality = 0): void {
        this.rasterViews.clear();
        this.computeViews.clear();
        this.resolvePairs.length = 0;
        this.viewport.reset();
        this.subpassID = subpassID;
        this.count = count;
        this.quality = quality;
        this.showStatistics = false;
    }
    readonly rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
    readonly resolvePairs: ResolvePair[] = [];
    readonly viewport: Viewport = new Viewport();
    subpassID: number;
    count: number;
    quality: number;
    showStatistics = false;
}

export class ComputeSubpass {
    constructor (subpassID = 0xFFFFFFFF) {
        this.subpassID = subpassID;
    }
    reset (subpassID = 0xFFFFFFFF): void {
        this.rasterViews.clear();
        this.computeViews.clear();
        this.subpassID = subpassID;
    }
    readonly rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
    subpassID: number;
}

export class RasterPass {
    reset (): void {
        this.rasterViews.clear();
        this.computeViews.clear();
        this.attachmentIndexMap.clear();
        this.textures.clear();
        this.subpassGraph.clear();
        this.width = 0;
        this.height = 0;
        this.count = 1;
        this.quality = 0;
        this.viewport.reset();
        this.versionName = '';
        this.version = 0;
        this.hashValue = 0;
        this.showStatistics = false;
    }
    readonly rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
    readonly attachmentIndexMap: Map<string, number> = new Map<string, number>();
    readonly textures: Map<string, ShaderStageFlagBit> = new Map<string, ShaderStageFlagBit>();
    readonly subpassGraph: SubpassGraph = new SubpassGraph();
    width = 0;
    height = 0;
    count = 1;
    quality = 0;
    readonly viewport: Viewport = new Viewport();
    versionName = '';
    version = 0;
    hashValue = 0;
    showStatistics = false;
}

export class PersistentRenderPassAndFramebuffer {
    constructor (renderPass: RenderPass | null = null, framebuffer: Framebuffer | null = null) {
        this.renderPass = renderPass;
        this.framebuffer = framebuffer;
    }
    reset (renderPass: RenderPass | null = null, framebuffer: Framebuffer | null = null): void {
        this.renderPass = renderPass;
        this.framebuffer = framebuffer;
        this.clearColors.length = 0;
        this.clearDepth = 0;
        this.clearStencil = 0;
    }
    /*refcount*/ renderPass: RenderPass | null;
    /*refcount*/ framebuffer: Framebuffer | null;
    readonly clearColors: Color[] = [];
    clearDepth = 0;
    clearStencil = 0;
}

export class FormatView {
    reset (): void {
        this.format = Format.UNKNOWN;
    }
    format: Format = Format.UNKNOWN;
}

export class SubresourceView {
    reset (): void {
        this.textureView = null;
        this.format = Format.UNKNOWN;
        this.indexOrFirstMipLevel = 0;
        this.numMipLevels = 0;
        this.firstArraySlice = 0;
        this.numArraySlices = 0;
        this.firstPlane = 0;
        this.numPlanes = 0;
    }
    /*refcount*/ textureView: Texture | null = null;
    format: Format = Format.UNKNOWN;
    indexOrFirstMipLevel = 0;
    numMipLevels = 0;
    firstArraySlice = 0;
    numArraySlices = 0;
    firstPlane = 0;
    numPlanes = 0;
}

//=================================================================
// ResourceGraph
//=================================================================
// PolymorphicGraph Concept
export const enum ResourceGraphValue {
    Managed,
    ManagedBuffer,
    ManagedTexture,
    PersistentBuffer,
    PersistentTexture,
    Framebuffer,
    Swapchain,
    FormatView,
    SubresourceView,
}

export function getResourceGraphValueName (e: ResourceGraphValue): string {
    switch (e) {
    case ResourceGraphValue.Managed: return 'Managed';
    case ResourceGraphValue.ManagedBuffer: return 'ManagedBuffer';
    case ResourceGraphValue.ManagedTexture: return 'ManagedTexture';
    case ResourceGraphValue.PersistentBuffer: return 'PersistentBuffer';
    case ResourceGraphValue.PersistentTexture: return 'PersistentTexture';
    case ResourceGraphValue.Framebuffer: return 'Framebuffer';
    case ResourceGraphValue.Swapchain: return 'Swapchain';
    case ResourceGraphValue.FormatView: return 'FormatView';
    case ResourceGraphValue.SubresourceView: return 'SubresourceView';
    default: return '';
    }
}

export interface ResourceGraphValueType {
    [ResourceGraphValue.Managed]: ManagedResource
    [ResourceGraphValue.ManagedBuffer]: ManagedBuffer
    [ResourceGraphValue.ManagedTexture]: ManagedTexture
    [ResourceGraphValue.PersistentBuffer]: PersistentBuffer
    [ResourceGraphValue.PersistentTexture]: PersistentTexture
    [ResourceGraphValue.Framebuffer]: Framebuffer
    [ResourceGraphValue.Swapchain]: RenderSwapchain
    [ResourceGraphValue.FormatView]: FormatView
    [ResourceGraphValue.SubresourceView]: SubresourceView
}

export interface ResourceGraphVisitor {
    managed(value: ManagedResource): unknown;
    managedBuffer(value: ManagedBuffer): unknown;
    managedTexture(value: ManagedTexture): unknown;
    persistentBuffer(value: PersistentBuffer): unknown;
    persistentTexture(value: PersistentTexture): unknown;
    framebuffer(value: Framebuffer): unknown;
    swapchain(value: RenderSwapchain): unknown;
    formatView(value: FormatView): unknown;
    subresourceView(value: SubresourceView): unknown;
}

export type ResourceGraphObject = ManagedResource
| ManagedBuffer
| ManagedTexture
| PersistentBuffer
| PersistentTexture
| Framebuffer
| RenderSwapchain
| FormatView
| SubresourceView;

//-----------------------------------------------------------------
// Graph Concept
export class ResourceGraphVertex {
    constructor (
        readonly id: ResourceGraphValue,
        readonly object: ResourceGraphObject,
    ) {
        this._id = id;
        this._object = object;
    }
    readonly _outEdges: OutE[] = [];
    readonly _inEdges: OutE[] = [];
    readonly _id: ResourceGraphValue;
    _object: ResourceGraphObject;
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class ResourceGraphNameMap implements PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    set (v: number, names: string): void {
        this._names[v] = names;
    }
    readonly _names: string[];
}

export class ResourceGraphDescMap implements PropertyMap {
    constructor (readonly descs: ResourceDesc[]) {
        this._descs = descs;
    }
    get (v: number): ResourceDesc {
        return this._descs[v];
    }
    readonly _descs: ResourceDesc[];
}

export class ResourceGraphTraitsMap implements PropertyMap {
    constructor (readonly traits: ResourceTraits[]) {
        this._traits = traits;
    }
    get (v: number): ResourceTraits {
        return this._traits[v];
    }
    readonly _traits: ResourceTraits[];
}

export class ResourceGraphStatesMap implements PropertyMap {
    constructor (readonly states: ResourceStates[]) {
        this._states = states;
    }
    get (v: number): ResourceStates {
        return this._states[v];
    }
    readonly _states: ResourceStates[];
}

export class ResourceGraphSamplerMap implements PropertyMap {
    constructor (readonly samplerInfo: SamplerInfo[]) {
        this._samplerInfo = samplerInfo;
    }
    get (v: number): SamplerInfo {
        return this._samplerInfo[v];
    }
    readonly _samplerInfo: SamplerInfo[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum ResourceGraphComponent {
    Name,
    Desc,
    Traits,
    States,
    Sampler,
}

export interface ResourceGraphComponentType {
    [ResourceGraphComponent.Name]: string;
    [ResourceGraphComponent.Desc]: ResourceDesc;
    [ResourceGraphComponent.Traits]: ResourceTraits;
    [ResourceGraphComponent.States]: ResourceStates;
    [ResourceGraphComponent.Sampler]: SamplerInfo;
}

export interface ResourceGraphComponentPropertyMap {
    [ResourceGraphComponent.Name]: ResourceGraphNameMap;
    [ResourceGraphComponent.Desc]: ResourceGraphDescMap;
    [ResourceGraphComponent.Traits]: ResourceGraphTraitsMap;
    [ResourceGraphComponent.States]: ResourceGraphStatesMap;
    [ResourceGraphComponent.Sampler]: ResourceGraphSamplerMap;
}

//-----------------------------------------------------------------
// ResourceGraph Implementation
export class ResourceGraph implements BidirectionalGraph
, AdjacencyGraph
, VertexListGraph
, MutableGraph
, PropertyGraph
, NamedGraph
, ComponentGraph
, PolymorphicGraph
, ReferenceGraph
, MutableReferenceGraph
, UuidGraph<string> {
    //-----------------------------------------------------------------
    // Graph
    // type vertex_descriptor = number;
    nullVertex (): number { return 0xFFFFFFFF; }
    // type edge_descriptor = ED;
    readonly directed_category: directional = directional.bidirectional;
    readonly edge_parallel_category: parallel = parallel.allow;
    readonly traversal_category: traversal = traversal.incidence
        | traversal.bidirectional
        | traversal.adjacency
        | traversal.vertex_list;
    //-----------------------------------------------------------------
    // IncidenceGraph
    // type out_edge_iterator = OutEI;
    // type degree_size_type = number;
    edge (u: number, v: number): boolean {
        for (const oe of this._vertices[u]._outEdges) {
            if (v === oe.target as number) {
                return true;
            }
        }
        return false;
    }
    source (e: ED): number {
        return e.source as number;
    }
    target (e: ED): number {
        return e.target as number;
    }
    outEdges (v: number): OutEI {
        return new OutEI(this._vertices[v]._outEdges.values(), v);
    }
    outDegree (v: number): number {
        return this._vertices[v]._outEdges.length;
    }
    //-----------------------------------------------------------------
    // BidirectionalGraph
    // type in_edge_iterator = InEI;
    inEdges (v: number): InEI {
        return new InEI(this._vertices[v]._inEdges.values(), v);
    }
    inDegree (v: number): number {
        return this._vertices[v]._inEdges.length;
    }
    degree (v: number): number {
        return this.outDegree(v) + this.inDegree(v);
    }
    //-----------------------------------------------------------------
    // AdjacencyGraph
    // type adjacency_iterator = AdjI;
    adjacentVertices (v: number): AdjI {
        return new AdjI(this, this.outEdges(v));
    }
    //-----------------------------------------------------------------
    // VertexListGraph
    vertices (): IterableIterator<number> {
        return this._vertices.keys();
    }
    numVertices (): number {
        return this._vertices.length;
    }
    //-----------------------------------------------------------------
    // EdgeListGraph
    numEdges (): number {
        let numEdges = 0;
        for (const v of this.vertices()) {
            numEdges += this.outDegree(v);
        }
        return numEdges;
    }
    //-----------------------------------------------------------------
    // MutableGraph
    clear (): void {
        // Members
        this.renderPasses.clear();
        this.nextFenceValue = 0;
        this.version = 0;
        // UuidGraph
        this._valueIndex.clear();
        // ComponentGraph
        this._names.length = 0;
        this._descs.length = 0;
        this._traits.length = 0;
        this._states.length = 0;
        this._samplerInfo.length = 0;
        // Graph Vertices
        this._vertices.length = 0;
    }
    addVertex<T extends ResourceGraphValue> (
        id: ResourceGraphValue,
        object: ResourceGraphValueType[T],
        name: string,
        desc: ResourceDesc,
        traits: ResourceTraits,
        states: ResourceStates,
        sampler: SamplerInfo,
        u = 0xFFFFFFFF,
    ): number {
        const vert = new ResourceGraphVertex(id, object);
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._names.push(name);
        this._descs.push(desc);
        this._traits.push(traits);
        this._states.push(states);
        this._samplerInfo.push(sampler);
        // UuidGraph
        this._valueIndex.set(name, v);

        // ReferenceGraph
        if (u !== 0xFFFFFFFF) {
            this.addEdge(u, v);
        }

        return v;
    }
    clearVertex (v: number): void {
        // ReferenceGraph(Alias)
        const vert = this._vertices[v];
        // clear out edges
        for (const oe of vert._outEdges) {
            const target = this._vertices[oe.target as number];
            for (let i = 0; i !== target._inEdges.length;) { // remove all edges
                if (target._inEdges[i].target === v) {
                    target._inEdges.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
        vert._outEdges.length = 0;

        // clear in edges
        for (const ie of vert._inEdges) {
            const source = this._vertices[ie.target as number];
            for (let i = 0; i !== source._outEdges.length;) { // remove all edges
                if (source._outEdges[i].target === v) {
                    source._outEdges.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
        vert._inEdges.length = 0;
    }
    removeVertex (u: number): void {
        { // UuidGraph
            const key = this._names[u];
            this._valueIndex.delete(key);
            this._valueIndex.forEach((v): void => {
                if (v > u) { --v; }
            });
        }
        this._vertices.splice(u, 1);
        this._names.splice(u, 1);
        this._descs.splice(u, 1);
        this._traits.splice(u, 1);
        this._states.splice(u, 1);
        this._samplerInfo.splice(u, 1);

        const sz = this._vertices.length;
        if (u === sz) {
            return;
        }

        for (let v = 0; v !== sz; ++v) {
            const vert = this._vertices[v];
            reindexEdgeList(vert._outEdges, u);
            reindexEdgeList(vert._inEdges, u);
        }
    }
    addEdge (u: number, v: number): ED | null {
        // update in/out edge list
        this._vertices[u]._outEdges.push(new OutE(v));
        this._vertices[v]._inEdges.push(new OutE(u));
        return new ED(u, v);
    }
    removeEdges (u: number, v: number): void {
        const source = this._vertices[u];
        // remove out edges of u
        for (let i = 0; i !== source._outEdges.length;) { // remove all edges
            if (source._outEdges[i].target === v) {
                source._outEdges.splice(i, 1);
            } else {
                ++i;
            }
        }
        // remove in edges of v
        const target = this._vertices[v];
        for (let i = 0; i !== target._inEdges.length;) { // remove all edges
            if (target._inEdges[i].target === u) {
                target._inEdges.splice(i, 1);
            } else {
                ++i;
            }
        }
    }
    removeEdge (e: ED): void {
        const u = e.source as number;
        const v = e.target as number;
        const source = this._vertices[u];
        for (let i = 0; i !== source._outEdges.length;) {
            if (source._outEdges[i].target === v) {
                source._outEdges.splice(i, 1);
                break; // remove one edge
            } else {
                ++i;
            }
        }
        const target = this._vertices[v];
        for (let i = 0; i !== target._inEdges.length;) {
            if (target._inEdges[i].target === u) {
                target._inEdges.splice(i, 1);
                break; // remove one edge
            } else {
                ++i;
            }
        }
    }
    //-----------------------------------------------------------------
    // NamedGraph
    vertexName (v: number): string {
        return this._names[v];
    }
    vertexNameMap (): ResourceGraphNameMap {
        return new ResourceGraphNameMap(this._names);
    }
    //-----------------------------------------------------------------
    // PropertyGraph
    get (tag: string): ResourceGraphNameMap | ResourceGraphDescMap | ResourceGraphTraitsMap | ResourceGraphStatesMap | ResourceGraphSamplerMap {
        switch (tag) {
        // Components
        case 'Name':
            return new ResourceGraphNameMap(this._names);
        case 'Desc':
            return new ResourceGraphDescMap(this._descs);
        case 'Traits':
            return new ResourceGraphTraitsMap(this._traits);
        case 'States':
            return new ResourceGraphStatesMap(this._states);
        case 'Sampler':
            return new ResourceGraphSamplerMap(this._samplerInfo);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends ResourceGraphComponent> (id: T, v: number): ResourceGraphComponentType[T] {
        switch (id) {
        case ResourceGraphComponent.Name:
            return this._names[v] as ResourceGraphComponentType[T];
        case ResourceGraphComponent.Desc:
            return this._descs[v] as ResourceGraphComponentType[T];
        case ResourceGraphComponent.Traits:
            return this._traits[v] as ResourceGraphComponentType[T];
        case ResourceGraphComponent.States:
            return this._states[v] as ResourceGraphComponentType[T];
        case ResourceGraphComponent.Sampler:
            return this._samplerInfo[v] as ResourceGraphComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends ResourceGraphComponent> (id: T): ResourceGraphComponentPropertyMap[T] {
        switch (id) {
        case ResourceGraphComponent.Name:
            return new ResourceGraphNameMap(this._names) as ResourceGraphComponentPropertyMap[T];
        case ResourceGraphComponent.Desc:
            return new ResourceGraphDescMap(this._descs) as ResourceGraphComponentPropertyMap[T];
        case ResourceGraphComponent.Traits:
            return new ResourceGraphTraitsMap(this._traits) as ResourceGraphComponentPropertyMap[T];
        case ResourceGraphComponent.States:
            return new ResourceGraphStatesMap(this._states) as ResourceGraphComponentPropertyMap[T];
        case ResourceGraphComponent.Sampler:
            return new ResourceGraphSamplerMap(this._samplerInfo) as ResourceGraphComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._names[v];
    }
    setName (v: number, value: string): void {
        this._names[v] = value;
    }
    getDesc (v: number): ResourceDesc {
        return this._descs[v];
    }
    getTraits (v: number): ResourceTraits {
        return this._traits[v];
    }
    getStates (v: number): ResourceStates {
        return this._states[v];
    }
    getSampler (v: number): SamplerInfo {
        return this._samplerInfo[v];
    }
    //-----------------------------------------------------------------
    // PolymorphicGraph
    holds (id: ResourceGraphValue, v: number): boolean {
        return this._vertices[v]._id === id;
    }
    id (v: number): ResourceGraphValue {
        return this._vertices[v]._id;
    }
    object (v: number): ResourceGraphObject {
        return this._vertices[v]._object;
    }
    value<T extends ResourceGraphValue> (id: T, v: number): ResourceGraphValueType[T] {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as ResourceGraphValueType[T];
        } else {
            throw Error('value id not match');
        }
    }
    tryValue<T extends ResourceGraphValue> (id: T, v: number): ResourceGraphValueType[T] | null {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as ResourceGraphValueType[T];
        } else {
            return null;
        }
    }
    visitVertex (visitor: ResourceGraphVisitor, v: number): unknown {
        const vert = this._vertices[v];
        switch (vert._id) {
        case ResourceGraphValue.Managed:
            return visitor.managed(vert._object as ManagedResource);
        case ResourceGraphValue.ManagedBuffer:
            return visitor.managedBuffer(vert._object as ManagedBuffer);
        case ResourceGraphValue.ManagedTexture:
            return visitor.managedTexture(vert._object as ManagedTexture);
        case ResourceGraphValue.PersistentBuffer:
            return visitor.persistentBuffer(vert._object as PersistentBuffer);
        case ResourceGraphValue.PersistentTexture:
            return visitor.persistentTexture(vert._object as PersistentTexture);
        case ResourceGraphValue.Framebuffer:
            return visitor.framebuffer(vert._object as Framebuffer);
        case ResourceGraphValue.Swapchain:
            return visitor.swapchain(vert._object as RenderSwapchain);
        case ResourceGraphValue.FormatView:
            return visitor.formatView(vert._object as FormatView);
        case ResourceGraphValue.SubresourceView:
            return visitor.subresourceView(vert._object as SubresourceView);
        default:
            throw Error('polymorphic type not found');
        }
    }
    getManaged (v: number): ManagedResource {
        if (this._vertices[v]._id === ResourceGraphValue.Managed) {
            return this._vertices[v]._object as ManagedResource;
        } else {
            throw Error('value id not match');
        }
    }
    getManagedBuffer (v: number): ManagedBuffer {
        if (this._vertices[v]._id === ResourceGraphValue.ManagedBuffer) {
            return this._vertices[v]._object as ManagedBuffer;
        } else {
            throw Error('value id not match');
        }
    }
    getManagedTexture (v: number): ManagedTexture {
        if (this._vertices[v]._id === ResourceGraphValue.ManagedTexture) {
            return this._vertices[v]._object as ManagedTexture;
        } else {
            throw Error('value id not match');
        }
    }
    getPersistentBuffer (v: number): PersistentBuffer {
        if (this._vertices[v]._id === ResourceGraphValue.PersistentBuffer) {
            return this._vertices[v]._object as PersistentBuffer;
        } else {
            throw Error('value id not match');
        }
    }
    getPersistentTexture (v: number): PersistentTexture {
        if (this._vertices[v]._id === ResourceGraphValue.PersistentTexture) {
            return this._vertices[v]._object as PersistentTexture;
        } else {
            throw Error('value id not match');
        }
    }
    getFramebuffer (v: number): Framebuffer {
        if (this._vertices[v]._id === ResourceGraphValue.Framebuffer) {
            return this._vertices[v]._object as Framebuffer;
        } else {
            throw Error('value id not match');
        }
    }
    getSwapchain (v: number): RenderSwapchain {
        if (this._vertices[v]._id === ResourceGraphValue.Swapchain) {
            return this._vertices[v]._object as RenderSwapchain;
        } else {
            throw Error('value id not match');
        }
    }
    getFormatView (v: number): FormatView {
        if (this._vertices[v]._id === ResourceGraphValue.FormatView) {
            return this._vertices[v]._object as FormatView;
        } else {
            throw Error('value id not match');
        }
    }
    getSubresourceView (v: number): SubresourceView {
        if (this._vertices[v]._id === ResourceGraphValue.SubresourceView) {
            return this._vertices[v]._object as SubresourceView;
        } else {
            throw Error('value id not match');
        }
    }
    tryGetManaged (v: number): ManagedResource | null {
        if (this._vertices[v]._id === ResourceGraphValue.Managed) {
            return this._vertices[v]._object as ManagedResource;
        } else {
            return null;
        }
    }
    tryGetManagedBuffer (v: number): ManagedBuffer | null {
        if (this._vertices[v]._id === ResourceGraphValue.ManagedBuffer) {
            return this._vertices[v]._object as ManagedBuffer;
        } else {
            return null;
        }
    }
    tryGetManagedTexture (v: number): ManagedTexture | null {
        if (this._vertices[v]._id === ResourceGraphValue.ManagedTexture) {
            return this._vertices[v]._object as ManagedTexture;
        } else {
            return null;
        }
    }
    tryGetPersistentBuffer (v: number): PersistentBuffer | null {
        if (this._vertices[v]._id === ResourceGraphValue.PersistentBuffer) {
            return this._vertices[v]._object as PersistentBuffer;
        } else {
            return null;
        }
    }
    tryGetPersistentTexture (v: number): PersistentTexture | null {
        if (this._vertices[v]._id === ResourceGraphValue.PersistentTexture) {
            return this._vertices[v]._object as PersistentTexture;
        } else {
            return null;
        }
    }
    tryGetFramebuffer (v: number): Framebuffer | null {
        if (this._vertices[v]._id === ResourceGraphValue.Framebuffer) {
            return this._vertices[v]._object as Framebuffer;
        } else {
            return null;
        }
    }
    tryGetSwapchain (v: number): RenderSwapchain | null {
        if (this._vertices[v]._id === ResourceGraphValue.Swapchain) {
            return this._vertices[v]._object as RenderSwapchain;
        } else {
            return null;
        }
    }
    tryGetFormatView (v: number): FormatView | null {
        if (this._vertices[v]._id === ResourceGraphValue.FormatView) {
            return this._vertices[v]._object as FormatView;
        } else {
            return null;
        }
    }
    tryGetSubresourceView (v: number): SubresourceView | null {
        if (this._vertices[v]._id === ResourceGraphValue.SubresourceView) {
            return this._vertices[v]._object as SubresourceView;
        } else {
            return null;
        }
    }
    //-----------------------------------------------------------------
    // ReferenceGraph
    // type reference_descriptor = ED;
    // type child_iterator = OutEI;
    // type parent_iterator = InEI;
    reference (u: number, v: number): boolean {
        for (const oe of this._vertices[u]._outEdges) {
            if (v === oe.target as number) {
                return true;
            }
        }
        return false;
    }
    parent (e: ED): number {
        return e.source as number;
    }
    child (e: ED): number {
        return e.target as number;
    }
    parents (v: number): InEI {
        return new InEI(this._vertices[v]._inEdges.values(), v);
    }
    children (v: number): OutEI {
        return new OutEI(this._vertices[v]._outEdges.values(), v);
    }
    numParents (v: number): number {
        return this._vertices[v]._inEdges.length;
    }
    numChildren (v: number): number {
        return this._vertices[v]._outEdges.length;
    }
    getParent (v: number): number {
        if (v === 0xFFFFFFFF) {
            return 0xFFFFFFFF;
        }
        const list = this._vertices[v]._inEdges;
        if (list.length === 0) {
            return 0xFFFFFFFF;
        } else {
            return list[0].target as number;
        }
    }
    isAncestor (ancestor: number, descendent: number): boolean {
        const pseudo = 0xFFFFFFFF;
        if (ancestor === descendent) {
            // when ancestor === descendent, is_ancestor is defined as false
            return false;
        }
        if (ancestor === pseudo) {
            // special case: pseudo root is always ancestor
            return true;
        }
        if (descendent === pseudo) {
            // special case: pseudo root is never descendent
            return false;
        }
        for (let parent = this.getParent(descendent); parent !== pseudo;) {
            if (ancestor === parent) {
                return true;
            }
            parent = this.getParent(parent);
        }
        return false;
    }
    //-----------------------------------------------------------------
    // MutableReferenceGraph
    addReference (u: number, v: number): ED | null {
        return this.addEdge(u, v);
    }
    removeReference (e: ED): void {
        return this.removeEdge(e);
    }
    removeReferences (u: number, v: number): void {
        return this.removeEdges(u, v);
    }
    //-----------------------------------------------------------------
    // UuidGraph
    contains (key: string): boolean {
        return this._valueIndex.has(key);
    }
    vertex (key: string): number {
        return this._valueIndex.get(key)!;
    }
    find (key: string): number {
        const v = this._valueIndex.get(key);
        if (v === undefined) return 0xFFFFFFFF;
        return v;
    }

    readonly components: string[] = ['Name', 'Desc', 'Traits', 'States', 'Sampler'];
    readonly _vertices: ResourceGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _descs: ResourceDesc[] = [];
    readonly _traits: ResourceTraits[] = [];
    readonly _states: ResourceStates[] = [];
    readonly _samplerInfo: SamplerInfo[] = [];
    readonly _valueIndex: Map<string, number> = new Map<string, number>();
    readonly renderPasses: Map<string, PersistentRenderPassAndFramebuffer> = new Map<string, PersistentRenderPassAndFramebuffer>();
    nextFenceValue = 0;
    version = 0;
}

export class ComputePass {
    reset (): void {
        this.computeViews.clear();
        this.textures.clear();
    }
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
    readonly textures: Map<string, ShaderStageFlagBit> = new Map<string, ShaderStageFlagBit>();
}

export class ResolvePass {
    reset (): void {
        this.resolvePairs.length = 0;
    }
    readonly resolvePairs: ResolvePair[] = [];
}

export class CopyPass {
    reset (): void {
        this.copyPairs.length = 0;
        this.uploadPairs.length = 0;
    }
    readonly copyPairs: CopyPair[] = [];
    readonly uploadPairs: UploadPair[] = [];
}

export class MovePass {
    reset (): void {
        this.movePairs.length = 0;
    }
    readonly movePairs: MovePair[] = [];
}

export class RaytracePass {
    reset (): void {
        this.computeViews.clear();
    }
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
}

export class ClearView {
    constructor (slotName = '', clearFlags: ClearFlagBit = ClearFlagBit.ALL, clearColor: Color = new Color()) {
        this.slotName = slotName;
        this.clearFlags = clearFlags;
        this.clearColor = clearColor;
    }
    reset (slotName = '', clearFlags: ClearFlagBit = ClearFlagBit.ALL): void {
        this.slotName = slotName;
        this.clearFlags = clearFlags;
        this.clearColor.reset();
    }
    slotName: string;
    clearFlags: ClearFlagBit;
    readonly clearColor: Color;
}

export class RenderQueue {
    constructor (hint: QueueHint = QueueHint.RENDER_OPAQUE, phaseID = 0xFFFFFFFF) {
        this.hint = hint;
        this.phaseID = phaseID;
    }
    reset (hint: QueueHint = QueueHint.RENDER_OPAQUE, phaseID = 0xFFFFFFFF): void {
        this.hint = hint;
        this.phaseID = phaseID;
        this.viewport = null;
    }
    hint: QueueHint;
    phaseID: number;
    viewport: Viewport | null = null;
}

export enum CullingFlags {
    NONE = 0,
    CAMERA_FRUSTUM = 0x1,
    LIGHT_FRUSTUM = 0x2,
    LIGHT_BOUNDS = 0x4,
}

export class SceneData {
    constructor (
        scene: RenderScene | null = null,
        camera: Camera | null = null,
        flags: SceneFlags = SceneFlags.NONE,
        light: LightInfo = new LightInfo(),
        cullingFlags: CullingFlags = CullingFlags.CAMERA_FRUSTUM,
        shadingLight: Light | null = null,
    ) {
        this.scene = scene;
        this.camera = camera;
        this.light = light;
        this.flags = flags;
        this.cullingFlags = cullingFlags;
        this.shadingLight = shadingLight;
    }
    reset (
        scene: RenderScene | null = null,
        camera: Camera | null = null,
        flags: SceneFlags = SceneFlags.NONE,
        cullingFlags: CullingFlags = CullingFlags.CAMERA_FRUSTUM,
        shadingLight: Light | null = null,
    ): void {
        this.scene = scene;
        this.camera = camera;
        this.light.reset();
        this.flags = flags;
        this.cullingFlags = cullingFlags;
        this.shadingLight = shadingLight;
    }
    /*pointer*/ scene: RenderScene | null;
    /*pointer*/ camera: Camera | null;
    readonly light: LightInfo;
    flags: SceneFlags;
    cullingFlags: CullingFlags;
    /*refcount*/ shadingLight: Light | null;
}

export class Dispatch {
    constructor (
        material: Material | null = null,
        passID = 0,
        threadGroupCountX = 0,
        threadGroupCountY = 0,
        threadGroupCountZ = 0,
    ) {
        this.material = material;
        this.passID = passID;
        this.threadGroupCountX = threadGroupCountX;
        this.threadGroupCountY = threadGroupCountY;
        this.threadGroupCountZ = threadGroupCountZ;
    }
    reset (
        material: Material | null = null,
        passID = 0,
        threadGroupCountX = 0,
        threadGroupCountY = 0,
        threadGroupCountZ = 0,
    ): void {
        this.material = material;
        this.passID = passID;
        this.threadGroupCountX = threadGroupCountX;
        this.threadGroupCountY = threadGroupCountY;
        this.threadGroupCountZ = threadGroupCountZ;
    }
    /*refcount*/ material: Material | null;
    passID: number;
    threadGroupCountX: number;
    threadGroupCountY: number;
    threadGroupCountZ: number;
}

export class Blit {
    constructor (material: Material | null = null, passID = 0, sceneFlags: SceneFlags = SceneFlags.NONE, camera: Camera | null = null) {
        this.material = material;
        this.passID = passID;
        this.sceneFlags = sceneFlags;
        this.camera = camera;
    }
    reset (material: Material | null = null, passID = 0, sceneFlags: SceneFlags = SceneFlags.NONE, camera: Camera | null = null): void {
        this.material = material;
        this.passID = passID;
        this.sceneFlags = sceneFlags;
        this.camera = camera;
    }
    /*refcount*/ material: Material | null;
    passID: number;
    sceneFlags: SceneFlags;
    /*pointer*/ camera: Camera | null;
}

export class RenderData {
    reset (): void {
        this.constants.clear();
        this.buffers.clear();
        this.textures.clear();
        this.samplers.clear();
        this.custom = '';
    }
    readonly constants: Map<number, number[]> = new Map<number, number[]>();
    readonly buffers: Map<number, Buffer> = new Map<number, Buffer>();
    readonly textures: Map<number, Texture> = new Map<number, Texture>();
    readonly samplers: Map<number, Sampler> = new Map<number, Sampler>();
    custom = '';
}

//=================================================================
// RenderGraph
//=================================================================
// PolymorphicGraph Concept
export const enum RenderGraphValue {
    RasterPass,
    RasterSubpass,
    ComputeSubpass,
    Compute,
    Resolve,
    Copy,
    Move,
    Raytrace,
    Queue,
    Scene,
    Blit,
    Dispatch,
    Clear,
    Viewport,
}

export function getRenderGraphValueName (e: RenderGraphValue): string {
    switch (e) {
    case RenderGraphValue.RasterPass: return 'RasterPass';
    case RenderGraphValue.RasterSubpass: return 'RasterSubpass';
    case RenderGraphValue.ComputeSubpass: return 'ComputeSubpass';
    case RenderGraphValue.Compute: return 'Compute';
    case RenderGraphValue.Resolve: return 'Resolve';
    case RenderGraphValue.Copy: return 'Copy';
    case RenderGraphValue.Move: return 'Move';
    case RenderGraphValue.Raytrace: return 'Raytrace';
    case RenderGraphValue.Queue: return 'Queue';
    case RenderGraphValue.Scene: return 'Scene';
    case RenderGraphValue.Blit: return 'Blit';
    case RenderGraphValue.Dispatch: return 'Dispatch';
    case RenderGraphValue.Clear: return 'Clear';
    case RenderGraphValue.Viewport: return 'Viewport';
    default: return '';
    }
}

export interface RenderGraphValueType {
    [RenderGraphValue.RasterPass]: RasterPass
    [RenderGraphValue.RasterSubpass]: RasterSubpass
    [RenderGraphValue.ComputeSubpass]: ComputeSubpass
    [RenderGraphValue.Compute]: ComputePass
    [RenderGraphValue.Resolve]: ResolvePass
    [RenderGraphValue.Copy]: CopyPass
    [RenderGraphValue.Move]: MovePass
    [RenderGraphValue.Raytrace]: RaytracePass
    [RenderGraphValue.Queue]: RenderQueue
    [RenderGraphValue.Scene]: SceneData
    [RenderGraphValue.Blit]: Blit
    [RenderGraphValue.Dispatch]: Dispatch
    [RenderGraphValue.Clear]: ClearView[]
    [RenderGraphValue.Viewport]: Viewport
}

export interface RenderGraphVisitor {
    rasterPass(value: RasterPass): unknown;
    rasterSubpass(value: RasterSubpass): unknown;
    computeSubpass(value: ComputeSubpass): unknown;
    compute(value: ComputePass): unknown;
    resolve(value: ResolvePass): unknown;
    copy(value: CopyPass): unknown;
    move(value: MovePass): unknown;
    raytrace(value: RaytracePass): unknown;
    queue(value: RenderQueue): unknown;
    scene(value: SceneData): unknown;
    blit(value: Blit): unknown;
    dispatch(value: Dispatch): unknown;
    clear(value: ClearView[]): unknown;
    viewport(value: Viewport): unknown;
}

export type RenderGraphObject = RasterPass
| RasterSubpass
| ComputeSubpass
| ComputePass
| ResolvePass
| CopyPass
| MovePass
| RaytracePass
| RenderQueue
| SceneData
| Blit
| Dispatch
| ClearView[]
| Viewport;

//-----------------------------------------------------------------
// Graph Concept
export class RenderGraphVertex {
    constructor (
        readonly id: RenderGraphValue,
        readonly object: RenderGraphObject,
    ) {
        this._id = id;
        this._object = object;
    }
    readonly _outEdges: OutE[] = [];
    readonly _inEdges: OutE[] = [];
    readonly _children: OutE[] = [];
    readonly _parents: OutE[] = [];
    readonly _id: RenderGraphValue;
    _object: RenderGraphObject;
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class RenderGraphNameMap implements PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    set (v: number, names: string): void {
        this._names[v] = names;
    }
    readonly _names: string[];
}

export class RenderGraphLayoutMap implements PropertyMap {
    constructor (readonly layoutNodes: string[]) {
        this._layoutNodes = layoutNodes;
    }
    get (v: number): string {
        return this._layoutNodes[v];
    }
    set (v: number, layoutNodes: string): void {
        this._layoutNodes[v] = layoutNodes;
    }
    readonly _layoutNodes: string[];
}

export class RenderGraphDataMap implements PropertyMap {
    constructor (readonly data: RenderData[]) {
        this._data = data;
    }
    get (v: number): RenderData {
        return this._data[v];
    }
    readonly _data: RenderData[];
}

export class RenderGraphValidMap implements PropertyMap {
    constructor (readonly valid: boolean[]) {
        this._valid = valid;
    }
    get (v: number): boolean {
        return this._valid[v];
    }
    set (v: number, valid: boolean): void {
        this._valid[v] = valid;
    }
    readonly _valid: boolean[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum RenderGraphComponent {
    Name,
    Layout,
    Data,
    Valid,
}

export interface RenderGraphComponentType {
    [RenderGraphComponent.Name]: string;
    [RenderGraphComponent.Layout]: string;
    [RenderGraphComponent.Data]: RenderData;
    [RenderGraphComponent.Valid]: boolean;
}

export interface RenderGraphComponentPropertyMap {
    [RenderGraphComponent.Name]: RenderGraphNameMap;
    [RenderGraphComponent.Layout]: RenderGraphLayoutMap;
    [RenderGraphComponent.Data]: RenderGraphDataMap;
    [RenderGraphComponent.Valid]: RenderGraphValidMap;
}

//-----------------------------------------------------------------
// RenderGraph Implementation
export class RenderGraph implements BidirectionalGraph
, AdjacencyGraph
, VertexListGraph
, MutableGraph
, PropertyGraph
, NamedGraph
, ComponentGraph
, PolymorphicGraph
, ReferenceGraph
, MutableReferenceGraph {
    //-----------------------------------------------------------------
    // Graph
    // type vertex_descriptor = number;
    nullVertex (): number { return 0xFFFFFFFF; }
    // type edge_descriptor = ED;
    readonly directed_category: directional = directional.bidirectional;
    readonly edge_parallel_category: parallel = parallel.allow;
    readonly traversal_category: traversal = traversal.incidence
        | traversal.bidirectional
        | traversal.adjacency
        | traversal.vertex_list;
    //-----------------------------------------------------------------
    // IncidenceGraph
    // type out_edge_iterator = OutEI;
    // type degree_size_type = number;
    edge (u: number, v: number): boolean {
        for (const oe of this._vertices[u]._outEdges) {
            if (v === oe.target as number) {
                return true;
            }
        }
        return false;
    }
    source (e: ED): number {
        return e.source as number;
    }
    target (e: ED): number {
        return e.target as number;
    }
    outEdges (v: number): OutEI {
        return new OutEI(this._vertices[v]._outEdges.values(), v);
    }
    outDegree (v: number): number {
        return this._vertices[v]._outEdges.length;
    }
    //-----------------------------------------------------------------
    // BidirectionalGraph
    // type in_edge_iterator = InEI;
    inEdges (v: number): InEI {
        return new InEI(this._vertices[v]._inEdges.values(), v);
    }
    inDegree (v: number): number {
        return this._vertices[v]._inEdges.length;
    }
    degree (v: number): number {
        return this.outDegree(v) + this.inDegree(v);
    }
    //-----------------------------------------------------------------
    // AdjacencyGraph
    // type adjacency_iterator = AdjI;
    adjacentVertices (v: number): AdjI {
        return new AdjI(this, this.outEdges(v));
    }
    //-----------------------------------------------------------------
    // VertexListGraph
    vertices (): IterableIterator<number> {
        return this._vertices.keys();
    }
    numVertices (): number {
        return this._vertices.length;
    }
    //-----------------------------------------------------------------
    // EdgeListGraph
    numEdges (): number {
        let numEdges = 0;
        for (const v of this.vertices()) {
            numEdges += this.outDegree(v);
        }
        return numEdges;
    }
    //-----------------------------------------------------------------
    // MutableGraph
    clear (): void {
        // Members
        this.index.clear();
        this.sortedVertices.length = 0;
        // ComponentGraph
        this._names.length = 0;
        this._layoutNodes.length = 0;
        this._data.length = 0;
        this._valid.length = 0;
        // Graph Vertices
        this._vertices.length = 0;
    }
    addVertex<T extends RenderGraphValue> (
        id: RenderGraphValue,
        object: RenderGraphValueType[T],
        name: string,
        layout: string,
        data: RenderData,
        valid: boolean,
        u = 0xFFFFFFFF,
    ): number {
        const vert = new RenderGraphVertex(id, object);
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._names.push(name);
        this._layoutNodes.push(layout);
        this._data.push(data);
        this._valid.push(valid);

        // ReferenceGraph
        if (u !== 0xFFFFFFFF) {
            this._vertices[u]._children.push(new OutE(v));
            vert._parents.push(new OutE(u));
        }

        return v;
    }
    clearVertex (v: number): void {
        // ReferenceGraph(Separated)
        const vert = this._vertices[v];
        // clear out edges
        for (const oe of vert._outEdges) {
            const target = this._vertices[oe.target as number];
            for (let i = 0; i !== target._inEdges.length;) { // remove all edges
                if (target._inEdges[i].target === v) {
                    target._inEdges.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
        vert._outEdges.length = 0;

        // clear in edges
        for (const ie of vert._inEdges) {
            const source = this._vertices[ie.target as number];
            for (let i = 0; i !== source._outEdges.length;) { // remove all edges
                if (source._outEdges[i].target === v) {
                    source._outEdges.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
        vert._inEdges.length = 0;

        // clear child edges
        for (const oe of vert._children) {
            const target = this._vertices[oe.target as number];
            for (let i = 0; i !== target._parents.length;) { // remove all edges
                if (target._parents[i].target === v) {
                    target._parents.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
        vert._children.length = 0;

        // clear parent edges
        for (const ie of vert._parents) {
            const source = this._vertices[ie.target as number];
            for (let i = 0; i !== source._children.length;) { // remove all edges
                if (source._children[i].target === v) {
                    source._children.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
        vert._parents.length = 0;
    }
    removeVertex (u: number): void {
        this._vertices.splice(u, 1);
        this._names.splice(u, 1);
        this._layoutNodes.splice(u, 1);
        this._data.splice(u, 1);
        this._valid.splice(u, 1);

        const sz = this._vertices.length;
        if (u === sz) {
            return;
        }

        for (let v = 0; v !== sz; ++v) {
            const vert = this._vertices[v];
            reindexEdgeList(vert._outEdges, u);
            reindexEdgeList(vert._inEdges, u);
            // ReferenceGraph (Separated)
            reindexEdgeList(vert._children, u);
            reindexEdgeList(vert._parents, u);
        }
    }
    addEdge (u: number, v: number): ED | null {
        // update in/out edge list
        this._vertices[u]._outEdges.push(new OutE(v));
        this._vertices[v]._inEdges.push(new OutE(u));
        return new ED(u, v);
    }
    removeEdges (u: number, v: number): void {
        const source = this._vertices[u];
        // remove out edges of u
        for (let i = 0; i !== source._outEdges.length;) { // remove all edges
            if (source._outEdges[i].target === v) {
                source._outEdges.splice(i, 1);
            } else {
                ++i;
            }
        }
        // remove in edges of v
        const target = this._vertices[v];
        for (let i = 0; i !== target._inEdges.length;) { // remove all edges
            if (target._inEdges[i].target === u) {
                target._inEdges.splice(i, 1);
            } else {
                ++i;
            }
        }
    }
    removeEdge (e: ED): void {
        const u = e.source as number;
        const v = e.target as number;
        const source = this._vertices[u];
        for (let i = 0; i !== source._outEdges.length;) {
            if (source._outEdges[i].target === v) {
                source._outEdges.splice(i, 1);
                break; // remove one edge
            } else {
                ++i;
            }
        }
        const target = this._vertices[v];
        for (let i = 0; i !== target._inEdges.length;) {
            if (target._inEdges[i].target === u) {
                target._inEdges.splice(i, 1);
                break; // remove one edge
            } else {
                ++i;
            }
        }
    }
    //-----------------------------------------------------------------
    // NamedGraph
    vertexName (v: number): string {
        return this._names[v];
    }
    vertexNameMap (): RenderGraphNameMap {
        return new RenderGraphNameMap(this._names);
    }
    //-----------------------------------------------------------------
    // PropertyGraph
    get (tag: string): RenderGraphNameMap | RenderGraphLayoutMap | RenderGraphDataMap | RenderGraphValidMap {
        switch (tag) {
        // Components
        case 'Name':
            return new RenderGraphNameMap(this._names);
        case 'Layout':
            return new RenderGraphLayoutMap(this._layoutNodes);
        case 'Data':
            return new RenderGraphDataMap(this._data);
        case 'Valid':
            return new RenderGraphValidMap(this._valid);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends RenderGraphComponent> (id: T, v: number): RenderGraphComponentType[T] {
        switch (id) {
        case RenderGraphComponent.Name:
            return this._names[v] as RenderGraphComponentType[T];
        case RenderGraphComponent.Layout:
            return this._layoutNodes[v] as RenderGraphComponentType[T];
        case RenderGraphComponent.Data:
            return this._data[v] as RenderGraphComponentType[T];
        case RenderGraphComponent.Valid:
            return this._valid[v] as RenderGraphComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends RenderGraphComponent> (id: T): RenderGraphComponentPropertyMap[T] {
        switch (id) {
        case RenderGraphComponent.Name:
            return new RenderGraphNameMap(this._names) as RenderGraphComponentPropertyMap[T];
        case RenderGraphComponent.Layout:
            return new RenderGraphLayoutMap(this._layoutNodes) as RenderGraphComponentPropertyMap[T];
        case RenderGraphComponent.Data:
            return new RenderGraphDataMap(this._data) as RenderGraphComponentPropertyMap[T];
        case RenderGraphComponent.Valid:
            return new RenderGraphValidMap(this._valid) as RenderGraphComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._names[v];
    }
    setName (v: number, value: string): void {
        this._names[v] = value;
    }
    getLayout (v: number): string {
        return this._layoutNodes[v];
    }
    setLayout (v: number, value: string): void {
        this._layoutNodes[v] = value;
    }
    getData (v: number): RenderData {
        return this._data[v];
    }
    getValid (v: number): boolean {
        return this._valid[v];
    }
    setValid (v: number, value: boolean): void {
        this._valid[v] = value;
    }
    //-----------------------------------------------------------------
    // PolymorphicGraph
    holds (id: RenderGraphValue, v: number): boolean {
        return this._vertices[v]._id === id;
    }
    id (v: number): RenderGraphValue {
        return this._vertices[v]._id;
    }
    object (v: number): RenderGraphObject {
        return this._vertices[v]._object;
    }
    value<T extends RenderGraphValue> (id: T, v: number): RenderGraphValueType[T] {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as RenderGraphValueType[T];
        } else {
            throw Error('value id not match');
        }
    }
    tryValue<T extends RenderGraphValue> (id: T, v: number): RenderGraphValueType[T] | null {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as RenderGraphValueType[T];
        } else {
            return null;
        }
    }
    visitVertex (visitor: RenderGraphVisitor, v: number): unknown {
        const vert = this._vertices[v];
        switch (vert._id) {
        case RenderGraphValue.RasterPass:
            return visitor.rasterPass(vert._object as RasterPass);
        case RenderGraphValue.RasterSubpass:
            return visitor.rasterSubpass(vert._object as RasterSubpass);
        case RenderGraphValue.ComputeSubpass:
            return visitor.computeSubpass(vert._object as ComputeSubpass);
        case RenderGraphValue.Compute:
            return visitor.compute(vert._object as ComputePass);
        case RenderGraphValue.Resolve:
            return visitor.resolve(vert._object as ResolvePass);
        case RenderGraphValue.Copy:
            return visitor.copy(vert._object as CopyPass);
        case RenderGraphValue.Move:
            return visitor.move(vert._object as MovePass);
        case RenderGraphValue.Raytrace:
            return visitor.raytrace(vert._object as RaytracePass);
        case RenderGraphValue.Queue:
            return visitor.queue(vert._object as RenderQueue);
        case RenderGraphValue.Scene:
            return visitor.scene(vert._object as SceneData);
        case RenderGraphValue.Blit:
            return visitor.blit(vert._object as Blit);
        case RenderGraphValue.Dispatch:
            return visitor.dispatch(vert._object as Dispatch);
        case RenderGraphValue.Clear:
            return visitor.clear(vert._object as ClearView[]);
        case RenderGraphValue.Viewport:
            return visitor.viewport(vert._object as Viewport);
        default:
            throw Error('polymorphic type not found');
        }
    }
    getRasterPass (v: number): RasterPass {
        if (this._vertices[v]._id === RenderGraphValue.RasterPass) {
            return this._vertices[v]._object as RasterPass;
        } else {
            throw Error('value id not match');
        }
    }
    getRasterSubpass (v: number): RasterSubpass {
        if (this._vertices[v]._id === RenderGraphValue.RasterSubpass) {
            return this._vertices[v]._object as RasterSubpass;
        } else {
            throw Error('value id not match');
        }
    }
    getComputeSubpass (v: number): ComputeSubpass {
        if (this._vertices[v]._id === RenderGraphValue.ComputeSubpass) {
            return this._vertices[v]._object as ComputeSubpass;
        } else {
            throw Error('value id not match');
        }
    }
    getCompute (v: number): ComputePass {
        if (this._vertices[v]._id === RenderGraphValue.Compute) {
            return this._vertices[v]._object as ComputePass;
        } else {
            throw Error('value id not match');
        }
    }
    getResolve (v: number): ResolvePass {
        if (this._vertices[v]._id === RenderGraphValue.Resolve) {
            return this._vertices[v]._object as ResolvePass;
        } else {
            throw Error('value id not match');
        }
    }
    getCopy (v: number): CopyPass {
        if (this._vertices[v]._id === RenderGraphValue.Copy) {
            return this._vertices[v]._object as CopyPass;
        } else {
            throw Error('value id not match');
        }
    }
    getMove (v: number): MovePass {
        if (this._vertices[v]._id === RenderGraphValue.Move) {
            return this._vertices[v]._object as MovePass;
        } else {
            throw Error('value id not match');
        }
    }
    getRaytrace (v: number): RaytracePass {
        if (this._vertices[v]._id === RenderGraphValue.Raytrace) {
            return this._vertices[v]._object as RaytracePass;
        } else {
            throw Error('value id not match');
        }
    }
    getQueue (v: number): RenderQueue {
        if (this._vertices[v]._id === RenderGraphValue.Queue) {
            return this._vertices[v]._object as RenderQueue;
        } else {
            throw Error('value id not match');
        }
    }
    getScene (v: number): SceneData {
        if (this._vertices[v]._id === RenderGraphValue.Scene) {
            return this._vertices[v]._object as SceneData;
        } else {
            throw Error('value id not match');
        }
    }
    getBlit (v: number): Blit {
        if (this._vertices[v]._id === RenderGraphValue.Blit) {
            return this._vertices[v]._object as Blit;
        } else {
            throw Error('value id not match');
        }
    }
    getDispatch (v: number): Dispatch {
        if (this._vertices[v]._id === RenderGraphValue.Dispatch) {
            return this._vertices[v]._object as Dispatch;
        } else {
            throw Error('value id not match');
        }
    }
    getClear (v: number): ClearView[] {
        if (this._vertices[v]._id === RenderGraphValue.Clear) {
            return this._vertices[v]._object as ClearView[];
        } else {
            throw Error('value id not match');
        }
    }
    getViewport (v: number): Viewport {
        if (this._vertices[v]._id === RenderGraphValue.Viewport) {
            return this._vertices[v]._object as Viewport;
        } else {
            throw Error('value id not match');
        }
    }
    tryGetRasterPass (v: number): RasterPass | null {
        if (this._vertices[v]._id === RenderGraphValue.RasterPass) {
            return this._vertices[v]._object as RasterPass;
        } else {
            return null;
        }
    }
    tryGetRasterSubpass (v: number): RasterSubpass | null {
        if (this._vertices[v]._id === RenderGraphValue.RasterSubpass) {
            return this._vertices[v]._object as RasterSubpass;
        } else {
            return null;
        }
    }
    tryGetComputeSubpass (v: number): ComputeSubpass | null {
        if (this._vertices[v]._id === RenderGraphValue.ComputeSubpass) {
            return this._vertices[v]._object as ComputeSubpass;
        } else {
            return null;
        }
    }
    tryGetCompute (v: number): ComputePass | null {
        if (this._vertices[v]._id === RenderGraphValue.Compute) {
            return this._vertices[v]._object as ComputePass;
        } else {
            return null;
        }
    }
    tryGetResolve (v: number): ResolvePass | null {
        if (this._vertices[v]._id === RenderGraphValue.Resolve) {
            return this._vertices[v]._object as ResolvePass;
        } else {
            return null;
        }
    }
    tryGetCopy (v: number): CopyPass | null {
        if (this._vertices[v]._id === RenderGraphValue.Copy) {
            return this._vertices[v]._object as CopyPass;
        } else {
            return null;
        }
    }
    tryGetMove (v: number): MovePass | null {
        if (this._vertices[v]._id === RenderGraphValue.Move) {
            return this._vertices[v]._object as MovePass;
        } else {
            return null;
        }
    }
    tryGetRaytrace (v: number): RaytracePass | null {
        if (this._vertices[v]._id === RenderGraphValue.Raytrace) {
            return this._vertices[v]._object as RaytracePass;
        } else {
            return null;
        }
    }
    tryGetQueue (v: number): RenderQueue | null {
        if (this._vertices[v]._id === RenderGraphValue.Queue) {
            return this._vertices[v]._object as RenderQueue;
        } else {
            return null;
        }
    }
    tryGetScene (v: number): SceneData | null {
        if (this._vertices[v]._id === RenderGraphValue.Scene) {
            return this._vertices[v]._object as SceneData;
        } else {
            return null;
        }
    }
    tryGetBlit (v: number): Blit | null {
        if (this._vertices[v]._id === RenderGraphValue.Blit) {
            return this._vertices[v]._object as Blit;
        } else {
            return null;
        }
    }
    tryGetDispatch (v: number): Dispatch | null {
        if (this._vertices[v]._id === RenderGraphValue.Dispatch) {
            return this._vertices[v]._object as Dispatch;
        } else {
            return null;
        }
    }
    tryGetClear (v: number): ClearView[] | null {
        if (this._vertices[v]._id === RenderGraphValue.Clear) {
            return this._vertices[v]._object as ClearView[];
        } else {
            return null;
        }
    }
    tryGetViewport (v: number): Viewport | null {
        if (this._vertices[v]._id === RenderGraphValue.Viewport) {
            return this._vertices[v]._object as Viewport;
        } else {
            return null;
        }
    }
    //-----------------------------------------------------------------
    // ReferenceGraph
    // type reference_descriptor = ED;
    // type child_iterator = OutEI;
    // type parent_iterator = InEI;
    reference (u: number, v: number): boolean {
        for (const oe of this._vertices[u]._children) {
            if (v === oe.target as number) {
                return true;
            }
        }
        return false;
    }
    parent (e: ED): number {
        return e.source as number;
    }
    child (e: ED): number {
        return e.target as number;
    }
    parents (v: number): InEI {
        return new InEI(this._vertices[v]._parents.values(), v);
    }
    children (v: number): OutEI {
        return new OutEI(this._vertices[v]._children.values(), v);
    }
    numParents (v: number): number {
        return this._vertices[v]._parents.length;
    }
    numChildren (v: number): number {
        return this._vertices[v]._children.length;
    }
    getParent (v: number): number {
        if (v === 0xFFFFFFFF) {
            return 0xFFFFFFFF;
        }
        const list = this._vertices[v]._parents;
        if (list.length === 0) {
            return 0xFFFFFFFF;
        } else {
            return list[0].target as number;
        }
    }
    isAncestor (ancestor: number, descendent: number): boolean {
        const pseudo = 0xFFFFFFFF;
        if (ancestor === descendent) {
            // when ancestor === descendent, is_ancestor is defined as false
            return false;
        }
        if (ancestor === pseudo) {
            // special case: pseudo root is always ancestor
            return true;
        }
        if (descendent === pseudo) {
            // special case: pseudo root is never descendent
            return false;
        }
        for (let parent = this.getParent(descendent); parent !== pseudo;) {
            if (ancestor === parent) {
                return true;
            }
            parent = this.getParent(parent);
        }
        return false;
    }
    //-----------------------------------------------------------------
    // MutableReferenceGraph
    addReference (u: number, v: number): ED | null {
        // update in/out edge list
        this._vertices[u]._children.push(new OutE(v));
        this._vertices[v]._parents.push(new OutE(u));
        return new ED(u, v);
    }
    removeReference (e: ED): void {
        const u = e.source as number;
        const v = e.target as number;
        const source = this._vertices[u];
        for (let i = 0; i !== source._children.length;) {
            if (source._children[i].target === v) {
                source._children.splice(i, 1);
                break; // remove one edge
            } else {
                ++i;
            }
        }
        const target = this._vertices[v];
        for (let i = 0; i !== target._parents.length;) {
            if (target._parents[i].target === u) {
                target._parents.splice(i, 1);
                break; // remove one edge
            } else {
                ++i;
            }
        }
    }
    removeReferences (u: number, v: number): void {
        const source = this._vertices[u];
        // remove out edges of u
        for (let i = 0; i !== source._children.length;) { // remove all edges
            if (source._children[i].target === v) {
                source._children.splice(i, 1);
            } else {
                ++i;
            }
        }
        // remove in edges of v
        const target = this._vertices[v];
        for (let i = 0; i !== target._parents.length;) { // remove all edges
            if (target._parents[i].target === u) {
                target._parents.splice(i, 1);
            } else {
                ++i;
            }
        }
    }

    readonly components: string[] = ['Name', 'Layout', 'Data', 'Valid'];
    readonly _vertices: RenderGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _layoutNodes: string[] = [];
    readonly _data: RenderData[] = [];
    readonly _valid: boolean[] = [];
    readonly index: Map<string, number> = new Map<string, number>();
    readonly sortedVertices: number[] = [];
}

export class RenderGraphObjectPoolSettings {
    constructor (batchSize: number) {
        this.clearValueBatchSize = batchSize;
        this.rasterViewBatchSize = batchSize;
        this.computeViewBatchSize = batchSize;
        this.resourceDescBatchSize = batchSize;
        this.resourceTraitsBatchSize = batchSize;
        this.renderSwapchainBatchSize = batchSize;
        this.resourceStatesBatchSize = batchSize;
        this.managedBufferBatchSize = batchSize;
        this.persistentBufferBatchSize = batchSize;
        this.managedTextureBatchSize = batchSize;
        this.persistentTextureBatchSize = batchSize;
        this.managedResourceBatchSize = batchSize;
        this.subpassBatchSize = batchSize;
        this.subpassGraphBatchSize = batchSize;
        this.rasterSubpassBatchSize = batchSize;
        this.computeSubpassBatchSize = batchSize;
        this.rasterPassBatchSize = batchSize;
        this.persistentRenderPassAndFramebufferBatchSize = batchSize;
        this.formatViewBatchSize = batchSize;
        this.subresourceViewBatchSize = batchSize;
        this.resourceGraphBatchSize = batchSize;
        this.computePassBatchSize = batchSize;
        this.resolvePassBatchSize = batchSize;
        this.copyPassBatchSize = batchSize;
        this.movePassBatchSize = batchSize;
        this.raytracePassBatchSize = batchSize;
        this.clearViewBatchSize = batchSize;
        this.renderQueueBatchSize = batchSize;
        this.sceneDataBatchSize = batchSize;
        this.dispatchBatchSize = batchSize;
        this.blitBatchSize = batchSize;
        this.renderDataBatchSize = batchSize;
        this.renderGraphBatchSize = batchSize;
    }
    clearValueBatchSize = 16;
    rasterViewBatchSize = 16;
    computeViewBatchSize = 16;
    resourceDescBatchSize = 16;
    resourceTraitsBatchSize = 16;
    renderSwapchainBatchSize = 16;
    resourceStatesBatchSize = 16;
    managedBufferBatchSize = 16;
    persistentBufferBatchSize = 16;
    managedTextureBatchSize = 16;
    persistentTextureBatchSize = 16;
    managedResourceBatchSize = 16;
    subpassBatchSize = 16;
    subpassGraphBatchSize = 16;
    rasterSubpassBatchSize = 16;
    computeSubpassBatchSize = 16;
    rasterPassBatchSize = 16;
    persistentRenderPassAndFramebufferBatchSize = 16;
    formatViewBatchSize = 16;
    subresourceViewBatchSize = 16;
    resourceGraphBatchSize = 16;
    computePassBatchSize = 16;
    resolvePassBatchSize = 16;
    copyPassBatchSize = 16;
    movePassBatchSize = 16;
    raytracePassBatchSize = 16;
    clearViewBatchSize = 16;
    renderQueueBatchSize = 16;
    sceneDataBatchSize = 16;
    dispatchBatchSize = 16;
    blitBatchSize = 16;
    renderDataBatchSize = 16;
    renderGraphBatchSize = 16;
}

export class RenderGraphObjectPool {
    constructor (settings: RenderGraphObjectPoolSettings, renderCommon: RenderCommonObjectPool) {
        this.renderCommon = renderCommon;
        this._clearValue = new RecyclePool<ClearValue>(() => new ClearValue(), settings.clearValueBatchSize);
        this._rasterView = new RecyclePool<RasterView>(() => new RasterView(), settings.rasterViewBatchSize);
        this._computeView = new RecyclePool<ComputeView>(() => new ComputeView(), settings.computeViewBatchSize);
        this._resourceDesc = new RecyclePool<ResourceDesc>(() => new ResourceDesc(), settings.resourceDescBatchSize);
        this._resourceTraits = new RecyclePool<ResourceTraits>(() => new ResourceTraits(), settings.resourceTraitsBatchSize);
        this._renderSwapchain = new RecyclePool<RenderSwapchain>(() => new RenderSwapchain(), settings.renderSwapchainBatchSize);
        this._resourceStates = new RecyclePool<ResourceStates>(() => new ResourceStates(), settings.resourceStatesBatchSize);
        this._managedBuffer = new RecyclePool<ManagedBuffer>(() => new ManagedBuffer(), settings.managedBufferBatchSize);
        this._persistentBuffer = new RecyclePool<PersistentBuffer>(() => new PersistentBuffer(), settings.persistentBufferBatchSize);
        this._managedTexture = new RecyclePool<ManagedTexture>(() => new ManagedTexture(), settings.managedTextureBatchSize);
        this._persistentTexture = new RecyclePool<PersistentTexture>(() => new PersistentTexture(), settings.persistentTextureBatchSize);
        this._managedResource = new RecyclePool<ManagedResource>(() => new ManagedResource(), settings.managedResourceBatchSize);
        this._subpass = new RecyclePool<Subpass>(() => new Subpass(), settings.subpassBatchSize);
        this._subpassGraph = new RecyclePool<SubpassGraph>(() => new SubpassGraph(), settings.subpassGraphBatchSize);
        this._rasterSubpass = new RecyclePool<RasterSubpass>(() => new RasterSubpass(), settings.rasterSubpassBatchSize);
        this._computeSubpass = new RecyclePool<ComputeSubpass>(() => new ComputeSubpass(), settings.computeSubpassBatchSize);
        this._rasterPass = new RecyclePool<RasterPass>(() => new RasterPass(), settings.rasterPassBatchSize);
        this._persistentRenderPassAndFramebuffer = new RecyclePool<PersistentRenderPassAndFramebuffer>(() => new PersistentRenderPassAndFramebuffer(), settings.persistentRenderPassAndFramebufferBatchSize);
        this._formatView = new RecyclePool<FormatView>(() => new FormatView(), settings.formatViewBatchSize);
        this._subresourceView = new RecyclePool<SubresourceView>(() => new SubresourceView(), settings.subresourceViewBatchSize);
        this._resourceGraph = new RecyclePool<ResourceGraph>(() => new ResourceGraph(), settings.resourceGraphBatchSize);
        this._computePass = new RecyclePool<ComputePass>(() => new ComputePass(), settings.computePassBatchSize);
        this._resolvePass = new RecyclePool<ResolvePass>(() => new ResolvePass(), settings.resolvePassBatchSize);
        this._copyPass = new RecyclePool<CopyPass>(() => new CopyPass(), settings.copyPassBatchSize);
        this._movePass = new RecyclePool<MovePass>(() => new MovePass(), settings.movePassBatchSize);
        this._raytracePass = new RecyclePool<RaytracePass>(() => new RaytracePass(), settings.raytracePassBatchSize);
        this._clearView = new RecyclePool<ClearView>(() => new ClearView(), settings.clearViewBatchSize);
        this._renderQueue = new RecyclePool<RenderQueue>(() => new RenderQueue(), settings.renderQueueBatchSize);
        this._sceneData = new RecyclePool<SceneData>(() => new SceneData(), settings.sceneDataBatchSize);
        this._dispatch = new RecyclePool<Dispatch>(() => new Dispatch(), settings.dispatchBatchSize);
        this._blit = new RecyclePool<Blit>(() => new Blit(), settings.blitBatchSize);
        this._renderData = new RecyclePool<RenderData>(() => new RenderData(), settings.renderDataBatchSize);
        this._renderGraph = new RecyclePool<RenderGraph>(() => new RenderGraph(), settings.renderGraphBatchSize);
    }
    reset (): void {
        this._clearValue.reset();
        this._rasterView.reset();
        this._computeView.reset();
        this._resourceDesc.reset();
        this._resourceTraits.reset();
        this._renderSwapchain.reset();
        this._resourceStates.reset();
        this._managedBuffer.reset();
        this._persistentBuffer.reset();
        this._managedTexture.reset();
        this._persistentTexture.reset();
        this._managedResource.reset();
        this._subpass.reset();
        this._subpassGraph.reset();
        this._rasterSubpass.reset();
        this._computeSubpass.reset();
        this._rasterPass.reset();
        this._persistentRenderPassAndFramebuffer.reset();
        this._formatView.reset();
        this._subresourceView.reset();
        this._resourceGraph.reset();
        this._computePass.reset();
        this._resolvePass.reset();
        this._copyPass.reset();
        this._movePass.reset();
        this._raytracePass.reset();
        this._clearView.reset();
        this._renderQueue.reset();
        this._sceneData.reset();
        this._dispatch.reset();
        this._blit.reset();
        this._renderData.reset();
        this._renderGraph.reset();
    }
    createClearValue (
        x = 0,
        y = 0,
        z = 0,
        w = 0,
    ): ClearValue {
        const v = this._clearValue.add();
        v.reset(x, y, z, w);
        return v;
    }
    createRasterView (
        slotName = '',
        accessType: AccessType = AccessType.WRITE,
        attachmentType: AttachmentType = AttachmentType.RENDER_TARGET,
        loadOp: LoadOp = LoadOp.LOAD,
        storeOp: StoreOp = StoreOp.STORE,
        clearFlags: ClearFlagBit = ClearFlagBit.ALL,
        shaderStageFlags: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
    ): RasterView {
        const v = this._rasterView.add();
        v.reset(slotName, accessType, attachmentType, loadOp, storeOp, clearFlags, shaderStageFlags);
        return v;
    }
    createComputeView (
        name = '',
        accessType: AccessType = AccessType.READ,
        clearFlags: ClearFlagBit = ClearFlagBit.NONE,
        clearValueType: ClearValueType = ClearValueType.NONE,
        shaderStageFlags: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
    ): ComputeView {
        const v = this._computeView.add();
        v.reset(name, accessType, clearFlags, clearValueType, shaderStageFlags);
        return v;
    }
    createResourceDesc (): ResourceDesc {
        const v = this._resourceDesc.add();
        v.reset();
        return v;
    }
    createResourceTraits (
        residency: ResourceResidency = ResourceResidency.MANAGED,
    ): ResourceTraits {
        const v = this._resourceTraits.add();
        v.reset(residency);
        return v;
    }
    createRenderSwapchain (
        swapchain: Swapchain | null = null,
    ): RenderSwapchain {
        const v = this._renderSwapchain.add();
        v.reset(swapchain);
        return v;
    }
    createResourceStates (): ResourceStates {
        const v = this._resourceStates.add();
        v.reset();
        return v;
    }
    createManagedBuffer (
        buffer: Buffer | null = null,
    ): ManagedBuffer {
        const v = this._managedBuffer.add();
        v.reset(buffer);
        return v;
    }
    createPersistentBuffer (
        buffer: Buffer | null = null,
    ): PersistentBuffer {
        const v = this._persistentBuffer.add();
        v.reset(buffer);
        return v;
    }
    createManagedTexture (
        texture: Texture | null = null,
    ): ManagedTexture {
        const v = this._managedTexture.add();
        v.reset(texture);
        return v;
    }
    createPersistentTexture (
        texture: Texture | null = null,
    ): PersistentTexture {
        const v = this._persistentTexture.add();
        v.reset(texture);
        return v;
    }
    createManagedResource (): ManagedResource {
        const v = this._managedResource.add();
        v.reset();
        return v;
    }
    createSubpass (): Subpass {
        const v = this._subpass.add();
        v.reset();
        return v;
    }
    createSubpassGraph (): SubpassGraph {
        const v = this._subpassGraph.add();
        v.clear();
        return v;
    }
    createRasterSubpass (
        subpassID = 0xFFFFFFFF,
        count = 1,
        quality = 0,
    ): RasterSubpass {
        const v = this._rasterSubpass.add();
        v.reset(subpassID, count, quality);
        return v;
    }
    createComputeSubpass (
        subpassID = 0xFFFFFFFF,
    ): ComputeSubpass {
        const v = this._computeSubpass.add();
        v.reset(subpassID);
        return v;
    }
    createRasterPass (): RasterPass {
        const v = this._rasterPass.add();
        v.reset();
        return v;
    }
    createPersistentRenderPassAndFramebuffer (
        renderPass: RenderPass | null = null,
        framebuffer: Framebuffer | null = null,
    ): PersistentRenderPassAndFramebuffer {
        const v = this._persistentRenderPassAndFramebuffer.add();
        v.reset(renderPass, framebuffer);
        return v;
    }
    createFormatView (): FormatView {
        const v = this._formatView.add();
        v.reset();
        return v;
    }
    createSubresourceView (): SubresourceView {
        const v = this._subresourceView.add();
        v.reset();
        return v;
    }
    createResourceGraph (): ResourceGraph {
        const v = this._resourceGraph.add();
        v.clear();
        return v;
    }
    createComputePass (): ComputePass {
        const v = this._computePass.add();
        v.reset();
        return v;
    }
    createResolvePass (): ResolvePass {
        const v = this._resolvePass.add();
        v.reset();
        return v;
    }
    createCopyPass (): CopyPass {
        const v = this._copyPass.add();
        v.reset();
        return v;
    }
    createMovePass (): MovePass {
        const v = this._movePass.add();
        v.reset();
        return v;
    }
    createRaytracePass (): RaytracePass {
        const v = this._raytracePass.add();
        v.reset();
        return v;
    }
    createClearView (
        slotName = '',
        clearFlags: ClearFlagBit = ClearFlagBit.ALL,
    ): ClearView {
        const v = this._clearView.add();
        v.reset(slotName, clearFlags);
        return v;
    }
    createRenderQueue (
        hint: QueueHint = QueueHint.RENDER_OPAQUE,
        phaseID = 0xFFFFFFFF,
    ): RenderQueue {
        const v = this._renderQueue.add();
        v.reset(hint, phaseID);
        return v;
    }
    createSceneData (
        scene: RenderScene | null = null,
        camera: Camera | null = null,
        flags: SceneFlags = SceneFlags.NONE,
        cullingFlags: CullingFlags = CullingFlags.CAMERA_FRUSTUM,
        shadingLight: Light | null = null,
    ): SceneData {
        const v = this._sceneData.add();
        v.reset(scene, camera, flags, cullingFlags, shadingLight);
        return v;
    }
    createDispatch (
        material: Material | null = null,
        passID = 0,
        threadGroupCountX = 0,
        threadGroupCountY = 0,
        threadGroupCountZ = 0,
    ): Dispatch {
        const v = this._dispatch.add();
        v.reset(material, passID, threadGroupCountX, threadGroupCountY, threadGroupCountZ);
        return v;
    }
    createBlit (
        material: Material | null = null,
        passID = 0,
        sceneFlags: SceneFlags = SceneFlags.NONE,
        camera: Camera | null = null,
    ): Blit {
        const v = this._blit.add();
        v.reset(material, passID, sceneFlags, camera);
        return v;
    }
    createRenderData (): RenderData {
        const v = this._renderData.add();
        v.reset();
        return v;
    }
    createRenderGraph (): RenderGraph {
        const v = this._renderGraph.add();
        v.clear();
        return v;
    }
    public readonly renderCommon: RenderCommonObjectPool;
    private readonly _clearValue: RecyclePool<ClearValue>;
    private readonly _rasterView: RecyclePool<RasterView>;
    private readonly _computeView: RecyclePool<ComputeView>;
    private readonly _resourceDesc: RecyclePool<ResourceDesc>;
    private readonly _resourceTraits: RecyclePool<ResourceTraits>;
    private readonly _renderSwapchain: RecyclePool<RenderSwapchain>;
    private readonly _resourceStates: RecyclePool<ResourceStates>;
    private readonly _managedBuffer: RecyclePool<ManagedBuffer>;
    private readonly _persistentBuffer: RecyclePool<PersistentBuffer>;
    private readonly _managedTexture: RecyclePool<ManagedTexture>;
    private readonly _persistentTexture: RecyclePool<PersistentTexture>;
    private readonly _managedResource: RecyclePool<ManagedResource>;
    private readonly _subpass: RecyclePool<Subpass>;
    private readonly _subpassGraph: RecyclePool<SubpassGraph>;
    private readonly _rasterSubpass: RecyclePool<RasterSubpass>;
    private readonly _computeSubpass: RecyclePool<ComputeSubpass>;
    private readonly _rasterPass: RecyclePool<RasterPass>;
    private readonly _persistentRenderPassAndFramebuffer: RecyclePool<PersistentRenderPassAndFramebuffer>;
    private readonly _formatView: RecyclePool<FormatView>;
    private readonly _subresourceView: RecyclePool<SubresourceView>;
    private readonly _resourceGraph: RecyclePool<ResourceGraph>;
    private readonly _computePass: RecyclePool<ComputePass>;
    private readonly _resolvePass: RecyclePool<ResolvePass>;
    private readonly _copyPass: RecyclePool<CopyPass>;
    private readonly _movePass: RecyclePool<MovePass>;
    private readonly _raytracePass: RecyclePool<RaytracePass>;
    private readonly _clearView: RecyclePool<ClearView>;
    private readonly _renderQueue: RecyclePool<RenderQueue>;
    private readonly _sceneData: RecyclePool<SceneData>;
    private readonly _dispatch: RecyclePool<Dispatch>;
    private readonly _blit: RecyclePool<Blit>;
    private readonly _renderData: RecyclePool<RenderData>;
    private readonly _renderGraph: RecyclePool<RenderGraph>;
}
