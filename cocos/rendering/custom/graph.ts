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

export const enum directional {
    undirected = 0,
    directed = 1,
    bidirectional = 2,
}

export const enum parallel {
    disallow = 0,
    allow = 1,
}

export const enum traversal {
    none = 0,
    incidence = 1 << 0,
    bidirectional = 1 << 1,
    adjacency = 1 << 2,
    vertex_list = 1 << 3,
    edge_list = 1 << 4,
}

//--------------------------------------------------------------------------
// Vertex
//--------------------------------------------------------------------------
export interface Vertex {
    nullVertex (): Vertex | null;
}

//--------------------------------------------------------------------------
// Vertex Descriptor
//--------------------------------------------------------------------------
export type vertex_descriptor = number | Vertex;

//--------------------------------------------------------------------------
// Edge
//--------------------------------------------------------------------------
export interface Edge {
    getProperty (): unknown;
    source: vertex_descriptor;
    target: vertex_descriptor;
}

//--------------------------------------------------------------------------
// Edge Descriptor
//--------------------------------------------------------------------------
export class ED {
    constructor (source: vertex_descriptor, target: vertex_descriptor) {
        this.source = source;
        this.target = target;
    }
    equals (rhs: ED): boolean {
        return this.source === rhs.source
            && this.target === rhs.target;
    }
    source: vertex_descriptor;
    target: vertex_descriptor;
}

// Edge Descriptor with Property
export class EPD {
    constructor (source: vertex_descriptor, target: vertex_descriptor, edge: Edge) {
        this.source = source;
        this.target = target;
        this.edge = edge;
    }
    equals (rhs: EPD): boolean {
        return this.edge === rhs.edge;
    }
    source: vertex_descriptor;
    target: vertex_descriptor;
    readonly edge: Edge;
}

// Edge Descriptor
export type edge_descriptor = ED | EPD;

//--------------------------------------------------------------------------
// OutEdge
//--------------------------------------------------------------------------
// OutEdge
export class OutE {
    constructor (target: vertex_descriptor) {
        this.target = target;
    }
    equals (rhs: OutE): boolean {
        return this.target === rhs.target;
    }
    target: vertex_descriptor;
}

// OutEdge(Property)
export class OutEP {
    constructor (target: vertex_descriptor, edge: Edge) {
        this.target = target;
        this.edge = edge;
    }
    equals (rhs: OutEP): boolean {
        return this.target === rhs.target;
    }
    getProperty (): unknown {
        return this.edge.getProperty();
    }
    target: vertex_descriptor;
    readonly edge: Edge;
}

//--------------------------------------------------------------------------
// OutEdge Iterator
//--------------------------------------------------------------------------
export class OutEI implements IterableIterator<ED> {
    constructor (iterator: IterableIterator<OutE>, source: vertex_descriptor) {
        this.iterator = iterator;
        this.source = source;
    }
    [Symbol.iterator] (): OutEI {
        return this;
    }
    next (): IteratorResult<ED> {
        const res = this.iterator.next();
        if (res.done) {
            return { value: undefined, done: true };
        } else {
            return { value: new ED(this.source, res.value.target), done: false };
        }
    }
    readonly iterator: IterableIterator<OutE>;
    readonly source: vertex_descriptor;
}

// OutEdge(Property) Iterator
export class OutEPI implements IterableIterator<EPD> {
    constructor (iterator: IterableIterator<OutEP>, source: vertex_descriptor) {
        this.iterator = iterator;
        this.source = source;
    }
    [Symbol.iterator] (): OutEPI {
        return this;
    }
    next (): IteratorResult<EPD> {
        const res = this.iterator.next();
        if (res.done) {
            return { value: undefined, done: true };
        } else {
            return { value: new EPD(this.source, res.value.target, res.value.edge), done: false };
        }
    }
    readonly iterator: IterableIterator<OutEP>;
    readonly source: vertex_descriptor;
}

// OutEdge Iterator
export type out_edge_iterator = OutEI | OutEPI;

