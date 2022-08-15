/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
import * as impl from './graph';
import { Material } from '../../assets';
import { Camera } from '../../renderer/scene/camera';
import { AccessFlagBit, Buffer, ClearFlagBit, Color, Format, Framebuffer, SampleCount, Sampler, Swapchain, Texture, TextureFlagBit, Viewport } from '../../gfx';
import { ComputeView, LightInfo, QueueHint, RasterView, ResourceDimension, ResourceFlags, ResourceResidency, SceneFlags } from './types';

export class ResourceDesc {
    dimension: ResourceDimension = ResourceDimension.BUFFER;
    alignment = 0;
    width = 0;
    height = 0;
    depthOrArraySize = 0;
    mipLevels = 0;
    format: Format = Format.UNKNOWN;
    sampleCount: SampleCount = SampleCount.ONE;
    textureFlags: TextureFlagBit = TextureFlagBit.NONE;
    flags: ResourceFlags = ResourceFlags.NONE;
}

export class ResourceTraits {
    constructor (residency: ResourceResidency = ResourceResidency.MANAGED) {
        this.residency = residency;
    }
    residency: ResourceResidency;
}

export class RenderSwapchain {
    constructor (swapchain: Swapchain | null) {
        this.swapchain = swapchain;
    }
    swapchain: Swapchain | null;
    currentID = 0;
    numBackBuffers = 0;
}

export class ResourceStates {
    states: AccessFlagBit = AccessFlagBit.NONE;
}

export class ManagedResource {
    unused = 0;
}

//=================================================================
// ResourceGraph
//=================================================================
// PolymorphicGraph Concept
export const enum ResourceGraphValue {
    Managed,
    PersistentBuffer,
    PersistentTexture,
    Framebuffer,
    Swapchain,
}

export function getResourceGraphValueName (e: ResourceGraphValue): string {
    switch (e) {
    case ResourceGraphValue.Managed: return 'Managed';
    case ResourceGraphValue.PersistentBuffer: return 'PersistentBuffer';
    case ResourceGraphValue.PersistentTexture: return 'PersistentTexture';
    case ResourceGraphValue.Framebuffer: return 'Framebuffer';
    case ResourceGraphValue.Swapchain: return 'Swapchain';
    default: return '';
    }
}

interface ResourceGraphValueType {
    [ResourceGraphValue.Managed]: ManagedResource
    [ResourceGraphValue.PersistentBuffer]: Buffer
    [ResourceGraphValue.PersistentTexture]: Texture
    [ResourceGraphValue.Framebuffer]: Framebuffer
    [ResourceGraphValue.Swapchain]: RenderSwapchain
}

export interface ResourceGraphVisitor {
    managed(value: ManagedResource): unknown;
    persistentBuffer(value: Buffer): unknown;
    persistentTexture(value: Texture): unknown;
    framebuffer(value: Framebuffer): unknown;
    swapchain(value: RenderSwapchain): unknown;
}

type ResourceGraphObject = ManagedResource
| Buffer
| Texture
| Framebuffer
| RenderSwapchain;

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
    readonly _outEdges: impl.OutE[] = [];
    readonly _inEdges: impl.OutE[] = [];
    readonly _id: ResourceGraphValue;
    readonly _object: ResourceGraphObject;
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

