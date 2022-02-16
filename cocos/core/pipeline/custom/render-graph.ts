import * as impl from './graph';
import { Camera } from '../../renderer/scene/camera';
import { Buffer, ClearFlagBit, Color, Format, LoadOp, SampleCount, Sampler, StoreOp, Texture } from '../../gfx/index';
import { PipelineSceneData } from '../pipeline-scene-data';
import { QueueHint, ResourceDimension, ResourceResidency } from './types';
import { Mat4 } from '../../math';
import { legacyCC } from '../../global-exports';
import { RenderScene } from '../../renderer/scene';

export const enum ResourceFlags {
    None = 0,
    AllowRenderTarget = 0x1,
    AllowDepthStencil = 0x2,
    AllowUnorderedAccess = 0x4,
    DenyShaderResource = 0x8,
    AllowCrossAdapter = 0x10,
    AllowSimultaneousAccess = 0x20,
    VideoDecodeReferenceOnly = 0x40,
}

export const enum TextureLayout {
    Unknown,
    RowMajor,
    UndefinedSwizzle,
    StandardSwizzle,
}

export class ResourceDesc {
    dimension: ResourceDimension = ResourceDimension.Buffer;
    alignment = 0;
    width = 0;
    height = 0;
    depthOrArraySize = 0;
    mipLevels = 0;
    format: Format = Format.UNKNOWN;
    sampleCount: SampleCount = SampleCount.ONE;
    layout: TextureLayout = TextureLayout.Unknown;
    flags: ResourceFlags = ResourceFlags.None;
}

export class ResourceTraits {
    constructor (residency: ResourceResidency = ResourceResidency.Managed) {
        this.residency = residency;
    }
    residency: ResourceResidency;
}

//=================================================================
// ResourceGraph
//=================================================================
// Graph Concept
export class ResourceGraphVertex {
    constructor () {
    }
    readonly _outEdges: impl.OutE[] = [];
    readonly _inEdges: impl.OutE[] = [];
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class ResourceGraphNameMap implements impl.PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    readonly _names: string[];
}

export class ResourceGraphDescMap implements impl.PropertyMap {
    constructor (readonly descs: ResourceDesc[]) {
        this._descs = descs;
    }
    get (v: number): ResourceDesc {
        return this._descs[v];
    }
    readonly _descs: ResourceDesc[];
}

