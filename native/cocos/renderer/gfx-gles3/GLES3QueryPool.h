/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include <vector>
#include "GLES3Std.h"
#include "gfx-base/GFXQueryPool.h"

namespace cc {
namespace gfx {

class GLES3GPUQueryPool;

class CC_GLES3_API GLES3QueryPool final : public QueryPool {
public:
    GLES3QueryPool();
    ~GLES3QueryPool() override;

    inline GLES3GPUQueryPool *gpuQueryPool() const { return _gpuQueryPool; }
    inline uint32_t           getIdCount() const { return static_cast<uint32_t>(_ids.size()); }
    inline void               clearId() { _ids.clear(); }
    inline void               addId(uint32_t id) { _ids.push_back(id); }
    inline uint32_t           getId(uint32_t index) const { return _ids[index]; }
    inline std::mutex &       getMutex() { return _mutex; }
    inline void               setResults(std::unordered_map<uint32_t, uint64_t> &&results) { _results = results; }

protected:
    friend class GLES3CommandBuffer;

    void doInit(const QueryPoolInfo &info) override;
    void doDestroy() override;

    GLES3GPUQueryPool *   _gpuQueryPool = nullptr;
    std::vector<uint32_t> _ids;
};

} // namespace gfx
} // namespace cc
