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

#include "base/std/container/vector.h"
#include "gfx-base/GFXQueryPool.h"

namespace cc {
namespace gfx {

class CCWGPUQueryPoolObject;

class CCWGPUQueryPool final : public QueryPool {
public:
    CCWGPUQueryPool();
    ~CCWGPUQueryPool() override;

    inline CCWGPUQueryPoolObject *gpuQueryPool() const { return _gpuQueryPool; }
    inline uint32_t getIdCount() const { return static_cast<uint32_t>(_ids.size()); }
    inline void clearId() { _ids.clear(); }
    inline void addId(uint32_t id) { _ids.push_back(id); }
    inline uint32_t getId(uint32_t index) const { return _ids[index]; }
    inline std::mutex &getMutex() { return _mutex; }
    inline void setResults(ccstd::unordered_map<uint32_t, uint64_t> &&results) { _results = results; }

protected:
    void doInit(const QueryPoolInfo &info) override;
    void doDestroy() override;

    CCWGPUQueryPoolObject *_gpuQueryPool = nullptr;
    ccstd::vector<uint32_t> _ids;
};

} // namespace gfx
} // namespace cc