export class ResourceGraphStatesMap implements impl.PropertyMap {
    constructor (readonly states: ResourceStates[]) {
        this._states = states;
    }
    get (v: number): ResourceStates {
        return this._states[v];
    }
    readonly _states: ResourceStates[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum ResourceGraphComponent {
    Name,
    Desc,
    Traits,
    States,
}

interface ResourceGraphComponentType {
    [ResourceGraphComponent.Name]: string;
    [ResourceGraphComponent.Desc]: ResourceDesc;
    [ResourceGraphComponent.Traits]: ResourceTraits;
    [ResourceGraphComponent.States]: ResourceStates;
}

interface ResourceGraphComponentPropertyMap {
    [ResourceGraphComponent.Name]: ResourceGraphNameMap;
    [ResourceGraphComponent.Desc]: ResourceGraphDescMap;
    [ResourceGraphComponent.Traits]: ResourceGraphTraitsMap;
    [ResourceGraphComponent.States]: ResourceGraphStatesMap;
}

//-----------------------------------------------------------------
// ResourceGraph Implementation
export class ResourceGraph implements impl.BidirectionalGraph
, impl.AdjacencyGraph
, impl.VertexListGraph
, impl.MutableGraph
, impl.PropertyGraph
, impl.NamedGraph
, impl.ComponentGraph
, impl.PolymorphicGraph
, impl.UuidGraph<string> {
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
    clear (): void {
        // UuidGraph
        this._valueIndex.clear();
        // ComponentGraph
        this._names.length = 0;
        this._descs.length = 0;
        this._traits.length = 0;
        this._states.length = 0;
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
    ): number {
        const vert = new ResourceGraphVertex(id, object);
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._names.push(name);
        this._descs.push(desc);
        this._traits.push(traits);
        this._states.push(states);
        // UuidGraph
        this._valueIndex.set(name, v);
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
        { // UuidGraph
            const key = this._names[u];
            this._valueIndex.delete(key);
            this._valueIndex.forEach((v) => {
                if (v > u) { --v; }
            });
        }
        this._vertices.splice(u, 1);
        this._names.splice(u, 1);
        this._descs.splice(u, 1);
        this._traits.splice(u, 1);
        this._states.splice(u, 1);

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
    get (tag: string): ResourceGraphNameMap | ResourceGraphDescMap | ResourceGraphTraitsMap | ResourceGraphStatesMap {
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
    getStates (v: number): ResourceStates {
        return this._states[v];
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
        case ResourceGraphValue.PersistentBuffer:
            return visitor.persistentBuffer(vert._object as Buffer);
        case ResourceGraphValue.PersistentTexture:
            return visitor.persistentTexture(vert._object as Texture);
        case ResourceGraphValue.Framebuffer:
            return visitor.framebuffer(vert._object as Framebuffer);
        case ResourceGraphValue.Swapchain:
            return visitor.swapchain(vert._object as RenderSwapchain);
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
    getPersistentBuffer (v: number): Buffer {
        if (this._vertices[v]._id === ResourceGraphValue.PersistentBuffer) {
            return this._vertices[v]._object as Buffer;
        } else {
            throw Error('value id not match');
        }
    }
    getPersistentTexture (v: number): Texture {
        if (this._vertices[v]._id === ResourceGraphValue.PersistentTexture) {
            return this._vertices[v]._object as Texture;
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
    tryGetManaged (v: number): ManagedResource | null {
        if (this._vertices[v]._id === ResourceGraphValue.Managed) {
            return this._vertices[v]._object as ManagedResource;
        } else {
            return null;
        }
    }
    tryGetPersistentBuffer (v: number): Buffer | null {
        if (this._vertices[v]._id === ResourceGraphValue.PersistentBuffer) {
            return this._vertices[v]._object as Buffer;
        } else {
            return null;
        }
    }
    tryGetPersistentTexture (v: number): Texture | null {
        if (this._vertices[v]._id === ResourceGraphValue.PersistentTexture) {
            return this._vertices[v]._object as Texture;
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

    readonly components: string[] = ['Name', 'Desc', 'Traits', 'States'];
    readonly _vertices: ResourceGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _descs: ResourceDesc[] = [];
    readonly _traits: ResourceTraits[] = [];
    readonly _states: ResourceStates[] = [];
    readonly _valueIndex: Map<string, number> = new Map<string, number>();
}

export class RasterSubpass {
    readonly rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
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
    clear (): void {
        // ComponentGraph
        this._names.length = 0;
        this._subpasses.length = 0;
        // Graph Vertices
        this._vertices.length = 0;
    }
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
    isValid = false;
    readonly rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
    readonly subpassGraph: SubpassGraph = new SubpassGraph();
    width = 0;
    height = 0;
    readonly viewport: Viewport = new Viewport();
}

export class ComputePass {
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
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
    readonly copyPairs: CopyPair[] = [];
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
    readonly movePairs: MovePair[] = [];
}

export class RaytracePass {
    readonly computeViews: Map<string, ComputeView[]> = new Map<string, ComputeView[]>();
}

export class ClearView {
    constructor (slotName = '', clearFlags: ClearFlagBit = gfx.ClearFlagBit.ALL, clearColor: Color = new Color()) {
        this.slotName = slotName;
        this.clearFlags = clearFlags;
        this.clearColor = clearColor;
    }
    slotName: string;
    clearFlags: ClearFlagBit;
    readonly clearColor: Color;
}

export class RenderQueue {
    constructor (hint: QueueHint = QueueHint.RENDER_OPAQUE) {
        this.hint = hint;
    }
    hint: QueueHint;
}

export class SceneData {
    constructor (name = '', flags: SceneFlags = SceneFlags.NONE, light: LightInfo = new LightInfo()) {
        this.name = name;
        this.light = light;
        this.flags = flags;
    }
    name: string;
    camera: Camera | null = null;
    readonly light: LightInfo;
    flags: SceneFlags;
    readonly scenes: string[] = [];
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
    constructor (material: Material | null, sceneFlags: SceneFlags, camera: Camera | null) {
        this.material = material;
        this.sceneFlags = sceneFlags;
        this.camera = camera;
    }
    /*object*/ material: Material | null;
    sceneFlags: SceneFlags;
    camera: Camera | null;
}

export class Present {
    constructor (syncInterval = 0, flags = 0) {
        this.syncInterval = syncInterval;
        this.flags = flags;
    }
    syncInterval: number;
    flags: number;
}

export class PresentPass {
    readonly presents: Map<string, Present> = new Map<string, Present>();
}

export class RenderData {
    readonly constants: Map<number, number[]> = new Map<number, number[]>();
    readonly buffers: Map<number, Buffer> = new Map<number, Buffer>();
    readonly textures: Map<number, Texture> = new Map<number, Texture>();
    readonly samplers: Map<number, Sampler | null> = new Map<number, Sampler | null>();
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
    Clear,
    Viewport,
}

export function getRenderGraphValueName (e: RenderGraphValue): string {
    switch (e) {
    case RenderGraphValue.Raster: return 'Raster';
    case RenderGraphValue.Compute: return 'Compute';
    case RenderGraphValue.Copy: return 'Copy';
    case RenderGraphValue.Move: return 'Move';
    case RenderGraphValue.Present: return 'Present';
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
    [RenderGraphValue.Clear]: ClearView[]
    [RenderGraphValue.Viewport]: Viewport
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
    clear(value: ClearView[]): unknown;
    viewport(value: Viewport): unknown;
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

export class RenderGraphValidMap implements impl.PropertyMap {
    constructor (readonly valid: boolean[]) {
        this._valid = valid;
    }
    get (v: number): boolean {
        return this._valid[v];
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

interface RenderGraphComponentType {
    [RenderGraphComponent.Name]: string;
    [RenderGraphComponent.Layout]: string;
    [RenderGraphComponent.Data]: RenderData;
    [RenderGraphComponent.Valid]: boolean;
}

interface RenderGraphComponentPropertyMap {
    [RenderGraphComponent.Name]: RenderGraphNameMap;
    [RenderGraphComponent.Layout]: RenderGraphLayoutMap;
    [RenderGraphComponent.Data]: RenderGraphDataMap;
    [RenderGraphComponent.Valid]: RenderGraphValidMap;
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
    clear (): void {
        // Members
        this.index.clear();
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
        this._valid.splice(u, 1);

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
    getLayout (v: number): string {
        return this._layoutNodes[v];
    }
    setLayout (v: number, value: string) {
        this._layoutNodes[v] = value;
    }
    getData (v: number): RenderData {
        return this._data[v];
    }
    getValid (v: number): boolean {
        return this._valid[v];
    }
    setValid (v: number, value: boolean) {
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
        case RenderGraphValue.Clear:
            return visitor.clear(vert._object as ClearView[]);
        case RenderGraphValue.Viewport:
            return visitor.viewport(vert._object as Viewport);
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

    readonly components: string[] = ['Name', 'Layout', 'Data', 'Valid'];
    readonly _vertices: RenderGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _layoutNodes: string[] = [];
    readonly _data: RenderData[] = [];
    readonly _valid: boolean[] = [];
    readonly index: Map<string, number> = new Map<string, number>();
}
