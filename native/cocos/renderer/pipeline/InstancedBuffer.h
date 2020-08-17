#pragma once

#include "Define.h"

namespace cc {

namespace pipeline {
struct SubModelView;
struct PassView;
struct InstancedAttributeBlock;
struct PSOInfo;

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
    static std::shared_ptr<InstancedBuffer> &get(const PassView *pass);

    InstancedBuffer(const PassView *pass);
    virtual ~InstancedBuffer();

    void destroy();
    void merge(const SubModelView *, const InstancedAttributeBlock &, uint passIdx);
    void uploadBuffers();
    void clear();

    CC_INLINE const InstancedItemList &getInstances() const { return _instancedItems; }
    CC_INLINE PassView *getPass() const { return _pass; }
    CC_INLINE bool hasPendingModels() const { return _hasPendingModels; }

private:
    static map<const PassView *, std::shared_ptr<InstancedBuffer>> _buffers;
    InstancedItemList _instancedItems;
    PassView *_pass = nullptr;
    bool _hasPendingModels = false;
};

} // namespace pipeline
} // namespace cc
