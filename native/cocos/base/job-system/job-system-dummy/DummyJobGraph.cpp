/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "DummyJobGraph.h"
#include "base/Macros.h"

#define DUMMY_GRAPH_NODE_CHUNK_SIZE 64

namespace cc {

namespace {
DummyGraphNode *freeList{nullptr};
ccstd::vector<DummyGraphNode *> allocatedChunks;
} // namespace

DummyGraphNode::~DummyGraphNode() {
    delete _callback;
}

void DummyGraphNode::reset() {
    _successors.clear();
    _predecessors.clear();
    delete _callback;
    _callback = nullptr;
}

void DummyGraphNode::succeed(DummyGraphNode *other) {
    CC_ASSERT_NE(this, other);
    // Run after other
    this->_predecessors.emplace(other);
    other->_successors.emplace(this);
}

void DummyGraphNode::precede(DummyGraphNode *other) {
    // Run before other
    other->succeed(this);
}

void DummyGraphNode::allocChunk() {
    CC_ASSERT_NULL(freeList);
    freeList = ccnew DummyGraphNode[DUMMY_GRAPH_NODE_CHUNK_SIZE]();
    allocatedChunks.emplace_back(freeList);
    for (auto i = 0; i < DUMMY_GRAPH_NODE_CHUNK_SIZE - 1; i++) {
        freeList[i]._next = &freeList[i + 1];
    }
    freeList[DUMMY_GRAPH_NODE_CHUNK_SIZE - 1]._next = nullptr;
}

DummyGraphNode *DummyGraphNode::alloc() {
    if (freeList == nullptr) {
        DummyGraphNode::allocChunk();
    }
    auto *p = freeList;
    freeList = freeList->_next;
    p->reset();
    return p;
}

void DummyGraphNode::free(DummyGraphNode *node) {
    node->_next = freeList;
    freeList = node;
}

void DummyGraphNode::freeAll() {
    for (auto *chunk : allocatedChunks) {
        delete[] chunk;
    }
    allocatedChunks.clear();
}

DummyGraph::~DummyGraph() {
    clear();
}

void DummyGraph::clear() {
    for (auto *node : _nodes) {
        DummyGraphNode::free(node);
    }
    _nodes.clear();
}

void DummyGraph::link(size_t precede, size_t after) {
    _nodes[precede]->precede(_nodes[after]);
}

void DummyGraph::run() {
    for (auto *node : _nodes) {
        if (!excuted(node)) {
            walk(node);
        }
    }
    _generation++;
}

void DummyGraph::walk(DummyGraphNode *node) { //NOLINT(misc-no-recursion)
    for (DummyGraphNode *n : node->_predecessors) {
        if (!excuted(n)) {
            walk(n);
        }
    }
    if (!excuted(node)) {
        node->_callback->execute();
        node->_generation++;
    }

    for (DummyGraphNode *n : node->_successors) {
        if (!excuted(n)) {
            walk(n);
        }
    }
}

bool DummyGraph::excuted(DummyGraphNode *n) const {
    return n->_generation != _generation;
}

void DummyJobGraph::makeEdge(uint32_t j1, uint32_t j2) {
    _dummyGraph.link(j1, j2);
}

void DummyJobGraph::run() noexcept {
    _dummyGraph.run();
    _dummyGraph.clear();
}

} // namespace cc
