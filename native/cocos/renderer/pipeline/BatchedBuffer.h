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

#include <array>
#include "Define.h"
#include "scene/Model.h"
#include "scene/Pass.h"
#include "scene/SubModel.h"

namespace cc {
namespace pipeline {

struct CC_DLL BatchedItem {
    gfx::BufferList                           vbs;
    vector<uint8_t *>                         vbDatas;
    gfx::Buffer *                             indexBuffer = nullptr;
    float *                                   indexData   = nullptr;
    uint                                      vbCount     = 0;
    uint                                      mergeCount  = 0;
    gfx::InputAssembler *                     ia          = nullptr;
    gfx::Buffer *                             ubo         = nullptr;
    std::array<float, UBOLocalBatched::COUNT> uboData;
    gfx::DescriptorSet *                      descriptorSet = nullptr;
    const scene::Pass *                       pass          = nullptr;
    gfx::Shader *                             shader        = nullptr;
};
using BatchedItemList   = vector<BatchedItem>;
using DynamicOffsetList = vector<uint>;

class CC_DLL BatchedBuffer : public Object {
public:
    static BatchedBuffer *get(scene::Pass *pass);
    static BatchedBuffer *get(scene::Pass *pass, uint extraKey);
    static void           destroyBatchedBuffer();

    explicit BatchedBuffer(const scene::Pass *pass);
    ~BatchedBuffer() override;

    void destroy();
    void merge(const scene::SubModel *, uint passIdx, const scene::Model *);
    void clear();
    void setDynamicOffset(uint idx, uint value);

    inline const BatchedItemList &getBatches() const { return _batches; }
    inline const scene::Pass *getPass() const { return _pass; }
    inline const DynamicOffsetList &getDynamicOffset() const { return _dynamicOffsets; }

private:
    static map<scene::Pass *, map<uint, BatchedBuffer *>> buffers;
    DynamicOffsetList                                     _dynamicOffsets;
    BatchedItemList                                       _batches;
    const scene::Pass *                                   _pass   = nullptr;
    gfx::Device *                                         _device = nullptr;
};

} // namespace pipeline
} // namespace cc
