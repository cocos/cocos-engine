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
import { ShaderStageFlagBit, Type, Uniform } from '../../gfx/index';
import { ParameterType, UpdateFrequency } from './types';

export const enum DescriptorIndex {
    UNIFORM_BLOCK,
    SAMPLER_TEXTURE,
    SAMPLER,
    TEXTURE,
    STORAGE_BUFFER,
    STORAGE_TEXTURE,
    SUBPASS_INPUT,
}

export class UniformBlockDB {
    values: Map<string, Uniform> = new Map<string, Uniform>();
}

export class Descriptor {
    constructor (type: Type = Type.UNKNOWN, count = 1) {
        this.type = type;
        this.count = count;
    }
    type: Type;
    count: number;
}

export class DescriptorBlock {
    uniforms: Map<string, Descriptor> = new Map<string, Descriptor>();
}

export class DescriptorTable {
    descriptorBlocks: Map<DescriptorIndex, DescriptorBlock> = new Map<DescriptorIndex, DescriptorBlock>();
    uniformBlocks: Map<string, UniformBlockDB> = new Map<string, UniformBlockDB>();
}

export class DescriptorTableIndex {
    updateFrequency: UpdateFrequency = UpdateFrequency.PER_INSTANCE;
    parameterType: ParameterType = ParameterType.CONSTANTS;
    visibility: ShaderStageFlagBit = ShaderStageFlagBit.NONE;
}

export class DescriptorDB {
    tables: Map<DescriptorTableIndex, DescriptorTable> = new Map<DescriptorTableIndex, DescriptorTable>();
}

export class RenderPhase {
    shaders: Set<string> = new Set<string>();
}

//=================================================================
// LayoutGraph
//=================================================================
// PolymorphicGraph Concept
export const enum LayoutGraphValue {
    RenderStage,
    RenderPhase,
}

interface LayoutGraphValueType {
    [LayoutGraphValue.RenderStage]: number
    [LayoutGraphValue.RenderPhase]: RenderPhase
}

export interface LayoutGraphVisitor {
    renderStage(value: number): unknown;
    renderPhase(value: RenderPhase): unknown;
}

type LayoutGraphObject = number | RenderPhase;

//-----------------------------------------------------------------
// Graph Concept
export class LayoutGraphVertex {
    constructor (
        readonly id: LayoutGraphValue,
        readonly object: LayoutGraphObject,
    ) {
        this._id = id;
        this._object = object;
    }
    readonly _outEdges: impl.OutE[] = [];
    readonly _inEdges: impl.OutE[] = [];
    readonly _id: LayoutGraphValue;
    readonly _object: LayoutGraphObject;
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class LayoutGraphNameMap implements impl.PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    readonly _names: string[];
}

