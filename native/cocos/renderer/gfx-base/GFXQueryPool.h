/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <cstdint>
#include <mutex>
#include "GFXObject.h"
#include "base/std/container/unordered_map.h"

namespace cc {
namespace gfx {

/**
 * QueryPool usage:
 * Update
 * Render
 *  getQueryPoolResults
 *  resetQueryPool
 *  for each renderObject
 *      beginQuery
 *          drawObject
 *      endQuery
 *  completeQueryPool
 */

class CC_DLL QueryPool : public GFXObject {
public:
    QueryPool();
    ~QueryPool() override;

    void initialize(const QueryPoolInfo &info);
    void destroy();

    inline bool hasResult(uint32_t id) { return _results.count(id) != 0; }
    inline uint64_t getResult(uint32_t id) { return _results[id]; }
    inline QueryType getType() const { return _type; }
    inline uint32_t getMaxQueryObjects() const { return _maxQueryObjects; }
    inline bool getForceWait() const { return _forceWait; }

protected:
    virtual void doInit(const QueryPoolInfo &info) = 0;
    virtual void doDestroy() = 0;

    QueryType _type{QueryType::OCCLUSION};
    uint32_t _maxQueryObjects{0};
    bool _forceWait{true};
    std::mutex _mutex;
    ccstd::unordered_map<uint32_t, uint64_t> _results;
};

} // namespace gfx
} // namespace cc
