#pragma once

#include "Define.h"

namespace cc {
namespace pipeline {
struct PassView;
struct SubModelView;

struct CC_DLL BatchedItem {
    gfx::BufferList vbs;
    vector<std::shared_ptr<uint8_t>> vbDatas;

    gfx::Buffer *vbIdx = nullptr;
    std::shared_ptr<float> vbIndexData;

    uint vbCount = 0;
    uint mergeCount = 0;
    gfx::InputAssembler *ia = nullptr;
    gfx::Buffer *ubo = nullptr;
    float *uboData = nullptr;
    gfx::DescriptorSet *descriptorSet = nullptr;
    const PassView *pass = nullptr;
    gfx::Shader *shader = nullptr;
};
typedef vector<BatchedItem> BatchedItemList;

class CC_DLL BatchedBuffer : public Object {
public:
    static std::shared_ptr<BatchedBuffer> &get(const PassView *pass);

    BatchedBuffer(const PassView *pass);
    virtual ~BatchedBuffer();

    void destroy();
    void merge(const SubModelView *, uint passIdx, const RenderObject *);
    void clear();
    void clearUBO();

    CC_INLINE const BatchedItemList &getBatches() const { return _batchedItems; }
    CC_INLINE const PassView *getPass() const { return _pass; }

private:
    static map<const PassView *, std::shared_ptr<BatchedBuffer>> _buffers;
    //    const _localBatched = new UBOLocalBatched();
    BatchedItemList _batchedItems;
    const PassView *_pass = nullptr;
};

} // namespace pipeline
} // namespace cc
