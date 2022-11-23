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

#pragma once

#include "Define.h"
#include "base/RefCounted.h"
#include "base/std/container/array.h"
#include "base/std/container/unordered_map.h"

namespace cc {
namespace scene {
class Pass;
class Model;
class SubModel;
} // namespace scene
namespace pipeline {

struct CC_DLL BatchedItem {
    gfx::BufferList vbs;
    ccstd::vector<uint8_t *> vbDatas;
    gfx::Buffer *indexBuffer = nullptr;
    float *indexData = nullptr;
    uint32_t vbCount = 0;
    uint32_t mergeCount = 0;
    gfx::InputAssembler *ia = nullptr;
    gfx::Buffer *ubo = nullptr;
    ccstd::array<float, UBOLocalBatched::COUNT> uboData;
    gfx::DescriptorSet *descriptorSet = nullptr;
    const scene::Pass *pass = nullptr;
    gfx::Shader *shader = nullptr;
};
using BatchedItemList = ccstd::vector<BatchedItem>;
using DynamicOffsetList = ccstd::vector<uint32_t>;

class CC_DLL BatchedBuffer : public RefCounted {
public:
    explicit BatchedBuffer(const scene::Pass *pass);
    ~BatchedBuffer() override;

    void destroy();
    void merge(const scene::SubModel *, uint32_t passIdx, const scene::Model *);
    void clear();
    void setDynamicOffset(uint32_t idx, uint32_t value);

    inline const BatchedItemList &getBatches() const { return _batches; }
    inline const scene::Pass *getPass() const { return _pass; }
    inline const DynamicOffsetList &getDynamicOffset() const { return _dynamicOffsets; }

private:
    DynamicOffsetList _dynamicOffsets;
    BatchedItemList _batches;
    // weak reference
    const scene::Pass *_pass{nullptr};
    // weak reference
    gfx::Device *_device{nullptr};
};

} // namespace pipeline
} // namespace cc
