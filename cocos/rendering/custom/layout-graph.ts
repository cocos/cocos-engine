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
import { DescriptorSet, DescriptorSetLayout, DescriptorSetLayoutInfo, ShaderStageFlagBit, Type, UniformBlock } from '../../gfx';
import { DescriptorBlock, saveDescriptorBlock, loadDescriptorBlock, DescriptorBlockIndex, saveDescriptorBlockIndex, loadDescriptorBlockIndex, DescriptorTypeOrder, UpdateFrequency } from './types';
import { ccclass } from '../../core/data/decorators';
import { OutputArchive, InputArchive } from './archive';
import { saveUniformBlock, loadUniformBlock, saveDescriptorSetLayoutInfo, loadDescriptorSetLayoutInfo } from './serialization';

export class DescriptorDB {
    readonly blocks: Map<string, DescriptorBlock> = new Map<string, DescriptorBlock>();
}

export class RenderPhase {
    readonly shaders: Set<string> = new Set<string>();
}

//=================================================================
// LayoutGraph
//=================================================================
// PolymorphicGraph Concept
export const enum LayoutGraphValue {
    RenderStage,
    RenderPhase,
}

export function getLayoutGraphValueName (e: LayoutGraphValue): string {
    switch (e) {
    case LayoutGraphValue.RenderStage: return 'RenderStage';
    case LayoutGraphValue.RenderPhase: return 'RenderPhase';
    default: return '';
    }
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
    clear (): void {
        // ComponentGraph
        this._names.length = 0;
        this._descriptors.length = 0;
        // Graph Vertices
        this._vertices.length = 0;
    }
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
    addressable (absPath: string): boolean {
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
    constructor (uniformID = 0xFFFFFFFF, uniformType: Type = Type.UNKNOWN, offset = 0) {
        this.uniformID = uniformID;
        this.uniformType = uniformType;
        this.offset = offset;
    }
    uniformID: number;
    uniformType: Type;
    offset: number;
    size = 0;
}

export class UniformBlockData {
    bufferSize = 0;
    readonly uniforms: UniformData[] = [];
}

export class DescriptorData {
    constructor (descriptorID = 0) {
        this.descriptorID = descriptorID;
    }
    descriptorID: number;
    count = 1;
}

export class DescriptorBlockData {
    constructor (type: DescriptorTypeOrder = DescriptorTypeOrder.UNIFORM_BUFFER, visibility: ShaderStageFlagBit = ShaderStageFlagBit.NONE, capacity = 0) {
        this.type = type;
        this.visibility = visibility;
        this.capacity = capacity;
    }
    type: DescriptorTypeOrder;
    visibility: ShaderStageFlagBit;
    offset = 0;
    capacity: number;
    readonly descriptors: DescriptorData[] = [];
}

export class DescriptorSetLayoutData {
    constructor (slot = 0xFFFFFFFF, capacity = 0) {
        this.slot = slot;
        this.capacity = capacity;
    }
    slot: number;
    capacity: number;
    readonly descriptorBlocks: DescriptorBlockData[] = [];
    readonly uniformBlocks: Map<number, UniformBlock> = new Map<number, UniformBlock>();
}

export class DescriptorSetData {
    constructor (descriptorSetLayoutData: DescriptorSetLayoutData = new DescriptorSetLayoutData(), descriptorSetLayout: DescriptorSetLayout | null = null, descriptorSet: DescriptorSet | null = null) {
        this.descriptorSetLayoutData = descriptorSetLayoutData;
        this.descriptorSetLayout = descriptorSetLayout;
        this.descriptorSet = descriptorSet;
    }
    readonly descriptorSetLayoutData: DescriptorSetLayoutData;
    readonly descriptorSetLayoutInfo: DescriptorSetLayoutInfo = new DescriptorSetLayoutInfo();
    /*refcount*/ descriptorSetLayout: DescriptorSetLayout | null;
    /*refcount*/ descriptorSet: DescriptorSet | null;
}

export class PipelineLayoutData {
    readonly descriptorSets: Map<UpdateFrequency, DescriptorSetData> = new Map<UpdateFrequency, DescriptorSetData>();
}

export class ShaderBindingData {
    readonly descriptorBindings: Map<number, number> = new Map<number, number>();
}

export class ShaderLayoutData {
    readonly layoutData: Map<UpdateFrequency, DescriptorSetLayoutData> = new Map<UpdateFrequency, DescriptorSetLayoutData>();
    readonly bindingData: Map<UpdateFrequency, ShaderBindingData> = new Map<UpdateFrequency, ShaderBindingData>();
}

export class TechniqueData {
    readonly passes: ShaderLayoutData[] = [];
}

export class EffectData {
    readonly techniques: Map<string, TechniqueData> = new Map<string, TechniqueData>();
}

export class ShaderProgramData {
    readonly layout: PipelineLayoutData = new PipelineLayoutData();
}

export class RenderStageData {
    readonly descriptorVisibility: Map<number, ShaderStageFlagBit> = new Map<number, ShaderStageFlagBit>();
}

export class RenderPhaseData {
    rootSignature = '';
    readonly shaderPrograms: ShaderProgramData[] = [];
    readonly shaderIndex: Map<string, number> = new Map<string, number>();
}

//=================================================================
// LayoutGraphData
//=================================================================
// PolymorphicGraph Concept
export const enum LayoutGraphDataValue {
    RenderStage,
    RenderPhase,
}

export function getLayoutGraphDataValueName (e: LayoutGraphDataValue): string {
    switch (e) {
    case LayoutGraphDataValue.RenderStage: return 'RenderStage';
    case LayoutGraphDataValue.RenderPhase: return 'RenderPhase';
    default: return '';
    }
}

interface LayoutGraphDataValueType {
    [LayoutGraphDataValue.RenderStage]: RenderStageData
    [LayoutGraphDataValue.RenderPhase]: RenderPhaseData
}

export interface LayoutGraphDataVisitor {
    renderStage(value: RenderStageData): unknown;
    renderPhase(value: RenderPhaseData): unknown;
}

type LayoutGraphDataObject = RenderStageData | RenderPhaseData;

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
@ccclass('cc.LayoutGraphData')
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
    clear (): void {
        // Members
        this.valueNames.length = 0;
        this.attributeIndex.clear();
        this.constantIndex.clear();
        this.shaderLayoutIndex.clear();
        this.effects.clear();
        // ComponentGraph
        this._names.length = 0;
        this._updateFrequencies.length = 0;
        this._layouts.length = 0;
        // Graph Vertices
        this._vertices.length = 0;
    }
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
    setUpdate (v: number, value: UpdateFrequency) {
        this._updateFrequencies[v] = value;
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
            return visitor.renderStage(vert._object as RenderStageData);
        case LayoutGraphDataValue.RenderPhase:
            return visitor.renderPhase(vert._object as RenderPhaseData);
        default:
            throw Error('polymorphic type not found');
        }
    }
    getRenderStage (v: number): RenderStageData {
        if (this._vertices[v]._id === LayoutGraphDataValue.RenderStage) {
            return this._vertices[v]._object as RenderStageData;
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
    tryGetRenderStage (v: number): RenderStageData | null {
        if (this._vertices[v]._id === LayoutGraphDataValue.RenderStage) {
            return this._vertices[v]._object as RenderStageData;
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
    addressable (absPath: string): boolean {
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
    readonly valueNames: string[] = [];
    readonly attributeIndex: Map<string, number> = new Map<string, number>();
    readonly constantIndex: Map<string, number> = new Map<string, number>();
    readonly shaderLayoutIndex: Map<string, number> = new Map<string, number>();
    readonly effects: Map<string, EffectData> = new Map<string, EffectData>();
}

export function saveDescriptorDB (ar: OutputArchive, v: DescriptorDB) {
    ar.writeNumber(v.blocks.size); // Map<string, DescriptorBlock>
    for (const [k1, v1] of v.blocks) {
        saveDescriptorBlockIndex(ar, JSON.parse(k1));
        saveDescriptorBlock(ar, v1);
    }
}

export function loadDescriptorDB (ar: InputArchive, v: DescriptorDB) {
    let sz = 0;
    sz = ar.readNumber(); // Map<string, DescriptorBlock>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = new DescriptorBlockIndex();
        loadDescriptorBlockIndex(ar, k1);
        const v1 = new DescriptorBlock();
        loadDescriptorBlock(ar, v1);
        v.blocks.set(JSON.stringify(k1), v1);
    }
}

export function saveRenderPhase (ar: OutputArchive, v: RenderPhase) {
    ar.writeNumber(v.shaders.size); // Set<string>
    for (const v1 of v.shaders) {
        ar.writeString(v1);
    }
}

export function loadRenderPhase (ar: InputArchive, v: RenderPhase) {
    let sz = 0;
    sz = ar.readNumber(); // Set<string>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = ar.readString();
        v.shaders.add(v1);
    }
}

export function saveUniformData (ar: OutputArchive, v: UniformData) {
    ar.writeNumber(v.uniformID);
    ar.writeNumber(v.uniformType);
    ar.writeNumber(v.offset);
    ar.writeNumber(v.size);
}

export function loadUniformData (ar: InputArchive, v: UniformData) {
    v.uniformID = ar.readNumber();
    v.uniformType = ar.readNumber();
    v.offset = ar.readNumber();
    v.size = ar.readNumber();
}

export function saveUniformBlockData (ar: OutputArchive, v: UniformBlockData) {
    ar.writeNumber(v.bufferSize);
    ar.writeNumber(v.uniforms.length); // UniformData[]
    for (const v1 of v.uniforms) {
        saveUniformData(ar, v1);
    }
}

export function loadUniformBlockData (ar: InputArchive, v: UniformBlockData) {
    v.bufferSize = ar.readNumber();
    let sz = 0;
    sz = ar.readNumber(); // UniformData[]
    v.uniforms.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = new UniformData();
        loadUniformData(ar, v1);
        v.uniforms[i1] = v1;
    }
}

export function saveDescriptorData (ar: OutputArchive, v: DescriptorData) {
    ar.writeNumber(v.descriptorID);
    ar.writeNumber(v.count);
}

export function loadDescriptorData (ar: InputArchive, v: DescriptorData) {
    v.descriptorID = ar.readNumber();
    v.count = ar.readNumber();
}

export function saveDescriptorBlockData (ar: OutputArchive, v: DescriptorBlockData) {
    ar.writeNumber(v.type);
    ar.writeNumber(v.visibility);
    ar.writeNumber(v.offset);
    ar.writeNumber(v.capacity);
    ar.writeNumber(v.descriptors.length); // DescriptorData[]
    for (const v1 of v.descriptors) {
        saveDescriptorData(ar, v1);
    }
}

export function loadDescriptorBlockData (ar: InputArchive, v: DescriptorBlockData) {
    v.type = ar.readNumber();
    v.visibility = ar.readNumber();
    v.offset = ar.readNumber();
    v.capacity = ar.readNumber();
    let sz = 0;
    sz = ar.readNumber(); // DescriptorData[]
    v.descriptors.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = new DescriptorData();
        loadDescriptorData(ar, v1);
        v.descriptors[i1] = v1;
    }
}