//--------------------------------------------------------------------------
// InEdge Iterator
//--------------------------------------------------------------------------
// InEdge Iterator
export class InEI implements IterableIterator<ED> {
    constructor (iterator: IterableIterator<OutE>, source: vertex_descriptor) {
        this.iterator = iterator;
        this.source = source;
    }
    [Symbol.iterator] (): InEI {
        return this;
    }
    next (): IteratorResult<ED> {
        const res = this.iterator.next();
        if (res.done) {
            return { value: undefined, done: true };
        } else {
            return { value: new ED(res.value.target, this.source), done: false };
        }
    }
    readonly iterator: IterableIterator<OutE>;
    readonly source: vertex_descriptor;
}

// InEdge(Property) Iterator
export class InEPI implements IterableIterator<EPD> {
    constructor (iterator: IterableIterator<OutEP>, source: vertex_descriptor) {
        this.iterator = iterator;
        this.source = source;
    }
    [Symbol.iterator] (): InEPI {
        return this;
    }
    next (): IteratorResult<EPD> {
        const res = this.iterator.next();
        if (res.done) {
            return { value: undefined, done: true };
        } else {
            return { value: new EPD(res.value.target, this.source, res.value.edge), done: false };
        }
    }
    readonly iterator: IterableIterator<OutEP>;
    readonly source: vertex_descriptor;
}

// InEdge Iterator
export type in_edge_iterator = InEI | InEPI;

//--------------------------------------------------------------------------
// Graph
//--------------------------------------------------------------------------
export interface Graph {
    readonly directed_category: directional;
    readonly edge_parallel_category: parallel;
    readonly traversal_category: traversal;

    nullVertex (): vertex_descriptor | null;
}

//--------------------------------------------------------------------------
// IncidenceGraph
//--------------------------------------------------------------------------
export interface IncidenceGraph extends Graph {
    edge (u: vertex_descriptor, v: vertex_descriptor): boolean;
    source (e: edge_descriptor): vertex_descriptor;
    target (e: edge_descriptor): vertex_descriptor;
    outEdges (v: vertex_descriptor): out_edge_iterator;
    outDegree (v: vertex_descriptor): number;
}

//--------------------------------------------------------------------------
// BidirectionalGraph
//--------------------------------------------------------------------------
export interface BidirectionalGraph extends IncidenceGraph {
    inEdges (v: vertex_descriptor): in_edge_iterator;
    inDegree (v: vertex_descriptor): number;
    degree (v: vertex_descriptor): number;
}

//--------------------------------------------------------------------------
// AdjacencyGraph
//--------------------------------------------------------------------------
// Adjacency Iterator
export class AdjI implements IterableIterator<vertex_descriptor> {
    constructor (graph: IncidenceGraph, iterator: OutEI) {
        this.graph = graph;
        this.iterator = iterator;
    }
    [Symbol.iterator] (): AdjI {
        return this;
    }
    next (): IteratorResult<vertex_descriptor> {
        const res = this.iterator.next();
        if (res.done) {
            return { value: undefined, done: true };
        } else {
            return { value: this.graph.target(res.value), done: false };
        }
    }
    readonly graph: IncidenceGraph;
    readonly iterator: OutEI;
}

export class AdjPI implements IterableIterator<vertex_descriptor> {
    constructor (graph: IncidenceGraph, iterator: OutEPI) {
        this.graph = graph;
        this.iterator = iterator;
    }
    [Symbol.iterator] (): AdjPI {
        return this;
    }
    next (): IteratorResult<vertex_descriptor> {
        const res = this.iterator.next();
        if (res.done) {
            return { value: undefined, done: true };
        } else {
            return { value: this.graph.target(res.value), done: false };
        }
    }
    readonly graph: IncidenceGraph;
    readonly iterator: OutEPI;
}

// Adjacency Iterator
export type adjacency_iterator = AdjI | AdjPI;

