/*
 Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com

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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { AdjI, AdjacencyGraph, BidirectionalGraph, ComponentGraph, ED, InEI, MutableGraph, MutableReferenceGraph, NamedGraph, OutE, OutEI, PolymorphicGraph, PropertyGraph, ReferenceGraph, UuidGraph, VertexListGraph } from './graph';
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
    reset (x: number, y: number, z: number, w: number): void {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    declare x: number;
    declare y: number;
    declare z: number;
    declare w: number;
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
        slotName: string,
        accessType: AccessType,
        attachmentType: AttachmentType,
        loadOp: LoadOp,
        storeOp: StoreOp,
        clearFlags: ClearFlagBit,
        shaderStageFlags: ShaderStageFlagBit,
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
    declare slotName: string;
    slotName1 = '';
    declare accessType: AccessType;
    declare attachmentType: AttachmentType;
    declare loadOp: LoadOp;
    declare storeOp: StoreOp;
    declare clearFlags: ClearFlagBit;
    declare readonly clearColor: Color;
    slotID = 0;
    declare shaderStageFlags: ShaderStageFlagBit;
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
        name: string,
        accessType: AccessType,
        clearFlags: ClearFlagBit,
        clearValueType: ClearValueType,
        shaderStageFlags: ShaderStageFlagBit,
    ): void {
        this.name = name;
        this.accessType = accessType;
        this.plane = 0;
        this.clearFlags = clearFlags;
        this.clearValueType = clearValueType;
        this.clearValue.reset(0, 0, 0, 0);
        this.shaderStageFlags = shaderStageFlags;
    }
    declare name: string;
    declare accessType: AccessType;
    plane = 0;
    declare clearFlags: ClearFlagBit;
    declare clearValueType: ClearValueType;
    declare readonly clearValue: ClearValue;
    declare shaderStageFlags: ShaderStageFlagBit;
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
    reset (residency: ResourceResidency): void {
        this.residency = residency;
    }
    declare residency: ResourceResidency;
}

export class RenderSwapchain {
    constructor (swapchain: Swapchain | null = null, isDepthStencil = false) {
        this.swapchain = swapchain;
        this.isDepthStencil = isDepthStencil;
    }
    reset (swapchain: Swapchain | null, isDepthStencil: boolean): void {
        this.swapchain = swapchain;
        this.renderWindow = null;
        this.currentID = 0;
        this.numBackBuffers = 0;
        this.generation = 0xFFFFFFFF;
        this.isDepthStencil = isDepthStencil;
    }
    declare /*pointer*/ swapchain: Swapchain | null;
    /*pointer*/ renderWindow: RenderWindow | null = null;
    currentID = 0;
    numBackBuffers = 0;
    generation = 0xFFFFFFFF;
    declare isDepthStencil: boolean;
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
    reset (buffer: Buffer | null): void {
        this.buffer = buffer;
        this.fenceValue = 0;
    }
    declare /*refcount*/ buffer: Buffer | null;
    fenceValue = 0;
}

export class PersistentBuffer {
    constructor (buffer: Buffer | null = null) {
        this.buffer = buffer;
    }
    reset (buffer: Buffer | null): void {
        this.buffer = buffer;
        this.fenceValue = 0;
    }
    declare /*refcount*/ buffer: Buffer | null;
    fenceValue = 0;
}

export class ManagedTexture {
    constructor (texture: Texture | null = null) {
        this.texture = texture;
    }
    reset (texture: Texture | null): void {
        this.texture = texture;
        this.fenceValue = 0;
    }
    declare /*refcount*/ texture: Texture | null;
    fenceValue = 0;
}

