#pragma once

#include "Define.h"

namespace cc {
namespace pipeline {
struct Pass;
struct SubModel;
struct PSOInfo;

struct CC_DLL BatchedItem {
    gfx::BufferList vbs;
    vector<uint8_t *> vbDatas;
    gfx::Buffer *vbIdx = nullptr;
    float *vbIdxData = nullptr;
    uint vbCount = 0;
    uint mergCount = 0;
    gfx::InputAssembler *ia = nullptr;
    gfx::Buffer *ubo = nullptr;
    float *uboData = nullptr;
    PSOInfo *psoci = nullptr;
};
typedef vector<BatchedItem> BatchedItemList;

class CC_DLL BatchedBuffer : public Object {
public:
    static std::shared_ptr<BatchedBuffer> &get(const Pass *pass);

    BatchedBuffer(const Pass *pass);
    virtual ~BatchedBuffer();

    void destroy();
    void merge(const SubModel *, uint passIdx, const RenderObject *);
    void clear();
    void clearUBO();

    CC_INLINE const BatchedItemList &getBaches() const { return _batchedItems; }
    CC_INLINE const Pass *getPass() const { return _pass; }

private:
    static map<const Pass *, std::shared_ptr<BatchedBuffer>> _buffers;
    //    const _localBatched = new UBOLocalBatched();
    BatchedItemList _batchedItems;
    const Pass *_pass = nullptr;
};

} // namespace pipeline
} // namespace cc
