/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"

#include <cassert>
#include "DummyJobGraph.h"

#define DUMMY_GRAPH_NODE_CHUNK_SIZE 64

namespace cc {

namespace {
DummyGraphNode *              freeList{nullptr};
std::vector<DummyGraphNode *> allocatedChunks;
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
    assert(this != other);
    // Run after other
    this->_predecessors.emplace(other);
    other->_successors.emplace(this);
}

void DummyGraphNode::precede(DummyGraphNode *other) {
    // Run before other
    other->succeed(this);
}

void DummyGraphNode::allocChunk() {
    assert(freeList == nullptr);
    freeList = new (std::nothrow) DummyGraphNode[DUMMY_GRAPH_NODE_CHUNK_SIZE]();
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
    auto *p  = freeList;
    freeList = freeList->_next;
    p->reset();
    return p;
}

void DummyGraphNode::free(DummyGraphNode *node) {
    node->_next = freeList;
    freeList    = node;
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

void DummyJobGraph::makeEdge(uint j1, uint j2) {
    _dummyGraph.link(j1, j2);
}

void DummyJobGraph::run() noexcept {
    _dummyGraph.run();
    _dummyGraph.clear();
}

} // namespace cc