// AdjacencyGraph
export interface AdjacencyGraph extends Graph {
    adjacentVertices (v: vertex_descriptor): adjacency_iterator;
}

//--------------------------------------------------------------------------
// VertexListGraph
//--------------------------------------------------------------------------
export interface VertexListGraph extends Graph {
    vertices (): IterableIterator<vertex_descriptor>;
    numVertices (): number;
}

//--------------------------------------------------------------------------
// EdgeListGraph
//--------------------------------------------------------------------------
export interface EdgeListGraph extends Graph {
    edges (): IterableIterator<edge_descriptor>;
    numEdges (): number;
    source (e: edge_descriptor): vertex_descriptor;
    target (e: edge_descriptor): vertex_descriptor;
}

//--------------------------------------------------------------------------
// MutableGraph
//--------------------------------------------------------------------------
export interface MutableGraph extends Graph {
    addVertex (...args): vertex_descriptor;
    clearVertex (v: vertex_descriptor): void;
    removeVertex (v: vertex_descriptor): void;
    addEdge (u: vertex_descriptor, v: vertex_descriptor, p?: unknown): edge_descriptor | null;
    removeEdges (u: vertex_descriptor, v: vertex_descriptor): void;
    removeEdge (e: edge_descriptor): void;
}

//--------------------------------------------------------------------------
// PropertyMap
//--------------------------------------------------------------------------
export interface PropertyMap {
    get (x: vertex_descriptor | edge_descriptor): unknown;
}

export interface MutableVertexPropertyMap<T> extends PropertyMap {
    put (x: vertex_descriptor, value: T): void;
}

//--------------------------------------------------------------------------
// PropertyGraph
//--------------------------------------------------------------------------
export interface PropertyGraph extends Graph {
    get (tag: string): PropertyMap;
}

//--------------------------------------------------------------------------
// NamedGraph
//--------------------------------------------------------------------------
export interface NamedGraph extends Graph {
    vertexName (v: vertex_descriptor): string;
    vertexNameMap (): PropertyMap;
}

//--------------------------------------------------------------------------
// ComponentGraph
//--------------------------------------------------------------------------
export interface ComponentGraph extends Graph {
    readonly components: string[];
    component (id: number, v: vertex_descriptor): unknown;
    componentMap (id: number): unknown; // should be PropertyMap
}

//--------------------------------------------------------------------------
// PolymorphicGraph
//--------------------------------------------------------------------------
export interface PolymorphicGraph extends Graph {
    holds (id: number, v: vertex_descriptor): boolean;
    id (v: vertex_descriptor): number;
    object (v: vertex_descriptor): unknown;
    value (id: number, v: vertex_descriptor): unknown;
    tryValue(id: number, v: vertex_descriptor): unknown;
    visitVertex (visitor: unknown, v: vertex_descriptor): void;
}

//--------------------------------------------------------------------------
// ReferenceGraph
//--------------------------------------------------------------------------
export type reference_descriptor = ED | EPD;
export type child_iterator = OutEI | OutEPI;
export type parent_iterator = InEI | InEPI;

export interface ReferenceGraph extends Graph {
    reference (u: vertex_descriptor, v: vertex_descriptor): boolean;
    parent (e: reference_descriptor): vertex_descriptor;
    child (e: reference_descriptor): vertex_descriptor;
    parents (v: vertex_descriptor): parent_iterator;
    children (v: vertex_descriptor): child_iterator;
    numParents (v: vertex_descriptor): number;
    numChildren (v: vertex_descriptor): number;
    getParent (v: vertex_descriptor): vertex_descriptor | null;
    isAncestor (ancestor: vertex_descriptor, descendent: vertex_descriptor): boolean;
}

//--------------------------------------------------------------------------
// MutableReferenceGraph
//--------------------------------------------------------------------------
export interface MutableReferenceGraph extends ReferenceGraph {
    addReference (u: vertex_descriptor, v: vertex_descriptor, p?: unknown): reference_descriptor | null;
    removeReference (e: reference_descriptor): void;
    removeReferences (u: vertex_descriptor, v: vertex_descriptor): void;
}

