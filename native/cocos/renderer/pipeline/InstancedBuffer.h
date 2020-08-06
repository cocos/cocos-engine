#pragma once

#include "Define.h"

namespace cc {

namespace pipeline {
struct SubModel;
struct Pass;
struct InstancedAttributeBlock;
struct PipelineStateInfo;

struct CC_DLL InstancedItem {
    uint count = 0;
    uint capacity = 0;
    gfx::Buffer *vb = nullptr;
    std::shared_ptr<uint8_t> data;
    uint size = 0;
    gfx::InputAssembler *ia = nullptr;
    uint stride = 0;
};
typedef vector<InstancedItem> InstancedItemList;

class InstancedBuffer : public Object {
public:
    static const uint INITIAL_CAPACITY = 32;
    static const uint MAX_CAPACITY = 1024;
    static InstancedBuffer *get(const Pass *pass);

    InstancedBuffer(const Pass *pass);
    virtual ~InstancedBuffer();

    void destroy();
    void merge(const SubModel *, const InstancedAttributeBlock &, const PipelineStateInfo *);
    void uploadBuffers();
    void clear();

    CC_INLINE const InstancedItemList &getInstances() const { return _instancedItems; }
    CC_INLINE const PipelineStateInfo *getPSOCI() const { return _psoci; }
    CC_INLINE Pass *getPass() const { return _pass; }

private:
    static map<const Pass *, std::shared_ptr<InstancedBuffer>> _buffers;
    InstancedItemList _instancedItems;
    Pass *_pass = nullptr;
    const PipelineStateInfo *_psoci = nullptr;
};

} // namespace pipeline
} // namespace cc
