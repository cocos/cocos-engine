/* eslint-disable max-len */
import * as impl from './graph';
import { Camera } from '../../renderer/scene/camera';
import { Buffer, ClearFlagBit, Color, Format, LoadOp, SampleCount, Sampler, StoreOp, Texture } from '../../gfx/index';
import { QueueHint, ResourceDimension, ResourceResidency } from './types';
import { Mat4 } from '../../math';
import { legacyCC } from '../../global-exports';
import { RenderScene } from '../../renderer/scene';

export const enum ResourceFlags {
    NONE = 0,
    ALLOW_RENDER_TARGET = 0x1,
    ALLOW_DEPTH_STENCIL = 0x2,
    ALLOW_UNORDERED_ACCESS = 0x4,
    DENY_SHADER_RESOURCE = 0x8,
    ALLOW_CROSS_ADAPTER = 0x10,
    ALLOW_SIMULTANEOUS_ACCESS = 0x20,
    VIDEO_DECODE_REFERENCE_ONLY = 0x40,
}

export const enum TextureLayout {
    UNKNOWN,
    ROW_MAJOR,
    UNDEFINED_SWIZZLE,
    STANDARD_SWIZZLE,
}

export class ResourceDesc {
    dimension: ResourceDimension = ResourceDimension.BUFFER;
    alignment = 0;
    width = 0;
    height = 0;
    depthOrArraySize = 0;
    mipLevels = 0;
    format: Format = Format.UNKNOWN;
    sampleCount: SampleCount = SampleCount.ONE;
    layout: TextureLayout = TextureLayout.UNKNOWN;
    flags: ResourceFlags = ResourceFlags.NONE;
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
    Name,
    Desc,
    Traits,
}

interface ResourceGraphComponentType {
    [ResourceGraphComponent.Name]: string;
    [ResourceGraphComponent.Desc]: ResourceDesc;
    [ResourceGraphComponent.Traits]: ResourceTraits;
}

interface ResourceGraphComponentPropertyMap {
    [ResourceGraphComponent.Name]: ResourceGraphNameMap;
    [ResourceGraphComponent.Desc]: ResourceGraphDescMap;
    [ResourceGraphComponent.Traits]: ResourceGraphTraitsMap;
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
        case 'Name':
            return new ResourceGraphNameMap(this._names);
        case 'Desc':
            return new ResourceGraphDescMap(this._descs);
        case 'Traits':
            return new ResourceGraphTraitsMap(this._traits);
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

    readonly components: string[] = ['Name', 'Desc', 'Traits'];
    readonly _vertices: ResourceGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _descs: ResourceDesc[] = [];
    readonly _traits: ResourceTraits[] = [];
}

export const enum AttachmentType {
    RENDER_TARGET,
    DEPTH_STENCIL,
}

export const enum AccessType {
    READ,
    READ_WRITE,
    WRITE,
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
    FLOAT_TYPE,
    INT_TYPE,
}

export class ComputeView {
    name = '';
    accessType: AccessType = AccessType.READ;
    clearFlags: ClearFlagBit = ClearFlagBit.NONE;
    clearColor: Color = new Color();
    clearValueType: ClearValueType = ClearValueType.FLOAT_TYPE;
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
    Name,
    Subpass,
}

interface SubpassGraphComponentType {
    [SubpassGraphComponent.Name]: string;
    [SubpassGraphComponent.Subpass]: RasterSubpass;
}

interface SubpassGraphComponentPropertyMap {
    [SubpassGraphComponent.Name]: SubpassGraphNameMap;
    [SubpassGraphComponent.Subpass]: SubpassGraphSubpassMap;
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
    getSubpass (v: number): RasterSubpass {
        return this._subpasses[v];
    }

    readonly components: string[] = ['Name', 'Subpass'];
    readonly _vertices: SubpassGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _subpasses: RasterSubpass[] = [];
}

export class RasterPass {
    rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
    subpassGraph: SubpassGraph = new SubpassGraph();
}