//--------------------------------------------------------------------------
// ParentGraph
//--------------------------------------------------------------------------
export interface ParentGraph extends ReferenceGraph, NamedGraph {
    locateChild (v: vertex_descriptor | null, name: string): vertex_descriptor | null;
}

//--------------------------------------------------------------------------
// AddressableGraph
//--------------------------------------------------------------------------
export interface AddressableGraph extends ParentGraph {
    addressable (absPath: string): boolean;
    locate (absPath: string): vertex_descriptor | null;
    locateRelative (path: string, start?: vertex_descriptor | null): vertex_descriptor | null;
    path (v: vertex_descriptor): string;
}

//--------------------------------------------------------------------------
// UuidGraph
//--------------------------------------------------------------------------
export interface UuidGraph<Key> extends Graph {
    contains (key: Key): boolean;
    vertex (key: Key): vertex_descriptor;
    find (key: Key): vertex_descriptor | null;
}

//--------------------------------------------------------------------------
// Help Functions
//--------------------------------------------------------------------------
export function reindexEdgeList (el: (OutE|OutEP)[], u: number): void {
    for (const e of el) {
        if (e.target as number > u) {
            --(e.target as number);
        }
    }
}

export function removeAllEdgesFromList (edges: Set<Edge>, el: OutEP[], v: vertex_descriptor): void {
    const sz = el.length;
    for (let i = 0; i !== sz; ++i) {
        const oe = el[i];
        if (oe.target === v) {
            // NOTE: Wihtout this skip, this loop will double-delete
            // properties of loop edges. This solution is based on the
            // observation that the incidence edges of a vertex with a loop
            // are adjacent in the out edge list. This *may* actually hold
            // for multisets also.
            const skip = (i + 1 !== sz && oe.edge === el[i + 1].edge);
            edges.delete(oe.edge);
            if (skip) {
                ++i;
            }
        }
    }
}

export function getPath (g: ReferenceGraph & NamedGraph, v: vertex_descriptor | null): string {
    if (v === g.nullVertex()) {
        return '';
    }
    const paths: string[] = [];
    for (; v !== g.nullVertex(); v = g.getParent(v as vertex_descriptor)) {
        paths.push(g.vertexName(v as vertex_descriptor));
    }
    let path = '';
    for (let i = paths.length; i-- > 0;) {
        path += '/';
        path += paths[i];
    }
    return path;
}

export function findRelative (g: ParentGraph, v: vertex_descriptor | null, path: string): vertex_descriptor | null {
    const pseudo = g.nullVertex();
    const names = path.split('/');

    if (names.length === 0) { // empty string
        return v;
    }

    let curr = v;
    let start = 0;
    if (names[0] === '') { // absolute path
        // reset v to pseudo root
        curr = pseudo;
        // skip pseudo root
        ++start;
    }
    // locating begins
    for (let i = start; i !== names.length; ++i) {
        const name = names[i];
        if (name === '') { // empty name, do nothing
            continue;
        }
        if (name === '.') { // current node, do nothing
            continue;
        }
        if (name === '..') { // parent node
            if (curr === pseudo) {
                // current node is pseudo already, return not found
                return pseudo;
            }
            curr = g.getParent(curr as vertex_descriptor);
            continue;
        }
        curr = g.locateChild(curr, name);
        if (curr === pseudo) { // child not found
            return pseudo;
        }
    }
    return curr;
}

//=======================================================================
// DFS
// Based on boost/graph/depth_first_search.hpp
//=======================================================================

//=======================================================================
// Copyright 1997, 1998, 1999, 2000 University of Notre Dame.
// Copyright 2003 Bruce Barr
// Authors: Andrew Lumsdaine, Lie-Quan Lee, Jeremy G. Siek
//
// Distributed under the Boost Software License, Version 1.0. (See
// accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)
//=======================================================================

