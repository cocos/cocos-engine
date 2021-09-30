/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <unordered_set>
#include <vector>
#include "cocos/base/Macros.h"
#include "cocos/base/TypeDef.h"

namespace cc {

class DummyJobSystem;

class DummyGraphNode;
class DummyGraph final {
public:
    DummyGraph()                   = default;
    DummyGraph(const DummyGraph &) = delete;
    DummyGraph(DummyGraph &&)      = delete;
    DummyGraph &operator=(const DummyGraph &) = delete;
    DummyGraph &operator=(DummyGraph &&) = delete;
    ~DummyGraph();

    template <class Fn>
    size_t addNode(Fn &&fn);

    void run();
    void link(size_t precede, size_t after);
    void walk(DummyGraphNode *node);
    void clear();

private:
    bool excuted(DummyGraphNode *n) const;

    int                           _generation{0};
    std::vector<DummyGraphNode *> _nodes;
};

class DummyGraphNodeTaskItf {
public:
    virtual ~DummyGraphNodeTaskItf() = default;
    virtual void execute()           = 0;
};

template <class Fn>
class DummyGraphNodeTaskImpl final : public DummyGraphNodeTaskItf {
public:
    explicit DummyGraphNodeTaskImpl(Fn &&t) noexcept;
    DummyGraphNodeTaskImpl(const DummyGraphNodeTaskImpl &) = delete;
    DummyGraphNodeTaskImpl(DummyGraphNodeTaskImpl &&)      = delete;
    DummyGraphNodeTaskImpl &operator=(const DummyGraphNodeTaskImpl &) = delete;
    DummyGraphNodeTaskImpl &operator=(DummyGraphNodeTaskImpl &&) = delete;
    ~DummyGraphNodeTaskImpl() override                           = default;
    inline void execute() override { _task(); }

private:
    Fn _task;
};

class DummyGraphNode final {
public:
    DummyGraphNode()                       = default;
    DummyGraphNode(const DummyGraphNode &) = delete;
    DummyGraphNode(DummyGraphNode &&)      = delete;
    DummyGraphNode &operator=(const DummyGraphNode &) = delete;
    DummyGraphNode &operator=(DummyGraphNode &&) = delete;
    ~DummyGraphNode();

private:
    static void            allocChunk();
    static DummyGraphNode *alloc();
    static void            free(DummyGraphNode *n);
    static void            freeAll();

    void succeed(DummyGraphNode *other);
    void precede(DummyGraphNode *other);
    void reset();

    DummyGraphNodeTaskItf *              _callback{nullptr};
    std::unordered_set<DummyGraphNode *> _successors{};
    std::unordered_set<DummyGraphNode *> _predecessors{};
    DummyGraphNode *                     _next{nullptr};
    int                                  _generation{0};
    friend class DummyGraph;
};

template <class Fn>
DummyGraphNodeTaskImpl<Fn>::DummyGraphNodeTaskImpl(Fn &&t) noexcept : _task(t) {}

template <class Fn>
size_t DummyGraph::addNode(Fn &&fn) {
    DummyGraphNode *n = DummyGraphNode::alloc();
    n->_callback      = new DummyGraphNodeTaskImpl<Fn>(std::forward<Fn>(fn));
    n->_generation    = _generation;
    _nodes.emplace_back(n);
    return _nodes.size() - 1;
}

// exported declarations

class DummyJobGraph final {
public:
    explicit DummyJobGraph(DummyJobSystem * /*system*/) noexcept {}
    DummyJobGraph(const DummyJobGraph &) = delete;
    DummyJobGraph(DummyJobGraph &&)      = delete;
    DummyJobGraph &operator=(const DummyJobGraph &) = delete;
    DummyJobGraph &operator=(DummyJobGraph &&) = delete;
    ~DummyJobGraph() noexcept                  = default;

    template <typename Function>
    uint createJob(Function &&func) noexcept;

    template <typename Function>
    uint createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept;

    void makeEdge(uint j1, uint j2);

    void run() noexcept;

    inline void waitForAll() { run(); }

private:
    DummyGraph _dummyGraph{};
};

template <typename Function>
uint DummyJobGraph::createJob(Function &&func) noexcept {
    return static_cast<uint>(_dummyGraph.addNode(std::forward<Function>(func)));
}

template <typename Function>
uint DummyJobGraph::createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept {
    return static_cast<uint>(_dummyGraph.addNode([callable = std::forward<Function>(func), first = begin, last = end, step = step]() {
        for (auto i = first; i < last; i += step) {
            callable(i);
        }
    }));
}

} // namespace cc
