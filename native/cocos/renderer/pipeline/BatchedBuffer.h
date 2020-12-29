/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include "Define.h"

namespace cc {
namespace pipeline {
struct PassView;
struct SubModelView;

struct CC_DLL BatchedItem {
    gfx::BufferList vbs;
    vector<uint8_t *> vbDatas;
    gfx::Buffer *indexBuffer = nullptr;
    float *indexData = nullptr;
    uint vbCount = 0;
    uint mergeCount = 0;
    gfx::InputAssembler *ia = nullptr;
    gfx::Buffer *ubo = nullptr;
    std::array<float, UBOLocalBatched::COUNT> uboData;
    gfx::DescriptorSet *descriptorSet = nullptr;
    const PassView *pass = nullptr;
    gfx::Shader *shader = nullptr;
};
typedef vector<BatchedItem> BatchedItemList;
typedef vector<uint> DynamicOffsetList;

class CC_DLL BatchedBuffer : public Object {
public:
    static BatchedBuffer *get(uint pass);
    static BatchedBuffer *get(uint pass, uint extraKey);

    BatchedBuffer(const PassView *pass);
    virtual ~BatchedBuffer();

    void destroy();
    void merge(const SubModelView *, uint passIdx, const ModelView *);
    void clear();
    void setDynamicOffset(uint idx, uint value);

    CC_INLINE const BatchedItemList &getBatches() const { return _batches; }
    CC_INLINE const PassView *getPass() const { return _pass; }
    CC_INLINE const DynamicOffsetList &getDynamicOffset() const { return _dynamicOffsets; }

private:
    static map<uint, map<uint, BatchedBuffer *>> _buffers;
    DynamicOffsetList _dynamicOffsets;
    BatchedItemList _batches;
    const PassView *_pass = nullptr;
    gfx::Device *_device = nullptr;
};

} // namespace pipeline
} // namespace cc