export class ComputePass {
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

export class CopyPass {
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

export class MovePass {
    movePairs: MovePair[] = [];
}

export class RaytracePass {
    computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
}

export class RenderQueue {
    constructor (hint: QueueHint = QueueHint.RENDER_OPAQUE) {
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

export class PresentPass {
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
    Raster,
    Compute,
    Copy,
    Move,
    Present,
    Raytrace,
    Queue,
    Scene,
    Blit,
    Dispatch,
}

interface RenderGraphValueType {
    [RenderGraphValue.Raster]: RasterPass
    [RenderGraphValue.Compute]: ComputePass
    [RenderGraphValue.Copy]: CopyPass
    [RenderGraphValue.Move]: MovePass
    [RenderGraphValue.Present]: PresentPass
    [RenderGraphValue.Raytrace]: RaytracePass
    [RenderGraphValue.Queue]: RenderQueue
    [RenderGraphValue.Scene]: SceneData
    [RenderGraphValue.Blit]: Blit
    [RenderGraphValue.Dispatch]: Dispatch
}

export interface RenderGraphVisitor {
    raster(value: RasterPass): unknown;
    compute(value: ComputePass): unknown;
    copy(value: CopyPass): unknown;
    move(value: MovePass): unknown;
    present(value: PresentPass): unknown;
    raytrace(value: RaytracePass): unknown;
    queue(value: RenderQueue): unknown;
    scene(value: SceneData): unknown;
    blit(value: Blit): unknown;
    dispatch(value: Dispatch): unknown;
}

type RenderGraphObject = RasterPass
| ComputePass
| CopyPass
| MovePass
| PresentPass
| RaytracePass
| RenderQueue
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
    Name,
    Layout,
    Data,
}

interface RenderGraphComponentType {
    [RenderGraphComponent.Name]: string;
    [RenderGraphComponent.Layout]: string;
    [RenderGraphComponent.Data]: RenderData;
}

interface RenderGraphComponentPropertyMap {
    [RenderGraphComponent.Name]: RenderGraphNameMap;
    [RenderGraphComponent.Layout]: RenderGraphLayoutMap;
    [RenderGraphComponent.Data]: RenderGraphDataMap;
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
        case 'Name':
            return new RenderGraphNameMap(this._names);
        case 'Layout':
            return new RenderGraphLayoutMap(this._layoutNodes);
        case 'Data':
            return new RenderGraphDataMap(this._data);
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
        case RenderGraphValue.Raster:
            return visitor.raster(vert._object as RasterPass);
        case RenderGraphValue.Compute:
            return visitor.compute(vert._object as ComputePass);
        case RenderGraphValue.Copy:
            return visitor.copy(vert._object as CopyPass);
        case RenderGraphValue.Move:
            return visitor.move(vert._object as MovePass);
        case RenderGraphValue.Present:
            return visitor.present(vert._object as PresentPass);
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
        default:
            throw Error('polymorphic type not found');
        }
    }
    getRaster (v: number): RasterPass {
        if (this._vertices[v]._id === RenderGraphValue.Raster) {
            return this._vertices[v]._object as RasterPass;
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
    getPresent (v: number): PresentPass {
        if (this._vertices[v]._id === RenderGraphValue.Present) {
            return this._vertices[v]._object as PresentPass;
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
    tryGetRaster (v: number): RasterPass | null {
        if (this._vertices[v]._id === RenderGraphValue.Raster) {
            return this._vertices[v]._object as RasterPass;
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
    tryGetPresent (v: number): PresentPass | null {
        if (this._vertices[v]._id === RenderGraphValue.Present) {
            return this._vertices[v]._object as PresentPass;
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

    readonly components: string[] = ['Name', 'Layout', 'Data'];
    readonly _vertices: RenderGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _layoutNodes: string[] = [];
    readonly _data: RenderData[] = [];
    index: Map<string, number> = new Map<string, number>();
}