export class LayoutGraphDescriptorsMap implements impl.PropertyMap {
    constructor (readonly descriptors: DescriptorDB[]) {
        this._descriptors = descriptors;
    }
    get (v: number): DescriptorDB {
        return this._descriptors[v];
    }
    readonly _descriptors: DescriptorDB[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum LayoutGraphComponent {
    Name,
    Descriptors,
}

interface LayoutGraphComponentType {
    [LayoutGraphComponent.Name]: string;
    [LayoutGraphComponent.Descriptors]: DescriptorDB;
}

interface LayoutGraphComponentPropertyMap {
    [LayoutGraphComponent.Name]: LayoutGraphNameMap;
    [LayoutGraphComponent.Descriptors]: LayoutGraphDescriptorsMap;
}

//-----------------------------------------------------------------
// LayoutGraph Implementation
export class LayoutGraph implements impl.BidirectionalGraph
, impl.AdjacencyGraph
, impl.VertexListGraph
, impl.MutableGraph
, impl.PropertyGraph
, impl.NamedGraph
, impl.ComponentGraph
, impl.PolymorphicGraph
, impl.ReferenceGraph
, impl.MutableReferenceGraph
, impl.AddressableGraph {
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
    addVertex<T extends LayoutGraphValue> (
        id: LayoutGraphValue,
        object: LayoutGraphValueType[T],
        name: string,
        descriptors: DescriptorDB,
        u = 0xFFFFFFFF,
    ): number {
        const vert = new LayoutGraphVertex(id, object);
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._names.push(name);
        this._descriptors.push(descriptors);

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
        this._vertices.splice(u, 1);
        this._names.splice(u, 1);
        this._descriptors.splice(u, 1);

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
    vertexNameMap (): LayoutGraphNameMap {
        return new LayoutGraphNameMap(this._names);
    }
    //-----------------------------------------------------------------
    // PropertyGraph
    get (tag: string): LayoutGraphNameMap | LayoutGraphDescriptorsMap {
        switch (tag) {
        // Components
        case 'Name':
            return new LayoutGraphNameMap(this._names);
        case 'Descriptors':
            return new LayoutGraphDescriptorsMap(this._descriptors);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends LayoutGraphComponent> (id: T, v: number): LayoutGraphComponentType[T] {
        switch (id) {
        case LayoutGraphComponent.Name:
            return this._names[v] as LayoutGraphComponentType[T];
        case LayoutGraphComponent.Descriptors:
            return this._descriptors[v] as LayoutGraphComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends LayoutGraphComponent> (id: T): LayoutGraphComponentPropertyMap[T] {
        switch (id) {
        case LayoutGraphComponent.Name:
            return new LayoutGraphNameMap(this._names) as LayoutGraphComponentPropertyMap[T];
        case LayoutGraphComponent.Descriptors:
            return new LayoutGraphDescriptorsMap(this._descriptors) as LayoutGraphComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._names[v];
    }
    getDescriptors (v: number): DescriptorDB {
        return this._descriptors[v];
    }
    //-----------------------------------------------------------------
    // PolymorphicGraph
    holds (id: LayoutGraphValue, v: number): boolean {
        return this._vertices[v]._id === id;
    }
    id (v: number): LayoutGraphValue {
        return this._vertices[v]._id;
    }
    object (v: number): LayoutGraphObject {
        return this._vertices[v]._object;
    }
    value<T extends LayoutGraphValue> (id: T, v: number): LayoutGraphValueType[T] {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as LayoutGraphValueType[T];
        } else {
            throw Error('value id not match');
        }
    }
    tryValue<T extends LayoutGraphValue> (id: T, v: number): LayoutGraphValueType[T] | null {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as LayoutGraphValueType[T];
        } else {
            return null;
        }
    }
    visitVertex (visitor: LayoutGraphVisitor, v: number): unknown {
        const vert = this._vertices[v];
        switch (vert._id) {
        case LayoutGraphValue.RenderStage:
            return visitor.renderStage(vert._object as number);
        case LayoutGraphValue.RenderPhase:
            return visitor.renderPhase(vert._object as RenderPhase);
        default:
            throw Error('polymorphic type not found');
        }
    }
    getRenderStage (v: number): number {
        if (this._vertices[v]._id === LayoutGraphValue.RenderStage) {
            return this._vertices[v]._object as number;
        } else {
            throw Error('value id not match');
        }
    }
    getRenderPhase (v: number): RenderPhase {
        if (this._vertices[v]._id === LayoutGraphValue.RenderPhase) {
            return this._vertices[v]._object as RenderPhase;
        } else {
            throw Error('value id not match');
        }
    }
    tryGetRenderStage (v: number): number | null {
        if (this._vertices[v]._id === LayoutGraphValue.RenderStage) {
            return this._vertices[v]._object as number;
        } else {
            return null;
        }
    }
    tryGetRenderPhase (v: number): RenderPhase | null {
        if (this._vertices[v]._id === LayoutGraphValue.RenderPhase) {
            return this._vertices[v]._object as RenderPhase;
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
        for (const oe of this._vertices[u]._outEdges) {
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
        return new impl.InEI(this._vertices[v]._inEdges.values(), v);
    }
    children (v: number): impl.OutEI {
        return new impl.OutEI(this._vertices[v]._outEdges.values(), v);
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
    addReference (u: number, v: number): impl.ED | null {
        return this.addEdge(u, v);
    }
    removeReference (e: impl.ED): void {
        return this.removeEdge(e);
    }
    removeReferences (u: number, v: number): void {
        return this.removeEdges(u, v);
    }
    //-----------------------------------------------------------------
    // ParentGraph
    locateChild (u: number, name: string): number {
        if (u === 0xFFFFFFFF) {
            for (const v of this._vertices.keys()) {
                const vert = this._vertices[v];
                if (vert._inEdges.length === 0 && this._names[v] === name) {
                    return v;
                }
            }
            return 0xFFFFFFFF;
        }
        for (const oe of this._vertices[u]._outEdges) {
            const child = oe.target as number;
            if (name === this._names[child]) {
                return child;
            }
        }
        return 0xFFFFFFFF;
    }
    //-----------------------------------------------------------------
    // AddressableGraph
    contains (absPath: string): boolean {
        return impl.findRelative(this, 0xFFFFFFFF, absPath) as number !== 0xFFFFFFFF;
    }
    locate (absPath: string): number {
        return impl.findRelative(this, 0xFFFFFFFF, absPath) as number;
    }
    locateRelative (path: string, start = 0xFFFFFFFF): number {
        return impl.findRelative(this, start, path) as number;
    }
    path (v: number): string {
        return impl.getPath(this, v);
    }

    readonly components: string[] = ['Name', 'Descriptors'];
    readonly _vertices: LayoutGraphVertex[] = [];
    readonly _names: string[] = [];
    readonly _descriptors: DescriptorDB[] = [];
}

export class UniformData {
    type: Type = Type.UNKNOWN;
    valueID = 0xFFFFFFFF;
}

export class UniformBlockData {
    size = 0;
    values: UniformData[] = [];
}

export class DescriptorData {
    iD = 0xFFFFFFFF;
    type: Type = Type.UNKNOWN;
    count = 0;
}

export class DescriptorBlockData {
    type: DescriptorIndex = DescriptorIndex.UNIFORM_BLOCK;
    capacity = 0;
    descriptors: DescriptorData[] = [];
}

export class DescriptorTableData {
    slot = 0xFFFFFFFF;
    capacity = 0;
    descriptorBlocks: DescriptorBlockData[] = [];
    uniformBlocks: Map<number, UniformBlockData> = new Map<number, UniformBlockData>();
}

export class DescriptorSetData {
    tables: Map<ShaderStageFlagBit, DescriptorTableData> = new Map<ShaderStageFlagBit, DescriptorTableData>();
}

export class PipelineLayoutData {
    descriptorSets: Map<UpdateFrequency, DescriptorSetData> = new Map<UpdateFrequency, DescriptorSetData>();
}

export class ShaderProgramData {
    layout: PipelineLayoutData = new PipelineLayoutData();
}

export class RenderPhaseData {
    rootSignature = '';
    shaderPrograms: ShaderProgramData[] = [];
    shaderIndex: Map<string, number> = new Map<string, number>();
}

//=================================================================
// LayoutGraphData
//=================================================================
// PolymorphicGraph Concept
export const enum LayoutGraphDataValue {
    RenderStage,
    RenderPhase,
}

interface LayoutGraphDataValueType {
    [LayoutGraphDataValue.RenderStage]: number
    [LayoutGraphDataValue.RenderPhase]: RenderPhaseData
}

export interface LayoutGraphDataVisitor {
    renderStage(value: number): unknown;
    renderPhase(value: RenderPhaseData): unknown;
}

type LayoutGraphDataObject = number | RenderPhaseData;

//-----------------------------------------------------------------
// Graph Concept
export class LayoutGraphDataVertex {
    constructor (
        readonly id: LayoutGraphDataValue,
        readonly object: LayoutGraphDataObject,
    ) {
        this._id = id;
        this._object = object;
    }
    readonly _outEdges: impl.OutE[] = [];
    readonly _inEdges: impl.OutE[] = [];
    readonly _id: LayoutGraphDataValue;
    readonly _object: LayoutGraphDataObject;
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class LayoutGraphDataNameMap implements impl.PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    readonly _names: string[];
}

export class LayoutGraphDataUpdateMap implements impl.PropertyMap {
    constructor (readonly updateFrequencies: UpdateFrequency[]) {
        this._updateFrequencies = updateFrequencies;
    }
    get (v: number): UpdateFrequency {
        return this._updateFrequencies[v];
    }
    readonly _updateFrequencies: UpdateFrequency[];
}

export class LayoutGraphDataLayoutMap implements impl.PropertyMap {
    constructor (readonly layouts: PipelineLayoutData[]) {
        this._layouts = layouts;
    }
    get (v: number): PipelineLayoutData {
        return this._layouts[v];
    }
    readonly _layouts: PipelineLayoutData[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum LayoutGraphDataComponent {
    Name,
    Update,
    Layout,
}

interface LayoutGraphDataComponentType {
    [LayoutGraphDataComponent.Name]: string;
    [LayoutGraphDataComponent.Update]: UpdateFrequency;
    [LayoutGraphDataComponent.Layout]: PipelineLayoutData;
}

interface LayoutGraphDataComponentPropertyMap {
    [LayoutGraphDataComponent.Name]: LayoutGraphDataNameMap;
    [LayoutGraphDataComponent.Update]: LayoutGraphDataUpdateMap;
    [LayoutGraphDataComponent.Layout]: LayoutGraphDataLayoutMap;
}

//-----------------------------------------------------------------
// LayoutGraphData Implementation
export class LayoutGraphData implements impl.BidirectionalGraph
, impl.AdjacencyGraph
, impl.VertexListGraph
, impl.MutableGraph
, impl.PropertyGraph
, impl.NamedGraph
, impl.ComponentGraph
, impl.PolymorphicGraph
, impl.ReferenceGraph
, impl.MutableReferenceGraph
, impl.AddressableGraph {
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
    addVertex<T extends LayoutGraphDataValue> (
        id: LayoutGraphDataValue,
        object: LayoutGraphDataValueType[T],
        name: string,
        update: UpdateFrequency,
        layout: PipelineLayoutData,
        u = 0xFFFFFFFF,
    ): number {
        const vert = new LayoutGraphDataVertex(id, object);
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._names.push(name);
        this._updateFrequencies.push(update);
        this._layouts.push(layout);

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
        this._vertices.splice(u, 1);
        this._names.splice(u, 1);
        this._updateFrequencies.splice(u, 1);
        this._layouts.splice(u, 1);

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
    vertexNameMap (): LayoutGraphDataNameMap {
        return new LayoutGraphDataNameMap(this._names);
    }
    //-----------------------------------------------------------------
    // PropertyGraph
    get (tag: string): LayoutGraphDataNameMap | LayoutGraphDataUpdateMap | LayoutGraphDataLayoutMap {
        switch (tag) {
        // Components
        case 'Name':
            return new LayoutGraphDataNameMap(this._names);
        case 'Update':
            return new LayoutGraphDataUpdateMap(this._updateFrequencies);
        case 'Layout':
            return new LayoutGraphDataLayoutMap(this._layouts);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends LayoutGraphDataComponent> (id: T, v: number): LayoutGraphDataComponentType[T] {
        switch (id) {
        case LayoutGraphDataComponent.Name:
            return this._names[v] as LayoutGraphDataComponentType[T];
        case LayoutGraphDataComponent.Update:
            return this._updateFrequencies[v] as LayoutGraphDataComponentType[T];
        case LayoutGraphDataComponent.Layout:
            return this._layouts[v] as LayoutGraphDataComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends LayoutGraphDataComponent> (id: T): LayoutGraphDataComponentPropertyMap[T] {
        switch (id) {
        case LayoutGraphDataComponent.Name:
            return new LayoutGraphDataNameMap(this._names) as LayoutGraphDataComponentPropertyMap[T];
        case LayoutGraphDataComponent.Update:
            return new LayoutGraphDataUpdateMap(this._updateFrequencies) as LayoutGraphDataComponentPropertyMap[T];
        case LayoutGraphDataComponent.Layout:
            return new LayoutGraphDataLayoutMap(this._layouts) as LayoutGraphDataComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._names[v];
    }
    getUpdate (v: number): UpdateFrequency {
        return this._updateFrequencies[v];
    }
    getLayout (v: number): PipelineLayoutData {
        return this._layouts[v];
    }
    //-----------------------------------------------------------------
    // PolymorphicGraph
    holds (id: LayoutGraphDataValue, v: number): boolean {
        return this._vertices[v]._id === id;
    }
    id (v: number): LayoutGraphDataValue {
        return this._vertices[v]._id;
    }
    object (v: number): LayoutGraphDataObject {
        return this._vertices[v]._object;
    }
    value<T extends LayoutGraphDataValue> (id: T, v: number): LayoutGraphDataValueType[T] {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as LayoutGraphDataValueType[T];
        } else {
            throw Error('value id not match');
        }
    }
    tryValue<T extends LayoutGraphDataValue> (id: T, v: number): LayoutGraphDataValueType[T] | null {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as LayoutGraphDataValueType[T];
        } else {
            return null;
        }
    }
    visitVertex (visitor: LayoutGraphDataVisitor, v: number): unknown {
        const vert = this._vertices[v];
        switch (vert._id) {
        case LayoutGraphDataValue.RenderStage:
            return visitor.renderStage(vert._object as number);
        case LayoutGraphDataValue.RenderPhase:
            return visitor.renderPhase(vert._object as RenderPhaseData);
        default:
            throw Error('polymorphic type not found');
        }
    }
    getRenderStage (v: number): number {
        if (this._vertices[v]._id === LayoutGraphDataValue.RenderStage) {
            return this._vertices[v]._object as number;
        } else {
            throw Error('value id not match');
        }
    }
    getRenderPhase (v: number): RenderPhaseData {
        if (this._vertices[v]._id === LayoutGraphDataValue.RenderPhase) {
            return this._vertices[v]._object as RenderPhaseData;
        } else {
            throw Error('value id not match');
        }
    }
    tryGetRenderStage (v: number): number | null {
        if (this._vertices[v]._id === LayoutGraphDataValue.RenderStage) {
            return this._vertices[v]._object as number;
        } else {
            return null;
        }
    }
    tryGetRenderPhase (v: number): RenderPhaseData | null {
        if (this._vertices[v]._id === LayoutGraphDataValue.RenderPhase) {
            return this._vertices[v]._object as RenderPhaseData;
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
        for (const oe of this._vertices[u]._outEdges) {
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
        return new impl.InEI(this._vertices[v]._inEdges.values(), v);
    }
    children (v: number): impl.OutEI {
        return new impl.OutEI(this._vertices[v]._outEdges.values(), v);
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
    addReference (u: number, v: number): impl.ED | null {
        return this.addEdge(u, v);
    }
    removeReference (e: impl.ED): void {
        return this.removeEdge(e);
    }
    removeReferences (u: number, v: number): void {
        return this.removeEdges(u, v);
    }
    //-----------------------------------------------------------------
    // ParentGraph
    locateChild (u: number, name: string): number {
        if (u === 0xFFFFFFFF) {
            for (const v of this._vertices.keys()) {
                const vert = this._vertices[v];
                if (vert._inEdges.length === 0 && this._names[v] === name) {
                    return v;
                }
            }
            return 0xFFFFFFFF;
        }
        for (const oe of this._vertices[u]._outEdges) {
            const child = oe.target as number;
            if (name === this._names[child]) {
                return child;
            }
        }
        return 0xFFFFFFFF;
    }
    //-----------------------------------------------------------------
    // AddressableGraph
    contains (absPath: string): boolean {
        return impl.findRelative(this, 0xFFFFFFFF, absPath) as number !== 0xFFFFFFFF;
    }
    locate (absPath: string): number {
        return impl.findRelative(this, 0xFFFFFFFF, absPath) as number;
    }
    locateRelative (path: string, start = 0xFFFFFFFF): number {
        return impl.findRelative(this, start, path) as number;
    }
    path (v: number): string {
        return impl.getPath(this, v);
    }

    readonly components: string[] = ['Name', 'Update', 'Layout'];
    readonly _vertices: LayoutGraphDataVertex[] = [];
    readonly _names: string[] = [];
    readonly _updateFrequencies: UpdateFrequency[] = [];
    readonly _layouts: PipelineLayoutData[] = [];
}
