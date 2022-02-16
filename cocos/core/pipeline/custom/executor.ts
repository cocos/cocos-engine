/* eslint-disable max-len */
import * as impl from './graph';
import { Buffer, Texture } from '../../gfx/index';

//=================================================================
// DeviceResourceGraph
//=================================================================
// PolymorphicGraph Concept
export const enum DeviceResourceGraphValue {
    buffer,
    texture,
}

interface DeviceResourceGraphValueType {
    [DeviceResourceGraphValue.buffer]: Buffer
    [DeviceResourceGraphValue.texture]: Texture
}

export interface DeviceResourceGraphVisitor {
    buffer(value: Buffer): unknown;
    texture(value: Texture): unknown;
}

type DeviceResourceGraphObject = Buffer | Texture;

//-----------------------------------------------------------------
// Graph Concept
export class DeviceResourceGraphVertex {
    constructor (
        readonly id: DeviceResourceGraphValue,
        readonly object: DeviceResourceGraphObject,
    ) {
        this._id = id;
        this._object = object;
    }
    readonly _outEdges: impl.OutE[] = [];
    readonly _inEdges: impl.OutE[] = [];
    readonly _id: DeviceResourceGraphValue;
    readonly _object: DeviceResourceGraphObject;
}

//-----------------------------------------------------------------
// PropertyGraph Concept
export class DeviceResourceGraphNameMap implements impl.PropertyMap {
    constructor (readonly name: string[]) {
        this._name = name;
    }
    get (v: number): string {
        return this._name[v];
    }
    readonly _name: string[];
}

export class DeviceResourceGraphRefCountMap implements impl.PropertyMap {
    constructor (readonly refCounts: number[]) {
        this._refCounts = refCounts;
    }
    get (v: number): number {
        return this._refCounts[v];
    }
    readonly _refCounts: number[];
}

//-----------------------------------------------------------------
// ComponentGraph Concept
export const enum DeviceResourceGraphComponent {
    name,
    refCount,
}

interface DeviceResourceGraphComponentType {
    [DeviceResourceGraphComponent.name]: string;
    [DeviceResourceGraphComponent.refCount]: number;
}

interface DeviceResourceGraphComponentPropertyMap {
    [DeviceResourceGraphComponent.name]: DeviceResourceGraphNameMap;
    [DeviceResourceGraphComponent.refCount]: DeviceResourceGraphRefCountMap;
}

//-----------------------------------------------------------------
// DeviceResourceGraph Implementation
export class DeviceResourceGraph implements impl.BidirectionalGraph
, impl.AdjacencyGraph
, impl.VertexListGraph
, impl.MutableGraph
, impl.PropertyGraph
, impl.NamedGraph
, impl.ComponentGraph
, impl.PolymorphicGraph {
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
    addVertex<T extends DeviceResourceGraphValue> (
        id: DeviceResourceGraphValue,
        object: DeviceResourceGraphValueType[T],
        name: string,
        refCount: number,
    ): number {
        const vert = new DeviceResourceGraphVertex(id, object);
        const v = this._vertices.length;
        this._vertices.push(vert);
        this._name.push(name);
        this._refCounts.push(refCount);
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
        this._name.splice(u, 1);
        this._refCounts.splice(u, 1);

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
    vertexNameMap (): DeviceResourceGraphNameMap {
        return new DeviceResourceGraphNameMap(this._name);
    }
    //-----------------------------------------------------------------
    // PropertyGraph
    get (tag: string): DeviceResourceGraphNameMap | DeviceResourceGraphRefCountMap {
        switch (tag) {
        // Components
        case 'name':
            return new DeviceResourceGraphNameMap(this._name);
        case 'refCount':
            return new DeviceResourceGraphRefCountMap(this._refCounts);
        default:
            throw Error('property map not found');
        }
    }
    //-----------------------------------------------------------------
    // ComponentGraph
    component<T extends DeviceResourceGraphComponent> (id: T, v: number): DeviceResourceGraphComponentType[T] {
        switch (id) {
        case DeviceResourceGraphComponent.name:
            return this._name[v] as DeviceResourceGraphComponentType[T];
        case DeviceResourceGraphComponent.refCount:
            return this._refCounts[v] as DeviceResourceGraphComponentType[T];
        default:
            throw Error('component not found');
        }
    }
    componentMap<T extends DeviceResourceGraphComponent> (id: T): DeviceResourceGraphComponentPropertyMap[T] {
        switch (id) {
        case DeviceResourceGraphComponent.name:
            return new DeviceResourceGraphNameMap(this._name) as DeviceResourceGraphComponentPropertyMap[T];
        case DeviceResourceGraphComponent.refCount:
            return new DeviceResourceGraphRefCountMap(this._refCounts) as DeviceResourceGraphComponentPropertyMap[T];
        default:
            throw Error('component map not found');
        }
    }
    getName (v: number): string {
        return this._name[v];
    }
    getRefCount (v: number): number {
        return this._refCounts[v];
    }
    //-----------------------------------------------------------------
    // PolymorphicGraph
    holds (id: DeviceResourceGraphValue, v: number): boolean {
        return this._vertices[v]._id === id;
    }
    id (v: number): DeviceResourceGraphValue {
        return this._vertices[v]._id;
    }
    object (v: number): DeviceResourceGraphObject {
        return this._vertices[v]._object;
    }
    value<T extends DeviceResourceGraphValue> (id: T, v: number): DeviceResourceGraphValueType[T] {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as DeviceResourceGraphValueType[T];
        } else {
            throw Error('value id not match');
        }
    }
    tryValue<T extends DeviceResourceGraphValue> (id: T, v: number): DeviceResourceGraphValueType[T] | null {
        if (this._vertices[v]._id === id) {
            return this._vertices[v]._object as DeviceResourceGraphValueType[T];
        } else {
            return null;
        }
    }
    visitVertex (visitor: DeviceResourceGraphVisitor, v: number): unknown {
        const vert = this._vertices[v];
        switch (vert._id) {
        case DeviceResourceGraphValue.buffer:
            return visitor.buffer(vert._object as Buffer);
        case DeviceResourceGraphValue.texture:
            return visitor.texture(vert._object as Texture);
        default:
            throw Error('polymorphic type not found');
        }
    }
    getBuffer (v: number): Buffer {
        if (this._vertices[v]._id === DeviceResourceGraphValue.buffer) {
            return this._vertices[v]._object as Buffer;
        } else {
            throw Error('value id not match');
        }
    }
    getTexture (v: number): Texture {
        if (this._vertices[v]._id === DeviceResourceGraphValue.texture) {
            return this._vertices[v]._object as Texture;
        } else {
            throw Error('value id not match');
        }
    }
    tryGetBuffer (v: number): Buffer | null {
        if (this._vertices[v]._id === DeviceResourceGraphValue.buffer) {
            return this._vertices[v]._object as Buffer;
        } else {
            return null;
        }
    }
    tryGetTexture (v: number): Texture | null {
        if (this._vertices[v]._id === DeviceResourceGraphValue.texture) {
            return this._vertices[v]._object as Texture;
        } else {
            return null;
        }
    }

    readonly components: string[] = ['name', 'refCount'];
    readonly _vertices: DeviceResourceGraphVertex[] = [];
    readonly _name: string[] = [];
    readonly _refCounts: number[] = [];
}