export function saveDescriptorSetLayoutData (ar: OutputArchive, v: DescriptorSetLayoutData) {
    ar.writeNumber(v.slot);
    ar.writeNumber(v.capacity);
    ar.writeNumber(v.descriptorBlocks.length); // DescriptorBlockData[]
    for (const v1 of v.descriptorBlocks) {
        saveDescriptorBlockData(ar, v1);
    }
    ar.writeNumber(v.uniformBlocks.size); // Map<number, UniformBlock>
    for (const [k1, v1] of v.uniformBlocks) {
        ar.writeNumber(k1);
        saveUniformBlock(ar, v1);
    }
}

export function loadDescriptorSetLayoutData (ar: InputArchive, v: DescriptorSetLayoutData) {
    v.slot = ar.readNumber();
    v.capacity = ar.readNumber();
    let sz = 0;
    sz = ar.readNumber(); // DescriptorBlockData[]
    v.descriptorBlocks.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = new DescriptorBlockData();
        loadDescriptorBlockData(ar, v1);
        v.descriptorBlocks[i1] = v1;
    }
    sz = ar.readNumber(); // Map<number, UniformBlock>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = new UniformBlock();
        loadUniformBlock(ar, v1);
        v.uniformBlocks.set(k1, v1);
    }
}

export function saveDescriptorSetData (ar: OutputArchive, v: DescriptorSetData) {
    saveDescriptorSetLayoutData(ar, v.descriptorSetLayoutData);
    saveDescriptorSetLayoutInfo(ar, v.descriptorSetLayoutInfo);
    // skip, v.descriptorSetLayout: DescriptorSetLayout
    // skip, v.descriptorSet: DescriptorSet
}