export class PersistentTexture {
    constructor (texture: Texture | null = null) {
        this.texture = texture;
    }
    reset (texture: Texture | null): void {
        this.texture = texture;
        this.fenceValue = 0;
    }
    declare /*refcount*/ texture: Texture | null;
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
    /** Out edge list */
    readonly o: OutE[] = [];
    /** In edge list */
    readonly i: OutE[] = [];
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
    /** null vertex descriptor */
    readonly N = 0xFFFFFFFF;
    // type edge_descriptor = ED;
    //-----------------------------------------------------------------
    // IncidenceGraph
    // type out_edge_iterator = OutEI;
    // type degree_size_type = number;
    edge (u: number, v: number): boolean {
        for (const oe of this.x[u].o) {
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
    oe (v: number): OutEI {
        return new OutEI(this.x[v].o.values(), v);
    }
    od (v: number): number {
        return this.x[v].o.length;
    }
    //-----------------------------------------------------------------
    // BidirectionalGraph
    // type in_edge_iterator = InEI;
    ie (v: number): InEI {
        return new InEI(this.x[v].i.values(), v);
    }
    id (v: number): number {
        return this.x[v].i.length;
    }
    degree (v: number): number {
        return this.od(v) + this.id(v);
    }
    //-----------------------------------------------------------------
    // AdjacencyGraph
    // type adjacency_iterator = AdjI;
    adjacentVertices (v: number): AdjI {
        return new AdjI(this, this.oe(v));
    }
    //-----------------------------------------------------------------
    // VertexListGraph
    vertices (): IterableIterator<number> {
        return this.x.keys();
    }
    numVertices (): number {
        return this.x.length;
    }
    //-----------------------------------------------------------------
    // EdgeListGraph
    numEdges (): number {
        let numEdges = 0;
        for (const v of this.vertices()) {
            numEdges += this.od(v);
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
        this.x.length = 0;
    }
    addVertex (
        name: string,
        subpass: Subpass,
    ): number {
        const vert = new SubpassGraphVertex();
        const v = this.x.length;
        this.x.push(vert);
        this._names.push(name);
        this._subpasses.push(subpass);
        return v;
    }
    addEdge (u: number, v: number): ED | null {
        // update in/out edge list
        this.x[u].o.push(new OutE(v));
        this.x[v].i.push(new OutE(u));
        return new ED(u, v);
    }
    //-----------------------------------------------------------------
    // NamedGraph
    vertexName (v: number): string {
        return this._names[v];
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    getName (v: number): string {
        return this._names[v];
    }
    setName (v: number, value: string): void {
        this._names[v] = value;
    }
    getSubpass (v: number): Subpass {
        return this._subpasses[v];
    }
    readonly x: SubpassGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _subpasses: Subpass[] = [];
}

export class RasterSubpass {
    constructor (subpassID = 0xFFFFFFFF, count = 1, quality = 0) {
        this.subpassID = subpassID;
        this.count = count;
        this.quality = quality;
    }
    reset (subpassID: number, count: number, quality: number): void {
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
    declare subpassID: number;
    declare count: number;
    declare quality: number;
    showStatistics = false;
}

export class ComputeSubpass {
    constructor (subpassID = 0xFFFFFFFF) {
        this.subpassID = subpassID;
    }
    reset (subpassID: number): void {
        this.rasterViews.clear();
        this.computeViews.clear();
        this.subpassID = subpassID;
    }
    readonly rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
    declare subpassID: number;
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
    reset (renderPass: RenderPass | null, framebuffer: Framebuffer | null): void {
        this.renderPass = renderPass;
        this.framebuffer = framebuffer;
        this.clearColors.length = 0;
        this.clearDepth = 0;
        this.clearStencil = 0;
    }
    declare /*refcount*/ renderPass: RenderPass | null;
    declare /*refcount*/ framebuffer: Framebuffer | null;
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
        this.t = id;
        this.j = object;
    }
    /** Out edge list */
    readonly o: OutE[] = [];
    /** In edge list */
    readonly i: OutE[] = [];
    /** Polymorphic object Id */
    readonly t: ResourceGraphValue;
    /** Polymorphic object */
    j: ResourceGraphObject;
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
    /** null vertex descriptor */
    readonly N = 0xFFFFFFFF;
    // type edge_descriptor = ED;
    //-----------------------------------------------------------------
    // IncidenceGraph
    // type out_edge_iterator = OutEI;
    // type degree_size_type = number;
    edge (u: number, v: number): boolean {
        for (const oe of this.x[u].o) {
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
    oe (v: number): OutEI {
        return new OutEI(this.x[v].o.values(), v);
    }
    od (v: number): number {
        return this.x[v].o.length;
    }
    //-----------------------------------------------------------------
    // BidirectionalGraph
    // type in_edge_iterator = InEI;
    ie (v: number): InEI {
        return new InEI(this.x[v].i.values(), v);
    }
    id (v: number): number {
        return this.x[v].i.length;
    }
    degree (v: number): number {
        return this.od(v) + this.id(v);
    }
    //-----------------------------------------------------------------
    // AdjacencyGraph
    // type adjacency_iterator = AdjI;
    adjacentVertices (v: number): AdjI {
        return new AdjI(this, this.oe(v));
    }
    //-----------------------------------------------------------------
    // VertexListGraph
    vertices (): IterableIterator<number> {
        return this.x.keys();
    }
    numVertices (): number {
        return this.x.length;
    }
    //-----------------------------------------------------------------
    // EdgeListGraph
    numEdges (): number {
        let numEdges = 0;
        for (const v of this.vertices()) {
            numEdges += this.od(v);
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
        this.x.length = 0;
    }
    addVertex<T extends ResourceGraphValue> (
        id: T,
        object: ResourceGraphValueType[T],
        name: string,
        desc: ResourceDesc,
        traits: ResourceTraits,
        states: ResourceStates,
        sampler: SamplerInfo,
        u = 0xFFFFFFFF,
    ): number {
        const vert = new ResourceGraphVertex(id, object);
        const v = this.x.length;
        this.x.push(vert);
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
    addEdge (u: number, v: number): ED | null {
        // update in/out edge list
        this.x[u].o.push(new OutE(v));
        this.x[v].i.push(new OutE(u));
        return new ED(u, v);
    }
    //-----------------------------------------------------------------
    // NamedGraph
    vertexName (v: number): string {
        return this._names[v];
    }
    //-----------------------------------------------------------------
    // ComponentGraph
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
    h (id: ResourceGraphValue, v: number): boolean {
        return this.x[v].t === id;
    }
    w (v: number): ResourceGraphValue {
        return this.x[v].t;
    }
    object (v: number): ResourceGraphObject {
        return this.x[v].j;
    }
    value<T extends ResourceGraphValue> (id: T, v: number): ResourceGraphValueType[T] {
        if (this.x[v].t === id) {
            return this.x[v].j as ResourceGraphValueType[T];
        } else {
            throw Error('value id not match');
        }
    }
    visitVertex (visitor: ResourceGraphVisitor, v: number): unknown {
        const vert = this.x[v];
        switch (vert.t) {
        case ResourceGraphValue.Managed:
            return visitor.managed(vert.j as ManagedResource);
        case ResourceGraphValue.ManagedBuffer:
            return visitor.managedBuffer(vert.j as ManagedBuffer);
        case ResourceGraphValue.ManagedTexture:
            return visitor.managedTexture(vert.j as ManagedTexture);
        case ResourceGraphValue.PersistentBuffer:
            return visitor.persistentBuffer(vert.j as PersistentBuffer);
        case ResourceGraphValue.PersistentTexture:
            return visitor.persistentTexture(vert.j as PersistentTexture);
        case ResourceGraphValue.Framebuffer:
            return visitor.framebuffer(vert.j as Framebuffer);
        case ResourceGraphValue.Swapchain:
            return visitor.swapchain(vert.j as RenderSwapchain);
        case ResourceGraphValue.FormatView:
            return visitor.formatView(vert.j as FormatView);
        case ResourceGraphValue.SubresourceView:
            return visitor.subresourceView(vert.j as SubresourceView);
        default:
            throw Error('polymorphic type not found');
        }
    }
    j<T extends ResourceGraphObject> (v: number): T {
        return this.x[v].j as T;
    }
    //-----------------------------------------------------------------
    // ReferenceGraph
    // type reference_descriptor = ED;
    // type child_iterator = OutEI;
    // type parent_iterator = InEI;
    reference (u: number, v: number): boolean {
        for (const oe of this.x[u].o) {
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
    children (v: number): OutEI {
        return new OutEI(this.x[v].o.values(), v);
    }
    numChildren (v: number): number {
        return this.x[v].o.length;
    }
    getParent (v: number): number {
        if (v === 0xFFFFFFFF) {
            return 0xFFFFFFFF;
        }
        const list = this.x[v].i;
        if (list.length === 0) {
            return 0xFFFFFFFF;
        } else {
            return list[0].target as number;
        }
    }
    //-----------------------------------------------------------------
    // MutableReferenceGraph
    addReference (u: number, v: number): ED | null {
        return this.addEdge(u, v);
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
    readonly x: ResourceGraphVertex[] = [];
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
    reset (slotName: string, clearFlags: ClearFlagBit): void {
        this.slotName = slotName;
        this.clearFlags = clearFlags;
        this.clearColor.reset();
    }
    declare slotName: string;
    declare clearFlags: ClearFlagBit;
    declare readonly clearColor: Color;
}

export class RenderQueue {
    constructor (hint: QueueHint = QueueHint.RENDER_OPAQUE, phaseID = 0xFFFFFFFF, passLayoutID = 0xFFFFFFFF) {
        this.hint = hint;
        this.phaseID = phaseID;
        this.passLayoutID = passLayoutID;
    }
    reset (hint: QueueHint, phaseID: number, passLayoutID: number): void {
        this.hint = hint;
        this.phaseID = phaseID;
        this.passLayoutID = passLayoutID;
        this.viewport = null;
    }
    declare hint: QueueHint;
    declare phaseID: number;
    declare passLayoutID: number;
    viewport: Viewport | null = null;
}

export const enum CullingFlags {
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
        scene: RenderScene | null,
        camera: Camera | null,
        flags: SceneFlags,
        cullingFlags: CullingFlags,
        shadingLight: Light | null,
    ): void {
        this.scene = scene;
        this.camera = camera;
        this.light.reset(null, 0, false, null);
        this.flags = flags;
        this.cullingFlags = cullingFlags;
        this.shadingLight = shadingLight;
    }
    declare /*pointer*/ scene: RenderScene | null;
    declare /*pointer*/ camera: Camera | null;
    declare readonly light: LightInfo;
    declare flags: SceneFlags;
    declare cullingFlags: CullingFlags;
    declare /*refcount*/ shadingLight: Light | null;
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
        material: Material | null,
        passID: number,
        threadGroupCountX: number,
        threadGroupCountY: number,
        threadGroupCountZ: number,
    ): void {
        this.material = material;
        this.passID = passID;
        this.threadGroupCountX = threadGroupCountX;
        this.threadGroupCountY = threadGroupCountY;
        this.threadGroupCountZ = threadGroupCountZ;
    }
    declare /*refcount*/ material: Material | null;
    declare passID: number;
    declare threadGroupCountX: number;
    declare threadGroupCountY: number;
    declare threadGroupCountZ: number;
}

export class Blit {
    constructor (material: Material | null = null, passID = 0, sceneFlags: SceneFlags = SceneFlags.NONE, camera: Camera | null = null) {
        this.material = material;
        this.passID = passID;
        this.sceneFlags = sceneFlags;
        this.camera = camera;
    }
    reset (material: Material | null, passID: number, sceneFlags: SceneFlags, camera: Camera | null): void {
        this.material = material;
        this.passID = passID;
        this.sceneFlags = sceneFlags;
        this.camera = camera;
    }
    declare /*refcount*/ material: Material | null;
    declare passID: number;
    declare sceneFlags: SceneFlags;
    declare /*pointer*/ camera: Camera | null;
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
        this.t = id;
        this.j = object;
    }
    /** Out edge list */
    readonly o: OutE[] = [];
    /** In edge list */
    readonly i: OutE[] = [];
    /** Child edge list */
    readonly c: OutE[] = [];
    /** Parent edge list */
    readonly p: OutE[] = [];
    /** Polymorphic object Id */
    readonly t: RenderGraphValue;
    /** Polymorphic object */
    j: RenderGraphObject;
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
    /** null vertex descriptor */
    readonly N = 0xFFFFFFFF;
    // type edge_descriptor = ED;
    //-----------------------------------------------------------------
    // IncidenceGraph
    // type out_edge_iterator = OutEI;
    // type degree_size_type = number;
    edge (u: number, v: number): boolean {
        for (const oe of this.x[u].o) {
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
    oe (v: number): OutEI {
        return new OutEI(this.x[v].o.values(), v);
    }
    od (v: number): number {
        return this.x[v].o.length;
    }
    //-----------------------------------------------------------------
    // BidirectionalGraph
    // type in_edge_iterator = InEI;
    ie (v: number): InEI {
        return new InEI(this.x[v].i.values(), v);
    }
    id (v: number): number {
        return this.x[v].i.length;
    }
    degree (v: number): number {
        return this.od(v) + this.id(v);
    }
    //-----------------------------------------------------------------
    // AdjacencyGraph
    // type adjacency_iterator = AdjI;
    adjacentVertices (v: number): AdjI {
        return new AdjI(this, this.oe(v));
    }
    //-----------------------------------------------------------------
    // VertexListGraph
    vertices (): IterableIterator<number> {
        return this.x.keys();
    }
    numVertices (): number {
        return this.x.length;
    }
    //-----------------------------------------------------------------
    // EdgeListGraph
    numEdges (): number {
        let numEdges = 0;
        for (const v of this.vertices()) {
            numEdges += this.od(v);
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
        this.x.length = 0;
    }
    addVertex<T extends RenderGraphValue> (
        id: T,
        object: RenderGraphValueType[T],
        name: string,
        layout: string,
        data: RenderData,
        valid: boolean,
        u = 0xFFFFFFFF,
    ): number {
        const vert = new RenderGraphVertex(id, object);
        const v = this.x.length;
        this.x.push(vert);
        this._names.push(name);
        this._layoutNodes.push(layout);
        this._data.push(data);
        this._valid.push(valid);

        // ReferenceGraph
        if (u !== 0xFFFFFFFF) {
            this.x[u].c.push(new OutE(v));
            vert.p.push(new OutE(u));
        }

        return v;
    }
    addEdge (u: number, v: number): ED | null {
        // update in/out edge list
        this.x[u].o.push(new OutE(v));
        this.x[v].i.push(new OutE(u));
        return new ED(u, v);
    }
    //-----------------------------------------------------------------
    // NamedGraph
    vertexName (v: number): string {
        return this._names[v];
    }
    //-----------------------------------------------------------------
    // ComponentGraph
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
    h (id: RenderGraphValue, v: number): boolean {
        return this.x[v].t === id;
    }
    w (v: number): RenderGraphValue {
        return this.x[v].t;
    }
    object (v: number): RenderGraphObject {
        return this.x[v].j;
    }
    value<T extends RenderGraphValue> (id: T, v: number): RenderGraphValueType[T] {
        if (this.x[v].t === id) {
            return this.x[v].j as RenderGraphValueType[T];
        } else {
            throw Error('value id not match');
        }
    }
    visitVertex (visitor: RenderGraphVisitor, v: number): unknown {
        const vert = this.x[v];
        switch (vert.t) {
        case RenderGraphValue.RasterPass:
            return visitor.rasterPass(vert.j as RasterPass);
        case RenderGraphValue.RasterSubpass:
            return visitor.rasterSubpass(vert.j as RasterSubpass);
        case RenderGraphValue.ComputeSubpass:
            return visitor.computeSubpass(vert.j as ComputeSubpass);
        case RenderGraphValue.Compute:
            return visitor.compute(vert.j as ComputePass);
        case RenderGraphValue.Resolve:
            return visitor.resolve(vert.j as ResolvePass);
        case RenderGraphValue.Copy:
            return visitor.copy(vert.j as CopyPass);
        case RenderGraphValue.Move:
            return visitor.move(vert.j as MovePass);
        case RenderGraphValue.Raytrace:
            return visitor.raytrace(vert.j as RaytracePass);
        case RenderGraphValue.Queue:
            return visitor.queue(vert.j as RenderQueue);
        case RenderGraphValue.Scene:
            return visitor.scene(vert.j as SceneData);
        case RenderGraphValue.Blit:
            return visitor.blit(vert.j as Blit);
        case RenderGraphValue.Dispatch:
            return visitor.dispatch(vert.j as Dispatch);
        case RenderGraphValue.Clear:
            return visitor.clear(vert.j as ClearView[]);
        case RenderGraphValue.Viewport:
            return visitor.viewport(vert.j as Viewport);
        default:
            throw Error('polymorphic type not found');
        }
    }
    j<T extends RenderGraphObject> (v: number): T {
        return this.x[v].j as T;
    }
    //-----------------------------------------------------------------
    // ReferenceGraph
    // type reference_descriptor = ED;
    // type child_iterator = OutEI;
    // type parent_iterator = InEI;
    reference (u: number, v: number): boolean {
        for (const oe of this.x[u].c) {
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
    children (v: number): OutEI {
        return new OutEI(this.x[v].c.values(), v);
    }
    numChildren (v: number): number {
        return this.x[v].c.length;
    }
    getParent (v: number): number {
        if (v === 0xFFFFFFFF) {
            return 0xFFFFFFFF;
        }
        const list = this.x[v].p;
        if (list.length === 0) {
            return 0xFFFFFFFF;
        } else {
            return list[0].target as number;
        }
    }
    //-----------------------------------------------------------------
    // MutableReferenceGraph
    addReference (u: number, v: number): ED | null {
        // update in/out edge list
        this.x[u].c.push(new OutE(v));
        this.x[v].p.push(new OutE(u));
        return new ED(u, v);
    }
    readonly x: RenderGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _layoutNodes: string[] = [];
    readonly _data: RenderData[] = [];
    readonly _valid: boolean[] = [];
    readonly index: Map<string, number> = new Map<string, number>();
    readonly sortedVertices: number[] = [];
}

export class RenderGraphObjectPool {
    constructor (renderCommon: RenderCommonObjectPool) {
        this.renderCommon = renderCommon;
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
        isDepthStencil = false,
    ): RenderSwapchain {
        const v = this._renderSwapchain.add();
        v.reset(swapchain, isDepthStencil);
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
        passLayoutID = 0xFFFFFFFF,
    ): RenderQueue {
        const v = this._renderQueue.add();
        v.reset(hint, phaseID, passLayoutID);
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
    private readonly _clearValue: RecyclePool<ClearValue> = new RecyclePool<ClearValue>(() => new ClearValue(), 16);
    private readonly _rasterView: RecyclePool<RasterView> = new RecyclePool<RasterView>(() => new RasterView(), 16);
    private readonly _computeView: RecyclePool<ComputeView> = new RecyclePool<ComputeView>(() => new ComputeView(), 16);
    private readonly _resourceDesc: RecyclePool<ResourceDesc> = new RecyclePool<ResourceDesc>(() => new ResourceDesc(), 16);
    private readonly _resourceTraits: RecyclePool<ResourceTraits> = new RecyclePool<ResourceTraits>(() => new ResourceTraits(), 16);
    private readonly _renderSwapchain: RecyclePool<RenderSwapchain> = new RecyclePool<RenderSwapchain>(() => new RenderSwapchain(), 16);
    private readonly _resourceStates: RecyclePool<ResourceStates> = new RecyclePool<ResourceStates>(() => new ResourceStates(), 16);
    private readonly _managedBuffer: RecyclePool<ManagedBuffer> = new RecyclePool<ManagedBuffer>(() => new ManagedBuffer(), 16);
    private readonly _persistentBuffer: RecyclePool<PersistentBuffer> = new RecyclePool<PersistentBuffer>(() => new PersistentBuffer(), 16);
    private readonly _managedTexture: RecyclePool<ManagedTexture> = new RecyclePool<ManagedTexture>(() => new ManagedTexture(), 16);
    private readonly _persistentTexture: RecyclePool<PersistentTexture> = new RecyclePool<PersistentTexture>(() => new PersistentTexture(), 16);
    private readonly _managedResource: RecyclePool<ManagedResource> = new RecyclePool<ManagedResource>(() => new ManagedResource(), 16);
    private readonly _subpass: RecyclePool<Subpass> = new RecyclePool<Subpass>(() => new Subpass(), 16);
    private readonly _subpassGraph: RecyclePool<SubpassGraph> = new RecyclePool<SubpassGraph>(() => new SubpassGraph(), 16);
    private readonly _rasterSubpass: RecyclePool<RasterSubpass> = new RecyclePool<RasterSubpass>(() => new RasterSubpass(), 16);
    private readonly _computeSubpass: RecyclePool<ComputeSubpass> = new RecyclePool<ComputeSubpass>(() => new ComputeSubpass(), 16);
    private readonly _rasterPass: RecyclePool<RasterPass> = new RecyclePool<RasterPass>(() => new RasterPass(), 16);
    private readonly _persistentRenderPassAndFramebuffer: RecyclePool<PersistentRenderPassAndFramebuffer> = new RecyclePool<PersistentRenderPassAndFramebuffer>(() => new PersistentRenderPassAndFramebuffer(), 16);
    private readonly _formatView: RecyclePool<FormatView> = new RecyclePool<FormatView>(() => new FormatView(), 16);
    private readonly _subresourceView: RecyclePool<SubresourceView> = new RecyclePool<SubresourceView>(() => new SubresourceView(), 16);
    private readonly _resourceGraph: RecyclePool<ResourceGraph> = new RecyclePool<ResourceGraph>(() => new ResourceGraph(), 16);
    private readonly _computePass: RecyclePool<ComputePass> = new RecyclePool<ComputePass>(() => new ComputePass(), 16);
    private readonly _resolvePass: RecyclePool<ResolvePass> = new RecyclePool<ResolvePass>(() => new ResolvePass(), 16);
    private readonly _copyPass: RecyclePool<CopyPass> = new RecyclePool<CopyPass>(() => new CopyPass(), 16);
    private readonly _movePass: RecyclePool<MovePass> = new RecyclePool<MovePass>(() => new MovePass(), 16);
    private readonly _raytracePass: RecyclePool<RaytracePass> = new RecyclePool<RaytracePass>(() => new RaytracePass(), 16);
    private readonly _clearView: RecyclePool<ClearView> = new RecyclePool<ClearView>(() => new ClearView(), 16);
    private readonly _renderQueue: RecyclePool<RenderQueue> = new RecyclePool<RenderQueue>(() => new RenderQueue(), 16);
    private readonly _sceneData: RecyclePool<SceneData> = new RecyclePool<SceneData>(() => new SceneData(), 16);
    private readonly _dispatch: RecyclePool<Dispatch> = new RecyclePool<Dispatch>(() => new Dispatch(), 16);
    private readonly _blit: RecyclePool<Blit> = new RecyclePool<Blit>(() => new Blit(), 16);
    private readonly _renderData: RecyclePool<RenderData> = new RecyclePool<RenderData>(() => new RenderData(), 16);
    private readonly _renderGraph: RecyclePool<RenderGraph> = new RecyclePool<RenderGraph>(() => new RenderGraph(), 16);
}