export interface TerminatorFunc {
    terminate (v: vertex_descriptor, g: IncidenceGraph): boolean;
}

class NoTermination implements TerminatorFunc {
    terminate (v: vertex_descriptor, g: IncidenceGraph): boolean {
        return false;
    }
}

function getDefaultStartingVertex (g: IncidenceGraph & VertexListGraph): vertex_descriptor | null {
    const iter = g.vertices();
    const v = iter.next();
    if (v.done) {
        return g.nullVertex();
    } else {
        return v.value;
    }
}

export interface GraphVisitor {
    // 0. before dfs
    initializeVertex (v: vertex_descriptor, g: IncidenceGraph): void;
    // 1. dfs starting vertex (usually the root)
    startVertex (v: vertex_descriptor, g: IncidenceGraph): void;
    // 2. vertex discovered
    discoverVertex (v: vertex_descriptor, g: IncidenceGraph): void;
    // 3. edge discovered
    examineEdge (e: edge_descriptor, g: IncidenceGraph): void;
    // 4(a). is tree edge
    treeEdge (e: edge_descriptor, g: IncidenceGraph): void;
    // 4(b). is back edge
    backEdge (e: edge_descriptor, g: IncidenceGraph): void;
    // 4(c). is forward or cross edge
    forwardOrCrossEdge (e: edge_descriptor, g: IncidenceGraph): void;
    // 5. edge finished
    finishEdge (e: edge_descriptor, g: IncidenceGraph): void;
    // 6. vertex finished
    finishVertex (v: vertex_descriptor, g: IncidenceGraph): void;
}

export enum GraphColor {
    WHITE,
    GRAY,
    GREEN,
    RED,
    BLACK,
}

class VertexInfo {
    constructor (
        v: vertex_descriptor,
        e: edge_descriptor | null,
        iter: out_edge_iterator | null,
    ) {
        this.v = v;
        this.e = e;
        this.iter = iter;
    }
    v: vertex_descriptor;
    e: edge_descriptor | null;
    iter: out_edge_iterator | null;
}

function depthFirstVisitImpl (
    g: IncidenceGraph,
    u: vertex_descriptor,
    visitor: GraphVisitor,
    color: MutableVertexPropertyMap<GraphColor>,
    func: TerminatorFunc,
): void {
    let srcE: edge_descriptor | null = null;
    let ei: out_edge_iterator | null = null;
    const stack = new Array<VertexInfo>();

    color.put(u, GraphColor.GRAY);
    visitor.discoverVertex(u, g);

    ei = g.outEdges(u);
    if (func.terminate(u, g)) {
        // If this vertex terminates the search, we push empty range
        stack.push(new VertexInfo(u, null, null));
    } else {
        stack.push(new VertexInfo(u, null, ei));
    }

    while (stack.length) {
        const back = stack.pop()!;
        u = back.v;
        srcE = back.e;
        ei = back.iter;
        // finish_edge has to be called here, not after the
        // loop. Think of the pop as the return from a recursive call.
        if (srcE !== null) {
            visitor.finishEdge(srcE, g);
        }
        if (ei) { // has out edges
            for (let ev = ei.next(); !ev.done; ev = ei.next()) {
                const e = ev.value;
                const v = e.target;
                visitor.examineEdge(e, g);
                const vColor = color.get(v);
                if (vColor === GraphColor.WHITE) {
                    visitor.treeEdge(e, g);
                    srcE = e;
                    stack.push(new VertexInfo(u, srcE, ei));
                    u = v;
                    color.put(u, GraphColor.GRAY);
                    visitor.discoverVertex(u, g);
                    ei = g.outEdges(u);
                    if (func.terminate(u, g)) {
                        break;
                    }
                } else {
                    if (vColor === GraphColor.GRAY) {
                        visitor.backEdge(e, g);
                    } else {
                        visitor.forwardOrCrossEdge(e, g);
                    }
                    visitor.finishEdge(e, g);
                }
            }
        }
        color.put(u, GraphColor.BLACK);
        visitor.finishVertex(u, g);
    }
}