export function loadDescriptorSetData (ar: InputArchive, v: DescriptorSetData) {
    loadDescriptorSetLayoutData(ar, v.descriptorSetLayoutData);
    loadDescriptorSetLayoutInfo(ar, v.descriptorSetLayoutInfo);
    // skip, v.descriptorSetLayout: DescriptorSetLayout
    // skip, v.descriptorSet: DescriptorSet
}

export function savePipelineLayoutData (ar: OutputArchive, v: PipelineLayoutData) {
    ar.writeNumber(v.descriptorSets.size); // Map<UpdateFrequency, DescriptorSetData>
    for (const [k1, v1] of v.descriptorSets) {
        ar.writeNumber(k1);
        saveDescriptorSetData(ar, v1);
    }
}

export function loadPipelineLayoutData (ar: InputArchive, v: PipelineLayoutData) {
    let sz = 0;
    sz = ar.readNumber(); // Map<UpdateFrequency, DescriptorSetData>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = new DescriptorSetData();
        loadDescriptorSetData(ar, v1);
        v.descriptorSets.set(k1, v1);
    }
}

export function saveShaderBindingData (ar: OutputArchive, v: ShaderBindingData) {
    ar.writeNumber(v.descriptorBindings.size); // Map<number, number>
    for (const [k1, v1] of v.descriptorBindings) {
        ar.writeNumber(k1);
        ar.writeNumber(v1);
    }
}

