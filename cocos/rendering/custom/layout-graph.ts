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
import { AddressableGraph, AdjI, AdjacencyGraph, BidirectionalGraph, ComponentGraph, ED, InEI, MutableGraph, MutableReferenceGraph, NamedGraph, OutE, OutEI, PolymorphicGraph, PropertyGraph, PropertyMap, ReferenceGraph, VertexListGraph, directional, findRelative, getPath, parallel, reindexEdgeList, traversal } from './graph';
import { DescriptorSet, DescriptorSetLayout, DescriptorSetLayoutInfo, PipelineLayout, ShaderStageFlagBit, Type, UniformBlock } from '../../gfx';
import { DescriptorBlock, saveDescriptorBlock, loadDescriptorBlock, DescriptorBlockIndex, saveDescriptorBlockIndex, loadDescriptorBlockIndex, DescriptorTypeOrder, UpdateFrequency, RenderCommonObjectPool } from './types';
import { OutputArchive, InputArchive } from './archive';
import { saveUniformBlock, loadUniformBlock, saveDescriptorSetLayoutInfo, loadDescriptorSetLayoutInfo } from './serialization';
import { RecyclePool } from '../../core/memop';

export class DescriptorDB {
    reset (): void {
        this.blocks.clear();
    }
    readonly blocks: Map<string, DescriptorBlock> = new Map<string, DescriptorBlock>();
}

export class RenderPhase {
    reset (): void {
        this.shaders.clear();
    }
    readonly shaders: Set<string> = new Set<string>();
}

export enum RenderPassType {
    SINGLE_RENDER_PASS,
    RENDER_PASS,
    RENDER_SUBPASS,
}

export function getRenderPassTypeName (e: RenderPassType): string {
    switch (e) {
    case RenderPassType.SINGLE_RENDER_PASS:
        return 'SINGLE_RENDER_PASS';
    case RenderPassType.RENDER_PASS:
        return 'RENDER_PASS';
    case RenderPassType.RENDER_SUBPASS:
        return 'RENDER_SUBPASS';
    default:
        return '';
    }
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

export interface LayoutGraphValueType {
    [LayoutGraphValue.RenderStage]: RenderPassType
    [LayoutGraphValue.RenderPhase]: RenderPhase
}

export interface LayoutGraphVisitor {
    renderStage(value: RenderPassType): unknown;
    renderPhase(value: RenderPhase): unknown;
}

export type LayoutGraphObject = RenderPassType | RenderPhase;

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
    readonly _outEdges: OutE[] = [];
    readonly _inEdges: OutE[] = [];
    readonly _id: LayoutGraphValue;
    _object: LayoutGraphObject;
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class LayoutGraphNameMap implements PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    // skip set, name is constant in AddressableGraph
    readonly _names: string[];
}

