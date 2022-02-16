/* eslint-disable max-len */
import * as impl from './graph';
import { NodeType, ParameterType, UpdateFrequency, ValueType } from './types';

export class Constant {
    type: ValueType = ValueType.Typeless;
    valueID = 0xFFFFFFFF;
}

export class ConstantBuffer {
    size = 0;
    constants: Constant[] = [];
}

export const enum DescriptorType {
    CBuffer,
    RWBuffer,
    RWTexture,
    Buffer,
    Texture,
    Sampler,
}

export class DescriptorBlock {
    type: DescriptorType = DescriptorType.CBuffer;
    capacity = 0;
    attributeIDs: Uint32Array = new Uint32Array(0);
}

export class DescriptorArray {
    capacity = 0;
    attributeID = 0xFFFFFFFF;
}

export class UnboundedDescriptor {
    type: DescriptorType = DescriptorType.CBuffer;
    descriptors: DescriptorArray[] = [];
}

export class DescriptorTable {
    slot = 0;
    capacity = 0;
    blocks: DescriptorBlock[] = [];
}

export class DescriptorSet {
    tables: DescriptorTable[] = [];
    unbounded: UnboundedDescriptor = new UnboundedDescriptor();
}

export class LayoutData {
    constantBuffers: Map<ParameterType, ConstantBuffer> = new Map<ParameterType, ConstantBuffer>();
    descriptorSets: Map<ParameterType, DescriptorSet> = new Map<ParameterType, DescriptorSet>();
}

export class ShaderProgramData {
    layouts: Map<UpdateFrequency, LayoutData> = new Map<UpdateFrequency, LayoutData>();
}

export class GroupNodeData {
    constructor (nodeType: NodeType = NodeType.Internal) {
        this.nodeType = nodeType;
    }
    nodeType: NodeType;
}

export class ShaderNodeData {
    rootSignature = '';
    shaderPrograms: ShaderProgramData[] = [];
    shaderIndex: Map<string, number> = new Map<string, number>();
}

//=================================================================
// LayoutGraph
//=================================================================
// PolymorphicGraph Concept
export const enum LayoutGraphValue {
    group,
    shader,
}

interface LayoutGraphValueType {
    [LayoutGraphValue.group]: GroupNodeData
    [LayoutGraphValue.shader]: ShaderNodeData
}

export interface LayoutGraphVisitor {
    group(value: GroupNodeData): unknown;
    shader(value: ShaderNodeData): unknown;
}

type LayoutGraphObject = GroupNodeData | ShaderNodeData;

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
    constructor (readonly name: string[]) {
        this._name = name;
    }
    get (v: number): string {
        return this._name[v];
    }
    readonly _name: string[];
}

export class LayoutGraphUpdateMap implements impl.PropertyMap {
    constructor (readonly updateFrequencies: UpdateFrequency[]) {
        this._updateFrequencies = updateFrequencies;
    }
    get (v: number): UpdateFrequency {
        return this._updateFrequencies[v];
    }
    readonly _updateFrequencies: UpdateFrequency[];
}

export class LayoutGraphLayoutMap implements impl.PropertyMap {
    constructor (readonly layouts: LayoutData[]) {
        this._layouts = layouts;
    }
    get (v: number): LayoutData {
        return this._layouts[v];
    }
    readonly _layouts: LayoutData[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum LayoutGraphComponent {
    name,
    update,
    layout,
}

interface LayoutGraphComponentType {
    [LayoutGraphComponent.name]: string;
    [LayoutGraphComponent.update]: UpdateFrequency;
    [LayoutGraphComponent.layout]: LayoutData;
}

interface LayoutGraphComponentPropertyMap {
    [LayoutGraphComponent.name]: LayoutGraphNameMap;
    [LayoutGraphComponent.update]: LayoutGraphUpdateMap;
    [LayoutGraphComponent.layout]: LayoutGraphLayoutMap;
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
        update: UpdateFrequency,
        layout: LayoutData,
        u = 0xFFFFFFFF,
    ): number {
        const vert = new LayoutGraphVertex(id, object);
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._name.push(name);
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
        this._name.splice(u, 1);
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
        return this._name[v];
    }
    vertexNameMap (): LayoutGraphNameMap {
        return new LayoutGraphNameMap(this._name);
    }
    //-----------------------------------------------------------------
    // PropertyGraph
    get (tag: string): LayoutGraphNameMap | LayoutGraphUpdateMap | LayoutGraphLayoutMap {
        switch (tag) {
        // Components
        case 'name':
            return new LayoutGraphNameMap(this._name);
        case 'update':
            return new LayoutGraphUpdateMap(this._updateFrequencies);
        case 'layout':
            return new LayoutGraphLayoutMap(this._layouts);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends LayoutGraphComponent> (id: T, v: number): LayoutGraphComponentType[T] {
        switch (id) {
        case LayoutGraphComponent.name:
            return this._name[v] as LayoutGraphComponentType[T];
        case LayoutGraphComponent.update:
            return this._updateFrequencies[v] as LayoutGraphComponentType[T];
        case LayoutGraphComponent.layout:
            return this._layouts[v] as LayoutGraphComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends LayoutGraphComponent> (id: T): LayoutGraphComponentPropertyMap[T] {
        switch (id) {
        case LayoutGraphComponent.name:
            return new LayoutGraphNameMap(this._name) as LayoutGraphComponentPropertyMap[T];
        case LayoutGraphComponent.update:
            return new LayoutGraphUpdateMap(this._updateFrequencies) as LayoutGraphComponentPropertyMap[T];
        case LayoutGraphComponent.layout:
            return new LayoutGraphLayoutMap(this._layouts) as LayoutGraphComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._name[v];
    }
    getUpdate (v: number): UpdateFrequency {
        return this._updateFrequencies[v];
    }
    getLayout (v: number): LayoutData {
        return this._layouts[v];
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
        case LayoutGraphValue.group:
            return visitor.group(vert._object as GroupNodeData);
        case LayoutGraphValue.shader:
            return visitor.shader(vert._object as ShaderNodeData);
        default:
            throw Error('polymorphic type not found');
        }
    }
    getGroup (v: number): GroupNodeData {
        if (this._vertices[v]._id === LayoutGraphValue.group) {
            return this._vertices[v]._object as GroupNodeData;
        } else {
            throw Error('value id not match');
        }
    }
    getShader (v: number): ShaderNodeData {
        if (this._vertices[v]._id === LayoutGraphValue.shader) {
            return this._vertices[v]._object as ShaderNodeData;
        } else {
            throw Error('value id not match');
        }
    }
    tryGetGroup (v: number): GroupNodeData | null {
        if (this._vertices[v]._id === LayoutGraphValue.group) {
            return this._vertices[v]._object as GroupNodeData;
        } else {
            return null;
        }
    }
    tryGetShader (v: number): ShaderNodeData | null {
        if (this._vertices[v]._id === LayoutGraphValue.shader) {
            return this._vertices[v]._object as ShaderNodeData;
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
                if (vert._inEdges.length === 0 && this._name[v] === name) {
                    return v;
                }
            }
            return 0xFFFFFFFF;
        }
        for (const oe of this._vertices[u]._outEdges) {
            const child = oe.target as number;
            if (name === this._name[child]) {
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

    readonly components: string[] = ['name', 'update', 'layout'];
    readonly _vertices: LayoutGraphVertex[] = [];
    readonly _name: string[] = [];
    readonly _updateFrequencies: UpdateFrequency[] = [];
    readonly _layouts: LayoutData[] = [];
}