export function loadShaderBindingData (ar: InputArchive, v: ShaderBindingData) {
    let sz = 0;
    sz = ar.readNumber(); // Map<number, number>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = ar.readNumber();
        v.descriptorBindings.set(k1, v1);
    }
}

export function saveShaderLayoutData (ar: OutputArchive, v: ShaderLayoutData) {
    ar.writeNumber(v.layoutData.size); // Map<UpdateFrequency, DescriptorSetLayoutData>
    for (const [k1, v1] of v.layoutData) {
        ar.writeNumber(k1);
        saveDescriptorSetLayoutData(ar, v1);
    }
    ar.writeNumber(v.bindingData.size); // Map<UpdateFrequency, ShaderBindingData>
    for (const [k1, v1] of v.bindingData) {
        ar.writeNumber(k1);
        saveShaderBindingData(ar, v1);
    }
}

export function loadShaderLayoutData (ar: InputArchive, v: ShaderLayoutData) {
    let sz = 0;
    sz = ar.readNumber(); // Map<UpdateFrequency, DescriptorSetLayoutData>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = new DescriptorSetLayoutData();
        loadDescriptorSetLayoutData(ar, v1);
        v.layoutData.set(k1, v1);
    }
    sz = ar.readNumber(); // Map<UpdateFrequency, ShaderBindingData>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = new ShaderBindingData();
        loadShaderBindingData(ar, v1);
        v.bindingData.set(k1, v1);
    }
}

export function saveTechniqueData (ar: OutputArchive, v: TechniqueData) {
    ar.writeNumber(v.passes.length); // ShaderLayoutData[]
    for (const v1 of v.passes) {
        saveShaderLayoutData(ar, v1);
    }
}

export function loadTechniqueData (ar: InputArchive, v: TechniqueData) {
    let sz = 0;
    sz = ar.readNumber(); // ShaderLayoutData[]
    v.passes.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = new ShaderLayoutData();
        loadShaderLayoutData(ar, v1);
        v.passes[i1] = v1;
    }
}

export function saveEffectData (ar: OutputArchive, v: EffectData) {
    ar.writeNumber(v.techniques.size); // Map<string, TechniqueData>
    for (const [k1, v1] of v.techniques) {
        ar.writeString(k1);
        saveTechniqueData(ar, v1);
    }
}

export function loadEffectData (ar: InputArchive, v: EffectData) {
    let sz = 0;
    sz = ar.readNumber(); // Map<string, TechniqueData>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readString();
        const v1 = new TechniqueData();
        loadTechniqueData(ar, v1);
        v.techniques.set(k1, v1);
    }
}

export function saveShaderProgramData (ar: OutputArchive, v: ShaderProgramData) {
    savePipelineLayoutData(ar, v.layout);
}

export function loadShaderProgramData (ar: InputArchive, v: ShaderProgramData) {
    loadPipelineLayoutData(ar, v.layout);
}

export function saveRenderStageData (ar: OutputArchive, v: RenderStageData) {
    ar.writeNumber(v.descriptorVisibility.size); // Map<number, ShaderStageFlagBit>
    for (const [k1, v1] of v.descriptorVisibility) {
        ar.writeNumber(k1);
        ar.writeNumber(v1);
    }
}

export function loadRenderStageData (ar: InputArchive, v: RenderStageData) {
    let sz = 0;
    sz = ar.readNumber(); // Map<number, ShaderStageFlagBit>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = ar.readNumber();
        v.descriptorVisibility.set(k1, v1);
    }
}

export function saveRenderPhaseData (ar: OutputArchive, v: RenderPhaseData) {
    ar.writeString(v.rootSignature);
    ar.writeNumber(v.shaderPrograms.length); // ShaderProgramData[]
    for (const v1 of v.shaderPrograms) {
        saveShaderProgramData(ar, v1);
    }
    ar.writeNumber(v.shaderIndex.size); // Map<string, number>
    for (const [k1, v1] of v.shaderIndex) {
        ar.writeString(k1);
        ar.writeNumber(v1);
    }
}

export function loadRenderPhaseData (ar: InputArchive, v: RenderPhaseData) {
    v.rootSignature = ar.readString();
    let sz = 0;
    sz = ar.readNumber(); // ShaderProgramData[]
    v.shaderPrograms.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = new ShaderProgramData();
        loadShaderProgramData(ar, v1);
        v.shaderPrograms[i1] = v1;
    }
    sz = ar.readNumber(); // Map<string, number>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readString();
        const v1 = ar.readNumber();
        v.shaderIndex.set(k1, v1);
    }
}