export class LayoutGraphDescriptorsMap implements PropertyMap {
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

export interface LayoutGraphComponentType {
    [LayoutGraphComponent.Name]: string;
    [LayoutGraphComponent.Descriptors]: DescriptorDB;
}

export interface LayoutGraphComponentPropertyMap {
    [LayoutGraphComponent.Name]: LayoutGraphNameMap;
    [LayoutGraphComponent.Descriptors]: LayoutGraphDescriptorsMap;
}

//-----------------------------------------------------------------
// LayoutGraph Implementation
export class LayoutGraph implements BidirectionalGraph
, AdjacencyGraph
, VertexListGraph
, MutableGraph
, PropertyGraph
, NamedGraph
, ComponentGraph
, PolymorphicGraph
, ReferenceGraph
, MutableReferenceGraph
, AddressableGraph {
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
    // skip setName, Name is constant in AddressableGraph
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
            return visitor.renderStage(vert._object as RenderPassType);
        case LayoutGraphValue.RenderPhase:
            return visitor.renderPhase(vert._object as RenderPhase);
        default:
            throw Error('polymorphic type not found');
        }
    }
    getRenderStage (v: number): RenderPassType {
        if (this._vertices[v]._id === LayoutGraphValue.RenderStage) {
            return this._vertices[v]._object as RenderPassType;
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
    tryGetRenderStage (v: number): RenderPassType | null {
        if (this._vertices[v]._id === LayoutGraphValue.RenderStage) {
            return this._vertices[v]._object as RenderPassType;
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
        return findRelative(this, 0xFFFFFFFF, absPath) as number !== 0xFFFFFFFF;
    }
    locate (absPath: string): number {
        return findRelative(this, 0xFFFFFFFF, absPath) as number;
    }
    locateRelative (path: string, start = 0xFFFFFFFF): number {
        return findRelative(this, start, path) as number;
    }
    path (v: number): string {
        return getPath(this, v);
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
    reset (uniformID = 0xFFFFFFFF, uniformType: Type = Type.UNKNOWN, offset = 0): void {
        this.uniformID = uniformID;
        this.uniformType = uniformType;
        this.offset = offset;
        this.size = 0;
    }
    uniformID: number;
    uniformType: Type;
    offset: number;
    size = 0;
}

export class UniformBlockData {
    reset (): void {
        this.bufferSize = 0;
        this.uniforms.length = 0;
    }
    bufferSize = 0;
    readonly uniforms: UniformData[] = [];
}

export class DescriptorData {
    constructor (descriptorID = 0, type: Type = Type.UNKNOWN, count = 1) {
        this.descriptorID = descriptorID;
        this.type = type;
        this.count = count;
    }
    reset (descriptorID = 0, type: Type = Type.UNKNOWN, count = 1): void {
        this.descriptorID = descriptorID;
        this.type = type;
        this.count = count;
    }
    descriptorID: number;
    type: Type;
    count: number;
}

export class DescriptorBlockData {
    constructor (type: DescriptorTypeOrder = DescriptorTypeOrder.UNIFORM_BUFFER, visibility: ShaderStageFlagBit = ShaderStageFlagBit.NONE, capacity = 0) {
        this.type = type;
        this.visibility = visibility;
        this.capacity = capacity;
    }
    reset (type: DescriptorTypeOrder = DescriptorTypeOrder.UNIFORM_BUFFER, visibility: ShaderStageFlagBit = ShaderStageFlagBit.NONE, capacity = 0): void {
        this.type = type;
        this.visibility = visibility;
        this.offset = 0;
        this.capacity = capacity;
        this.descriptors.length = 0;
    }
    type: DescriptorTypeOrder;
    visibility: ShaderStageFlagBit;
    offset = 0;
    capacity: number;
    readonly descriptors: DescriptorData[] = [];
}

export class DescriptorSetLayoutData {
    constructor (
        slot = 0xFFFFFFFF,
        capacity = 0,
        descriptorBlocks: DescriptorBlockData[] = [],
        uniformBlocks: Map<number, UniformBlock> = new Map<number, UniformBlock>(),
        bindingMap: Map<number, number> = new Map<number, number>(),
    ) {
        this.slot = slot;
        this.capacity = capacity;
        this.descriptorBlocks = descriptorBlocks;
        this.uniformBlocks = uniformBlocks;
        this.bindingMap = bindingMap;
    }
    reset (
        slot = 0xFFFFFFFF,
        capacity = 0,
    ): void {
        this.slot = slot;
        this.capacity = capacity;
        this.uniformBlockCapacity = 0;
        this.samplerTextureCapacity = 0;
        this.descriptorBlocks.length = 0;
        this.uniformBlocks.clear();
        this.bindingMap.clear();
    }
    slot: number;
    capacity: number;
    uniformBlockCapacity = 0;
    samplerTextureCapacity = 0;
    readonly descriptorBlocks: DescriptorBlockData[];
    readonly uniformBlocks: Map<number, UniformBlock>;
    readonly bindingMap: Map<number, number>;
}

export class DescriptorSetData {
    constructor (descriptorSetLayoutData: DescriptorSetLayoutData = new DescriptorSetLayoutData(), descriptorSetLayout: DescriptorSetLayout | null = null, descriptorSet: DescriptorSet | null = null) {
        this.descriptorSetLayoutData = descriptorSetLayoutData;
        this.descriptorSetLayout = descriptorSetLayout;
        this.descriptorSet = descriptorSet;
    }
    reset (descriptorSetLayout: DescriptorSetLayout | null = null, descriptorSet: DescriptorSet | null = null): void {
        this.descriptorSetLayoutData.reset();
        this.descriptorSetLayoutInfo.reset();
        this.descriptorSetLayout = descriptorSetLayout;
        this.descriptorSet = descriptorSet;
    }
    readonly descriptorSetLayoutData: DescriptorSetLayoutData;
    readonly descriptorSetLayoutInfo: DescriptorSetLayoutInfo = new DescriptorSetLayoutInfo();
    /*refcount*/ descriptorSetLayout: DescriptorSetLayout | null;
    /*refcount*/ descriptorSet: DescriptorSet | null;
}

export class PipelineLayoutData {
    reset (): void {
        this.descriptorSets.clear();
    }
    readonly descriptorSets: Map<UpdateFrequency, DescriptorSetData> = new Map<UpdateFrequency, DescriptorSetData>();
}

export class ShaderBindingData {
    reset (): void {
        this.descriptorBindings.clear();
    }
    readonly descriptorBindings: Map<number, number> = new Map<number, number>();
}

export class ShaderLayoutData {
    reset (): void {
        this.layoutData.clear();
        this.bindingData.clear();
    }
    readonly layoutData: Map<UpdateFrequency, DescriptorSetLayoutData> = new Map<UpdateFrequency, DescriptorSetLayoutData>();
    readonly bindingData: Map<UpdateFrequency, ShaderBindingData> = new Map<UpdateFrequency, ShaderBindingData>();
}

export class TechniqueData {
    reset (): void {
        this.passes.length = 0;
    }
    readonly passes: ShaderLayoutData[] = [];
}

export class EffectData {
    reset (): void {
        this.techniques.clear();
    }
    readonly techniques: Map<string, TechniqueData> = new Map<string, TechniqueData>();
}

export class ShaderProgramData {
    reset (): void {
        this.layout.reset();
        this.pipelineLayout = null;
    }
    readonly layout: PipelineLayoutData = new PipelineLayoutData();
    /*refcount*/ pipelineLayout: PipelineLayout | null = null;
}

export class RenderStageData {
    reset (): void {
        this.descriptorVisibility.clear();
    }
    readonly descriptorVisibility: Map<number, ShaderStageFlagBit> = new Map<number, ShaderStageFlagBit>();
}

export class RenderPhaseData {
    reset (): void {
        this.rootSignature = '';
        this.shaderPrograms.length = 0;
        this.shaderIndex.clear();
        this.pipelineLayout = null;
    }
    rootSignature = '';
    readonly shaderPrograms: ShaderProgramData[] = [];
    readonly shaderIndex: Map<string, number> = new Map<string, number>();
    /*refcount*/ pipelineLayout: PipelineLayout | null = null;
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

export interface LayoutGraphDataValueType {
    [LayoutGraphDataValue.RenderStage]: RenderStageData
    [LayoutGraphDataValue.RenderPhase]: RenderPhaseData
}

export interface LayoutGraphDataVisitor {
    renderStage(value: RenderStageData): unknown;
    renderPhase(value: RenderPhaseData): unknown;
}

export type LayoutGraphDataObject = RenderStageData | RenderPhaseData;

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
    readonly _outEdges: OutE[] = [];
    readonly _inEdges: OutE[] = [];
    readonly _id: LayoutGraphDataValue;
    _object: LayoutGraphDataObject;
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class LayoutGraphDataNameMap implements PropertyMap {
    constructor (readonly names: string[]) {
        this._names = names;
    }
    get (v: number): string {
        return this._names[v];
    }
    // skip set, name is constant in AddressableGraph
    readonly _names: string[];
}

export class LayoutGraphDataUpdateMap implements PropertyMap {
    constructor (readonly updateFrequencies: UpdateFrequency[]) {
        this._updateFrequencies = updateFrequencies;
    }
    get (v: number): UpdateFrequency {
        return this._updateFrequencies[v];
    }
    set (v: number, updateFrequencies: UpdateFrequency): void {
        this._updateFrequencies[v] = updateFrequencies;
    }
    readonly _updateFrequencies: UpdateFrequency[];
}

export class LayoutGraphDataLayoutMap implements PropertyMap {
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

export interface LayoutGraphDataComponentType {
    [LayoutGraphDataComponent.Name]: string;
    [LayoutGraphDataComponent.Update]: UpdateFrequency;
    [LayoutGraphDataComponent.Layout]: PipelineLayoutData;
}

export interface LayoutGraphDataComponentPropertyMap {
    [LayoutGraphDataComponent.Name]: LayoutGraphDataNameMap;
    [LayoutGraphDataComponent.Update]: LayoutGraphDataUpdateMap;
    [LayoutGraphDataComponent.Layout]: LayoutGraphDataLayoutMap;
}

//-----------------------------------------------------------------
// LayoutGraphData Implementation
export class LayoutGraphData implements BidirectionalGraph
, AdjacencyGraph
, VertexListGraph
, MutableGraph
, PropertyGraph
, NamedGraph
, ComponentGraph
, PolymorphicGraph
, ReferenceGraph
, MutableReferenceGraph
, AddressableGraph {
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
        this.valueNames.length = 0;
        this.attributeIndex.clear();
        this.constantIndex.clear();
        this.shaderLayoutIndex.clear();
        this.effects.clear();
        this.constantMacros = '';
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
    // skip setName, Name is constant in AddressableGraph
    getName (v: number): string {
        return this._names[v];
    }
    getUpdate (v: number): UpdateFrequency {
        return this._updateFrequencies[v];
    }
    setUpdate (v: number, value: UpdateFrequency): void {
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
        return findRelative(this, 0xFFFFFFFF, absPath) as number !== 0xFFFFFFFF;
    }
    locate (absPath: string): number {
        return findRelative(this, 0xFFFFFFFF, absPath) as number;
    }
    locateRelative (path: string, start = 0xFFFFFFFF): number {
        return findRelative(this, start, path) as number;
    }
    path (v: number): string {
        return getPath(this, v);
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
    constantMacros = '';
}

export class LayoutGraphObjectPoolSettings {
    constructor (batchSize: number) {
        this.descriptorDBBatchSize = batchSize;
        this.renderPhaseBatchSize = batchSize;
        this.layoutGraphBatchSize = batchSize;
        this.uniformDataBatchSize = batchSize;
        this.uniformBlockDataBatchSize = batchSize;
        this.descriptorDataBatchSize = batchSize;
        this.descriptorBlockDataBatchSize = batchSize;
        this.descriptorSetLayoutDataBatchSize = batchSize;
        this.descriptorSetDataBatchSize = batchSize;
        this.pipelineLayoutDataBatchSize = batchSize;
        this.shaderBindingDataBatchSize = batchSize;
        this.shaderLayoutDataBatchSize = batchSize;
        this.techniqueDataBatchSize = batchSize;
        this.effectDataBatchSize = batchSize;
        this.shaderProgramDataBatchSize = batchSize;
        this.renderStageDataBatchSize = batchSize;
        this.renderPhaseDataBatchSize = batchSize;
        this.layoutGraphDataBatchSize = batchSize;
    }
    descriptorDBBatchSize = 16;
    renderPhaseBatchSize = 16;
    layoutGraphBatchSize = 16;
    uniformDataBatchSize = 16;
    uniformBlockDataBatchSize = 16;
    descriptorDataBatchSize = 16;
    descriptorBlockDataBatchSize = 16;
    descriptorSetLayoutDataBatchSize = 16;
    descriptorSetDataBatchSize = 16;
    pipelineLayoutDataBatchSize = 16;
    shaderBindingDataBatchSize = 16;
    shaderLayoutDataBatchSize = 16;
    techniqueDataBatchSize = 16;
    effectDataBatchSize = 16;
    shaderProgramDataBatchSize = 16;
    renderStageDataBatchSize = 16;
    renderPhaseDataBatchSize = 16;
    layoutGraphDataBatchSize = 16;
}

export class LayoutGraphObjectPool {
    constructor (settings: LayoutGraphObjectPoolSettings, renderCommon: RenderCommonObjectPool) {
        this.renderCommon = renderCommon;
        this._descriptorDB = new RecyclePool<DescriptorDB>(() => new DescriptorDB(), settings.descriptorDBBatchSize);
        this._renderPhase = new RecyclePool<RenderPhase>(() => new RenderPhase(), settings.renderPhaseBatchSize);
        this._layoutGraph = new RecyclePool<LayoutGraph>(() => new LayoutGraph(), settings.layoutGraphBatchSize);
        this._uniformData = new RecyclePool<UniformData>(() => new UniformData(), settings.uniformDataBatchSize);
        this._uniformBlockData = new RecyclePool<UniformBlockData>(() => new UniformBlockData(), settings.uniformBlockDataBatchSize);
        this._descriptorData = new RecyclePool<DescriptorData>(() => new DescriptorData(), settings.descriptorDataBatchSize);
        this._descriptorBlockData = new RecyclePool<DescriptorBlockData>(() => new DescriptorBlockData(), settings.descriptorBlockDataBatchSize);
        this._descriptorSetLayoutData = new RecyclePool<DescriptorSetLayoutData>(() => new DescriptorSetLayoutData(), settings.descriptorSetLayoutDataBatchSize);
        this._descriptorSetData = new RecyclePool<DescriptorSetData>(() => new DescriptorSetData(), settings.descriptorSetDataBatchSize);
        this._pipelineLayoutData = new RecyclePool<PipelineLayoutData>(() => new PipelineLayoutData(), settings.pipelineLayoutDataBatchSize);
        this._shaderBindingData = new RecyclePool<ShaderBindingData>(() => new ShaderBindingData(), settings.shaderBindingDataBatchSize);
        this._shaderLayoutData = new RecyclePool<ShaderLayoutData>(() => new ShaderLayoutData(), settings.shaderLayoutDataBatchSize);
        this._techniqueData = new RecyclePool<TechniqueData>(() => new TechniqueData(), settings.techniqueDataBatchSize);
        this._effectData = new RecyclePool<EffectData>(() => new EffectData(), settings.effectDataBatchSize);
        this._shaderProgramData = new RecyclePool<ShaderProgramData>(() => new ShaderProgramData(), settings.shaderProgramDataBatchSize);
        this._renderStageData = new RecyclePool<RenderStageData>(() => new RenderStageData(), settings.renderStageDataBatchSize);
        this._renderPhaseData = new RecyclePool<RenderPhaseData>(() => new RenderPhaseData(), settings.renderPhaseDataBatchSize);
        this._layoutGraphData = new RecyclePool<LayoutGraphData>(() => new LayoutGraphData(), settings.layoutGraphDataBatchSize);
    }
    reset (): void {
        this._descriptorDB.reset();
        this._renderPhase.reset();
        this._layoutGraph.reset();
        this._uniformData.reset();
        this._uniformBlockData.reset();
        this._descriptorData.reset();
        this._descriptorBlockData.reset();
        this._descriptorSetLayoutData.reset();
        this._descriptorSetData.reset();
        this._pipelineLayoutData.reset();
        this._shaderBindingData.reset();
        this._shaderLayoutData.reset();
        this._techniqueData.reset();
        this._effectData.reset();
        this._shaderProgramData.reset();
        this._renderStageData.reset();
        this._renderPhaseData.reset();
        this._layoutGraphData.reset();
    }
    createDescriptorDB (): DescriptorDB {
        const v = this._descriptorDB.add();
        v.reset();
        return v;
    }
    createRenderPhase (): RenderPhase {
        const v = this._renderPhase.add();
        v.reset();
        return v;
    }
    createLayoutGraph (): LayoutGraph {
        const v = this._layoutGraph.add();
        v.clear();
        return v;
    }
    createUniformData (
        uniformID = 0xFFFFFFFF,
        uniformType: Type = Type.UNKNOWN,
        offset = 0,
    ): UniformData {
        const v = this._uniformData.add();
        v.reset(uniformID, uniformType, offset);
        return v;
    }
    createUniformBlockData (): UniformBlockData {
        const v = this._uniformBlockData.add();
        v.reset();
        return v;
    }
    createDescriptorData (
        descriptorID = 0,
        type: Type = Type.UNKNOWN,
        count = 1,
    ): DescriptorData {
        const v = this._descriptorData.add();
        v.reset(descriptorID, type, count);
        return v;
    }
    createDescriptorBlockData (
        type: DescriptorTypeOrder = DescriptorTypeOrder.UNIFORM_BUFFER,
        visibility: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
        capacity = 0,
    ): DescriptorBlockData {
        const v = this._descriptorBlockData.add();
        v.reset(type, visibility, capacity);
        return v;
    }
    createDescriptorSetLayoutData (
        slot = 0xFFFFFFFF,
        capacity = 0,
    ): DescriptorSetLayoutData {
        const v = this._descriptorSetLayoutData.add();
        v.reset(slot, capacity);
        return v;
    }
    createDescriptorSetData (
        descriptorSetLayout: DescriptorSetLayout | null = null,
        descriptorSet: DescriptorSet | null = null,
    ): DescriptorSetData {
        const v = this._descriptorSetData.add();
        v.reset(descriptorSetLayout, descriptorSet);
        return v;
    }
    createPipelineLayoutData (): PipelineLayoutData {
        const v = this._pipelineLayoutData.add();
        v.reset();
        return v;
    }
    createShaderBindingData (): ShaderBindingData {
        const v = this._shaderBindingData.add();
        v.reset();
        return v;
    }
    createShaderLayoutData (): ShaderLayoutData {
        const v = this._shaderLayoutData.add();
        v.reset();
        return v;
    }
    createTechniqueData (): TechniqueData {
        const v = this._techniqueData.add();
        v.reset();
        return v;
    }
    createEffectData (): EffectData {
        const v = this._effectData.add();
        v.reset();
        return v;
    }
    createShaderProgramData (): ShaderProgramData {
        const v = this._shaderProgramData.add();
        v.reset();
        return v;
    }
    createRenderStageData (): RenderStageData {
        const v = this._renderStageData.add();
        v.reset();
        return v;
    }
    createRenderPhaseData (): RenderPhaseData {
        const v = this._renderPhaseData.add();
        v.reset();
        return v;
    }
    createLayoutGraphData (): LayoutGraphData {
        const v = this._layoutGraphData.add();
        v.clear();
        return v;
    }
    public readonly renderCommon: RenderCommonObjectPool;
    private readonly _descriptorDB: RecyclePool<DescriptorDB>;
    private readonly _renderPhase: RecyclePool<RenderPhase>;
    private readonly _layoutGraph: RecyclePool<LayoutGraph>;
    private readonly _uniformData: RecyclePool<UniformData>;
    private readonly _uniformBlockData: RecyclePool<UniformBlockData>;
    private readonly _descriptorData: RecyclePool<DescriptorData>;
    private readonly _descriptorBlockData: RecyclePool<DescriptorBlockData>;
    private readonly _descriptorSetLayoutData: RecyclePool<DescriptorSetLayoutData>;
    private readonly _descriptorSetData: RecyclePool<DescriptorSetData>;
    private readonly _pipelineLayoutData: RecyclePool<PipelineLayoutData>;
    private readonly _shaderBindingData: RecyclePool<ShaderBindingData>;
    private readonly _shaderLayoutData: RecyclePool<ShaderLayoutData>;
    private readonly _techniqueData: RecyclePool<TechniqueData>;
    private readonly _effectData: RecyclePool<EffectData>;
    private readonly _shaderProgramData: RecyclePool<ShaderProgramData>;
    private readonly _renderStageData: RecyclePool<RenderStageData>;
    private readonly _renderPhaseData: RecyclePool<RenderPhaseData>;
    private readonly _layoutGraphData: RecyclePool<LayoutGraphData>;
}

export function saveDescriptorDB (ar: OutputArchive, v: DescriptorDB): void {
    ar.writeNumber(v.blocks.size); // Map<string, DescriptorBlock>
    for (const [k1, v1] of v.blocks) {
        saveDescriptorBlockIndex(ar, JSON.parse(k1) as DescriptorBlockIndex);
        saveDescriptorBlock(ar, v1);
    }
}

export function loadDescriptorDB (ar: InputArchive, v: DescriptorDB): void {
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

export function saveRenderPhase (ar: OutputArchive, v: RenderPhase): void {
    ar.writeNumber(v.shaders.size); // Set<string>
    for (const v1 of v.shaders) {
        ar.writeString(v1);
    }
}

export function loadRenderPhase (ar: InputArchive, v: RenderPhase): void {
    let sz = 0;
    sz = ar.readNumber(); // Set<string>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = ar.readString();
        v.shaders.add(v1);
    }
}

export function saveLayoutGraph (ar: OutputArchive, g: LayoutGraph): void {
    const numVertices = g.numVertices();
    const numEdges = g.numEdges();
    ar.writeNumber(numVertices);
    ar.writeNumber(numEdges);
    let numStages = 0;
    let numPhases = 0;
    for (const v of g.vertices()) {
        switch (g.id(v)) {
        case LayoutGraphValue.RenderStage:
            numStages += 1;
            break;
        case LayoutGraphValue.RenderPhase:
            numPhases += 1;
            break;
        default:
            break;
        }
    }
    ar.writeNumber(numStages);
    ar.writeNumber(numPhases);
    for (const v of g.vertices()) {
        ar.writeNumber(g.id(v));
        ar.writeNumber(g.getParent(v));
        ar.writeString(g.getName(v));
        saveDescriptorDB(ar, g.getDescriptors(v));
        switch (g.id(v)) {
        case LayoutGraphValue.RenderStage:
            ar.writeNumber(g.getRenderStage(v));
            break;
        case LayoutGraphValue.RenderPhase:
            saveRenderPhase(ar, g.getRenderPhase(v));
            break;
        default:
            break;
        }
    }
}

export function loadLayoutGraph (ar: InputArchive, g: LayoutGraph): void {
    const numVertices = ar.readNumber();
    const numEdges = ar.readNumber();
    const numStages = ar.readNumber();
    const numPhases = ar.readNumber();
    for (let v = 0; v !== numVertices; ++v) {
        const id = ar.readNumber();
        const u = ar.readNumber();
        const name = ar.readString();
        const descriptors = new DescriptorDB();
        loadDescriptorDB(ar, descriptors);
        switch (id) {
        case LayoutGraphValue.RenderStage: {
            const renderStage = ar.readNumber();
            g.addVertex<LayoutGraphValue.RenderStage>(LayoutGraphValue.RenderStage, renderStage, name, descriptors, u);
            break;
        }
        case LayoutGraphValue.RenderPhase: {
            const renderPhase = new RenderPhase();
            loadRenderPhase(ar, renderPhase);
            g.addVertex<LayoutGraphValue.RenderPhase>(LayoutGraphValue.RenderPhase, renderPhase, name, descriptors, u);
            break;
        }
        default:
            break;
        }
    }
}

export function saveUniformData (ar: OutputArchive, v: UniformData): void {
    ar.writeNumber(v.uniformID);
    ar.writeNumber(v.uniformType);
    ar.writeNumber(v.offset);
    ar.writeNumber(v.size);
}

export function loadUniformData (ar: InputArchive, v: UniformData): void {
    v.uniformID = ar.readNumber();
    v.uniformType = ar.readNumber();
    v.offset = ar.readNumber();
    v.size = ar.readNumber();
}

export function saveUniformBlockData (ar: OutputArchive, v: UniformBlockData): void {
    ar.writeNumber(v.bufferSize);
    ar.writeNumber(v.uniforms.length); // UniformData[]
    for (const v1 of v.uniforms) {
        saveUniformData(ar, v1);
    }
}

export function loadUniformBlockData (ar: InputArchive, v: UniformBlockData): void {
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

export function saveDescriptorData (ar: OutputArchive, v: DescriptorData): void {
    ar.writeNumber(v.descriptorID);
    ar.writeNumber(v.type);
    ar.writeNumber(v.count);
}

export function loadDescriptorData (ar: InputArchive, v: DescriptorData): void {
    v.descriptorID = ar.readNumber();
    v.type = ar.readNumber();
    v.count = ar.readNumber();
}

export function saveDescriptorBlockData (ar: OutputArchive, v: DescriptorBlockData): void {
    ar.writeNumber(v.type);
    ar.writeNumber(v.visibility);
    ar.writeNumber(v.offset);
    ar.writeNumber(v.capacity);
    ar.writeNumber(v.descriptors.length); // DescriptorData[]
    for (const v1 of v.descriptors) {
        saveDescriptorData(ar, v1);
    }
}

export function loadDescriptorBlockData (ar: InputArchive, v: DescriptorBlockData): void {
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

export function saveDescriptorSetLayoutData (ar: OutputArchive, v: DescriptorSetLayoutData): void {
    ar.writeNumber(v.slot);
    ar.writeNumber(v.capacity);
    ar.writeNumber(v.uniformBlockCapacity);
    ar.writeNumber(v.samplerTextureCapacity);
    ar.writeNumber(v.descriptorBlocks.length); // DescriptorBlockData[]
    for (const v1 of v.descriptorBlocks) {
        saveDescriptorBlockData(ar, v1);
    }
    ar.writeNumber(v.uniformBlocks.size); // Map<number, UniformBlock>
    for (const [k1, v1] of v.uniformBlocks) {
        ar.writeNumber(k1);
        saveUniformBlock(ar, v1);
    }
    ar.writeNumber(v.bindingMap.size); // Map<number, number>
    for (const [k1, v1] of v.bindingMap) {
        ar.writeNumber(k1);
        ar.writeNumber(v1);
    }
}

export function loadDescriptorSetLayoutData (ar: InputArchive, v: DescriptorSetLayoutData): void {
    v.slot = ar.readNumber();
    v.capacity = ar.readNumber();
    v.uniformBlockCapacity = ar.readNumber();
    v.samplerTextureCapacity = ar.readNumber();
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
    sz = ar.readNumber(); // Map<number, number>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = ar.readNumber();
        v.bindingMap.set(k1, v1);
    }
}

export function saveDescriptorSetData (ar: OutputArchive, v: DescriptorSetData): void {
    saveDescriptorSetLayoutData(ar, v.descriptorSetLayoutData);
    saveDescriptorSetLayoutInfo(ar, v.descriptorSetLayoutInfo);
    // skip, v.descriptorSetLayout: DescriptorSetLayout
    // skip, v.descriptorSet: DescriptorSet
}

export function loadDescriptorSetData (ar: InputArchive, v: DescriptorSetData): void {
    loadDescriptorSetLayoutData(ar, v.descriptorSetLayoutData);
    loadDescriptorSetLayoutInfo(ar, v.descriptorSetLayoutInfo);
    // skip, v.descriptorSetLayout: DescriptorSetLayout
    // skip, v.descriptorSet: DescriptorSet
}

export function savePipelineLayoutData (ar: OutputArchive, v: PipelineLayoutData): void {
    ar.writeNumber(v.descriptorSets.size); // Map<UpdateFrequency, DescriptorSetData>
    for (const [k1, v1] of v.descriptorSets) {
        ar.writeNumber(k1);
        saveDescriptorSetData(ar, v1);
    }
}

export function loadPipelineLayoutData (ar: InputArchive, v: PipelineLayoutData): void {
    let sz = 0;
    sz = ar.readNumber(); // Map<UpdateFrequency, DescriptorSetData>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = new DescriptorSetData();
        loadDescriptorSetData(ar, v1);
        v.descriptorSets.set(k1, v1);
    }
}

export function saveShaderBindingData (ar: OutputArchive, v: ShaderBindingData): void {
    ar.writeNumber(v.descriptorBindings.size); // Map<number, number>
    for (const [k1, v1] of v.descriptorBindings) {
        ar.writeNumber(k1);
        ar.writeNumber(v1);
    }
}

export function loadShaderBindingData (ar: InputArchive, v: ShaderBindingData): void {
    let sz = 0;
    sz = ar.readNumber(); // Map<number, number>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = ar.readNumber();
        v.descriptorBindings.set(k1, v1);
    }
}

export function saveShaderLayoutData (ar: OutputArchive, v: ShaderLayoutData): void {
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

export function loadShaderLayoutData (ar: InputArchive, v: ShaderLayoutData): void {
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

export function saveTechniqueData (ar: OutputArchive, v: TechniqueData): void {
    ar.writeNumber(v.passes.length); // ShaderLayoutData[]
    for (const v1 of v.passes) {
        saveShaderLayoutData(ar, v1);
    }
}

export function loadTechniqueData (ar: InputArchive, v: TechniqueData): void {
    let sz = 0;
    sz = ar.readNumber(); // ShaderLayoutData[]
    v.passes.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = new ShaderLayoutData();
        loadShaderLayoutData(ar, v1);
        v.passes[i1] = v1;
    }
}

export function saveEffectData (ar: OutputArchive, v: EffectData): void {
    ar.writeNumber(v.techniques.size); // Map<string, TechniqueData>
    for (const [k1, v1] of v.techniques) {
        ar.writeString(k1);
        saveTechniqueData(ar, v1);
    }
}

export function loadEffectData (ar: InputArchive, v: EffectData): void {
    let sz = 0;
    sz = ar.readNumber(); // Map<string, TechniqueData>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readString();
        const v1 = new TechniqueData();
        loadTechniqueData(ar, v1);
        v.techniques.set(k1, v1);
    }
}

export function saveShaderProgramData (ar: OutputArchive, v: ShaderProgramData): void {
    savePipelineLayoutData(ar, v.layout);
    // skip, v.pipelineLayout: PipelineLayout
}

export function loadShaderProgramData (ar: InputArchive, v: ShaderProgramData): void {
    loadPipelineLayoutData(ar, v.layout);
    // skip, v.pipelineLayout: PipelineLayout
}

export function saveRenderStageData (ar: OutputArchive, v: RenderStageData): void {
    ar.writeNumber(v.descriptorVisibility.size); // Map<number, ShaderStageFlagBit>
    for (const [k1, v1] of v.descriptorVisibility) {
        ar.writeNumber(k1);
        ar.writeNumber(v1);
    }
}

export function loadRenderStageData (ar: InputArchive, v: RenderStageData): void {
    let sz = 0;
    sz = ar.readNumber(); // Map<number, ShaderStageFlagBit>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readNumber();
        const v1 = ar.readNumber();
        v.descriptorVisibility.set(k1, v1);
    }
}

export function saveRenderPhaseData (ar: OutputArchive, v: RenderPhaseData): void {
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
    // skip, v.pipelineLayout: PipelineLayout
}

export function loadRenderPhaseData (ar: InputArchive, v: RenderPhaseData): void {
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
    // skip, v.pipelineLayout: PipelineLayout
}

export function saveLayoutGraphData (ar: OutputArchive, g: LayoutGraphData): void {
    const numVertices = g.numVertices();
    const numEdges = g.numEdges();
    ar.writeNumber(numVertices);
    ar.writeNumber(numEdges);
    let numStages = 0;
    let numPhases = 0;
    for (const v of g.vertices()) {
        switch (g.id(v)) {
        case LayoutGraphDataValue.RenderStage:
            numStages += 1;
            break;
        case LayoutGraphDataValue.RenderPhase:
            numPhases += 1;
            break;
        default:
            break;
        }
    }
    ar.writeNumber(numStages);
    ar.writeNumber(numPhases);
    for (const v of g.vertices()) {
        ar.writeNumber(g.id(v));
        ar.writeNumber(g.getParent(v));
        ar.writeString(g.getName(v));
        ar.writeNumber(g.getUpdate(v));
        savePipelineLayoutData(ar, g.getLayout(v));
        switch (g.id(v)) {
        case LayoutGraphDataValue.RenderStage:
            saveRenderStageData(ar, g.getRenderStage(v));
            break;
        case LayoutGraphDataValue.RenderPhase:
            saveRenderPhaseData(ar, g.getRenderPhase(v));
            break;
        default:
            break;
        }
    }
    ar.writeNumber(g.valueNames.length); // string[]
    for (const v1 of g.valueNames) {
        ar.writeString(v1);
    }
    ar.writeNumber(g.attributeIndex.size); // Map<string, number>
    for (const [k1, v1] of g.attributeIndex) {
        ar.writeString(k1);
        ar.writeNumber(v1);
    }
    ar.writeNumber(g.constantIndex.size); // Map<string, number>
    for (const [k1, v1] of g.constantIndex) {
        ar.writeString(k1);
        ar.writeNumber(v1);
    }
    ar.writeNumber(g.shaderLayoutIndex.size); // Map<string, number>
    for (const [k1, v1] of g.shaderLayoutIndex) {
        ar.writeString(k1);
        ar.writeNumber(v1);
    }
    ar.writeNumber(g.effects.size); // Map<string, EffectData>
    for (const [k1, v1] of g.effects) {
        ar.writeString(k1);
        saveEffectData(ar, v1);
    }
}

export function loadLayoutGraphData (ar: InputArchive, g: LayoutGraphData): void {
    const numVertices = ar.readNumber();
    const numEdges = ar.readNumber();
    const numStages = ar.readNumber();
    const numPhases = ar.readNumber();
    for (let v = 0; v !== numVertices; ++v) {
        const id = ar.readNumber();
        const u = ar.readNumber();
        const name = ar.readString();
        const update = ar.readNumber();
        const layout = new PipelineLayoutData();
        loadPipelineLayoutData(ar, layout);
        switch (id) {
        case LayoutGraphDataValue.RenderStage: {
            const renderStage = new RenderStageData();
            loadRenderStageData(ar, renderStage);
            g.addVertex<LayoutGraphDataValue.RenderStage>(LayoutGraphDataValue.RenderStage, renderStage, name, update, layout, u);
            break;
        }
        case LayoutGraphDataValue.RenderPhase: {
            const renderPhase = new RenderPhaseData();
            loadRenderPhaseData(ar, renderPhase);
            g.addVertex<LayoutGraphDataValue.RenderPhase>(LayoutGraphDataValue.RenderPhase, renderPhase, name, update, layout, u);
            break;
        }
        default:
            break;
        }
    }
    let sz = 0;
    sz = ar.readNumber(); // string[]
    g.valueNames.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        g.valueNames[i1] = ar.readString();
    }
    sz = ar.readNumber(); // Map<string, number>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readString();
        const v1 = ar.readNumber();
        g.attributeIndex.set(k1, v1);
    }
    sz = ar.readNumber(); // Map<string, number>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readString();
        const v1 = ar.readNumber();
        g.constantIndex.set(k1, v1);
    }
    sz = ar.readNumber(); // Map<string, number>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readString();
        const v1 = ar.readNumber();
        g.shaderLayoutIndex.set(k1, v1);
    }
    sz = ar.readNumber(); // Map<string, EffectData>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readString();
        const v1 = new EffectData();
        loadEffectData(ar, v1);
        g.effects.set(k1, v1);
    }
}
