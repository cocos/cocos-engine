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

class CC_DLL BatchedBuffer : public Object {
public:
    static BatchedBuffer *get(const PassView *pass);

    BatchedBuffer(const PassView *pass);
    virtual ~BatchedBuffer();

    void destroy();
    void merge(const SubModelView *, uint passIdx, const RenderObject *);
    void clear();

    CC_INLINE const BatchedItemList &getBatches() const { return _batches; }
    CC_INLINE const PassView *getPass() const { return _pass; }

private:
    static map<const PassView *, BatchedBuffer *> _buffers;
    BatchedItemList _batches;
    const PassView *_pass = nullptr;
    gfx::Device *_device = nullptr;
};

} // namespace pipeline
} // namespace cc