export function depthFirstSearch (
    g: IncidenceGraph & VertexListGraph,
    visitor: GraphVisitor,
    color: MutableVertexPropertyMap<GraphColor>,
    startVertex: vertex_descriptor | null = null,
): void {
    // get start vertex
    startVertex = startVertex || getDefaultStartingVertex(g);
    // graph is empty, do nothing
    if (startVertex === null || g.numVertices() === 0) {
        return;
    }
    // initialize vertex and color map
    for (const u of g.vertices()) {
        color.put(u, GraphColor.WHITE);
        visitor.initializeVertex(u, g);
    }
    // start DFS
    const terminator = new NoTermination();
    // try starting from startVertex
    if (startVertex !== getDefaultStartingVertex(g)) {
        visitor.startVertex(startVertex, g);
        depthFirstVisitImpl(g, startVertex, visitor, color, terminator);
    }
    // try starting from each vertex
    for (const u of g.vertices()) {
        // if vertex is not visited, start DFS
        if (color.get(u) === GraphColor.WHITE) {
            visitor.startVertex(u, g);
            depthFirstVisitImpl(g, u, visitor, color, terminator);
        }
    }
}

export function depthFirstVisit (
    g: IncidenceGraph,
    u: vertex_descriptor,
    visitor: GraphVisitor,
    color: MutableVertexPropertyMap<GraphColor>,
    func: TerminatorFunc = new NoTermination(),
): void {
    visitor.startVertex(u, g);
    depthFirstVisitImpl(g, u, visitor, color, func);
}

export class DefaultVisitor implements GraphVisitor {
    initializeVertex (v: vertex_descriptor, g: IncidenceGraph): void {
        // do nothing
    }
    startVertex (v: vertex_descriptor, g: IncidenceGraph): void {
        // do nothing
    }
    discoverVertex (v: vertex_descriptor, g: IncidenceGraph): void {
        // do nothing
    }
    examineEdge (e: edge_descriptor, g: IncidenceGraph): void {
        // do nothing
    }
    treeEdge (e: edge_descriptor, g: IncidenceGraph): void {
        // do nothing
    }
    backEdge (e: edge_descriptor, g: IncidenceGraph): void {
        // do nothing
    }
    forwardOrCrossEdge (e: edge_descriptor, g: IncidenceGraph): void {
        // do nothing
    }
    finishEdge (e: edge_descriptor, g: IncidenceGraph): void {
        // do nothing
    }
    finishVertex (v: vertex_descriptor, g: IncidenceGraph): void {
        // do nothing
    }
}

export class ReferenceGraphView <BaseGraph extends ReferenceGraph & VertexListGraph>
implements IncidenceGraph, VertexListGraph {
    constructor (g: BaseGraph) {
        this.g = g;
        this.directed_category = directional.directed;
        this.edge_parallel_category = parallel.allow;
        this.traversal_category = traversal.incidence | traversal.vertex_list;
    }
    nullVertex (): vertex_descriptor | null {
        return this.g.nullVertex();
    }
    edge (u: vertex_descriptor, v: vertex_descriptor): boolean {
        return this.g.reference(u, v);
    }
    source (e: edge_descriptor): vertex_descriptor {
        return this.g.parent(e);
    }
    target (e: edge_descriptor): vertex_descriptor {
        return this.g.child(e);
    }
    outEdges (v: vertex_descriptor): out_edge_iterator {
        return this.g.children(v);
    }
    outDegree (v: vertex_descriptor): number {
        return this.g.numChildren(v);
    }
    vertices (): IterableIterator<vertex_descriptor> {
        return this.g.vertices();
    }
    numVertices (): number {
        return this.g.numVertices();
    }
    readonly directed_category: directional;
    readonly edge_parallel_category: parallel;
    readonly traversal_category: traversal;
    g: BaseGraph;
}