export class ResourceGraphTraitsMap implements impl.PropertyMap {
    constructor (readonly traits: ResourceTraits[]) {
        this._traits = traits;
    }
    get (v: number): ResourceTraits {
        return this._traits[v];
    }
    readonly _traits: ResourceTraits[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum ResourceGraphComponent {
    name,
    desc,
    traits,
}

interface ResourceGraphComponentType {
    [ResourceGraphComponent.name]: string;
    [ResourceGraphComponent.desc]: ResourceDesc;
    [ResourceGraphComponent.traits]: ResourceTraits;
}

interface ResourceGraphComponentPropertyMap {
    [ResourceGraphComponent.name]: ResourceGraphNameMap;
    [ResourceGraphComponent.desc]: ResourceGraphDescMap;
    [ResourceGraphComponent.traits]: ResourceGraphTraitsMap;
}

//-----------------------------------------------------------------
// ResourceGraph Implementation
export class ResourceGraph implements impl.BidirectionalGraph
, impl.AdjacencyGraph
, impl.VertexListGraph
, impl.MutableGraph
, impl.PropertyGraph
, impl.NamedGraph
, impl.ComponentGraph {
    //-----------------------------------------------------------------
    // Graph
    // type vertex_descriptor = number;
    nullVertex (): number { return 0xFFFFFFFF; }
    // type edge_descriptor = impl.ED;
    readonly directed_category: impl.directional = impl.directional.bidirectional;
    readonly edge_parallel_category: impl.parallel = impl.parallel.allow;
    readonly traversal_category: impl.traversal = impl.traversal.incidence
        | impl.traversal.bidirectional
        | impl.traversal.adjacency
        | impl.traversal.vertex_list;
    //-----------------------------------------------------------------
    // IncidenceGraph
    // type out_edge_iterator = impl.OutEI;
    // type degree_size_type = number;
    edge (u: number, v: number): boolean {
        for (const oe of this._vertices[u]._outEdges) {
            if (v === oe.target as number) {
                return true;
            }
        }
        return false;
    }
    source (e: impl.ED): number {
        return e.source as number;
    }
    target (e: impl.ED): number {
        return e.target as number;
    }
    outEdges (v: number): impl.OutEI {
        return new impl.OutEI(this._vertices[v]._outEdges.values(), v);
    }
    outDegree (v: number): number {
        return this._vertices[v]._outEdges.length;
    }
    //-----------------------------------------------------------------
    // BidirectionalGraph
    // type in_edge_iterator = impl.InEI;
    inEdges (v: number): impl.InEI {
        return new impl.InEI(this._vertices[v]._inEdges.values(), v);
    }
    inDegree (v: number): number {
        return this._vertices[v]._inEdges.length;
    }
    degree (v: number): number {
        return this.outDegree(v) + this.inDegree(v);
    }
    //-----------------------------------------------------------------
    // AdjacencyGraph
    // type adjacency_iterator = impl.AdjI;
    adjacentVertices (v: number): impl.AdjI {
        return new impl.AdjI(this, this.outEdges(v));
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
    // MutableGraph
    addVertex (
        name: string,
        desc: ResourceDesc,
        traits: ResourceTraits,
    ): number {
        const vert = new ResourceGraphVertex();
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._names.push(name);
        this._descs.push(desc);
        this._traits.push(traits);
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
        this._descs.splice(u, 1);
        this._traits.splice(u, 1);

        const sz = this._vertices.length;
        if (u === sz) {
            return;
        }

        for (let v = 0; v !== sz; ++v) {
            const vert = this._vertices[v];
            impl.reindexEdgeList(vert._outEdges, u);
            impl.reindexEdgeList(vert._inEdges, u);
        }
    }
    addEdge (u: number, v: number): impl.ED | null {
        // update in/out edge list
        this._vertices[u]._outEdges.push(new impl.OutE(v));
        this._vertices[v]._inEdges.push(new impl.OutE(u));
        return new impl.ED(u, v);
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
    removeEdge (e: impl.ED): void {
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
    get (tag: string): ResourceGraphNameMap | ResourceGraphDescMap | ResourceGraphTraitsMap {
        switch (tag) {
        // Components
        case 'name':
            return new ResourceGraphNameMap(this._names);
        case 'desc':
            return new ResourceGraphDescMap(this._descs);
        case 'traits':
            return new ResourceGraphTraitsMap(this._traits);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends ResourceGraphComponent> (id: T, v: number): ResourceGraphComponentType[T] {
        switch (id) {
        case ResourceGraphComponent.name:
            return this._names[v] as ResourceGraphComponentType[T];
        case ResourceGraphComponent.desc:
            return this._descs[v] as ResourceGraphComponentType[T];
        case ResourceGraphComponent.traits:
            return this._traits[v] as ResourceGraphComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends ResourceGraphComponent> (id: T): ResourceGraphComponentPropertyMap[T] {
        switch (id) {
        case ResourceGraphComponent.name:
            return new ResourceGraphNameMap(this._names) as ResourceGraphComponentPropertyMap[T];
        case ResourceGraphComponent.desc:
            return new ResourceGraphDescMap(this._descs) as ResourceGraphComponentPropertyMap[T];
        case ResourceGraphComponent.traits:
            return new ResourceGraphTraitsMap(this._traits) as ResourceGraphComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._names[v];
    }
    getDesc (v: number): ResourceDesc {
        return this._descs[v];
    }
    getTraits (v: number): ResourceTraits {
        return this._traits[v];
    }

    readonly components: string[] = ['name', 'desc', 'traits'];
    readonly _vertices: ResourceGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _descs: ResourceDesc[] = [];
    readonly _traits: ResourceTraits[] = [];
}

export const enum AttachmentType {
    RenderTarget,
    DepthStencil,
}

export const enum AccessType {
    Read,
    ReadWrite,
    Write,
}

export class RasterView {
    constructor (
        slotName = '',
        accessType: AccessType = AccessType.Write,
        attachmentType: AttachmentType = AttachmentType.RenderTarget,
        loadOp: LoadOp = LoadOp.LOAD,
        storeOp: StoreOp = StoreOp.STORE,
        clearFlags: ClearFlagBit = ClearFlagBit.ALL,
        clearColor: Color = new Color(),
    ) {
        this.slotName = slotName;
        this.accessType = accessType;
        this.attachmentType = attachmentType;
        this.loadOp = loadOp;
        this.storeOp = storeOp;
        this.clearFlags = clearFlags;
        this.clearColor = clearColor;
    }
    slotName: string;
    accessType: AccessType;
    attachmentType: AttachmentType;
    loadOp: LoadOp;
    storeOp: StoreOp;
    clearFlags: ClearFlagBit;
    clearColor: Color;
}

export const enum ClearValueType {
    Float,
    Int,
}

export class ComputeView {
    name = '';
    accessType: AccessType = AccessType.Read;
    clearFlags: ClearFlagBit = ClearFlagBit.NONE;
    clearColor: Color = new Color();
    clearValueType: ClearValueType = ClearValueType.Float;
}

export class RasterSubpass {
    rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
}

//=================================================================
// SubpassGraph
//=================================================================
// Graph Concept
export class SubpassGraphVertex {
    constructor () {
    }
    readonly _outEdges: impl.OutE[] = [];
    readonly _inEdges: impl.OutE[] = [];
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class SubpassGraphNameMap implements impl.PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    readonly _names: string[];
}

export class SubpassGraphSubpassMap implements impl.PropertyMap {
    constructor (readonly subpasses: RasterSubpass[]) {
        this._subpasses = subpasses;
    }
    get (v: number): RasterSubpass {
        return this._subpasses[v];
    }
    readonly _subpasses: RasterSubpass[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum SubpassGraphComponent {
    name,
    subpass,
}

interface SubpassGraphComponentType {
    [SubpassGraphComponent.name]: string;
    [SubpassGraphComponent.subpass]: RasterSubpass;
}

interface SubpassGraphComponentPropertyMap {
    [SubpassGraphComponent.name]: SubpassGraphNameMap;
    [SubpassGraphComponent.subpass]: SubpassGraphSubpassMap;
}

//-----------------------------------------------------------------
// SubpassGraph Implementation
export class SubpassGraph implements impl.BidirectionalGraph
, impl.AdjacencyGraph
, impl.VertexListGraph
, impl.MutableGraph
, impl.PropertyGraph
, impl.NamedGraph
, impl.ComponentGraph {
    //-----------------------------------------------------------------
    // Graph
    // type vertex_descriptor = number;
    nullVertex (): number { return 0xFFFFFFFF; }
    // type edge_descriptor = impl.ED;
    readonly directed_category: impl.directional = impl.directional.bidirectional;
    readonly edge_parallel_category: impl.parallel = impl.parallel.allow;
    readonly traversal_category: impl.traversal = impl.traversal.incidence
        | impl.traversal.bidirectional
        | impl.traversal.adjacency
        | impl.traversal.vertex_list;
    //-----------------------------------------------------------------
    // IncidenceGraph
    // type out_edge_iterator = impl.OutEI;
    // type degree_size_type = number;
    edge (u: number, v: number): boolean {
        for (const oe of this._vertices[u]._outEdges) {
            if (v === oe.target as number) {
                return true;
            }
        }
        return false;
    }
    source (e: impl.ED): number {
        return e.source as number;
    }
    target (e: impl.ED): number {
        return e.target as number;
    }
    outEdges (v: number): impl.OutEI {
        return new impl.OutEI(this._vertices[v]._outEdges.values(), v);
    }
    outDegree (v: number): number {
        return this._vertices[v]._outEdges.length;
    }
    //-----------------------------------------------------------------
    // BidirectionalGraph
    // type in_edge_iterator = impl.InEI;
    inEdges (v: number): impl.InEI {
        return new impl.InEI(this._vertices[v]._inEdges.values(), v);
    }
    inDegree (v: number): number {
        return this._vertices[v]._inEdges.length;
    }
    degree (v: number): number {
        return this.outDegree(v) + this.inDegree(v);
    }
    //-----------------------------------------------------------------
    // AdjacencyGraph
    // type adjacency_iterator = impl.AdjI;
    adjacentVertices (v: number): impl.AdjI {
        return new impl.AdjI(this, this.outEdges(v));
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
    // MutableGraph
    addVertex (
        name: string,
        subpass: RasterSubpass,
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
            impl.reindexEdgeList(vert._outEdges, u);
            impl.reindexEdgeList(vert._inEdges, u);
        }
    }
    addEdge (u: number, v: number): impl.ED | null {
        // update in/out edge list
        this._vertices[u]._outEdges.push(new impl.OutE(v));
        this._vertices[v]._inEdges.push(new impl.OutE(u));
        return new impl.ED(u, v);
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
    removeEdge (e: impl.ED): void {
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
        case 'name':
            return new SubpassGraphNameMap(this._names);
        case 'subpass':
            return new SubpassGraphSubpassMap(this._subpasses);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends SubpassGraphComponent> (id: T, v: number): SubpassGraphComponentType[T] {
        switch (id) {
        case SubpassGraphComponent.name:
            return this._names[v] as SubpassGraphComponentType[T];
        case SubpassGraphComponent.subpass:
            return this._subpasses[v] as SubpassGraphComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends SubpassGraphComponent> (id: T): SubpassGraphComponentPropertyMap[T] {
        switch (id) {
        case SubpassGraphComponent.name:
            return new SubpassGraphNameMap(this._names) as SubpassGraphComponentPropertyMap[T];
        case SubpassGraphComponent.subpass:
            return new SubpassGraphSubpassMap(this._subpasses) as SubpassGraphComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._names[v];
    }
    getSubpass (v: number): RasterSubpass {
        return this._subpasses[v];
    }

    readonly components: string[] = ['name', 'subpass'];
    readonly _vertices: SubpassGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _subpasses: RasterSubpass[] = [];
}

export class RasterPassData {
    rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
    subpassGraph: SubpassGraph = new SubpassGraph();
}

export class ComputePassData {
    computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
}

export class CopyPair {
    constructor (
        source = '',
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        sourceMostDetailedMip = 0,
        sourceFirstSlice = 0,
        sourcePlaneSlice = 0,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ) {
        this.source = source;
        this.target = target;
        this.mipLevels = mipLevels;
        this.numSlices = numSlices;
        this.sourceMostDetailedMip = sourceMostDetailedMip;
        this.sourceFirstSlice = sourceFirstSlice;
        this.sourcePlaneSlice = sourcePlaneSlice;
        this.targetMostDetailedMip = targetMostDetailedMip;
        this.targetFirstSlice = targetFirstSlice;
        this.targetPlaneSlice = targetPlaneSlice;
    }
    source: string;
    target: string;
    mipLevels: number;
    numSlices: number;
    sourceMostDetailedMip: number;
    sourceFirstSlice: number;
    sourcePlaneSlice: number;
    targetMostDetailedMip: number;
    targetFirstSlice: number;
    targetPlaneSlice: number;
}

export class CopyPassData {
    copyPairs: CopyPair[] = [];
}

export class MovePair {
    constructor (
        source = '',
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ) {
        this.source = source;
        this.target = target;
        this.mipLevels = mipLevels;
        this.numSlices = numSlices;
        this.targetMostDetailedMip = targetMostDetailedMip;
        this.targetFirstSlice = targetFirstSlice;
        this.targetPlaneSlice = targetPlaneSlice;
    }
    source: string;
    target: string;
    mipLevels: number;
    numSlices: number;
    targetMostDetailedMip: number;
    targetFirstSlice: number;
    targetPlaneSlice: number;
}

export class MovePassData {
    movePairs: MovePair[] = [];
}

export class RaytracePassData {
    computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
}

export class RenderQueueData {
    constructor (hint: QueueHint = QueueHint.Opaque) {
        this.hint = hint;
    }
    hint: QueueHint;
}

export class SceneData {
    constructor (name = '') {
        this.name = name;
    }
    name: string;
    camera: Camera | null = null;
    scenes: string[] = [];
}

export class Dispatch {
    constructor (shader = '', threadGroupCountX = 0, threadGroupCountY = 0, threadGroupCountZ = 0) {
        this.shader = shader;
        this.threadGroupCountX = threadGroupCountX;
        this.threadGroupCountY = threadGroupCountY;
        this.threadGroupCountZ = threadGroupCountZ;
    }
    shader: string;
    threadGroupCountX: number;
    threadGroupCountY: number;
    threadGroupCountZ: number;
}

export class Blit {
    constructor (shader = '') {
        this.shader = shader;
    }
    shader: string;
}

export class PresentPassData {
    constructor (resourceName = '', syncInterval = 0, flags = 0) {
        this.resourceName = resourceName;
        this.syncInterval = syncInterval;
        this.flags = flags;
    }
    resourceName: string;
    syncInterval: number;
    flags: number;
}

export class RenderData {
    constants: Map<number, Uint8Array> = new Map<number, Uint8Array>();
    buffers: Map<number, Buffer> = new Map<number, Buffer>();
    textures: Map<number, Texture> = new Map<number, Texture>();
    samplers: Map<number, Sampler> = new Map<number, Sampler>();
}

//=================================================================
// RenderGraph
//=================================================================
// PolymorphicGraph Concept
export const enum RenderGraphValue {
    raster,
    compute,
    copy,
    move,
    present,
    raytrace,
    queue,
    scene,
    blit,
    dispatch,
}

interface RenderGraphValueType {
    [RenderGraphValue.raster]: RasterPassData
    [RenderGraphValue.compute]: ComputePassData
    [RenderGraphValue.copy]: CopyPassData
    [RenderGraphValue.move]: MovePassData
    [RenderGraphValue.present]: PresentPassData
    [RenderGraphValue.raytrace]: RaytracePassData
    [RenderGraphValue.queue]: RenderQueueData
    [RenderGraphValue.scene]: SceneData
    [RenderGraphValue.blit]: Blit
    [RenderGraphValue.dispatch]: Dispatch
}

export interface RenderGraphVisitor {
    raster(value: RasterPassData): unknown;
    compute(value: ComputePassData): unknown;
    copy(value: CopyPassData): unknown;
    move(value: MovePassData): unknown;
    present(value: PresentPassData): unknown;
    raytrace(value: RaytracePassData): unknown;
    queue(value: RenderQueueData): unknown;
    scene(value: SceneData): unknown;
    blit(value: Blit): unknown;
    dispatch(value: Dispatch): unknown;
}

type RenderGraphObject = RasterPassData
| ComputePassData
| CopyPassData
| MovePassData
| PresentPassData
| RaytracePassData
| RenderQueueData
| SceneData
| Blit
| Dispatch;

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
    readonly _outEdges: impl.OutE[] = [];
    readonly _inEdges: impl.OutE[] = [];
    readonly _children: impl.OutE[] = [];
    readonly _parents: impl.OutE[] = [];
    readonly _id: RenderGraphValue;
    readonly _object: RenderGraphObject;
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class RenderGraphNameMap implements impl.PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    readonly _names: string[];
}

export class RenderGraphLayoutMap implements impl.PropertyMap {
    constructor (readonly layoutNodes: string[]) {
        this._layoutNodes = layoutNodes;
    }
    get (v: number): string {
        return this._layoutNodes[v];
    }
    readonly _layoutNodes: string[];
}

export class RenderGraphDataMap implements impl.PropertyMap {
    constructor (readonly data: RenderData[]) {
        this._data = data;
    }
    get (v: number): RenderData {
        return this._data[v];
    }
    readonly _data: RenderData[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum RenderGraphComponent {
    name,
    layout,
    data,
}

interface RenderGraphComponentType {
    [RenderGraphComponent.name]: string;
    [RenderGraphComponent.layout]: string;
    [RenderGraphComponent.data]: RenderData;
}

interface RenderGraphComponentPropertyMap {
    [RenderGraphComponent.name]: RenderGraphNameMap;
    [RenderGraphComponent.layout]: RenderGraphLayoutMap;
    [RenderGraphComponent.data]: RenderGraphDataMap;
}

//-----------------------------------------------------------------
// RenderGraph Implementation
export class RenderGraph implements impl.BidirectionalGraph
, impl.AdjacencyGraph
, impl.VertexListGraph
, impl.MutableGraph
, impl.PropertyGraph
, impl.NamedGraph
, impl.ComponentGraph
, impl.PolymorphicGraph
, impl.ReferenceGraph
, impl.MutableReferenceGraph {
    //-----------------------------------------------------------------
    // Graph
    // type vertex_descriptor = number;
    nullVertex (): number { return 0xFFFFFFFF; }
    // type edge_descriptor = impl.ED;
    readonly directed_category: impl.directional = impl.directional.bidirectional;
    readonly edge_parallel_category: impl.parallel = impl.parallel.allow;
    readonly traversal_category: impl.traversal = impl.traversal.incidence
        | impl.traversal.bidirectional
        | impl.traversal.adjacency
        | impl.traversal.vertex_list;
    //-----------------------------------------------------------------
    // IncidenceGraph
    // type out_edge_iterator = impl.OutEI;
    // type degree_size_type = number;
    edge (u: number, v: number): boolean {
        for (const oe of this._vertices[u]._outEdges) {
            if (v === oe.target as number) {
                return true;
            }
        }
        return false;
    }
    source (e: impl.ED): number {
        return e.source as number;
    }
    target (e: impl.ED): number {
        return e.target as number;
    }
    outEdges (v: number): impl.OutEI {
        return new impl.OutEI(this._vertices[v]._outEdges.values(), v);
    }
    outDegree (v: number): number {
        return this._vertices[v]._outEdges.length;
    }
    //-----------------------------------------------------------------
    // BidirectionalGraph
    // type in_edge_iterator = impl.InEI;
    inEdges (v: number): impl.InEI {
        return new impl.InEI(this._vertices[v]._inEdges.values(), v);
    }
    inDegree (v: number): number {
        return this._vertices[v]._inEdges.length;
    }
    degree (v: number): number {
        return this.outDegree(v) + this.inDegree(v);
    }
    //-----------------------------------------------------------------
    // AdjacencyGraph
    // type adjacency_iterator = impl.AdjI;
    adjacentVertices (v: number): impl.AdjI {
        return new impl.AdjI(this, this.outEdges(v));
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
    // MutableGraph
    addVertex<T extends RenderGraphValue> (
        id: RenderGraphValue,
        object: RenderGraphValueType[T],
        name: string,
        layout: string,
        data: RenderData,
        u = 0xFFFFFFFF,
    ): number {
        const vert = new RenderGraphVertex(id, object);
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._names.push(name);
        this._layoutNodes.push(layout);
        this._data.push(data);

        // ReferenceGraph
        if (u !== 0xFFFFFFFF) {
            this._vertices[u]._children.push(new impl.OutE(v));
            vert._parents.push(new impl.OutE(u));
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

        const sz = this._vertices.length;
        if (u === sz) {
            return;
        }

        for (let v = 0; v !== sz; ++v) {
            const vert = this._vertices[v];
            impl.reindexEdgeList(vert._outEdges, u);
            impl.reindexEdgeList(vert._inEdges, u);
            // ReferenceGraph (Separated)
            impl.reindexEdgeList(vert._children, u);
            impl.reindexEdgeList(vert._parents, u);
        }
    }
    addEdge (u: number, v: number): impl.ED | null {
        // update in/out edge list
        this._vertices[u]._outEdges.push(new impl.OutE(v));
        this._vertices[v]._inEdges.push(new impl.OutE(u));
        return new impl.ED(u, v);
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
    removeEdge (e: impl.ED): void {
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
    get (tag: string): RenderGraphNameMap | RenderGraphLayoutMap | RenderGraphDataMap {
        switch (tag) {
        // Components
        case 'name':
            return new RenderGraphNameMap(this._names);
        case 'layout':
            return new RenderGraphLayoutMap(this._layoutNodes);
        case 'data':
            return new RenderGraphDataMap(this._data);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends RenderGraphComponent> (id: T, v: number): RenderGraphComponentType[T] {
        switch (id) {
        case RenderGraphComponent.name:
            return this._names[v] as RenderGraphComponentType[T];
        case RenderGraphComponent.layout:
            return this._layoutNodes[v] as RenderGraphComponentType[T];
        case RenderGraphComponent.data:
            return this._data[v] as RenderGraphComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends RenderGraphComponent> (id: T): RenderGraphComponentPropertyMap[T] {
        switch (id) {
        case RenderGraphComponent.name:
            return new RenderGraphNameMap(this._names) as RenderGraphComponentPropertyMap[T];
        case RenderGraphComponent.layout:
            return new RenderGraphLayoutMap(this._layoutNodes) as RenderGraphComponentPropertyMap[T];
        case RenderGraphComponent.data:
            return new RenderGraphDataMap(this._data) as RenderGraphComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._names[v];
    }
    getLayout (v: number): string {
        return this._layoutNodes[v];
    }
    getData (v: number): RenderData {
        return this._data[v];
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
        case RenderGraphValue.raster:
            return visitor.raster(vert._object as RasterPassData);
        case RenderGraphValue.compute:
            return visitor.compute(vert._object as ComputePassData);
        case RenderGraphValue.copy:
            return visitor.copy(vert._object as CopyPassData);
        case RenderGraphValue.move:
            return visitor.move(vert._object as MovePassData);
        case RenderGraphValue.present:
            return visitor.present(vert._object as PresentPassData);
        case RenderGraphValue.raytrace:
            return visitor.raytrace(vert._object as RaytracePassData);
        case RenderGraphValue.queue:
            return visitor.queue(vert._object as RenderQueueData);
        case RenderGraphValue.scene:
            return visitor.scene(vert._object as SceneData);
        case RenderGraphValue.blit:
            return visitor.blit(vert._object as Blit);
        case RenderGraphValue.dispatch:
            return visitor.dispatch(vert._object as Dispatch);
        default:
            throw Error('polymorphic type not found');
        }
    }
    getRaster (v: number): RasterPassData {
        if (this._vertices[v]._id === RenderGraphValue.raster) {
            return this._vertices[v]._object as RasterPassData;
        } else {
            throw Error('value id not match');
        }
    }
    getCompute (v: number): ComputePassData {
        if (this._vertices[v]._id === RenderGraphValue.compute) {
            return this._vertices[v]._object as ComputePassData;
        } else {
            throw Error('value id not match');
        }
    }
    getCopy (v: number): CopyPassData {
        if (this._vertices[v]._id === RenderGraphValue.copy) {
            return this._vertices[v]._object as CopyPassData;
        } else {
            throw Error('value id not match');
        }
    }
    getMove (v: number): MovePassData {
        if (this._vertices[v]._id === RenderGraphValue.move) {
            return this._vertices[v]._object as MovePassData;
        } else {
            throw Error('value id not match');
        }
    }
    getPresent (v: number): PresentPassData {
        if (this._vertices[v]._id === RenderGraphValue.present) {
            return this._vertices[v]._object as PresentPassData;
        } else {
            throw Error('value id not match');
        }
    }
    getRaytrace (v: number): RaytracePassData {
        if (this._vertices[v]._id === RenderGraphValue.raytrace) {
            return this._vertices[v]._object as RaytracePassData;
        } else {
            throw Error('value id not match');
        }
    }
    getQueue (v: number): RenderQueueData {
        if (this._vertices[v]._id === RenderGraphValue.queue) {
            return this._vertices[v]._object as RenderQueueData;
        } else {
            throw Error('value id not match');
        }
    }
    getScene (v: number): SceneData {
        if (this._vertices[v]._id === RenderGraphValue.scene) {
            return this._vertices[v]._object as SceneData;
        } else {
            throw Error('value id not match');
        }
    }
    getBlit (v: number): Blit {
        if (this._vertices[v]._id === RenderGraphValue.blit) {
            return this._vertices[v]._object as Blit;
        } else {
            throw Error('value id not match');
        }
    }
    getDispatch (v: number): Dispatch {
        if (this._vertices[v]._id === RenderGraphValue.dispatch) {
            return this._vertices[v]._object as Dispatch;
        } else {
            throw Error('value id not match');
        }
    }
    tryGetRaster (v: number): RasterPassData | null {
        if (this._vertices[v]._id === RenderGraphValue.raster) {
            return this._vertices[v]._object as RasterPassData;
        } else {
            return null;
        }
    }
    tryGetCompute (v: number): ComputePassData | null {
        if (this._vertices[v]._id === RenderGraphValue.compute) {
            return this._vertices[v]._object as ComputePassData;
        } else {
            return null;
        }
    }
    tryGetCopy (v: number): CopyPassData | null {
        if (this._vertices[v]._id === RenderGraphValue.copy) {
            return this._vertices[v]._object as CopyPassData;
        } else {
            return null;
        }
    }
    tryGetMove (v: number): MovePassData | null {
        if (this._vertices[v]._id === RenderGraphValue.move) {
            return this._vertices[v]._object as MovePassData;
        } else {
            return null;
        }
    }
    tryGetPresent (v: number): PresentPassData | null {
        if (this._vertices[v]._id === RenderGraphValue.present) {
            return this._vertices[v]._object as PresentPassData;
        } else {
            return null;
        }
    }
    tryGetRaytrace (v: number): RaytracePassData | null {
        if (this._vertices[v]._id === RenderGraphValue.raytrace) {
            return this._vertices[v]._object as RaytracePassData;
        } else {
            return null;
        }
    }
    tryGetQueue (v: number): RenderQueueData | null {
        if (this._vertices[v]._id === RenderGraphValue.queue) {
            return this._vertices[v]._object as RenderQueueData;
        } else {
            return null;
        }
    }
    tryGetScene (v: number): SceneData | null {
        if (this._vertices[v]._id === RenderGraphValue.scene) {
            return this._vertices[v]._object as SceneData;
        } else {
            return null;
        }
    }
    tryGetBlit (v: number): Blit | null {
        if (this._vertices[v]._id === RenderGraphValue.blit) {
            return this._vertices[v]._object as Blit;
        } else {
            return null;
        }
    }
    tryGetDispatch (v: number): Dispatch | null {
        if (this._vertices[v]._id === RenderGraphValue.dispatch) {
            return this._vertices[v]._object as Dispatch;
        } else {
            return null;
        }
    }
    //-----------------------------------------------------------------
    // ReferenceGraph
    // type reference_descriptor = impl.ED;
    // type child_iterator = impl.OutEI;
    // type parent_iterator = impl.InEI;
    reference (u: number, v: number): boolean {
        for (const oe of this._vertices[u]._children) {
            if (v === oe.target as number) {
                return true;
            }
        }
        return false;
    }
    parent (e: impl.ED): number {
        return e.source as number;
    }
    child (e: impl.ED): number {
        return e.target as number;
    }
    parents (v: number): impl.InEI {
        return new impl.InEI(this._vertices[v]._parents.values(), v);
    }
    children (v: number): impl.OutEI {
        return new impl.OutEI(this._vertices[v]._children.values(), v);
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
    addReference (u: number, v: number): impl.ED | null {
        // update in/out edge list
        this._vertices[u]._children.push(new impl.OutE(v));
        this._vertices[v]._parents.push(new impl.OutE(u));
        return new impl.ED(u, v);
    }
    removeReference (e: impl.ED): void {
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

    readonly components: string[] = ['name', 'layout', 'data'];
    readonly _vertices: RenderGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _layoutNodes: string[] = [];
    readonly _data: RenderData[] = [];
    index: Map<string, number> = new Map<string, number>();
}

export abstract class Setter {
    constructor (data: RenderData) {
        this._data = data;
    }
    setMat4 (name: string, mat: Mat4): void {

    }
    setMatrix4x4 (name: string, data: number[]): void {

    }
    setMatrix3x4 (name: string, data: number[]): void {

    }
    setFloat4 (name: string, data: number[]): void {

    }
    setFloat2 (name: string, data: number[]): void {

    }
    setFloat (name: string, data: number): void {

    }
    setInt4 (name: string, data: number[]): void {

    }
    setInt2 (name: string, data: number[]): void {

    }
    setInt (name: string, data: number): void {

    }
    setUint4 (name: string, data: number[]): void {

    }
    setUint2 (name: string, data: number[]): void {

    }
    setUint (name: string, data: number): void {

    }
    setCBuffer (name: string, buffer: Buffer): void {

    }
    setBuffer (name: string, buffer: Buffer): void {

    }
    setTexture (name: string, texture: Texture): void {

    }
    setRWBuffer (name: string, buffer: Buffer): void {

    }
    setRWTexture (name: string, texture: Texture): void {

    }
    setSampler (name: string, sampler: Sampler): void {

    }
    protected _setCameraValues (camera: Readonly<Camera>, cfg: Readonly<PipelineSceneData>, scene: Readonly<RenderScene>) {
        this.setMat4('cc_matView', camera.matView);
        this.setMat4('cc_matViewInv', camera.node.worldMatrix);
        this.setMat4('cc_matProj', camera.matProj);
        this.setMat4('cc_matProjInv', camera.matProjInv);
        this.setMat4('cc_matViewProj', camera.matViewProj);
        this.setMat4('cc_matViewProjInv', camera.matViewProjInv);
        this.setFloat4('cc_cameraPos', [camera.position.x, camera.position.y, camera.position.z, 0.0]);
        this.setFloat4('cc_screenScale', [cfg.shadingScale, cfg.shadingScale, 1.0 / cfg.shadingScale, 1.0 / cfg.shadingScale]);
        this.setFloat4('cc_exposure', [camera.exposure, 1.0 / camera.exposure, cfg.isHDR ? 1.0 : 0.0, 0.0]);

        const mainLight = scene.mainLight;
        if (mainLight) {
            this.setFloat4('cc_mainLitDir', [mainLight.direction.x, mainLight.direction.y, mainLight.direction.z, 0.0]);
            let r = mainLight.color.x;
            let g = mainLight.color.y;
            let b = mainLight.color.z;
            if (mainLight.useColorTemperature) {
                r *= mainLight.colorTemperatureRGB.x;
                g *= mainLight.colorTemperatureRGB.y;
                b *= mainLight.colorTemperatureRGB.z;
            }
            let w = mainLight.illuminance;
            if (cfg.isHDR) {
                w *= camera.exposure;
            }
            this.setFloat4('cc_mainLitColor', [r, g, b, w]);
        } else {
            this.setFloat4('cc_mainLitDir', [0, 0, 1, 0]);
            this.setFloat4('cc_mainLitColor', [0, 0, 0, 0]);
        }

        const ambient = cfg.ambient;
        const skyColor = ambient.skyColor;
        if (cfg.isHDR) {
            skyColor.w = ambient.skyIllum * camera.exposure;
        } else {
            skyColor.w = ambient.skyIllum;
        }
        this.setFloat4('cc_ambientSky', [skyColor.x, skyColor.y, skyColor.z, skyColor.w]);
        this.setFloat4('cc_ambientGround', [ambient.groundAlbedo.x, ambient.groundAlbedo.y, ambient.groundAlbedo.z, ambient.groundAlbedo.w]);

        const fog = cfg.fog;
        const colorTempRGB = fog.colorArray;
        this.setFloat4('cc_fogColor', [colorTempRGB.x, colorTempRGB.y, colorTempRGB.z, colorTempRGB.w]);
        this.setFloat4('cc_fogBase', [fog.fogStart, fog.fogEnd, fog.fogDensity, 0.0]);
        this.setFloat4('cc_fogAdd', [fog.fogTop, fog.fogRange, fog.fogAtten, 0.0]);
        this.setFloat4('cc_nearFar', [camera.nearClip, camera.farClip, 0.0, 0.0]);
        this.setFloat4('cc_viewPort', [camera.viewport.x, camera.viewport.y, camera.viewport.z, camera.viewport.w]);
    }
    private readonly _data: RenderData;
}

export class RasterQueue extends Setter {
    constructor (data: RenderData, renderGraph: RenderGraph, vertID: number, queue: RenderQueueData, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    addSceneOfCamera (camera: Camera, name = 'Camera'): RasterQueue {
        const sceneData = new SceneData(name);
        sceneData.camera = camera;
        this._renderGraph.addVertex<RenderGraphValue.scene>(
            RenderGraphValue.scene, sceneData, name, '', new RenderData(), this._vertID,
        );
        super._setCameraValues(camera, this._pipeline,
            camera.scene ? camera.scene : legacyCC.director.getScene().renderScene);
        return this;
    }
    addScene (sceneName: string): RasterQueue {
        const sceneData = new SceneData(sceneName);
        this._renderGraph.addVertex<RenderGraphValue.scene>(
            RenderGraphValue.scene, sceneData, sceneName, '', new RenderData(), this._vertID,
        );
        return this;
    }
    addFullscreenQuad (shader: string, name = 'Quad'): RasterQueue {
        this._renderGraph.addVertex<RenderGraphValue.blit>(
            RenderGraphValue.blit, new Blit(shader), name, '', new RenderData(), this._vertID,
        );
        return this;
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _queue: RenderQueueData;
    private readonly _pipeline: PipelineSceneData;
}

export class RasterPass extends Setter {
    constructor (data: RenderData, renderGraph: RenderGraph, vertID: number, pass: RasterPassData, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;
    }
    addRasterView (name: string, view: RasterView) {
        this._pass.rasterViews.set(name, view);
    }
    addComputeView (name: string, view: ComputeView) {
        if (this._pass.computeViews.has(name)) {
            this._pass.computeViews.get(name)?.push(view);
        } else {
            this._pass.computeViews.set(name, [view]);
        }
    }
    addQueue (hint: QueueHint = QueueHint.Opaque, layoutName = '', name = 'Queue') {
        if (layoutName === '') {
            switch (hint) {
            case QueueHint.Opaque:
                layoutName = 'Opaque';
                break;
            case QueueHint.Cutout:
                layoutName = 'Cutout';
                break;
            case QueueHint.Transparent:
                layoutName = 'Transparent';
                break;
            default:
                throw Error('cannot infer layoutName from QueueHint');
            }
        }
        const queue = new RenderQueueData(hint);
        const data = new RenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.queue>(
            RenderGraphValue.queue, queue, name, layoutName, data, this._vertID,
        );
        return new RasterQueue(data, this._renderGraph, queueID, queue, this._pipeline);
    }
    addFullscreenQuad (shader: string, layoutName = '', name = 'Quad') {
        this._renderGraph.addVertex<RenderGraphValue.blit>(
            RenderGraphValue.blit,
            new Blit(shader),
            name, layoutName, new RenderData(), this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: RasterPassData;
    private readonly _pipeline: PipelineSceneData;
}

export class ComputeQueue extends Setter {
    constructor (data: RenderData, renderGraph: RenderGraph, vertID: number, queue: RenderQueueData, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    addDispatch (shader: string,
        threadGroupCountX: number,
        threadGroupCountY: number,
        threadGroupCountZ: number,
        layoutName = '',
        name = 'Dispatch') {
        this._renderGraph.addVertex<RenderGraphValue.dispatch>(
            RenderGraphValue.dispatch,
            new Dispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ),
            name, layoutName, new RenderData(), this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _queue: RenderQueueData;
    private readonly _pipeline: PipelineSceneData;
}

export class ComputePass extends Setter {
    constructor (data: RenderData, renderGraph: RenderGraph, vertID: number, pass: ComputePassData, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;
    }
    addComputeView (name: string, view: ComputeView) {
        if (this._pass.computeViews.has(name)) {
            this._pass.computeViews.get(name)?.push(view);
        } else {
            this._pass.computeViews.set(name, [view]);
        }
    }
    addDispatch (shader: string,
        threadGroupCountX: number,
        threadGroupCountY: number,
        threadGroupCountZ: number,
        layoutName = '',
        name = 'Dispatch') {
        this._renderGraph.addVertex<RenderGraphValue.dispatch>(
            RenderGraphValue.dispatch,
            new Dispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ),
            name, layoutName, new RenderData(), this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: ComputePassData;
    private readonly _pipeline: PipelineSceneData;
}

export class MovePass {
    constructor (renderGraph: RenderGraph, vertID: number, pass: MovePassData) {
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
    }
    addMove (pair: MovePair) {
        this._pass.movePairs.push(pair);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: MovePassData;
}

export class CopyPass {
    constructor (renderGraph: RenderGraph, vertID: number, pass: CopyPassData) {
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
    }
    addCopy (pair: CopyPair) {
        this._pass.copyPairs.push(pair);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: CopyPassData;
}
